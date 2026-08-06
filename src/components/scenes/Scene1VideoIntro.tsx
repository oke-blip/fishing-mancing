"use client";

import { useEffect, useRef } from "react";

/**
 * Scene1VideoIntro — looping intro. Always loads src; unlocks play on gesture.
 */
export function Scene1VideoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.dataset.autoUnlock = "true";
    video.preload = "auto";

    const playSafe = () => {
      video.muted = true;
      video.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playSafe();
        else video.pause();
      },
      { threshold: 0.1 },
    );

    io.observe(section);
    playSafe();

    const onGesture = () => playSafe();
    window.addEventListener("touchstart", onGesture, { passive: true, once: true });

    return () => {
      io.disconnect();
      window.removeEventListener("touchstart", onGesture);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-1-video-intro"
      className="landscape-stage relative w-full overflow-hidden bg-black"
      aria-label="Scene 1: Video Introduction"
    >
      <video
        ref={videoRef}
        className="landscape-stage__media absolute inset-0"
        src="/assets/intro-video-clean.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        data-auto-unlock="true"
        aria-hidden
      />
    </section>
  );
}
