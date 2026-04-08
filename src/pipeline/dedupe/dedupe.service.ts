import { CommunityRecord, DedupeMatch, GeoPoint } from "../types";
import { logger } from "../utils/logger";

const WEIGHTS = {
  name: 0.35,
  builder: 0.25,
  city: 0.15,
  geo: 0.15,
  address: 0.1,
} as const;

const DUPLICATE_THRESHOLD = 0.75;
const REVIEW_THRESHOLD = 0.5;
const GEO_PROXIMITY_MILES = 0.5;

export class DedupeService {
  findDuplicates(records: CommunityRecord[]): DedupeMatch[] {
    const matches: DedupeMatch[] = [];

    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        const { score, reasons } = this.calculateSimilarity(
          records[i],
          records[j]
        );

        if (score >= REVIEW_THRESHOLD) {
          matches.push({
            record_a_id: records[i].id,
            record_b_id: records[j].id,
            similarity_score: score,
            match_reasons: reasons,
            recommended_action:
              score >= DUPLICATE_THRESHOLD ? "merge" : "review",
          });
        }
      }
    }

    matches.sort((a, b) => b.similarity_score - a.similarity_score);

    logger.info(
      "dedupe",
      `Found ${matches.filter((m) => m.recommended_action === "merge").length} duplicates, ` +
        `${matches.filter((m) => m.recommended_action === "review").length} for review`
    );

    return matches;
  }

  mergeRecords(
    records: CommunityRecord[],
    matches: DedupeMatch[]
  ): CommunityRecord[] {
    const mergedAway = new Set<string>();
    const recordMap = new Map<string, CommunityRecord>();

    for (const r of records) {
      recordMap.set(r.id, { ...r });
    }

    const duplicates = matches.filter((m) => m.recommended_action === "merge");

    for (const match of duplicates) {
      if (mergedAway.has(match.record_a_id) || mergedAway.has(match.record_b_id))
        continue;

      const a = recordMap.get(match.record_a_id);
      const b = recordMap.get(match.record_b_id);
      if (!a || !b) continue;

      const [primary, secondary] = this.pickPrimary(a, b);
      const merged = this.mergeTwo(primary, secondary);

      recordMap.set(primary.id, merged);
      recordMap.delete(secondary.id);
      mergedAway.add(secondary.id);
    }

    return records
      .filter((r) => !mergedAway.has(r.id))
      .map((r) => recordMap.get(r.id) ?? r);
  }

  private calculateSimilarity(
    a: CommunityRecord,
    b: CommunityRecord
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Name similarity
    const nameScore = this.stringSimilarity(
      this.normalizeForComparison(a.community_name),
      this.normalizeForComparison(b.community_name)
    );
    score += nameScore * WEIGHTS.name;
    if (nameScore > 0.7) {
      reasons.push(`Name similarity: ${(nameScore * 100).toFixed(0)}%`);
    }

    // Builder match
    const builderA = this.normalizeForComparison(a.builder_name);
    const builderB = this.normalizeForComparison(b.builder_name);
    if (builderA === builderB && builderA) {
      score += WEIGHTS.builder;
      reasons.push(`Same builder: ${a.builder_name}`);
    }

    // City match
    const cityA = this.normalizeForComparison(a.city);
    const cityB = this.normalizeForComparison(b.city);
    if (cityA === cityB && cityA) {
      score += WEIGHTS.city;
      reasons.push(`Same city: ${a.city}`);
    }

    // Geo proximity
    if (this.isGeoClose(a, b, GEO_PROXIMITY_MILES)) {
      score += WEIGHTS.geo;
      reasons.push(`Within ${GEO_PROXIMITY_MILES} miles`);
    }

    // Address match
    if (a.street_address && b.street_address) {
      const addrScore = this.stringSimilarity(
        this.normalizeForComparison(a.street_address),
        this.normalizeForComparison(b.street_address)
      );
      score += addrScore * WEIGHTS.address;
      if (addrScore > 0.7) {
        reasons.push(`Address similarity: ${(addrScore * 100).toFixed(0)}%`);
      }
    }

    return { score: Math.min(score, 1), reasons };
  }

  private normalizeForComparison(s: string): string {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(
        /\b(the|at|of|in|by|and|community|homes|residence|residences)\b/g,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();
  }

  private isGeoClose(
    a: CommunityRecord,
    b: CommunityRecord,
    thresholdMiles: number
  ): boolean {
    if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return false;

    const distance = haversineDistance(
      { latitude: a.latitude, longitude: a.longitude },
      { latitude: b.latitude, longitude: b.longitude }
    );
    return distance <= thresholdMiles;
  }

  private stringSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (!a || !b) return 0;

    const bigramsA = toBigrams(a);
    const bigramsB = toBigrams(b);

    if (bigramsA.size === 0 && bigramsB.size === 0) return 1;
    if (bigramsA.size === 0 || bigramsB.size === 0) return 0;

    let intersection = 0;
    for (const bg of bigramsA) {
      if (bigramsB.has(bg)) intersection++;
    }

    return (2 * intersection) / (bigramsA.size + bigramsB.size);
  }

  private pickPrimary(
    a: CommunityRecord,
    b: CommunityRecord
  ): [CommunityRecord, CommunityRecord] {
    let scoreA = 0;
    let scoreB = 0;

    if (a.extraction_confidence > b.extraction_confidence) scoreA++;
    else if (b.extraction_confidence > a.extraction_confidence) scoreB++;

    if (a.image_urls.length > b.image_urls.length) scoreA++;
    else if (b.image_urls.length > a.image_urls.length) scoreB++;

    const descA = a.community_description?.length ?? 0;
    const descB = b.community_description?.length ?? 0;
    if (descA > descB) scoreA++;
    else if (descB > descA) scoreB++;

    return scoreA >= scoreB ? [a, b] : [b, a];
  }

  private mergeTwo(
    primary: CommunityRecord,
    secondary: CommunityRecord
  ): CommunityRecord {
    const merged = { ...primary };

    // Fill nulls from secondary
    if (!merged.street_address && secondary.street_address)
      merged.street_address = secondary.street_address;
    if (!merged.zip_code && secondary.zip_code)
      merged.zip_code = secondary.zip_code;
    if (!merged.latitude && secondary.latitude)
      merged.latitude = secondary.latitude;
    if (!merged.longitude && secondary.longitude)
      merged.longitude = secondary.longitude;
    if (!merged.community_description && secondary.community_description)
      merged.community_description = secondary.community_description;
    if (!merged.school_info && secondary.school_info)
      merged.school_info = secondary.school_info;

    // Combine images
    merged.image_urls = [
      ...new Set([...primary.image_urls, ...secondary.image_urls]),
    ];

    // Use longer description
    if (
      secondary.community_description &&
      (!primary.community_description ||
        secondary.community_description.length >
          primary.community_description.length)
    ) {
      merged.community_description = secondary.community_description;
    }

    merged.duplicate_of = null;
    merged.updated_at = new Date().toISOString();

    return merged;
  }
}

// Helpers
function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toBigrams(s: string): Set<string> {
  const bigrams = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) {
    bigrams.add(s.substring(i, i + 2));
  }
  return bigrams;
}
