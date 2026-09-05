# 💙 Teacher's Day @ Aakash (Multipage Edition)

A beautiful, fast, **bright and colourful** (paper-white canvas + a ten-colour pop palette,
one signature hue per subject) website to wish **Happy Teacher's Day** to every
teacher of Aakash Coaching Centre — where **each teacher gets their own individual
dedication page** with a personal letter.

Built with **TypeScript + Vite multi-page app** (zero runtime dependencies, tiny custom
confetti engine, buttery smooth animations).

## 🗺️ Pages

| Page | File | What it is |
|------|------|------------|
| Home | `index.html` | Aurora hero, multilingual thank-you marquee, a **daily wish that changes each weekday**, stats, spotlight, featured teachers, subjects, how-it-works, **shuffling quote pool**, CTA |
| All Teachers | `teachers.html` | Search + filter by subject, gallery of every teacher |
| **Teacher dedication** | `teacher.html?id=<teacher-id>` | **Individual page per teacher** — a **sealed letter that types itself out** (time-of-day greeting), Read Aloud, Send a Wish, **a subject minigame**, **4 hidden secrets**, a **"from your students" message library**, WhatsApp share, prev/next, related teachers |
| Memories Room | `memories.html` | Whiteboard fun zone, live wish wall (saved on device), confetti playground |
| Our Story | `about.html` | Values, timeline of an Aakash day, love note |
| Subject Category | `category.html?subject=Physics` | 🗂️ Landing page per subject — line-up, famous dialogues, quotes |
| Design System | `design.html` | 🎨 Categorised style guide — colours (tap to copy hex), type, components |

Example individual pages: `teacher.html?id=rahul-sir`, `teacher.html?id=gaurav-sir`, …

## 🚀 Run it

```bash
npm install
npm run dev     # dev server (fast, hot reload)
npm run build   # production build (type-checks + builds all 5 pages)
npm run preview # preview the production build
```

## ✏️ Add real teachers / names

Open **`src/teachers.ts`**. Each teacher is one object:

```ts
{
  id: "rahul-sir",
  name: "Rahul Verma",
  salutation: "Rahul Sir",
  subject: "Physics",                  // Physics | Chemistry | Mathematics | Biology | SST & English
  // photos are auto-detected from public/teachers/<id>.jpg — this field is only an override
  emoji: "🚀",
  tagline: "A short fun line",
  photo: null,                          // optional override
  message: ["Paragraph 1...", "Paragraph 2..."],
  note: "Fun fact shown with the letter.",
  quote: "Signature line on their page",
  superpower: "Teacher superpower badge",
  dialogue: "Legendary classroom dialogue"
}
```

Just copy a block, change the details — their **dedication page appears automatically**
at `teacher.html?id=<your-id>`, plus links in the gallery, home preview and footer.
TypeScript validates the shape for you.

## 📸 Add real photos (zero-config)

Names are matched to teacher ids — no code edit needed:

| What you add                                   | What happens |
|------------------------------------------------|--------------|
| `src/assets/teachers/gaurav-sir.webp`          | 🎨 hand-painted portrait — the **only** image the site shows (card avatar, portrait plate on their page, previews) |
| `src/assets/teachers/gaurav-sir.png`           | same, then shrink it for phones with `npm run portraits` (760px WebP, ~60KB) |
| `public/teachers/gaurav-sir.jpg`               | 📷 raw photo — a draft only, never shown on the site |
| nothing                                        | colourful initials avatar + a monogram crest on their page instead of a portrait |

Teachers without a portrait lose the photo column entirely — no empty frame, no 404.
Run `npm run photos` any time to see which teacher resolves to which file.

The painted version is the one to aim for: fun and colourful, but always respectful —
head-and-shoulders, warm light, a big smile, nothing caricatured, no props that make a
teacher a joke. Ask and we'll paint the dropped photos into `<id>-art.png` for you.

## 🖨️ Print cards (`Teachers_Day_Cards_5.pdf`)

One A4-landscape sheet per teacher, double-sided, **flip on long edge**, then fold on the
dashed centre line. Every card carries two QR codes (small one on the back panel, big one
inside) plus tap links, all pointing at that teacher's own page:

    https://teacher-s-day-aakash.vercel.app/teacher.html?id=<teacher-id>

Re-patch the file after changing teachers, roll number or copy:

    pip install pymupdf qrcode pillow fonttools
    python3 scripts/fix-card-pdf.py

`scripts/fix-card-pdf.py` edits the PDF in place — it swaps in per-teacher QR codes, drops
each teacher's hand-painted portrait (`src/assets/teachers/<id>.webp`) into the photo ring,
refreshes the branding/roll line and rewrites the "how to scan" steps. The original artwork,
colours and fonts are kept; nothing is re-laid-out.


## 🎉 Fun features

- **Individual dedication page per teacher** — paper-style letter, Read Aloud (Indian
  English voice), Send a Wish (heart confetti + counter), WhatsApp/copy-link share,
  prev-next + related teachers
- **Categories everywhere** — Subjects dropdown in nav, per-subject landing pages, wish-wall
  categories (😂 Funny · 🥹 Emotional · ✨ Inspirational · 🙏 Thank You) with filters
- **Daily Teacher Spotlight** on Home, **Print the Letter** + **←/→ keyboard walk** on dedications
- **Multilingual "thank you" marquee** — Thank You / धन्यवाद / शुक्रिया / ধন্যবাদ / நன்றி … scrolling on the home page
- **Daily wish** — a fresh little tribute every day of the week (Sunday → Saturday)
- **Shuffling quote pool** — tap "Another one" to cycle through the site's best lines
- **Sealed, self-typing letter** — tap to break the seal, watch it type itself out with a
  good-morning / good-afternoon / good-evening greeting, and skip anytime
- **Subject minigames** on every dedication page:
  - 🥧 **Maths** — type as many digits of π as you can
  - 🔈 **Physics** — a Web Audio "sound lab" with a live frequency wave + heartbeat pulse
  - ⚗️ **Chemistry** — spell your name as periodic-table element tiles
  - 🧬 **Biology** — a rapid-fire 3-question quiz
  - 🗺️ **SST & English** — a history + grammar rapid round
- **4 hidden secrets** per teacher — tap a card to unseal it (remembered on this device)
- **"From your students" message library** — browse the class's thank-yous with ← → arrows
- **Design System page** — the pop palette, subject accents, type and every component, tap a swatch to copy hex
- **Claymorphism look** — every surface is modelled like soft clay: lit top edge, shaded underside,
  a soft violet drop, squircle corners and a signature hue per subject
  (periwinkle · rose · apricot · jade · grape)
- **Memories Room** — whiteboard with rotating student-life facts + your own wish wall
- Filter by subject (deep-linkable: `teachers.html?subject=Physics`) + instant search
- Confetti everywhere, scroll progress bar, cursor glow, 3D tilt + spotlight cards,
  count-up stats
- **Built phone-first** — 360–430px pass with swipe-snap teacher rail, 44px tap targets,
  16px form text (no iOS zoom), safe-area padding, a dimmed drawer you can tap away,
  and lighter effects (glow/aurora off) so it stays smooth on a mid-range handset

### 🪆 The look: clay

Nothing is drawn with outlines — shape comes from light. Pastel clay slabs sit on a soft
coloured bed, catch a highlight along the top edge and shade underneath, and sink when you
press them. Rounded Baloo 2 headlines, handwritten Caveat notes, one clay hue per subject.
`design.html` documents the whole system.

Happy Teacher's Day! 🎓💙
