import { CommunityRecord, GeocodingResult, GeoPoint } from "../types";
import { pipelineConfig } from "../config/pipeline.config";
import { logger } from "../utils/logger";

export interface GeocodingProvider {
  geocode(
    address: string,
    city: string,
    state: string
  ): Promise<GeocodingResult | null>;
}

class NominatimProvider implements GeocodingProvider {
  private lastRequest = 0;

  async geocode(
    address: string,
    city: string,
    state: string
  ): Promise<GeocodingResult | null> {
    const now = Date.now();
    if (now - this.lastRequest < 1100) {
      await new Promise((r) => setTimeout(r, 1100 - (now - this.lastRequest)));
    }
    this.lastRequest = Date.now();

    const query = [address, city, state, "USA"].filter(Boolean).join(", ");

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url, {
        headers: { "User-Agent": pipelineConfig.user_agent },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) return null;

      const data = (await response.json()) as Array<{
        lat: string;
        lon: string;
        display_name: string;
      }>;

      if (!data || data.length === 0) return null;

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        formatted_address: data[0].display_name,
        confidence: 0.7,
        provider: "nominatim",
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn("geocoding", `Nominatim error for "${query}": ${msg}`);
      return null;
    }
  }
}

export class GeocodingService {
  private provider: GeocodingProvider;
  private cache = new Map<string, GeocodingResult>();

  constructor(provider?: GeocodingProvider) {
    this.provider = provider || new NominatimProvider();
  }

  async geocodeRecord(record: CommunityRecord): Promise<CommunityRecord> {
    if (record.latitude && record.longitude) {
      return record;
    }

    const query = [record.street_address, record.city, record.state]
      .filter(Boolean)
      .join(", ");

    if (this.cache.has(query)) {
      const cached = this.cache.get(query)!;
      return { ...record, latitude: cached.latitude, longitude: cached.longitude };
    }

    const result = await this.provider.geocode(
      record.street_address || "",
      record.city,
      record.state
    );

    if (result) {
      this.cache.set(query, result);
      return { ...record, latitude: result.latitude, longitude: result.longitude };
    }

    logger.warn("geocoding", `Could not geocode: ${record.community_name}`);
    return record;
  }

  static haversineDistance(a: GeoPoint, b: GeoPoint): number {
    const R = 3959;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  filterByRadius(records: CommunityRecord[]): CommunityRecord[] {
    return records.filter((r) => {
      if (!r.latitude || !r.longitude) return true;
      if (!r.distance_from_denver_miles) return true;
      return r.distance_from_denver_miles <= pipelineConfig.radius_miles;
    });
  }

  calculateDistances(records: CommunityRecord[]): CommunityRecord[] {
    return records.map((r) => {
      if (!r.latitude || !r.longitude) return r;
      const distance = GeocodingService.haversineDistance(
        pipelineConfig.denver_center,
        { latitude: r.latitude, longitude: r.longitude }
      );
      return { ...r, distance_from_denver_miles: Math.round(distance * 10) / 10 };
    });
  }
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
