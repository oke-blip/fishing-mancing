"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    // Replace with your final comic panel art when ready
    src: "/assets/scene7-panel1.jpg",
    label: "Panel 1 — Strike",
  },
  {
    src: "/assets/scene7-panel2.jpg",
    label: "Panel 2 — Thrash",
  },
  {
    src: "/assets/scene7-panel3.jpg",
    label: "Panel 3 — Hold On",
  },
] as const;

/**
 * Scene7ActionPanels — pinned horizontal comic strip.
 *
 * Vertical scroll pins the viewport; the inner 300vw track translates
 * left (xPercent: -66.66) so panels 1 → 2 → 3 read right-to-left.
 */
export function Scene7ActionPanels() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const track = section.querySelector<HTMLElement>(".scene-7__track");
      if (!track) return;

      gsap.to(track, {
        // 3 panels → slide by 2 panel widths = 66.66% of track width
        xPercent: -66.6667,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerWidth * (PANELS.length - 1)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-7-action-panels"
      className="relative h-screen w-screen overflow-hidden bg-comic-ink"
      aria-label="Scene 7: Action Panels"
    >
      <div className="scene-7__track flex h-full w-[300vw] will-change-transform">
        {PANELS.map((panel) => (
          <div
            key={panel.src}
            className="relative h-full w-screen shrink-0 overflow-hidden"
          >
            {/* Swap src paths above for final panel JPGs / layered PNGs */}
            <Image
              src={panel.src}
              alt={panel.label}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <span className="comic-label absolute top-5 left-5 z-10">
              {panel.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
