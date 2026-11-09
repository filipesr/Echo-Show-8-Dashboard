import fs from "node:fs";
import path from "node:path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;

// Server-only: lists the images in /public/photos at build time.
// Remote photos (NEXT_PUBLIC_PHOTOS_URL) are fetched client-side by the Slideshow.
export function getLocalPhotos(): string[] {
  if (!fs.existsSync(PHOTOS_DIR)) return [];

  return fs
    .readdirSync(PHOTOS_DIR)
    .filter((file) => IMAGE_EXTENSIONS.test(file))
    .sort()
    .map((file) => `/photos/${encodeURIComponent(file)}`);
}
