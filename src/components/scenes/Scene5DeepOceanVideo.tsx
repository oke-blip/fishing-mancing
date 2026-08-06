"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** 1 second of video ≈ this many pixels of scroll (higher = slower) */
const PX_PER_VIDEO_SECOND = 1000;

/**
 * Scene5DeepOceanVideo — ultra-slow, smooth scroll-scrubbed deep-ocean clip.
 *
 * After loadedmetadata, scroll height = duration × 1000px (no fixed vh).
 * scrub: 1.5 eases the playhead toward scroll for buttery catch-up.
 */
export function Scene5DeepOceanVideo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [metaReady, setMetaReady] = useState(false);
  const [metaError, setMetaError] = useState(false);

  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current;
    const panel = panelRef.current;
    const video = videoRef.current;
    if (!scrollContainer || !panel || !video) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const bindScrollVideo = () => {
      if (cancelled || !video.duration || Number.isNaN(video.duration)) return;

      setMetaReady(true);
      video.pause();
      video.currentTime = 0;

      /**
       * Dynamic spacer — maps 1s of footage to 1000px of scrolling.
       * A normal wheel notch only advances a fraction of a second.
       */
      scrollContainer.style.height = `${video.duration * PX_PER_VIDEO_SECOND}px`;

      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.set(panel, { opacity: 0 });

        /**
         * Sticky panel stays in view while the tall spacer scrolls.
         * scrub: 1.5 = smooth lag (playhead eases toward scroll position).
         *
         * 0–20%  fade-in
         * 20–100% currentTime 0 → duration
         */
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scrollContainer,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          })
          .to(
            panel,
            {
              opacity: 1,
              ease: "none",
              duration: 0.2,
            },
            0,
          )
          .to(
            video,
            {
              currentTime: video.duration,
              ease: "none",
              duration: 0.8,
            },
            0.2,
          );
      }, scrollContainer);

      ScrollTrigger.refresh();
    };

    const onLoaded = () => bindScrollVideo();
    const onError = () => setMetaError(true);

    if (video.readyState >= 1) {
      bindScrollVideo();
    } else {
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      ctx?.revert();
      scrollContainer.style.height = "";
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      id="scene-5-deep-ocean"
      className="relative z-20 w-full bg-[#020b14]"
      aria-label="Scene 5: Deep Ocean"
    >
      {/* Sticky viewport — in view for the full dynamic scroll height */}
      <section
        ref={panelRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#020b14]"
      >
        {!metaReady && !metaError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020b14]">
            <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.35em] text-sea-foam/50 uppercase">
              Descending…
            </p>
          </div>
        )}
        {metaError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020b14]">
            <p className="font-[family-name:var(--font-body)] text-sm text-white/70">
              Unable to load deep-sea video.
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/scene5-deep-sea.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      </section>
    </div>
  );
}
