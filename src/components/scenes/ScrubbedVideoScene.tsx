"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createDiscreteVideoScrub,
  getPxPerVideoSecond,
  scheduleScrollTriggerRefresh,
  whenVideoPlayable,
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
 * Scroll-scrubbed video with mobile-safe discrete seeks.
 * Waits for playable frames before enabling scrub (fixes blank/half-loaded assets).
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
  const durationRef = useRef(0);
  const setupLockRef = useRef(false);

  useEffect(() => {
    const spacer = scrollSpacerRef.current;
    if (!spacer) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible) setActive(true);

        const video = videoRef.current;
        if (!video) return;
        if (!visible) video.pause();
      },
      // Prefetch a bit earlier so frames exist before the pin starts
      { rootMargin: "80% 0px", threshold: 0.01 },
    );

    io.observe(spacer);
    return () => io.disconnect();
  }, []);

  const setupScrub = async () => {
    const spacer = scrollSpacerRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    if (!spacer || !pin || !video || setupLockRef.current) return;

    setupLockRef.current = true;

    const ok = await whenVideoPlayable(video);
    if (!ok || !video.duration || Number.isNaN(video.duration)) {
      setFailed(true);
      setupLockRef.current = false;
      return;
    }

    if (ctxRef.current && durationRef.current === video.duration) {
      setReady(true);
      setupLockRef.current = false;
      return;
    }

    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }

    durationRef.current = video.duration;
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

    scheduleScrollTriggerRefresh(250);
    setupLockRef.current = false;
  };

  useLayoutEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;

    // Full preload once activated — metadata-only leaves blank frames on mobile
    video.preload = "auto";
    void setupScrub();

    const onErr = () => setFailed(true);
    video.addEventListener("error", onErr);

    return () => {
      video.removeEventListener("error", onErr);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, src]);

  useEffect(() => {
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
      if (scrollSpacerRef.current) scrollSpacerRef.current.style.height = "";
    };
  }, []);

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
          preload={active ? "auto" : "none"}
          disableRemotePlayback
          aria-hidden
        />
      </div>
    </div>
  );
}
