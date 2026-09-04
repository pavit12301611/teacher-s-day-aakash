# 💙 Teacher's Day @ Aakash

A beautiful, fast, blue-and-white website to wish **Happy Teacher's Day** to every
teacher of Aakash Coaching Centre — with a **personal message for each teacher**.

Built with **TypeScript + Vite** (zero runtime dependencies, tiny custom confetti
engine, buttery smooth animations).

## 🚀 Run it

```bash
npm install
npm run dev     # dev server (fast, hot reload)
npm run build   # production build (also type-checks the TS)
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
  note: "Fun fact shown with the message."
}
```

Just copy a block, change the details, and the site rebuilds itself instantly.
TypeScript even validates the shape for you.

## 📸 Add real photos

1. Save the photo into **`public/teachers/`** — e.g. `public/teachers/rahul-sir.jpg`
2. Set `photo: "/teachers/rahul-sir.jpg"` in `src/teachers.ts`
3. No photo? Keep `photo: null` — a pretty auto-avatar with their initials shows up.

## 🎉 Fun features

- Personal message modal for every teacher (staggered reveal)
- **Read Aloud** — the browser reads each message out loud (Indian English voice)
- **Send a Wish** — heart confetti burst + wish counter
- Chalkboard "Fun Zone" with rotating student-life facts
- Filter by subject + instant search
- Confetti surprises everywhere, scroll progress bar, smooth reveals
- Fully responsive (mobile menu, adaptive grid)

Happy Teacher's Day! 🎓💙
