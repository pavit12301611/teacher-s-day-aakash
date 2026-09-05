/* ============================================================
   ✏️  EDIT THIS FILE TO ADD / CHANGE YOUR REAL TEACHERS
   ------------------------------------------------------------
   1. Copy one block below and change the details (TypeScript
      will even check it for you).
   2. When you get the real photos:
      - Drop the photo into  public/teachers/  (e.g. rahul-sir.jpg)
      - Set  photo: "/teachers/rahul-sir.jpg"
   3. No photo? Just keep  photo: null — a pretty auto-avatar
      with their initials appears automatically.
   4. Every teacher automatically gets an individual dedication
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
  photo: string | null; // e.g. "/teachers/rahul-sir.jpg" or null
  message: string[]; // personal letter, one paragraph per entry
  note: string; // fun fact shown with the letter
  quote: string; // signature line shown big on their page
  superpower: string; // "teacher superpower" badge
  dialogue: string; // their legendary classroom dialogue
}

export const TEACHERS: Teacher[] = [
  {
    id: "gaurav-sir",
    name: "Gaurav Sir",
    salutation: "Gaurav Sir",
    subject: "Biology",
    emoji: "🧬",
    tagline: "The mitochondria storyteller",
    photo: null,
    message: [
      "Dear Gaurav Sir, biology before you was a long list of scary Latin words that we read and forgot in the same minute. Then you walked in, drew one smiling cell on the board, and turned the whole chapter into a story we still retell at home. 🌿",
      "Thank you for the \"yeh diagram dekho\" moments, for making the human body feel like a busy little city that never sleeps, and for never skipping the interesting part just because the exam doesn't ask it.",
      "You taught us that everything living grows when someone waters it patiently — including our motivation. Happy Teacher's Day, Sir! We promise mitochondria remains the powerhouse of the cell AND of our batch. 💙"
    ],
    note: "Fun fact: Your handwritten diagram of the heart gets photographed more than the bell-ring gets cheered.",
    quote: "Har cell mein ek kahani chhupi hai — bas dhyan se dekho.",
    superpower: "Diagrams that belong in a museum",
    dialogue: "“Yeh yaad rakho — pakka aayega!”"
  },
  {
    id: "harshita-mam",
    name: "Harshita Ma'am",
    salutation: "Harshita Ma'am",
    subject: "Chemistry",
    emoji: "🧪",
    tagline: "Master of classroom magic",
    photo: null,
    message: [
      "Dear Harshita Ma'am, chemistry felt like a magic trick we could never decode — until you started every class with \"ab dekho, ek reaction hoga\" and proved that every trick has a reason behind it. 🪄",
      "Thank you for balancing equations like they were life advice, for the extra five minutes after the bell that were always the best five minutes, and for making organic reactions feel like a series with a happy ending.",
      "You are the catalyst this batch didn't know it needed. Happy Teacher's Day, Ma'am — may your class always fizz with curiosity, and may your \"one last thing\" never end. 💙"
    ],
    note: "Fun fact: Your \"one last thing\" before the bell is 10 minutes long, and nobody has ever complained. Once.",
    quote: "Har reaction ka ek reason hota hai — humare case mein, woh aap ho.",
    superpower: "Organic mechanisms on her fingertips",
    dialogue: "“Ab dekho, ek reaction hoga!” ✨"
  },
  {
    id: "rahul-sir",
    name: "Rahul Sir",
    salutation: "Rahul Sir",
    subject: "Physics",
    emoji: "🚀",
    tagline: "Two diagrams and it's solved",
    photo: null,
    message: [
      "Dear Rahul Sir, physics used to feel like a monster made entirely of formulas. Then you drew one tiny free-body diagram, said \"bas itna hi karna tha\", and the monster quietly turned into a friendly robot. 🤖",
      "Thank you for answering our 47th doubt with the same patience as the first, for the 8 AM energy that somehow beats our alarm clock, and for never letting anyone leave class saying \"mujhe physics nahi aati\".",
      "You made forces feel like support instead of pressure. Happy Teacher's Day, Sir — our acceleration towards \"we can do this\" started in your classroom. 🚀"
    ],
    note: "Fun fact: Even our toppers pretend they didn't understand, just to hear the explanation one more time.",
    quote: "Physics tough nahi hai — bas direction sahi hona chahiye.",
    superpower: "Any numerical surrenders in 2 diagrams",
    dialogue: "“Direction batao, answer aa jayega!”"
  },
  {
    id: "wajid-sir",
    name: "Wajid Sir",
    salutation: "Wajid Sir",
    subject: "SST & English",
    emoji: "🗺️",
    tagline: "Maps, dates and the perfect comma",
    photo: null,
    message: [
      "Dear Wajid Sir, you teach two subjects at once and still make both feel like your favourite. History stopped being a list of dates the day you narrated it like a serial with a cliffhanger at the end. 🌍",
      "Thank you for turning our one-line answers into full-marks paragraphs, for the red pen that always left one compliment next to the corrections, and for proving that a comma can change a sentence — and a good sentence can change an entire answer sheet.",
      "You gave us the words and the reasons. Happy Teacher's Day, Sir! Intro, three points, conclusion — and a big \"thank you\" from the whole batch. 💙"
    ],
    note: "Fun fact: Your board summary of a whole chapter is shorter than a WhatsApp note and better than a documentary.",
    quote: "Story samajh aayi toh date khud yaad ho jayegi.",
    superpower: "Turns a weak answer into a 5-marker",
    dialogue: "“Intro, three points, conclusion — mark milenge!”"
  },
  {
    id: "shivam-sir",
    name: "Shivam Sir",
    salutation: "Shivam Sir",
    subject: "Mathematics",
    emoji: "📐",
    tagline: "Hero of every equation",
    photo: null,
    message: [
      "Dear Shivam Sir, maths was the subject we avoided like that one relative at a family function. Then you walked in with a marker, said \"simple hai, ek minute\", and we believed you — every single time. 📏",
      "Thank you for making integrals feel like puzzles instead of punishments, for the shortcut notes the whole batch trades like treasure, and for never letting anyone feel small for a wrong step.",
      "You taught us that a mistake is just data with a future. Happy Teacher's Day, Sir — may your logic stay flawless and your doubt queue stay forever long. 💙"
    ],
    note: "Fun fact: We forget our own birthdays, but never your shortcut for that one trigonometry identity.",
    quote: "Maths se dosti kar lo, life set hai.",
    superpower: "Shortcuts that toppers whisper about",
    dialogue: "“Simple hai, ek minute!”"
  }
];

/* Fun, rotating chalkboard facts about student life */
export const CHALK_FACTS: string[] = [
  "Physics is easy when the teacher explains it — like rocket science is easy for NASA. 🚀",
  "y = mx + c is the only friendship equation that is ALWAYS true. 📈",
  "A teacher's day: 4 hours class, 3 hours doubt solving, 1 hour \"beta thoda aur padho\". ⏰",
  "Mitochondria is the powerhouse of the cell, but the teacher is the powerhouse of the class. ⚡",
  "Organic chemistry = 50% magic + 50% hard work + 100% \"ek baar aur samjhaiye\". 🧪",
  "Homework is just love hidden inside a question paper. 💌",
  "The best teachers don't hand out answers — they hand out confidence. 💙",
  "Ask your doubts, not your tuition fees' worth! (Okay, that one's just free advice.) 😄",
  "Back-benchers notice everything — especially which teacher truly cares. 👀",
  "\"Beta, yeh last topic hai\" is the biggest plot twist of every syllabus. 📚",
  "A comma can change a sentence; a great teacher can change a whole life. ✍️",
  "History feels free when the teacher narrates it like a series with a cliffhanger. 🍿"
];

