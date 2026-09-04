/* ============================================================
   ✏️  EDIT THIS FILE TO ADD / CHANGE YOUR REAL TEACHERS
   ------------------------------------------------------------
   1. Copy one block below and change the details (TypeScript
      will even check it for you).
   2. When you get the real photos:
      - Drop the photo into  public/teachers/  (e.g. rakesh-sir.jpg)
      - Set  photo: "/teachers/rakesh-sir.jpg"
   3. No photo? Just keep  photo: null — a pretty auto-avatar
      with their initials appears automatically.
   4. Every teacher automatically gets an individual dedication
      page at  teacher.html?id=<id>  — no extra work needed.
   ============================================================ */

export type Subject = "Physics" | "Chemistry" | "Mathematics" | "Biology";

export interface Teacher {
  id: string;
  name: string;
  salutation: string; // how we greet them e.g. "Rakesh Sir"
  subject: Subject;
  emoji: string; // subject doodle
  tagline: string; // short fun line on the card
  photo: string | null; // e.g. "/teachers/rakesh-sir.jpg" or null
  message: string[]; // personal letter, one paragraph per entry
  note: string; // fun fact shown with the letter
  quote: string; // signature line shown big on their page
  superpower: string; // "teacher superpower" badge
  dialogue: string; // their legendary classroom dialogue
}

