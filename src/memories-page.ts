/* 🎪 Memories + Fun Zone + Wish Wall page */
import "./style.css";
import { CHALK_FACTS, TEACHERS, WALL_WISHES, type WallWish } from "./teachers";
import {
  initSite,
  must,
  qs,
  escapeHtml,
  showToast,
  bigCelebration,
  burstAt
} from "./site";
import { launchConfetti } from "./confetti";

const WALL_KEY = "aakash-td-wall-2026";

/* ------------------------- chalkboard ------------------------- */

let factIndex = 0;
let factTimer = 0;

function showFact(index: number): void {
  const el = qs("#chalk-fact");
  if (!el) return;
  factIndex = (index + CHALK_FACTS.length) % CHALK_FACTS.length;
  el.classList.remove("switching");
  void el.offsetWidth;
  el.textContent = CHALK_FACTS[factIndex];
  el.classList.add("switching");
}

function startFacts(): void {
  showFact(0);
  window.clearInterval(factTimer);
  factTimer = window.setInterval(() => showFact(factIndex + 1), 4500);
}

/* ------------------------- wish wall ------------------------- */

function storedWall(): WallWish[] {
  try {
    const raw = window.localStorage.getItem(WALL_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (w): w is WallWish =>
        typeof w === "object" &&
        w !== null &&
        typeof (w as WallWish).name === "string" &&
        typeof (w as WallWish).text === "string" &&
        typeof (w as WallWish).forTeacher === "string"
    );
  } catch {
    return [];
  }
}

function saveWall(wishes: WallWish[]): void {
  try {
    window.localStorage.setItem(WALL_KEY, JSON.stringify(wishes.slice(0, 60)));
  } catch {
    /* noop */
  }
}

function wishCardHTML(w: WallWish, mine: boolean, idx: number): string {
  return `
    <article class="wish-card reveal in">
      <span class="w-for">💙 For ${escapeHtml(w.forTeacher)}</span>
      <p>${escapeHtml(w.text)}</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <span class="w-by">— ${escapeHtml(w.name)}</span>
        ${
          mine
            ? `<button class="share-btn" style="padding:6px 12px;font-size:.75rem" data-del="${idx}" aria-label="Delete your wish">✕</button>`
            : ""
        }
      </div>
    </article>`;
}

function renderWall(): void {
  const wall = must("#wish-wall");
  const mine = storedWall();
  const cards = [
    ...mine.map((w, i) => wishCardHTML(w, true, i)),
    ...WALL_WISHES.map((w) => wishCardHTML(w, false, -1))
  ];
  wall.innerHTML = cards.join("");
  const count = qs("#wall-count");
  if (count) count.textContent = `${mine.length + WALL_WISHES.length} wishes on the wall`;
  wall.querySelectorAll<HTMLButtonElement>("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.del);
      const list = storedWall();
      list.splice(i, 1);
      saveWall(list);
      renderWall();
      showToast("Wish removed from the wall 🧽");
    });
  });
}

function fillTeacherSelect(): void {
  const select = qs<HTMLSelectElement>("#wish-for");
  if (!select) return;
  select.innerHTML =
    `<option value="All Teachers">💙 All Teachers</option>` +
    TEACHERS.map(
      (t) => `<option value="${escapeHtml(t.salutation)}">${t.emoji} ${escapeHtml(t.salutation)}</option>`
    ).join("");
}

function wireForm(): void {
  const form = qs<HTMLFormElement>("#wish-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = qs<HTMLInputElement>("#wish-name")?.value.trim() || "Anonymous Student";
    const forTeacher = qs<HTMLSelectElement>("#wish-for")?.value || "All Teachers";
    const text = qs<HTMLTextAreaElement>("#wish-text")?.value.trim() || "";
    if (text.length < 4) {
      showToast("Thoda aur likho na — dil se! 💌");
      return;
    }
    const list = storedWall();
    list.unshift({ name: name.slice(0, 40), forTeacher, text: text.slice(0, 280) });
    saveWall(list);
    renderWall();
    form.reset();
    fillTeacherSelect();
    launchConfetti({ count: 110, origin: { x: 0.5, y: 0.5 }, power: 1 });
    showToast("Your wish is live on the wall! 🎉💙");
    qs("#wish-wall")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* ------------------------- boot ------------------------- */

function boot(): void {
  initSite();
  document
    .querySelectorAll<HTMLElement>(".marquee-track")
    .forEach((t) => (t.innerHTML += t.innerHTML));

  startFacts();
  qs("#fact-next")?.addEventListener("click", () => {
    showFact(factIndex + 1);
    startFacts();
  });
  qs("#fun-surprise")?.addEventListener("click", (e) => {
    const ev = e as MouseEvent;
    burstAt(ev.clientX || innerWidth / 2, ev.clientY || 240);
  });
  qs("#party-all")?.addEventListener("click", () => {
    bigCelebration();
    showToast("Full celebration mode: ON 🎆 Teachers deserve it!");
  });

  fillTeacherSelect();
  renderWall();
  wireForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
