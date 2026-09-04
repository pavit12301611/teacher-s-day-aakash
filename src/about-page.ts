/* 📖 About / tribute page */
import "./style.css";
import { initSite } from "./site";

function boot(): void {
  initSite();
  document
    .querySelectorAll<HTMLElement>(".marquee-track")
    .forEach((t) => (t.innerHTML += t.innerHTML));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
