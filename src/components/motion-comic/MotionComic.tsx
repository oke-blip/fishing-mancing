"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MotionComicProvider, useComicGsap } from "./MotionComicContext";
import { IntroScene } from "./IntroScene";
import { DiveTransition } from "./DiveTransition";
import { SceneOneHarbor } from "./SceneOneHarbor";
import { Scene2Depths } from "./Scene2Depths";
import { Scene3Bite } from "./Scene3Bite";
import { Scene4Struggle } from "./Scene4Struggle";

/**
 * NarrativeScenes — harbor + depths + bite + struggle (Scenes 1–4).
 * Animations register into the shared MotionComic gsap.context().
 */
function NarrativeScenes() {
  useComicGsap("narrative-scenes", () => {
    /* ─────────────────────────────────────────
     * SCENE 1 — Horizontal dock → sea → cast
     * ───────────────────────────────────────── */
    const track1 = document.querySelector(".scene-1__track");
    const panels1 = gsap.utils.toArray<HTMLElement>(
      ".scene-1__track > .comic-panel",
    );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#scene-1",
          start: "top top",
          end: () => `+=${window.innerWidth * Math.max(panels1.length, 1)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(track1, {
        xPercent: -100 * (panels1.length - 1),
        ease: "none",
        duration: 1,
      })
      .to(".scene-1__boat", { xPercent: 18, ease: "none", duration: 0.33 }, 0)
      .to(
        ".scene-1__boat-sail",
        { xPercent: 28, ease: "none", duration: 0.34 },
        0.33,
      )
      .to(".scene-1__sea", { xPercent: -8, ease: "none", duration: 0.34 }, 0.33)
      .to(".scene-1__bubble-a", { opacity: 1, y: -8, duration: 0.08 }, 0.08)
      .to(".scene-1__bubble-b", { opacity: 1, y: -8, duration: 0.08 }, 0.4)
      .to(
        ".scene-1__sfx-vroom",
        { opacity: 1, scale: 1.05, duration: 0.08 },
        0.45,
      )
      .to(".scene-1__bubble-c", { opacity: 1, y: -8, duration: 0.08 }, 0.72)
      .to(
        ".scene-1__sfx-whoosh",
        { opacity: 1, scale: 1.1, duration: 0.06 },
        0.8,
      )
      .to(
        ".scene-1__jig",
        {
          x: -180,
          y: 420,
          rotation: 480,
          scale: 0.6,
          ease: "power2.in",
          duration: 0.18,
        },
        0.78,
      );

    gsap.to(".scene-1__boat, .scene-1__boat-sail, .scene-1__boat-cast", {
      y: 10,
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    /* ─────────────────────────────────────────
     * SCENE 2 — Vertical sink
     * ───────────────────────────────────────── */
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".scene-2__column",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .to(".scene-2__layers", { yPercent: -50, ease: "none", duration: 1 }, 0)
      .to(
        ".scene-2__jig",
        {
          y: () => window.innerHeight * 0.55,
          rotation: 360,
          ease: "none",
          duration: 1,
        },
        0,
      )
      .to(".scene-2__sfx-twirl", { opacity: 1, duration: 0.08 }, 0.15)
      .to(".scene-2__sfx-twirl", { opacity: 0, duration: 0.08 }, 0.45)
      .to(".scene-2__eye", { opacity: 1, scale: 1.15, duration: 0.12 }, 0.55)
      .to(
        ".scene-2__monster",
        { xPercent: -45, opacity: 1, ease: "power2.out", duration: 0.2 },
        0.78,
      )
      .to(".scene-2__bubble", { opacity: 1, scale: 1.05, duration: 0.1 }, 0.9);

    gsap.to(".scene-2__fish-school", {
      x: 120,
      duration: 4.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    gsap.to(".scene-2__fish", {
      y: "+=6",
      duration: 1.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.15,
    });
    gsap.to(".scene-2__rays", {
      opacity: 0.35,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    gsap.to(".scene-2__distortion", {
      opacity: 0.18,
      duration: 1.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    gsap.to(".scene-2__eye", {
      boxShadow: "0 0 36px 14px rgba(240,196,32,0.75)",
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    /* ─────────────────────────────────────────
     * SCENE 3 — Pinned bite
     * ───────────────────────────────────────── */
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#scene-3",
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      })
      .to(
        ".scene-3__bubble-roar",
        { opacity: 1, scale: 1.05, duration: 0.1 },
        0.05,
      )
      .to(
        ".scene-3__sfx-crunch",
        { opacity: 1, scale: 1.2, rotation: -6, duration: 0.1 },
        0.2,
      )
      .to(
        ".scene-3__sfx-snap",
        { opacity: 1, scale: 1.15, rotation: 4, duration: 0.08 },
        0.35,
      )
      .to(
        ".scene-3__sfx-strain",
        { opacity: 1, scale: 1.25, duration: 0.1 },
        0.5,
      )
      .fromTo(
        ".scene-3__line",
        { scaleY: 0.4, rotate: -8 },
        { scaleY: 1, rotate: 2, duration: 0.15, ease: "power3.out" },
        0.55,
      )
      .to(".scene-3__bubble-hold", { opacity: 1, duration: 0.1 }, 0.65)
      .to(
        ".scene-3__sfx-bend",
        { opacity: 1, scale: 1.15, duration: 0.1 },
        0.78,
      )
      .to(".scene-3__gutom", { x: 8, y: -6, rotation: -2, duration: 0.2 }, 0.55)
      .to(
        ".scene-3__monster",
        { x: 12, y: 6, duration: 0.25, ease: "sine.inOut" },
        0.2,
      );

    gsap.to(".scene-3__monster", {
      x: "+=6",
      duration: 0.35,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    /* ─────────────────────────────────────────
     * SCENE 4 — Horizontal leap + freeze
     * ───────────────────────────────────────── */
    const track4 = document.querySelector(".scene-4__track");
    const panels4 = gsap.utils.toArray<HTMLElement>(
      ".scene-4__track > .comic-panel",
    );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#scene-4",
          start: "top top",
          end: () =>
            `+=${window.innerWidth * (Math.max(panels4.length, 1) + 0.6)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .to(track4, {
        xPercent: -100 * (panels4.length - 1),
        ease: "none",
        duration: 1,
      })
      .fromTo(
        ".scene-4__monster",
        { yPercent: 35, scale: 0.85 },
        { yPercent: -8, scale: 1.08, ease: "power2.out", duration: 0.35 },
        0.05,
      )
      .fromTo(
        ".scene-4__splash",
        { scale: 0.4, opacity: 0.9 },
        { scale: 1.6, opacity: 0, ease: "power1.out", duration: 0.4 },
        0.12,
      )
      .to(
        ".scene-4__sfx-whoosh",
        { opacity: 1, scale: 1.1, duration: 0.08 },
        0.1,
      )
      .to(".scene-4__sfx-thrash", { opacity: 1, duration: 0.08 }, 0.18)
      .to(".scene-4__bubble-monster", { opacity: 1, duration: 0.1 }, 0.25)
      .to(
        ".scene-4__gutom-panel",
        { scale: 1.18, transformOrigin: "60% 35%", duration: 0.35 },
        0.55,
      )
      .to(".scene-4__sfx-creak", { opacity: 1, duration: 0.08 }, 0.62)
      .to(".scene-4__bubble-gutom", { opacity: 1, duration: 0.1 }, 0.7)
      .to(
        ".scene-4__freeze",
        {
          opacity: 1,
          backgroundColor: "rgba(13,13,13,0.72)",
          duration: 0.2,
        },
        0.88,
      );

    ScrollTrigger.matchMedia({
      "(orientation: landscape)": () => {
        /* Primary desktop / landscape experience */
      },
    });
  });

  return (
    <>
      <SceneOneHarbor />
      <Scene2Depths />
      <Scene3Bite />
      <Scene4Struggle />
    </>
  );
}

/**
 * MotionComic — Intro → Dive → Narrative, under one MotionComicProvider.
 */
export function MotionComic() {
  return (
    <MotionComicProvider>
      <IntroScene />
      <DiveTransition />
      <NarrativeScenes />
    </MotionComicProvider>
  );
}
