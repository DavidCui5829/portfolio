/* ============================================================
   main.js
   - Scroll reveal
   - Footer year
   ============================================================ */

document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Scroll reveal ---------- */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll("section");
  targets.forEach((t) => t.classList.add("reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((t) => io.observe(t));
})();
