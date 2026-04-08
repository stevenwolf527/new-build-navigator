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

const statusVariants: Record<string, "success" | "warning" | "brand" | "default"> = {
  available: "success",
  "under-contract": "warning",
  "move-in-ready": "brand",
  "pre-construction": "default",
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.address}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariants[listing.status] || "default"}>
            {statusLabels[listing.status] || listing.status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-lg font-bold px-3 py-1 rounded-lg shadow-sm">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors mb-1">
          {listing.address}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {listing.communityName} &middot; {listing.city}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {listing.beds} bd
          </span>
          <span>{listing.baths} ba</span>
          <span>{listing.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{listing.builder}</span>
          {listing.completionDate && (
            <span className="text-xs text-gray-500">
              Est. {new Date(listing.completionDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          )}
        </div>
        {listing.shortNote && (
          <p className="mt-3 text-xs text-brand-700 bg-brand-50 px-3 py-2 rounded-lg leading-relaxed">
            {listing.shortNote}
          </p>
        )}
      </div>
    </Link>
  );
}
