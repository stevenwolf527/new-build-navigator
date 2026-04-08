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
    { href: "/communities?city=Commerce+City", label: "Commerce City" },
    { href: "/communities?city=Centennial", label: "Centennial" },
    { href: "/communities?city=Littleton", label: "Littleton" },
    { href: "/communities?city=Erie", label: "Erie" },
    { href: "/communities?city=Denver", label: "Denver" },
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
      <h3 className="text-[14px] font-semibold text-gray-900 mb-4">
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
        className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors duration-150"
      >
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-16">
        {/* Main layout: brand anchored left, nav columns pushed right */}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          {/* Brand block */}
          <div className="lg:w-[320px] shrink-0 mb-10 lg:mb-0">
            <p className="text-[14px] text-gray-400 leading-[1.7] mb-6 max-w-[300px]">
              Helping Colorado buyers find the best new construction homes
              without overpaying. Local expertise, builder insights, and honest
              guidance.
            </p>
            <a
              href="https://www.youtube.com/@coloradonewbuildnavigator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-gray-400 hover:text-gray-600 transition-colors duration-150 mb-6"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube Channel
            </a>
            <p className="text-[13px] text-gray-300">
              &copy; {new Date().getFullYear()} Colorado New Build Navigator
            </p>
          </div>

          {/* Nav columns — grouped tightly on the right */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-10">
            <FooterColumn title="Explore">
              <ul className="space-y-2.5">
                {footerLinks.explore.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Areas">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
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
      </div>
    </footer>
  );
}
