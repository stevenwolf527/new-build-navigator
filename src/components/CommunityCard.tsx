import Link from "next/link";
import Image from "next/image";
import { Community } from "@/types";
import { formatPriceRange } from "@/lib/utils";
import { Badge } from "./Badge";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link
      href={`/communities/${community.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={community.images[0]}
          alt={community.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={community.status === "active" ? "success" : "default"}>
            {community.status === "active" ? "Active" : community.status === "coming-soon" ? "Coming Soon" : "Sold Out"}
          </Badge>
          {community.featured && <Badge variant="brand">Featured</Badge>}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
            {community.name}
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {community.city} &middot; {community.area}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {community.shortDescription}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Starting From</p>
            <p className="text-base font-semibold text-gray-900">
              {formatPriceRange(community.priceRange.min, community.priceRange.max)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Builders</p>
            <p className="text-sm text-gray-700">{community.builders.length} options</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
