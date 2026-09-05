/**
 * 📸 Photo checker — run `npm run photos`
 *
 * Tells you exactly which portrait files are present / missing for the teachers
 * listed in src/teachers.ts, using the naming convention:
 *
 *   src/assets/teachers/<id>.png   hand-painted portrait  (wins, bundled + hashed)
 *   public/teachers/<id>.jpg       raw photo              (used when no portrait)
 */
import { readdirSync, existsSync } from "node:fs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RAW_DIR = join(process.cwd(), "public", "teachers");
const ART_DIR = join(process.cwd(), "src", "assets", "teachers");
const DIR = RAW_DIR;
const src = readFileSync(join(process.cwd(), "src", "teachers.ts"), "utf8");

const ids = [...src.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);
const files = existsSync(DIR) ? readdirSync(DIR) : [];
const art = existsSync(ART_DIR) ? readdirSync(ART_DIR) : [];

const real = files.filter((f) => f !== "README.txt" && !f.startsWith("."));
console.log(`\n📸 Teacher portraits — ${real.length} raw photo(s) in public/teachers/, ${art.filter((f) => f !== "README.md").length} painted portrait(s) in src/assets/teachers/\n`);

let missing = 0;
for (const id of ids) {
  const painted =
    art.find((f) => f === `${id}.png` || f === `${id}-art.png` || f.startsWith(`${id}.`)) ?? "";
  const raw =
    files.find((f) => f === `${id}.jpg` || f === `${id}.png`) ?? "";
  const picked = painted
    ? `🎨 src/assets/teachers/${painted} (painted portrait wins)`
    : raw
      ? `📷 public/teachers/${raw}`
      : "";
  if (picked) {
    console.log(`  ✅ ${id.padEnd(16)} ${picked}`);
  } else {
    missing++;
    console.log(`  ⌛ ${id.padEnd(16)} no portrait yet → painted: src/assets/teachers/${id}.png   raw: public/teachers/${id}.jpg`);
  }
}

const unknown = [...files, ...art].filter(
  (f) =>
    f !== "README.txt" &&
    f !== "README.md" &&
    !ids.some(
      (id) => f === `${id}.jpg` || f === `${id}.png` || f === `${id}-art.png` || f.startsWith(`${id}.`)
    )
);
if (unknown.length) {
  console.log("\n⚠️  Files that no teacher id matches (rename them to <id>.png in src/assets/teachers/ or <id>.jpg in public/teachers/):");
  unknown.forEach((f) => console.log("   –", f));
}
console.log(
  missing
    ? `\n${missing} teacher(s) still showing the colourful initials avatar.\n`
    : "\nEvery teacher has a portrait. 🎨\n"
);
