/**
 * Main pipeline orchestrator.
 * Coordinates discovery → parsing → normalization → geocoding → dedupe → export.
 */

import { DiscoveryService } from "./discovery/discovery.service";
import { ParserRegistry } from "./parsers/parser.registry";
import { NormalizerService } from "./normalizers/normalizer.service";
import { GeocodingService } from "./geocoding/geocoding.service";
import { DedupeService } from "./dedupe/dedupe.service";
import { ExportService } from "./export/export.service";
import { builderSeeds } from "./config/builders.seed";
import { logger } from "./utils/logger";
import { fetchPage } from "./utils/http";
import {
  launchBrowser,
  closeBrowser,
  fetchPageWithBrowser,
} from "./utils/browser";
import {
  CommunityRecord,
  RawCommunityRecord,
  DiscoveryResult,
  PipelineResult,
} from "./types";

export class Pipeline {
  private discovery: DiscoveryService;
  private parser: ParserRegistry;
  private normalizer: NormalizerService;
  private geocoding: GeocodingService;
  private dedupe: DedupeService;
  private exporter: ExportService;

  constructor() {
    this.discovery = new DiscoveryService();
    this.parser = new ParserRegistry();
    this.normalizer = new NormalizerService();
    this.geocoding = new GeocodingService();
    this.dedupe = new DedupeService();
    this.exporter = new ExportService();
  }

