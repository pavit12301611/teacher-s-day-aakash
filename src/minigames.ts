/* ============================================================
   🕹️ Subject minigames — one tiny, dependency-free toy per subject.
   Rendered inside every dedication page so each teacher's corner
   feels different. Mathematics = π, Physics = Web Audio sound lab,
   Chemistry = periodic-table name-speller, Biology = quick quiz.
   ============================================================ */

import { type Subject, type Teacher } from "./teachers";
import { launchConfetti } from "./confetti";

/* ------------------------- tiny helpers ------------------------- */

function escape(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Deterministic PRNG (mulberry32) so each teacher gets a stable set. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeId(t: Teacher): string {
  return `${t.id}-${t.subject}`;
}

/* ------------------------- Math: π typing ------------------------- */

const PI_DIGITS = "14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798";

function renderPiType(mount: HTMLElement): void {
  const digits = PI_DIGITS.slice(0, 80);
  mount.innerHTML = `
    <div class="mg-pi" data-game="pi">
      <p class="mg-title">π is calling. How far can you type? 🥧</p>
      <p class="mg-sub">Type the digits of π below — the machine counts how far you get. (<b>3.</b> is pre-typed)</p>
      <div class="mg-pi-display"><span class="mg-pi-prefix">3.</span><span class="mg-pi-typed" id="mg-pi-typed"></span><span class="mg-pi-target" id="mg-pi-target">${escape(digits)}</span></div>
      <input class="mg-pi-input" id="mg-pi-input" inputmode="numeric" autocomplete="off" aria-label="Type the digits of pi" />
      <p class="mg-result" id="mg-pi-result">Type as many correct digits as you can…</p>
    </div>`;

  const input = mount.querySelector<HTMLInputElement>("#mg-pi-input")!;
  const typedEl = mount.querySelector<HTMLElement>("#mg-pi-typed")!;
  const resultEl = mount.querySelector<HTMLElement>("#mg-pi-result")!;
  let correct = 0;
  let finished = false;

  input.addEventListener("input", () => {
    if (finished) return;
    let value = input.value.replace(/[^0-9]/g, "");
    // count leading correct digits
    let c = 0;
    while (c < value.length && c < digits.length && value[c] === digits[c]) c++;
    correct = c;
    if (correct < value.length) {
      // a mistake — reset input to the correct prefix so the challenge continues
      value = value.slice(0, correct);
      input.value = value;
      resultEl.textContent = correct === 0 ? "Oops, stick to 3.14159… 😅" : `${correct} digits — nice, but you slipped!`;
    } else {
      resultEl.textContent =
        correct >= 30
          ? `${correct} digits — genius level! 🔥`
          : correct > 0
            ? `${correct} digits and counting… 💪`
            : "Type as many correct digits as you can…";
    }
    typedEl.textContent = value;

    if (correct >= digits.length) {
      finished = true;
      typedEl.textContent = digits;
      resultEl.textContent = `Perfect! All ${digits.length} digits of π. You're unbeatable. 🥧🎉`;
      launchConfetti({ count: 140, origin: { x: 0.5, y: 0.3 }, shapes: ["dot", "strip"] });
      input.blur();
    }
  });
}

/* ------------------------- Physics: Web Audio sound lab ------------------------- */

function renderSoundLab(mount: HTMLElement): void {
  mount.innerHTML = `
    <div class="mg-sound" data-game="sound">
      <p class="mg-title">The Sound Lab 🔈</p>
      <p class="mg-sub">Every wave is a story. Slide the frequency, hit play, and <b>watch your name's frequency</b> come alive.</p>
      <div class="mg-sound-controls">
        <div class="mg-slider"><label>Frequency <b id="mg-freq-val">220</b> Hz</label><input type="range" id="mg-freq" min="80" max="960" value="220" step="1" /></div>
        <div class="mg-slider"><label>Volume <b id="mg-vol-val">60</b>%</label><input type="range" id="mg-vol" min="0" max="100" value="60" step="1" /></div>
      </div>
      <canvas class="mg-wave" id="mg-wave" width="560" height="140" aria-hidden="true"></canvas>
      <div class="mg-sound-actions">
        <button class="btn btn-primary btn-sm" id="mg-play">▶ Play tone</button>
        <button class="btn btn-outline btn-sm" id="mg-pulse">💓 Heart pulse</button>
      </div>
      <p class="mg-result" id="mg-sound-result">What harmonic do you hear? Press play. 🔊</p>
    </div>`;

  const freqEl = mount.querySelector<HTMLInputElement>("#mg-freq")!;
  const volEl = mount.querySelector<HTMLInputElement>("#mg-vol")!;
  const freqVal = mount.querySelector<HTMLElement>("#mg-freq-val")!;
  const volVal = mount.querySelector<HTMLElement>("#mg-vol-val")!;
  const wave = mount.querySelector<HTMLCanvasElement>("#mg-wave")!;
  const ctx2d = wave.getContext("2d")!;
  const resultEl = mount.querySelector<HTMLElement>("#mg-sound-result")!;

  freqEl.addEventListener("input", () => {
    freqVal.textContent = freqEl.value;
    drawWave(Number(freqEl.value), true);
  });
  volEl.addEventListener("input", () => (volVal.textContent = volEl.value));
  drawWave(Number(freqEl.value), true);

  let audioCtx: AudioContext | null = null;
  let osc: OscillatorNode | null = null;
  let gain: GainNode | null = null;
  let raf = 0;

  function drawWave(freq: number, quick = false): void {
    const w = wave.width;
    const h = wave.height;
    ctx2d.clearRect(0, 0, w, h);
    ctx2d.lineWidth = 2;
    ctx2d.strokeStyle = "#2f7cf6";
    ctx2d.beginPath();
    const n = 160;
    for (let x = 0; x <= n; x++) {
      const px = (x / n) * w;
      const phase = quick ? (x / n) * Math.PI * 2 : (x / n) * Math.PI * 8;
      const py = h / 2 + Math.sin(phase) * (h / 2 - 14) * (Math.min(freq, 960) / 960) * 0.9;
      if (x === 0) ctx2d.moveTo(px, py);
      else ctx2d.lineTo(px, py);
    }
    ctx2d.stroke();
  }

  function startContext(): AudioContext {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtx;
  }

  function start(mode: "tone" | "pulse"): void {
    stop();
    const ctxNode = startContext();
    if (ctxNode.state === "suspended") void ctxNode.resume();
    gain = ctxNode.createGain();
    const vol = Number(volEl.value) / 100;
    gain.gain.value = mode === "pulse" ? 0.001 : vol * 0.5;
    gain.connect(ctxNode.destination);
    osc = ctxNode.createOscillator();
    osc.type = mode === "pulse" ? "sine" : "sawtooth";
    osc.frequency.value = Number(freqEl.value);
    osc.connect(gain);
    osc.start();

    if (mode === "pulse") {
      let t = ctxNode.currentTime;
      let i = 0;
      const beat = (): void => {
        if (!gain || !osc) return;
        const peak = vol * 0.9;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
        i++;
        t += 0.34;
        if (i < 8) {
          window.setTimeout(beat, 340);
        } else {
          stop();
        }
      };
      beat();
    }

    const draw = (): void => {
      drawWave(Number(freqEl.value));
      raf = requestAnimationFrame(draw);
    };
    draw();
  }

  function stop(): void {
    cancelAnimationFrame(raf);
    if (gain) {
      try {
        gain.gain.setTargetAtTime(0, audioCtx?.currentTime ?? 0, 0.02);
      } catch {
        /* noop */
      }
      gain.disconnect();
    }
    if (osc) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      osc.disconnect();
    }
    osc = null;
    gain = null;
    drawWave(Number(freqEl.value));
  }

  mount.querySelector<HTMLButtonElement>("#mg-play")?.addEventListener("click", (e) => {
    e.preventDefault();
    start("tone");
    resultEl.textContent = `Whoosh! Playing ${freqEl.value} Hz — that's your wave right now. 🌊`;
  });
  mount.querySelector<HTMLButtonElement>("#mg-pulse")?.addEventListener("click", (e) => {
    e.preventDefault();
    start("pulse");
    resultEl.textContent = "That's a heartbeat — same rhythm every good teacher gives. 💙";
  });
  window.addEventListener("pagehide", () => {
    stop();
    void audioCtx?.close();
  });
}

