/* Shared teacher card + avatar renderers (used on many pages) */
import {
  SUBJECT_META,
  initialsOf,
  portraitsFor,
  subjectTopics,
  teacherUrl,
  type Teacher
} from "./teachers";
import { escapeHtml } from "./site";

/** Inline fallback: try the painted portrait, then the raw photo, then initials. */
const IMG_ONERROR =
  "(function(i){if(i.dataset.alt){var a=i.dataset.alt;i.removeAttribute('data-alt');i.src=a;}else{i.remove();}})(this)";

export function avatarHTML(t: Teacher, large = false): string {
  const meta = SUBJECT_META[t.subject];
  const { src, alt } = portraitsFor(t);
  const img = src
    ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(
        t.name
      )}" loading="lazy" decoding="async"${
        alt ? ` data-alt="${escapeHtml(alt)}"` : ""
      } onerror="${IMG_ONERROR}" />`
    : "";
  return `
    <div class="avatar${large ? " lg" : ""}" style="--accent:${meta.color};--accent-2:${meta.color2};--soft:${meta.soft}">
      <span class="avatar-initials">${escapeHtml(initialsOf(t.name))}</span>
      ${img}
      <span class="avatar-emoji" aria-hidden="true">${t.emoji}</span>
    </div>`;
}

export function teacherCardHTML(t: Teacher, index = 0): string {
  const m = SUBJECT_META[t.subject];
  const topics = subjectTopics(t.subject).slice(0, 3);
  return `
    <a class="teacher-card tilt spot reveal" href="${teacherUrl(t)}"
       style="--delay:${Math.min(index, 8) * 60}ms;--accent:${m.color};--accent-2:${m.color2};--soft:${m.soft}"
       aria-label="Open the dedication page for ${escapeHtml(t.name)}">
      <span class="card-strip" aria-hidden="true"></span>
      <span class="card-top">
        <span class="card-subject">${t.emoji} ${t.subject}</span>
        <span class="card-goto" aria-hidden="true">↗</span>
      </span>
      ${avatarHTML(t)}
      <h3 class="card-name">${escapeHtml(t.name)}</h3>
      <p class="card-tagline">“${escapeHtml(t.tagline)}”</p>
      <span class="card-topics">${topics
        .map((x) => `<span>${escapeHtml(x)}</span>`)
        .join("")}</span>
      <span class="card-meta">${escapeHtml(t.dialogue)}</span>
      <span class="card-btn">💌 Open Dedication</span>
    </a>`;
}

export function comingSoonCardHTML(): string {
  return `
    <article class="teacher-card teacher-coming reveal" aria-label="More teachers coming soon"
             style="--accent:#ea780c;--accent-2:#f5b301;--soft:#fff1dc">
      <span class="card-strip" aria-hidden="true"></span>
      <span class="card-top">
        <span class="card-subject">📸 Coming Soon</span>
      </span>
      <div class="avatar avatar-coming">
        <span class="avatar-initials">✨</span>
        <span class="avatar-emoji" aria-hidden="true">💙</span>
      </div>
      <h3 class="card-name">More teachers + real photos</h3>
      <p class="card-tagline">“This wall has your name on it!”</p>
      <span class="card-meta">Drop a photo in <b>public/teachers/</b> — it appears here by itself.</span>
      <span class="card-btn">🖼️ Adding Soon…</span>
    </article>`;
}
