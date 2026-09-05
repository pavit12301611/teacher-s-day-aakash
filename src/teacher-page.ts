/* 💌 Individual teacher dedication page — teacher.html?id=<id> */
import "./style.css";
import {
  TEACHERS,
  SUBJECT_META,
  getTeacher,
  subjectTopics,
  prevTeacher,
  nextTeacher,
  relatedTeachers,
  type Teacher
} from "./teachers";
import {
  initSite,
  observeReveals,
  initSpotlight,
  initTilt,
  must,
  qs,
  escapeHtml,
  showToast,
  burstAt,
  incrementWishes,
  createSpeech,
  preferredVoice
} from "./site";
import { avatarHTML, teacherCardHTML } from "./cards";
import { launchConfetti } from "./confetti";
import { renderMinigame } from "./minigames";
import {
  typeLetter,
  stopTypewriter,
  timeGreeting,
  greetingEmoji,
  secretsFor,
  messagesFor,
  type TypeHandle
} from "./surprises";

const WISHED_KEY = "aakash-td-wished-ids";
const SECRETS_KEY = "aakash-td-secrets";

function wishedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHED_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function markWished(id: string): void {
  try {
    const ids = new Set(wishedIds());
    ids.add(id);
    window.localStorage.setItem(WISHED_KEY, JSON.stringify([...ids]));
  } catch {
    /* noop */
  }
}

function renderNotFound(): void {
  document.title = "Teacher not found 💙 | Aakash Teacher's Day";
  must("#ded-root").innerHTML = `
    <div class="ded-card"><div class="notfound-wrap">
      <span class="big">🧭</span>
      <h2 style="font-family:var(--font-display);font-size:2rem">Oops — no teacher here!</h2>
      <p style="color:var(--muted)">The link looks broken, but the love isn't. Pick your teacher below. 💙</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:10px">
        <a class="btn btn-primary" href="teachers.html">👩‍🏫 All Teachers</a>
        <a class="btn btn-outline" href="index.html">🏠 Home</a>
      </div>
    </div></div>
    <h3 class="section-gap" style="font-family:var(--font-display);font-size:1.6rem;margin-bottom:18px">Choose your superhero 👇</h3>
    <div class="teacher-grid cols-3" id="related-grid"></div>`;
  const grid = must("#related-grid");
  grid.innerHTML = TEACHERS.map((t, i) => teacherCardHTML(t, i)).join("");
  observeReveals(grid);
  initSpotlight(grid);
  initTilt(grid);
}