/* ------------------------- Chemistry & Biology: periodic speller ------------------------- */

const ELEMENTS: Array<{ sym: string; full: string; num: number }> = [
  { sym: "H", full: "Hydrogen", num: 1 },
  { sym: "He", full: "Helium", num: 2 },
  { sym: "Li", full: "Lithium", num: 3 },
  { sym: "Be", full: "Beryllium", num: 4 },
  { sym: "B", full: "Boron", num: 5 },
  { sym: "C", full: "Carbon", num: 6 },
  { sym: "N", full: "Nitrogen", num: 7 },
  { sym: "O", full: "Oxygen", num: 8 },
  { sym: "F", full: "Fluorine", num: 9 },
  { sym: "Ne", full: "Neon", num: 10 },
  { sym: "Na", full: "Sodium", num: 11 },
  { sym: "Mg", full: "Magnesium", num: 12 },
  { sym: "Al", full: "Aluminium", num: 13 },
  { sym: "Si", full: "Silicon", num: 14 },
  { sym: "P", full: "Phosphorus", num: 15 },
  { sym: "S", full: "Sulphur", num: 16 },
  { sym: "Cl", full: "Chlorine", num: 17 },
  { sym: "Ar", full: "Argon", num: 18 },
  { sym: "K", full: "Potassium", num: 19 },
  { sym: "Ca", full: "Calcium", num: 20 },
  { sym: "Sc", full: "Scandium", num: 21 },
  { sym: "Ti", full: "Titanium", num: 22 },
  { sym: "V", full: "Vanadium", num: 23 },
  { sym: "Cr", full: "Chromium", num: 24 },
  { sym: "Mn", full: "Manganese", num: 25 },
  { sym: "Fe", full: "Iron", num: 26 },
  { sym: "Co", full: "Cobalt", num: 27 },
  { sym: "Ni", full: "Nickel", num: 28 },
  { sym: "Cu", full: "Copper", num: 29 },
  { sym: "Zn", full: "Zinc", num: 30 },
  { sym: "Ga", full: "Gallium", num: 31 },
  { sym: "Ge", full: "Germanium", num: 32 },
  { sym: "As", full: "Arsenic", num: 33 },
  { sym: "Se", full: "Selenium", num: 34 },
  { sym: "Br", full: "Bromine", num: 35 },
  { sym: "Kr", full: "Krypton", num: 36 },
  { sym: "Rb", full: "Rubidium", num: 37 },
  { sym: "Sr", full: "Strontium", num: 38 },
  { sym: "Y", full: "Yttrium", num: 39 },
  { sym: "Zr", full: "Zirconium", num: 40 },
  { sym: "Nb", full: "Niobium", num: 41 },
  { sym: "Mo", full: "Molybdenum", num: 42 },
  { sym: "Tc", full: "Technetium", num: 43 },
  { sym: "Ru", full: "Ruthenium", num: 44 },
  { sym: "Rh", full: "Rhodium", num: 45 },
  { sym: "Pd", full: "Palladium", num: 46 },
  { sym: "Ag", full: "Silver", num: 47 },
  { sym: "Cd", full: "Cadmium", num: 48 },
  { sym: "In", full: "Indium", num: 49 },
  { sym: "Sn", full: "Tin", num: 50 },
  { sym: "Sb", full: "Antimony", num: 51 },
  { sym: "Te", full: "Tellurium", num: 52 },
  { sym: "I", full: "Iodine", num: 53 },
  { sym: "Xe", full: "Xenon", num: 54 },
  { sym: "Cs", full: "Caesium", num: 55 },
  { sym: "Ba", full: "Barium", num: 56 },
  { sym: "La", full: "Lanthanum", num: 57 },
  { sym: "Ce", full: "Cerium", num: 58 },
  { sym: "Pr", full: "Praseodymium", num: 59 },
  { sym: "Nd", full: "Neodymium", num: 60 },
  { sym: "Pm", full: "Promethium", num: 61 },
  { sym: "Sm", full: "Samarium", num: 62 },
  { sym: "Eu", full: "Europium", num: 63 },
  { sym: "Gd", full: "Gadolinium", num: 64 },
  { sym: "Tb", full: "Terbium", num: 65 },
  { sym: "Dy", full: "Dysprosium", num: 66 },
  { sym: "Ho", full: "Holmium", num: 67 },
  { sym: "Er", full: "Erbium", num: 68 },
  { sym: "Tm", full: "Thulium", num: 69 },
  { sym: "Yb", full: "Ytterbium", num: 70 },
  { sym: "Lu", full: "Lutetium", num: 71 },
  { sym: "Hf", full: "Hafnium", num: 72 },
  { sym: "Ta", full: "Tantalum", num: 73 },
  { sym: "W", full: "Tungsten", num: 74 },
  { sym: "Re", full: "Rhenium", num: 75 },
  { sym: "Os", full: "Osmium", num: 76 },
  { sym: "Ir", full: "Iridium", num: 77 },
  { sym: "Pt", full: "Platinum", num: 78 },
  { sym: "Au", full: "Gold", num: 79 },
  { sym: "Hg", full: "Mercury", num: 80 },
  { sym: "Tl", full: "Thallium", num: 81 },
  { sym: "Pb", full: "Lead", num: 82 },
  { sym: "Bi", full: "Bismuth", num: 83 },
  { sym: "Po", full: "Polonium", num: 84 },
  { sym: "At", full: "Astatine", num: 85 },
  { sym: "Rn", full: "Radon", num: 86 },
  { sym: "Fr", full: "Francium", num: 87 },
  { sym: "Ra", full: "Radium", num: 88 },
  { sym: "Ac", full: "Actinium", num: 89 },
  { sym: "Th", full: "Thorium", num: 90 },
  { sym: "Pa", full: "Protactinium", num: 91 },
  { sym: "U", full: "Uranium", num: 92 },
  { sym: "Np", full: "Neptunium", num: 93 },
  { sym: "Pu", full: "Plutonium", num: 94 },
  { sym: "Am", full: "Americium", num: 95 },
  { sym: "Cm", full: "Curium", num: 96 },
  { sym: "Bk", full: "Berkelium", num: 97 },
  { sym: "Cf", full: "Californium", num: 98 },
  { sym: "Es", full: "Einsteinium", num: 99 },
  { sym: "Fm", full: "Fermium", num: 100 }
];

