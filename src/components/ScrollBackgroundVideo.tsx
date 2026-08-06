"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Placeholder — replace with your background MP4 under /public/assets/
 * Examples once copied: "/assets/scene5-deep-sea.mp4", "/assets/scene6-monster.mp4"
 */
export const BACKGROUND_VIDEO_SRC = "/assets/YOUR_BACKGROUND_VIDEO.mp4";

type Props = {
  children: ReactNode;
  /** Path under /public — leave placeholder until you drop in the final file */
  src?: string;
  /**
   * Minimum total scroll length in viewport heights (default 8 ≈ 800vh).
   * Extra height is appended AFTER children so comic panel flow stays intact.
   */
  minViewportHeights?: number;
};

/**
 * Wrapper-level scroll background:
 *  • Fixed full-screen video at z-index: -1 (behind comic)
 *  • GSAP scrub: 2 on currentTime after loadedmetadata
 *  • Optional post-comic scroll extender only — never inserts space between panels
 */
export function ScrollBackgroundVideo({
  children,
  src = BACKGROUND_VIDEO_SRC,
  minViewportHeights = 8,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const extenderRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const initScrub = () => {
    const video = videoRef.current;
    const content = contentRef.current;
    const extender = extenderRef.current;
    if (!video || !content || !extender) return;
    if (!video.duration || Number.isNaN(video.duration)) return;

    video.pause();
    video.currentTime = 0;

    // Reset extender before measuring comic height
    extender.style.height = "0px";
    const comicHeight = content.offsetHeight;
    const minPx =
      (window.visualViewport?.height ?? window.innerHeight) * minViewportHeights;
    extender.style.height = `${Math.max(0, minPx - comicHeight)}px`;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.to(video, {
        currentTime: video.duration,
        ease: "none",
        scrollTrigger: {
          // Scrub across the full page (comic + optional extender)
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });
    });

    ScrollTrigger.refresh();
  };

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) {
      initScrub();
    }

    const onResize = () => {
      if (videoRef.current?.duration) initScrub();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctxRef.current?.revert();
      ctxRef.current = null;
      if (extenderRef.current) extenderRef.current.style.height = "0px";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, minViewportHeights]);

  return (
    /* isolate keeps z-index: -1 above the page chrome, still behind comic */
    <div className="relative isolate min-h-[100dvh]">
      {/* 1. Fixed background — behind all comic content */}
      <div
        className="pointer-events-none fixed overflow-hidden"
        style={{
          zIndex: -1,
          top: "var(--app-top, 0px)",
          left: "var(--app-left, 0px)",
          width: "var(--app-width, 100svw)",
          height: "var(--app-height, 100svh)",
        }}
        aria-hidden
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          /* PLACEHOLDER: swap BACKGROUND_VIDEO_SRC or pass src= */
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={initScrub}
        />
      </div>

      {/* 2. Existing comic tree — untouched structure, stacked above video */}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>

      {/* 3. Post-comic extender only (0 until needed) */}
      <div
        ref={extenderRef}
        className="pointer-events-none relative z-10 w-full"
        style={{ height: 0 }}
        aria-hidden
      />
    </div>
  );
}
