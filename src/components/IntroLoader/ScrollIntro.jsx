import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ScrollIntro.css";

/*
 * ScrollIntro
 * -----------
 * Scroll drives which STAGE is showing. Mouse position drives a 3D tilt on
 * the photo + parallax on the words around it.
 *
 * Layout: photo is pinned dead-center of the viewport (not full-screen).
 * Each stage has a giant word ABOVE the photo and a giant word BELOW it,
 * both full-width, so the type reads as flowing behind you from the top
 * edge of the screen to the bottom edge, with you in between. A smaller
 * accent word overlaps the top of the photo in front, for the "flowing
 * from behind me" layered look.
 *
 * PHOTO BACKGROUND: the photo's edges are feathered (mask-image) and
 * darkened toward the edge (radial overlay) so a plain/white headshot
 * background blends into the dark scene instead of sitting as a hard box.
 * This is a soft CSS approximation — for a completely clean cutout, run
 * the photo through a background-remover (e.g. remove.bg) first and it'll
 * look even better here.
 *
 * Drop your photo at /public/profile.png or change PHOTO_SRC below.
 */

const PHOTO_SRC = `${import.meta.env.BASE_URL}profile.png`;

const STAGES = [
  { eyebrow: "PORTFOLIO / 2026", top: "HELLO", accent: "I'M", bottom: "PRATHIKSHA JAIN" },
  { eyebrow: "ORIGIN", top: "MY JOURNEY", accent: "BEGAN", bottom: "2003" },
  { eyebrow: "CURIOSITY", top: "INTO THE WORLD OF", accent: "EXPLORING", bottom: "AI" },
  { eyebrow: "TODAY", top: "STILL", accent: "EXPLORING", bottom: "STILL BUILDING" },
  { eyebrow: "ENTER", top: "A LITTLE BETTER", accent: "EVERY DAY", bottom: "SCROLL TO ENTER" },
];

const LAST_INDEX = STAGES.length - 1;
const EXIT_THRESHOLD = LAST_INDEX + 0.85;
const MAX_PROGRESS = LAST_INDEX + 1.2;

const prefersSteppedMobileIntro = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;

