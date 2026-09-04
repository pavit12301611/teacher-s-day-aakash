/* 🎨 Design System page — copy hex, test components */
import "./style.css";
import { initSite, showToast } from "./site";

function boot(): void {
  initSite();
  document
    .querySelectorAll<HTMLElement>(".marquee-track")
    .forEach((t) => (t.innerHTML += t.innerHTML));

  // Click any swatch to copy its hex
  document.querySelectorAll<HTMLButtonElement>("[data-hex]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const hex = btn.dataset.hex ?? "";
      try {
        await navigator.clipboard.writeText(hex);
        showToast(`Copied ${hex} to clipboard 🎨`);
      } catch {
        showToast(`Swatch: ${hex}`);
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
