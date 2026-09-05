/* ============================================================
   ✏️  EDIT THIS FILE TO ADD / CHANGE YOUR REAL TEACHERS
   ------------------------------------------------------------
   1. Copy one block below and change the details (TypeScript
      will even check it for you).
   2. Portraits are zero-config: put a hand-painted portrait at
         src/assets/teachers/<id>.webp   (also .png/.jpg/.jpeg)
      and it is bundled, hashed and shown on the card, the avatar
      and the big portrait plate at the top of their page. Raw
      photos in public/teachers/ are only drafts — the site always
      shows the painted version, so a teacher without one simply
      keeps the colourful initials avatar.
      `photo: "/somewhere.png"` overrides the lookup by hand.
   3. Every teacher automatically gets an individual dedication
      page at  teacher.html?id=<id>  — no extra work needed.
   ============================================================ */

export type Subject =
  | "Physics"
  | "Chemistry"
  | "Mathematics"
  | "Biology"
  | "SST & English";

export interface Teacher {
  id: string;
  name: string;
  salutation: string; // how we greet them e.g. "Rahul Sir"
  subject: Subject;
  emoji: string; // subject doodle
  tagline: string; // short fun line on the card
  photo?: string | null; // optional override, e.g. "/teachers/rahul-sir.jpg"
  message: string[]; // personal letter, one paragraph per entry
  note: string; // fun fact shown with the letter
  quote: string; // signature line shown big on their page
  superpower: string; // "teacher superpower" badge
  dialogue: string; // their legendary classroom dialogue
}

