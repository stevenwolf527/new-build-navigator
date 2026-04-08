/**
 * Normalizer service — transforms raw extracted records into clean, structured data.
 * Handles price parsing, range extraction, status normalization, and field validation.
 */

import {
  RawCommunityRecord,
  CommunityRecord,
  CommunityStatus,
  HoaPeriod,
  ReviewStatus,
} from "../types";
import { slugify, generateId } from "../utils/text";
import { pipelineConfig } from "../config/pipeline.config";
import { logger } from "../utils/logger";

export class NormalizerService {
  normalize(raw: RawCommunityRecord): CommunityRecord {
    const missingFields: string[] = [];
    const reviewNotes: string[] = [];

    // ── Builder ─────────────────────────────────────────────────────

    const builderName = this.normalizeBuilderName(raw.builder_name);
    if (!builderName) missingFields.push("builder_name");

    // ── Community ───────────────────────────────────────────────────

    const communityName = raw.community_name?.trim() || "Unknown Community";
    if (!raw.community_name) missingFields.push("community_name");

    // ── Location ────────────────────────────────────────────────────

    const city = this.normalizeCity(raw.city);
    if (!city) missingFields.push("city");

    const state = raw.state?.toUpperCase().trim() || null;

    // ── Pricing ─────────────────────────────────────────────────────

    const pricing = this.parsePricing(raw.price_text_raw);
    if (!pricing.from && !pricing.to) missingFields.push("price");

    // ── Specs ───────────────────────────────────────────────────────

    const beds = this.parseRange(raw.beds_raw);
    const baths = this.parseRange(raw.baths_raw);
    const sqft = this.parseSqftRange(raw.sqft_raw);

    if (!beds.min) missingFields.push("beds");
    if (!sqft.min) missingFields.push("sqft");

    // ── HOA ─────────────────────────────────────────────────────────

    const hoa = this.parseHoa(raw.hoa_raw);

    // ── Status ──────────────────────────────────────────────────────

    const status = this.normalizeStatus(raw.status_raw);

    // ── Home types ──────────────────────────────────────────────────

    const homeTypes = this.parseListField(raw.home_types_raw);

    // ── Amenities ───────────────────────────────────────────────────

    const amenities = this.parseAmenities(raw.amenities_raw);

    // ── Models ──────────────────────────────────────────────────────

    const modelNames = this.parseListField(raw.model_names_raw);

    // ── IDs ─────────────────────────────────────────────────────────

    const id = generateId(
      builderName || "unknown",
      communityName,
      city || "unknown",
    );
    const slug = slugify(
      `${builderName || "unknown"}-${communityName}-${city || "unknown"}`,
    );

    // ── Review status ───────────────────────────────────────────────

    const confidence = raw.extraction_confidence ?? 0;
    let reviewStatus: ReviewStatus;

    if (confidence >= pipelineConfig.confidence_auto_approve_threshold) {
      reviewStatus = "auto_approved";
    } else if (confidence >= 0.5) {
      reviewStatus = "needs_review";
      reviewNotes.push("Confidence below auto-approve threshold");
    } else {
      reviewStatus = "pending";
      reviewNotes.push("Low confidence extraction");
    }

    if (missingFields.length >= 3) {
      reviewStatus = "needs_review";
      reviewNotes.push(`Missing ${missingFields.length} fields`);
    }

    // ── Timestamps ──────────────────────────────────────────────────

    const now = new Date().toISOString();

    // ── Return ──────────────────────────────────────────────────────

    return {
      id,
      slug,
      builder_name: builderName || "Unknown Builder",
      builder_slug: slugify(builderName || "unknown"),
      community_name: communityName,
      city: city || "Unknown",
      state: state || "CO",
      street_address: raw.street_address?.trim() || null,
      zip_code: raw.zip_code?.trim() || null,
      latitude: raw.latitude,
      longitude: raw.longitude,
      distance_from_denver_miles: null,
      price_from: pricing.from,
      price_to: pricing.to,
      price_text_raw: raw.price_text_raw || null,
      home_types: homeTypes,
      beds_min: beds.min,
      beds_max: beds.max,
      baths_min: baths.min,
      baths_max: baths.max,
      sqft_min: sqft.min,
      sqft_max: sqft.max,
      hoa_fee: hoa.fee,
      hoa_period: hoa.period,
      status,
      quick_move_ins_available: raw.quick_move_ins_raw?.toLowerCase() === "yes",
      community_description: raw.community_description?.trim() || null,
      amenities,
      school_info: raw.school_info_raw?.trim() || null,
      model_names: modelNames,
      image_urls: this.cleanImageUrls(raw.image_urls || []),
      featured_image_url: raw.featured_image_url || null,
      source_url: raw.source_url,
      source_domain: raw.source_domain,
      source_type: raw.source_type,
      scraped_at: raw.scraped_at,
      parser_version: raw.parser_version,
      extraction_confidence: raw.extraction_confidence,
      review_status: reviewStatus,
      review_notes: reviewNotes,
      missing_fields: missingFields,
      duplicate_of: null,
      manual_overrides: {},
      created_at: now,
      updated_at: now,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Price Parsing
  // ═══════════════════════════════════════════════════════════════════════

  private parsePricing(raw: string | null | undefined): {
    from: number | null;
    to: number | null;
  } {
    if (!raw) return { from: null, to: null };

    const text = raw.toLowerCase().replace(/,/g, "");

    // Exact range: "$525000 - $825000"
    const rangeMatch = text.match(/\$(\d+)\s*[-\u2013\u2014to]+\s*\$(\d+)/);
    if (rangeMatch) {
      return {
        from: parseInt(rangeMatch[1], 10),
        to: parseInt(rangeMatch[2], 10),
      };
    }

    // "From the high $500s" -> 570000, "Mid $400s" -> 440000, "Low $300s" -> 300000
    const qualifierMatch = text.match(
      /(?:from\s+the\s+)?(low|mid|high)\s+\$(\d{3})s/,
    );
    if (qualifierMatch) {
      const qualifier = qualifierMatch[1];
      const base = parseInt(qualifierMatch[2], 10) * 1000;
      if (qualifier === "low") {
        return { from: base, to: base + 30000 };
      } else if (qualifier === "mid") {
        return { from: base + 40000, to: base + 60000 };
      } else if (qualifier === "high") {
        return { from: base + 70000, to: base + 99000 };
      }
    }

    // "$500s" without qualifier
    const plainHundredsMatch = text.match(/\$(\d{3})s/);
    if (plainHundredsMatch) {
      const base = parseInt(plainHundredsMatch[1], 10) * 1000;
      return { from: base, to: base + 99000 };
    }

    // "Starting at $450000" or "From $450000" or "Priced from $450000"
    const fromMatch = text.match(
      /(?:from|starting\s+(?:at|from)|priced\s+from)\s+\$(\d+)/,
    );
    if (fromMatch) {
      return { from: parseInt(fromMatch[1], 10), to: null };
    }

    // "$450000+"
    const plusMatch = text.match(/\$(\d+)\+/);
    if (plusMatch) {
      return { from: parseInt(plusMatch[1], 10), to: null };
    }

    // Bare price "$525000"
    const bareMatch = text.match(/\$(\d{5,})/);
    if (bareMatch) {
      return { from: parseInt(bareMatch[1], 10), to: null };
    }

    return { from: null, to: null };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Range Parsing (beds, baths)
  // ═══════════════════════════════════════════════════════════════════════

  private parseRange(raw: string | null | undefined): {
    min: number | null;
    max: number | null;
  } {
    if (!raw) return { min: null, max: null };

    // Range: "3-5" or "3 to 5"
    const rangeMatch = raw.match(
      /(\d+(?:\.\d)?)\s*[-\u2013\u2014]|\s*to\s*(\d+(?:\.\d)?)/,
    );
    // Better: try a full range match
    const fullRange = raw.match(
      /(\d+(?:\.\d+)?)\s*[-\u2013\u2014to]+\s*(\d+(?:\.\d+)?)/,
    );
    if (fullRange) {
      return {
        min: parseFloat(fullRange[1]),
        max: parseFloat(fullRange[2]),
      };
    }

    // Single value: "3"
    const singleMatch = raw.match(/(\d+(?:\.\d+)?)/);
    if (singleMatch) {
      const val = parseFloat(singleMatch[1]);
      return { min: val, max: val };
    }

    return { min: null, max: null };
  }

  private parseSqftRange(raw: string | null | undefined): {
    min: number | null;
    max: number | null;
  } {
    if (!raw) return { min: null, max: null };
    // Remove commas before parsing
    const cleaned = raw.replace(/,/g, "");
    return this.parseRange(cleaned);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // HOA Parsing
  // ═══════════════════════════════════════════════════════════════════════

  private parseHoa(raw: string | null | undefined): {
    fee: number | null;
    period: HoaPeriod | null;
  } {
    if (!raw) return { fee: null, period: null };

    const match = raw.match(
      /\$?([\d,]+(?:\.\d{2})?)\s*\/?\s*(?:per\s+)?(month|mo|monthly|year|yr|annually|annual|quarter|quarterly)/i,
    );
    if (!match) return { fee: null, period: null };

    const fee = parseFloat(match[1].replace(/,/g, ""));
    const periodRaw = match[2].toLowerCase();

    let period: HoaPeriod;
    if (periodRaw.startsWith("month") || periodRaw === "mo") {
      period = "monthly";
    } else if (
      periodRaw.startsWith("year") ||
      periodRaw === "yr" ||
      periodRaw === "annually" ||
      periodRaw === "annual"
    ) {
      period = "annually";
    } else if (periodRaw.startsWith("quarter")) {
      period = "quarterly";
    } else {
      period = "unknown" as HoaPeriod;
    }

    return { fee, period };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Status Normalization
  // ═══════════════════════════════════════════════════════════════════════

  private normalizeStatus(raw: string | null | undefined): CommunityStatus {
    if (!raw) return "unknown" as CommunityStatus;
    const lower = raw.toLowerCase().trim();

    const statusMapping: Record<string, CommunityStatus> = {
      active: "active" as CommunityStatus,
      "now selling": "active" as CommunityStatus,
      selling: "active" as CommunityStatus,
      available: "active" as CommunityStatus,
      "move-in ready": "active" as CommunityStatus,
      "quick move-in": "active" as CommunityStatus,
      "sales open": "active" as CommunityStatus,
      coming_soon: "coming_soon" as CommunityStatus,
      "coming soon": "coming_soon" as CommunityStatus,
      "pre-sale": "coming_soon" as CommunityStatus,
      presale: "coming_soon" as CommunityStatus,
      anticipated: "coming_soon" as CommunityStatus,
      "opening soon": "coming_soon" as CommunityStatus,
      sold_out: "sold_out" as CommunityStatus,
      "sold out": "sold_out" as CommunityStatus,
      "sold-out": "sold_out" as CommunityStatus,
      closeout: "closeout" as CommunityStatus,
      "close out": "closeout" as CommunityStatus,
    };

    // Exact match
    if (statusMapping[lower]) return statusMapping[lower];

    // Partial match
    for (const [key, status] of Object.entries(statusMapping)) {
      if (lower.includes(key)) return status;
    }

    return "unknown" as CommunityStatus;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Builder Name Normalization
  // ═══════════════════════════════════════════════════════════════════════

  private normalizeBuilderName(raw: string | null | undefined): string | null {
    if (!raw) return null;

    const canonical: Record<string, string> = {
      lennar: "Lennar",
      "richmond american": "Richmond American",
      "richmond american homes": "Richmond American",
      "meritage homes": "Meritage Homes",
      meritage: "Meritage Homes",
      "taylor morrison": "Taylor Morrison",
      "kb home": "KB Home",
      "kb homes": "KB Home",
      "toll brothers": "Toll Brothers",
      "toll bros": "Toll Brothers",
      "shea homes": "Shea Homes",
      "d.r. horton": "D.R. Horton",
      "dr horton": "D.R. Horton",
      "dr. horton": "D.R. Horton",
      "oakwood homes": "Oakwood Homes",
      "dream finders homes": "Dream Finders Homes",
      "dream finders": "Dream Finders Homes",
      "century communities": "Century Communities",
      "tri pointe homes": "Tri Pointe Homes",
      "tri pointe": "Tri Pointe Homes",
      "challenger homes": "Challenger Homes",
      "pulte homes": "Pulte Homes",
      pulte: "Pulte Homes",
      "david weekley homes": "David Weekley Homes",
      "david weekley": "David Weekley Homes",
      "lokal homes": "Lokal Homes",
    };

    const lower = raw.toLowerCase().trim();
    return canonical[lower] || raw.trim();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // City Normalization
  // ═══════════════════════════════════════════════════════════════════════

  private normalizeCity(raw: string | null | undefined): string | null {
    if (!raw) return null;

    // Known canonical cities (Colorado-focused)
    const canonical: Record<string, string> = {
      "castle rock": "Castle Rock",
      "castle pines": "Castle Pines",
      "highlands ranch": "Highlands Ranch",
      "lone tree": "Lone Tree",
      "commerce city": "Commerce City",
      "green valley ranch": "Green Valley Ranch",
      "colorado springs": "Colorado Springs",
      "fort collins": "Fort Collins",
      denver: "Denver",
      parker: "Parker",
      aurora: "Aurora",
      centennial: "Centennial",
      littleton: "Littleton",
      lakewood: "Lakewood",
      arvada: "Arvada",
      thornton: "Thornton",
      westminster: "Westminster",
      erie: "Erie",
      broomfield: "Broomfield",
      englewood: "Englewood",
      brighton: "Brighton",
      firestone: "Firestone",
      frederick: "Frederick",
      loveland: "Loveland",
      longmont: "Longmont",
      boulder: "Boulder",
      windsor: "Windsor",
      timnath: "Timnath",
      johnstown: "Johnstown",
      berthoud: "Berthoud",
    };

    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();

    // Exact canonical match
    if (canonical[lower]) return canonical[lower];

    // Title case fallback
    return trimmed
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // ═══════════════════════════════════════════════════════════════════════
  // List Parsing
  // ═══════════════════════════════════════════════════════════════════════

  private parseListField(raw: string | null | undefined): string[] {
    if (!raw) return [];
    return raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length < 100);
  }

  private parseAmenities(raw: string | null | undefined): string[] {
    if (!raw) return [];
    const items = raw
      .split(/[,;|\n\u2022\u00b7]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && s.length < 80);
    return [...new Set(items)];
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Image Cleaning
  // ═══════════════════════════════════════════════════════════════════════

  private cleanImageUrls(urls: string[]): string[] {
    return [...new Set(urls)]
      .filter(
        (u) =>
          !u.includes("logo") &&
          !u.includes("icon") &&
          !u.includes("favicon") &&
          !u.includes("pixel") &&
          !u.includes("tracking") &&
          !u.includes("spacer") &&
          !u.includes("1x1") &&
          u.startsWith("http"),
      )
      .slice(0, 20);
  }
}
