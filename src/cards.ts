/* Shared teacher card + avatar renderers (used on many pages) */
import { SUBJECT_META, initialsOf, teacherUrl, type Teacher } from "./teachers";
import { escapeHtml } from "./site";

export function avatarHTML(t: Teacher, large = false): string {
  const meta = SUBJECT_META[t.subject];
  const photo = t.photo
    ? `<img src="${escapeHtml(t.photo)}" alt="${escapeHtml(
        t.name
      )}" loading="lazy" decoding="async" onerror="this.remove()" />`
    : "";
  return `
    <div class="avatar${large ? " lg" : ""}" style="--accent:${meta.color};--soft:${meta.soft}">
      <span class="avatar-initials">${escapeHtml(initialsOf(t.name))}</span>
      ${photo}
      <span class="avatar-emoji" aria-hidden="true">${t.emoji}</span>
    </div>`;
}

export function teacherCardHTML(t: Teacher, index = 0): string {
  const m = SUBJECT_META[t.subject];
  return `
    <a class="teacher-card tilt spot reveal" href="${teacherUrl(t)}"
       style="--delay:${Math.min(index, 8) * 60}ms;--accent:${m.color};--soft:${m.soft}"
       aria-label="Open the dedication page for ${escapeHtml(t.name)}">
      <span class="card-top">
        <span class="card-subject" style="--accent:${m.color};--soft:${m.soft}">${t.emoji} ${t.subject}</span>
        <span class="card-goto" aria-hidden="true">↗</span>
      </span>
      ${avatarHTML(t)}
      <h3 class="card-name">${escapeHtml(t.name)}</h3>
      <p class="card-tagline">“${escapeHtml(t.tagline)}”</p>
      <span class="card-meta">${escapeHtml(t.dialogue)}</span>
      <span class="card-btn">💌 Open Dedication</span>
    </a>`;
}

export function comingSoonCardHTML(): string {
  return `
    <article class="teacher-card teacher-coming reveal" aria-label="More teachers coming soon">
      <span class="card-top">
        <span class="card-subject" style="--accent:#b98a1d;--soft:#fff3d6">📸 Coming Soon</span>
      </span>
      <div class="avatar avatar-coming" style="--accent:#e9a319;--soft:#fff3d6">
        <span class="avatar-initials">✨</span>
        <span class="avatar-emoji" aria-hidden="true">💙</span>
      </div>
      <h3 class="card-name">More teachers + real photos</h3>
      <p class="card-tagline">“This wall has your name on it!”</p>
      <span class="card-meta">Send us a photo — we add it live.</span>
      <span class="card-btn">🖼️ Adding Soon…</span>
    </article>`;
}
