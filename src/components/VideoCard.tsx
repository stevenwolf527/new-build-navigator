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
      className="group block bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-[2px]"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-black/60 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg group-hover:scale-110">
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/75 text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
            {video.duration}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-2 mb-3">
          <Badge variant="default">{categoryLabels[video.category] || video.category}</Badge>
        </div>
        <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-brand-600 transition-colors duration-150 leading-snug mb-2.5 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-[13px] text-gray-500 line-clamp-2 leading-[1.55]">{video.description}</p>
        <p className="mt-4 text-[12px] text-gray-400">
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
