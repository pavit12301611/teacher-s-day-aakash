/* ============================================================
   💙 Teacher's Day @ Aakash — main app logic (TypeScript)
   Renders the teacher cards, modal messages, confetti, the
   chalkboard fun zone, and the web-speech "read aloud" feature.
   ============================================================ */

import "./style.css";
import {
  TEACHERS,
  CHALK_FACTS,
  SUBJECT_META,
  initialsOf,
  type Subject,
  type Teacher
} from "./teachers";
import { launchConfetti, heartBurst } from "./confetti";

/* ------------------------- tiny helpers ------------------------- */

function $<T extends HTMLElement = HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const els = {
  nav: $("#nav"),
  navLinks: $("#nav-links"),
  burger: $("#nav-burger"),
  progress: $("#scroll-progress"),
  teacherGrid: $("#teacher-grid"),
  filterPills: $("#filter-pills"),
  search: $<HTMLInputElement>("#teacher-search"),
  statTeachers: $("#stat-teachers"),
  statSubjects: $("#stat-subjects"),
  statWishes: $("#stat-wishes"),
  overlay: $("#modal-overlay"),
  modalCard: $("#modal-card"),
  modalBody: $("#modal-body"),
  modalClose: $("#modal-close"),
  toast: $("#toast"),
  chalkFact: $("#chalk-fact"),
  factNext: $("#fact-next"),
  funSurprise: $("#fun-surprise"),
  heroSurprise: $("#hero-surprise"),
  marquee: $("#marquee-track")
};

/* --------------------------- warmup shim --------------------------- */

function addWarmup(): void {
  document.documentElement.classList.add("js-ready");
}

/* --------------------------- confetti helpers --------------------------- */

function bigCelebration(): void {
  launchConfetti({
    count: 190,
    angle: 90,
    spread: 110,
    power: 1.15,
    origin: { x: 0.5, y: 0.45 }
  });
  window.setTimeout(() => {
    launchConfetti({
      count: 70,
      angle: 90,
      spread: 90,
      origin: { x: 0.2, y: 0.7 },
      shapes: ["heart"]
    });
    launchConfetti({
      count: 70,
      angle: 90,
      spread: 90,
      origin: { x: 0.8, y: 0.7 },
      shapes: ["heart"]
    });
  }, 350);
}

/* ----------------------------- toast ----------------------------- */

let toastTimer = 0;
function showToast(message: string): void {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 3400);
}

/* ------------------------- wish counter ------------------------- */

const WISH_KEY = "aakash-td-wishes-2026";
const WISH_BASE = 128;

