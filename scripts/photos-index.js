// Writes public/photos/index.json with the images in public/photos,
// the list the web slideshow reads (see src/lib/photos.web.ts).
// Runs before the web export: `npm run build:web`.
const fs = require("node:fs");
const path = require("node:path");

const dir = path.join(process.cwd(), "public", "photos");
const images = fs
  .readdirSync(dir)
  .filter((file) => /\.(jpe?g|png|webp|avif|gif)$/i.test(file))
  .sort()
  .map((file) => `/photos/${encodeURIComponent(file)}`);

fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(images, null, 2) + "\n");
console.log(`photos/index.json: ${images.length} photo(s)`);
