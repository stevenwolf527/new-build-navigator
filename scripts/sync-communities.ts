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

// ── Inline image assignment for standalone script ────────────────────
// Mirrors the logic in src/lib/image-utils.ts but without Next.js path aliases.

function u(id: string): string {
  return `https://images.unsplash.com/${id}?w=800&q=80`;
}

const EXTERIOR_LUXURY = [
  u("photo-1613490493576-7fde63acd811"),
  u("photo-1580587771525-78b9dba3b914"),
  u("photo-1600596542815-ffad4c1539a9"),
  u("photo-1600607687939-ce8a6c25118c"),
  u("photo-1602343168117-bb8ffe3e2e9f"),
  u("photo-1600585154526-990dced4db0d"),
  u("photo-1625602812206-5ec545ca1231"),
];

const EXTERIOR_MOVEUP = [
  u("photo-1600047509807-ba8f99d2cdde"),
  u("photo-1568605114967-8130f3a36994"),
  u("photo-1570129477492-45c003edd2be"),
  u("photo-1572120360610-d971b9d7767c"),
  u("photo-1564013799919-ab600027ffc6"),
  u("photo-1600585154340-be6161a56a0c"),
  u("photo-1598228723793-52759bba239c"),
  u("photo-1599427303058-f04cbcf4756f"),
];

const EXTERIOR_ATTAINABLE = [
  u("photo-1605146769289-440113cc3d00"),
  u("photo-1600573472592-401b489a3cdc"),
  u("photo-1600566753190-17f0baa2a6c3"),
  u("photo-1576941089067-2de3c901e126"),
  u("photo-1560448204-e02f11c3d0e2"),
  u("photo-1600210492493-0946911123ea"),
  u("photo-1560184897-ae75f418493e"),
  u("photo-1600607688969-a5bfcd646154"),
];

const EXTERIOR_TOWNHOME = [
  u("photo-1560185007-cde436f6a4d0"),
  u("photo-1574362848149-11496d93a7c7"),
  u("photo-1560440021-33f9b867899d"),
  u("photo-1512917774080-9991f1c4c750"),
  u("photo-1583608205776-bfd35f0d9f83"),
  u("photo-1486406146926-c627a92ad1ab"),
];

const LANDSCAPE_MOUNTAIN = [
  u("photo-1469854523086-cc02fe5d8800"),
  u("photo-1506905925346-21bda4d32df4"),
  u("photo-1464822759023-fed622ff2c3b"),
  u("photo-1519681393784-d120267933ba"),
  u("photo-1454496522488-7a8e488e8606"),
  u("photo-1501785888041-af3ef285b470"),
];

const LANDSCAPE_PRAIRIE = [
  u("photo-1500382017468-9049fed747ef"),
  u("photo-1473773508845-188df298d2d1"),
  u("photo-1470071459604-3b5ec3a7fe05"),
  u("photo-1531971589569-0d9370cbe1e5"),
  u("photo-1571939228382-b2f2b585ce15"),
  u("photo-1605276374104-dee2a0ed3cd6"),
];

const INTERIOR = [
  u("photo-1556909114-f6e7ad7d3136"),
  u("photo-1556909172-54557c7e4fb7"),
  u("photo-1484154218962-a197022b5858"),
  u("photo-1600585154084-4e5fe7c39198"),
  u("photo-1600210492486-724fe5c67fb0"),
];

const MOUNTAIN_CITIES = new Set([
  "castle rock", "littleton", "castle pines", "lone tree",
  "highlands ranch", "ken caryl", "roxborough", "evergreen",
  "conifer", "golden", "morrison",
]);

const PRAIRIE_CITIES = new Set([
  "aurora", "commerce city", "brighton", "thornton",
  "northglenn", "westminster", "broomfield", "erie",
  "firestone", "frederick", "dacono", "bennett", "watkins",
]);

function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick(arr: string[], seed: string, offset = 0): string {
  return arr[((djb2(seed) + offset) % arr.length + arr.length) % arr.length];
}