/** Blue-family accent per subject so the palette stays on-theme */
export const SUBJECT_META: Record<Subject, { color: string; soft: string }> = {
  Physics: { color: "#2563eb", soft: "#e5efff" },
  Chemistry: { color: "#0ea5e9", soft: "#e3f6ff" },
  Mathematics: { color: "#4f46e5", soft: "#e9e8ff" },
  Biology: { color: "#0891b2", soft: "#e0f7fb" },
  "SST & English": { color: "#1e40af", soft: "#e6ebff" }
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
    blurb: "From scary numericals to friendly diagrams — the subject that taught us to think.",
    topics: ["Mechanics", "Electromagnetism", "Optics"]
  },
  {
    subject: "Chemistry",
    icon: "🧪",
    blurb: "Magic in a test tube. Every reaction explained like a story with a happy ending.",
    topics: ["Organic", "Physical", "Inorganic"]
  },
  {
    subject: "Mathematics",
    icon: "📐",
    blurb: "Integrals turned into puzzles, mistakes turned into marks. Pure logic, pure love.",
    topics: ["Calculus", "Algebra", "Geometry"]
  },
  {
    subject: "Biology",
    icon: "🧬",
    blurb: "Mitochondria love-stories and museum-worthy diagrams. Life, taught lively.",
    topics: ["Human Body", "Botany", "Genetics"]
  },
  {
    subject: "SST & English",
    icon: "🗺️",
    blurb: "Maps, dates and the perfect comma — where stories became strategy and answers became art.",
    topics: ["History & Civics", "Grammar", "Literature"]
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
    text: "Sorry for the last-bench noise, thank you for never giving up on us. You are the real MVPs! 💙",
    category: "Funny"
  },
  {
    name: "Neet Aspirant '26",
    forTeacher: "Gaurav Sir",
    text: "Your diagrams got me through the whole human physiology chapter in one night. Legend! 🌿",
    category: "Thank You"
  },
  {
    name: "JEE Warrior",
    forTeacher: "Rahul Sir",
    text: "Rotational mechanics finally rotates in my brain instead of scaring it. Thank you, Sir! 🚀",
    category: "Inspirational"
  },
  {
    name: "Class Topper (nervous)",
    forTeacher: "Shivam Sir",
    text: "Your shortcut notes are my most-guarded treasure. Happy Teacher's Day! 📐",
    category: "Funny"
  },
  {
    name: "Front Bench First-Row",
    forTeacher: "Harshita Ma'am",
    text: "\"Ab dekho, ek reaction hoga\" — and suddenly chemistry felt like home. I'll carry that magic everywhere. 🧪",
    category: "Emotional"
  },
  {
    name: "Essay to 5-Marker Convert",
    forTeacher: "Wajid Sir",
    text: "You took my one-line answers and made them full-marks paragraphs. Intro, three points, conclusion — and gratitude. 🗺️",
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
