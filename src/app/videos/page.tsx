"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { VideoCard } from "@/components/VideoCard";
import { FilterBar } from "@/components/FilterBar";
import { getVideos, getVideoAreas } from "@/data/videos";
import { cn } from "@/lib/utils";

const categories = [
  { value: "", label: "All" },
  { value: "community-tour", label: "Community Tours" },
  { value: "builder-comparison", label: "Builder Comparisons" },
  { value: "buying-tips", label: "Buying Tips" },
  { value: "area-guide", label: "Area Guides" },
  { value: "market-update", label: "Market Updates" },
];

export default function VideosPage() {
  const allVideos = getVideos();
  const areas = getVideoAreas();

  const [activeCategory, setActiveCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const filteredVideos = useMemo(() => {
    return allVideos.filter((video) => {
      if (activeCategory && video.category !== activeCategory) return false;
      if (selectedArea && video.area !== selectedArea) return false;
      return true;
    });
  }, [allVideos, activeCategory, selectedArea]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <SectionHeader
            eyebrow="Watch & Learn"
            title="Video Hub"
            description="Tours, comparisons, and buying tips — everything you need to navigate Colorado new construction, organized and on demand."
          />
        </div>
      </section>

      {/* Filters and content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                activeCategory === cat.value
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Area filter */}
        <FilterBar
          filters={[
            {
              name: "Area",
              value: selectedArea,
              options: [
                { value: "", label: "All Areas" },
                ...areas.map((a) => ({ value: a, label: a })),
              ],
              onChange: setSelectedArea,
            },
          ]}
          className="mb-8"
        />

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"}
        </p>

        {/* Video grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No videos match your filters.</p>
            <button
              onClick={() => {
                setActiveCategory("");
                setSelectedArea("");
              }}
              className="mt-4 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* YouTube CTA */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mx-auto max-w-xl">
            <svg
              className="mx-auto mb-5 w-12 h-12 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Subscribe for new videos every week
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Get notified when we publish community tours, builder comparisons, and market
              updates for Colorado new construction.
            </p>
            <a
              href="https://www.youtube.com/@coloradonewbuildnavigator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
