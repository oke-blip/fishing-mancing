"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Scene3Harbor } from "./Scene3Harbor";
import { Scene4MidSeaVideo } from "./Scene4MidSeaVideo";

gsap.registerPlugin(ScrollTrigger);

/**
 * HarborSeaSequence — vertical scroll → horizontal wipe Scene 3 → 4,
 * then Scene 4 scrubbed sail timeline.
 *
 * Timeline (scrub: true, single pin):
 *  1. Harbor: captain fade / slide into hull
 *  2. Wipe: track xPercent 0 → -50 (Scene 4 slides in from the right)
 *  3. Phase 1: boat fades in on the left (opacity 0 → 1, xPercent 0)
 *  4. Phase 2: boat sails left → far-right (xPercent 0 → 145, +50% vs 95)
 *  5. Phase 3: bubble fades in only after that extended stop
 *
 * Idle boat rock runs in Scene4MidSeaVideo (parallel, not scrubbed).
 */
export function HarborSeaSequence() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const track = root.querySelector<HTMLElement>(".harbor-sea-track");
      const captain = root.querySelector<HTMLElement>(".captain-gutom");
      const boat = root.querySelector<HTMLElement>(".gutom-and-boat");
      const bubble = root.querySelector<HTMLElement>(".bubble-chat");
      const seaVideo = root.querySelector<HTMLVideoElement>(
        "#scene-4-mid-sea video",
      );

      if (!track || !captain || !boat || !bubble) return;

      gsap.set(captain, { opacity: 0, xPercent: -30 });
      gsap.set(track, { xPercent: 0 });
      // Phase 1 start: far left, invisible
      gsap.set(boat, { opacity: 0, xPercent: 0 });
      gsap.set(bubble, { opacity: 0, yPercent: 8 });

      const sequenceTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=480%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          snap: {
            snapTo: "labelsDirectional",
            duration: 0.45,
            delay: 0.05,
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            if (self.progress > 0.28 && seaVideo && seaVideo.paused) {
              seaVideo.muted = true;
              seaVideo.play().catch(() => {});
            }
          },
        },
      });

      sequenceTl
        /* ── Scene 3 harbor — keep panel readable before wipe ─ */
        .addLabel("harbor-start")
        .to(
          captain,
          {
            opacity: 1,
            xPercent: 0,
            ease: "power2.out",
            duration: 0.28,
          },
          "harbor-start",
        )
        .addLabel("harbor-ready")
        .to({}, { duration: 0.18 })

        /* ── Horizontal wipe → Scene 4 ────────────────────── */
        .addLabel("wipe-start")
        .to(
          track,
          {
            xPercent: -50,
            ease: "none",
            duration: 0.22,
          },
          "wipe-start",
        )
        .addLabel("sea-locked")

        /* ── Phase 1: fade in on the left ─────────────────── */
        .addLabel("phase-fade")
        .to(
          boat,
          {
            opacity: 1,
            ease: "power1.out",
            duration: 0.16,
          },
          "phase-fade",
        )
        .addLabel("phase-fade-done")

        /* ── Phase 2: sail left → far-right edge ──────────────
         * Prior stop: xPercent 95 (distance 95 from origin).
         * +50% travel → ~142.5; use 145 so the boat sits near the
         * far-right frame edge while a portion stays visible.
         * Bubble is a child of .gutom-and-boat → tracks this X.
         */
        .addLabel("phase-sail")
        .to(
          boat,
          {
            xPercent: 145,
            ease: "none",
            duration: 0.55,
          },
          "phase-sail",
        )
        .addLabel("phase-sail-done")

        /* ── Phase 3: bubble ONLY after the extended sail ends ─ */
        .to(
          bubble,
          {
            opacity: 1,
            yPercent: 0,
            ease: "power2.out",
            duration: 0.12,
          },
          "phase-sail-done",
        )
        .addLabel("dialogue-hold");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="harbor-sea-sequence"
      className="landscape-stage relative w-full overflow-hidden"
      aria-label="Harbor to Mid-Sea"
    >
      <div className="harbor-sea-track flex h-full w-[200vw] will-change-transform">
        <Scene3Harbor />
        <Scene4MidSeaVideo />
      </div>
    </section>
  );
}
