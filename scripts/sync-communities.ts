/**
 * Sync script: reads pipeline output and writes frontend-compatible JSON.
 *
 * Transforms CommunityRecord (pipeline snake_case) → Community (frontend camelCase).
 * Groups by community name + city so multiple builder records merge into one community.
 *
 * Usage: npx tsx scripts/sync-communities.ts
 */

import * as fs from "fs";
import * as path from "path";

const PIPELINE_INPUT = path.resolve(__dirname, "../src/pipeline/data/final/communities.json");
const FRONTEND_OUTPUT = path.resolve(__dirname, "../src/data/pipeline-communities.json");
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

interface PipelineRecord {
  id: string;
  slug: string;
  builder_name: string;
  community_name: string;
  city: string;
  state: string;
  price_from: number | null;
  price_to: number | null;
  home_types: string[];
  hoa_fee: number | null;
  hoa_period: string | null;
  status: string;
  community_description: string | null;
  amenities: string[];
  school_info: string | null;
  image_urls: string[];
  featured_image_url: string | null;
  review_status: string;
  extraction_confidence: number;
  [key: string]: unknown;
}

interface FrontendCommunity {
  id: string;
  slug: string;
  name: string;
  city: string;
  area: string;
  builders: string[];
  priceRange: { min: number; max: number };
  status: "active" | "coming-soon" | "sold-out";
  hoa: { monthly: number; includes: string[] } | null;
  homeTypes: string[];
  shortDescription: string;
  longDescription: string;
  pros: string[];
  cons: string[];
  notes: string[];
  images: string[];
  featuredVideo: string | null;
  featured: boolean;
  yearEstablished: number;
  totalHomes: number;
  schoolDistrict: string;
  amenities: string[];
  _source: "pipeline";
}

const AREA_MAP: Record<string, string> = {
  "Castle Rock": "South Denver Metro",
  "Parker": "Parker / Elizabeth Corridor",
  "Aurora": "Southeast Aurora",
  "Littleton": "South Denver Metro",
  "Commerce City": "Northeast Denver Metro",
  "Brighton": "Northeast Denver Metro",
  "Thornton": "North Denver Metro",
  "Westminster": "North Denver Metro",
  "Arvada": "West Denver Metro",
  "Lakewood": "West Denver Metro",
  "Centennial": "South Denver Metro",
  "Highlands Ranch": "South Denver Metro",
  "Lone Tree": "South Denver Metro",
  "Erie": "North Denver Metro",
  "Frederick": "North Denver Metro",
  "Denver": "Denver Metro",
};

function mapStatus(raw: string): "active" | "coming-soon" | "sold-out" {
  const lower = raw.toLowerCase().replace(/[_ ]/g, "-");
  if (lower.includes("coming") || lower.includes("soon")) return "coming-soon";
  if (lower.includes("sold") || lower.includes("out")) return "sold-out";
  return "active";
}

function makeSlug(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

function transform(records: PipelineRecord[]): FrontendCommunity[] {
  // Group by community_name + city to merge multi-builder records
  const groups = new Map<string, PipelineRecord[]>();

  for (const rec of records) {
    // Skip records that failed review
    if (rec.review_status === "rejected") continue;

    const key = `${rec.community_name}::${rec.city}`.toLowerCase();
    const existing = groups.get(key) || [];
    existing.push(rec);
    groups.set(key, existing);
  }

  const results: FrontendCommunity[] = [];

  for (const [, recs] of groups) {
    const primary = recs[0]; // highest confidence or first
    const builders = [...new Set(recs.map((r) => r.builder_name).filter(Boolean))];
    const allImages = [...new Set(recs.flatMap((r) => r.image_urls || []))];
    const images = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];

    const priceFromValues = recs.map((r) => r.price_from).filter((v): v is number => v != null && v > 0);
    const priceToValues = recs.map((r) => r.price_to).filter((v): v is number => v != null && v > 0);
    const priceMin = priceFromValues.length > 0 ? Math.min(...priceFromValues) : 0;
    const priceMax = priceToValues.length > 0 ? Math.max(...priceToValues) : priceMin;

    const allAmenities = [...new Set(recs.flatMap((r) => r.amenities || []))];
    const allHomeTypes = [...new Set(recs.flatMap((r) => r.home_types || []))];

    const description = primary.community_description || `New construction community in ${primary.city}, CO.`;
    const slug = makeSlug(primary.community_name, primary.city);

    results.push({
      id: primary.id,
      slug,
      name: primary.community_name,
      city: primary.city,
      area: AREA_MAP[primary.city] || `${primary.city} Area`,
      builders,
      priceRange: { min: priceMin, max: priceMax || priceMin },
      status: mapStatus(primary.status || "active"),
      hoa: primary.hoa_fee
        ? { monthly: primary.hoa_fee, includes: ["Common areas"] }
        : null,
      homeTypes: allHomeTypes.length > 0 ? allHomeTypes : ["Single-family"],
      shortDescription: truncate(description, 150),
      longDescription: description,
      pros: [],
      cons: [],
      notes: [],
      images,
      featuredVideo: null,
      featured: false,
      yearEstablished: new Date().getFullYear(),
      totalHomes: 0,
      schoolDistrict: primary.school_info || "Contact for details",
      amenities: allAmenities,
      _source: "pipeline",
    });
  }

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────

function main() {
  console.log("Sync: reading pipeline output from", PIPELINE_INPUT);

  if (!fs.existsSync(PIPELINE_INPUT)) {
    console.log("Sync: no pipeline output found, writing empty array");
    fs.writeFileSync(FRONTEND_OUTPUT, "[]", "utf-8");
    return;
  }

  const raw = fs.readFileSync(PIPELINE_INPUT, "utf-8");
  let records: PipelineRecord[];

  try {
    records = JSON.parse(raw);
  } catch {
    console.error("Sync: failed to parse pipeline JSON");
    fs.writeFileSync(FRONTEND_OUTPUT, "[]", "utf-8");
    return;
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.log("Sync: pipeline output is empty");
    fs.writeFileSync(FRONTEND_OUTPUT, "[]", "utf-8");
    return;
  }

  console.log(`Sync: found ${records.length} pipeline records`);

  const transformed = transform(records);
  console.log(`Sync: produced ${transformed.length} communities after grouping`);
  console.log("Sync: communities:", transformed.map((c) => c.name).join(", "));

  fs.writeFileSync(FRONTEND_OUTPUT, JSON.stringify(transformed, null, 2), "utf-8");
  console.log("Sync: wrote", FRONTEND_OUTPUT);
}

main();
