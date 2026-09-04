/* 💌 Individual teacher dedication page — teacher.html?id=<id> */
import "./style.css";
import {
  TEACHERS,
  SUBJECT_META,
  getTeacher,
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

const WISHED_KEY = "aakash-td-wished-ids";

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

    <article class="ded-card reveal" style="--accent:${m.color};--soft:${m.soft}">
      <div class="ded-top">
        ${avatarHTML(t, true)}
        <div class="ded-id">
          <span class="ded-role">${t.emoji} ${t.subject} Teacher · Aakash</span>
          <h2>${escapeHtml(t.name)}</h2>
          <p class="ded-tagline">“${escapeHtml(t.tagline)}”</p>
          <p class="ded-quote">${escapeHtml(t.quote)}</p>
          <div class="ded-actions">
            <button class="btn btn-outline btn-sm" id="btn-listen">🔊 Read Aloud</button>
            <button class="btn btn-primary btn-sm" id="btn-wish">💙 Send a Wish</button>
          </div>
        </div>
      </div>

      <div class="paper">
        <h3>A letter for ${escapeHtml(t.salutation)} 💌</h3>
        ${t.message.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        <p class="letter-sign">— with love, your students at Aakash 💙</p>
      </div>

      <aside class="note-callout"><span class="nc-emoji">🎈</span><span>${escapeHtml(t.note)}</span></aside>

      <div class="fact-grid">
        <div class="fact-chip"><small>⚡ Superpower</small><strong>${escapeHtml(t.superpower)}</strong></div>
        <div class="fact-chip"><small>🎬 Legendary dialogue</small><strong>${escapeHtml(t.dialogue)}</strong></div>
        <div class="fact-chip"><small>📚 Subject</small><strong>${t.emoji} ${t.subject} · ${escapeHtml(t.tagline)}</strong></div>
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
        <span class="pn-mini" style="--accent:${pm.color}">←</span>
        <span><small>← Previous</small><strong>${escapeHtml(prev.name)}</strong></span>
      </a>
      <a class="pn-card next reveal" style="--delay:90ms" href="teacher.html?id=${next.id}" aria-label="Next teacher">
        <span class="pn-mini" style="--accent:${nm.color}">→</span>
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
