/* ============================================================
   🧭 Shared site chrome + helpers for every page
   nav, scroll progress, reveal-on-scroll, count-up, toast,
   wish counter, confetti presets, spotlight cards, tilt,
   cursor glow, back-to-top, read-aloud.
   Every helper is null-safe so it works on all pages.
   ============================================================ */

import { launchConfetti, heartBurst } from "./confetti";

/* ------------------------- tiny helpers ------------------------- */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function qs<T extends HTMLElement = HTMLElement>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

export function must<T extends HTMLElement = HTMLElement>(sel: string): T {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
}

/* ------------------------- confetti presets ------------------------- */

const PARTY_COLORS = [
  "#ff2f7b",
  "#ff5d5d",
  "#ff8a3d",
  "#f9b234",
  "#84cc16",
  "#0f9d76",
  "#06b6d4",
  "#2f6bff",
  "#7b2ff7",
  "#c026d3",
  "#ffffff"
];


export function bigCelebration(): void {
  launchConfetti({
    count: 190,
    angle: 90,
    spread: 110,
    power: 1.15,
    origin: { x: 0.5, y: 0.45 },
    colors: PARTY_COLORS
  });
  window.setTimeout(() => {
    launchConfetti({
      count: 70,
      angle: 90,
      spread: 90,
      origin: { x: 0.18, y: 0.7 },
      shapes: ["heart"]
    });
    launchConfetti({
      count: 70,
      angle: 90,
      spread: 90,
      origin: { x: 0.82, y: 0.7 },
      shapes: ["heart"]
    });
  }, 350);
}

export function burstAt(clientX: number, clientY: number): void {
  heartBurst(clientX, clientY);
  launchConfetti({
    count: 70,
    angle: 90,
    spread: 100,
    origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
    power: 0.85,
    colors: PARTY_COLORS
  });
}

/* ------------------------------ toast ------------------------------ */

let toastTimer = 0;
export function showToast(message: string): void {
  const toast = qs("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3400);
}

/* --------------------------- wish counter --------------------------- */

export const WISH_KEY = "aakash-td-wishes-2026";
export const WISH_BASE = 128;

export function storedWishes(): number {
  try {
    const raw = window.localStorage.getItem(WISH_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

export function totalWishes(): number {
  return WISH_BASE + storedWishes();
}

export function incrementWishes(): number {
  const mine = storedWishes() + 1;
  try {
    window.localStorage.setItem(WISH_KEY, String(mine));
  } catch {
    /* private mode — no problem */
  }
  document.querySelectorAll<HTMLElement>("[data-wish-count]").forEach((el) => {
    el.textContent = (WISH_BASE + mine).toLocaleString("en-IN");
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  });
  return WISH_BASE + mine;
}

export function paintWishCounts(): void {
  const total = totalWishes().toLocaleString("en-IN");
  document.querySelectorAll<HTMLElement>("[data-wish-count]").forEach((el) => {
    el.textContent = total;
  });
}

/* ------------------------ reveal on scroll ------------------------ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
);

export function observeReveals(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
    // Stagger siblings that share a grid so entrances feel choreographed
    revealObserver.observe(el);
  });
}

/* ---------------------------- count-up ---------------------------- */

export function countUp(el: HTMLElement, target: number, duration = 1200): void {
  const start = performance.now();
  const step = (now: number): void => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString("en-IN");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initCountUps(): void {
  const seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        seen.unobserve(el);
        countUp(el, Number(el.dataset.count ?? "0"));
      }
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => seen.observe(el));
}

/* --------------------- spotlight + tilt cards --------------------- */

export function initSpotlight(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLElement>(".spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

export function initTilt(scope: ParentNode = document): void {
  if (window.matchMedia("(hover: none)").matches) return;
  scope.querySelectorAll<HTMLElement>(".tilt").forEach((card) => {
    let raf = 0;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(
          2
        )}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
      });
    });
    card.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });
}

/* ---------------------------- read aloud ---------------------------- */

export function preferredVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith("en-in")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("en-gb")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("en-us")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
      null
    );
  } catch {
    return null;
  }
}

