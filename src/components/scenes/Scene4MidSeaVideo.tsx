"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Scene4MidSeaVideo — mid-sea panel (presentational + idle rock on desktop).
 * Mobile: no continuous rock (GPU thrash); video preloads fully when mounted.
 */
export function Scene4MidSeaVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = "auto";

    const tryPlay = () => {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    };

    const onCanPlay = () => tryPlay();
    video.addEventListener("canplay", onCanPlay);
    tryPlay();

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isTouch =
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    // Continuous random rock stutters scroll-linked transforms on mobile
    if (isTouch) return;

    const ctx = gsap.context(() => {
      const boat = section.querySelector<HTMLElement>(".gutom-and-boat");
      if (!boat) return;

      gsap.set(boat, { transformOrigin: "50% 85%" });
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
      className="relative h-full w-full min-w-[100%] shrink-0 overflow-hidden bg-[#061828] sm:w-[100dvw]"
      aria-label="Scene 4: Mid-Sea Journey"
    >
      <video
        ref={videoRef}
        className="landscape-stage__media absolute inset-0 z-0"
        src="/assets/scene4-sailing-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        data-auto-unlock="true"
        preload="auto"
        aria-hidden
      />

      <div className="gutom-and-boat absolute bottom-[6%] left-0 z-20 h-[min(48vh,420px)] w-[min(58vw,540px)] md:bottom-[8%] md:h-[min(52vh,460px)] md:w-[min(52vw,560px)]">
        <Image
          src="/assets/scene-4-char.png"
          alt="Captain Gutom sailing"
          fill
          sizes="(max-width: 768px) 58vw, 560px"
          className="object-contain object-left-bottom"
          priority
        />

        <div className="bubble-chat absolute top-[-2%] left-[20%] z-30 h-[min(18vh,140px)] w-[min(46%,260px)] md:left-[24%]">
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
