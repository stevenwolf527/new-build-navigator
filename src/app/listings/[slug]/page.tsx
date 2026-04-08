import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { listings, getListingBySlug } from "@/data/listings";
import { getCommunityBySlug } from "@/data/communities";
import { formatPrice } from "@/lib/utils";
import { getListingImages, FALLBACK_IMAGES } from "@/lib/image-utils";
import ResilientImage from "@/components/ResilientImage";
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

const statusVariants: Record<string, "green" | "orange" | "blue" | "default" | "yellow" | "purple" | "red"> = {
  available: "green",
  "under-contract": "orange",
  "move-in-ready": "blue",
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
      <div className="bg-white border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-[13px] text-gray-500">
            <Link href="/listings" className="hover:text-brand-600 transition-colors duration-150">
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
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-[20px] overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-100">
              <ResilientImage
                src={listing.images[0]}
                fallbackSrc={getListingImages(listing)[0]}
                alt={listing.address}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {listing.images[1] && (
              <div className="relative aspect-[4/3] hidden lg:block bg-gray-100">
                <ResilientImage
                  src={listing.images[1]}
                  fallbackSrc={FALLBACK_IMAGES.interior}
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
      <section className="bg-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <Badge variant={statusVariants[listing.status] || "default"}>
                    {statusLabels[listing.status] || listing.status}
                  </Badge>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-4">
                {listing.address}
              </h1>
              <p className="text-[17px] text-gray-500 mt-1.5">
                {listing.communityName} &middot; {listing.city}, CO
              </p>

              <div className="mt-7 flex items-baseline gap-3">
                <span className="text-[32px] font-bold text-gray-900">{formatPrice(listing.price)}</span>
                {listing.modelName && (
                  <span className="text-[14px] text-gray-400">{listing.modelName}</span>
                )}
              </div>

              {/* Quick stats */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Bedrooms", value: listing.beds },
                  { label: "Bathrooms", value: listing.baths },
                  { label: "Sq Ft", value: listing.sqft.toLocaleString() },
                  { label: "Stories", value: listing.stories },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50/80 rounded-[14px] p-5 text-center"
                  >
                    <p className="text-[24px] font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[12px] text-gray-400 mt-1.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="mt-10 grid grid-cols-2 gap-y-5 gap-x-8 py-7 border-t border-gray-100/80">
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Builder</p>
                  <p className="text-[14px] font-medium text-gray-900 mt-1">{listing.builder}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Lot Size</p>
                  <p className="text-[14px] font-medium text-gray-900 mt-1">{listing.lotSize}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Garage</p>
                  <p className="text-[14px] font-medium text-gray-900 mt-1">{listing.garage}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Est. Completion</p>
                  <p className="text-[14px] font-medium text-gray-900 mt-1">
                    {new Date(listing.completionDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Insight */}
              {listing.shortNote && (
                <div className="mt-8">
                  <InsightCallout title="Navigator Insight" variant="tip">
                    {listing.shortNote}
                  </InsightCallout>
                </div>
              )}

              {/* Community link */}
              {community && (
                <div className="mt-10 p-6 bg-gray-50/80 rounded-[16px]">
                  <p className="text-[13px] text-gray-400 mb-2">Part of</p>
                  <Link
                    href={`/communities/${community.slug}`}
                    className="text-[17px] font-semibold text-brand-600 hover:text-brand-700 transition-colors duration-150"
                  >
                    {community.name} Community &rarr;
                  </Link>
                  <p className="text-[14px] text-gray-500 mt-1.5">{community.shortDescription}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-[20px] border border-gray-200 shadow-sm p-7">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-2">
                  Interested in this home?
                </h3>
                <p className="text-[14px] text-gray-500 mb-6">
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
