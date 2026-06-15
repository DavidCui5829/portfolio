/* ============================================================
   main.js
   - Live shoot-on-the-move simulation (hero canvas)
   - Scroll reveal
   - Footer year
   ============================================================ */

document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Scroll reveal ---------- */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll("section, .project");
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

/* ---------- SOTM simulation ----------
   Visualizes the same idea as the real robot code:
   the aim point leads the goal by velocity * time-of-flight,
   solved iteratively. Goal (hub) is fixed; the robot drives a
   looping path; the compensated aim point is recomputed each frame.
------------------------------------------------------------------ */
(function () {
  const canvas = document.getElementById("sotm");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  const css = getComputedStyle(document.documentElement);
  const C = {
    teal: css.getPropertyValue("--teal").trim() || "#3dd6c4",
    amber: css.getPropertyValue("--amber").trim() || "#f4b860",
    line: css.getPropertyValue("--line").trim() || "#233049",
    dim: css.getPropertyValue("--text-dim").trim() || "#93a0b8",
    faint: css.getPropertyValue("--text-faint").trim() || "#5e6c86",
    ink2: css.getPropertyValue("--ink-2").trim() || "#0f1626",
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fixed goal / hub
  const hub = { x: W * 0.78, y: H * 0.24 };

  // Time-of-flight model: longer shots take longer (drives the lead).
  // Scaled for the canvas; mirrors using a measured TOF lookup by distance.
  function tof(dist) { return 0.0016 * dist + 0.18; }

  const LEAD_K = 48; // px of lead per unit (tof * speedDir), keeps offset on-screen

  // Iterative solver, same shape as the robot code:
  //   aim = hub - velDir * tof(distance_to_aim) * K
  // velDir is a unit vector; the magnitude stays bounded so it converges cleanly.
  function solveAim(robot, velDir) {
    let aim = { x: hub.x, y: hub.y };
    for (let i = 0; i < 4; i++) {
      const dist = Math.hypot(aim.x - robot.x, aim.y - robot.y);
      const lead = tof(dist) * LEAD_K;
      aim = { x: hub.x - velDir.x * lead, y: hub.y - velDir.y * lead };
    }
    return aim;
  }

  function grid() {
    ctx.strokeStyle = "rgba(33,31,28,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }

  function arrow(from, to, color, width) {
    const dx = to.x - from.x, dy = to.y - from.y;
    const ang = Math.atan2(dy, dx);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
    const head = 9;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - head * Math.cos(ang - 0.4), to.y - head * Math.sin(ang - 0.4));
    ctx.lineTo(to.x - head * Math.cos(ang + 0.4), to.y - head * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  }

  function hubMark() {
    // funnel / goal
    ctx.strokeStyle = C.amber; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(244,184,96,0.18)";
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.amber;
    ctx.beginPath(); ctx.arc(hub.x, hub.y, 4, 0, Math.PI * 2); ctx.fill();
    label("GOAL", hub.x + 22, hub.y + 4, C.amber);
  }

  function robotMark(p, ang) {
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(ang);
    ctx.fillStyle = C.teal; ctx.strokeStyle = C.teal; ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(47,111,98,0.12)";
    ctx.fillRect(-13, -13, 26, 26);
    ctx.strokeRect(-13, -13, 26, 26);
    ctx.fillStyle = C.teal;
    ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(4, -6); ctx.lineTo(4, 6); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function label(text, x, y, color) {
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }

  let t = 0;
  const path = (tt) => ({
    x: W * 0.30 + Math.cos(tt) * W * 0.16,
    y: H * 0.62 + Math.sin(tt * 1.7) * H * 0.18,
  });

  let prev = path(0);

  function frame() {
    ctx.clearRect(0, 0, W, H);
    grid();

    const robot = path(t);
    const vel = { x: (robot.x - prev.x), y: (robot.y - prev.y) };
    const speed = Math.hypot(vel.x, vel.y) || 0.0001;
    const heading = Math.atan2(vel.y, vel.x);

    // normalized velocity direction
    const vDir = { x: vel.x / speed, y: vel.y / speed };
    const velVisual = { x: vDir.x * 46, y: vDir.y * 46 }; // fixed on-screen vector length

    const aim = solveAim(robot, vDir);

    // dashed line: robot -> real goal (naive aim)
    ctx.setLineDash([4, 5]); ctx.strokeStyle = C.faint; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(robot.x, robot.y); ctx.lineTo(hub.x, hub.y); ctx.stroke();
    ctx.setLineDash([]);

    // compensated aim point
    ctx.fillStyle = C.teal;
    ctx.beginPath(); ctx.arc(aim.x, aim.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(47,111,98,0.35)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(aim.x, aim.y, 11, 0, Math.PI * 2); ctx.stroke();
    label("aim", aim.x + 14, aim.y - 8, C.teal);

    // solid line: robot -> compensated aim (the shot)
    ctx.strokeStyle = C.teal; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(robot.x, robot.y); ctx.lineTo(aim.x, aim.y); ctx.stroke();

    // velocity vector off the robot
    arrow(robot, { x: robot.x + velVisual.x, y: robot.y + velVisual.y }, C.amber, 2);
    label("v", robot.x + velVisual.x + 6, robot.y + velVisual.y + 4, C.amber);

    hubMark();
    robotMark(robot, heading);

    // readout
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = C.dim;
    const lead = Math.hypot(aim.x - hub.x, aim.y - hub.y);
    ctx.fillText("lead = v \u00d7 tof(d)   |   |lead| = " + lead.toFixed(0) + "px", 16, H - 16);

    prev = robot;
    if (!reduce) { t += 0.012; requestAnimationFrame(frame); }
  }

  if (reduce) {
    // draw a single representative static frame
    t = 1.1; prev = path(1.088);
    frame();
  } else {
    requestAnimationFrame(frame);
  }
})();
