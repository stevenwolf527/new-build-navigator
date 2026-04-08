import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { CommunityRecord, RawCommunityRecord, PipelineResult } from "../types";
import { pipelineConfig } from "../config/pipeline.config";
import { logger } from "../utils/logger";

export class ExportService {
  private get outputDir(): string {
    return pipelineConfig.output_dir;
  }

  async exportCommunities(records: CommunityRecord[]): Promise<void> {
    const dir = join(this.outputDir, "final");
    await this.ensureDir(dir);
    await this.writeJson(join(dir, "communities.json"), records);
    logger.info("export", `Exported ${records.length} communities`);
  }

  async exportForReview(records: CommunityRecord[]): Promise<void> {
    const dir = join(this.outputDir, "review");
    await this.ensureDir(dir);
    await this.writeJson(join(dir, "needs_review.json"), records);
    logger.info("export", `Exported ${records.length} records for review`);
  }

  async exportRaw(records: RawCommunityRecord[]): Promise<void> {
    const dir = join(this.outputDir, "raw");
    await this.ensureDir(dir);
    await this.writeJson(join(dir, "raw_records.json"), records);
    logger.info("export", `Exported ${records.length} raw records`);
  }

  async exportSummary(result: PipelineResult): Promise<void> {
    const dir = join(this.outputDir, "final");
    await this.ensureDir(dir);

    const summary = {
      generated_at: new Date().toISOString(),
      total_discovered: result.total_discovered,
      total_parsed: result.total_parsed,
      total_normalized: result.total_normalized,
      total_geocoded: result.total_geocoded,
      total_within_radius: result.total_within_radius,
      total_after_dedupe: result.total_after_dedupe,
      total_auto_approved: result.total_auto_approved,
      total_needs_review: result.total_needs_review,
      duration_ms: result.duration_ms,
      errors: result.errors,
    };

    await this.writeJson(join(dir, "summary.json"), summary);
    logger.info("export", "Exported pipeline summary");
  }

  async exportReviewCsv(records: CommunityRecord[]): Promise<void> {
    const dir = join(this.outputDir, "review");
    await this.ensureDir(dir);

    const headers = [
      "id",
      "community_name",
      "builder_name",
      "city",
      "state",
      "street_address",
      "latitude",
      "longitude",
      "distance_from_denver_miles",
      "price_from",
      "price_to",
      "extraction_confidence",
      "review_status",
      "source_url",
      "missing_fields",
      "review_notes",
    ];

    const rows: string[] = [headers.join(",")];

    for (const record of records) {
      const values = headers.map((h) => {
        const val = record[h as keyof CommunityRecord];
        if (val == null) return "";
        const str = Array.isArray(val) ? val.join("; ") : String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      rows.push(values.join(","));
    }

    await writeFile(join(dir, "review.csv"), rows.join("\n"), "utf-8");
    logger.info("export", `Exported ${records.length} records to CSV`);
  }

  private async ensureDir(dir: string): Promise<void> {
    await mkdir(dir, { recursive: true });
  }

  private async writeJson(filePath: string, data: unknown): Promise<void> {
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}
