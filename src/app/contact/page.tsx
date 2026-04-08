import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Get Your New Build List",
  description:
    "Tell us what you're looking for and receive a curated list of the best new construction homes in Parker, Castle Rock, Aurora, and SE Denver — with honest insights, not sales pitches.",
};

const expectations = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    title: "A personalized new build list",
    description: "Curated to your budget, timeline, and preferred areas — not a generic MLS dump.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "Honest builder insights",
    description: "What each builder does well, where they fall short, and what to negotiate.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fast turnaround",
    description: "Expect your curated list within 24 hours. No drip campaigns, no fluff.",
  },
];

const steps = [
  {
    num: "1",
    title: "Fill out the form",
    description: "Tell us your budget, timeline, and target areas.",
  },
  {
    num: "2",
    title: "We do the research",
    description: "We match your criteria against communities we've toured and evaluated.",
  },
  {
    num: "3",
    title: "Get your list",
    description: "You receive a curated shortlist with insider notes on each community and builder.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/80 via-white to-warm-50/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-500 rounded-full" />
              Free, No Obligation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Get a Curated List of the Best{" "}
              <span className="text-brand-600">New Builds</span> for You
            </h1>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed">
              Tell us what you&apos;re looking for and we&apos;ll send you a
              personalized shortlist of new construction communities that
              actually fit your needs — with honest insights on every one.
            </p>
          </div>

          {/* Two-column: form + sidebar */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            {/* Form */}
            <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Get My New Build List
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill out the details below and we&apos;ll match you with the
                best communities in your target area.
              </p>
              <LeadForm source="contact-page" />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              {/* What to expect */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  What You&apos;ll Get
                </h3>
                <ul className="space-y-5">
                  {expectations.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <div className="shrink-0 w-9 h-9 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How it works */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  How It Works
                </h3>
                <ol className="space-y-4">
                  {steps.map((step) => (
                    <li key={step.num} className="flex gap-3">
                      <div className="shrink-0 w-7 h-7 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {step.num}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contact info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                  Contact Us Directly
                </h3>
                <div className="space-y-3 text-sm">
                  <a
                    href="mailto:hello@conewbuildnavigator.com"
                    className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    hello@conewbuildnavigator.com
                  </a>
                  <a
                    href="tel:+13035550100"
                    className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    (303) 555-0100
                  </a>
                  <p className="text-gray-400 pt-1">
                    Serving Parker, Castle Rock, Aurora, and SE Denver
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
