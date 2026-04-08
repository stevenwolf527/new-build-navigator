import { Community } from "@/types";

export const communities: Community[] = [
  {
    id: "1",
    slug: "terrain-castle-rock",
    name: "Terrain",
    city: "Castle Rock",
    area: "South Denver Metro",
    builders: ["Richmond American", "Meritage Homes", "Taylor Morrison"],
    priceRange: { min: 525000, max: 825000 },
    status: "active",
    hoa: { monthly: 85, includes: ["Common areas", "Parks", "Trail maintenance"] },
    homeTypes: ["Single-family", "Ranch", "Two-story"],
    shortDescription: "Master-planned community with mountain views and top-rated Douglas County schools.",
    longDescription:
      "Terrain in Castle Rock is one of the most popular master-planned communities along the I-25 corridor south of Denver. With multiple builders offering a wide range of floor plans, Terrain appeals to families, move-up buyers, and anyone who wants quick access to both Denver and Colorado Springs. The community features extensive trail systems, parks, and a future community center. Proximity to The Meadows shopping and dining adds to everyday convenience.",
    pros: [
      "Multiple builder options create competitive pricing",
      "Mountain views from many homesites",
      "Top-rated Douglas County School District",
      "Extensive trail system and parks",
      "Easy I-25 access for commuters",
    ],
    cons: [
      "HOA covenants are strict on exterior modifications",
      "Some homesites back to major roads",
      "Can get windy on the mesa",
      "Limited lot sizes on entry-level plans",
    ],
    notes: [
      "Ask about builder incentives — they rotate monthly and can save $15K–$30K",
      "Phase 3 lots tend to have the best mountain views",
      "Richmond American has been the most aggressive on closing cost credits here",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    featuredVideo: "dQw4w9WgXcQ",
    featured: true,
    yearEstablished: 2019,
    totalHomes: 1200,
    schoolDistrict: "Douglas County RE-1",
    amenities: ["Trails", "Parks", "Playground", "Community Center (planned)", "Dog Park"],
  },
  {
    id: "2",
    slug: "pinery-west-parker",
    name: "Pinery West",
    city: "Parker",
    area: "Parker / Elizabeth Corridor",
    builders: ["Toll Brothers", "Lennar"],
    priceRange: { min: 625000, max: 975000 },
    status: "active",
    hoa: { monthly: 110, includes: ["Pool", "Clubhouse", "Common areas", "Snow removal"] },
    homeTypes: ["Single-family", "Estate lots"],
    shortDescription: "Upscale community near Parker with large lots and premium builder options.",
    longDescription:
      "Pinery West offers one of the most desirable new construction experiences in the Parker area. With larger-than-average lots and premium builders like Toll Brothers and Lennar, this community targets move-up and executive buyers who want space without sacrificing proximity to Parker's restaurants, shopping, and recreation. The Pinery Country Club is nearby, and the community's rolling terrain gives many homes a secluded, semi-rural feel while still being minutes from Mainstreet Parker.",
    pros: [
      "Generous lot sizes — many over 1/4 acre",
      "Toll Brothers quality and customization options",
      "Close to Parker Mainstreet dining and shopping",
      "Mature trees and rolling terrain",
      "Access to Cherry Creek Trail system",
    ],
    cons: [
      "Higher price point limits first-time buyer access",
      "HOA fees are above average for the area",
      "Limited inventory — lots sell quickly",
      "Some roads in the area can be congested during school hours",
    ],
    notes: [
      "Toll Brothers often runs design center incentives worth $20K–$50K in upgrades",
      "If budget is a concern, Lennar's Everything's Included packages offer better base value",
      "Ask about lot premiums — backing to open space can add $30K–$60K",
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    ],
    featuredVideo: null,
    featured: true,
    yearEstablished: 2021,
    totalHomes: 450,
    schoolDistrict: "Douglas County RE-1",
    amenities: ["Pool", "Clubhouse", "Trails", "Playground", "Tennis Courts"],
  },
  {
    id: "3",
    slug: "painted-prairie-aurora",
    name: "Painted Prairie",
    city: "Aurora",
    area: "Southeast Aurora",
    builders: ["Oakwood Homes", "Dream Finders Homes", "Richmond American"],
    priceRange: { min: 425000, max: 685000 },
    status: "active",
    hoa: { monthly: 65, includes: ["Common areas", "Parks", "Community events"] },
    homeTypes: ["Single-family", "Paired homes", "Townhomes"],
    shortDescription: "Fast-growing Aurora community with diverse price points and a strong sense of place.",
    longDescription:
      "Painted Prairie is Aurora's answer to the master-planned community trend, and it's executing well. With a mix of product types from townhomes to single-family homes, the community offers genuine attainability in a market where that's increasingly rare. The commercial village is growing with restaurants and retail, and the community's design emphasizes walkability and gathering spaces. For buyers priced out of Parker or Castle Rock, Painted Prairie delivers a compelling alternative with faster commute access to DIA and the Anschutz Medical Campus.",
    pros: [
      "Most attainable price point in the southeast metro",
      "Multiple product types for different budgets",
      "Growing commercial village with restaurants and retail",
      "Quick access to DIA and Anschutz Medical Campus",
      "Strong community programming and events",
    ],
    cons: [
      "Still building out — construction traffic is constant",
      "Some areas feel exposed with limited mature landscaping",
      "School assignments may shift as the area grows",
      "Highway noise affects some homesites near E-470",
    ],
    notes: [
      "Oakwood Homes tends to have the best entry-level pricing here",
      "Dream Finders has been offering rate buydowns — ask about current programs",
      "The paired homes are a strong value play for the square footage you get",
    ],
    images: [
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
    featuredVideo: "dQw4w9WgXcQ",
    featured: true,
    yearEstablished: 2018,
    totalHomes: 3000,
    schoolDistrict: "Cherry Creek School District",
    amenities: ["Parks", "Trails", "Community Garden", "Event Lawn", "Playground", "Commercial Village"],
  },
  {
    id: "4",
    slug: "meridian-village-parker",
    name: "Meridian Village",
    city: "Parker",
    area: "South Parker",
    builders: ["Shea Homes", "KB Home"],
    priceRange: { min: 475000, max: 720000 },
    status: "active",
    hoa: { monthly: 75, includes: ["Common areas", "Pool", "Parks"] },
    homeTypes: ["Single-family", "Ranch", "Two-story"],
    shortDescription: "Well-located Parker community with diverse floor plans and strong school access.",
    longDescription:
      "Meridian Village sits in an ideal spot in Parker, offering quick access to both Mainstreet Parker and the Meridian commercial district. Shea Homes and KB Home provide different approaches — Shea tends toward higher-end finishes while KB offers strong base value. The community has a completed pool and park system, meaning you're not waiting years for amenities. For families, the school assignments here are among the best in the area.",
    pros: [
      "Amenities are already built — pool, parks, and trails are complete",
      "Strong school assignments in Douglas County",
      "Close to Meridian shopping and dining",
      "Shea Homes offers premium design options",
      "Good mix of ranch and two-story plans",
    ],
    cons: [
      "KB Home base specs can feel dated without upgrades",
      "Lot sizes are tighter than older Parker neighborhoods",
      "Parker Road traffic during rush hour",
      "Limited remaining inventory in desirable phases",
    ],
    notes: [
      "Shea's Trilogy-style ranch plans are popular with 55+ buyers but open to all ages",
      "KB Home incentives can be significant — always ask for rate buydown AND closing costs",
      "Phase 4 has the best remaining lots for mountain views",
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    ],
    featuredVideo: null,
    featured: false,
    yearEstablished: 2020,
    totalHomes: 800,
    schoolDistrict: "Douglas County RE-1",
    amenities: ["Pool", "Trails", "Parks", "Playground", "Pickleball Courts"],
  },
  {
    id: "5",
    slug: "sterling-ranch-littleton",
    name: "Sterling Ranch",
    city: "Littleton",
    area: "South Denver Metro",
    builders: ["Shea Homes", "Richmond American", "Taylor Morrison", "Meritage Homes"],
    priceRange: { min: 550000, max: 950000 },
    status: "active",
    hoa: { monthly: 95, includes: ["Common areas", "Technology infrastructure", "Parks", "Events"] },
    homeTypes: ["Single-family", "Paired homes", "Estate lots"],
    shortDescription: "Tech-forward master-planned community with mountain views and innovative design.",
    longDescription:
      "Sterling Ranch is one of Colorado's most ambitious master-planned communities, billing itself as a 'smart community' with built-in technology infrastructure. Located in the foothills near Roxborough State Park, the setting is genuinely stunning. Multiple builders offer a range of price points, and the community's commitment to sustainable design and trail connectivity sets it apart. It's a strong option for buyers who want a newer, more intentional community feel without moving to the exurbs.",
    pros: [
      "Stunning foothill location near Roxborough State Park",
      "Technology infrastructure built into the community",
      "Multiple builder options for price flexibility",
      "Extensive trail system connecting to regional trails",
      "Community events and programming are genuinely good",
    ],
    cons: [
      "Commute to downtown Denver can be long during rush hour",
      "Higher price points than communities further east",
      "Still in heavy development — some areas are under construction",
      "Limited nearby commercial — Meadows or Park Meadows are the closest major retail",
    ],
    notes: [
      "The Shea Homes Canyons collection has some of the best views in the entire metro",
      "Taylor Morrison has been running strong incentive packages recently",
      "Ask about the community technology package — it's included but worth understanding",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    ],
    featuredVideo: "dQw4w9WgXcQ",
    featured: true,
    yearEstablished: 2017,
    totalHomes: 12000,
    schoolDistrict: "Douglas County RE-1",
    amenities: ["Trails", "Parks", "Community Center", "Pool", "Dog Park", "Smart Home Tech"],
  },
  {
    id: "6",
    slug: "reunion-commerce-city",
    name: "Reunion",
    city: "Commerce City",
    area: "Northeast Denver Metro",
    builders: ["Oakwood Homes", "Richmond American", "Century Communities"],
    priceRange: { min: 400000, max: 600000 },
    status: "active",
    hoa: { monthly: 55, includes: ["Common areas", "Recreation center", "Pools"] },
    homeTypes: ["Single-family", "Townhomes", "Paired homes"],
    shortDescription: "Established master-planned community with resort-style amenities and attainable pricing.",
    longDescription:
      "Reunion is one of the most established master-planned communities in the northeast Denver metro, and it continues to deliver strong value. The recreation center is one of the best in any Colorado community, with resort-style pools, fitness facilities, and programming. New phases continue to release, and the commercial areas are maturing. For buyers who want amenity-rich living at a more attainable price point than the southern suburbs, Reunion deserves serious consideration.",
    pros: [
      "Outstanding recreation center and pool complex",
      "Most attainable pricing in the Denver metro for a master-planned community",
      "Established community with mature landscaping in earlier phases",
      "Quick access to DIA and I-76",
      "Multiple builders create competitive pricing",
    ],
    cons: [
      "Commerce City address can affect resale perception",
      "Train noise affects some homesites",
      "Further from mountain recreation than south metro communities",
      "School ratings are mixed compared to Douglas County",
    ],
    notes: [
      "The rec center alone makes this community worth touring",
      "Century Communities has some of the best entry-level floor plans here",
      "Don't overlook the paired homes — they're spacious and well-designed",
    ],
    images: [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
    featuredVideo: null,
    featured: false,
    yearEstablished: 2003,
    totalHomes: 8000,
    schoolDistrict: "Adams 27J",
    amenities: ["Recreation Center", "Pools", "Fitness Center", "Trails", "Parks", "Sports Fields"],
  },
];

export function getCommunityBySlug(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}

export function getFeaturedCommunities(): Community[] {
  return communities.filter((c) => c.featured);
}

export function getCommunities(): Community[] {
  return communities;
}

export function getUniqueCities(): string[] {
  return [...new Set(communities.map((c) => c.city))].sort();
}

export function getUniqueBuilders(): string[] {
  return [...new Set(communities.flatMap((c) => c.builders))].sort();
}
