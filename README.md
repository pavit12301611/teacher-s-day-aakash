# 💙 Teacher's Day @ Aakash (Multipage Edition)

A beautiful, fast, blue-white-and-gold website to wish **Happy Teacher's Day** to every
teacher of Aakash Coaching Centre — where **each teacher gets their own individual
dedication page** with a personal letter.

Built with **TypeScript + Vite multi-page app** (zero runtime dependencies, tiny custom
confetti engine, buttery smooth animations).

## 🗺️ Pages

| Page | File | What it is |
|------|------|------------|
| Home | `index.html` | Aurora hero, stats, featured teachers, subjects, how-it-works, quote, CTA |
| All Teachers | `teachers.html` | Search + filter by subject, gallery of every teacher |
| **Teacher dedication** | `teacher.html?id=<teacher-id>` | **Individual page per teacher** — letter, quote, superpower, dialogue, Read Aloud, Send a Wish, WhatsApp share, prev/next, related teachers |
| Memories Room | `memories.html` | Chalkboard fun zone, live wish wall (saved on device), confetti playground |
| Our Story | `about.html` | Values, timeline of an Aakash day, love note |

Example individual pages: `teacher.html?id=rakesh-sir`, `teacher.html?id=anjali-mam`, …

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
  subject: "Physics",                  // Physics | Chemistry | Mathematics | Biology
  emoji: "🚀",
  tagline: "A short fun line",
  photo: null,                          // e.g. "/teachers/rahul-sir.jpg"
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

## 📸 Add real photos

1. Save the photo into **`public/teachers/`** — e.g. `public/teachers/rahul-sir.jpg`
2. Set `photo: "/teachers/rahul-sir.jpg"` in `src/teachers.ts`
3. No photo? Keep `photo: null` — a pretty auto-avatar with their initials shows up.

## 🎉 Fun features

- **Individual dedication page per teacher** — paper-style letter, Read Aloud (Indian
  English voice), Send a Wish (heart confetti + counter), WhatsApp/copy-link share,
  prev-next + related teachers
- **Memories Room** — chalkboard with rotating student-life facts + your own wish wall
- Filter by subject (deep-linkable: `teachers.html?subject=Physics`) + instant search
- Confetti everywhere, scroll progress bar, cursor glow, 3D tilt + spotlight cards,
  count-up stats, fully responsive with mobile menu

Happy Teacher's Day! 🎓💙
