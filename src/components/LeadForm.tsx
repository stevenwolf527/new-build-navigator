"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LeadFormProps {
  source?: string;
  compact?: boolean;
  className?: string;
}

const timelineOptions = [
  { value: "0-3-months", label: "0\u20133 months" },
  { value: "3-6-months", label: "3\u20136 months" },
  { value: "6-12-months", label: "6\u201312 months" },
  { value: "12-plus-months", label: "12+ months" },
];

const areaOptions = [
  "Parker",
  "Castle Rock",
  "Aurora",
  "Littleton",
  "Commerce City",
  "SE Denver Metro",
  "Other",
];

const budgetOptions = [
  "Under $400K",
  "$400K\u2013$500K",
  "$500K\u2013$650K",
  "$650K\u2013$800K",
  "$800K\u2013$1M",
  "$1M+",
];

export function LeadForm({ source = "website", compact = false, className }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={cn("bg-emerald-50/60 rounded-[20px] p-10 text-center", className)}>
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">You&apos;re on the list!</h3>
        <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm mx-auto">
          We&apos;ll send you a curated list of new builds that match your criteria. Expect to hear from us within 24 hours.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all duration-150";

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <input type="hidden" name="source" value={source} />

      <div className={cn(compact ? "space-y-5" : "grid grid-cols-1 sm:grid-cols-2 gap-5")}>
        <div>
          <label htmlFor="name" className="block text-[13px] font-medium text-gray-600 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-gray-600 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-[13px] font-medium text-gray-600 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(303) 555-0100"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="area" className="block text-[13px] font-medium text-gray-600 mb-2">
            Target Area
          </label>
          <select id="area" name="area" className={inputClasses}>
            <option value="">Select an area</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="block text-[13px] font-medium text-gray-600 mb-2">
            Budget Range
          </label>
          <select id="budget" name="budget" className={inputClasses}>
            <option value="">Select budget</option>
            {budgetOptions.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="block text-[13px] font-medium text-gray-600 mb-2">
            Buying Timeline
          </label>
          <select id="timeline" name="timeline" className={inputClasses}>
            <option value="">Select timeline</option>
            {timelineOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!compact && (
        <div>
          <label htmlFor="message" className="block text-[13px] font-medium text-gray-600 mb-2">
            Anything else we should know?
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Tell us about what you're looking for \u2014 builders you like, must-haves, questions..."
            className={cn(inputClasses, "resize-none")}
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-[14px] font-semibold rounded-[12px] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-[1px]"
      >
        Get My Curated New Build List
      </button>
      <p className="text-[12px] text-gray-400 text-center">
        No spam. No obligation. Just helpful new build guidance.
      </p>
    </form>
  );
}
