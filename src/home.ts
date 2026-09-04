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

function duplicateMarquee(): void {
  document.querySelectorAll<HTMLElement>(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}

function featured(): Teacher[] {
  // One hero per subject so the home preview feels complete
  const pick = ["rakesh-sir", "anjali-mam", "vikram-sir", "priya-mam"];
  const found = pick
    .map((id) => TEACHERS.find((t) => t.id === id))
    .filter((t): t is Teacher => Boolean(t));
  return found.length === 4 ? found : TEACHERS.slice(0, 4);
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
  renderSpotlight();
  renderFeatured();
  renderSubjects();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
