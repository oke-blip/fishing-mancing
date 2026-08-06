"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createDiscreteVideoScrub,
  getPxPerVideoSecond,
} from "./discreteVideoScrub";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene5DeepOceanVideo — discrete scrub + lazy load for mobile reliability.
 */
export function Scene5DeepOceanVideo() {
  const scrollSpacerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const ctxRef = useRef<gsap.Context | null>(null);

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
          gsap.set(pin, { opacity: fade });
        },
      });
    }, spacer);

    ScrollTrigger.refresh();
  };

  useLayoutEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;

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
  }, [active]);

  return (
    <div
      ref={scrollSpacerRef}
      id="scene-5-deep-ocean"
      className="relative z-20 w-full bg-[#020b14]"
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
          src={active ? "/assets/scene5-deep-sea.mp4" : undefined}
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
