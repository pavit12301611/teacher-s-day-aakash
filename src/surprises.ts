/* ============================================================
   🎁 Little surprises for each dedication page:
   - time-of-day greeting
   - a sealed letter that types itself out (typewriter)
   - 4 hidden secrets you unlock one by one
   - a "from your students" message library
   All deterministic per teacher (seeded by id) so it feels
   personal without 83 handwritten letters.
   ============================================================ */

import { type Subject, type Teacher } from "./teachers";
import { seededRandom, hashSeed, makeId } from "./minigames";

/* ------------------------- time-of-day greeting ------------------------- */

export function timeGreeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

export function greetingEmoji(hour: number): string {
  if (hour < 12) return "🌅";
  if (hour < 17) return "☀️";
  if (hour < 21) return "🌆";
  return "🌙";
}

/* ------------------------- typewriter letter ------------------------- */

export interface TypeHandle {
  skip: () => void;
  done: boolean;
}

let activeHandle: TypeHandle | null = null;

export function typeLetter(
  host: HTMLElement,
  chunks: string[],
  onDone?: () => void
): TypeHandle {
  activeHandle = null;

  interface ParaState {
    node: HTMLParagraphElement;
    txt: Text;
    caret: HTMLSpanElement;
  }

  let index = 0;
  let charPos = 0;
  let current: ParaState | null = null;
  let cancelled = false;

  const makePara = (i: number): ParaState => {
    const p = document.createElement("p");
    if (i === 0) p.classList.add("letter-greeting");
    const txt = document.createTextNode("");
    p.appendChild(txt);
    const caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");
    p.appendChild(caret);
    host.appendChild(p);
    return { node: p, txt, caret };
  };

  const appendSign = (): void => {
    const sign = document.createElement("p");
    sign.className = "letter-sign";
    sign.textContent = "— with love, your students at Aakash 💙";
    host.appendChild(sign);
  };

  const dumpAll = (): void => {
    if (cancelled) return;
    cancelled = true;
    host.innerHTML = "";
    chunks.forEach((text, i) => {
      const p = document.createElement("p");
      if (i === 0) p.classList.add("letter-greeting");
      p.textContent = text;
      host.appendChild(p);
    });
    appendSign();
    const handle = activeHandle;
    if (handle) handle.done = true;
    onDone?.();
  };

  const nextChar = (): void => {
    if (cancelled) return;
    if (index >= chunks.length) {
      current?.caret.remove();
      appendSign();
      const handle = activeHandle;
      if (handle) handle.done = true;
      onDone?.();
      return;
    }
    const text = chunks[index]!;
    if (!current) current = makePara(index);

    const step = Math.random() < 0.35 ? 2 : 1;
    charPos = Math.min(charPos + step, text.length);
    if (charPos < text.length) {
      current.txt.nodeValue = text.slice(0, charPos);
    } else {
      // finished this paragraph
      current.caret.remove();
      current = null;
      charPos = 0;
      index++;
    }
    if (!cancelled) window.setTimeout(nextChar, 18 + Math.random() * 40);
  };

  const handle: TypeHandle = {
    done: false,
    skip: dumpAll
  };
  activeHandle = handle;
  nextChar();
  return handle;
}

export function stopTypewriter(): void {
  if (activeHandle) activeHandle.skip();
}

/* ------------------------- hidden secrets ------------------------- */

