import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  explore: [
    { href: "/communities", label: "Communities" },
    { href: "/listings", label: "Listings" },
    { href: "/videos", label: "Videos" },
    { href: "/about", label: "About" },
  ],
  areas: [
    { href: "/communities?city=Aurora", label: "Aurora" },
    { href: "/communities?city=Castle+Rock", label: "Castle Rock" },
    { href: "/communities?city=Parker", label: "Parker" },
    { href: "/communities?city=Thornton", label: "Thornton" },
    { href: "/communities?city=Brighton", label: "Brighton" },
  ],
  resources: [
    { href: "/contact", label: "Get Your New Build List" },
    { href: "/videos?category=buying-tips", label: "Buying Tips" },
    { href: "/videos?category=builder-comparison", label: "Builder Comparisons" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.12em] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-gray-400 hover:text-white transition-colors duration-150"
      >
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-16">
        {/* Main layout: brand anchored left, nav pushed right */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {/* Brand block — anchored left */}
          <div className="lg:max-w-[280px] shrink-0 mb-12 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.svg"
                alt="Colorado New Build Navigator"
                width={32}
                height={32}
                className="invert brightness-200"
              />
              <span className="text-[14px] font-semibold text-white">
                CO New Build Navigator
              </span>
            </div>
            <p className="text-[13px] text-gray-400 leading-[1.65] mb-5">
              Helping Colorado buyers find the best new construction homes
              without overpaying. Local expertise, builder insights, and honest
              guidance.
            </p>
            <a
              href="https://www.youtube.com/@coloradonewbuildnavigator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[12px] text-gray-500 hover:text-white transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube Channel
            </a>
          </div>

          {/* Nav columns — grouped and pushed right */}
          <div className="flex gap-16">
            <FooterColumn title="Explore">
              <ul className="space-y-2.5">
                {footerLinks.explore.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Areas">
              <ul className="space-y-2.5">
                {footerLinks.areas.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Resources">
              <ul className="space-y-2.5">
                {footerLinks.resources.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </FooterColumn>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-gray-500">
            &copy; {new Date().getFullYear()} Colorado New Build Navigator. All
            rights reserved.
          </p>
          <p className="text-[11px] text-gray-500">
            Not affiliated with any builder. Independent guidance for Colorado
            buyers.
          </p>
        </div>
      </div>
    </footer>
  );
}