  async run(options?: {
    skipDiscovery?: boolean;
    skipGeocoding?: boolean;
    builderSlugs?: string[];
    maxPages?: number;
  }): Promise<PipelineResult> {
    const startTime = Date.now();
    const errors: string[] = [];

    logger.info("pipeline", "=== Starting Community Ingestion Pipeline ===");

    // ── Step 1: Discovery ──────────────────────────────────────────────
    logger.info("pipeline", "Step 1: Discovery");

    let discoveryResults: DiscoveryResult[];
    if (options?.skipDiscovery) {
      logger.info("pipeline", "Skipping discovery (using cached results)");
      discoveryResults = [];
    } else {
      const activeBuilders = options?.builderSlugs
        ? builderSeeds.filter(
            (b) => b.active && options.builderSlugs!.includes(b.slug)
          )
        : builderSeeds.filter((b) => b.active);

      logger.info(
        "pipeline",
        `Discovering from ${activeBuilders.length} builders`
      );

      discoveryResults = await this.discovery.discoverAll();

      if (options?.maxPages) {
        discoveryResults = discoveryResults.slice(0, options.maxPages);
      }
    }

    logger.info(
      "pipeline",
      `Discovered ${discoveryResults.length} candidate pages`
    );

    // ── Step 2: Parsing ────────────────────────────────────────────────
    logger.info("pipeline", "Step 2: Parsing candidate pages");

    const rawRecords: RawCommunityRecord[] = [];
    const MIN_HTML_LENGTH = 2000; // Below this, content is likely a JS shell
    let browserLaunched = false;
    let browserFetchCount = 0;

    for (const result of discoveryResults) {
      try {
        // Try plain fetch first (fast, no browser overhead)
        let html: string | null = null;
        const pageResponse = await fetchPage(result.url);

        if (pageResponse && pageResponse.html.length >= MIN_HTML_LENGTH) {
          html = pageResponse.html;
        } else {
          // Plain fetch returned empty/short HTML — try browser rendering
          if (!browserLaunched) {
            await launchBrowser();
            browserLaunched = true;
          }

          const shortReason = pageResponse
            ? `HTML too short (${pageResponse.html.length} chars)`
            : "fetch failed";
          logger.info(
            "pipeline",
            `Browser fallback for ${result.url} (${shortReason})`
          );

          const browserResponse = await fetchPageWithBrowser(result.url);
          if (browserResponse && browserResponse.html.length >= MIN_HTML_LENGTH) {
            html = browserResponse.html;
            browserFetchCount++;
          } else {
            const len = browserResponse?.html.length ?? 0;
            logger.warn(
              "pipeline",
              `Skipping ${result.url}: even browser rendering returned insufficient content (${len} chars)`
            );
            continue;
          }
        }

        const parseResult = await this.parser.parse(result.url, html);
        if (parseResult.success && parseResult.record) {
          rawRecords.push(parseResult.record);
        }
        if (parseResult.warnings.length > 0) {
          logger.warn(
            "pipeline",
            `Warnings parsing ${result.url}: ${parseResult.warnings.join(", ")}`
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Parse error for ${result.url}: ${msg}`);
        logger.error("pipeline", `Parse error for ${result.url}`, msg);
      }
    }

    if (browserLaunched) {
      await closeBrowser();
      logger.info(
        "pipeline",
        `Browser rendered ${browserFetchCount} pages`
      );
    }

    logger.info("pipeline", `Parsed ${rawRecords.length} raw records`);

    // ── Step 3: Normalization ──────────────────────────────────────────
    logger.info("pipeline", "Step 3: Normalizing records");

    const normalizedRecords: CommunityRecord[] = rawRecords.map((raw) => {
      try {
        return this.normalizer.normalize(raw);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Normalize error: ${msg}`);
        logger.error("pipeline", `Normalize error`, msg);
        return this.normalizer.normalize(raw); // Will use fallbacks
      }
    });

    logger.info(
      "pipeline",
      `Normalized ${normalizedRecords.length} records`
    );

    // ── Step 4: Geocoding & radius filter ──────────────────────────────
    logger.info("pipeline", "Step 4: Geocoding and radius filtering");

    let geocodedRecords: CommunityRecord[];

    if (options?.skipGeocoding) {
      logger.info("pipeline", "Skipping geocoding");
      geocodedRecords = this.geocoding.calculateDistances(normalizedRecords);
    } else {
      geocodedRecords = [];
      for (const record of normalizedRecords) {
        try {
          const geocoded = await this.geocoding.geocodeRecord(record);
          geocodedRecords.push(geocoded);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Geocoding error for ${record.community_name}: ${msg}`);
          logger.error("pipeline", `Geocoding error`, msg);
          geocodedRecords.push(record);
        }
      }
      geocodedRecords = this.geocoding.calculateDistances(geocodedRecords);
    }

    const withinRadius = this.geocoding.filterByRadius(geocodedRecords);
    // Keep records outside radius but flag them
    const outsideRadius = geocodedRecords.filter(
      (r) => !withinRadius.includes(r)
    );

    logger.info(
      "pipeline",
      `${withinRadius.length} within radius, ${outsideRadius.length} outside`
    );

    // ── Step 5: Deduplication ──────────────────────────────────────────
    logger.info("pipeline", "Step 5: Deduplicating");

    const dupeMatches = this.dedupe.findDuplicates(withinRadius);
    const deduped = this.dedupe.mergeRecords(withinRadius, dupeMatches);

    logger.info(
      "pipeline",
      `${deduped.length} records after deduplication (${dupeMatches.length} duplicates found)`
    );

    // ── Step 6: Export ─────────────────────────────────────────────────
    logger.info("pipeline", "Step 6: Exporting results");

    const approved = deduped.filter(
      (r) => r.review_status === "auto_approved"
    );
    const needsReview = deduped.filter(
      (r) => r.review_status !== "auto_approved"
    );

    const result: PipelineResult = {
      total_discovered: discoveryResults.length,
      total_parsed: rawRecords.length,
      total_normalized: normalizedRecords.length,
      total_geocoded: geocodedRecords.length,
      total_within_radius: withinRadius.length,
      total_after_dedupe: deduped.length,
      total_auto_approved: approved.length,
      total_needs_review: needsReview.length,
      errors,
      duration_ms: Date.now() - startTime,
    };

    await this.exporter.exportRaw(rawRecords);
    await this.exporter.exportCommunities(approved);
    await this.exporter.exportForReview(needsReview);
    await this.exporter.exportReviewCsv(needsReview);
    await this.exporter.exportSummary(result);

    logger.info("pipeline", "=== Pipeline Complete ===");
    logger.info("pipeline", `Duration: ${result.duration_ms}ms`);
    logger.info("pipeline", `Auto-approved: ${result.total_auto_approved}`);
    logger.info("pipeline", `Needs review: ${result.total_needs_review}`);
    logger.info("pipeline", `Errors: ${result.errors.length}`);

    return result;
  }
}