function spellName(name: string): Array<{ sym: string; full: string; num: number }> {
  const clean = name.replace(/[^a-zA-Z]/g, "");
  const out: Array<{ sym: string; full: string; num: number }> = [];
  let i = 0;
  while (i < clean.length) {
    const two = clean.slice(i, i + 2).toLowerCase();
    const one = clean[i].toLowerCase();
    const twoEl = ELEMENTS.find((e) => e.sym.toLowerCase() === two);
    const oneEl = ELEMENTS.find((e) => e.sym.toLowerCase() === one);
    // prefer the two-letter element that already contains the next char as its lower case
    if (twoEl && (twoEl.sym.toLowerCase() === two) && i + 2 <= clean.length) {
      // avoid double counting when the pair would consume a char that begins a better match - keep simple
      out.push(twoEl);
      i += 2;
    } else if (oneEl) {
      out.push(oneEl);
      i += 1;
    } else {
      // fallback: skip char
      i += 1;
    }
  }
  return out;
}

function renderPeriodicSpeller(mount: HTMLElement, subject: Subject): void {
  const isChem = subject === "Chemistry";
  mount.innerHTML = `
    <div class="mg-periodic" data-game="periodic">
      <p class="mg-title">${isChem ? "⚗️ The Element Speller" : "🧬 The Element Speller"}</p>
      <p class="mg-sub">Type your name (or any word) and we'll turn every letter into its <b>periodic element</b> — symbol + atomic number.</p>
      <input class="mg-name-input" id="mg-name-input" placeholder="Type your name…" autocomplete="off" maxlength="20" aria-label="Type a name to spell with elements" />
      <div class="mg-tiles" id="mg-tiles"><span class="mg-tiles-hint">Your name, the elemental way. 💫</span></div>
    </div>`;

  const input = mount.querySelector<HTMLInputElement>("#mg-name-input")!;
  const tiles = mount.querySelector<HTMLElement>("#mg-tiles")!;

  function paint(): void {
    const elements = spellName(input.value.trim() || "Aakash");
    if (elements.length === 0) {
      tiles.innerHTML = `<span class="mg-tiles-hint">Hmm, no elements in that — try letters A–Z. 💫</span>`;
      return;
    }
    tiles.innerHTML = elements
      .map(
        (e) => `
        <span class="mg-tile" title="${escape(e.full)} (${e.num})">
          <b>${escape(e.sym)}</b><small>${e.num}</small>
        </span>`
      )
      .join("");
  }

  input.addEventListener("input", paint);
  paint();
}

