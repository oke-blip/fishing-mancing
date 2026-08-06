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

const SRC = "/assets/scene5-deep-sea.mp4";

/**
 * Scene5 — always scrollable; scrub arms after duration is known.
 */
export function Scene5DeepOceanVideo() {
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
    spacer.style.height = `${getMinScrubHeight()}px`;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "auto";
    video.src = SRC;

    const setup = async () => {
      if (cancelled || setupDoneRef.current) return;

      const hasDuration = await whenVideoHasDuration(video);
      if (cancelled) return;

      if (!hasDuration || !video.duration) {
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

      let lastFade = -1;

      ctxRef.current?.revert();
      ctxRef.current = gsap.context(() => {
        gsap.set(pin, { opacity: 0 });

        createDiscreteVideoScrub({
          trigger: spacer,
          pin,
          video,
          progressToVideo: (p) => {
            if (p <= 0.2) return 0;
            return (p - 0.2) / 0.8;
          },
          onUpdateExtra: (self) => {
            const fade = Math.min(1, self.progress / 0.2);
            if (Math.abs(fade - lastFade) < 0.04) return;
            lastFade = fade;
            pin.style.opacity = String(fade);
          },
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
  }, []);

  return (
    <div
      ref={scrollSpacerRef}
      id="scene-5-deep-ocean"
      className="relative z-20 w-full bg-[#020b14]"
      style={{ minHeight: "300vh" }}
      aria-label="Scene 5: Deep Ocean"
    >
      <div
        ref={pinRef}
        className="landscape-stage relative w-full overflow-hidden bg-[#020b14]"
      >
        {!ready && !failed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020b14]">
            <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.35em] text-sea-foam/50 uppercase">
              Descending…
            </p>
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020b14]">
            <p className="font-[family-name:var(--font-body)] text-sm text-white/70">
              Unable to load deep-sea video.
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
