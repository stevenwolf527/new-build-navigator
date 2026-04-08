/**
 * Generate OG image (1200x630) and favicon from project assets.
 * Uses sharp for image processing + SVG composition.
 *
 * Usage: npx tsx scripts/generate-assets.ts
 */

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const HERO_PATH = path.join(ROOT, "CO Area Home Hero.jpg");
const LOGO_PATH = path.join(ROOT, "New Build Nav Logo.svg");

async function generateOgImage() {
  console.log("Generating OG image (1200x630)...");

  // Start with the hero image as background, resized and cropped
  const heroBuffer = await sharp(HERO_PATH)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .toBuffer();

  // Create a dark gradient overlay for readability
  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0.55)" />
          <stop offset="45%" stop-color="rgba(0,0,0,0.35)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.7)" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)" />
    </svg>
  `);

  // Text overlay with branding
  const textOverlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <!-- Eyebrow pill -->
      <rect x="80" y="180" width="280" height="36" rx="18" fill="rgba(255,255,255,0.15)" />
      <text x="100" y="204" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="white" letter-spacing="1.5">
        COLORADO NEW BUILD NAVIGATOR
      </text>

      <!-- Main headline -->
      <text x="80" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="white" letter-spacing="-1">
        Find the Best New
      </text>
      <text x="80" y="352" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="white" letter-spacing="-1">
        Construction Homes
      </text>
      <text x="80" y="414" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#60A5FA" letter-spacing="-1">
        in Colorado
      </text>

      <!-- Subtitle -->
      <text x="80" y="465" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="rgba(255,255,255,0.75)">
        Expert builder insights, community comparisons, and local expertise
      </text>

      <!-- Bottom bar -->
      <rect x="0" y="590" width="1200" height="40" fill="rgba(0,0,0,0.4)" />
      <text x="80" y="616" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" fill="rgba(255,255,255,0.7)" letter-spacing="0.5">
        conewbuildnavigator.com
      </text>

      <!-- Orange accent line -->
      <rect x="80" y="240" width="60" height="4" rx="2" fill="#FF9500" />
    </svg>
  `);

  await sharp(heroBuffer)
    .composite([
      { input: overlay, blend: "over" },
      { input: textOverlay, blend: "over" },
    ])
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, "og-image.png"));

  console.log("  -> public/og-image.png");
}

async function generateFavicon() {
  console.log("Generating favicon from logo...");

  const svgContent = fs.readFileSync(LOGO_PATH, "utf-8");

  // Generate multiple sizes
  const sizes = [
    { size: 32, name: "favicon-32x32.png" },
    { size: 16, name: "favicon-16x16.png" },
    { size: 180, name: "apple-touch-icon.png" },
    { size: 192, name: "android-chrome-192x192.png" },
    { size: 512, name: "android-chrome-512x512.png" },
  ];

  for (const { size, name } of sizes) {
    await sharp(Buffer.from(svgContent))
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC, name));
    console.log(`  -> public/${name}`);
  }

  // Generate ICO-compatible 32x32 as favicon.ico (PNG in .ico container works in modern browsers)
  await sharp(Buffer.from(svgContent))
    .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC, "favicon.ico"));
  console.log("  -> public/favicon.ico");
}

async function main() {
  await generateOgImage();
  await generateFavicon();
  console.log("Done!");
}

main().catch(console.error);
