"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createDiscreteVideoScrub,
  getPxPerVideoSecond,
} from "./discreteVideoScrub";

gsap.registerPlugin(ScrollTrigger);

type ScrubbedVideoSceneProps = {
  id: string;
  src: string;
  ariaLabel: string;
  loadingLabel?: string;
  errorLabel?: string;
  className?: string;
};

/**
 * Scroll-scrubbed video with discrete seeks.
 * Lazy-activates near the viewport so mobile browsers can actually load scenes.
 */
export function ScrubbedVideoScene({
  id,
  src,
  ariaLabel,
  loadingLabel = "Loading…",
  errorLabel = "Unable to load video.",
  className = "bg-[#02080f]",
}: ScrubbedVideoSceneProps) {
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Activate (assign src / load) when near viewport — critical on mobile bandwidth
  useEffect(() => {
    const spacer = scrollSpacerRef.current;
    if (!spacer) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "120% 0px", threshold: 0.01 },
    );

    io.observe(spacer);
    return () => io.disconnect();
  }, []);

  const setupScrub = () => {
    const spacer = scrollSpacerRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    if (!spacer || !pin || !video) return;
    if (!video.duration || Number.isNaN(video.duration) || video.duration === Infinity)
      return;

    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }

    spacer.style.height = `${video.duration * getPxPerVideoSecond()}px`;
    setReady(true);
    setFailed(false);

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      createDiscreteVideoScrub({
        trigger: spacer,
        pin,
        video,
      });
    }, spacer);

    ScrollTrigger.refresh();
  };

  useLayoutEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;

    // Ensure mobile starts the fetch
    video.load();

    if (video.readyState >= 1) setupScrub();

    const onMeta = () => setupScrub();
    const onErr = () => setFailed(true);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("error", onErr);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("error", onErr);
      ctxRef.current?.revert();
      ctxRef.current = null;
      if (scrollSpacerRef.current) scrollSpacerRef.current.style.height = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, src]);

  return (
    <div
      ref={scrollSpacerRef}
      id={id}
      className={`relative z-20 w-full ${className}`}
      aria-label={ariaLabel}
    >
      <div
        ref={pinRef}
        className={`landscape-stage relative overflow-hidden ${className}`}
      >
        {!ready && !failed && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center ${className}`}
          >
            <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.35em] text-sea-foam/50 uppercase">
              {loadingLabel}
            </p>
          </div>
        )}
        {failed && (
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
          className="landscape-stage__media absolute inset-0"
          src={active ? src : undefined}
          muted
          playsInline
          preload="metadata"
          disableRemotePlayback
          aria-hidden
        />
      </div>
    </div>
  );
}
