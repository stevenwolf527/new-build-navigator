import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { listings, getListingBySlug } from "@/data/listings";
import { getCommunityBySlug } from "@/data/communities";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { InsightCallout } from "@/components/InsightCallout";
import { LeadForm } from "@/components/LeadForm";

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return { title: "Listing Not Found" };
  return {
    title: `${listing.address} | ${listing.communityName} | ${listing.city}`,
    description: `${listing.beds} bed, ${listing.baths} bath, ${listing.sqft.toLocaleString()} sqft new construction home by ${listing.builder} in ${listing.communityName}, ${listing.city}. ${formatPrice(listing.price)}.`,
  };
}

const statusLabels: Record<string, string> = {
  available: "Available",
  "under-contract": "Under Contract",
  "move-in-ready": "Move-In Ready",
  "pre-construction": "Pre-Construction",
};

const statusVariants: Record<string, "success" | "warning" | "brand" | "default"> = {
  available: "success",
  "under-contract": "warning",
  "move-in-ready": "brand",
  "pre-construction": "default",
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const community = getCommunityBySlug(
    listing.communityName.toLowerCase().replace(/\s+/g, "-") + "-" + listing.city.toLowerCase()
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/listings" className="hover:text-brand-600 transition-colors">
              Listings
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{listing.address}</span>
          </nav>
        </div>
      </div>

      {/* Hero image */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={listing.images[0]}
                alt={listing.address}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {listing.images[1] && (
              <div className="relative aspect-[4/3] hidden lg:block">
                <Image
                  src={listing.images[1]}
                  alt={`${listing.address} interior`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <Badge variant={statusVariants[listing.status] || "default"}>
                    {statusLabels[listing.status] || listing.status}
                  </Badge>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-3">
                {listing.address}
              </h1>
              <p className="text-lg text-gray-500 mt-1">
                {listing.communityName} &middot; {listing.city}, CO
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                {listing.modelName && (
                  <span className="text-sm text-gray-400">{listing.modelName}</span>
                )}
              </div>

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Bedrooms", value: listing.beds },
                  { label: "Bathrooms", value: listing.baths },
                  { label: "Sq Ft", value: listing.sqft.toLocaleString() },
                  { label: "Stories", value: listing.stories },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 rounded-xl p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-8 py-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Builder</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{listing.builder}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Lot Size</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{listing.lotSize}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Garage</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{listing.garage}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Est. Completion</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {new Date(listing.completionDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Insight */}
              {listing.shortNote && (
                <div className="mt-6">
                  <InsightCallout title="Navigator Insight" variant="tip">
                    {listing.shortNote}
                  </InsightCallout>
                </div>
              )}

              {/* Community link */}
              {community && (
                <div className="mt-8 p-5 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">Part of</p>
                  <Link
                    href={`/communities/${community.slug}`}
                    className="text-lg font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    {community.name} Community &rarr;
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{community.shortDescription}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Interested in this home?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Get insider details, negotiate better incentives, and tour with confidence.
                </p>
                <LeadForm source={`listing-${listing.slug}`} compact />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
