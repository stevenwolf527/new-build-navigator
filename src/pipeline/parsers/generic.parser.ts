/**
 * Generic community page parser.
 * Uses heuristic-based extraction to pull community data from any builder website.
 * Tries multiple strategies per field, ordered from highest to lowest confidence.
 */

import { RawCommunityRecord, ParseResult, SourceType } from "../types";
import {
  stripHtml,
  extractTextBetweenTags,
  extractImageUrls,
  extractMeta,
  extractTitle,
} from "../utils/text";
import { logger } from "../utils/logger";

const PARSER_VERSION = "generic-1.1.0";

// ─── State lookup ───────────────────────────────────────────────────────

const STATE_FULL_TO_ABBR: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO",
  montana: "MT", nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY",
};
const STATE_ABBR_SET = new Set(Object.values(STATE_FULL_TO_ABBR));

// ─── Price patterns (ordered most-specific first) ───────────────────────

const PRICE_PATTERNS: RegExp[] = [
  // Range: "$525,000 - $825,000"
  /\$[\d,]+\s*[-\u2013\u2014to]+\s*\$[\d,]+/gi,
  // Descriptor: "From the high $500s", "Low $300s", "Mid $400s"
  /(?:from\s+the\s+)?(?:low|mid|high)\s+\$\d{3}s/gi,
  // "Starting at / from / priced from $450,000"
  /(?:starting\s+(?:at|from)|from|priced\s+from)\s+\$[\d,]+/gi,
  // "$450,000+"
  /\$[\d,]+\+/gi,
  // Standalone six-digit+ price
  /\$[\d,]{6,}/g,
  // Short: "$500s"
  /\$\d{3}s/gi,
];

// ─── Bed / Bath / Sqft ─────────────────────────────────────────────────

const BEDS_RANGE = /(\d+)\s*[-\u2013\u2014to]+\s*(\d+)\s*(?:bed(?:room)?s?|br|bd)/gi;
const BEDS_SINGLE = /(\d+)\s*(?:bed(?:room)?s?|br|bd)/gi;

const BATHS_RANGE = /(\d+(?:\.\d)?)\s*[-\u2013\u2014to]+\s*(\d+(?:\.\d)?)\s*(?:bath(?:room)?s?|ba)/gi;
const BATHS_SINGLE = /(\d+(?:\.\d)?)\s*(?:bath(?:room)?s?|ba)/gi;

const SQFT_RANGE = /([\d,]+)\s*[-\u2013\u2014to]+\s*([\d,]+)\s*(?:sq\.?\s*(?:ft|feet)|sqft|square\s+(?:ft|feet|foot))/gi;
const SQFT_SINGLE = /([\d,]+)\s*(?:sq\.?\s*(?:ft|feet)|sqft|square\s+(?:ft|feet|foot))/gi;

// ─── Status ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, string[]> = {
  active: [
    "now selling", "now open", "actively selling", "available",
    "move-in ready", "quick move-in", "quick move", "sales open",
  ],
  coming_soon: [
    "coming soon", "pre-sale", "presale", "anticipated",
    "future community", "opening soon", "under development",
  ],
  sold_out: [
    "sold out", "sold-out", "no longer available", "fully sold",
    "completely sold",
  ],
  closeout: [
    "closeout", "close out", "final homes", "final opportunity",
    "last chance", "last homes",
  ],
};

// ─── Location patterns ──────────────────────────────────────────────────

