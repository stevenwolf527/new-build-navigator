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
      className="group block bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-[2px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={community.images[0]}
          alt={community.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={community.status === "active" ? "green" : community.status === "coming-soon" ? "orange" : "default"}>
            {community.status === "active" ? "Active" : community.status === "coming-soon" ? "Coming Soon" : "Sold Out"}
          </Badge>
          {community.featured && <Badge variant="yellow">Featured</Badge>}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-[17px] font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-150" style={{ letterSpacing: "-0.02em" }}>
            {community.name}
          </h3>
        </div>
        <p className="text-[13px] text-gray-400 mb-3">
          {community.city} &middot; {community.area}
        </p>
        <p className="text-[14px] text-gray-500 leading-[1.55] mb-5 line-clamp-2">
          {community.shortDescription}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100/80">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">Starting From</p>
            <p className="text-[15px] font-semibold text-gray-900">
              {formatPriceRange(community.priceRange.min, community.priceRange.max)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-1">Builders</p>
            <p className="text-[14px] text-gray-600">{community.builders.length} options</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
