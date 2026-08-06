"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PX_PER_VIDEO_SECOND = 1000;
const LERP = 0.1;
const SEEK_EPSILON = 0.01;

type ScrubbedVideoSceneProps = {
  id: string;
  src: string;
  ariaLabel: string;
  loadingLabel?: string;
  errorLabel?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Shared ultra-smooth scroll-scrubbed video panel (Scene 6/7/8 pattern).
 *
 * • Dynamic height = duration × 1000px after loadedmetadata
 * • ScrollTrigger animates playhead.time (scrub: 1), NOT currentTime
 * • gsap.ticker lerps video.currentTime → playhead.time at ~60fps
 */
export function ScrubbedVideoScene({
  id,
  src,
  ariaLabel,
  loadingLabel = "Loading…",
  errorLabel = "Unable to load video.",
  className = "bg-[#02080f]",
}: ScrubbedVideoSceneProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [metaReady, setMetaReady] = useState(false);
  const [metaError, setMetaError] = useState(false);

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const panel = panelRef.current;
    const video = videoRef.current;
    if (!scrollContainer || !panel || !video) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;
    let tickerFn: ((time: number, deltaTime: number, frame: number) => void) | null =
      null;

    const bindScrollVideo = () => {
      if (cancelled || !video.duration || Number.isNaN(video.duration)) return;

      setMetaReady(true);
      video.pause();
      video.currentTime = 0;

      scrollContainer.style.height = `${video.duration * PX_PER_VIDEO_SECOND}px`;

      const playhead = { time: 0 };

      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx?.revert();

      ctx = gsap.context(() => {
        gsap.to(playhead, {
          time: video.duration,
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainer,
            start: "top top",
            end: "bottom bottom",
            pin: panel,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, scrollContainer);

      tickerFn = () => {
        if (!video || cancelled) return;
        const diff = playhead.time - video.currentTime;
        if (Math.abs(diff) > SEEK_EPSILON) {
          video.currentTime += diff * LERP;
        }
      };

      gsap.ticker.add(tickerFn);
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
      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx?.revert();
      scrollContainer.style.height = "";
    };
  }, [src]);

  return (
    <div
      ref={scrollContainerRef}
      id={id}
      className={`relative z-20 w-full ${className}`}
      aria-label={ariaLabel}
    >
      <section
        ref={panelRef}
        className={`relative h-screen w-screen overflow-hidden ${className}`}
      >
        {!metaReady && !metaError && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center ${className}`}
          >
            <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.35em] text-sea-foam/50 uppercase">
              {loadingLabel}
            </p>
          </div>
        )}
        {metaError && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center ${className}`}
          >
            <p className="font-[family-name:var(--font-body)] text-sm text-white/70">
              {errorLabel}
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      </section>
    </div>
  );
}
