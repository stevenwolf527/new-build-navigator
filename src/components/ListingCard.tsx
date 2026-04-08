import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "./Badge";

interface ListingCardProps {
  listing: Listing;
}

const statusLabels: Record<string, string> = {
  available: "Available",
  "under-contract": "Under Contract",
  "move-in-ready": "Move-In Ready",
  "pre-construction": "Pre-Construction",
};

const statusVariants: Record<string, "green" | "red" | "blue" | "default" | "orange" | "yellow" | "purple"> = {
  available: "green",
  "under-contract": "orange",
  "move-in-ready": "blue",
  "pre-construction": "default",
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-[2px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.address}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={statusVariants[listing.status] || "default"}>
            {statusLabels[listing.status] || listing.status}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-lg font-bold px-4 py-1.5 rounded-[12px] shadow-sm">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-[16px] font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-150 mb-1.5" style={{ letterSpacing: "-0.02em" }}>
          {listing.address}
        </h3>
        <p className="text-[13px] text-gray-400 mb-4">
          {listing.communityName} &middot; {listing.city}
        </p>
        <div className="flex items-center gap-5 text-[14px] text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {listing.beds} bd
          </span>
          <span>{listing.baths} ba</span>
          <span>{listing.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100/80">
          <span className="text-[13px] text-gray-400">{listing.builder}</span>
          {listing.completionDate && (
            <span className="text-[13px] text-gray-400">
              Est. {new Date(listing.completionDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>
        {listing.shortNote && (
          <p className="mt-4 text-[13px] text-orange-600 bg-orange-50/60 px-4 py-3 rounded-[12px] leading-relaxed">
            {listing.shortNote}
          </p>
        )}
      </div>
    </Link>
  );
}
