/**
 * Text extraction and cleaning utilities for HTML parsing.
 */

/**
 * Strip HTML tags and clean whitespace.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#?\w+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract text content from an HTML element selector pattern.
 * Simulates querySelectorAll + textContent for server-side HTML strings.
 */
export function extractTextBetweenTags(
  html: string,
  tag: string
): string[] {
  const regex = new RegExp(
    `<${tag}[^>]*>(.*?)</${tag}>`,
    "gis"
  );
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = stripHtml(match[1]).trim();
    if (text) matches.push(text);
  }
  return matches;
}

/**
 * Extract all href values from anchor tags.
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  const regex = /href=["']([^"']+)["']/gi;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href;
      links.push(resolved);
    } catch {
      // Skip invalid URLs
    }
  }
  return [...new Set(links)];
}

/**
 * Extract all image src URLs.
 */
export function extractImageUrls(html: string, baseUrl: string): string[] {
  const regex = /(?:src|data-src|data-lazy-src)=["']([^"']+)["']/gi;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (/\.(jpg|jpeg|png|webp|avif)/i.test(src)) {
      try {
        urls.push(new URL(src, baseUrl).href);
      } catch {
        // Skip invalid
      }
    }
  }
  return [...new Set(urls)];
}

/**
 * Extract meta tag content by name or property.
 */
export function extractMeta(html: string, nameOrProperty: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*(?:name|property)=["']${nameOrProperty}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = regex.exec(html);
  if (match) return match[1].trim();

  // Try reversed attribute order
  const regex2 = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProperty}["']`,
    "i"
  );
  const match2 = regex2.exec(html);
  return match2 ? match2[1].trim() : null;
}

/**
 * Extract page title.
 */
export function extractTitle(html: string): string | null {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match ? stripHtml(match[1]).trim() : null;
}

/**
 * Slugify a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generate a deterministic ID from components.
 */
export function generateId(...parts: (string | null | undefined)[]): string {
  const input = parts
    .filter(Boolean)
    .map((p) => (p as string).toLowerCase().trim())
    .join("|");

  // Simple hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36).padStart(8, "0");
}
