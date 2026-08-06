"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BUBBLE_COUNT_DESKTOP = 36;
const BUBBLE_COUNT_MOBILE = 14;


/**
 * Spawn lightweight bubble divs into a host.
 * Pure DOM — no particle library. Returns nodes for GSAP + cleanup.
 */
function createBubbles(host: HTMLElement, count: number): HTMLElement[] {
  const bubbles: HTMLElement[] = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const size = 6 + Math.random() * 26;
    const opacity = 0.12 + Math.random() * 0.38;

    el.className = "dive-bubble";
    el.setAttribute("aria-hidden", "true");
    // Inline styles keep bubble creation allocation-light (no React re-renders)
    el.style.cssText = [
      "position:absolute",
      "border-radius:9999px",
      "pointer-events:none",
      "will-change:auto",
      `width:${size}px`,
      `height:${size}px`,
      `opacity:${opacity}`,
      `left:${Math.random() * 100}%`,
      `bottom:${-5 - Math.random() * 30}%`,
      "background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(140,210,230,0.15) 45%, rgba(255,255,255,0.06))",
      "border:1px solid rgba(255,255,255,0.22)",
    ].join(";");

    host.appendChild(el);
    bubbles.push(el);
  }

  return bubbles;
}

/**
 * Scene2DiveTransition — pinned "INTO THE TIDE..." dive.
 * Idle: wavy rising bubbles. Scrub: text scales out + bubbles accelerate.
 */
export function Scene2DiveTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const bubbleHostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const host = bubbleHostRef.current;
    if (!section || !host) return;

    const ctx = gsap.context(() => {
      const title = section.querySelector<HTMLElement>(".dive-title");
      if (!title) return;

      gsap.set(title, { transformOrigin: "50% 50%" });

      /* ── Custom JS bubbles (idle) ───────────────────────────
       * Each bubble rises on a continuous loop and drifts on X
       * with a sine-style yoyo so motion feels underwater, not
       * like a straight particle column.
       */
      const isTouch =
        window.matchMedia("(hover: none), (pointer: coarse)").matches;
      const bubbles = createBubbles(
        host,
        isTouch ? BUBBLE_COUNT_MOBILE : BUBBLE_COUNT_DESKTOP,
      );
      const vh = window.innerHeight;

      // Store rise tweens so scrub can speed them up
      const riseTweens: gsap.core.Tween[] = [];

      bubbles.forEach((bubble, i) => {
        const riseDuration = 9 + Math.random() * 12;
        const waveAmp = 14 + Math.random() * 36;
        const waveDuration = 1.6 + Math.random() * 2.4;
        const delay = Math.random() * riseDuration * 0.5;

        const rise = gsap.fromTo(
          bubble,
          { y: vh * (0.15 + (i % 8) * 0.1) },
          {
            y: -vh * 0.3 - Math.random() * 80,
            duration: riseDuration,
            ease: "none",
            repeat: -1,
            delay,
          },
        );
        riseTweens.push(rise);

        // Horizontal oscillation (natural drift)
        gsap.to(bubble, {
          x: `+=${waveAmp * (i % 2 === 0 ? 1 : -1)}`,
          duration: waveDuration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * waveDuration,
        });
      });

      /* ── ScrollTrigger scrub timeline ───────────────────────
       * Pin Scene 2. Scrubbing:
       *  1) Title scales to ~5x and fades (dive through the words)
       *  2) Bubble rise timeScale ramps up (camera plunges deeper)
       * Unpin happens automatically when the scroll distance ends.
       */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=180%",
            pin: true,
            pinType: isTouch ? "transform" : "fixed",
            scrub: isTouch ? 0.35 : true,
            anticipatePin: isTouch ? 0 : 1,
          },
        })
        .to(
          title,
          {
            scale: isTouch ? 3.2 : 5,
            opacity: 0,
            // CSS blur during scrub is a major mobile GPU killer
            filter: isTouch ? "none" : "blur(6px)",
            ease: "power1.in",
            duration: 1,
          },
          0,
        )
        // Accelerate bubble rise via timeScale on each rise tween
        .to(
          {},
          {
            duration: 1,
            ease: "none",
            onUpdate: function onBubbleAccel() {
              const p = this.progress();
              const speed = 1 + p * 7; // 1x → 8x rise speed
              riseTweens.forEach((t) => t.timeScale(speed));
            },
          },
          0,
        );
    }, section);

    return () => {
      // Kill GSAP (ScrollTriggers + idle loops) and remove bubble nodes
      ctx.revert();
      host.replaceChildren();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-2-dive-transition"
      className="landscape-stage relative w-full overflow-hidden bg-[linear-gradient(180deg,#041428_0%,#0a2a4a_40%,#0d3d5c_65%,#071828_100%)]"
      aria-label="Scene 2: Into the Tide"
    >
      {/* Bubble layer — filled by createBubbles() */}
      <div
        ref={bubbleHostRef}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden
      />

      <h1 className="dive-title absolute inset-0 z-20 flex items-center justify-center px-6 text-center font-[family-name:var(--font-tide)] text-[clamp(2.5rem,8vw,6.5rem)] tracking-[0.08em] text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] will-change-transform">
        INTO THE TIDE...
      </h1>
    </section>
  );
}