/* ------------------------- Biology: quick quiz ------------------------- */

const BIO_QUIZ: Array<{ q: string; options: string[]; answer: number }> = [
  { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], answer: 1 },
  { q: "Photosynthesis produces glucose and…?", options: ["Oxygen", "Carbon dioxide", "Water only", "Nitrogen"], answer: 0 },
  { q: "Which of these is a blood cell?", options: ["Neuron", "Platelet", "Enzyme", "Antibody"], answer: 1 },
  { q: "DNA stands for?", options: ["Deoxyribonucleic acid", "Dynamic nuclear acid", "Double nucleic adapter", "Data nucleotide array"], answer: 0 }
];

function renderBiologyQuiz(mount: HTMLElement): void {
  const quiz = BIO_QUIZ.slice(0, 3);
  mount.innerHTML = `
    <div class="mg-quiz" data-game="quiz">
      <p class="mg-title">🧬 Rapid-fire Biology Quiz</p>
      <p class="mg-sub">Three quick questions — no pressure, just fun. Your brain is a powerhouse too. 💪</p>
      <div class="mg-quiz-body" id="mg-quiz-body"></div>
      <p class="mg-result" id="mg-quiz-result"></p>
    </div>`;

  const body = mount.querySelector<HTMLElement>("#mg-quiz-body")!;
  const result = mount.querySelector<HTMLElement>("#mg-quiz-result")!;
  let score = 0;
  let index = 0;

  function renderQuestion(): void {
    if (index >= quiz.length) {
      result.textContent = `You scored ${score}/${quiz.length}. For a teacher's brain, that's top marks! 🎉`;
      launchConfetti({ count: 90, origin: { x: 0.5, y: 0.3 }, shapes: ["dot"] });
      return;
    }
    const q = quiz[index]!;
    body.innerHTML = `
      <p class="mg-q">Q${index + 1}. ${escape(q.q)}</p>
      <div class="mg-options">
        ${q.options
          .map(
            (o, i) =>
              `<button class="mg-opt" data-i="${i}"><span>${["A", "B", "C", "D"][i]}</span>${escape(o)}</button>`
          )
          .join("")}
      </div>`;
    body.querySelectorAll<HTMLButtonElement>(".mg-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (index >= quiz.length) return;
        const chosen = Number(btn.dataset.i);
        const qq = quiz[index]!;
        const wasRight = chosen === qq.answer;
        if (wasRight) score++;
        // mark colours
        btn.classList.add("chosen");
        if (wasRight) btn.classList.add("good");
        else {
          btn.classList.add("bad");
          body.querySelector<HTMLButtonElement>(`.mg-opt[data-i="${qq.answer}"]`)?.classList.add("good");
        }
        result.textContent = wasRight ? "Correct! 🎉" : `The answer is ${["A", "B", "C", "D"][qq.answer]}. Still awesome. 💙`;
        index++;
        window.setTimeout(renderQuestion, 1100);
      });
    });
  }

  renderQuestion();
}