const SUBJECT_SECRETS: Record<Subject, string[]> = {
  Physics: [
    "You once explained friction with two erasers rubbing a desk — that class never forgot it.",
    "Your whiteboard diagrams are so neat that students photograph them before the bell.",
    "You carry a calculator that's seen more problems than any of your students' notebooks.",
    "Before a big test, you quietly wish each student 'all the best' — we heard it every time."
  ],
  Chemistry: [
    "Your 'one last thing' before the bell is famously 10 minutes long. We never once minded.",
    "You can smell a burnt lab from the other end of the corridor. It's a superpower.",
    "You gave every student a fun element nickname once — nobody ever forgot theirs.",
    "Your titration diagrams are museum-grade. Students have literally framed them."
  ],
  Mathematics: [
    "Your shortcut notes are passed around the batch like a family treasure.",
    "You say 'simple hai, ek minute' — and somehow it always is.",
    "You remember every student's weak chapter better than we remember our own names.",
    "You round up mistakes to 'data points', never to marks. That changed how we see errors."
  ],
  Biology: [
    "Your diagrams smile. Nobody else's drawings do. That's a real fact.",
    "You can name a plant from a single leaf — students test you on purpose.",
    "You make mitochondria sound like a love story. Exceptional.",
    "You celebrate every student's improvement like your own victory. It shows."
  ],
  "SST & English": [
    "You mark an answer for 2/5 and still write 'but the English was lovely' underneath. We keep those copies.",
    "You recognise a student's handwriting from the answer sheet alone — before even reaching the name.",
    "Your half-slate board summary beats a full chapter in any guide. Everyone knows it, nobody admits it.",
    "Reading the best paragraph of the class out loud is the real award. We've all wanted it."
  ]
};

const GENERIC_SECRETS: string[] = [
  "Students rehearse lines just to make you laugh in class. It's a whole art form.",
  "Your voice from the corridor is the loudest 'sit down' we ever obeyed.",
  "Behind the scenes, you remember birthdays, festivals and favourite chocolates.",
  "You never let a student feel small for a doubt — that's your quietest superpower.",
  "You've given at least one pep talk that we still repeat in exam season.",
  "Your patience is the most-used resource in the whole building.",
  "You always find the 'one good thing' in an answer, even when it's mostly wrong.",
  "Students argue over who's your favourite. We'll never know — you're too fair."
];

function pickSecrets(t: Teacher): string[] {
  const rnd = seededRandom(hashSeed(makeId(t)));
  const pool = [...SUBJECT_SECRETS[t.subject], ...GENERIC_SECRETS];
  const picks: string[] = [];
  while (picks.length < 4 && pool.length > 0) {
    const i = Math.floor(rnd() * pool.length);
    const val = pool.splice(i, 1)[0]!;
    picks.push(val);
  }
  return picks;
}

/* ------------------------- message library ------------------------- */

const MESSAGE_POOL: string[] = [
  "Thank you for making a scary subject feel like a friendly robot. 🤖",
  "Your patience is stronger than any 3-mark question. We noticed. 💙",
  "We argued over who's your favourite. We'll settle it at the reunion. 😄",
  "Your 'last topic' was 10 minutes long and we loved every second.",
  "You never made anyone feel stupid for asking. That's everything.",
  "Every doubt you cleared is a tiny brick in our confidence. Thank you.",
  "You turned our worst grades into our best comebacks. Legend.",
  "We rehearse your dialogue in the corridor now. It's a whole show.",
  "Your classroom was the calmest corner of our day. We needed it.",
  "You remember our names, our weak chapters, our favourite chocolates.",
  "You believed in us before we believed in ourselves. That shaped us.",
  "Happy Teacher's Day, you absolute legend. 🎓💙",
  "Some teachers give answers. You gave us the confidence to find them.",
  "We'll never forget the day you turned a 'nahi aayega' into a 'ho gaya'.",
  "Your chalkboard diagrams are tiny works of art. We have them memorised.",
  "You taught us the subject and the courage. Both stuck."
];

function pickMessages(t: Teacher, count: number): string[] {
  const rnd = seededRandom(hashSeed(makeId(t)));
  const pool = [...MESSAGE_POOL];
  const picks: string[] = [];
  while (picks.length < count && pool.length > 0) {
    const i = Math.floor(rnd() * pool.length);
    picks.push(pool.splice(i, 1)[0]!);
  }
  return picks;
}

/* ------------------------- reveal-once helpers ------------------------- */

export function secretsFor(t: Teacher): string[] {
  return pickSecrets(t);
}

export function messagesFor(t: Teacher, count: number): string[] {
  return pickMessages(t, count);
}
