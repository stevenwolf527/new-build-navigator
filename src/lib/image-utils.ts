import {
  IMAGE_LIBRARY,
  KNOWN_PLACEHOLDER_IDS,
  EXTERIOR_LUXURY,
  EXTERIOR_MOVEUP,
  EXTERIOR_ATTAINABLE,
  EXTERIOR_TOWNHOME,
  HERO,
} from "@/data/images";

// ── Deterministic hash ───────────────────────────────────────────────
// djb2 hash — stable, fast, good distribution
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(arr: T[], seed: string, offset = 0): T {
  return arr[((hash(seed) + offset) % arr.length + arr.length) % arr.length];
}

// ── Placeholder detection ────────────────────────────────────────────

export function isPlaceholder(url: string): boolean {
  const match = url.match(/\/(photo-[\w-]+)\?/);
  if (!match) return false;
  return KNOWN_PLACEHOLDER_IDS.has(match[1]);
}

// ── Price tier mapping ───────────────────────────────────────────────

type PriceTier = "luxury" | "moveup" | "attainable";

function getPriceTier(priceMin: number): PriceTier {
  if (priceMin >= 700000) return "luxury";
  if (priceMin >= 450000) return "moveup";
  return "attainable";
}

function getExteriorPool(tier: PriceTier, homeTypes: string[]): string[] {
  const hasTownhomes =
    homeTypes.some((t) => /townhome|paired|attached|row/i.test(t)) &&
    !homeTypes.some((t) => /estate/i.test(t));

  if (hasTownhomes) return EXTERIOR_TOWNHOME;

  switch (tier) {
    case "luxury":
      return EXTERIOR_LUXURY;
    case "moveup":
      return EXTERIOR_MOVEUP;
    case "attainable":
      return EXTERIOR_ATTAINABLE;
  }
}

// ── Landscape mapping ────────────────────────────────────────────────

const MOUNTAIN_CITIES = new Set([
  "castle rock",
  "littleton",
  "castle pines",
  "lone tree",
  "highlands ranch",
  "ken caryl",
  "roxborough",
  "evergreen",
  "conifer",
  "golden",
  "morrison",
]);

const PRAIRIE_CITIES = new Set([
  "aurora",
  "commerce city",
  "brighton",
  "thornton",
  "northglenn",
  "westminster",
  "broomfield",
  "erie",
  "firestone",
  "frederick",
  "dacono",
  "bennett",
  "watkins",
]);

function getLandscapeCategory(city: string, area: string): "landscape-mountain" | "landscape-prairie" {
  const cityLower = city.toLowerCase();
  const areaLower = area.toLowerCase();

  if (MOUNTAIN_CITIES.has(cityLower)) return "landscape-mountain";
  if (PRAIRIE_CITIES.has(cityLower)) return "landscape-prairie";
  if (areaLower.includes("south")) return "landscape-mountain";
  if (areaLower.includes("north") || areaLower.includes("northeast")) return "landscape-prairie";

  // Default: mountain (more visually appealing)
  return "landscape-mountain";
}

// ── Main assignment function ─────────────────────────────────────────

interface CommunityImageInput {
  slug: string;
  city: string;
  area: string;
  priceRange: { min: number; max: number };
  homeTypes: string[];
}

/**
 * Returns 3 distinct images matched to community attributes:
 * [0] Primary exterior (price-tier appropriate)
 * [1] Landscape/neighborhood (location appropriate)
 * [2] Interior or amenity (for gallery)
 */
export function getImagesForCommunity(community: CommunityImageInput): [string, string, string] {
  const { slug, city, area, priceRange, homeTypes } = community;
  const tier = getPriceTier(priceRange.min);

  const exteriorPool = getExteriorPool(tier, homeTypes);
  const landscapeCat = getLandscapeCategory(city, area);
  const landscapePool = IMAGE_LIBRARY[landscapeCat];
  const interiorPool = IMAGE_LIBRARY.interior;

  return [
    pick(exteriorPool, slug, 0),
    pick(landscapePool, slug, 1),
    pick(interiorPool, slug, 2),
  ];
}

/**
 * Returns a single exterior image appropriate for the community.
 */
export function getFallbackImage(slug: string): string {
  return pick(EXTERIOR_MOVEUP, slug);
}

/**
 * Returns images for a listing based on price and builder.
 */
export function getListingImages(listing: {
  communityName: string;
  city: string;
  price: number;
}): [string, string] {
  const tier = getPriceTier(listing.price);
  const pool =
    tier === "luxury"
      ? EXTERIOR_LUXURY
      : tier === "moveup"
        ? EXTERIOR_MOVEUP
        : EXTERIOR_ATTAINABLE;

  const seed = `${listing.communityName}-${listing.city}`;
  return [pick(pool, seed, 0), pick(IMAGE_LIBRARY.interior, seed, 1)];
}

/**
 * Homepage hero image (high-res).
 */
export function getHeroImage(): string {
  return HERO[0];
}

// ── Fallback constants ───────────────────────────────────────────────

export const FALLBACK_IMAGES = {
  primary: EXTERIOR_MOVEUP[0],
  interior: IMAGE_LIBRARY.interior[0],
  landscape: IMAGE_LIBRARY["landscape-mountain"][0],
  neighborhood: IMAGE_LIBRARY.neighborhood[0],
} as const;
