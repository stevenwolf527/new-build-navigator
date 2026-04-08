import { Video } from "@/types";

export const videos: Video[] = [
  {
    id: "1",
    youtubeId: "dQw4w9WgXcQ",
    title: "Castle Rock New Construction Tour: Terrain Community 2026",
    description:
      "Full walkthrough of the Terrain community in Castle Rock. We cover pricing, builder options, pros and cons, and what you need to know before buying here.",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    category: "community-tour",
    area: "Castle Rock",
    builder: null,
    communitySlug: "terrain-castle-rock",
    publishedAt: "2026-03-15",
    duration: "18:42",
    featured: true,
  },
  {
    id: "2",
    youtubeId: "dQw4w9WgXcQ",
    title: "Parker vs Castle Rock: Which is Better for New Builds?",
    description:
      "Comparing two of the hottest new construction markets in Colorado. We break down pricing, schools, commute times, and builder options in both cities.",
    thumbnail: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    category: "area-guide",
    area: "Parker",
    builder: null,
    communitySlug: null,
    publishedAt: "2026-03-08",
    duration: "22:15",
    featured: true,
  },
  {
    id: "3",
    youtubeId: "dQw4w9WgXcQ",
    title: "Painted Prairie Aurora: Best Value New Construction?",
    description:
      "Is Painted Prairie the best value for new construction in the Denver metro? We tour the community, compare builders, and share our honest take.",
    thumbnail: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
    category: "community-tour",
    area: "Aurora",
    builder: null,
    communitySlug: "painted-prairie-aurora",
    publishedAt: "2026-02-28",
    duration: "15:30",
    featured: true,
  },
  {
    id: "4",
    youtubeId: "dQw4w9WgXcQ",
    title: "Richmond American vs Meritage Homes: Builder Comparison",
    description:
      "Head-to-head comparison of two major Colorado builders. We cover build quality, standard features, pricing, incentives, and customer experience.",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    category: "builder-comparison",
    area: "Denver Metro",
    builder: "Richmond American",
    communitySlug: null,
    publishedAt: "2026-02-20",
    duration: "25:10",
    featured: false,
  },
  {
    id: "5",
    youtubeId: "dQw4w9WgXcQ",
    title: "7 Mistakes Buyers Make With New Construction Homes",
    description:
      "Don't make these costly mistakes when buying a new build. From skipping inspections to ignoring incentive timelines, here's what to watch out for.",
    thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    category: "buying-tips",
    area: "Colorado",
    builder: null,
    communitySlug: null,
    publishedAt: "2026-02-10",
    duration: "19:45",
    featured: true,
  },
  {
    id: "6",
    youtubeId: "dQw4w9WgXcQ",
    title: "Sterling Ranch Tour: Is the Hype Worth It?",
    description:
      "Sterling Ranch bills itself as a smart community. We tour the homes, talk to residents, and give our honest assessment of whether it lives up to the marketing.",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    category: "community-tour",
    area: "Littleton",
    builder: null,
    communitySlug: "sterling-ranch-littleton",
    publishedAt: "2026-01-25",
    duration: "21:00",
    featured: false,
  },
  {
    id: "7",
    youtubeId: "dQw4w9WgXcQ",
    title: "How to Negotiate Builder Incentives in Colorado",
    description:
      "Builders are offering big incentives right now. Here's how to negotiate effectively, what to ask for, and when to push for more.",
    thumbnail: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    category: "buying-tips",
    area: "Colorado",
    builder: null,
    communitySlug: null,
    publishedAt: "2026-01-15",
    duration: "16:20",
    featured: false,
  },
  {
    id: "8",
    youtubeId: "dQw4w9WgXcQ",
    title: "Toll Brothers Parker: Luxury New Construction Walkthrough",
    description:
      "Inside look at Toll Brothers' latest offerings in Parker. Premium finishes, estate lots, and what the luxury price point gets you in today's market.",
    thumbnail: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    category: "community-tour",
    area: "Parker",
    builder: "Toll Brothers",
    communitySlug: "pinery-west-parker",
    publishedAt: "2026-01-05",
    duration: "20:30",
    featured: false,
  },
  {
    id: "9",
    youtubeId: "dQw4w9WgXcQ",
    title: "Colorado New Construction Market Update: Spring 2026",
    description:
      "What's happening in the Colorado new build market right now. Inventory levels, builder incentives, interest rates, and where we see opportunity.",
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    category: "market-update",
    area: "Colorado",
    builder: null,
    communitySlug: null,
    publishedAt: "2026-03-20",
    duration: "14:50",
    featured: true,
  },
  {
    id: "10",
    youtubeId: "dQw4w9WgXcQ",
    title: "SE Denver New Build Guide: Aurora, Parker & Castle Rock",
    description:
      "Complete guide to buying new construction in southeast Denver metro. We compare all the major communities, builders, and price points.",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    category: "area-guide",
    area: "SE Denver",
    builder: null,
    communitySlug: null,
    publishedAt: "2025-12-20",
    duration: "28:15",
    featured: false,
  },
];

export function getVideos(): Video[] {
  return videos;
}

export function getFeaturedVideos(): Video[] {
  return videos.filter((v) => v.featured);
}

export function getVideoCategories(): string[] {
  return [...new Set(videos.map((v) => v.category))].sort();
}

export function getVideoAreas(): string[] {
  return [...new Set(videos.map((v) => v.area))].sort();
}