function storedWishes(): number {
  try {
    const raw = window.localStorage.getItem(WISH_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function incrementWishes(): void {
  const next = storedWishes() + 1;
  try {
    window.localStorage.setItem(WISH_KEY, String(next));
  } catch {
    /* private mode — no problem */
  }
  els.statWishes.textContent = (WISH_BASE + next).toLocaleString("en-IN");
  els.statWishes.classList.remove("pop");
  void els.statWishes.offsetWidth; // restart animation
  els.statWishes.classList.add("pop");
}

/* ------------------------- reveal on scroll ------------------------- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

function observeReveals(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
}

/* ------------------------- count-up stats ------------------------- */

function countUp(el: HTMLElement, target: number, duration = 1100): void {
  const start = performance.now();
  const step = (now: number): void => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ------------------------- teacher card rendering ------------------------- */

type Filter = Subject | "All";
let activeFilter: Filter = "All";
let query = "";

function avatarHTML(t: Teacher): string {
  const meta = SUBJECT_META[t.subject];
  const photo = t.photo
    ? `<img
        src="${escapeHtml(t.photo)}"
        alt="${escapeHtml(t.name)}"
        loading="lazy"
        decoding="async"
        onerror="this.remove()"
      />`
    : "";
  return `
    <div class="avatar" style="--accent:${meta.color};--soft:${meta.soft}">
      <span class="avatar-initials">${escapeHtml(initialsOf(t.name))}</span>
      ${photo}
      <span class="avatar-emoji" aria-hidden="true">${t.emoji}</span>
    </div>`;
}

function matches(t: Teacher): boolean {
  if (activeFilter !== "All" && t.subject !== activeFilter) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [t.name, t.salutation, t.subject, t.tagline].some((field) =>
    field.toLowerCase().includes(q)
  );
}

function renderTeachers(): void {
  const list = TEACHERS.filter(matches);
  const meta = { ...SUBJECT_META };

  const cards = list
    .map((t, i) => {
      const m = meta[t.subject];
      return `
        <article
          class="teacher-card reveal"
          data-id="${t.id}"
          style="--delay:${Math.min(i, 8) * 70}ms"
          tabindex="0"
          role="button"
          aria-label="Read the personal message for ${escapeHtml(t.name)}"
        >
          <span class="card-subject" style="--accent:${m.color};--soft:${m.soft}">
            ${t.emoji} ${t.subject}
          </span>
          ${avatarHTML(t)}
          <h3 class="card-name">${escapeHtml(t.name)}</h3>
          <p class="card-tagline">“${escapeHtml(t.tagline)}”</p>
          <span class="card-btn">💌 Read My Message</span>
        </article>`;
    })
    .join("");

  const comingSoon =
    activeFilter === "All" && !query.trim()
      ? `
        <article class="teacher-card teacher-coming reveal" style="--delay:${Math.min(list.length, 8) * 70}ms">
          <span class="card-subject" style="--accent:#60a5fa;--soft:#eaf3ff">
            📸 Coming Soon
          </span>
          <div class="avatar avatar-coming" style="--accent:#60a5fa;--soft:#eaf3ff">
            <span class="avatar-emoji">✨</span>
          </div>
          <h3 class="card-name">More teachers + real photos</h3>
          <p class="card-tagline">This card has your name on it — send us the photo and we’ll add it here live!</p>
          <span class="card-btn card-btn-soon">🖼️ Adding Soon…</span>
        </article>`
      : "";

  const empty = `
    <div class="empty-state reveal in">
      <span>🔍</span>
      <p>No teacher found with that name.<br />Maybe they’re busy clearing doubts? 😄</p>
    </div>`;

  els.teacherGrid.innerHTML = list.length === 0 ? empty : cards + comingSoon;

  els.teacherGrid.querySelectorAll<HTMLElement>(".teacher-card[data-id]").forEach((card) => {
    const open = (): void => {
      const t = TEACHERS.find((x) => x.id === card.dataset.id);
      if (t) openModal(t);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  observeReveals(els.teacherGrid);
}

function renderFilterPills(): void {
  const subjects = ["All", ...Array.from(new Set(TEACHERS.map((t) => t.subject)))] as Filter[];
  els.filterPills.innerHTML = subjects
    .map(
      (s) => `
      <button
        class="pill ${s === activeFilter ? "active" : ""}"
        data-filter="${s}"
        aria-pressed="${s === activeFilter}"
      >
        ${s === "All" ? "✨ All Teachers" : s}
      </button>`
    )
    .join("");

  els.filterPills.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter as Filter;
      renderFilterPills();
      renderTeachers();
    });
  });
}

/* ----------------------------- modal ----------------------------- */

let isSpeaking = false;
let speakButton: HTMLButtonElement | null = null;

function openModal(t: Teacher): void {
  const meta = SUBJECT_META[t.subject];

  els.modalBody.innerHTML = `
    <div class="modal-hero" style="--accent:${meta.color};--soft:${meta.soft}">
      ${avatarHTML(t)}
      <div class="modal-heading">
        <span class="modal-subject">${t.emoji} ${t.subject} Teacher</span>
        <h3 id="modal-name">${escapeHtml(t.name)}</h3>
        <p class="modal-tag">“${escapeHtml(t.tagline)}”</p>
      </div>
    </div>
    <div class="modal-message">
      ${t.message.map((p, i) => `<p style="--i:${i}">${escapeHtml(p)}</p>`).join("")}
    </div>
    <aside class="modal-note">🎈 ${escapeHtml(t.note)}</aside>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-listen">🔊 Read Aloud</button>
      <button class="btn btn-primary" id="btn-wish">💙 Send a Wish</button>
    </div>`;

  speakButton = els.modalBody.querySelector("#btn-listen");
  speakButton?.addEventListener("click", () => toggleSpeech(t));

  els.modalBody.querySelector("#btn-wish")?.addEventListener("click", (e) => {
    const ev = e as MouseEvent;
    heartBurst(ev.clientX, ev.clientY);
    launchConfetti({
      count: 90,
      angle: 90,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      power: 0.9
    });
    incrementWishes();
    const btn = e.target as HTMLButtonElement;
    btn.innerHTML = "💙 Wish Sent!";
    btn.classList.add("sent");
    btn.disabled = true;
    showToast(`Wish sent to ${t.salutation} — now go say it out loud too! 💌`);
  });

  els.overlay.classList.add("open");
  els.overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  els.modalClose.focus();
}

function closeModal(): void {
  stopSpeech();
  els.overlay.classList.remove("open");
  els.overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

/* ------------------------- read aloud (Web Speech API) ------------------------- */

function preferredVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("en-in")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    null
  );
}

function toggleSpeech(t: Teacher): void {
  if (!("speechSynthesis" in window)) {
    showToast("Your browser doesn’t support reading aloud — just read it yourself! 💙");
    return;
  }
  if (isSpeaking) {
    stopSpeech();
    return;
  }
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = `A little message for ${t.salutation}. ${t.message.join(" ")}`;
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  const voice = preferredVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => setSpeaking(false);
  utterance.onerror = () => setSpeaking(false);

  setSpeaking(true);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function setSpeaking(value: boolean): void {
  isSpeaking = value;
  if (speakButton) speakButton.textContent = value ? "⏹ Stop Reading" : "🔊 Read Aloud";
}

function stopSpeech(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setSpeaking(false);
}

/* ------------------------ chalkboard fun zone ------------------------ */

let factIndex = 0;
let factTimer = 0;

function showFact(index: number): void {
  factIndex = (index + CHALK_FACTS.length) % CHALK_FACTS.length;
  els.chalkFact.classList.remove("switching");
  void els.chalkFact.offsetWidth; // restart animation
  els.chalkFact.textContent = CHALK_FACTS[factIndex];
  els.chalkFact.classList.add("switching");
}

function startFactRotation(): void {
  showFact(0);
  factTimer = window.setInterval(() => showFact(factIndex + 1), 4500);
}

/* ----------------------------- marquee ----------------------------- */

function buildMarquee(): void {
  const items = els.marquee.innerHTML;
  els.marquee.innerHTML = items + items; // duplicate for a seamless loop
}

/* --------------------------- nav & scroll --------------------------- */

let scrollTicking = false;
function onScroll(): void {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    els.progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    els.nav.classList.toggle("scrolled", y > 24);
    scrollTicking = false;
  });
}

function setupNav(): void {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  els.burger.addEventListener("click", () => {
    const open = els.navLinks.classList.toggle("open");
    els.burger.setAttribute("aria-expanded", String(open));
    els.nav.classList.toggle("menu-open", open);
  });

  els.navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      els.navLinks.classList.remove("open");
      els.nav.classList.remove("menu-open");
      els.burger.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll<HTMLElement>("[data-wish-cta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.setTimeout(bigCelebration, 650);
    });
  });
}

