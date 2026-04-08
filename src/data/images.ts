// Curated Colorado-appropriate image library for community display.
// All images from Unsplash (free for commercial use).
// Categories are designed to match community attributes for intelligent assignment.

export type ImageCategory =
  | "exterior-luxury"
  | "exterior-moveup"
  | "exterior-attainable"
  | "exterior-townhome"
  | "landscape-mountain"
  | "landscape-prairie"
  | "neighborhood"
  | "interior"
  | "amenity"
  | "hero";

function u(id: string, w = 800, q = 80): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=${q}`;
}

// ── Exterior: Luxury ($750K+) ────────────────────────────────────────
export const EXTERIOR_LUXURY = [
  u("photo-1613490493576-7fde63acd811"),  // Grand modern home with pool
  u("photo-1580587771525-78b9dba3b914"),  // Large luxury home front
  u("photo-1600596542815-ffad4c1539a9"),  // Modern luxury exterior
  u("photo-1600607687939-ce8a6c25118c"),  // Upscale home warm lighting
  u("photo-1602343168117-bb8ffe3e2e9f"),  // Luxury home evening glow
  u("photo-1600585154526-990dced4db0d"),  // Premium home front yard
  u("photo-1625602812206-5ec545ca1231"),  // Luxury craftsman exterior
];

// ── Exterior: Move-up ($450K–$750K) ──────────────────────────────────
export const EXTERIOR_MOVEUP = [
  u("photo-1600047509807-ba8f99d2cdde"),  // Two-story suburban home
  u("photo-1568605114967-8130f3a36994"),  // Craftsman home front
  u("photo-1570129477492-45c003edd2be"),  // White suburban home
  u("photo-1572120360610-d971b9d7767c"),  // Modern two-story
  u("photo-1564013799919-ab600027ffc6"),  // Contemporary suburban
  u("photo-1600585154340-be6161a56a0c"),  // Clean modern exterior
  u("photo-1598228723793-52759bba239c"),  // Modern home blue sky
  u("photo-1599427303058-f04cbcf4756f"),  // Home with landscaped yard
];

// ── Exterior: Attainable (<$450K) ────────────────────────────────────
export const EXTERIOR_ATTAINABLE = [
  u("photo-1605146769289-440113cc3d00"),  // Clean suburban home
  u("photo-1600573472592-401b489a3cdc"),  // Modern starter home
  u("photo-1600566753190-17f0baa2a6c3"),  // Simple new construction
  u("photo-1576941089067-2de3c901e126"),  // Modest front yard
  u("photo-1560448204-e02f11c3d0e2"),    // Minimal modern home
  u("photo-1600210492493-0946911123ea"),  // Entry-level suburban
  u("photo-1560184897-ae75f418493e"),     // Angled modern home
  u("photo-1600607688969-a5bfcd646154"),  // Suburban community home
];

// ── Exterior: Townhomes / Paired ─────────────────────────────────────
export const EXTERIOR_TOWNHOME = [
  u("photo-1560185007-cde436f6a4d0"),    // Row of townhomes
  u("photo-1574362848149-11496d93a7c7"),  // Townhome style attached
  u("photo-1560440021-33f9b867899d"),    // Modern townhome
  u("photo-1512917774080-9991f1c4c750"),  // Contemporary attached
  u("photo-1583608205776-bfd35f0d9f83"),  // Paired home style
  u("photo-1486406146926-c627a92ad1ab"),  // Urban townhome row
];

// ── Landscape: Mountain (South metro, Castle Rock, Littleton) ────────
export const LANDSCAPE_MOUNTAIN = [
  u("photo-1469854523086-cc02fe5d8800"),  // Colorado mountain panorama
  u("photo-1506905925346-21bda4d32df4"),  // Mountain vista
  u("photo-1464822759023-fed622ff2c3b"),  // Dramatic peak
  u("photo-1519681393784-d120267933ba"),  // Mountain sunset
  u("photo-1454496522488-7a8e488e8606"),  // Mountain range wide
  u("photo-1501785888041-af3ef285b470"),  // Mountain valley
];

// ── Landscape: Prairie (Aurora, Commerce City, Brighton, Thornton) ────
export const LANDSCAPE_PRAIRIE = [
  u("photo-1500382017468-9049fed747ef"),  // Prairie golden hour
  u("photo-1473773508845-188df298d2d1"),  // Open field wide sky
  u("photo-1470071459604-3b5ec3a7fe05"),  // Green meadow
  u("photo-1531971589569-0d9370cbe1e5"),  // Prairie grassland
  u("photo-1571939228382-b2f2b585ce15"),  // Open landscape Colorado
  u("photo-1605276374104-dee2a0ed3cd6"),  // Plains golden light
];

// ── Neighborhood: Suburban streets, parks, trails ────────────────────
export const NEIGHBORHOOD = [
  u("photo-1560518883-ce09059eeffa"),    // Suburban street
  u("photo-1592595896551-12b371d546d5"),  // Neighborhood homes row
  u("photo-1449844908441-8829872d2607"),  // Neighborhood houses
  u("photo-1566024164372-0281f1133aa6"),  // Park trail path
  u("photo-1600566752355-35792bedcfea"),  // Suburban streetscape
  u("photo-1600573472591-ee6b68d14c68"),  // Community sidewalk
];

// ── Interior: Modern kitchens/living rooms ───────────────────────────
export const INTERIOR = [
  u("photo-1556909114-f6e7ad7d3136"),    // Modern white kitchen
  u("photo-1556909172-54557c7e4fb7"),    // Open concept living
  u("photo-1484154218962-a197022b5858"),  // Kitchen island bright
  u("photo-1600585154084-4e5fe7c39198"),  // Modern living room
  u("photo-1600210492486-724fe5c67fb0"),  // Interior design modern
];

// ── Amenity: Pools, clubhouses, playgrounds ──────────────────────────
export const AMENITY = [
  u("photo-1575429198097-0414ec08e8cd"),  // Resort-style pool
  u("photo-1566024164372-0281f1133aa6"),  // Community park
  u("photo-1560518883-ce09059eeffa"),    // Community common area
  u("photo-1571939228382-b2f2b585ce15"),  // Open space recreation
  u("photo-1605276374104-dee2a0ed3cd6"),  // Outdoor area
];

// ── Hero: Wide Colorado shots for homepage ───────────────────────────
export const HERO = [
  u("photo-1600596542815-ffad4c1539a9", 1400, 85), // Luxury home hero (wide)
  u("photo-1613490493576-7fde63acd811", 1400, 85), // Grand home hero
  u("photo-1580587771525-78b9dba3b914", 1400, 85), // Beautiful home front
];

// ── All images by category ───────────────────────────────────────────
export const IMAGE_LIBRARY: Record<ImageCategory, string[]> = {
  "exterior-luxury": EXTERIOR_LUXURY,
  "exterior-moveup": EXTERIOR_MOVEUP,
  "exterior-attainable": EXTERIOR_ATTAINABLE,
  "exterior-townhome": EXTERIOR_TOWNHOME,
  "landscape-mountain": LANDSCAPE_MOUNTAIN,
  "landscape-prairie": LANDSCAPE_PRAIRIE,
  neighborhood: NEIGHBORHOOD,
  interior: INTERIOR,
  amenity: AMENITY,
  hero: HERO,
};

// ── Known placeholder IDs (the 13 recycled images from original seed) ─
// When a community image matches one of these, treat as "no real image"
export const KNOWN_PLACEHOLDER_IDS = new Set([
  "photo-1600596542815-ffad4c1539a9",
  "photo-1600585154340-be6161a56a0c",
  "photo-1512917774080-9991f1c4c750",
  "photo-1600047509807-ba8f99d2cdde",
  "photo-1583608205776-bfd35f0d9f83",
  "photo-1564013799919-ab600027ffc6",
  "photo-1605146769289-440113cc3d00",
  "photo-1600573472592-401b489a3cdc",
  "photo-1600566753190-17f0baa2a6c3",
  "photo-1600585154526-990dced4db0d",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1600566752355-35792bedcfea",
]);
