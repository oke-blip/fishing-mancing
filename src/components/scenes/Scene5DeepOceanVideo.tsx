"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createDiscreteVideoScrub,
  PX_PER_VIDEO_SECOND,
} from "./discreteVideoScrub";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene5DeepOceanVideo — deep-ocean clip with discrete TIME_STEP seeks.
 * Fade-in on the first 20% of scroll; video progress maps across the rest.
 */
export function Scene5DeepOceanVideo() {
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
      gsap.set(pin, { opacity: 0 });

      createDiscreteVideoScrub({
        trigger: spacer,
        pin,
        video,
        // First 20% of scroll = fade-in only; remainder drives the playhead
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
    const video = videoRef.current;
    if (video && video.readyState >= 1) {
      setupScrub();
    }

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
      if (scrollSpacerRef.current) scrollSpacerRef.current.style.height = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          src="/assets/scene5-deep-sea.mp4"
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