/** The five teachers of our batch — one per subject. */
export const TEACHERS: Teacher[] = [
  {
    id: "gaurav-sir",
    name: "Gaurav Sir",
    salutation: "Gaurav Sir",
    subject: "Biology",
    emoji: "🧬",
    tagline: "Turns every cell into a story",
    photo: null,
    message: [
      "Dear Gaurav Sir, biology reached us as a wall of Latin terms and left as a living city — organelles with jobs, enzymes with personalities, and a Krebs cycle you could narrate from memory. That transformation is entirely yours.",
      "Thank you for the labelled diagrams we still copy exactly as you drew them, for connecting genetics to our own families so inheritance finally made sense, and for insisting that a biological answer is only complete when the reasoning is written beside it.",
      "You taught us that life is systematic even when it looks messy — and that lesson reaches far beyond the syllabus. Happy Teacher's Day, Sir. 💙"
    ],
    note: "Fun fact: Your human-heart diagram has been photographed so many times that a version of it exists somewhere in every phone in the batch.",
    quote: "Every cell tells a story — read it carefully.",
    superpower: "Museum-grade diagrams, drawn in ninety seconds",
    dialogue: "“Label it properly and half the answer is done.”"
  },
  {
    id: "harshita-mam",
    name: "Harshita Ma'am",
    salutation: "Harshita Ma'am",
    subject: "Chemistry",
    emoji: "🧪",
    tagline: "Every reaction has a reason",
    photo: null,
    message: [
      "Dear Harshita Ma'am, you began every chapter the same way — with a question instead of a definition. Why does the rate change? Why is this isomer more stable? By the time we reached the answer, the concept had already settled in.",
      "Thank you for the mole concept taught without fear, for arrow-pushing mechanisms drawn one step at a time, and for making titration practicals feel like real laboratory work rather than a formality.",
      "You balanced our equation between marks and understanding, and both sides came out right. Happy Teacher's Day, Ma'am. 💙"
    ],
    note: "Fun fact: Your 'one last thing' before the bell runs about ten minutes long — and the class leans in for every one of them.",
    quote: "Chemistry is everywhere — start asking why.",
    superpower: "Organic mechanisms explained from memory, never from the book",
    dialogue: "“Watch the arrow — the electron decides.”"
  },
  {
    id: "rahul-sir",
    name: "Rahul Sir",
    salutation: "Rahul Sir",
    subject: "Physics",
    emoji: "🚀",
    tagline: "Two diagrams and the numerical surrenders",
    photo: null,
    message: [
      "Dear Rahul Sir, physics arrived as a list of formulas and left as a set of pictures. Free-body diagrams first, equations second — that order changed how our entire batch thinks about a problem.",
      "Thank you for rotational mechanics that finally rotated, for simple harmonic motion we could actually sketch, and for treating a wrong answer as a starting point instead of a verdict.",
      "You made forces feel like support rather than pressure, and that is the part of physics we have kept. Happy Teacher's Day, Sir. 🚀"
    ],
    note: "Fun fact: Our toppers have been caught re-asking a solved question just to hear your second, shorter method.",
    quote: "Get the direction right and the magnitude follows.",
    superpower: "Any numerical surrenders within two diagrams",
    dialogue: "“Draw it first. The maths is just follow-up.”"
  },
  {
    id: "wajid-sir",
    name: "Wajid Sir",
    salutation: "Wajid Sir",
    subject: "SST & English",
    emoji: "🗺️",
    tagline: "Maps, civics and the perfect comma",
    photo: null,
    message: [
      "Dear Wajid Sir, you carry two subjects and give each of them full attention. History stopped being a list of dates the day you taught it as cause and consequence, and English stopped being a grammar checklist the day you made us read our own sentences aloud.",
      "Thank you for the map work that made geography visual, for the Constitution chapter that made civics matter, and for red-pen notes that explained the mark instead of just awarding it.",
      "You gave us the argument and the language to deliver it. Happy Teacher's Day, Sir. 💙"
    ],
    note: "Fun fact: Your half-slate summary of an entire chapter has quietly out-performed printed guides for three batches running.",
    quote: "A date is forgettable; the reason behind it never is.",
    superpower: "Converts a thin answer into a full-mark five-marker",
    dialogue: "“Point, evidence, conclusion — marks follow.”"
  },
  {
    id: "shivam-sir",
    name: "Shivam Sir",
    salutation: "Shivam Sir",
    subject: "Mathematics",
    emoji: "📐",
    tagline: "Makes the long method look short",
    photo: null,
    message: [
      "Dear Shivam Sir, your classroom runs on one calm sentence: it is simple, give me a minute. And every time, it actually was — definite integrals split into parts, coordinate geometry reduced to a clean sketch, proofs that finally looked logical.",
      "Thank you for the practice sets that got harder in exactly the right order, for the shortcut sheet the whole batch trades like currency, and for never moving on before the last hand went down.",
      "You taught us that a wrong step is information, not failure. Our method — in exams and outside them — still looks like yours. Happy Teacher's Day, Sir. 💙"
    ],
    note: "Fun fact: Your reduction formula for ∫xⁿeˣ has been recited in corridors more accurately than any anthem.",
    quote: "Maths rewards the process, not the panic.",
    superpower: "Shortcuts that toppers quietly trade with each other",
    dialogue: "“It's simple — give me one minute.”"
  }
];

/** Chalkboard truths — one flavour per subject, straight from the batch. */
export const CHALK_FACTS: string[] = [
  "Physics: the numerical was never the hard part — the free-body diagram was. 🚀",
  "Chemistry: the mole concept is just a very large dozen. Somebody finally said it. 🧪",
  "Mathematics: definite integrals are 50% logic and 50% not panicking at the limits. 📐",
  "Biology: a labelled diagram answers the question before the examiner reaches the reasoning. 🧬",
  "SST & English: cause, consequence, conclusion — history and an essay run on the same rails. 🗺️",
  "Homework is love hidden inside a question paper. 💌",
  "The best teachers hand out method, not answers. 💙",
  "Back-benchers notice everything — especially which teacher genuinely cares. 👀",
  "“Last topic today” is the most reliable plot twist in the entire syllabus. 📚",
  "A comma changes a sentence; a good teacher changes a whole answer sheet. ✍️"
];

