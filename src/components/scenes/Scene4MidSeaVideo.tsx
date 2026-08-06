"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Scene4MidSeaVideo — mid-sea panel (presentational + idle rock).
 *
 * Scrubbed phases (fade → sail → bubble) are owned by HarborSeaSequence
 * so they share one pin with the Scene 3 → 4 horizontal wipe.
 *
 * This component keeps:
 *  • Looping video
 *  • Layered boat + bubble DOM
 *  • Continuous idle rocking (parallel, not scrubbed)
 */
export function Scene4MidSeaVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.play().catch(() => {});
    };
    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const boat = section.querySelector<HTMLElement>(".gutom-and-boat");
      if (!boat) return;

      gsap.set(boat, { transformOrigin: "50% 85%" });

      /**
       * Idle rocking — independent of scroll.
       * Composes with scrubbed xPercent / opacity from HarborSeaSequence.
       */
      gsap.to(boat, {
        y: "random(-10, 10, 5)",
        rotation: "random(-1.5, 1.5, 0.5)",
        duration: 0.55,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-4-mid-sea"
      className="relative h-full w-screen shrink-0 overflow-hidden bg-[#061828]"
      aria-label="Scene 4: Mid-Sea Journey"
    >
      {/* Layer 1 — looping video */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/assets/scene4-sailing-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      />

      {/*
        Layer 2 — boat starts on the FAR LEFT (Phase 1 fade-in).
        HarborSeaSequence scrubs xPercent 0 → 145 (Phase 2, +50% vs prior 95).
        Bubble is nested under the boat (follows X) and fades at phase-sail-done.
      */}
      <div className="gutom-and-boat absolute bottom-[6%] left-0 z-20 h-[min(48vh,420px)] w-[min(58vw,540px)] will-change-[opacity,transform] md:bottom-[8%] md:h-[min(52vh,460px)] md:w-[min(52vw,560px)]">
        <Image
          src="/assets/scene-4-char.png"
          alt="Captain Gutom sailing"
          fill
          sizes="(max-width: 768px) 58vw, 560px"
          className="object-contain object-left-bottom"
          priority
        />

        {/* Layer 3 — bubble; stays opacity 0 until Phase 3 */}
        <div className="bubble-chat absolute top-[-2%] left-[20%] z-30 h-[min(18vh,140px)] w-[min(46%,260px)] will-change-[opacity,transform] md:left-[24%]">
          <Image
            src="/assets/scene-4-bubble-chat.png"
            alt="Perfect spot. Right on the edge of the shelf."
            fill
            sizes="260px"
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
}