/* ------------------------- public entry ------------------------- */

export function renderMinigame(mount: HTMLElement, teacher: Teacher): void {
  mount.innerHTML = "";
  const meta: Record<Subject, { title: string; icon: string }> = {
    Physics: { title: "Sound Lab", icon: "🔈" },
    Chemistry: { title: "Element Speller", icon: "⚗️" },
    Mathematics: { title: "π Type", icon: "🥧" },
    Biology: { title: "Biology Quiz", icon: "🧬" }
  };
  const m = meta[teacher.subject];
  mount.classList.add("minigame");
  mount.style.setProperty("--accent", teacher.subject === "Mathematics" ? "#4f46e5" : teacher.subject === "Biology" ? "#0891b2" : teacher.subject === "Physics" ? "#2563eb" : "#0ea5e9");
  const title = document.createElement("div");
  title.className = "mg-head";
  title.innerHTML = `<span class="mg-icon">${m.icon}</span><div><b>${escape(m.title)}</b><small>a tiny toy for ${escape(teacher.salutation)}</small></div>`;
  mount.appendChild(title);

  const body = document.createElement("div");
  body.className = "mg-body";
  mount.appendChild(body);

  if (teacher.subject === "Mathematics") renderPiType(body);
  else if (teacher.subject === "Physics") renderSoundLab(body);
  else if (teacher.subject === "Chemistry") renderPeriodicSpeller(body, "Chemistry");
  else if (teacher.subject === "Biology") renderBiologyQuiz(body);
  else {
    // fallback (unreachable with current types)
    body.innerHTML = `<p class="mg-title">A surprise toy is loading. ✨</p>`;
  }
}

export { seededRandom, hashSeed, makeId };
