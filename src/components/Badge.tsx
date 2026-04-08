import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "green" | "orange" | "yellow" | "purple" | "red";
}

const variants = {
  default: "bg-gray-100 text-gray-600",
  blue: "bg-brand-50 text-brand-700",
  green: "bg-green-50 text-green-700",
  orange: "bg-orange-50 text-orange-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
}
