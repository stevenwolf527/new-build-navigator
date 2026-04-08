import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      // Builder domains for future real scraped images
      { protocol: "https", hostname: "**.tollbrothers.com" },
      { protocol: "https", hostname: "**.lennar.com" },
      { protocol: "https", hostname: "**.richmondamerican.com" },
      { protocol: "https", hostname: "**.meritagehomes.com" },
      { protocol: "https", hostname: "**.taylormorrison.com" },
      { protocol: "https", hostname: "**.sheahomes.com" },
      { protocol: "https", hostname: "**.kbhome.com" },
      { protocol: "https", hostname: "**.centurycommunities.com" },
      { protocol: "https", hostname: "**.oakwoodhomesco.com" },
      { protocol: "https", hostname: "**.dreamfindershomes.com" },
      { protocol: "https", hostname: "**.tripointehomes.com" },
      { protocol: "https", hostname: "**.drhorton.com" },
      { protocol: "https", hostname: "**.challengerhomes.com" },
    ],
  },
};

export default nextConfig;
