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
    { href: "/communities?city=Parker", label: "Parker" },
    { href: "/communities?city=Castle+Rock", label: "Castle Rock" },
    { href: "/communities?city=Aurora", label: "Aurora" },
    { href: "/communities?city=Littleton", label: "Littleton" },
  ],
  resources: [
    { href: "/contact", label: "Get Your New Build List" },
    { href: "/videos?category=buying-tips", label: "Buying Tips" },
    { href: "/videos?category=builder-comparison", label: "Builder Comparisons" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.svg"
                alt="Colorado New Build Navigator"
                width={36}
                height={36}
                className="invert brightness-200"
              />
              <span className="text-[15px] font-semibold text-white">CO New Build Navigator</span>
            </div>
            <p className="text-[14px] text-gray-400 leading-[1.6] mb-6">
              Helping Colorado buyers find the best new construction homes without overpaying. Local expertise, builder
              insights, and honest guidance.
            </p>
            <a
              href="https://www.youtube.com/@coloradonewbuildnavigator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-gray-400 hover:text-white transition-colors duration-150"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube Channel
            </a>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-widest mb-5">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-gray-400 hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-widest mb-5">Areas</h3>
            <ul className="space-y-3">
              {footerLinks.areas.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-gray-400 hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-widest mb-5">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-gray-400 hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Colorado New Build Navigator. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-500">
            Not affiliated with any builder. Independent guidance for Colorado buyers.
          </p>
        </div>
      </div>
    </footer>
  );
}