/** Blue-to-colour accent per subject: `color` is the ink, `color2` the gradient partner. */
export const SUBJECT_META: Record<
  Subject,
  { color: string; color2: string; soft: string }
> = {
  Physics: { color: "#5b7ce8", color2: "#4fbcd8", soft: "#e5ecfb" },
  Chemistry: { color: "#cf4f86", color2: "#f0977a", soft: "#fbe7f0" },
  Mathematics: { color: "#dd8637", color2: "#f3b54a", soft: "#fbeede" },
  Biology: { color: "#3ea883", color2: "#7fd6a4", soft: "#e4f6ee" },
  "SST & English": { color: "#8a6ce0", color2: "#cd77d8", soft: "#ece6fb" }
};

export interface SubjectInfo {
  subject: Subject;
  icon: string;
  blurb: string;
  topics: string[];
}

/** Rich subject cards for the home page */
export const SUBJECTS: SubjectInfo[] = [
  {
    subject: "Physics",
    icon: "🚀",
    blurb: "Mechanics to modern physics — taught as diagrams first, equations second.",
    topics: ["Mechanics", "Electromagnetism", "Optics & Modern"]
  },
  {
    subject: "Chemistry",
    icon: "🧪",
    blurb: "Physical, organic, inorganic — every reaction with a reason behind it.",
    topics: ["Mole Concept", "Organic Mechanisms", "Equilibrium"]
  },
  {
    subject: "Mathematics",
    icon: "📐",
    blurb: "Calculus, algebra and geometry — where the method matters more than the answer.",
    topics: ["Calculus", "Algebra", "Coordinate Geometry"]
  },
  {
    subject: "Biology",
    icon: "🧬",
    blurb: "Cell to ecosystem — diagrams that teach the concept without a single lecture.",
    topics: ["Cell Biology", "Genetics", "Human Physiology"]
  },
  {
    subject: "SST & English",
    icon: "🗺️",
    blurb: "History, civics and communication — where the argument and the language both count.",
    topics: ["Modern History", "Civics & Economy", "Grammar & Writing"]
  }
];

/** Preset messages for the Memories wish-wall */
export type WishCategory = "Funny" | "Emotional" | "Inspirational" | "Thank You";

export interface WishCategoryInfo {
  id: WishCategory;
  emoji: string;
}

/** Categories that organise every wish on the wall */
export const WISH_CATEGORIES: WishCategoryInfo[] = [
  { id: "Funny", emoji: "😂" },
  { id: "Emotional", emoji: "🥹" },
  { id: "Inspirational", emoji: "✨" },
  { id: "Thank You", emoji: "🙏" }
];

export function wishCategoryEmoji(cat: string): string {
  return WISH_CATEGORIES.find((c) => c.id === cat)?.emoji ?? "💙";
}

export interface WallWish {
  name: string;
  forTeacher: string;
  text: string;
  category: WishCategory;
}

export const WALL_WISHES: WallWish[] = [
  {
    name: "Back Bench Batch",
    forTeacher: "All Teachers",
    text: "Sorry for the noise at the back. Thank you for never writing us off — you are the real MVPs. 💙",
    category: "Funny"
  },
  {
    name: "Neet Aspirant '26",
    forTeacher: "Gaurav Sir",
    text: "Your labelled diagrams carried me through human physiology in a single night. Anatomy has never looked so organised. 🧬",
    category: "Thank You"
  },
  {
    name: "JEE Warrior",
    forTeacher: "Rahul Sir",
    text: "Rotational mechanics finally rotates in my head instead of scaring it. Draw it first — I still do that in every subject. 🚀",
    category: "Inspirational"
  },
  {
    name: "Class Topper (nervous)",
    forTeacher: "Shivam Sir",
    text: "Your shortcut sheet is my most guarded possession. The method, not just the answer — noted, Sir. 📐",
    category: "Funny"
  },
  {
    name: "Front Bench First Row",
    forTeacher: "Harshita Ma'am",
    text: "You made organic mechanisms look like a story with a motive. I can still push the arrows in my sleep. 🧪",
    category: "Emotional"
  },
  {
    name: "Answer-Sheet Redeemed",
    forTeacher: "Wajid Sir",
    text: "You turned my three-line answers into a proper five-marker: point, evidence, conclusion. Both subjects, both fixed. 🗺️",
    category: "Thank You"
  }
];

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