/* ------------------------------ boot ------------------------------ */

function boot(): void {
  addWarmup();
  setupNav();
  buildMarquee();
  renderFilterPills();
  renderTeachers();
  observeReveals();

  // stats (count up for a lively entrance)
  countUp(els.statTeachers, TEACHERS.length);
  countUp(els.statSubjects, new Set(TEACHERS.map((t) => t.subject)).size);
  countUp(els.statWishes, WISH_BASE + storedWishes());

  // modal close interactions
  els.modalClose.addEventListener("click", closeModal);
  els.overlay.addEventListener("click", (e) => {
    if (e.target === els.overlay) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // fun zone
  els.factNext.addEventListener("click", () => {
    showFact(factIndex + 1);
    window.clearInterval(factTimer);
    factTimer = window.setInterval(() => showFact(factIndex + 1), 4500);
  });
  els.funSurprise.addEventListener("click", bigCelebration);
  els.heroSurprise.addEventListener("click", () => {
    bigCelebration();
    showToast("Surprise! Teachers deserve ALL the confetti today 🎆");
  });
  startFactRotation();

  // search
  els.search.addEventListener("input", () => {
    query = els.search.value;
    renderTeachers();
  });

  // speech voices warm-up
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => preferredVoice();
  }

  // first-load celebration (subtle, once)
  window.setTimeout(() => {
    if (window.scrollY < 40) {
      launchConfetti({ count: 60, origin: { x: 0.5, y: 0.18 }, power: 0.8 });
    }
  }, 900);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