function assignImages(slug: string, city: string, area: string, priceMin: number, homeTypes: string[]): string[] {
  const hasTownhomes = homeTypes.some((t) => /townhome|paired|attached|row/i.test(t))
    && !homeTypes.some((t) => /estate/i.test(t));

  let exteriorPool: string[];
  if (hasTownhomes) {
    exteriorPool = EXTERIOR_TOWNHOME;
  } else if (priceMin >= 700000) {
    exteriorPool = EXTERIOR_LUXURY;
  } else if (priceMin >= 450000) {
    exteriorPool = EXTERIOR_MOVEUP;
  } else {
    exteriorPool = EXTERIOR_ATTAINABLE;
  }

  const cityLower = city.toLowerCase();
  const areaLower = area.toLowerCase();
  let landscapePool: string[];
  if (MOUNTAIN_CITIES.has(cityLower) || areaLower.includes("south")) {
    landscapePool = LANDSCAPE_MOUNTAIN;
  } else if (PRAIRIE_CITIES.has(cityLower) || areaLower.includes("north")) {
    landscapePool = LANDSCAPE_PRAIRIE;
  } else {
    landscapePool = LANDSCAPE_MOUNTAIN;
  }

  return [
    pick(exteriorPool, slug, 0),
    pick(landscapePool, slug, 1),
    pick(INTERIOR, slug, 2),
  ];
}

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

    const priceFromValues = recs.map((r) => r.price_from).filter((v): v is number => v != null && v > 0);
    const priceToValues = recs.map((r) => r.price_to).filter((v): v is number => v != null && v > 0);
    const priceMin = priceFromValues.length > 0 ? Math.min(...priceFromValues) : 0;
    const priceMax = priceToValues.length > 0 ? Math.max(...priceToValues) : priceMin;

    const allAmenities = [...new Set(recs.flatMap((r) => r.amenities || []))];
    const allHomeTypes = [...new Set(recs.flatMap((r) => r.home_types || []))];

    const description = primary.community_description || `New construction community in ${primary.city}, CO.`;
    const slug = makeSlug(primary.community_name, primary.city);
    const area = AREA_MAP[primary.city] || `${primary.city} Area`;
    const finalHomeTypes = allHomeTypes.length > 0 ? allHomeTypes : ["Single-family"];

    // Use scraped images if available, otherwise assign intelligently
    const images = allImages.length > 0
      ? allImages
      : assignImages(slug, primary.city, area, priceMin, finalHomeTypes);

    results.push({
      id: primary.id,
      slug,
      name: primary.community_name,
      city: primary.city,
      area,
      builders,
      priceRange: { min: priceMin, max: priceMax || priceMin },
      status: mapStatus(primary.status || "active"),
      hoa: primary.hoa_fee
        ? { monthly: primary.hoa_fee, includes: ["Common areas"] }
        : null,
      homeTypes: finalHomeTypes,
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
    console.log("Sync: no pipeline output found — preserving existing frontend data");
    return;
  }

  const raw = fs.readFileSync(PIPELINE_INPUT, "utf-8");
  let records: PipelineRecord[];

  try {
    records = JSON.parse(raw);
  } catch {
    console.error("Sync: failed to parse pipeline JSON — preserving existing frontend data");
    return;
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.log("Sync: pipeline output is empty — preserving existing frontend data");
    return;
  }

  console.log(`Sync: found ${records.length} pipeline records`);

  const transformed = transform(records);
  console.log(`Sync: produced ${transformed.length} communities after grouping`);

  // ── Safety check: don't overwrite better data with worse ───────────
  if (fs.existsSync(FRONTEND_OUTPUT)) {
    try {
      const existing = JSON.parse(fs.readFileSync(FRONTEND_OUTPUT, "utf-8"));
      if (Array.isArray(existing) && existing.length > transformed.length) {
        console.warn(
          `Sync: WARNING — new output (${transformed.length} communities) is smaller than existing (${existing.length}).`
        );
        console.warn(
          "Sync: Refusing to overwrite. Use --force to override."
        );
        if (!process.argv.includes("--force")) {
          return;
        }
        console.warn("Sync: --force flag set, overwriting anyway.");
      }
    } catch {
      // Existing file is corrupt, safe to overwrite
    }
  }

  console.log("Sync: communities:", transformed.map((c) => c.name).join(", "));

  fs.writeFileSync(FRONTEND_OUTPUT, JSON.stringify(transformed, null, 2), "utf-8");
  console.log(`Sync: wrote ${transformed.length} communities to`, FRONTEND_OUTPUT);
}

main();
