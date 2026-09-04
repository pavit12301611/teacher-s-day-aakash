/* 🏠 Home page */
import "./style.css";
import {
  TEACHERS,
  SUBJECTS,
  subjectCount,
  type Teacher
} from "./teachers";
import { initSite, observeReveals, initSpotlight, initTilt, must } from "./site";
import { teacherCardHTML } from "./cards";

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

function renderSubjects(): void {
  const grid = must("#subject-grid");
  grid.innerHTML = SUBJECTS.map(
    (s, i) => `
    <a class="subject-card tilt spot reveal" style="--delay:${i * 70}ms" href="teachers.html?subject=${encodeURIComponent(
      s.subject
    )}" aria-label="See ${s.subject} teachers">
      <span class="subject-icon">${s.icon}</span>
      <h3>${s.subject} <span style="opacity:.55">· ${subjectCount(s.subject)}</span></h3>
      <p>${s.blurb}</p>
      <div class="subject-topics">${s.topics.map((t) => `<span>${t}</span>`).join("")}</div>
      <span class="subject-link">Meet them →</span>
    </a>`
  ).join("");
  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}

function boot(): void {
  initSite();
  duplicateMarquee();
  renderFeatured();
  renderSubjects();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
