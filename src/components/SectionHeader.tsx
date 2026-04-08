import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl mb-14",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-[40px] font-bold text-gray-900 leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-[17px] text-gray-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
