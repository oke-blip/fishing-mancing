"use client";

import { useRef } from "react";
import gsap from "gsap";

import { useComicGsap, useMotionComic } from "./MotionComicContext";
import {
  createNaturalBubbles,
  naturalIdleBubblesTimeline,
  prepareDiveBubbles,
} from "./bubbles";

/**
 * DiveTransition — pinned dive section (image_5.png).
 * "INTO THE TIDE..." rises, then dense water overlay + bubble surge,
 * then fades to reveal SceneOneHarbor (image_1.png).
 */
export function DiveTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const { setPhase } = useMotionComic();

  useComicGsap("dive-transition", () => {
    const root = sectionRef.current;
    if (!root) return;

    const title = root.querySelector<HTMLElement>(".dive__title");
    const surface = root.querySelector<HTMLElement>(".dive__surface");
    const idleHost = root.querySelector<HTMLElement>(".dive__idle-bubbles");
    const denseHost = root.querySelector<HTMLElement>(".dive__dense-bubbles");
    const harbor = document.querySelector<HTMLElement>("#scene-one-harbor");

    if (!title || !surface || !idleHost || !denseHost) return;

    idleHost.replaceChildren();
    denseHost.replaceChildren();

    /* ── Ambient bubbles while pinned ─────────────────────── */
    const ambientBubbles = createNaturalBubbles(idleHost, {
      count: 18,
      className: "natural-bubble natural-bubble--dive-idle",
      sizeRange: [4, 20],
      opacityRange: [0.08, 0.35],
    });
    naturalIdleBubblesTimeline(ambientBubbles, { speedMult: 0.85 });

    /* ── Dense dive field (scrub-driven) ──────────────────── */
    const denseBubbles = createNaturalBubbles(denseHost, {
      count: 48,
      className: "natural-bubble natural-bubble--dive-dense",
      sizeRange: [8, 52],
      opacityRange: [0.22, 0.6],
    });
    prepareDiveBubbles(denseBubbles);

    gsap.set(title, { yPercent: 120, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(surface, { yPercent: 100 });
    if (harbor) gsap.set(harbor, { opacity: 0.4 });

    const diveScrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onEnter: () => setPhase("dive"),
        onLeave: () => setPhase("narrative"),
        onEnterBack: () => setPhase("dive"),
      },
    });

    diveScrollTimeline
      // 0–45%: title emerges from bottom, covering leftover intro context
      .to(
        title,
        {
          yPercent: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      )
      // ~50%: rapid water-surface dive overlay (yPercent 100 → 0)
      .to(
        surface,
        {
          yPercent: 0,
          ease: "power1.in",
          duration: 0.35,
        },
        0.45,
      )
      // Dense bubbles surge upward + title scales out
      .to(
        denseBubbles,
        {
          opacity: 1,
          duration: 0.1,
          stagger: { each: 0.006, from: "random" },
        },
        0.48,
      )
      .to(
        denseBubbles,
        {
          y: (i) => -window.innerHeight * (0.75 + (i % 5) * 0.1),
          x: (i) => (i % 2 === 0 ? 1 : -1) * (28 + (i % 8) * 14),
          ease: "none",
          duration: 0.4,
        },
        0.5,
      )
      .to(
        title,
        {
          scale: 3.4,
          opacity: 0,
          filter: "blur(8px)",
          ease: "power1.in",
          duration: 0.35,
        },
        0.5,
      )
      // Reveal: fade overlay → harbor (image_1) behind
      .to(
        surface,
        { opacity: 0, duration: 0.2, ease: "power1.in" },
        0.82,
      )
      .to(
        ".dive__stage",
        { opacity: 0, duration: 0.15 },
        0.85,
      );

    if (harbor) {
      diveScrollTimeline.to(
        harbor,
        { opacity: 1, duration: 0.22, ease: "power1.out" },
        0.84,
      );
    }
  }, [setPhase]);

  return (
    <section
      ref={sectionRef}
      id="dive-transition"
      className="dive-transition relative h-[100dvh] w-full overflow-hidden"
      aria-label="Dive Transition: Into the Tide"
    >
      <div className="dive__stage absolute inset-0">
        {/* Clean deep blue — image_5.png tone */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#041428_0%,#0a2a4a_40%,#0d3d5c_65%,#071828_100%)]" />

        <div
          className="dive__idle-bubbles pointer-events-none absolute inset-0 z-[2] overflow-hidden"
          aria-hidden
        />

        <h2 className="dive__title absolute inset-0 z-[3] flex items-center justify-center px-6 text-center font-[family-name:var(--font-tide)] text-[clamp(2.5rem,8vw,6.5rem)] tracking-[0.08em] text-white uppercase will-change-transform">
          INTO THE TIDE...
        </h2>
      </div>

      <div
        className="dive__dense-bubbles pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden
      />

      {/* Full-screen water texture overlay — placeholder for real asset */}
      <div
        className="dive__surface absolute inset-0 z-20 will-change-transform"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#5ec4d8]/90 via-[#0e5a72]/95 to-[#041828]" />
        <div className="absolute top-0 right-0 left-0 h-24 bg-[linear-gradient(180deg,rgba(200,240,255,0.55),transparent)]" />
        <div className="asset-placeholder absolute inset-0 opacity-35 mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent_16px,rgba(255,255,255,0.05)_18px,transparent_22px)]">
          Water Surface Texture (image_5)
        </div>
      </div>
    </section>
  );
}
