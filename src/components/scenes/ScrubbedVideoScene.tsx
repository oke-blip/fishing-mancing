"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createDiscreteVideoScrub,
  getMinScrubHeight,
  getPxPerVideoSecond,
  scheduleScrollTriggerRefresh,
  whenVideoHasDuration,
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
 * Always mounts the video src, sets a min scroll height immediately,
 * then upgrades height from metadata. Never blocks page scroll on load failure.
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
  const setupDoneRef = useRef(false);

  useEffect(() => {
    const spacer = scrollSpacerRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    if (!spacer || !pin || !video) return;

    let cancelled = false;

    // Guarantee scrollable space even before metadata
    spacer.style.height = `${getMinScrubHeight()}px`;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "auto";
    video.src = src;

    const setup = async () => {
      if (cancelled || setupDoneRef.current) return;

      const hasDuration = await whenVideoHasDuration(video);
      if (cancelled) return;

      if (!hasDuration || !video.duration) {
        // Keep min height so the user can still scroll past this section
        setFailed(true);
        scheduleScrollTriggerRefresh(200);
        return;
      }

      setupDoneRef.current = true;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }

      spacer.style.height = `${Math.max(
        getMinScrubHeight(),
        video.duration * getPxPerVideoSecond(),
      )}px`;
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

      scheduleScrollTriggerRefresh(200);
    };

    const onMeta = () => {
      void setup();
    };
    const onErr = () => {
      if (!cancelled) {
        setFailed(true);
        spacer.style.height = `${getMinScrubHeight()}px`;
        scheduleScrollTriggerRefresh(200);
      }
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("error", onErr);

    if (video.readyState >= 1) void setup();

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("error", onErr);
      ctxRef.current?.revert();
      ctxRef.current = null;
      setupDoneRef.current = false;
      spacer.style.height = "";
    };
  }, [src]);

  return (
    <div
      ref={scrollSpacerRef}
      id={id}
      className={`relative z-20 w-full ${className}`}
      style={{ minHeight: "300vh" }}
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
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          aria-hidden
        />
      </div>
    </div>
  );
}
