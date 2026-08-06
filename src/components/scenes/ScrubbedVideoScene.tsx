"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createDiscreteVideoScrub,
  PX_PER_VIDEO_SECOND,
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
 * Full-viewport scroll-scrubbed video with discrete TIME_STEP seeking.
 * Height = duration × 1000px after loadedmetadata; pin + onUpdate (no scrub tween).
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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  const setupScrub = () => {
    const spacer = scrollSpacerRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    if (!spacer || !pin || !video) return;
    if (!video.duration || Number.isNaN(video.duration)) return;

    video.pause();
    video.currentTime = 0;
    spacer.style.height = `${video.duration * PX_PER_VIDEO_SECOND}px`;
    setReady(true);

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
    const video = videoRef.current;
    if (video && video.readyState >= 1) {
      setupScrub();
    }

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
      if (scrollSpacerRef.current) scrollSpacerRef.current.style.height = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bind once; metadata handler re-inits
  }, [src]);

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
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={setupScrub}
          onError={() => setFailed(true)}
          aria-hidden
        />
      </div>
    </div>
  );
}