export interface SpeechHandle {
  readonly speaking: boolean;
  toggle(): void;
  stop(): void;
}

export function createSpeech(
  text: string,
  button: HTMLButtonElement | null,
  labels = { play: "🔊 Read Aloud", stop: "⏹ Stop Reading" }
): SpeechHandle {
  let speaking = false;

  const paint = (): void => {
    if (button) button.innerHTML = speaking ? labels.stop : labels.play;
    button?.classList.toggle("is-live", speaking);
  };

  const stop = (): void => {
    try {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
    speaking = false;
    paint();
  };

  const toggle = (): void => {
    if (!("speechSynthesis" in window)) {
      showToast("Your browser can't read aloud — please read it yourself! 💙");
      return;
    }
    if (speaking) {
      stop();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    const voice = preferredVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      speaking = false;
      paint();
    };
    utterance.onerror = () => {
      speaking = false;
      paint();
    };
    speaking = true;
    paint();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.onvoiceschanged = () => preferredVoice();
    } catch {
      /* noop */
    }
  }
  window.addEventListener("pagehide", stop);

  return {
    get speaking() {
      return speaking;
    },
    toggle,
    stop
  };
}

/* ------------------------------ chrome ------------------------------ */

function initNav(): void {
  const nav = qs("#nav");
  const burger = qs<HTMLButtonElement>("#nav-burger");
  const links = qs("#nav-links");
  const progress = qs("#scroll-progress");

  // Active link from body[data-page]
  const page = document.body.dataset.page ?? "";
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  let ticking = false;
  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
      nav?.classList.toggle("scrolled", y > 24);
      qs("#to-top")?.classList.toggle("show", y > 700);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger?.addEventListener("click", () => {
    const open = links?.classList.toggle("open") ?? false;
    burger.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("menu-open", open);
  });
  links?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      nav?.classList.remove("menu-open");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  // Subjects dropdown (desktop hover/click + mobile drawer + touch)
  document.querySelectorAll<HTMLElement>(".nav-drop").forEach((drop) => {
    const btn = drop.querySelector<HTMLButtonElement>(".drop-btn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = drop.classList.contains("open");
      document
        .querySelectorAll(".nav-drop.open")
        .forEach((d) => d.classList.remove("open"));
      if (!wasOpen) {
        drop.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      } else {
        btn.setAttribute("aria-expanded", "false");
      }
    });
    drop.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        drop.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-drop.open").forEach((d) => {
      d.classList.remove("open");
      d.querySelector(".drop-btn")?.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".nav-drop.open").forEach((d) => d.classList.remove("open"));
    }
  });

  qs("#to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initCursorGlow(): void {
  if (window.matchMedia("(hover: none)").matches) return;
  const glow = qs("#cursor-glow");
  if (!glow) return;
  let x = -400;
  let y = -400;
  let gx = x;
  let gy = y;
  window.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  const loop = (): void => {
    gx += (x - gx) * 0.12;
    gy += (y - gy) * 0.12;
    glow.style.transform = `translate(${gx - 260}px, ${gy - 260}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

function initCelebrations(): void {
  document.querySelectorAll<HTMLElement>("[data-celebrate]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const ev = e as MouseEvent;
      if (ev.clientX || ev.clientY) burstAt(ev.clientX || innerWidth / 2, ev.clientY || 200);
      else bigCelebration();
    });
  });
  // First-visit gentle shower on the home page only
  if ((document.body.dataset.page ?? "") === "home") {
    window.setTimeout(() => {
      if (window.scrollY < 40) {
        launchConfetti({ count: 70, origin: { x: 0.5, y: 0.16 }, power: 0.8 });
      }
    }, 850);
  }
}

function initYear(): void {
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

/** Call once at the top of every page module. */
export function initSite(): void {
  document.documentElement.classList.add("js-ready");
  initNav();
  initCursorGlow();
  initCelebrations();
  initYear();
  paintWishCounts();
  initCountUps();
  initSpotlight();
  initTilt();
  observeReveals();
}
