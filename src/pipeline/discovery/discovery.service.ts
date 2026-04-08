import { BuilderSeed, DiscoveryResult } from "../types";
import { fetchPage, isAllowedByRobots } from "../utils/http";
import { extractLinks, extractTitle, extractMeta } from "../utils/text";
import { logger } from "../utils/logger";
import { pipelineConfig } from "../config/pipeline.config";
import { builderSeeds } from "../config/builders.seed";

const COMMUNITY_URL_KEYWORDS = [
  "community",
  "communities",
  "neighborhood",
  "new-homes",
  "new-home",
  "newhomes",
  "floorplan",
  "floor-plan",
  "masterplan",
  "subdivision",
];

export class DiscoveryService {
  async discoverFromBuilder(builder: BuilderSeed): Promise<DiscoveryResult[]> {
    const results: DiscoveryResult[] = [];

    logger.info("discovery", `Starting discovery for: ${builder.name}`);

    for (const baseUrl of builder.base_urls) {
      try {
        const allowed = await isAllowedByRobots(baseUrl);
        if (!allowed) {
          logger.warn("discovery", `Blocked by robots.txt: ${baseUrl}`);
          continue;
        }

        logger.info("discovery", `Fetching ${baseUrl}`);
        const response = await fetchPage(baseUrl);

        if (!response) {
          logger.warn("discovery", `No response from ${baseUrl}`);
          continue;
        }

        const allLinks = extractLinks(response.html, baseUrl);
        logger.info(
          "discovery",
          `Found ${allLinks.length} links on ${baseUrl}`
        );

        const communityUrls = this.filterCommunityUrls(allLinks, builder);

        logger.info(
          "discovery",
          `${communityUrls.length} community URLs matched for ${builder.name}`
        );

        for (const url of communityUrls) {
          if (results.some((r) => r.url === url)) continue;

          results.push({
            url,
            domain: builder.domain,
            builder_slug: builder.slug,
            discovery_method: "seed_crawl",
            discovered_at: new Date().toISOString(),
            page_title: null,
            meta_description: null,
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("discovery", `Error for ${baseUrl}: ${message}`);
      }
    }

    logger.info(
      "discovery",
      `Completed ${builder.name}: ${results.length} URLs found`
    );

    return results;
  }

  async discoverAll(): Promise<DiscoveryResult[]> {
    const activeBuilders = builderSeeds.filter((b) => b.active);
    const allResults: DiscoveryResult[] = [];

    logger.info(
      "discovery",
      `Running discovery for ${activeBuilders.length} builders`
    );

    const concurrency = pipelineConfig.max_concurrent_requests;

    for (let i = 0; i < activeBuilders.length; i += concurrency) {
      const batch = activeBuilders.slice(i, i + concurrency);

      const batchResults = await Promise.allSettled(
        batch.map((builder) => this.discoverFromBuilder(builder))
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          allResults.push(...result.value);
        } else {
          logger.error("discovery", `Batch item failed: ${result.reason}`);
        }
      }

      if (i + concurrency < activeBuilders.length) {
        await new Promise((r) =>
          setTimeout(r, pipelineConfig.request_delay_ms)
        );
      }
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const deduped = allResults.filter((r) => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    logger.info(
      "discovery",
      `Done. ${deduped.length} unique URLs (${allResults.length} before dedup)`
    );

    return deduped;
  }

  private filterCommunityUrls(
    urls: string[],
    builder: BuilderSeed
  ): string[] {
    return urls.filter((url) => {
      try {
        const hostname = new URL(url).hostname;
        if (!hostname.includes(builder.domain)) return false;
      } catch {
        return false;
      }

      // Check builder-specific patterns (strings used as regex)
      for (const pattern of builder.community_url_patterns) {
        if (new RegExp(pattern).test(url)) return true;
      }

      return this.looksLikeCommunityPage(url);
    });
  }

  private looksLikeCommunityPage(url: string): boolean {
    const lower = url.toLowerCase();
    return COMMUNITY_URL_KEYWORDS.some((kw) => lower.includes(kw));
  }
}
