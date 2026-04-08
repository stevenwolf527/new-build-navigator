import { cn } from "@/lib/utils";

interface InsightCalloutProps {
  title?: string;
  children: React.ReactNode;
  variant?: "tip" | "warning" | "info";
  className?: string;
}

const variants = {
  tip: {
    bg: "bg-brand-50 border-brand-200",
    icon: "text-brand-600",
    title: "text-brand-800",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-800",
  },
  info: {
    bg: "bg-gray-50 border-gray-200",
    icon: "text-gray-600",
    title: "text-gray-800",
  },
};

const icons = {
  tip: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export function InsightCallout({
  title,
  children,
  variant = "tip",
  className,
}: InsightCalloutProps) {
  const style = variants[variant];

  return (
    <div className={cn("rounded-xl border p-5", style.bg, className)}>
      <div className="flex gap-3">
        <div className={cn("shrink-0 mt-0.5", style.icon)}>{icons[variant]}</div>
        <div>
          {title && (
            <h4 className={cn("text-sm font-semibold mb-1", style.title)}>{title}</h4>
          )}
          <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