// "City, ST 80123" or "City, ST"
const CITY_STATE_ZIP = /([A-Z][a-zA-Z\s.'\-]+),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/g;
// "in City, Colorado" / "located in City, CO"
const CITY_FULL_STATE = /(?:in|near|located\s+in)\s+([A-Z][a-zA-Z\s.'\-]+),\s*(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\s+Hampshire|New\s+Jersey|New\s+Mexico|New\s+York|North\s+Carolina|North\s+Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\s+Island|South\s+Carolina|South\s+Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\s+Virginia|Wisconsin|Wyoming)/gi;
const ADDRESS_PATTERN = /\d{2,5}\s+[A-Z][a-zA-Z\s]+(?:St|Ave|Blvd|Dr|Ln|Way|Ct|Rd|Pkwy|Cir|Pl)/g;

// ─── HOA ────────────────────────────────────────────────────────────────

const HOA_PATTERN = /\$?([\d,]+(?:\.\d{2})?)\s*\/?\s*(?:per\s+)?(?:month|mo|monthly|year|annually|annual|quarter|quarterly)/gi;

// ─── Helpers ────────────────────────────────────────────────────────────

function resetRegex(r: RegExp): void {
  r.lastIndex = 0;
}

function execFirst(pattern: RegExp, text: string): RegExpExecArray | null {
  resetRegex(pattern);
  const m = pattern.exec(text);
  resetRegex(pattern);
  return m;
}

function extractJsonLd(html: string): Record<string, any>[] {
  const results: Record<string, any>[] = [];
  const re = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) results.push(...parsed);
      else results.push(parsed);
    } catch {
      // malformed JSON-LD, skip
    }
  }
  return results;
}

function cleanText(s: string): string {
  return s.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

// ═══════════════════════════════════════════════════════════════════════
// Parser
// ═══════════════════════════════════════════════════════════════════════

export class GenericCommunityParser {
  canParse(_url: string, _html: string): boolean {
    return true; // Generic parser handles everything
  }

  async parse(url: string, html: string): Promise<ParseResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      let plainText: string;
      try {
        plainText = stripHtml(html);
      } catch {
        plainText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
      }

      const domain = this.safeDomain(url);
      const jsonLd = extractJsonLd(html);

      // ── Extract fields ──────────────────────────────────────────────

      const communityName = this.extractCommunityName(html, plainText, jsonLd);
      const builderName = this.extractBuilderName(html, domain, jsonLd);
      const location = this.extractLocation(plainText, html, jsonLd);
      const priceText = this.extractPriceText(plainText, html);
      const specs = this.extractSpecs(plainText);
      const status = this.extractStatusRaw(plainText);
      const description = this.extractDescription(html, jsonLd);
      const amenities = this.extractAmenities(plainText, html);
      const schools = this.extractSchoolInfo(plainText);
      const models = this.extractModelNames(plainText);
      const homeTypesRaw = this.extractHomeTypes(plainText);
      const hoaText = this.extractHoaText(plainText);
      const quickMoveIn = this.detectQuickMoveIn(plainText);

      let images: string[];
      try {
        images = extractImageUrls(html, url);
      } catch {
        images = [];
      }

      // ── Confidence ──────────────────────────────────────────────────

      let fieldsFound = 0;
      const totalFields = 10;
      if (communityName) fieldsFound++;
      if (builderName) fieldsFound++;
      if (location.city) fieldsFound++;
      if (priceText) fieldsFound++;
      if (specs.beds) fieldsFound++;
      if (specs.sqft) fieldsFound++;
      if (description) fieldsFound++;
      if (images.length > 0) fieldsFound++;
      if (status) fieldsFound++;
      if (amenities) fieldsFound++;

      const confidence = Math.round((fieldsFound / totalFields) * 100) / 100;

      if (!communityName) warnings.push("Could not extract community name");
      if (!builderName) warnings.push("Could not extract builder name");
      if (!location.city) warnings.push("Could not extract city");
      if (!priceText) warnings.push("Could not extract pricing");

      // ── Build record ────────────────────────────────────────────────

      const record: RawCommunityRecord = {
        source_url: url,
        source_domain: domain,
        builder_name: builderName,
        community_name: communityName,
        city: location.city,
        state: location.state || null,
        street_address: location.address,
        zip_code: location.zip,
        latitude: null,
        longitude: null,
        price_text_raw: priceText,
        home_types_raw: homeTypesRaw,
        beds_raw: specs.beds,
        baths_raw: specs.baths,
        sqft_raw: specs.sqft,
        hoa_raw: hoaText,
        status_raw: status,
        quick_move_ins_raw: quickMoveIn ? "yes" : null,
        community_description: description,
        amenities_raw: amenities,
        school_info_raw: schools,
        model_names_raw: models,
        image_urls: images.slice(0, 20),
        featured_image_url: images[0] || null,
        scraped_at: new Date().toISOString(),
        parser_version: PARSER_VERSION,
        extraction_confidence: confidence,
        source_type: this.detectSourceType(url, plainText),
        raw_html_snippet: html.slice(0, 2000),
      };

      logger.debug(
        "generic-parser",
        `Parsed ${url}: confidence=${confidence}, fields=${fieldsFound}/${totalFields}`
      );

      return {
        success: fieldsFound >= 2,
        record,
        errors,
        warnings,
        confidence,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      return {
        success: false,
        record: null,
        errors,
        warnings,
        confidence: 0,
      };
    }
  }

  // ─── Community Name ──────────────────────────────────────────────────

  private extractCommunityName(
    html: string,
    plainText: string,
    jsonLd: Record<string, any>[],
  ): string | null {
    // Strategy 1: JSON-LD with relevant @type
    for (const item of jsonLd) {
      if (
        item.name &&
        typeof item.name === "string" &&
        ["Place", "Residence", "RealEstateListing", "Product", "Apartment"].includes(item["@type"])
      ) {
        return cleanText(item.name);
      }
    }

    // Strategy 2: og:title (strip builder suffix)
    const ogTitle = extractMeta(html, "og:title");
    if (ogTitle) {
      const cleaned = ogTitle
        .replace(/\s*[-|]\s*(new homes?|community|neighborhood).*/i, "")
        .replace(/\s*[-|]\s*\w+\s*(homes?|builders?|communities).*/i, "")
        .trim();
      if (cleaned.length > 2 && cleaned.length < 80) return cleaned;
    }

    // Strategy 3: First h1
    try {
      const h1s = extractTextBetweenTags(html, "h1");
      if (h1s.length > 0) {
        const h1 = cleanText(h1s[0])
          .replace(/new homes?\s*(in|at|near)/gi, "")
          .trim();
        if (h1.length > 2 && h1.length < 80) return h1;
      }
    } catch {
      // tag extraction failed
    }

    // Strategy 4: <title> tag
    try {
      const title = extractTitle(html);
      if (title) {
        const cleaned = title.replace(/\s*[-|].*/g, "").trim();
        if (cleaned.length > 2 && cleaned.length < 80) return cleaned;
      }
    } catch {
      // title extraction failed
    }

    // Strategy 5: Generic JSON-LD name
    for (const item of jsonLd) {
      if (item.name && typeof item.name === "string") {
        const n = cleanText(item.name);
        if (n.length > 2 && n.length < 100) return n;
      }
    }

    return null;
  }

  // ─── Builder Name ────────────────────────────────────────────────────

  private extractBuilderName(
    html: string,
    domain: string,
    jsonLd: Record<string, any>[],
  ): string | null {
    // Strategy 1: Known domain map
    const domainMap: Record<string, string> = {
      "lennar.com": "Lennar",
      "richmondamerican.com": "Richmond American",
      "meritagehomes.com": "Meritage Homes",
      "taylormorrison.com": "Taylor Morrison",
      "kbhome.com": "KB Home",
      "tollbrothers.com": "Toll Brothers",
      "sheahomes.com": "Shea Homes",
      "drhorton.com": "D.R. Horton",
      "oakwoodhomesco.com": "Oakwood Homes",
      "dreamfindershomes.com": "Dream Finders Homes",
      "centurycommunities.com": "Century Communities",
      "tripointehomes.com": "Tri Pointe Homes",
      "challengerhomes.com": "Challenger Homes",
      "pulte.com": "Pulte Homes",
      "dfrailings.com": "David Weekley Homes",
      "davidweekleyhomes.com": "David Weekley Homes",
      "newtownbuilders.com": "Newtown Builders",
      "lokal-homes.com": "Lokal Homes",
      "centuryhomebuilders.com": "Century Homebuilders",
      "classiccommunities.com": "Classic Communities",
    };

    for (const [d, name] of Object.entries(domainMap)) {
      if (domain.includes(d)) return name;
    }

    // Strategy 2: JSON-LD Organization / brand
    for (const item of jsonLd) {
      if (item["@type"] === "Organization" && item.name) return cleanText(item.name);
      if (item.brand?.name) return cleanText(item.brand.name);
      if (item.provider?.name) return cleanText(item.provider.name);
    }

    // Strategy 3: meta author
    const author = extractMeta(html, "author");
    if (author && author.length > 2 && author.length < 80) return author.trim();

    // Strategy 4: og:site_name
    const siteName = extractMeta(html, "og:site_name");
    if (siteName && siteName.length > 2 && siteName.length < 80) return siteName.trim();

    // Strategy 5: Title suffix (after "|" or "-")
    try {
      const title = extractTitle(html);
      if (title) {
        const parts = title.split(/\s*[|\u2013\u2014-]\s*/);
        if (parts.length >= 2) {
          const last = parts[parts.length - 1].trim();
          if (last.length > 2 && last.length < 80) return last;
        }
      }
    } catch {
      // ignore
    }

    // Strategy 6: Footer copyright
    const footerMatch = html.match(
      /(?:copyright|\u00a9|&copy;)\s*(?:\d{4}\s+)?([A-Z][A-Za-z\s.]+(?:Homes?|Builders?|Communities))/i,
    );
    if (footerMatch) return footerMatch[1].trim();

    return null;
  }

  // ─── Location ────────────────────────────────────────────────────────

  private extractLocation(
    text: string,
    html: string,
    jsonLd: Record<string, any>[],
  ): { city: string | null; state: string | null; address: string | null; zip: string | null } {
    let city: string | null = null;
    let state: string | null = null;
    let address: string | null = null;
    let zip: string | null = null;

    // Strategy 1: JSON-LD structured address
    for (const item of jsonLd) {
      const addr = item.address || item.location?.address;
      if (addr) {
        city = addr.addressLocality || city;
        state = addr.addressRegion || state;
        zip = addr.postalCode || zip;
        if (addr.streetAddress) address = addr.streetAddress;
        if (city) break;
      }
    }

    // Strategy 2: <address> elements
    if (!city) {
      try {
        const addressTexts = extractTextBetweenTags(html, "address");
        for (const addr of addressTexts) {
          const parsed = this.parseCityState(cleanText(addr));
          if (parsed.city) {
            city = parsed.city;
            state = parsed.state || state;
            zip = parsed.zip || zip;
            break;
          }
        }
      } catch {
        // ignore
      }
    }

    // Strategy 3: Breadcrumbs
    if (!city) {
      const breadcrumbRe = /<[^>]*class\s*=\s*["'][^"']*breadcrumb[^"']*["'][^>]*>([\s\S]*?)<\/(?:nav|ol|ul|div)>/gi;
      let m: RegExpExecArray | null;
      while (!city && (m = breadcrumbRe.exec(html)) !== null) {
        const parsed = this.parseCityState(cleanText(stripHtml(m[1])));
        if (parsed.city) {
          city = parsed.city;
          state = parsed.state || state;
        }
      }
    }

    // Strategy 4: "City, Full-State-Name" pattern
    if (!city) {
      resetRegex(CITY_FULL_STATE);
      const m = CITY_FULL_STATE.exec(text);
      if (m) {
        city = m[1].trim();
        const stateKey = m[2].toLowerCase().trim();
        state = STATE_FULL_TO_ABBR[stateKey] || m[2].trim();
      }
    }

    // Strategy 5: "City, ST ZIP" pattern across text
    if (!city) {
      const parsed = this.parseCityState(text);
      city = parsed.city || city;
      state = parsed.state || state;
      zip = parsed.zip || zip;
    }

    // Strategy 6: meta description
    if (!city) {
      const metaDesc = extractMeta(html, "description") || "";
      const parsed = this.parseCityState(metaDesc);
      city = parsed.city || city;
      state = parsed.state || state;
    }

    // Strategy 7: Street address
    if (!address) {
      const addrMatch = ADDRESS_PATTERN.exec(text);
      if (addrMatch) address = addrMatch[0].trim();
      ADDRESS_PATTERN.lastIndex = 0;
    }

    return { city, state, address, zip };
  }

  private parseCityState(
    text: string,
  ): { city: string | null; state: string | null; zip: string | null } {
    // "City, ST 80123"
    resetRegex(CITY_STATE_ZIP);
    let m: RegExpExecArray | null;
    while ((m = CITY_STATE_ZIP.exec(text)) !== null) {
      const abbr = m[2].toUpperCase();
      if (STATE_ABBR_SET.has(abbr)) {
        return { city: m[1].trim(), state: abbr, zip: m[3] || null };
      }
    }
    return { city: null, state: null, zip: null };
  }

  // ─── Price ───────────────────────────────────────────────────────────

  private extractPriceText(plainText: string, html: string): string | null {
    // Strategy 1: Price-related elements in HTML
    const priceElRe = /<[^>]*class\s*=\s*["'][^"']*price[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/gi;
    let m: RegExpExecArray | null;
    while ((m = priceElRe.exec(html)) !== null) {
      const t = cleanText(stripHtml(m[1]));
      if (/\$\d/.test(t)) return t;
    }

    // Strategy 2: Iterate price patterns against plain text
    for (const pattern of PRICE_PATTERNS) {
      const match = execFirst(pattern, plainText);
      if (match) return match[0].trim();
    }

    return null;
  }

  // ─── Specs ───────────────────────────────────────────────────────────

  private extractSpecs(
    text: string,
  ): { beds: string | null; baths: string | null; sqft: string | null } {
    const beds = (execFirst(BEDS_RANGE, text) || execFirst(BEDS_SINGLE, text));
    const baths = (execFirst(BATHS_RANGE, text) || execFirst(BATHS_SINGLE, text));
    const sqft = (execFirst(SQFT_RANGE, text) || execFirst(SQFT_SINGLE, text));

    return {
      beds: beds ? beds[0].trim() : null,
      baths: baths ? baths[0].trim() : null,
      sqft: sqft ? sqft[0].trim() : null,
    };
  }

  // ─── Status ──────────────────────────────────────────────────────────

  private extractStatusRaw(text: string): string | null {
    const lower = text.toLowerCase();
    for (const [status, keywords] of Object.entries(STATUS_MAP)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) return status;
      }
    }
    return null;
  }

  // ─── Description ─────────────────────────────────────────────────────

  private extractDescription(html: string, jsonLd: Record<string, any>[]): string | null {
    // Strategy 1: JSON-LD description
    for (const item of jsonLd) {
      if (item.description && typeof item.description === "string" && item.description.length > 30) {
        return cleanText(item.description);
      }
    }

    // Strategy 2: og:description
    const ogDesc = extractMeta(html, "og:description");
    if (ogDesc && ogDesc.length > 30) return cleanText(ogDesc);

    // Strategy 3: meta description
    const metaDesc = extractMeta(html, "description");
    if (metaDesc && metaDesc.length > 30) return cleanText(metaDesc);

    // Strategy 4: First substantial paragraph
    try {
      const paragraphs = extractTextBetweenTags(html, "p");
      for (const p of paragraphs) {
        const t = cleanText(p);
        if (t.length > 50 && t.length < 1500) {
          // Skip boilerplate
          if (!/^(?:copyright|all rights reserved|privacy|terms|cookie)/i.test(t)) {
            return t;
          }
        }
      }
    } catch {
      // ignore
    }

    return null;
  }

  // ─── Amenities ───────────────────────────────────────────────────────

  private extractAmenities(plainText: string, html: string): string | null {
    // Strategy 1: HTML sections with amenity class/heading followed by a list
    const sectionRe = /<(?:div|section)[^>]*class\s*=\s*["'][^"']*amenit[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section)>/gi;
    let m: RegExpExecArray | null;
    while ((m = sectionRe.exec(html)) !== null) {
      try {
        const listItems = extractTextBetweenTags(m[1], "li");
        if (listItems.length > 0) {
          const items = listItems
            .map((i) => cleanText(i))
            .filter((i) => i.length > 2 && i.length < 100);
          if (items.length > 0) return items.join(", ");
        }
      } catch {
        // ignore
      }
    }

    // Strategy 2: Plain text near "amenities" keyword
    const lower = plainText.toLowerCase();
    const idx = lower.indexOf("amenities");
    if (idx === -1) {
      // Also try "community features"
      const idx2 = lower.indexOf("community features");
      if (idx2 !== -1) {
        const snippet = plainText.slice(idx2, idx2 + 400).trim();
        return snippet.length > 10 ? snippet.slice(0, 300) : null;
      }
      return null;
    }

    const snippet = plainText.slice(idx, idx + 500);
    return snippet.length > 10 ? snippet.slice(0, 300) : null;
  }

  // ─── School Info ─────────────────────────────────────────────────────

  private extractSchoolInfo(text: string): string | null {
    const patterns = [
      /(?:school\s+district|schools?):\s*([^\n.]+)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:School\s+District|USD|RE-\d+))/,
    ];
    for (const p of patterns) {
      const m = p.exec(text);
      if (m) return m[1].trim();
    }
    return null;
  }

  // ─── Model Names ─────────────────────────────────────────────────────

  private extractModelNames(text: string): string | null {
    const lower = text.toLowerCase();
    const idx = lower.indexOf("floor plan");
    if (idx !== -1) return text.slice(idx, idx + 200).trim();
    const idx2 = lower.indexOf("model");
    if (idx2 !== -1) return text.slice(idx2, idx2 + 200).trim();
    return null;
  }

  // ─── Home Types ──────────────────────────────────────────────────────

  private extractHomeTypes(text: string): string | null {
    const types: string[] = [];
    const keywords = [
      "single-family", "single family", "townhome", "townhouse",
      "condo", "condominium", "paired home", "duplex", "ranch",
      "two-story", "two story", "estate", "villa", "patio home",
      "attached", "detached", "multi-family",
    ];
    const lower = text.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw)) types.push(kw);
    }
    return types.length > 0 ? types.join(", ") : null;
  }

  // ─── HOA ─────────────────────────────────────────────────────────────

  private extractHoaText(text: string): string | null {
    const match = execFirst(HOA_PATTERN, text);
    return match ? match[0].trim() : null;
  }

  // ─── Quick Move-In ───────────────────────────────────────────────────

  private detectQuickMoveIn(text: string): boolean {
    const lower = text.toLowerCase();
    return (
      lower.includes("quick move") ||
      lower.includes("move-in ready") ||
      lower.includes("move in ready") ||
      lower.includes("immediate occupancy")
    );
  }

  // ─── Source Type ─────────────────────────────────────────────────────

  private detectSourceType(url: string, text: string): SourceType {
    const lower = url.toLowerCase();
    if (lower.includes("quick-move") || lower.includes("move-in"))
      return "quick_move_in" as SourceType;
    if (lower.includes("community") || lower.includes("neighborhood"))
      return "community_page" as SourceType;
    if (lower.includes("new-homes") || lower.includes("newhomes"))
      return "builder_website" as SourceType;
    return "builder_website" as SourceType;
  }

  // ─── Utility ─────────────────────────────────────────────────────────

  private safeDomain(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }
}
