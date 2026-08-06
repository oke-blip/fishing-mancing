"use client";

import { useEffect, useRef } from "react";

/**
 * Scene1VideoIntro — full-viewport looping video.
 * Pauses when off-screen to reduce mobile decoder load.
 */
export function Scene1VideoIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const playSafe = () => {
      video.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playSafe();
        else video.pause();
      },
      { threshold: 0.15 },
    );

    io.observe(section);
    playSafe();

    return () => io.disconnect();
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
        preload="metadata"
        aria-hidden
      />
    </section>
  );
}
