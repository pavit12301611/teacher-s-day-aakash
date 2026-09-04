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
   ============================================================ */

export type Subject = "Physics" | "Chemistry" | "Mathematics" | "Biology";export interface Teacher {
  id: string;
  name: string;
  salutation: string; // how we greet them e.g. "Rakesh Sir"
  subject: Subject;
  emoji: string; // subject doodle
  tagline: string; // short fun line on the card
  photo: string | null; // e.g. "/teachers/rakesh-sir.jpg" or null
  message: string[]; // personal message, one paragraph per line
  note: string; // fun fact shown in the tab
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
    note: "Fun fact: You explain so well that even our toppers pretend they didn't understand, just to hear the explanation again."
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
    note: "Fun fact: Your \"one last thing\" before the bell is 10 minutes long and we still love every second."
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
    note: "Fun fact: We can forget our own birthday, but never your shortcut notes. They are literally legend."
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
    note: "Fun fact: Your diagrams are so pretty that even the non-bio students secretly photograph them."
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
    note: "Fun fact: The class, like a capacitor, stores every single thing you say. Discharge rate: never."
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
    note: "Fun fact: You remember every student's weak chapter better than we remember our own names."
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
    note: "Fun fact: The moment you say \"it's a 3-mark question\", the whole class — toppers included — starts sweating. Legendary."
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
    note: "Fun fact: You can identify a plant from one tiny leaf. We can identify your footsteps in the corridor from the same distance."
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
  "Ask your doubts, not your tuition fees' worth! (Okay, that one's just free advice.) 😄"
];

/** Blue-family accent per subject so the palette stays on-theme */
export const SUBJECT_META: Record<Subject, { color: string; soft: string }> = {
  Physics: { color: "#2563eb", soft: "#e5efff" },
  Chemistry: { color: "#0ea5e9", soft: "#e3f6ff" },
  Mathematics: { color: "#4f46e5", soft: "#e9e8ff" },
  Biology: { color: "#0891b2", soft: "#e0f7fb" }
};

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}
