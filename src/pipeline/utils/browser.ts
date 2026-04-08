/**
 * Browser-based page fetcher using Playwright.
 * Used for JS-rendered builder sites (SPAs) where plain fetch returns empty shells.
 * Falls back to standard fetch for sites that serve static HTML.
 */

import { chromium, Browser, BrowserContext } from "playwright";
import { pipelineConfig } from "../config/pipeline.config";
import { logger } from "./logger";

let browser: Browser | null = null;
let context: BrowserContext | null = null;

/**
 * Launch shared browser instance (reused across all fetches).
 */
export async function launchBrowser(): Promise<void> {
  if (browser) return;

  logger.info("browser", "Launching headless Chromium");
  browser = await chromium.launch({
    headless: true,
  });
  context = await browser.newContext({
    userAgent: pipelineConfig.user_agent,
    viewport: { width: 1280, height: 800 },
  });
}

/**
 * Close the shared browser instance.
 */
export async function closeBrowser(): Promise<void> {
  if (context) {
    await context.close();
    context = null;
  }
  if (browser) {
    await browser.close();
    browser = null;
  }
  logger.info("browser", "Browser closed");
}

/**
 * Fetch a page using headless Chromium.
 * Waits for network idle and content to render.
 * Returns rendered HTML (full DOM after JS execution).
 */
export async function fetchPageWithBrowser(
  url: string
): Promise<{ html: string; status: number; url: string } | null> {
  if (!context) {
    await launchBrowser();
  }

  try {
    const page = await context!.newPage();

    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      if (!response) {
        logger.warn("browser", `No response from ${url}`);
        return null;
      }

      const status = response.status();
      if (status >= 400) {
        logger.warn("browser", `Got ${status} for ${url}`);
        return null;
      }

      // Wait for content to render — either network idle or a short timeout
      await Promise.race([
        page.waitForLoadState("networkidle").catch(() => {}),
        new Promise((r) => setTimeout(r, 8000)),
      ]);

      // Extra wait for lazy-loaded content
      await page.waitForTimeout(1500);

      const html = await page.content();
      const finalUrl = page.url();

      return { html, status, url: finalUrl };
    } finally {
      await page.close();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn("browser", `Browser fetch error for ${url}: ${msg}`);
    return null;
  }
}
