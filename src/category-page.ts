/* 🗂️ Subject category landing page — category.html?subject=Physics */
import "./style.css";
import {
  TEACHERS,
  SUBJECTS,
  SUBJECT_META,
  subjectCount,
  type Subject,
  type Teacher
} from "./teachers";
import {
  initSite,
  observeReveals,
  initSpotlight,
  initTilt,
  must,
  qs,
  escapeHtml
} from "./site";
import { teacherCardHTML } from "./cards";

function validSubject(value: string | null): Subject | null {
  if (!value) return null;
  const all = Object.keys(SUBJECT_META) as Subject[];
  return all.includes(value as Subject) ? (value as Subject) : null;
}

function paintHero(subject: Subject): void {
  const meta = SUBJECT_META[subject];
  const info = SUBJECTS.find((s) => s.subject === subject);
  const hero = must("#cat-hero");
  hero.style.setProperty("--accent", meta.color);
  hero.style.setProperty("--soft", meta.soft);

  document.title = `${subject} Heroes ${info?.icon ?? "📚"} | Aakash Teacher's Day`;
  qs('meta[name="description"]')?.setAttribute(
    "content",
    `Meet the ${subject} teachers of Aakash — dedication pages, legendary dialogues and wishes.`
  );

  must("#cat-icon").textContent = info?.icon ?? "📚";
  must("#cat-name").innerHTML = `${escapeHtml(subject)} <em>heroes.</em>`;
  must("#cat-blurb").textContent =
    info?.blurb ?? "The legends behind the subject.";
  must("#cat-topics").innerHTML = (info?.topics ?? [])
    .map((t) => `<span class="cat-chip">📖 ${escapeHtml(t)}</span>`)
    .join("");
  must("#cat-count").innerHTML =
    `<span class="cat-chip">👩‍🏫 ${subjectCount(subject)} teachers</span>` +
    `<span class="cat-chip">💌 ${TEACHERS.filter((t) => t.subject === subject).length} dedication pages</span>`;
  qs("#cat-crumb-here")!.textContent = subject;
}

function renderTeachers(list: Teacher[]): void {
  const grid = must("#cat-teachers");
  grid.innerHTML = list.map((t, i) => teacherCardHTML(t, i)).join("");
  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}

function renderDialogues(list: Teacher[]): void {
  const meta = SUBJECT_META[list[0]?.subject ?? "Physics"];
  must("#cat-dialogues").innerHTML = list
    .map(
      (t, i) => `
      <div class="dialogue-item reveal" style="--delay:${i * 70}ms;--soft:${meta.soft}">
        <span class="d-emoji">${t.emoji}</span>
        <div>
          <blockquote>${escapeHtml(t.dialogue)}</blockquote>
          <cite>— ${escapeHtml(t.salutation)} · ${escapeHtml(t.tagline)}</cite>
        </div>
      </div>`
    )
    .join("");
}

function renderQuotes(list: Teacher[]): void {
  must("#cat-quotes").innerHTML = list
    .map(
      (t, i) => `
      <div class="quote-card reveal" style="--delay:${i * 80}ms">
        <p>${escapeHtml(t.quote)}</p>
        <span>— ${escapeHtml(t.salutation)}</span>
      </div>`
    )
    .join("");
}

function renderChooser(): void {
  document.title = "Subject Categories 🗂️ | Aakash Teacher's Day";
  must("#cat-icon").textContent = "🗂️";
  must("#cat-name").innerHTML = `Pick your <em>battleground.</em>`;
  must("#cat-blurb").textContent =
    "That link didn't match a subject — no stress. Choose a category below and meet its heroes.";
  must("#cat-topics").innerHTML = "";
  must("#cat-count").innerHTML = "";
  qs("#cat-crumb-here")!.textContent = "Subjects";

  const grid = must("#cat-teachers");
  grid.innerHTML = SUBJECTS.map(
    (s) => `
    <a class="subject-card tilt spot reveal" href="category.html?subject=${encodeURIComponent(
      s.subject
    )}" aria-label="Open the ${s.subject} category">
      <span class="subject-icon">${s.icon}</span>
      <h3>${s.subject} <span style="opacity:.55">· ${subjectCount(s.subject)}</span></h3>
      <p>${s.blurb}</p>
      <span class="subject-link">Explore category →</span>
    </a>`
  ).join("");
  qs("#cat-grid-title")!.textContent = "All categories";
  qs("#cat-extra")!.style.display = "none";
  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}

function boot(): void {
  initSite();
  const subject = validSubject(new URLSearchParams(window.location.search).get("subject"));
  if (!subject) {
    renderChooser();
    observeReveals(must("#cat-root"));
    return;
  }
  paintHero(subject);
  const list = TEACHERS.filter((t) => t.subject === subject);
  must("#cat-grid-title").textContent = `The ${subject} line-up`;
  renderTeachers(list);
  renderDialogues(list);
  renderQuotes(list);
  observeReveals(must("#cat-root"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
