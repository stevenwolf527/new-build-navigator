/**
 * Core types for the Denver new build community ingestion pipeline.
 */

// ─── Raw Record (as extracted from source) ────────────────────────────────

export interface RawCommunityRecord {
  source_url: string;
  source_domain: string;
  builder_name: string | null;
  community_name: string | null;
  city: string | null;
  state: string | null;
  street_address: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  price_text_raw: string | null;
  home_types_raw: string | null;
  beds_raw: string | null;
  baths_raw: string | null;
  sqft_raw: string | null;
  hoa_raw: string | null;
  status_raw: string | null;
  quick_move_ins_raw: string | null;
  community_description: string | null;
  amenities_raw: string | null;
  school_info_raw: string | null;
  model_names_raw: string | null;
  image_urls: string[];
  featured_image_url: string | null;

  // Metadata
  scraped_at: string;
  parser_version: string;
  extraction_confidence: number; // 0.0 - 1.0
  source_type: SourceType;
  raw_html_snippet?: string;
}

// ─── Normalized Record (cleaned and structured) ───────────────────────────

export interface CommunityRecord {
  id: string;
  slug: string;

  // Builder
  builder_name: string;
  builder_slug: string;

  // Community
  community_name: string;

  // Location
  city: string;
  state: string;
  street_address: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  distance_from_denver_miles: number | null;

  // Pricing
  price_from: number | null;
  price_to: number | null;
  price_text_raw: string | null;

  // Home specs
  home_types: string[];
  beds_min: number | null;
  beds_max: number | null;
  baths_min: number | null;
  baths_max: number | null;
  sqft_min: number | null;
  sqft_max: number | null;

  // HOA
  hoa_fee: number | null;
  hoa_period: HoaPeriod | null;

  // Status
  status: CommunityStatus;
  quick_move_ins_available: boolean;

  // Content
  community_description: string | null;
  amenities: string[];
  school_info: string | null;
  model_names: string[];

  // Media
  image_urls: string[];
  featured_image_url: string | null;

  // Source metadata
  source_url: string;
  source_domain: string;
  source_type: SourceType;
  scraped_at: string;
  parser_version: string;
  extraction_confidence: number;

  // Review metadata
  review_status: ReviewStatus;
  review_notes: string[];
  missing_fields: string[];
  duplicate_of: string | null;
  manual_overrides: Record<string, unknown>;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ─── Enums and Constants ──────────────────────────────────────────────────

export type CommunityStatus =
  | "active"
  | "coming_soon"
  | "sold_out"
  | "unknown";

export type HoaPeriod = "monthly" | "annually" | "quarterly" | "unknown";

export type SourceType =
  | "builder_website"
  | "community_page"
  | "quick_move_in"
  | "neighborhood_page"
  | "search_result"
  | "manual_entry"
  | "unknown";

export type ReviewStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "needs_review"
  | "auto_approved";

// ─── Discovery Types ──────────────────────────────────────────────────────

export interface BuilderSeed {
  name: string;
  slug: string;
  domain: string;
  base_urls: string[];
  community_url_patterns: string[];
  category: BuilderCategory;
  priority: number; // 1 = highest
  active: boolean;
  notes?: string;
}

export type BuilderCategory =
  | "national"
  | "regional"
  | "local"
  | "custom";

export interface CitySeed {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  search_keywords: string[];
  priority: number;
}

export interface DiscoveryResult {
  url: string;
  domain: string;
  builder_slug: string | null;
  discovery_method: "seed_crawl" | "search" | "sitemap" | "manual";
  discovered_at: string;
  page_title: string | null;
  meta_description: string | null;
}

// ─── Parser Types ─────────────────────────────────────────────────────────

export interface ParserConfig {
  domain: string;
  parser_id: string;
  version: string;
  selectors: Record<string, string>;
  enabled: boolean;
}

export interface ParseResult {
  success: boolean;
  record: RawCommunityRecord | null;
  errors: string[];
  warnings: string[];
  confidence: number;
}

// ─── Geocoding Types ──────────────────────────────────────────────────────

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  confidence: number;
  provider: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// ─── Dedupe Types ─────────────────────────────────────────────────────────

export interface DedupeMatch {
  record_a_id: string;
  record_b_id: string;
  similarity_score: number;
  match_reasons: string[];
  recommended_action: "merge" | "review" | "keep_both";
}

// ─── Pipeline Types ───────────────────────────────────────────────────────

export interface PipelineConfig {
  max_concurrent_requests: number;
  request_delay_ms: number;
  max_retries: number;
  retry_delay_ms: number;
  user_agent: string;
  respect_robots_txt: boolean;
  denver_center: GeoPoint;
  radius_miles: number;
  confidence_auto_approve_threshold: number;
  output_dir: string;
}

export interface PipelineResult {
  total_discovered: number;
  total_parsed: number;
  total_normalized: number;
  total_geocoded: number;
  total_within_radius: number;
  total_after_dedupe: number;
  total_auto_approved: number;
  total_needs_review: number;
  errors: string[];
  duration_ms: number;
}