function dedicationHTML(t: Teacher): string {
  const m = SUBJECT_META[t.subject];
  const prev = prevTeacher(t);
  const next = nextTeacher(t);
  const pm = SUBJECT_META[prev.subject];
  const nm = SUBJECT_META[next.subject];
  const related = relatedTeachers(t, 3);
  const pageUrl = `${window.location.origin}${window.location.pathname}?id=${t.id}`;

  return `
    <nav class="crumbs reveal" aria-label="Breadcrumb" style="margin-bottom:18px">
      <a href="index.html">Home</a><span>›</span>
      <a href="teachers.html">Teachers</a><span>›</span>
      <span class="here">${escapeHtml(t.salutation)}</span>
    </nav>

    <article class="ded-card reveal" style="--accent:${m.color};--accent-2:${m.color2};--soft:${m.soft}">
      <span class="ded-strip" aria-hidden="true"></span>
      <div class="ded-top">
        ${avatarHTML(t, true)}
        <div class="ded-id">
          <span class="ded-role">${t.emoji} ${t.subject} Teacher · Aakash</span>
          <h2>${escapeHtml(t.name)}</h2>
          <p class="ded-tagline">“${escapeHtml(t.tagline)}”</p>
          <p class="ded-quote">${escapeHtml(t.quote)}</p>
          <p class="ded-topics">${subjectTopics(t.subject)
            .map((x) => `<span>${escapeHtml(x)}</span>`)
            .join("")}</p>
          <div class="ded-actions">
            <button class="btn btn-outline btn-sm" id="btn-listen">🔊 Read Aloud</button>
            <button class="btn btn-primary btn-sm" id="btn-wish">💙 Send a Wish</button>
          </div>
        </div>
      </div>

      <div class="paper" id="letter">
        <div class="letter-toolbar" id="letter-toolbar" hidden>
          <span class="letter-badge">💌 A sealed letter · just for ${escapeHtml(t.salutation)}</span>
          <button class="letter-skip" id="btn-skip-letter">⏩ Read now</button>
        </div>
        <div class="seal-overlay" id="seal-overlay">
          <div class="seal-inner">
            <span class="seal-emoji">💌</span>
            <p class="seal-title">A sealed letter for ${escapeHtml(t.salutation)}</p>
            <p class="seal-sub">Tap to break the seal and let it type itself out ✨</p>
            <button class="btn btn-gold" id="btn-open-letter">💌 Open the Letter</button>
          </div>
        </div>
        <h3>A letter for ${escapeHtml(t.salutation)} 💌</h3>
        <div class="letter-body" id="letter-body" aria-live="polite"></div>
      </div>

      <aside class="note-callout"><span class="nc-emoji">🎈</span><span>${escapeHtml(t.note)}</span></aside>

      <div class="fact-grid">
        <div class="fact-chip"><small>⚡ Superpower</small><strong>${escapeHtml(t.superpower)}</strong></div>
        <div class="fact-chip"><small>🎬 Legendary dialogue</small><strong>${escapeHtml(t.dialogue)}</strong></div>
        <div class="fact-chip"><small>📚 Subject</small><strong>${t.emoji} ${t.subject} · ${escapeHtml(t.tagline)}</strong></div>
      </div>

      <div class="minigame-slot reveal" id="minigame"></div>

      <div class="secret-box reveal">
        <div class="secret-head">
          <span class="secret-emoji">🤫</span>
          <div>
            <b>4 hidden secrets</b>
            <small>only the students who were really there would know these</small>
          </div>
        </div>
        <div class="secret-list" id="secret-list"></div>
        <p class="secret-hint">Tap a card to unseal it… 🔓</p>
      </div>

      <div class="msg-lib reveal">
        <div class="msg-lib-head">
          <span class="msg-lib-emoji">💬</span>
          <div>
            <b>From your students</b>
            <small>a little library of thank-yous for ${escapeHtml(t.salutation)}</small>
          </div>
        </div>
        <div class="msg-lib-body" id="msg-lib-body"></div>
        <div class="msg-lib-nav">
          <button class="msg-arrow" id="msg-prev" aria-label="Previous message">←</button>
          <span class="msg-count" id="msg-count">1 / 1</span>
          <button class="msg-arrow" id="msg-next" aria-label="Next message">→</button>
        </div>
      </div>

      <div class="share-row">
        <span class="share-label">Share this dedication 🔗</span>
        <button class="share-btn" id="btn-copy">📋 Copy Link</button>
        <a class="share-btn" id="btn-wa" target="_blank" rel="noopener"
           href="https://wa.me/?text=${encodeURIComponent(`Happy Teacher's Day, ${t.salutation}! 💙 Read your surprise dedication: ${pageUrl}`)}">🟢 WhatsApp</a>
        <button class="share-btn" id="btn-native">📤 More…</button>
      </div>
    </article>

    <div class="prevnext">
      <a class="pn-card reveal" href="teacher.html?id=${prev.id}" aria-label="Previous teacher">
        <span class="pn-mini" style="--accent:${pm.color};--accent-2:${pm.color2}">←</span>
        <span><small>← Previous</small><strong>${escapeHtml(prev.name)}</strong></span>
      </a>
      <a class="pn-card next reveal" style="--delay:90ms" href="teacher.html?id=${next.id}" aria-label="Next teacher">
        <span class="pn-mini" style="--accent:${nm.color};--accent-2:${nm.color2}">→</span>
        <span><small>Next →</small><strong>${escapeHtml(next.name)}</strong></span>
      </a>
    </div>

    <h3 class="section-gap" style="font-family:var(--font-display);font-size:1.7rem;margin-bottom:18px">
      More superheroes you'll love 💫</h3>
    <div class="teacher-grid cols-3" id="related-grid">
      ${related.map((r, i) => teacherCardHTML(r, i)).join("")}
    </div>
    <div class="center-cta">
      <a class="btn btn-dark" href="teachers.html">👩‍🏫 See all teachers</a>
    </div>`;
}

function wireSealedLetter(t: Teacher): void {
  const overlay = qs<HTMLElement>("#seal-overlay");
  const toolbar = qs<HTMLElement>("#letter-toolbar");
  const body = qs<HTMLElement>("#letter-body");
  const skipBtn = qs<HTMLButtonElement>("#btn-skip-letter");
  if (!overlay || !body) return;

  const hour = new Date().getHours();
  const greeting = timeGreeting(new Date());
  const chunks: string[] = [
    `${greeting}, ${t.salutation} ${greetingEmoji(hour)}`,
    ...t.message
  ];

  let letterHandle: TypeHandle | null = null;

  const startTyping = (): void => {
    try {
      sessionStorage.setItem("aakash-td-opened-" + t.id, "1");
    } catch {
      /* noop */
    }
    overlay.classList.add("open");
    window.setTimeout(() => overlay.remove(), 500);
    if (toolbar) toolbar.hidden = false;
    letterHandle = typeLetter(body, chunks);
    launchConfetti({ count: 120, origin: { x: 0.5, y: 0.25 }, shapes: ["heart", "dot"] });
  };

  qs<HTMLButtonElement>("#btn-open-letter")?.addEventListener("click", (e) => {
    e.preventDefault();
    startTyping();
  });
  skipBtn?.addEventListener("click", () => {
    letterHandle?.skip();
  });
  // Clicking the open letter body skips the typing too
  body.addEventListener("click", () => {
    if (letterHandle && !letterHandle.done) letterHandle.skip();
  });

  // If built after already open (e.g. re-render), reveal immediately
  if (sessionStorage.getItem("aakash-td-opened-" + t.id) === "1") {
    startTyping();
  }
}

function wireMinigame(t: Teacher): void {
  const slot = qs<HTMLElement>("#minigame");
  if (!slot) return;
  renderMinigame(slot, t);
}

function wireSecrets(t: Teacher): void {
  const list = qs<HTMLElement>("#secret-list");
  if (!list) return;
  const secrets = secretsFor(t);

  const read = (): number[] => {
    try {
      const raw = window.localStorage.getItem(SECRETS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      const map = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, number[]>;
      const mine = map[t.id];
      return Array.isArray(mine) ? mine.filter((x): x is number => typeof x === "number") : [];
    } catch {
      return [];
    }
  };
  const save = (list: number[]): void => {
    try {
      const raw = window.localStorage.getItem(SECRETS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      const map = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, number[]>;
      map[t.id] = list;
      window.localStorage.setItem(SECRETS_KEY, JSON.stringify(map));
    } catch {
      /* noop */
    }
  };

  const paint = (): void => {
    const revealed = new Set(read());
    list.innerHTML = secrets
      .map((s, i) => {
        const open = revealed.has(i);
        return `
        <button class="secret-card ${open ? "revealed" : ""}" data-i="${i}" aria-expanded="${open}">
          <span class="secret-lock">${open ? "🔓" : "🔒"}</span>
          <span class="secret-card-name">${open ? escapeHtml(s) : `Secret ${i + 1}`}</span>
          <span class="secret-card-ico">${open ? "✨" : "🤫"}</span>
        </button>`;
      })
      .join("");
    list.querySelectorAll<HTMLButtonElement>(".secret-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.i);
        const cur = new Set(read());
        if (cur.has(i)) {
          cur.delete(i);
        } else {
          cur.add(i);
        }
        save([...cur]);
        paint();
      });
    });
  };

  paint();
}

function wireMessages(t: Teacher): void {
  const body = qs<HTMLElement>("#msg-lib-body");
  const countEl = qs<HTMLElement>("#msg-count");
  const prev = qs<HTMLButtonElement>("#msg-prev");
  const next = qs<HTMLButtonElement>("#msg-next");
  if (!body || !countEl) return;

  const messages = messagesFor(t, 6);
  let index = 0;

  const paint = (): void => {
    body.innerHTML = `
      <p class="msg-text">“${escapeHtml(messages[index])}”</p>
      <span class="msg-by">— one of ${t.salutation}'s students 💙</span>`;
    countEl.textContent = `${index + 1} / ${messages.length}`;
  };

  prev?.addEventListener("click", () => {
    index = (index - 1 + messages.length) % messages.length;
    paint();
  });
  next?.addEventListener("click", () => {
    index = (index + 1) % messages.length;
    paint();
  });

  paint();
}

