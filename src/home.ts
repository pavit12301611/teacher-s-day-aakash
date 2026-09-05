/* 🏠 Home page */
import "./style.css";
import {
  TEACHERS,
  SUBJECTS,
  SUBJECT_META,
  subjectCount,
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

const DAILY_WISHES: Array<{ day: string; emoji: string; title: string; text: string }> = [
  { day: "Sunday", emoji: "🌞", title: "A day to rest & recharge", text: "Even the best teachers need a Sunday. Today, wish them a slow morning and a warm chai — they've earned it." },
  { day: "Monday", emoji: "🌅", title: "Fresh start, fresh mind", text: "A brand-new week for the people who make Monday feel a little less Monday. Start it with a smile for them." },
  { day: "Tuesday", emoji: "📚", title: "The doubt-clearing hour", text: "Somewhere a teacher is answering that '45th time' a doubt. Send them a little patience today." },
  { day: "Wednesday", emoji: "💙", title: "Mid-week gratitude", text: "You've made it to the middle of the week. Take 30 seconds and thank a teacher who changed your mood." },
  { day: "Thursday", emoji: "🎯", title: "Focus & fire", text: "The ones who keep us focused deserve a little focus back. Today, no noise — just a heartfelt 'thank you'." },
  { day: "Friday", emoji: "🎉", title: "Almost the weekend", text: "The last school day energy is real. Celebrate a teacher who made the week a little lighter." },
  { day: "Saturday", emoji: "✨", title: "Weekend magic", text: "Teachers' weekends are for marking, planning and coffee. Sneak in a tiny wish to make it sweeter." }
];

const QUOTE_POOL: Array<{ quote: string; by: string }> = [
  { quote: "The best teachers don't hand out answers — they hand out confidence.", by: "Back bench, front hearts · Aakash Batch of 2026" },
  { quote: "A teacher takes a hand, opens a mind, and touches a heart.", by: "Aakash students · everywhere" },
  { quote: "Teaching is the one profession that creates all other professions.", by: "The back bench, being deep" },
  { quote: "Mistakes are the first step to marks — and they taught us that.", by: "Aakash Batch of 2026" },
  { quote: "Some give knowledge. The great ones give courage.", by: "Your students · every year" },
  { quote: "It takes a big heart to shape little minds.", by: "The front bench, whispering" },
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
  root.innerHTML = `
    <div class="spot-glow" aria-hidden="true"></div>
    <div class="spot-main">
      <span class="eyebrow">\u{1F31F} Teacher Spotlight \u00B7 ${escapeHtml(dateStr)}</span>
      <h2>${escapeHtml(t.salutation)} \u2728</h2>
      <p class="spot-quote">\u201C${escapeHtml(t.quote)}\u201D</p>
      <p class="spot-tag">${t.emoji} ${t.subject} \u00B7 \u201C${escapeHtml(t.tagline)}\u201D</p>
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
    <a class="subject-card tilt spot reveal" style="--delay:${i * 70}ms" href="category.html?subject=${encodeURIComponent(
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
