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

/** Four subject-specific secrets per teacher, unsealed one at a time. */
const SUBJECT_SECRETS: Record<Subject, string[]> = {
  Physics: [
    "You explain friction with two erasers and a desk — the class has never forgotten that demonstration.",
    "Your free-body diagrams are so clean that students photograph the board before the bell rings.",
    "You keep a ruled notebook of 'questions above level' — and then you teach until they are not.",
    "Before every major test you quietly wish each student good luck. We heard it every single time."
  ],
  Chemistry: [
    "Your 'one last thing' before the bell runs ten minutes long. Not once has anyone minded.",
    "You can identify a burnt laboratory from the far end of the corridor. That is a genuine superpower.",
    "You gave every student a periodic-table nickname for one week. Nobody has recovered theirs.",
    "Your titration curve, drawn freehand, belongs in a textbook rather than on a whiteboard."
  ],
  Mathematics: [
    "Your shortcut sheet travels through the batch like a family heirloom.",
    "You say 'it is simple, give me a minute' — and the minute is always enough.",
    "You remember each student's weakest chapter better than they remember it themselves.",
    "You treat a wrong answer as a data point, never as a mark. It changed how we handle failure."
  ],
  Biology: [
    "Your diagrams have labels, arrows and a small caption. The textbook has nothing.",
    "You can identify a plant from one leaf, and students keep testing you on purpose.",
    "You made genetics feel like family gossip — and half the class finally understood inheritance.",
    "You celebrate a single-mark improvement as loudly as a topper's result."
  ],
  "SST & English": [
    "You marked an answer 2/5 and wrote 'but the paragraph was well built' underneath. We still have that copy.",
    "You recognise a student by handwriting alone, one full page before the name appears.",
    "Your map work on the board takes ninety seconds and beats every printed outline map.",
    "Reading one strong paragraph aloud at the start of class is the real award. Everyone wants it."
  ]
};

const GENERIC_SECRETS: string[] = [
  "Students rehearse lines just to make you laugh in class. It is a whole art form.",
  "Your footsteps in the corridor carry one instruction that nobody disobeys.",
  "Behind the scenes you remember birthdays, festivals and who was unwell last week.",
  "You never let a student feel small for asking. That is your quietest superpower.",
  "You have delivered at least one pep talk we still repeat during exam season.",
  "Your patience is the most-used resource in the entire building.",
  "You always find one good thing in an answer, even when most of it is wrong.",
  "The class argues over who is the favourite. We will never know — you are too fair."
];

function pickSecrets(t: Teacher): string[] {
  const rnd = seededRandom(hashSeed(makeId(t)));
  const pool = [...(SUBJECT_SECRETS[t.subject] ?? []), ...GENERIC_SECRETS];
  const picks: string[] = [];
  while (picks.length < 4 && pool.length > 0) {
    const i = Math.floor(rnd() * pool.length);
    const val = pool.splice(i, 1)[0]!;
    picks.push(val);
  }
  return picks;
}

/* ------------------------- message library ------------------------- */

/** Thanks that speak the teacher's own subject language. */
const SUBJECT_MESSAGES: Record<Subject, string[]> = {
  Physics: [
    "Thank you for insisting on the diagram before the formula — I still solve problems that way.",
    "Rotational mechanics stopped being a fear and became a method. That is entirely your doing.",
    "You never said 'this is above your level'. You said 'not yet'.",
    "Every numerical we conquer has your free-body diagram inside it."
  ],
  Chemistry: [
    "You made organic mechanisms readable. Arrow, bond, reason — that is the whole subject.",
    "Thank you for the ten-minute 'one last thing' that was always worth staying for.",
    "The mole concept finally clicked the day you compared it to a dozen eggs.",
    "You taught us to ask why a reaction happens, not only what it gives."
  ],
  Mathematics: [
    "Thank you for grading the method, not only the answer.",
    "Your shortcut sheet is the reason integration stops feeling personal.",
    "You never moved on until the last hand went down. That is rare.",
    "A wrong step became information in your class, not an embarrassment."
  ],
  Biology: [
    "Your labelled diagrams saved me twice — in the exam and in understanding.",
    "Thank you for making physiology feel like a system instead of a list.",
    "Genetics finally made sense the day you mapped it onto our own family.",
    "You taught the chapter, and then you taught the curiosity behind it."
  ],
  "SST & English": [
    "Thank you for turning my three-line answers into a structured five-marker.",
    "History became cause and consequence, not dates to memorise.",
    "You corrected my grammar and protected my voice at the same time.",
    "The civics chapter you taught is the reason I read the news properly now."
  ]
};

const MESSAGE_POOL: string[] = [
  "Thank you for making a difficult subject feel manageable, one class at a time.",
  "Your patience is stronger than any three-mark question. We noticed.",
  "We argued over who your favourite is. We will settle it at the reunion.",
  "You never made anyone feel foolish for asking. That is everything.",
  "Every doubt you cleared is a brick in our confidence. Thank you.",
  "You turned our weakest grades into our best comebacks.",
  "We still rehearse your classroom lines in the corridor. It is a whole show.",
  "Your classroom was the calmest corner of our day, and we needed that.",
  "You remembered our names, our weak chapters and our bad weeks.",
  "You believed in us before we managed it ourselves. That shaped us.",
  "Happy Teacher's Day to an absolute legend of a teacher.",
  "Some teachers give answers. You gave us the method to find them."
];

function pickMessages(t: Teacher, count: number): string[] {
  const rnd = seededRandom(hashSeed(makeId(t)));
  const pool = [...(SUBJECT_MESSAGES[t.subject] ?? []), ...MESSAGE_POOL];
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
