import Link from "next/link";
import Image from "next/image";
import { getFeaturedCommunities } from "@/data/communities";
import { getFeaturedVideos } from "@/data/videos";
import { CommunityCard } from "@/components/CommunityCard";
import { VideoCard } from "@/components/VideoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LeadForm } from "@/components/LeadForm";

const trustItems = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Local Colorado Expertise",
    description: "Deep knowledge of Parker, Castle Rock, Aurora, and SE Denver new builds",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: "Builder Insights",
    description: "Honest comparisons of build quality, incentives, and what each builder does best",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Incentive Guidance",
    description: "Know what to ask for and when — builders offer more than they advertise",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Curated Communities",
    description: "We tour and evaluate every community so you get informed picks, not raw listings",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Tell Us What You Need",
    description: "Share your budget, target area, and timeline. We handle the research.",
  },
  {
    step: "02",
    title: "Get Your Curated List",
    description: "Receive a personalized list of new builds with insider notes and recommendations.",
  },
  {
    step: "03",
    title: "Tour With Confidence",
    description: "Visit communities knowing the pros, cons, and what to negotiate.",
  },
  {
    step: "04",
    title: "Buy Smarter",
    description: "Close on the right home with the best possible deal. No overpaying.",
  },
];

export default function Home() {
  const featuredCommunities = getFeaturedCommunities();
  const featuredVideos = getFeaturedVideos().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white to-warm-50/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-brand-500 rounded-full" />
                Colorado New Build Specialist
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                Find the Best New Construction Homes in{" "}
                <span className="text-brand-600">Colorado</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-lg">
                Stop scrolling Zillow. Get curated new build recommendations with honest builder insights, community
                comparisons, and local expertise — so you don&apos;t overpay.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-md shadow-brand-600/20"
                >
                  Get My New Build List
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/communities"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors"
                >
                  Browse Communities
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free, no obligation
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Local expert guidance
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                  alt="Modern new construction home in Colorado"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-w-[200px] hidden lg:block">
                <p className="text-2xl font-bold text-gray-900">150+</p>
                <p className="text-sm text-gray-500">New builds reviewed across Colorado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured communities */}
      <section className="bg-gray-50/50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Featured Communities"
            title="Curated New Build Communities"
            description="We've toured and evaluated these communities so you don't have to start from scratch. Every listing comes with honest insights."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/communities"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-brand-600 hover:text-brand-700 bg-white border border-gray-200 hover:border-brand-200 rounded-full transition-colors"
            >
              View All Communities
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How It Works"
            title="Your New Build, Simplified"
            description="We cut through the noise so you can focus on finding the right home — not wading through builder marketing."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.step} className="relative">
                <div className="text-4xl font-bold text-brand-100 mb-3">{step.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-gray-50/50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Watch & Learn"
            title="Community Tours & Builder Insights"
            description="See communities in person before you visit. Our video tours cover what matters — pricing, pros, cons, and what to watch out for."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/videos"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-brand-600 hover:text-brand-700 bg-white border border-gray-200 hover:border-brand-200 rounded-full transition-colors"
            >
              Watch All Videos
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Lead magnet */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Free Guide
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                  7 Mistakes Buyers Make With New Construction Homes
                </h2>
                <p className="text-lg text-brand-100 leading-relaxed mb-6">
                  Most buyers walk into a builder&apos;s sales office without knowing the questions to ask, the incentives to
                  negotiate, or the red flags to watch for. This free guide covers the most common — and costly — mistakes.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Why using the builder's lender isn't always best",
                    "The inspection mistake that costs thousands",
                    "How to negotiate incentives most buyers miss",
                    "Why your agent choice matters more with new builds",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-brand-100">
                      <svg className="w-5 h-5 text-warm-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 lg:p-12 bg-white lg:rounded-l-3xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get the free guide</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Plus a curated new build list for your target area.
                </p>
                <LeadForm source="lead-magnet" compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / credibility */}
      <section className="bg-gray-50/50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              eyebrow="Why Us"
              title="Your New Build Navigator in Colorado"
              description="We're not a generic listing site. We tour communities, evaluate builders, and give you the honest take that helps you make smarter decisions."
            />
            <div className="grid sm:grid-cols-3 gap-8 mt-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600 mb-1">50+</p>
                <p className="text-sm text-gray-500">Communities reviewed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600 mb-1">15+</p>
                <p className="text-sm text-gray-500">Builders compared</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-600 mb-1">100%</p>
                <p className="text-sm text-gray-500">Independent guidance</p>
              </div>
            </div>
            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-brand-600 hover:text-brand-700 bg-white border border-gray-200 hover:border-brand-200 rounded-full transition-colors"
              >
                Learn More About Us
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Find Your New Build?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Tell us what you&apos;re looking for and we&apos;ll send you a personalized list of the best new construction
            options in your target area — with honest insights, not sales pitches.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-full transition-colors shadow-lg shadow-brand-600/20"
            >
              Get My New Build List
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/videos"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-full transition-colors"
            >
              Watch Area Tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
