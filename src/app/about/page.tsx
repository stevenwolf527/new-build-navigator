import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Colorado New Build Navigator helps buyers find the best new construction homes in Parker, Castle Rock, Aurora, and SE Denver with honest insights and curated recommendations.",
};

const stats = [
  { value: "50+", label: "Communities toured" },
  { value: "15+", label: "Builders evaluated" },
  { value: "100%", label: "Independent guidance" },
  { value: "24hr", label: "Response time" },
];

const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Builder incentives change constantly",
    description:
      "What a builder advertises and what they'll actually offer are two different things. We track real incentive activity so you know what to ask for and when to ask.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: "Not all communities are created equal",
    description:
      "The same builder can deliver very different experiences in different communities. Location, HOA, lot size, school district, and phase timing all matter enormously.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "The sales office works for the builder",
    description:
      "On-site agents represent the builder, not you. Without your own advocate, you're relying on marketing materials to make one of the biggest financial decisions of your life.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "Raw data isn't the same as insight",
    description:
      "Zillow and Realtor.com show you listings. We interpret them. We've walked the model homes, compared the specs, and can tell you what a listing page never will.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Tell us what you need",
    description:
      "Fill out a quick form with your budget, timeline, preferred areas, and any must-haves. It takes about two minutes.",
  },
  {
    num: "02",
    title: "We research and curate",
    description:
      "We match your criteria against communities we've personally toured and evaluated. No algorithmic guesswork — just informed picks.",
  },
  {
    num: "03",
    title: "You get a curated list",
    description:
      "Within 24 hours, you receive a personalized shortlist with notes on each community: what the builder does well, current incentives, and things to watch for.",
  },
  {
    num: "04",
    title: "Tour with confidence",
    description:
      "Visit communities knowing the right questions to ask and the details that matter. You're never walking in blind.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white to-warm-50/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-500 rounded-full" />
              About Us
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              New Construction Needs an{" "}
              <span className="text-brand-600">Interpreter</span>, Not Just a
              Listing
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl">
              Colorado New Build Navigator exists because buying new
              construction shouldn&apos;t mean navigating builder marketing
              alone. We tour the communities, evaluate the builders, and give
              you the honest take — so you can buy smarter.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-600 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Story */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Our Story"
              title="Why We Started This"
              align="left"
            />
            <div className="prose prose-lg text-gray-500 leading-relaxed space-y-6">
              <p>
                We started Colorado New Build Navigator because we saw the same
                pattern over and over: buyers walking into model homes,
                getting swept up in the staging, and making decisions based on
                incomplete information. Builder websites are marketing
                material. Sales agents work for the builder. And Zillow can
                only show you what&apos;s listed — not what it actually means.
              </p>
              <p>
                New construction is fundamentally different from resale. The
                pricing changes weekly. The incentives shift based on
                inventory. The quality varies not just between builders, but
                between communities from the same builder. Buying well
                requires context that most buyers simply don&apos;t have.
              </p>
              <p>
                That&apos;s where we come in. We tour communities across
                Parker, Castle Rock, Aurora, and SE Denver. We compare
                builders side by side. We track incentive trends and know when
                a deal is genuinely good versus when it&apos;s just marketing.
                And we share all of that with you — for free — because we
                believe informed buyers make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why new construction needs guidance */}
      <section className="bg-gray-50/50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why It Matters"
            title="New Construction Isn't Like Buying Resale"
            description="Most real estate advice is built around existing homes. New builds play by different rules — and most buyers learn that the hard way."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How It Works"
            title="From Overwhelmed to Informed in 24 Hours"
            description="We keep the process simple. You tell us what you need, we do the legwork, and you get a curated list — not a data dump."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-4xl font-bold text-brand-100 mb-3">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube / Watch */}
      <section className="bg-gray-50/50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              eyebrow="Watch & Learn"
              title="See the Communities Before You Visit"
              description="We publish community tours, builder comparisons, and buyer tips on our YouTube channel so you can research on your own time."
            />
            <a
              href="https://www.youtube.com/@coloradonewbuildnavigator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Find Your New Build?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Tell us what you&apos;re looking for and we&apos;ll send you a
            curated list of the best new construction options — with honest
            insights, not sales pitches.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-full transition-colors shadow-lg shadow-brand-600/20"
          >
            Get My New Build List
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
