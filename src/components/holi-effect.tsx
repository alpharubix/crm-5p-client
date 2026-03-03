import { useEffect } from "react"

export default function HoliEffect() {

  useEffect(() => {
    const COLOR_RGBS = [
      { r: 255, g: 93, b: 143 },
      { r: 255, g: 209, b: 102 },
      { r: 123, g: 211, b: 137 },
      { r: 92, g: 168, b: 255 },
      { r: 187, g: 134, b: 252 },
    ];
    const GRAVITY = 0.022;
    const DRAG = 0.99;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      return;
    }

    const IS_COARSE_POINTER =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    const MAX_PARTICLES = IS_COARSE_POINTER ? 90 : 170;
    const MOVE_INTERVAL_MS = IS_COARSE_POINTER ? 70 : 38;
    const MAX_DPR = IS_COARSE_POINTER ? 1.25 : 2;
    const USE_SHADOW = !IS_COARSE_POINTER;
    const TOUCH_COOLDOWN_MS = 500;

    const MIN_LIFE = IS_COARSE_POINTER ? 22 : 30;
    const MAX_LIFE = IS_COARSE_POINTER ? 40 : 52;
    const MIN_SIZE = IS_COARSE_POINTER ? 2.6 : 3;
    const MAX_SIZE = IS_COARSE_POINTER ? 6.4 : 8.2;
    const MIN_LOBES = IS_COARSE_POINTER ? 2 : 3;
    const MAX_LOBES = IS_COARSE_POINTER ? 5 : 6;
    const MIN_SPREAD = IS_COARSE_POINTER ? 0.05 : 0.08;
    const MAX_SPREAD = IS_COARSE_POINTER ? 0.13 : 0.2;
    const MIN_BLUR = IS_COARSE_POINTER ? 4 : 8;
    const MAX_BLUR = IS_COARSE_POINTER ? 10 : 18;
    const MIN_OPACITY = IS_COARSE_POINTER ? 0.18 : 0.22;
    const MAX_OPACITY = IS_COARSE_POINTER ? 0.4 : 0.5;
    const INTERACTIVE_BURST = IS_COARSE_POINTER ? 12 : 24;
    const NORMAL_BURST = IS_COARSE_POINTER ? 7 : 14;
    const CLICK_VELOCITY = IS_COARSE_POINTER ? 0.95 : 1.1;
    const TOUCH_VELOCITY = IS_COARSE_POINTER ? 0.95 : 1.2;

    const canvas = document.createElement("canvas");
    canvas.id = "holi-color-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1050";

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    document.body.appendChild(canvas);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastMoveAt = 0;
    let lastTouchAt = 0;
    let rafId = 0;
    const particles = [];

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function pickColorRgb() {
      const index = Math.floor(Math.random() * COLOR_RGBS.length);
      return COLOR_RGBS[index];
    }

    function trimParticles() {
      if (particles.length <= MAX_PARTICLES) {
        return;
      }

      const extraCount = particles.length - MAX_PARTICLES;
      particles.splice(0, extraCount);
    }

    function addParticle(x, y, velocityScale) {
      const angle = randomBetween(-Math.PI, Math.PI);
      const speed = randomBetween(0.45, 1.6) * velocityScale;
      const life = randomBetween(MIN_LIFE, MAX_LIFE);
      const size = randomBetween(MIN_SIZE, MAX_SIZE);
      const lobeCount = Math.floor(randomBetween(MIN_LOBES, MAX_LOBES + 1));
      const lobes = [];

      for (let index = 0; index < lobeCount; index += 1) {
        lobes.push({
          dx: randomBetween(-0.9, 0.9),
          dy: randomBetween(-0.9, 0.9),
          scale: randomBetween(0.5, 1),
          stretchX: randomBetween(0.75, 1.35),
          stretchY: randomBetween(0.75, 1.35),
        });
      }

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        spread: randomBetween(MIN_SPREAD, MAX_SPREAD),
        blur: randomBetween(MIN_BLUR, MAX_BLUR),
        opacity: randomBetween(MIN_OPACITY, MAX_OPACITY),
        rotation: randomBetween(0, Math.PI * 2),
        spin: randomBetween(-0.025, 0.025),
        life,
        maxLife: life,
        rgb: pickColorRgb(),
        lobes,
      });
    }

    function burst(x, y, count, velocityScale) {
      for (let index = 0; index < count; index += 1) {
        addParticle(x, y, velocityScale);
      }

      trimParticles();
      if (!rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    }

    function drawParticle(particle) {
      const alpha = Math.max(particle.life / particle.maxLife, 0) * particle.opacity;
      const { r, g, b } = particle.rgb;
      ctx.globalAlpha = alpha;
      if (USE_SHADOW) {
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.45)`;
        ctx.shadowBlur = particle.blur;
      }

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      particle.lobes.forEach((lobe) => {
        const centerX = lobe.dx * particle.size * 0.65;
        const centerY = lobe.dy * particle.size * 0.65;
        const radiusX = particle.size * lobe.scale * lobe.stretchX;
        const radiusY = particle.size * lobe.scale * lobe.stretchY;
        const outerRadius = Math.max(radiusX, radiusY);

        const gradient = ctx.createRadialGradient(
          centerX - outerRadius * 0.2,
          centerY - outerRadius * 0.2,
          outerRadius * 0.1,
          centerX,
          centerY,
          outerRadius,
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.92)`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.48)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      ctx.shadowBlur = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= 1;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        particle.vx *= DRAG;
        particle.vy = particle.vy * DRAG + GRAVITY;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.size += particle.spread;
        particle.rotation += particle.spin;

        drawParticle(particle);
      }

      ctx.globalAlpha = 1;

      if (particles.length) {
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      rafId = 0;
    }

    function onPointerMove(event) {
      const now = window.performance.now();
      if (now - lastMoveAt < MOVE_INTERVAL_MS) {
        return;
      }

      lastMoveAt = now;
      burst(event.clientX, event.clientY, 1, 0.45);
    }

    function isInteractiveTarget(target) {
      return (
        target instanceof Element &&
        !!target.closest("button, .button, section, [data-result-table]")
      );
    }

    function getBurstCount(target) {
      return isInteractiveTarget(target) ? INTERACTIVE_BURST : NORMAL_BURST;
    }

    function burstFromTarget(x, y, target, velocityScale) {
      burst(x, y, getBurstCount(target), velocityScale);
    }

    function onClick(event) {
      const now = window.performance.now();
      if (now - lastTouchAt < TOUCH_COOLDOWN_MS) {
        return;
      }

      burstFromTarget(event.clientX, event.clientY, event.target, CLICK_VELOCITY);
    }

    function onTouchStart(event) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      lastTouchAt = window.performance.now();
      burstFromTarget(touch.clientX, touch.clientY, event.target, TOUCH_VELOCITY);
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    if (!IS_COARSE_POINTER) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);

      if (rafId) cancelAnimationFrame(rafId);
      canvas.remove();
    };
  }, [])
  return null
}
