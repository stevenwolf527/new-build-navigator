import { BuilderSeed } from "../types";

export const builderSeeds: BuilderSeed[] = [
  // ── National Builders ───────────────────────────────────────────────

  {
    name: "Lennar",
    slug: "lennar",
    domain: "lennar.com",
    base_urls: [
      "https://www.lennar.com/new-homes/colorado",
      "https://www.lennar.com/new-homes/colorado/denver-metro",
    ],
    community_url_patterns: [
      "lennar\\.com/new-homes/colorado/[^/]+/[^/]+/[^/]+",
      "lennar\\.com/new-homes/colorado/[^/]+/[^/]+",
    ],
    category: "national",
    priority: 1,
    active: true,
    notes: "Largest US homebuilder. Also absorbed CalAtlantic communities.",
  },
  {
    name: "Richmond American",
    slug: "richmond-american",
    domain: "richmondamerican.com",
    base_urls: [
      "https://www.richmondamerican.com/colorado",
      "https://www.richmondamerican.com/colorado/denver-new-homes",
    ],
    community_url_patterns: [
      "richmondamerican\\.com/colorado/[^/]+/[^/]+",
      "richmondamerican\\.com/colorado/[^/]+/communities/",
    ],
    category: "national",
    priority: 1,
    active: true,
    notes: "MDC Holdings subsidiary. Major Denver-area presence.",
  },
  {
    name: "Meritage Homes",
    slug: "meritage-homes",
    domain: "meritagehomes.com",
    base_urls: [
      "https://www.meritagehomes.com/state/co",
      "https://www.meritagehomes.com/state/co/denver-metro-area",
    ],
    community_url_patterns: [
      "meritagehomes\\.com/state/co/[^/]+/[^/]+",
      "meritagehomes\\.com/state/co/[^/]+",
    ],
    category: "national",
    priority: 2,
    active: true,
    notes: "Energy-efficient focus. Expanding Denver metro footprint.",
  },
  {
    name: "Taylor Morrison",
    slug: "taylor-morrison",
    domain: "taylormorrison.com",
    base_urls: [
      "https://www.taylormorrison.com/new-homes/colorado",
      "https://www.taylormorrison.com/new-homes/colorado/denver",
    ],
    community_url_patterns: [
      "taylormorrison\\.com/new-homes/colorado/[^/]+/[^/]+",
      "taylormorrison\\.com/new-homes/colorado/[^/]+",
    ],
    category: "national",
    priority: 2,
    active: true,
    notes: "Growing presence in Colorado market.",
  },
  {
    name: "KB Home",
    slug: "kb-home",
    domain: "kbhome.com",
    base_urls: [
      "https://www.kbhome.com/new-homes/colorado",
      "https://www.kbhome.com/new-homes-denver",
    ],
    community_url_patterns: [
      "kbhome\\.com/new-homes/colorado/[^/]+",
      "kbhome\\.com/new-homes-[^/]+-colorado",
    ],
    category: "national",
    priority: 2,
    active: true,
    notes: "Built-to-order model. Present in Denver, Colorado Springs.",
  },
  {
    name: "Toll Brothers",
    slug: "toll-brothers",
    domain: "tollbrothers.com",
    base_urls: [
      "https://www.tollbrothers.com/luxury-homes-for-sale/Colorado",
    ],
    community_url_patterns: [
      "tollbrothers\\.com/luxury-homes-for-sale/Colorado/[^/]+",
    ],
    category: "national",
    priority: 3,
    active: true,
    notes: "Luxury segment. Selective communities in Denver metro.",
  },
  {
    name: "Shea Homes",
    slug: "shea-homes",
    domain: "sheahomes.com",
    base_urls: [
      "https://www.sheahomes.com/communities/co/",
    ],
    community_url_patterns: [
      "sheahomes\\.com/communities/co/[^/]+",
    ],
    category: "national",
    priority: 3,
    active: true,
    notes: "Active adult and family communities in Colorado.",
  },
  {
    name: "D.R. Horton",
    slug: "dr-horton",
    domain: "drhorton.com",
    base_urls: [
      "https://www.drhorton.com/colorado",
      "https://www.drhorton.com/colorado/denver",
    ],
    community_url_patterns: [
      "drhorton\\.com/colorado/[^/]+/[^/]+",
      "drhorton\\.com/colorado/[^/]+",
    ],
    category: "national",
    priority: 1,
    active: true,
    notes: "Largest US builder by volume. Broad Denver metro presence.",
  },

  // ── Regional / Local Builders ───────────────────────────────────────

  {
    name: "Oakwood Homes",
    slug: "oakwood-homes",
    domain: "oakwoodhomesco.com",
    base_urls: [
      "https://www.oakwoodhomesco.com/communities/",
    ],
    community_url_patterns: [
      "oakwoodhomesco\\.com/communities/[^/]+",
    ],
    category: "regional",
    priority: 1,
    active: true,
    notes: "Colorado-based. Strong in affordable new construction.",
  },
  {
    name: "Dream Finders Homes",
    slug: "dream-finders-homes",
    domain: "dreamfindershomes.com",
    base_urls: [
      "https://www.dreamfindershomes.com/communities/colorado",
    ],
    community_url_patterns: [
      "dreamfindershomes\\.com/communities/colorado/[^/]+",
    ],
    category: "regional",
    priority: 2,
    active: true,
    notes: "Growing national builder with Colorado expansion.",
  },
  {
    name: "Century Communities",
    slug: "century-communities",
    domain: "centurycommunities.com",
    base_urls: [
      "https://www.centurycommunities.com/find-your-home/colorado",
    ],
    community_url_patterns: [
      "centurycommunities\\.com/find-your-home/colorado/[^/]+/[^/]+",
      "centurycommunities\\.com/find-your-home/colorado/[^/]+",
    ],
    category: "regional",
    priority: 1,
    active: true,
    notes: "HQ in Greenwood Village, CO. Major local presence.",
  },
  {
    name: "Tri Pointe Homes",
    slug: "tri-pointe-homes",
    domain: "tripointehomes.com",
    base_urls: [
      "https://www.tripointehomes.com/colorado/",
    ],
    community_url_patterns: [
      "tripointehomes\\.com/colorado/[^/]+/[^/]+",
      "tripointehomes\\.com/colorado/[^/]+",
    ],
    category: "regional",
    priority: 2,
    active: true,
    notes: "Active in Denver metro.",
  },
  {
    name: "Challenger Homes",
    slug: "challenger-homes",
    domain: "challengerhomes.com",
    base_urls: [
      "https://www.challengerhomes.com/communities/",
    ],
    community_url_patterns: [
      "challengerhomes\\.com/communities/[^/]+",
    ],
    category: "local",
    priority: 3,
    active: true,
    notes: "Colorado Springs based, expanding into Denver metro.",
  },
];
