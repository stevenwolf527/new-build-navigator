import { pipelineConfig } from "../config/pipeline.config";
import { logger } from "./logger";

/**
 * Rate-limited, polite HTTP fetcher with retry logic.
 */

let lastRequestTime = 0;

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  const delay = pipelineConfig.request_delay_ms;

  if (elapsed < delay) {
    const waitMs = delay - elapsed;
    logger.debug("http", `Rate limiting: waiting ${waitMs}ms`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  lastRequestTime = Date.now();
}

export async function fetchPage(
  url: string,
  options: { retries?: number } = {}
): Promise<{ html: string; status: number; url: string } | null> {
  const maxRetries = options.retries ?? pipelineConfig.max_retries;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await waitForRateLimit();

      logger.debug("http", `Fetching: ${url} (attempt ${attempt + 1})`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": pipelineConfig.user_agent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          logger.warn("http", `Got ${response.status} for ${url}, retrying...`);
          await new Promise((r) =>
            setTimeout(r, pipelineConfig.retry_delay_ms * (attempt + 1))
          );
          continue;
        }
        logger.warn("http", `Got ${response.status} for ${url}`);
        return null;
      }

      const html = await response.text();
      return { html, status: response.status, url: response.url };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.warn("http", `Fetch error for ${url}: ${message}`);

      if (attempt < maxRetries) {
        await new Promise((r) =>
          setTimeout(r, pipelineConfig.retry_delay_ms * (attempt + 1))
        );
      }
    }
  }

  logger.error("http", `Failed to fetch ${url} after ${maxRetries + 1} attempts`);
  return null;
}

/**
 * Check robots.txt for a given URL.
 * Returns true if we are allowed to fetch the path.
 */
const robotsCache = new Map<string, string>();

export async function isAllowedByRobots(url: string): Promise<boolean> {
  if (!pipelineConfig.respect_robots_txt) return true;

  try {
    const parsed = new URL(url);
    const robotsUrl = `${parsed.protocol}//${parsed.host}/robots.txt`;

    if (!robotsCache.has(parsed.host)) {
      const response = await fetch(robotsUrl, {
        headers: { "User-Agent": pipelineConfig.user_agent },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        robotsCache.set(parsed.host, await response.text());
      } else {
        robotsCache.set(parsed.host, "");
      }
    }

    const robotsTxt = robotsCache.get(parsed.host) || "";
    if (!robotsTxt) return true;

    // Simple robots.txt parser — checks User-agent: * rules
    const lines = robotsTxt.split("\n");
    let inWildcardBlock = false;
    const disallowed: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.startsWith("user-agent:")) {
        const agent = trimmed.replace("user-agent:", "").trim();
        inWildcardBlock = agent === "*";
      } else if (inWildcardBlock && trimmed.startsWith("disallow:")) {
        const path = trimmed.replace("disallow:", "").trim();
        if (path) disallowed.push(path);
      }
    }

    const urlPath = parsed.pathname;
    return !disallowed.some(
      (d) => urlPath === d || urlPath.startsWith(d)
    );
  } catch {
    return true; // Allow on error
  }
}
