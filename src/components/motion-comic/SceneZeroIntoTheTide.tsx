"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  animateIdleBubbles,
  prepareDiveBubbles,
  spawnBubbles,
} from "./bubbles";

gsap.registerPlugin(ScrollTrigger);

/**
 * SceneZeroIntoTheTide — cinematic deep-water intro.
 *
 * Idle (JS/GSAP): floating wavy bubbles + slow water-current overlays.
 * Scroll (scrub): title scales out, dense bubble field + surface overlay
 * rises to cover the viewport, then fades to reveal SceneOneHarbor.
 */
export function SceneZeroIntoTheTide() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const idleLayer = root.querySelector<HTMLElement>(".scene-zero__idle-bubbles");
    const diveLayer = root.querySelector<HTMLElement>(".scene-zero__dive-bubbles");
    const title = root.querySelector<HTMLElement>(".scene-zero__title");
    const surface = root.querySelector<HTMLElement>(".scene-zero__surface");
    const currents = gsap.utils.toArray<HTMLElement>(".scene-zero__current");
    const harbor = document.querySelector<HTMLElement>("#scene-one-harbor");

    if (!idleLayer || !diveLayer || !title || !surface) return;

    const ctx = gsap.context(() => {
      /* ── Idle bubbles (continuous) ───────────────────────── */
      const idleBubbles = spawnBubbles(idleLayer, {
        count: 28,
        className: "tide-bubble tide-bubble--idle",
        sizeRange: [5, 26],
        opacityRange: [0.1, 0.42],
      });
      animateIdleBubbles(idleBubbles);

      /* ── Idle water currents / light distortion ──────────── */
      currents.forEach((layer, i) => {
        gsap.to(layer, {
          xPercent: i % 2 === 0 ? 4 : -5,
          yPercent: i % 2 === 0 ? -3 : 2.5,
          duration: 10 + i * 3.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(layer, {
          opacity: i === 0 ? 0.22 : 0.14,
          duration: 4 + i * 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      /* ── Dive bubble field (scroll-linked) ───────────────── */
      const diveBubbles = spawnBubbles(diveLayer, {
        count: 42,
        className: "tide-bubble tide-bubble--dive",
        sizeRange: [8, 48],
        opacityRange: [0.2, 0.55],
      });
      prepareDiveBubbles(diveBubbles);

      gsap.set(surface, { yPercent: 100 });
      gsap.set(title, { transformOrigin: "50% 50%" });
      if (harbor) gsap.set(harbor, { opacity: 0.35 });

      /* ── Scroll: dive deeper ─────────────────────────────── */
      const diveTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      diveTl
        // Title scales up dramatically and fades — overwhelmed by depth
        .to(
          title,
          {
            scale: 3.2,
            opacity: 0,
            filter: "blur(6px)",
            ease: "power1.in",
            duration: 0.45,
          },
          0,
        )
        // Dense bubble field surges upward during scrub
        .to(
          diveBubbles,
          {
            opacity: 1,
            duration: 0.12,
            stagger: { each: 0.008, from: "random" },
          },
          0.05,
        )
        .to(
          diveBubbles,
          {
            y: (i) => -window.innerHeight * (0.7 + (i % 5) * 0.12),
            x: (i) => (i % 2 === 0 ? 1 : -1) * (30 + (i % 7) * 12),
            ease: "none",
            duration: 0.7,
          },
          0.08,
        )
        // Water-surface filter rises from bottom → full cover
        .to(
          surface,
          { yPercent: 0, ease: "none", duration: 0.55 },
          0.2,
        )
        // Stage fades; harbor decks fade in behind the clearing overlay
        .to(
          ".scene-zero__stage",
          { opacity: 0, duration: 0.2, ease: "power1.in" },
          0.72,
        )
        .to(
          surface,
          { opacity: 0, duration: 0.22, ease: "power1.in" },
          0.78,
        );

      if (harbor) {
        diveTl.to(harbor, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0.75);
      }
    }, root);

    return () => {
      ctx.revert();
      // Remove spawned nodes so remounts don't stack
      idleLayer.replaceChildren();
      diveLayer.replaceChildren();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="scene-zero"
      className="scene-zero relative h-screen w-full overflow-hidden"
      aria-label="Scene 0: Into the Tide"
    >
      {/* Deep immersive blue — tone of image_5.png */}
      <div className="scene-zero__stage absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#041428_0%,#0a2a4a_38%,#0d3d5c_62%,#071828_100%)]" />

        {/* Placeholder: swap for a real caustic / water-texture PNG */}
        <div
          className="scene-zero__current absolute -inset-[12%] opacity-25 mix-blend-screen"
          aria-hidden
        >
          <div className="asset-placeholder h-full w-full bg-[radial-gradient(ellipse_at_20%_30%,rgba(120,200,230,0.35),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(60,140,180,0.25),transparent_45%)]" />
        </div>
        <div
          className="scene-zero__current absolute -inset-[15%] opacity-20 mix-blend-soft-light"
          aria-hidden
        >
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_70%_20%,rgba(180,230,255,0.3),transparent_40%),radial-gradient(ellipse_at_30%_80%,rgba(40,120,160,0.35),transparent_50%)]" />
        </div>
        <div
          className="scene-zero__current absolute -inset-[10%] opacity-15"
          aria-hidden
        >
          <div className="h-full w-full bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)]" />
        </div>

        {/* Idle bubble host — filled by spawnBubbles() */}
        <div
          className="scene-zero__idle-bubbles pointer-events-none absolute inset-0 z-[2] overflow-hidden"
          aria-hidden
        />

        {/* Centered title — Impact-like display */}
        <h1 className="scene-zero__title absolute inset-0 z-[3] flex items-center justify-center px-6 text-center font-[family-name:var(--font-tide)] text-[clamp(2.5rem,8vw,6.5rem)] font-black tracking-[0.08em] text-white uppercase will-change-transform">
          INTO THE TIDE...
        </h1>
      </div>

      {/* Dive bubble host — denser field during scrub */}
      <div
        className="scene-zero__dive-bubbles pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden
      />

      {/* Water-surface filter overlay — rises yPercent 100 → 0 */}
      <div
        className="scene-zero__surface absolute inset-0 z-20 will-change-transform"
        aria-hidden
      >
        {/* Placeholder for real wavy water-surface texture asset */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5ec4d8]/90 via-[#0e5a72]/95 to-[#041828]" />
        <div className="absolute top-0 right-0 left-0 h-20 bg-[linear-gradient(180deg,rgba(200,240,255,0.55),transparent)]" />
        <div className="asset-placeholder absolute inset-0 opacity-40 mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent_18px,rgba(255,255,255,0.04)_19px,transparent_22px)]" />
      </div>
    </section>
  );
}
