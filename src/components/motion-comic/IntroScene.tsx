"use client";

import { useRef } from "react";
import gsap from "gsap";

import { useComicGsap, useMotionComic } from "./MotionComicContext";
import {
  createNaturalBubbles,
  naturalIdleBubblesTimeline,
} from "./bubbles";

/**
 * IntroScene — standalone title card (image_0.png).
 * Idle: cape wind, boat bob, natural bubbles, water currents.
 * Scroll: whole composition scales down + fades (retreats into depth).
 */
export function IntroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const { setPhase } = useMotionComic();

  useComicGsap("intro-scene", () => {
    const root = sectionRef.current;
    if (!root) return;

    const bubbleHost = root.querySelector<HTMLElement>(".intro__bubbles");
    const currents = gsap.utils.toArray<HTMLElement>(".intro__current");
    const stage = root.querySelector(".intro__stage");
    const cape = root.querySelector(".intro__cape");
    const boat = root.querySelector(".intro__boat");

    if (!bubbleHost || !stage) return;

    bubbleHost.replaceChildren();

    /* ── Natural idle bubbles ─────────────────────────────── */
    const naturalIdleBubbles = createNaturalBubbles(bubbleHost, {
      count: 32,
      className: "natural-bubble natural-bubble--intro",
      sizeRange: [5, 30],
      opacityRange: [0.1, 0.45],
    });
    // Named to match spec — continuous yoyo/repeat rise + wave
    const naturalIdleBubblesTl = naturalIdleBubblesTimeline(naturalIdleBubbles);
    void naturalIdleBubblesTl;

    /* ── Water current / light distortion overlays ────────── */
    currents.forEach((layer, i) => {
      gsap.to(layer, {
        xPercent: i % 2 === 0 ? 5 : -6,
        yPercent: i % 2 === 0 ? -2.5 : 3,
        duration: 11 + i * 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(layer, {
        opacity: 0.12 + i * 0.04,
        duration: 3.5 + i,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    /* ── Cape / clothing wind ─────────────────────────────── */
    if (cape) {
      gsap.set(cape, { transformOrigin: "40% 10%" });
      gsap.to(cape, {
        skewX: 4,
        skewY: 1.5,
        rotation: 2.5,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    /* ── Boat bob ─────────────────────────────────────────── */
    if (boat) {
      gsap.to(boat, {
        y: 10,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    /* ── Scroll: retreat into the deep ────────────────────── */
    gsap
      .timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onLeave: () => setPhase("dive"),
          onEnterBack: () => setPhase("intro"),
        },
      })
      .to(
        stage,
        {
          scale: 0.35,
          opacity: 0,
          yPercent: 12,
          filter: "blur(4px)",
          ease: "power1.in",
          duration: 1,
        },
        0,
      );
  }, [setPhase]);

  return (
    <section
      ref={sectionRef}
      id="intro-scene"
      className="intro-scene relative h-screen w-full overflow-hidden"
      aria-label="Introduction: Captain Gutom The Old Salt and the Deep"
    >
      <div className="intro__stage absolute inset-0 origin-center will-change-transform">
        {/* Deep-sea landscape — swap for image_0.png layers */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#061428_0%,#0a3050_35%,#0c4a62_55%,#071a28_100%)]" />
        <div className="asset-placeholder absolute inset-x-0 top-0 h-[42%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(30,80,110,0.5),transparent_70%)]">
          BG: Deep Sea Landscape (image_0)
        </div>
        <div className="asset-placeholder absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#020a12] via-[#0a1e28]/90 to-transparent">
          FG: Ocean Floor Silhouette
        </div>

        {/* Water current overlays */}
        <div
          className="intro__current pointer-events-none absolute -inset-[12%] z-[1] opacity-20 mix-blend-screen"
          aria-hidden
        >
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_25%_35%,rgba(120,200,230,0.35),transparent_50%),radial-gradient(ellipse_at_75%_65%,rgba(50,130,170,0.28),transparent_45%)]" />
        </div>
        <div
          className="intro__current pointer-events-none absolute -inset-[14%] z-[1] opacity-15 mix-blend-soft-light"
          aria-hidden
        >
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_60%_20%,rgba(180,230,255,0.28),transparent_40%)]" />
        </div>

        {/* Monster in the depths */}
        <div className="intro__monster absolute bottom-[6%] left-[8%] z-[2] h-[36%] w-[42%] md:left-[12%]">
          <div className="asset-placeholder h-full w-full bg-gradient-to-r from-[#1a2820]/90 via-[#2a3830]/70 to-transparent">
            Monster Fish (image_0)
          </div>
          <div className="absolute top-[28%] left-[22%] h-3 w-3 rounded-full bg-[#f0c420] opacity-80 shadow-[0_0_16px_6px_rgba(240,196,32,0.45)]" />
        </div>

        {/* Boat + Captain Gutom + cape */}
        <div className="intro__boat absolute right-[6%] bottom-[18%] z-[3] h-[48%] w-[min(46vw,400px)] md:right-[10%]">
          <div className="intro__cape absolute top-[10%] right-[5%] bottom-[30%] left-[48%] origin-top will-change-transform">
            <div className="asset-placeholder h-full w-full rounded-bl-[45%] bg-gradient-to-br from-[#5a3a22] via-[#6b4423] to-[#3a2818]">
              Cape / Clothing
            </div>
          </div>
          <div className="asset-placeholder absolute inset-0 bg-gradient-to-b from-[#4a3a2a]/30 via-[#6b4423]/85 to-[#2a3038]">
            Captain Gutom + Boat (image_0)
          </div>
        </div>

        {/* Natural bubbles host */}
        <div
          className="intro__bubbles pointer-events-none absolute inset-0 z-[4] overflow-hidden"
          aria-hidden
        />

        {/* Title block */}
        <div className="intro__title absolute inset-x-0 top-[10%] z-[5] flex flex-col items-center px-6 text-center md:top-[12%]">
          <p className="mb-2 font-[family-name:var(--font-body)] text-[0.65rem] font-semibold tracking-[0.4em] text-sea-foam/80 uppercase md:text-xs">
            A Motion Comic
          </p>
          <h1 className="max-w-4xl font-[family-name:var(--font-tide)] text-[clamp(1.75rem,5.5vw,4.25rem)] leading-[1.05] font-normal tracking-[0.06em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            CAPTAIN GUTOM
            <br />
            THE OLD SALT AND THE DEEP
          </h1>
          <p className="mt-4 max-w-md font-[family-name:var(--font-body)] text-sm leading-relaxed text-white/75 md:text-base">
            One last cast beyond the shelf — where the water goes black and
            something older than nets is waiting.
          </p>
        </div>
      </div>
    </section>
  );
}
