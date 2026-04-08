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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Colorado New Build Navigator",
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
