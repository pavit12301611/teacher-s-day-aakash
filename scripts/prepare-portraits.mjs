#!/usr/bin/env node
/**
 * 🖼️ Portrait packer — `npm run portraits`
 *
 * Painted portraits are authored big (1024px+ PNG), which is far too heavy for
 * a phone. This squashes every image in src/assets/teachers/ down to a 760px
 * WebP (quality 80) and removes the original, so each teacher ships ~60KB
 * instead of ~2.5MB. Vite's glob picks up the new file automatically because
 * <id>.webp is matched the same way as <id>.png.
 */
import { existsSync } from "node:fs";
import { readdir, unlink, rename } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR = join(process.cwd(), "src", "assets", "teachers");
const SIZE = 760;
const SOURCES = /\.(png|jpe?g)$/i;

if (!existsSync(DIR)) {
  console.error("no src/assets/teachers folder");
  process.exit(1);
}

const files = (await readdir(DIR)).filter((f) => SOURCES.test(f));
if (!files.length) {
  console.log("nothing to pack — add painted portraits to src/assets/teachers/ first");
  process.exit(0);
}

for (const file of files) {
  const from = join(DIR, file);
  const to = join(DIR, file.replace(SOURCES, ".webp"));
  const info = await sharp(from)
    .resize(SIZE, SIZE, { fit: "cover", position: "center" })
    .webp({ quality: 80, effort: 6 })
    .toFile(to);
  if (to !== from) await unlink(from);
  else await rename(to, to);
  console.log(
    `  ✅ ${file} → ${to.split("/").pop()} (${Math.round(info.bytes / 1024)}KB)`
  );
}
console.log("\nDone. `npm run photos` to check which teacher resolves to which file.\n");
