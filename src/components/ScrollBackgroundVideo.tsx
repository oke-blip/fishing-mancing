"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER = "/assets/YOUR_BACKGROUND_VIDEO.mp4";

type Props = {
  children: ReactNode;
  src?: string;
  minViewportHeights?: number;
};

/**
 * Optional fixed background scrub. Skips video entirely when src is the
 * placeholder (avoids 404s that break mobile media pipelines).
 */
export function ScrollBackgroundVideo({
  children,
  src = PLACEHOLDER,
  minViewportHeights = 8,
}: Props) {
  const enabled = Boolean(src) && src !== PLACEHOLDER;
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const extenderRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const initScrub = () => {
    if (!enabled) return;
    const video = videoRef.current;
    const content = contentRef.current;
    const extender = extenderRef.current;
    if (!video || !content || !extender) return;
    if (!video.duration || Number.isNaN(video.duration)) return;

    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }

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
    if (!enabled) return;

    const video = videoRef.current;
    if (video && video.readyState >= 1) initScrub();

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
  }, [src, minViewportHeights, enabled]);

  return (
    <div className="relative isolate min-h-[var(--app-height,100svh)]">
      {enabled && (
        <div
          className="pointer-events-none fixed top-0 left-0 overflow-hidden"
          style={{
            zIndex: -1,
            width: "100%",
            height: "var(--app-height, 100svh)",
          }}
          aria-hidden
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={src}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={initScrub}
          />
        </div>
      )}

      <div ref={contentRef} className="relative z-10">
        {children}
      </div>

      <div
        ref={extenderRef}
        className="pointer-events-none relative z-10 w-full"
        style={{ height: 0 }}
        aria-hidden
      />
    </div>
  );
}
