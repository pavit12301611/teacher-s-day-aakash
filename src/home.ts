/* 🏠 Home page */
import "./style.css";
import {
  TEACHERS,
  SUBJECTS,
  SUBJECT_META,
  subjectCount,
  subjectTopics,
  teacherUrl,
  type Teacher
} from "./teachers";
import {
  initSite,
  observeReveals,
  initSpotlight,
  initTilt,
  bigCelebration,
  must,
  qs,
  escapeHtml
} from "./site";
import { avatarHTML, teacherCardHTML } from "./cards";

/** One little note per weekday — each one tied to a subject. */
const DAILY_WISHES: Array<{ day: string; emoji: string; title: string; text: string }> = [
  { day: "Sunday", emoji: "🌞", title: "A day to rest and recharge", text: "Even the finest teachers need a Sunday. Wish them a slow morning and an unhurried cup of chai — it is more than earned." },
  { day: "Monday", emoji: "🌅", title: "Fresh week, first period", text: "Monday is the day a Physics teacher explains motion by moving the whole class through it. Say thank you for the energy." },
  { day: "Tuesday", emoji: "📚", title: "The doubt-clearing hour", text: "Somewhere a Chemistry teacher is answering the forty-fifth question with the same patience as the first. Send them some grace today." },
  { day: "Wednesday", emoji: "💙", title: "Mid-week gratitude", text: "Halfway through the week. Take thirty seconds to thank the Biology teacher who made one hard chapter feel obvious." },
  { day: "Thursday", emoji: "🎯", title: "Method over marks", text: "The Mathematics teacher who insisted on the method, not the answer, is still shaping how we work. Tell them today." },
  { day: "Friday", emoji: "🎉", title: "Last period energy", text: "Friday feels lighter when an SST & English teacher has just made an entire chapter sound like a story worth telling." },
  { day: "Saturday", emoji: "✨", title: "Marking, planning, coffee", text: "Weekends belong to answer sheets and next week's board plan. Add one small wish to make the desk feel brighter." }
];

const QUOTE_POOL: Array<{ quote: string; by: string }> = [
  { quote: "The best teachers don't hand out answers — they hand out method.", by: "Back bench, front hearts · Aakash Batch of 2026" },
  { quote: "Draw the diagram first. The rest of the answer follows.", by: "Rahul Sir · Physics, every single class" },
  { quote: "Every reaction has a reason. Finding it is the actual subject.", by: "Harshita Ma'am · Chemistry" },
  { quote: "Maths rewards the process, not the panic.", by: "Shivam Sir · Mathematics" },
  { quote: "Label it properly and half the answer is already done.", by: "Gaurav Sir · Biology" },
  { quote: "A date is forgettable; the reason behind it never is.", by: "Wajid Sir · SST & English" },
  { quote: "Teaching is the one profession that creates all other professions.", by: "The back bench, being thoughtful" },
  { quote: "A wrong step is information, never a verdict.", by: "Aakash Batch of 2026" },
  { quote: "Some give knowledge. The great ones give courage.", by: "Your students · every year" },
  { quote: "It takes a big heart to shape a stubborn mind.", by: "The front bench, quietly agreeing" },
  { quote: "The classroom is where futures get their first draft.", by: "Aakash · Class of 2026" },
  { quote: "They saw the best in us before we could.", by: "Every student who ever doubted themselves" },
  { quote: "A good teacher is a light that never dims.", by: "The night-before-exam batch" }
];

