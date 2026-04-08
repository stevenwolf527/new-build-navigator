"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: {
    name: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  className?: string;
}

export function FilterBar({ filters, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 p-5 bg-white rounded-[16px] border border-gray-100 shadow-sm",
        className
      )}
    >
      {filters.map((filter) => (
        <div key={filter.name} className="relative">
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="appearance-none bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 text-[13px] text-gray-600 font-medium rounded-[10px] px-4 py-2.5 pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 focus:shadow-sm transition-all duration-150"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      ))}
      {filters.some((f) => f.value !== "") && (
        <button
          onClick={() => filters.forEach((f) => f.onChange(""))}
          className="text-[13px] text-gray-400 hover:text-gray-600 font-medium px-3 py-2.5 rounded-[10px] hover:bg-gray-50 transition-all duration-150"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