/* -------------------- portraits (shared) -------------------- */

/**
 * Hand-painted portraits live in src/assets/teachers/ and are wired up
 * automatically by Vite — `<id>.webp` (or .png/.jpg/.jpeg, optionally
 * `<id>-art.ext`) is bundled, hashed and used everywhere. A teacher
 * without a painted portrait gets the colourful initials avatar and a
 * text-only dedication page: no empty frame, no broken image.
 */
const PAINTED = import.meta.glob<string>("./assets/teachers/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default"
});

const PAINTED_FOR: Record<string, string> = {};
for (const path of Object.keys(PAINTED)) {
  const file = path.split("/").pop() ?? "";
  const id = file.replace(/-art\.[a-z]+$/i, "").replace(/\.[a-z]+$/i, "").toLowerCase();
  if (id) PAINTED_FOR[id] = PAINTED[path]!;
}

export interface Portrait {
  /** portrait url, or "" when this teacher has no painted portrait yet */
  src: string;
  /** true when there is a real image to show (painted portrait or photo override) */
  painted: boolean;
  /** descriptive alt text for the portrait */
  alt: string;
}

/** The painted portrait for a teacher — the only kind the site ever shows. */
export function portraitOf(t: Teacher): Portrait {
  const painted = PAINTED_FOR[t.id];
  if (painted) {
    return { src: painted, painted: true, alt: `Hand-painted portrait of ${t.name}` };
  }
  if (t.photo) return { src: t.photo, painted: true, alt: `Portrait of ${t.name}` };
  return { src: "", painted: false, alt: "" };
}

/** Does this teacher have a portrait to show? (drives the portrait-first layout) */
export function hasPortrait(t: Teacher): boolean {
  return portraitOf(t).painted;
}

/* -------------------- page helpers (shared) -------------------- */

export function getTeacher(id: string | null): Teacher | undefined {
  if (!id) return undefined;
  return TEACHERS.find((t) => t.id === id.toLowerCase().trim());
}

export function teacherUrl(t: Teacher): string {
  return `teacher.html?id=${t.id}`;
}

export function prevTeacher(t: Teacher): Teacher {
  const i = TEACHERS.findIndex((x) => x.id === t.id);
  return TEACHERS[(i - 1 + TEACHERS.length) % TEACHERS.length]!;
}

export function nextTeacher(t: Teacher): Teacher {
  const i = TEACHERS.findIndex((x) => x.id === t.id);
  return TEACHERS[(i + 1) % TEACHERS.length]!;
}

export function relatedTeachers(t: Teacher, count = 3): Teacher[] {
  const same = TEACHERS.filter((x) => x.id !== t.id && x.subject === t.subject);
  const rest = TEACHERS.filter((x) => x.id !== t.id && x.subject !== t.subject);
  return [...same, ...rest].slice(0, count);
}

export function teachersBySubject(subject: Subject): Teacher[] {
  return TEACHERS.filter((t) => t.subject === subject);
}

export function subjectCount(subject: Subject): number {
  return TEACHERS.filter((t) => t.subject === subject).length;
}

export function subjectTopics(subject: Subject): string[] {
  return SUBJECTS.find((s) => s.subject === subject)?.topics ?? [];
}

export function subjectBlurb(subject: Subject): string {
  return SUBJECTS.find((s) => s.subject === subject)?.blurb ?? "";
}
