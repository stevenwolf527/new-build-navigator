import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { communities, getCommunityBySlug } from "@/data/communities";
import { getListingsByCommunity } from "@/data/listings";
import { formatPrice, formatPriceRange, getYouTubeEmbedUrl, FALLBACK_IMAGE } from "@/lib/utils";
import { SectionHeader } from "@/components/SectionHeader";
import { ListingCard } from "@/components/ListingCard";
import { CommunityCard } from "@/components/CommunityCard";
import { Badge } from "@/components/Badge";
import { InsightCallout } from "@/components/InsightCallout";
import { LeadForm } from "@/components/LeadForm";
import { Community } from "@/types";

function hasEditorialContent(c: Community): boolean {
  return c.pros.length > 0 || c.cons.length > 0 || c.notes.length > 0;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return communities.map((community) => ({
    slug: community.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);
  if (!community) return {};

  return {
    title: `${community.name} — New Homes in ${community.city} | Colorado New Build Navigator`,
    description: community.shortDescription,
    openGraph: {
      title: `${community.name} — New Homes in ${community.city}`,
      description: community.shortDescription,
      images: community.images[0] ? [community.images[0]] : [],
    },
  };
}

const statusLabels: Record<string, string> = {
  active: "Actively Selling",
  "coming-soon": "Coming Soon",
  "sold-out": "Sold Out",
};

const statusVariants: Record<string, "green" | "orange" | "default" | "blue" | "yellow" | "purple" | "red"> = {
  active: "green",
  "coming-soon": "orange",
  "sold-out": "default",
};

export default async function CommunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const community = getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  const listings = getListingsByCommunity(community.id);
  const relatedCommunities = communities
    .filter((c) => c.id !== community.id && (c.city === community.city || c.area === community.area))
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-900">
        <div className="relative h-[340px] sm:h-[440px] lg:h-[500px]">
          <Image
            src={community.images?.[0] || FALLBACK_IMAGE}
            alt={community.name}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10 lg:pb-14">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={statusVariants[community.status] || "default"}>
                {statusLabels[community.status] || community.status}
              </Badge>
              {community.featured && <Badge variant="yellow">Featured</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2">
              {community.name}
            </h1>
            <p className="text-[17px] text-gray-300">
              {community.city} &middot; {community.area}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-[13px] text-gray-500">
            <Link href="/" className="hover:text-brand-600 transition-colors duration-150">
              Home
            </Link>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/communities" className="hover:text-brand-600 transition-colors duration-150">
              Communities
            </Link>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{community.name}</span>
          </nav>
        </div>
      </div>

      {/* Quick facts */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickFact label="Price Range" value={formatPriceRange(community.priceRange.min, community.priceRange.max)} />
            <QuickFact label="Builders" value={`${community.builders.length} options`} />
            <QuickFact label="Home Types" value={community.homeTypes.join(", ")} />
            <QuickFact label="Total Homes" value={community.totalHomes.toLocaleString()} />
            <QuickFact label="School District" value={community.schoolDistrict} />
            <QuickFact
              label="HOA"
              value={community.hoa ? `${formatPrice(community.hoa.monthly)}/mo` : "None"}
            />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-gray-50/40 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">About {community.name}</h2>
              <p className="text-[15px] text-gray-500 leading-[1.7] mb-10">
                {community.longDescription}
              </p>

              {/* Builders */}
              <h3 className="text-[17px] font-semibold text-gray-900 mb-4">Builders</h3>
              <div className="flex flex-wrap gap-2.5 mb-10">
                {community.builders.map((builder) => (
                  <span
                    key={builder}
                    className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-[12px] text-[13px] font-medium text-gray-600 shadow-xs"
                  >
                    {builder}
                  </span>
                ))}
              </div>

              {/* Amenities */}
              <h3 className="text-[17px] font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2.5 mb-10">
                {community.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center px-3.5 py-2 bg-green-50/60 text-green-700 rounded-[10px] text-[13px] font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* HOA details */}
              {community.hoa && (
                <>
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-4">HOA Details</h3>
                  <div className="bg-white rounded-[16px] border border-gray-100 shadow-xs p-6 mb-10">
                    <p className="text-[14px] text-gray-600 mb-3">
                      Monthly: <span className="font-semibold text-gray-900">{formatPrice(community.hoa.monthly)}/month</span>
                    </p>
                    <p className="text-[13px] text-gray-500">
                      Includes: {community.hoa.includes.join(", ")}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar - image gallery */}
            <div className="lg:col-span-1">
              <div className="space-y-5 sticky top-24">
                {community.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-[20px] overflow-hidden shadow-sm">
                    <Image
                      src={image}
                      alt={`${community.name} photo ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Insights — only show when there's editorial content */}
      {hasEditorialContent(community) && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Our Insights
                </div>
                <h2 className="text-3xl sm:text-[40px] font-bold text-gray-900 tracking-tight leading-[1.15] mb-4">
                  The Honest Take on {community.name}
                </h2>
                <p className="text-gray-500 text-[17px] leading-relaxed">
                  We tour and evaluate every community. Here is what we think you should know before visiting.
                </p>
              </div>

              {community.pros.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-5 flex items-center gap-3">
                    <span className="w-9 h-9 bg-emerald-50 rounded-[10px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    What We Like
                  </h3>
                  <div className="space-y-3">
                    {community.pros.map((pro, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3.5 bg-emerald-50/40 border border-emerald-100 rounded-[14px] p-5"
                      >
                        <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-[14px] text-gray-600 leading-[1.55]">{pro}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {community.cons.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-5 flex items-center gap-3">
                    <span className="w-9 h-9 bg-amber-50 rounded-[10px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    What to Watch Out For
                  </h3>
                  <div className="space-y-3">
                    {community.cons.map((con, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3.5 bg-amber-50/40 border border-amber-100 rounded-[14px] p-5"
                      >
                        <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                        </svg>
                        <p className="text-[14px] text-gray-600 leading-[1.55]">{con}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {community.notes.length > 0 && (
                <div>
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-5 flex items-center gap-3">
                    <span className="w-9 h-9 bg-purple-50 rounded-[10px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </span>
                    Insider Tips
                  </h3>
                  <div className="space-y-3">
                    {community.notes.map((note, index) => (
                      <InsightCallout key={index} variant="tip">
                        {note}
                      </InsightCallout>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Video tour */}
      {community.featuredVideo && (
        <section className="bg-gray-50/40 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Video Tour"
              title={`Watch Our ${community.name} Tour`}
              description="Get a firsthand look at the community, amenities, and surrounding area before you visit."
            />
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-[20px] overflow-hidden shadow-lg">
                <iframe
                  src={getYouTubeEmbedUrl(community.featuredVideo)}
                  title={`${community.name} video tour`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Listings in this community */}
      {listings.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Available Homes"
              title={`Homes in ${community.name}`}
              description={`${listings.length} ${listings.length === 1 ? "listing" : "listings"} currently available in this community.`}
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related communities */}
      {relatedCommunities.length > 0 && (
        <section className="bg-gray-50/40 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Explore More"
              title="Nearby Communities"
              description="Other new build communities in the same area worth considering."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
              {relatedCommunities.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead form CTA */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50/80 rounded-[24px] border border-gray-100 p-10 lg:p-12 shadow-sm">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                  Interested in {community.name}?
                </h2>
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  Tell us what you are looking for and we will send you a personalized new build list with insider insights for this community and area.
                </p>
              </div>
              <LeadForm source={`community-${community.slug}`} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Quick fact component */
function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50/80 rounded-[16px] p-5">
      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1.5">{label}</p>
      <p className="text-[14px] font-semibold text-gray-900 leading-snug">{value}</p>
    </div>
  );
}
