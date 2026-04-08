"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/communities", label: "Communities" },
  { href: "/listings", label: "Listings" },
  { href: "/videos", label: "Videos" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/80 shadow-xs">
      <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.svg"
              alt="CO New Build Navigator"
              width={36}
              height={36}
              className="transition-transform duration-150 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
                CO New Build Navigator
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[14px] font-medium text-gray-500 hover:text-gray-900 rounded-[10px] hover:bg-gray-50/80 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-[1px]"
            >
              Get My New Build List
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-[10px] text-gray-500 hover:bg-gray-50 transition-colors duration-150"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-200 ease-out",
            mobileOpen ? "max-h-96 pb-5" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-[15px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-[12px] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-5 py-3 text-[14px] font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors duration-150"
            >
              Get My New Build List
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