export const TEACHERS: Teacher[] = [
  {
    id: "rakesh-sir",
    name: "Rakesh Kumar",
    salutation: "Rakesh Sir",
    subject: "Physics",
    emoji: "🚀",
    tagline: "The Newton of our classroom",
    photo: null,
    message: [
      "Dear Rakesh Sir, for the longest time physics felt like a scary monster. Then you walked in, drew a tiny diagram on the board, and suddenly the monster turned into a friendly robot who explains everything. 🤖✨",
      "Thank you for never getting tired of our \"ek baar aur samjhaiye\" — even when we asked a 47th time. Your patience is stronger than a JEE-level problem, and your energy is higher than our marks (which you somehow keep fixing).",
      "You made F = ma feel like a formula for friendship too! Have a wonderful Teacher's Day, Sir. We promise to never forget you — just like we never forget to ask doubts right before a test. 😄"
    ],
    note: "Fun fact: You explain so well that even our toppers pretend they didn't understand, just to hear the explanation again.",
    quote: "Physics is not tough — bas direction sahi hona chahiye.",
    superpower: "Any numerical surrenders in 2 diagrams",
    dialogue: "“Ek baar aur samjhaiye? Arre 47 baar sahi!”"
  },
  {
    id: "anjali-mam",
    name: "Anjali Sharma",
    salutation: "Anjali Ma'am",
    subject: "Chemistry",
    emoji: "🧪",
    tagline: "Master of magical reactions",
    photo: null,
    message: [
      "Dear Anjali Ma'am, you are the catalyst that turned our boring chemistry class into pure fun. Every time you say \"ab dekho ek magic hoga\", we know something awesome is about to happen — like our marks, after your revision series! 🪄",
      "Thank you for teaching us that chemistry is everywhere: in the bond we share, in the salt of our tears after a tough test (yes, we cried a little inside), and in organic reactions you explain better than any YouTube channel.",
      "You balance equations so beautifully that we wish life was that easy. Happy Teacher's Day, Ma'am! Stay sparkling, stay magical, and never leave the class without that one final tip. 💙"
    ],
    note: "Fun fact: Your \"one last thing\" before the bell is 10 minutes long and we still love every second.",
    quote: "Har reaction ka ek reason hota hai — bas catalyst tum ho.",
    superpower: "Organic mechanisms on her fingertips",
    dialogue: "“Ab dekho, ek magic hoga!” ✨"
  },
  {
    id: "vikram-sir",
    name: "Vikram Singh",
    salutation: "Vikram Sir",
    subject: "Mathematics",
    emoji: "📐",
    tagline: "Hero of every equation",
    photo: null,
    message: [
      "Dear Vikram Sir, maths used to be that cousin we avoided at family functions. You walked in with a marker, a smile, and a legendary phrase — \"simple hai, ek minute\" — and turned us into fans. 📏",
      "Thank you for making integrals feel like puzzles instead of punishments, and for never letting anyone feel stupid for getting it wrong. Your \"mistake is the first step to marks\" has fixed more student mood-swings than any motivation video.",
      "Equation after equation, chapter after chapter, you have been our constant. Happy Teacher's Day, Sir! May your logic always be flawless — and your doubt queue always long, because everyone wants to learn from you. 💙"
    ],
    note: "Fun fact: We can forget our own birthday, but never your shortcut notes. They are literally legend.",
    quote: "Maths se dosti kar lo, life set hai.",
    superpower: "Shortcuts that toppers whisper about",
    dialogue: "“Simple hai, ek minute!”"
  },
  {
    id: "priya-mam",
    name: "Priya Verma",
    salutation: "Priya Ma'am",
    subject: "Biology",
    emoji: "🧬",
    tagline: "The heartbeat of our class",
    photo: null,
    message: [
      "Dear Priya Ma'am, you have a superpower: you can make mitochondria sound like a love story and photosynthesis sound like a family drama. Nobody else makes diagrams smile — but somehow yours always do. 🌿",
      "Thank you for turning biology into a subject we genuinely enjoy. From the first cell to the last diagram, your \"yeh yaad rakho\" actually sticks, and your handwritten notes are more precious to us than our phones (and we LOVE our phones).",
      "You taught us that every living thing deserves care — and you live that lesson with every student you teach. Happy Teacher's Day, Ma'am! You are the heartbeat of our class, forever. 💙"
    ],
    note: "Fun fact: Your diagrams are so pretty that even the non-bio students secretly photograph them.",
    quote: "Har cell mein ek kahani chhupi hai.",
    superpower: "Diagrams that belong in a museum",
    dialogue: "“Yeh yaad rakho — pakka aayega!”"
  },
  {
    id: "amit-sir",
    name: "Amit Patel",
    salutation: "Amit Sir",
    subject: "Physics",
    emoji: "⚡",
    tagline: "Charged with 100% positivity",
    photo: null,
    message: [
      "Dear Amit Sir, you once said \"yeh question tumhare level se upar hai\" — and then spent twenty minutes making sure it was not. That is who you are: someone who refuses to let any student stay below their own level. ⚡",
      "Thank you for the razor-sharp concepts, the perfectly timed jokes in the middle of the hardest topic, and the confidence you build in us one problem at a time. You teach like a current — smooth, powerful, and always in the right direction.",
      "Aapke padhane mein jo current hai, woh humare sapno ko charge karta hai. Happy Teacher's Day, Sir! Stay charged, stay legendary, and keep converting our \"nahi aayega\" into \"ho gaya\"."
    ],
    note: "Fun fact: The class, like a capacitor, stores every single thing you say. Discharge rate: never.",
    quote: "Current ki tarah bano — always in the right direction.",
    superpower: "JEE-level dread → 20-minute clarity",
    dialogue: "“Yeh tumhare level se upar hai… tha!”"
  },
  {
    id: "neha-mam",
    name: "Neha Gupta",
    salutation: "Neha Ma'am",
    subject: "Chemistry",
    emoji: "🔬",
    tagline: "Bonds with every student",
    photo: null,
    message: [
      "Dear Neha Ma'am, you make organic chemistry feel like solving a mystery — every reaction has a motive, a plot twist, and a happy ending. And the best part? You always solve it WITH us, never just for us. 🔬",
      "Thank you for the endless patience with our \"yeh naam kyun hai\" questions (some were curiosity, some were pure fun) and for making every single student feel noticed in a class full of people.",
      "You are the bond that holds our chemistry journey together. Happy Teacher's Day, Ma'am! May your class always be full of curiosity, and your students always full of gratitude. 💙"
    ],
    note: "Fun fact: You remember every student's weak chapter better than we remember our own names.",
    quote: "Chemistry is everywhere — even in our bond.",
    superpower: "Remembers everyone's weak chapter",
    dialogue: "“Last thing, bas 10 minute…”"
  },
  {
    id: "suresh-sir",
    name: "Suresh Iyer",
    salutation: "Suresh Sir",
    subject: "Mathematics",
    emoji: "🧮",
    tagline: "The calculus of kindness",
    photo: null,
    message: [
      "Dear Suresh Sir, if teaching were a function, you would be the one that never stops growing. From \"pehle basics\" to \"ab full speed\", you took us step by step — and never once made us feel small for asking a simple question. 🧮",
      "Thank you for the legendary whiteboard sessions, the calm \"let's try again\" when the whole class went wrong, and for treating our mistakes as data instead of defects. You taught us that maths, like life, is about the process, not just the answer.",
      "You are proof that the best teachers don't just teach the subject — they teach courage. Happy Teacher's Day, Sir! We are forever your students, and forever in your limit. 😄"
    ],
    note: "Fun fact: The moment you say \"it's a 3-mark question\", the whole class — toppers included — starts sweating. Legendary.",
    quote: "Maths is about the process, not just the answer.",
    superpower: "Calm whiteboard comebacks",
    dialogue: "“Pehle basics, phir full speed.”"
  },
  {
    id: "kavita-mam",
    name: "Kavita Rao",
    salutation: "Kavita Ma'am",
    subject: "Biology",
    emoji: "🌻",
    tagline: "Where every student blooms",
    photo: null,
    message: [
      "Dear Kavita Ma'am, plant taxonomy may have made our brains dizzy, but you made sure we all \"root\" for ourselves. You teach like sunlight in a garden — patiently, warmly, and with zero judgement. 🌻",
      "Thank you for the beautiful practical classes, the \"observe se seekho\" philosophy, and for being the person who genuinely celebrates when any student improves. Your happiness is the most contagious thing in our batch.",
      "You taught us that growth takes time — and that's okay. Happy Teacher's Day, Ma'am! May you forever have a classroom full of blooming minds and messy but happy experiments. 💙"
    ],
    note: "Fun fact: You can identify a plant from one tiny leaf. We can identify your footsteps in the corridor from the same distance.",
    quote: "Growth takes time — and that's okay.",
    superpower: "Identifies plants from a single leaf",
    dialogue: "“Observe se seekho!”"
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
  "\"Beta, yeh last topic hai\" is the biggest plot twist of every syllabus. 📚"
];

/** Blue-family accent per subject so the palette stays on-theme */
export const SUBJECT_META: Record<Subject, { color: string; soft: string }> = {
  Physics: { color: "#2563eb", soft: "#e5efff" },
  Chemistry: { color: "#0ea5e9", soft: "#e3f6ff" },
  Mathematics: { color: "#4f46e5", soft: "#e9e8ff" },
  Biology: { color: "#0891b2", soft: "#e0f7fb" }
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
    forTeacher: "Priya Ma'am",
    text: "Your diagrams got me through the whole human physiology chapter in one night. Legend! 🌿",
    category: "Thank You"
  },
  {
    name: "JEE Warrior",
    forTeacher: "Rakesh Sir",
    text: "Rotational mechanics finally rotates in my brain instead of scaring it. Thank you, Sir! 🚀",
    category: "Inspirational"
  },
  {
    name: "Class Topper (nervous)",
    forTeacher: "Vikram Sir",
    text: "Your shortcut notes are my most-guarded treasure. Happy Teacher's Day! 📐",
    category: "Funny"
  },
  {
    name: "Front Bench First-Row",
    forTeacher: "Anjali Ma'am",
    text: "\"Ab dekho ek magic hoga\" — and suddenly chemistry felt like home. I'll carry that magic everywhere. 🧪",
    category: "Emotional"
  },
  {
    name: "Silent Doubt Asker",
    forTeacher: "Neha Ma'am",
    text: "Thank you for answering my silliest questions like they were the smartest ones. 🔬",
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