export default function ScrollIntro({ onComplete }) {
  const [render, setRender] = useState({ progress: 0, elapsed: 0, tiltX: 0, tiltY: 0 });

  const targetProgressRef = useRef(0);
  const progressRef = useRef(0);
  const tiltTargetRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const startTimeRef = useRef(performance.now());
  const exitingRef = useRef(false);
  const lastMobileStepRef = useRef(0);
  const touchSteppedRef = useRef(false);
  const rafRef = useRef(null);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finish = useCallback((delay = 650) => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
      onComplete && onComplete();
    }, delay);
  }, [onComplete]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, 0);
    };
  }, []);

  useEffect(() => {
    const SENSITIVITY = 0.0016;
    const clamp = (v) => Math.max(0, Math.min(MAX_PROGRESS, v));
    const stepMobileIntro = (direction) => {
      const now = performance.now();
      if (now - lastMobileStepRef.current < 420) return;

      lastMobileStepRef.current = now;

      const currentStage = Math.round(targetProgressRef.current);

      if (direction > 0 && currentStage >= LAST_INDEX) {
        targetProgressRef.current = MAX_PROGRESS;
        finish();
        return;
      }

      targetProgressRef.current = Math.max(
        0,
        Math.min(LAST_INDEX, currentStage + direction)
      );
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (exitingRef.current) return;

      if (prefersSteppedMobileIntro() && Math.abs(e.deltaY) > 8) {
        stepMobileIntro(e.deltaY > 0 ? 1 : -1);
        return;
      }

      targetProgressRef.current = clamp(targetProgressRef.current + e.deltaY * SENSITIVITY);
      if (targetProgressRef.current >= EXIT_THRESHOLD) finish();
    };

    let touchStartY = null;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchSteppedRef.current = false;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      if (exitingRef.current || touchStartY === null) return;
      const y = e.touches[0].clientY;
      const delta = touchStartY - y;

      if (
        prefersSteppedMobileIntro() &&
        Math.abs(delta) > 28
      ) {
        if (!touchSteppedRef.current) {
          stepMobileIntro(delta > 0 ? 1 : -1);
          touchSteppedRef.current = true;
        }
        return;
      }

      touchStartY = y;
      targetProgressRef.current = clamp(targetProgressRef.current + delta * SENSITIVITY * 2.2);
      if (targetProgressRef.current >= EXIT_THRESHOLD) finish();
    };

    const onTouchEnd = () => {
      touchStartY = null;
      touchSteppedRef.current = false;
    };

    const onKey = (e) => {
      if (exitingRef.current) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        targetProgressRef.current = clamp(targetProgressRef.current + 0.6);
        if (targetProgressRef.current >= EXIT_THRESHOLD) finish();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        targetProgressRef.current = clamp(targetProgressRef.current - 0.6);
      }
    };

    const onMouseMove = (e) => {
      tiltTargetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [finish]);

  useEffect(() => {
    const tick = (now) => {
      const ease = reducedMotion ? 1 : 0.09;
      const tiltEase = reducedMotion ? 1 : 0.06;

      progressRef.current += (targetProgressRef.current - progressRef.current) * ease;
      tiltRef.current = {
        x: tiltRef.current.x + (tiltTargetRef.current.x - tiltRef.current.x) * tiltEase,
        y: tiltRef.current.y + (tiltTargetRef.current.y - tiltRef.current.y) * tiltEase,
      };

      setRender({
        progress: progressRef.current,
        elapsed: (now - startTimeRef.current) / 1000,
        tiltX: tiltRef.current.x,
        tiltY: tiltRef.current.y,
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion]);

  const { progress, elapsed, tiltX, tiltY } = render;
  const clampedStageFloat = Math.max(0, Math.min(LAST_INDEX, progress));
  const activeStage = Math.round(clampedStageFloat);
  const globalT = Math.min(1, progress / MAX_PROGRESS);
  const exitT = Math.max(0, Math.min(1, (progress - EXIT_THRESHOLD) / (MAX_PROGRESS - EXIT_THRESHOLD)));

  const photoFloat = Math.sin(elapsed * 0.7) * 5;
  const photoScale = 1 + globalT * 0.05 + exitT * 0.4;
  const photoTilt = `perspective(1200px) rotateX(${-tiltY * 10}deg) rotateY(${tiltX * 14}deg)`;
  const photoTranslate = `translate3d(calc(-50% + ${tiltX * 14}px), calc(-50% + ${photoFloat + tiltY * 10}px), 0)`;
  const accentDrift = `translate3d(${tiltX * 22}px, ${tiltY * 14}px, 0)`;
  const topDrift = `translate3d(${-tiltX * 10}px, ${-tiltY * 6}px, 0)`;
  const bottomDrift = `translate3d(${tiltX * 8}px, ${tiltY * 5}px, 0)`;

  return (
    <div className={`si-root ${exitingRef.current ? "si-exiting" : ""}`} style={{ "--exit-t": exitT }}>
      <div className="si-noise" />
      <div className="si-cursor-glow" style={{ left: `${50 + tiltX * 25}%`, top: `${50 + tiltY * 25}%` }} />
      <div className="si-vignette" />

      <div className="si-stars">
        {Array.from({ length: 50 }).map((_, i) => (
          <span
            key={i}
            className="si-star"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 29) % 100}%`,
              animationDelay: `${(i % 12) * 0.4}s`,
              transform: `translate3d(${progress * (i % 5) * -4}px, ${progress * (i % 3) * -3}px, 0)`,
            }}
          />
        ))}
      </div>

      <header className="si-header">
        <div className="si-logo">
          <span className="si-logo-mark">P</span>
          PRATHIKSHA JAIN
        </div>
        <div className="si-header-right">
          <span className="si-dot" />
          PORTFOLIO / 2026
        </div>
      </header>

      <main className="si-type-scene" style={{ transform: `scale(${1 - exitT * 0.15})`, opacity: 1 - exitT }}>
        {STAGES.map((stage, i) => {
  const diff = clampedStageFloat - i;
  const visible = Math.max(0, 1 - Math.abs(diff) * 1.35);
  const shift = diff * -50;
  const isActive = i === activeStage;

  return (
    <div
      key={i}
      className="si-type-layer"
      style={{
        opacity: visible,
        pointerEvents: isActive ? "auto" : "none"
      }}
    >
      {/* TOP TEXT — stays BEHIND the person */}
      <div
        className="si-eyebrow"
        style={{
          transform: `translate3d(0, ${shift}px, 0)`
        }}
      >
        <i />
        {stage.eyebrow}
      </div>

      <div
        className="si-word si-word-top"
        style={{
          transform: `translate3d(0, ${shift}px, 0) ${topDrift}`
        }}
      >
        {stage.top}
      </div>

      <div className="si-photo-gap" />
    </div>
  );
})}

        <div
  className="si-photo-tilt"
  style={{
    transform: `${photoTranslate} ${photoTilt} scale(${photoScale})`
  }}
>
  <img
    src={PHOTO_SRC}
    alt="Prathiksha Jain"
  />
</div>
{/* BOTTOM NAME — IN FRONT OF THE PERSON */}
{STAGES.map((stage, i) => {
  const diff = clampedStageFloat - i;
  const visible = Math.max(0, 1 - Math.abs(diff) * 1.35);
  const isActive = i === activeStage;

  return (
    <div
      key={`bottom-${i}`}
      className="si-bottom-name"
      style={{
        opacity: visible,
        pointerEvents: isActive ? "auto" : "none",
        transform: `translate3d(-50%, calc(-50% + ${
          diff * -50
        }px), 0) ${bottomDrift}`
      }}
    >
      {stage.bottom}
    </div>
  );
})}
        {STAGES.map((stage, i) => {
          const diff = clampedStageFloat - i;
          const visible = Math.max(0, 1 - Math.abs(diff) * 1.35);
          const isActive = i === activeStage;
          return (
            <div
              key={`accent-${i}`}
              className="si-word si-word-accent"
              style={{
                opacity: visible,
                pointerEvents: isActive ? "auto" : "none",
                transform: `translate3d(-50%, calc(-50% + ${diff * -50}px), 0) ${accentDrift}`,
              }}
            >
              {stage.accent}
            </div>
          );
        })}
      </main>

      <footer className="si-footer">
        <div className="si-footer-side">
          <span>SCROLL</span>
          <span>TO</span>
          <span>CONTINUE</span>
        </div>

        <div className="si-progress">
          <div className="si-progress-track">
            <div className="si-progress-fill" style={{ width: `${Math.min(100, (progress / LAST_INDEX) * 100)}%` }} />
          </div>
          <div className="si-progress-label">
            {String(activeStage + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
          </div>
        </div>

        <div className="si-footer-side si-footer-right">
          <span className="si-scroll-icon"><i /></span>
        </div>
      </footer>

      <div className="si-corner si-corner-tl" />
      <div className="si-corner si-corner-tr" />
      <div className="si-corner si-corner-bl" />
      <div className="si-corner si-corner-br" />

      <div className="si-flash" style={{ opacity: exitT }} />
    </div>
  );
}
