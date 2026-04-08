export interface Community {
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
}

export interface Listing {
  id: string;
  address: string;
  slug: string;
  communityId: string;
  communityName: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  builder: string;
  completionDate: string;
  image: string;
  images: string[];
  shortNote: string;
  status: "available" | "under-contract" | "move-in-ready" | "pre-construction";
  lotSize: string;
  garage: string;
  stories: number;
  modelName: string;
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  category: "community-tour" | "builder-comparison" | "buying-tips" | "area-guide" | "market-update";
  area: string;
  builder: string | null;
  communitySlug: string | null;
  publishedAt: string;
  duration: string;
  featured: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetArea: string;
  budget: string;
  timeline: "0-3-months" | "3-6-months" | "6-12-months" | "12-plus-months";
  message: string;
  source: string;
  createdAt: string;
}

export interface FilterState {
  city: string;
  priceMin: number | null;
  priceMax: number | null;
  builder: string;
  beds: number | null;
  baths: number | null;
  status: string;
  category: string;
  area: string;
}
