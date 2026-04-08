"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { FilterBar } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { LeadForm } from "@/components/LeadForm";
import {
  getListings,
  getUniqueCities,
  getUniqueBuilders,
} from "@/data/listings";

const allListings = getListings();
const cities = getUniqueCities();
const builders = getUniqueBuilders();

const priceRanges = [
  { value: "", label: "Any Price" },
  { value: "0-500000", label: "Under $500K" },
  { value: "500000-650000", label: "$500K – $650K" },
  { value: "650000-800000", label: "$650K – $800K" },
  { value: "800000-1000000", label: "$800K – $1M" },
  { value: "1000000-999999999", label: "$1M+" },
];

const bedOptions = [
  { value: "", label: "Any Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
];

const statusOptions = [
  { value: "", label: "Any Status" },
  { value: "available", label: "Available" },
  { value: "move-in-ready", label: "Move-In Ready" },
  { value: "pre-construction", label: "Pre-Construction" },
  { value: "under-contract", label: "Under Contract" },
];

export default function ListingsPage() {
  const [city, setCity] = useState("");
  const [builder, setBuilder] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [beds, setBeds] = useState("");
  const [status, setStatus] = useState("");

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      if (city && listing.city !== city) return false;
      if (builder && listing.builder !== builder) return false;
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        if (listing.price < min || listing.price > max) return false;
      }
      if (beds && listing.beds < Number(beds)) return false;
      if (status && listing.status !== status) return false;
      return true;
    });
  }, [city, builder, priceRange, beds, status]);

  const filters = [
    {
      name: "City",
      value: city,
      options: [
        { value: "", label: "All Cities" },
        ...cities.map((c) => ({ value: c, label: c })),
      ],
      onChange: setCity,
    },
    {
      name: "Builder",
      value: builder,
      options: [
        { value: "", label: "All Builders" },
        ...builders.map((b) => ({ value: b, label: b })),
      ],
      onChange: setBuilder,
    },
    {
      name: "Price",
      value: priceRange,
      options: priceRanges,
      onChange: setPriceRange,
    },
    {
      name: "Beds",
      value: beds,
      options: bedOptions,
      onChange: setBeds,
    },
    {
      name: "Status",
      value: status,
      options: statusOptions,
      onChange: setStatus,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <SectionHeader
            eyebrow="Browse Homes"
            title="New Construction Listings"
            description="Explore available new builds across Colorado's top communities. Filter by city, builder, price, and more to find the perfect home."
            align="center"
          />

          <FilterBar filters={filters} className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-sm text-gray-500 mb-6">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredListings.length}
          </span>{" "}
          {filteredListings.length === 1 ? "home" : "homes"}
        </p>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No homes match your filters
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search criteria or clear all filters to see
              every available listing.
            </p>
            <button
              onClick={() => {
                setCity("");
                setBuilder("");
                setPriceRange("");
                setBeds("");
                setStatus("");
              }}
              className="inline-flex items-center px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* CTA / Lead Form */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <SectionHeader
            eyebrow="Get Personalized Help"
            title="Not finding what you need?"
            description="Tell us what you're looking for and we'll send you a curated list of new builds that match your criteria — including off-market opportunities."
            align="center"
          />
          <LeadForm source="listings-page" className="max-w-xl mx-auto" />
        </div>
      </section>
    </main>
  );
}
