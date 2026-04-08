"use client";

import { useState, useMemo } from "react";
import { communities, getUniqueCities, getUniqueBuilders } from "@/data/communities";
import { CommunityCard } from "@/components/CommunityCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FilterBar } from "@/components/FilterBar";

const cities = getUniqueCities();
const builders = getUniqueBuilders();

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "coming-soon", label: "Coming Soon" },
  { value: "sold-out", label: "Sold Out" },
];

export default function CommunitiesPage() {
  const [cityFilter, setCityFilter] = useState("");
  const [builderFilter, setBuilderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredCommunities = useMemo(() => {
    return communities.filter((c) => {
      if (cityFilter && c.city !== cityFilter) return false;
      if (builderFilter && !c.builders.includes(builderFilter)) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [cityFilter, builderFilter, statusFilter]);

  const activeFilterCount = [cityFilter, builderFilter, statusFilter].filter(Boolean).length;

  return (
    <>
      {/* Page header */}
      <section className="bg-gradient-to-b from-gray-50/60 to-white pt-20 pb-10 lg:pt-28 lg:pb-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Communities"
            title="Explore New Build Communities"
            description="Browse Colorado's best new construction communities. Every listing includes honest pros, cons, and insider insights you won't find on builder websites."
          />
        </div>
      </section>

      {/* Filters and grid */}
      <section className="bg-white pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Sticky filter bar */}
          <div className="sticky top-[68px] z-10 -mx-5 px-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100/60">
            <FilterBar
              filters={[
                {
                  name: "City",
                  value: cityFilter,
                  options: [
                    { value: "", label: "All Cities" },
                    ...cities.map((city) => ({ value: city, label: city })),
                  ],
                  onChange: setCityFilter,
                },
                {
                  name: "Builder",
                  value: builderFilter,
                  options: [
                    { value: "", label: "All Builders" },
                    ...builders.map((builder) => ({ value: builder, label: builder })),
                  ],
                  onChange: setBuilderFilter,
                },
                {
                  name: "Status",
                  value: statusFilter,
                  options: statusOptions,
                  onChange: setStatusFilter,
                },
              ]}
            />
          </div>

          {/* Results count */}
          <div className="mt-10 mb-8 flex items-center justify-between">
            <p className="text-[14px] text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">{filteredCommunities.length}</span>{" "}
              {filteredCommunities.length === 1 ? "community" : "communities"}
              {activeFilterCount > 0 && (
                <span className="text-gray-400"> with {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} applied</span>
              )}
            </p>
          </div>

          {/* Community grid */}
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No communities found</h3>
              <p className="text-[14px] text-gray-500 max-w-md mx-auto mb-7">
                No communities match your current filters. Try adjusting your selections or clear all filters to see everything.
              </p>
              <button
                onClick={() => {
                  setCityFilter("");
                  setBuilderFilter("");
                  setStatusFilter("");
                }}
                className="inline-flex items-center px-5 py-2.5 text-[14px] font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full transition-all duration-150"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
