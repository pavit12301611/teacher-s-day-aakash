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
| `src/assets/teachers/rahul-sir.png`            | 🎨 hand-painted portrait — bundled, hashed, **always preferred** |
| `public/teachers/rahul-sir.jpg`                | 📷 raw photo — used when no painted portrait exists |
| `photo: "/somewhere/rahul.png"` in `teachers.ts` | manual override, wins over both |
| nothing                                        | colourful initials avatar with a dashed subject ring |

Run `npm run photos` any time to see which teachers already have a portrait.

The painted version is the one to aim for: fun and colourful, but always respectful —
head-and-shoulders, warm light, a big smile, nothing caricatured, no props that make a
teacher a joke. Ask and we'll paint the dropped photos into `<id>-art.png` for you.

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
- **Bright "Pop Celebration" theme** — paper-white pages, rainbow washes, confetti dots, coloured
  card strips and a signature hue per subject (blue · pink · amber · mint · grape)
- **Memories Room** — whiteboard with rotating student-life facts + your own wish wall
- Filter by subject (deep-linkable: `teachers.html?subject=Physics`) + instant search
- Confetti everywhere, scroll progress bar, cursor glow, 3D tilt + spotlight cards,
  count-up stats
- **Built phone-first** — 360–430px pass with swipe-snap teacher rail, 44px tap targets,
  16px form text (no iOS zoom), safe-area padding, a dimmed drawer you can tap away,
  and lighter effects (glow/aurora off) so it stays smooth on a mid-range handset

### 🎨 The look: "festive paper studio"

Every page is printed on the same stock: paper-white canvas + grain, ink hairline borders
with a hard offset shadow, washi tape holding the hero card, rainbow tick marks above each
section heading, sticker eyebrows, Fraunces display type with italic pull-quotes, and one
signature hue per subject. `design.html` documents all of it.

Happy Teacher's Day! 🎓💙
