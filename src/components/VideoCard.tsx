import Image from "next/image";
import { Video } from "@/types";
import { Badge } from "./Badge";

interface VideoCardProps {
  video: Video;
}

const categoryLabels: Record<string, string> = {
  "community-tour": "Community Tour",
  "builder-comparison": "Builder Comparison",
  "buying-tips": "Buying Tips",
  "area-guide": "Area Guide",
  "market-update": "Market Update",
};

export function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-black/70 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <span className="bg-black/80 text-white text-xs font-medium px-2 py-0.5 rounded">
            {video.duration}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <Badge variant="default">{categoryLabels[video.category] || video.category}</Badge>
        </div>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{video.description}</p>
        <p className="mt-3 text-xs text-gray-400">
          {video.area} &middot;{" "}
          {new Date(video.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </a>
  );
}
