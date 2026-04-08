import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const SITE_URL = "https://conewbuildnavigator.com";

export const metadata: Metadata = {
  title: {
    default: "Colorado New Build Navigator | Find the Best New Construction Homes",
    template: "%s | Colorado New Build Navigator",
  },
  description:
    "Find the best new construction homes in Colorado without overpaying. Expert guidance on builders, communities, and incentives in Parker, Castle Rock, Aurora, and SE Denver.",
  keywords: [
    "Colorado new construction",
    "new build homes Colorado",
    "Parker new construction",
    "Castle Rock new homes",
    "Aurora new builds",
    "Colorado home builders",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Colorado New Build Navigator",
    title: "Colorado New Build Navigator",
    description:
      "Find the best new construction homes in Denver and surrounding areas. Compare builders, incentives, and communities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Colorado New Build Navigator — Find the Best New Construction Homes in Colorado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Colorado New Build Navigator",
    description:
      "Find the best new construction homes in Denver and surrounding areas. Compare builders, incentives, and communities.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