function wireDedication(t: Teacher): void {
  // SEO title per teacher (shareable, individual page)
  document.title = `Happy Teacher's Day, ${t.salutation}! 💙 | Aakash`;
  qs('meta[name="description"]')?.setAttribute(
    "content",
    `A personal Teacher's Day dedication for ${t.name} (${t.subject}) — ${t.tagline}.`
  );

  // Read aloud
  const listenBtn = qs<HTMLButtonElement>("#btn-listen");
  const speech = createSpeech(
    `A little message for ${t.salutation}. ${t.message.join(" ")}`,
    listenBtn
  );
  listenBtn?.addEventListener("click", () => speech.toggle());
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.onvoiceschanged = () => preferredVoice();
    } catch {
      /* noop */
    }
  }

  // Wish button (one wish per teacher, remembered)
  const wishBtn = qs<HTMLButtonElement>("#btn-wish");
  const paintWished = (): void => {
    if (!wishBtn) return;
    wishBtn.innerHTML = "💙 Wish Sent!";
    wishBtn.classList.add("sent");
    wishBtn.disabled = true;
  };
  if (wishedIds().includes(t.id)) paintWished();
  wishBtn?.addEventListener("click", (e) => {
    const ev = e as MouseEvent;
    burstAt(ev.clientX || innerWidth / 2, ev.clientY || 220);
    incrementWishes();
    markWished(t.id);
    paintWished();
    showToast(`Wish sent to ${t.salutation} — now go say it out loud too! 💌`);
  });

  // Share actions
  const pageUrl = `${window.location.origin}${window.location.pathname}?id=${t.id}`;
  qs("#btn-copy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      showToast("Link copied! Share it on WhatsApp status 📋💙");
    } catch {
      showToast(`Copy this link: ${pageUrl}`);
    }
  });
  qs("#btn-native")?.addEventListener("click", async () => {
    const nav = navigator as Navigator & {
      share?: (data: { title: string; text: string; url: string }) => Promise<void>;
    };
    if (nav.share) {
      try {
        await nav.share({
          title: `Happy Teacher's Day, ${t.salutation}!`,
          text: `A surprise dedication for ${t.salutation} 💙`,
          url: pageUrl
        });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(pageUrl);
        showToast("Link copied! Share it anywhere 📋💙");
      } catch {
        showToast(`Copy this link: ${pageUrl}`);
      }
    }
  });

  qs("#btn-print")?.addEventListener("click", () => window.print());

  // Keyboard: ← previous teacher, → next teacher
  const goPrev = `teacher.html?id=${prevTeacher(t).id}`;
  const goNext = `teacher.html?id=${nextTeacher(t).id}`;
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") window.location.href = goPrev;
    else if (e.key === "ArrowRight") window.location.href = goNext;
  });

  // New surprises: sealed letter, minigame, secrets, message library
  wireSealedLetter(t);
  wireMinigame(t);
  wireSecrets(t);
  wireMessages(t);

  window.addEventListener("pagehide", () => stopTypewriter());

  const related = qs("#related-grid");
  if (related) {
    observeReveals(related);
    initSpotlight(related);
    initTilt(related);
  }
}

function boot(): void {
  initSite();
  const id = new URLSearchParams(window.location.search).get("id");
  const teacher = getTeacher(id);
  if (!teacher) {
    renderNotFound();
    observeReveals(must("#ded-root"));
    return;
  }
  must("#ded-root").innerHTML = dedicationHTML(teacher);
  observeReveals(must("#ded-root"));
  initSpotlight(must("#ded-root"));
  initTilt(must("#ded-root"));
  wireDedication(teacher);

  // Gentle entrance shower
  window.setTimeout(() => {
    launchConfetti({ count: 60, origin: { x: 0.5, y: 0.2 }, power: 0.8 });
  }, 600);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
