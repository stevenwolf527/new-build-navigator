import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Colorado New Build Navigator. Learn how we collect, use, and protect your information.",
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      "When you fill out a form on our site, we may collect your name, email address, phone number, and details about your home search preferences such as target area, budget range, and buying timeline.",
      "We also collect standard usage data through analytics tools, including pages visited, time spent on site, browser type, device information, and referring URLs. This data is collected automatically and does not personally identify you.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use the information you provide to deliver personalized new build recommendations, respond to your inquiries, and follow up with relevant community and builder insights.",
      "Usage data helps us understand how visitors interact with our site so we can improve the experience. We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Cookies and Tracking",
    content: [
      "Our site may use cookies and similar technologies to improve functionality and analyze site usage. Cookies are small text files stored on your device that help us recognize returning visitors and understand browsing patterns.",
      "You can control cookie settings through your browser preferences. Disabling cookies may affect some features of the site.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "We may use third-party services for analytics (such as Google Analytics), form handling, and email communication. These services may collect data in accordance with their own privacy policies.",
      "We embed YouTube videos on our site. When you view these videos, YouTube may collect data according to Google's privacy policy.",
      "We do not share your personal information with third parties for their marketing purposes.",
    ],
  },
  {
    title: "Data Retention",
    content: [
      "We retain your personal information for as long as necessary to provide the services you requested and to fulfill legitimate business needs. You may request deletion of your data at any time by contacting us.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete the personal information we hold about you. You may also opt out of receiving communications from us at any time by using the unsubscribe link in our emails or by contacting us directly.",
    ],
  },
  {
    title: "Children's Privacy",
    content: [
      "Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this page periodically.",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have questions about this privacy policy or how we handle your data, you can reach us at:",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Effective date: April 1, 2025
            </p>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Colorado New Build Navigator is committed to protecting your
              privacy. This policy explains what information we collect, how we
              use it, and your options regarding your data.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base text-gray-500 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.title === "Contact Us" && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-5 space-y-2 text-sm">
                    <p className="text-gray-700 font-medium">
                      Colorado New Build Navigator
                    </p>
                    <p className="text-gray-500">
                      Email:{" "}
                      <a
                        href="mailto:hello@conewbuildnavigator.com"
                        className="text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        hello@conewbuildnavigator.com
                      </a>
                    </p>
                    <p className="text-gray-500">
                      Phone:{" "}
                      <a
                        href="tel:+13035550100"
                        className="text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        (303) 555-0100
                      </a>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
