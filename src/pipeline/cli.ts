#!/usr/bin/env npx tsx
/**
 * CLI entry point for the community ingestion pipeline.
 *
 * Usage:
 *   npx tsx src/pipeline/cli.ts                     # Full pipeline run
 *   npx tsx src/pipeline/cli.ts --skip-discovery     # Skip web crawling
 *   npx tsx src/pipeline/cli.ts --skip-geocoding     # Skip geocoding API calls
 *   npx tsx src/pipeline/cli.ts --builders lennar,toll-brothers  # Specific builders
 *   npx tsx src/pipeline/cli.ts --max-pages 20       # Limit pages to parse
 *   npx tsx src/pipeline/cli.ts --dry-run            # Show what would happen
 */

import { Pipeline } from "./pipeline";
import { logger } from "./utils/logger";

function parseArgs(args: string[]) {
  const options: {
    skipDiscovery: boolean;
    skipGeocoding: boolean;
    builderSlugs?: string[];
    maxPages?: number;
    dryRun: boolean;
  } = {
    skipDiscovery: false,
    skipGeocoding: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--skip-discovery":
        options.skipDiscovery = true;
        break;
      case "--skip-geocoding":
        options.skipGeocoding = true;
        break;
      case "--builders":
        if (args[i + 1]) {
          options.builderSlugs = args[i + 1].split(",").map((s) => s.trim());
          i++;
        }
        break;
      case "--max-pages":
        if (args[i + 1]) {
          options.maxPages = parseInt(args[i + 1], 10);
          i++;
        }
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Colorado New Build Navigator — Community Ingestion Pipeline

Usage:
  npx tsx src/pipeline/cli.ts [options]

Options:
  --skip-discovery     Skip web crawling, use cached discovery results
  --skip-geocoding     Skip geocoding API calls
  --builders <slugs>   Comma-separated builder slugs to process
  --max-pages <n>      Maximum number of pages to parse
  --dry-run            Show configuration and exit
  --help, -h           Show this help message
        `);
        process.exit(0);
    }
  }

  return options;
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  logger.info("cli", "Colorado New Build Navigator — Ingestion Pipeline");
  logger.info("cli", `Options: ${JSON.stringify(options)}`);

  if (options.dryRun) {
    logger.info("cli", "Dry run — exiting without running pipeline");
    return;
  }

  const pipeline = new Pipeline();

  try {
    const result = await pipeline.run({
      skipDiscovery: options.skipDiscovery,
      skipGeocoding: options.skipGeocoding,
      builderSlugs: options.builderSlugs,
      maxPages: options.maxPages,
    });

    console.log("\n📊 Pipeline Results:");
    console.log(`   Discovered:     ${result.total_discovered}`);
    console.log(`   Parsed:         ${result.total_parsed}`);
    console.log(`   Normalized:     ${result.total_normalized}`);
    console.log(`   Geocoded:       ${result.total_geocoded}`);
    console.log(`   Within radius:  ${result.total_within_radius}`);
    console.log(`   After dedupe:   ${result.total_after_dedupe}`);
    console.log(`   Auto-approved:  ${result.total_auto_approved}`);
    console.log(`   Needs review:   ${result.total_needs_review}`);
    console.log(`   Errors:         ${result.errors.length}`);
    console.log(`   Duration:       ${(result.duration_ms / 1000).toFixed(1)}s`);

    if (result.errors.length > 0) {
      console.log("\n⚠️  Errors:");
      result.errors.forEach((e) => console.log(`   - ${e}`));
    }

    console.log("\n✅ Output written to src/pipeline/data/");
  } catch (err) {
    logger.error("cli", "Pipeline failed", err);
    process.exit(1);
  }
}

main();