function duplicateMarquee(): void {
  document.querySelectorAll<HTMLElement>(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}

function renderDailyWish(): void {
  const root = qs("#daily-wish");
  if (!root) return;
  const now = new Date();
  const wish = DAILY_WISHES[now.getDay()] ?? DAILY_WISHES[0]!;
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  root.innerHTML = `
    <span class="dw-emoji">${wish.emoji}</span>
    <div class="dw-body">
      <span class="dw-day">Today's wish · ${escapeHtml(dateStr)}</span>
      <h3>${escapeHtml(wish.title)}</h3>
      <p>${escapeHtml(wish.text)}</p>
    </div>
    <span class="dw-spark" aria-hidden="true">✦</span>`;
}

function renderQuotePool(): void {
  const text = qs("#quote-text");
  const by = qs("#quote-by");
  const next = qs<HTMLButtonElement>("#quote-next");
  if (!text || !by) return;

  let idx = Math.floor(Math.random() * QUOTE_POOL.length);
  const paint = (): void => {
    const item = QUOTE_POOL[idx]!;
    text.textContent = item.quote;
    by.textContent = item.by;
    text.classList.remove("quote-swap");
    void text.offsetWidth;
    text.classList.add("quote-swap");
  };
  paint();

  next?.addEventListener("click", () => {
    idx = (idx + 1 + Math.floor(Math.random() * (QUOTE_POOL.length - 1))) % QUOTE_POOL.length;
    paint();
  });
}

function featured(): Teacher[] {
  // One hero per subject so the home preview feels complete
  const pick = [
    "rahul-sir",
    "harshita-mam",
    "shivam-sir",
    "gaurav-sir",
    "wajid-sir"
  ];
  const found = pick
    .map((id) => TEACHERS.find((t) => t.id === id))
    .filter((t): t is Teacher => Boolean(t));
  return found.length === pick.length ? found : TEACHERS.slice(0, pick.length);
}

function renderFeatured(): void {
  const grid = must("#featured-grid");
  grid.innerHTML = featured()
    .map((t, i) => teacherCardHTML(t, i))
    .join("");
  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}


function renderSpotlight(): void {
  const root = qs("#spotlight");
  if (!root) return;
  // Rotates every day so there's always a fresh hero on the home page
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const t = TEACHERS[day % TEACHERS.length]!;
  const m = SUBJECT_META[t.subject];
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  root.style.setProperty("--accent", m.color);
  root.style.setProperty("--accent-2", m.color2);
  root.style.setProperty("--soft", m.soft);
  root.innerHTML = `
    <div class="spot-glow" aria-hidden="true"></div>
    <div class="spot-main">
      <span class="eyebrow">\u{1F31F} Teacher Spotlight \u00B7 ${escapeHtml(dateStr)}</span>
      <h2>${escapeHtml(t.salutation)} \u2728</h2>
      <p class="spot-quote">\u201C${escapeHtml(t.quote)}\u201D</p>
      <p class="spot-tag">${t.emoji} ${t.subject} \u00B7 \u201C${escapeHtml(t.tagline)}\u201D</p>
      <p class="spot-topics">${subjectTopics(t.subject)
        .map((x) => `<span>${escapeHtml(x)}</span>`)
        .join("")}</p>
      <div class="hero-actions">
        <a href="${teacherUrl(t)}" class="btn btn-gold">\u{1F48C} Open Dedication</a>
        <button class="btn btn-ghost" id="spot-party">\u{1F389} Celebrate Them</button>
      </div>
    </div>
    <div class="spot-side">
      <a href="${teacherUrl(t)}" aria-label="Open the dedication page for ${escapeHtml(t.name)}">${avatarHTML(t, true)}</a>
      <span class="spot-dialogue">${escapeHtml(t.dialogue)}</span>
    </div>`;

  qs("#spot-party")?.addEventListener("click", () => bigCelebration());
}

function renderSubjects(): void {
  const grid = must("#subject-grid");
  grid.innerHTML = SUBJECTS.map(
    (s, i) => `
    <a class="subject-card tilt spot reveal" style="--delay:${
      i * 70
    }ms;--accent:${SUBJECT_META[s.subject].color};--accent-2:${
      SUBJECT_META[s.subject].color2
    };--soft:${SUBJECT_META[s.subject].soft}" href="category.html?subject=${encodeURIComponent(
      s.subject
    )}" aria-label="See ${s.subject} teachers">
      <span class="subject-icon">${s.icon}</span>
      <h3>${s.subject} <span style="opacity:.55">· ${subjectCount(s.subject)}</span></h3>
      <p>${s.blurb}</p>
      <div class="subject-topics">${s.topics.map((t) => `<span>${t}</span>`).join("")}</div>
      <span class="subject-link">Explore category →</span>
    </a>`
  ).join("");
  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}

function boot(): void {
  initSite();
  duplicateMarquee();
  renderDailyWish();
  renderSpotlight();
  renderFeatured();
  renderSubjects();
  renderQuotePool();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
