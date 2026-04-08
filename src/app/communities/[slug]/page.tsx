import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { communities, getCommunityBySlug } from "@/data/communities";
import { getListingsByCommunity } from "@/data/listings";
import { formatPrice, formatPriceRange, getYouTubeEmbedUrl } from "@/lib/utils";
import { SectionHeader } from "@/components/SectionHeader";
import { ListingCard } from "@/components/ListingCard";
import { CommunityCard } from "@/components/CommunityCard";
import { Badge } from "@/components/Badge";
import { InsightCallout } from "@/components/InsightCallout";
import { LeadForm } from "@/components/LeadForm";

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

const statusVariants: Record<string, "success" | "warning" | "default"> = {
  active: "success",
  "coming-soon": "brand" as "default",
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
        <div className="relative h-[320px] sm:h-[420px] lg:h-[480px]">
          <Image
            src={community.images[0]}
            alt={community.name}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant={statusVariants[community.status] || "default"}>
                {statusLabels[community.status] || community.status}
              </Badge>
              {community.featured && <Badge variant="brand">Featured</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2">
              {community.name}
            </h1>
            <p className="text-lg text-gray-300">
              {community.city} &middot; {community.area}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/communities" className="hover:text-brand-600 transition-colors">
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
      <section className="bg-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
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
      <section className="bg-gray-50/50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {community.name}</h2>
              <p className="text-gray-600 leading-relaxed text-base mb-8">
                {community.longDescription}
              </p>

              {/* Builders */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Builders</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {community.builders.map((builder) => (
                  <span
                    key={builder}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
                  >
                    {builder}
                  </span>
                ))}
              </div>

              {/* Amenities */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {community.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {/* HOA details */}
              {community.hoa && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">HOA Details</h3>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
                    <p className="text-sm text-gray-600 mb-3">
                      Monthly: <span className="font-semibold text-gray-900">{formatPrice(community.hoa.monthly)}/month</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Includes: {community.hoa.includes.join(", ")}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar - image gallery */}
            <div className="lg:col-span-1">
              <div className="space-y-4 sticky top-8">
                {community.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
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

      {/* Our Insights — the big differentiator */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Our Insights
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                The Honest Take on {community.name}
              </h2>
              <p className="text-gray-500 text-lg">
                We tour and evaluate every community. Here is what we think you should know before visiting.
              </p>
            </div>

            {/* Pros */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                What We Like
              </h3>
              <div className="space-y-3">
                {community.pros.map((pro, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-green-50/50 border border-green-100 rounded-xl p-4"
                  >
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-gray-700 leading-relaxed">{pro}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
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
                    className="flex items-start gap-3 bg-amber-50/50 border border-amber-100 rounded-xl p-4"
                  >
                    <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                    </svg>
                    <p className="text-sm text-gray-700 leading-relaxed">{con}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insider notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          </div>
        </div>
      </section>

      {/* Video tour */}
      {community.featuredVideo && (
        <section className="bg-gray-50/50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Video Tour"
              title={`Watch Our ${community.name} Tour`}
              description="Get a firsthand look at the community, amenities, and surrounding area before you visit."
            />
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
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
        <section className="bg-white py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Available Homes"
              title={`Homes in ${community.name}`}
              description={`${listings.length} ${listings.length === 1 ? "listing" : "listings"} currently available in this community.`}
              align="left"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related communities */}
      {relatedCommunities.length > 0 && (
        <section className="bg-gray-50/50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Explore More"
              title="Nearby Communities"
              description="Other new build communities in the same area worth considering."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedCommunities.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead form CTA */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-100 p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                  Interested in {community.name}?
                </h2>
                <p className="text-gray-500 leading-relaxed">
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
    <div className="bg-gray-50 rounded-2xl p-4 lg:p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 leading-snug">{value}</p>
    </div>
  );
}
