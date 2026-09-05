/* 👩‍🏫 All-teachers gallery page */
import "./style.css";
import { TEACHERS, SUBJECT_META, type Subject } from "./teachers";
import {
  initSite,
  observeReveals,
  initSpotlight,
  initTilt,
  must,
  qs,
  escapeHtml
} from "./site";
import { teacherCardHTML, comingSoonCardHTML } from "./cards";

type Filter = Subject | "All";

let activeFilter: Filter = "All";
let query = "";

function initialFilter(): Filter {
  const param = new URLSearchParams(window.location.search).get("subject");
  if (param && (Object.keys(SUBJECT_META) as Subject[]).includes(param as Subject)) {
    return param as Subject;
  }
  return "All";
}

function matches(name: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const t = TEACHERS.find((x) => x.id === name);
  if (!t) return false;
  return [t.name, t.salutation, t.subject, t.tagline, t.dialogue].some((f) =>
    f.toLowerCase().includes(q)
  );
}

function renderPills(): void {
  const pills = must("#filter-pills");
  const subjects: Filter[] = [
    "All",
    ...Array.from(new Set(TEACHERS.map((t) => t.subject)))
  ];
  pills.innerHTML = subjects
    .map(
      (s) => `
      <button class="pill ${s === activeFilter ? "active" : ""}" data-filter="${escapeHtml(String(s))}"
        aria-pressed="${s === activeFilter}">
        ${s === "All" ? "✨ All Teachers" : escapeHtml(String(s))}
      </button>`
    )
    .join("");
  pills.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter as Filter;
      renderPills();
      renderGrid();
    });
  });
}

function renderGrid(): void {
  const grid = must("#teacher-grid");
  const list = TEACHERS.filter(
    (t) =>
      (activeFilter === "All" || t.subject === activeFilter) &&
      matches(t.id)
  );

  const count = qs("#result-count");
  if (count) {
    count.textContent =
      list.length === 0
        ? "No matches"
        : `${list.length} ${list.length === 1 ? "teacher" : "teachers"}`;
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state reveal in">
        <span>🔍</span>
        <p>No teacher found with that name.<br />Maybe they're busy clearing doubts? 😄</p>
      </div>`;
    return;
  }

  const showComingSoon = activeFilter === "All" && !query.trim();
  grid.innerHTML =
    list.map((t, i) => teacherCardHTML(t, i)).join("") +
    (showComingSoon ? comingSoonCardHTML() : "");

  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}

function boot(): void {
  initSite();
  activeFilter = initialFilter();
  const preset = new URLSearchParams(window.location.search).get("q");
  if (preset) {
    query = preset;
    const input = qs<HTMLInputElement>("#teacher-search");
    if (input) input.value = preset;
  }
  renderPills();
  renderGrid();

  qs<HTMLInputElement>("#teacher-search")?.addEventListener("input", (e) => {
    query = (e.target as HTMLInputElement).value;
    renderGrid();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
