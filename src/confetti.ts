/* ============================================================
   🎆 Tiny dependency-free confetti engine (draws on a canvas)
   Hearts, dots & strips — smooth with requestAnimationFrame.
   ============================================================ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  shape: "heart" | "dot" | "strip";
  life: number;
  decay: number;
  sway: number;
  swaySpeed: number;
}

export interface ConfettiOptions {
  count?: number;
  /** degrees, 0 = straight up-ish burst */
  angle?: number;
  spread?: number;
  origin?: { x: number; y: number }; // 0..1 of viewport
  colors?: string[];
  shapes?: Array<"heart" | "dot" | "strip">;
  power?: number; // burst strength
}

const DEFAULT_COLORS = ["#2f7cf6", "#38bdf8", "#7dd3fc", "#ffffff", "#93c5fd", "#e0f2fe", "#60a5fa"];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let rafId = 0;
let lastTime = 0;

function ensureCanvas(): HTMLCanvasElement {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!canvas) return;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);
    resize();
  }
  return canvas;
}

function drawHeart(c: CanvasRenderingContext2D, size: number): void {
  const s = size;
  c.beginPath();
  c.moveTo(0, s * 0.35);
  c.bezierCurveTo(s * 0.5, -s * 0.35, s * 1.1, s * 0.35, 0, s * 1.05);
  c.bezierCurveTo(-s * 1.1, s * 0.35, -s * 0.5, -s * 0.35, 0, s * 0.35);
  c.closePath();
}

function frame(now: number): void {
  if (!ctx || !canvas) return;
  const dt = Math.min((now - lastTime) / 16.6667, 3); // normalize to ~60fps steps
  lastTime = now;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= p.decay * dt;
    if (p.life <= 0 || p.y > window.innerHeight + 40) {
      particles.splice(i, 1);
      continue;
    }

    p.vy += 0.12 * dt; // gravity
    p.vx *= Math.pow(0.985, dt);
    p.sway += p.swaySpeed * dt;
    p.x += (p.vx + Math.sin(p.sway) * 0.6) * dt;
    p.y += p.vy * dt;
    p.rotation += p.spin * dt;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));

    if (p.shape === "heart") {
      ctx.fillStyle = p.color;
      drawHeart(ctx, p.size);
      ctx.fill();
    } else if (p.shape === "dot") {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
    }
    ctx.restore();
  }

  if (particles.length > 0) {
    rafId = requestAnimationFrame(frame);
  } else {
    rafId = 0;
    canvas.style.opacity = "1";
    // let the browser drop the layer after the show is over
    window.setTimeout(() => {
      if (particles.length === 0 && canvas && canvas.parentElement) {
        canvas.remove();
        canvas = null;
        ctx = null;
      }
    }, 400);
  }
}

export function launchConfetti(options: ConfettiOptions = {}): void {
  const {
    count = 120,
    angle = 90,
    spread = 70,
    origin = { x: 0.5, y: 0.5 },
    colors = DEFAULT_COLORS,
    shapes = ["heart", "dot", "strip"],
    power = 1
  } = options;

  ensureCanvas();
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const startX = origin.x * cw;
  const startY = origin.y * ch;
  const rad = (angle * Math.PI) / 180;

  for (let i = 0; i < count; i++) {
    const spreadRad = ((Math.random() - 0.5) * spread * Math.PI) / 180;
    const speed = (4.5 + Math.random() * 7) * power;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(rad + spreadRad) * speed,
      vy: -Math.abs(Math.sin(rad + spreadRad)) * speed,
      size: 6 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.25,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 1,
      decay: 0.006 + Math.random() * 0.008,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.04 + Math.random() * 0.07
    });
  }

  if (rafId === 0) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }
}

/** Burst of hearts from a specific screen position (e.g. a button click) */
export function heartBurst(clientX: number, clientY: number): void {
  launchConfetti({
    count: 36,
    angle: 90,
    spread: 80,
    power: 0.9,
    origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
    shapes: ["heart"],
    colors: ["#ff6b9d", "#ff8fb5", "#ffe0ec", "#60a5fa", "#ffffff"]
  });
}
