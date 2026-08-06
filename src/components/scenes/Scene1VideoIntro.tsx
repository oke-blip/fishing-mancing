"use client";

import { useEffect, useRef } from "react";

/**
 * Scene1VideoIntro — full-viewport looping video.
 * No text overlays. Scrolls away naturally to reveal Scene 2.
 */
export function Scene1VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Muted autoplay can still fail after hydration — nudge play.
    video.play().catch(() => {
      /* Browser may require a gesture; muted + playsInline usually allows it */
    });
  }, []);

  return (
    <section
      id="scene-1-video-intro"
      className="landscape-stage relative w-full overflow-hidden bg-black"
      aria-label="Scene 1: Video Introduction"
    >
      {/*
        Placeholder source: replace /assets/intro-video-clean.mp4 with a
        master that has NO baked-in text or UI overlays.
      */}
      <video
        ref={videoRef}
        className="landscape-stage__media absolute inset-0"
        src="/assets/intro-video-clean.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
    </section>
  );
}
