# 🎨 Painted portraits

One file per teacher, named after the teacher `id` in `src/teachers.ts`:

    gaurav-sir.webp     (also accepted: .png / .jpg / .jpeg, or <id>-art.webp)

Vite bundles and hashes these automatically, and they are the ONLY images the site
shows: card avatar, dedication-page portrait plate, share previews. Drop a file in,
reload — no code changes anywhere.

Pipeline: raw photos go to `public/teachers/<id>.jpg` as drafts, get hand-painted,
then land here as `<id>.png` and are packed with `npm run portraits` (760px WebP,
~60KB, phone-safe). `npm run photos` tells you who has what.

Rules for the art: head and shoulders, warm light, big friendly smile, bright
colours, faithful likeness — respectful, never a caricature.
