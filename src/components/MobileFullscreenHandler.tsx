"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.matchMedia("(hover: none)").matches)
  );
}

/**
 * Keep CSS --app-height / --app-width locked to the *visible* viewport
 * (excludes mobile browser search / address bar), so stages are never covered.
 * Also tries native fullscreen on first gesture when the browser allows it.
 */
export function MobileFullscreenHandler() {
  useEffect(() => {
    const root = document.documentElement;

    const syncVisibleViewport = () => {
      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      const width = vv?.width ?? window.innerWidth;
      const top = vv?.offsetTop ?? 0;
      const left = vv?.offsetLeft ?? 0;

      root.style.setProperty("--app-height", `${height}px`);
      root.style.setProperty("--app-width", `${width}px`);
      root.style.setProperty("--app-top", `${top}px`);
      root.style.setProperty("--app-left", `${left}px`);
    };

    syncVisibleViewport();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", syncVisibleViewport);
    vv?.addEventListener("scroll", syncVisibleViewport);
    window.addEventListener("resize", syncVisibleViewport);
    window.addEventListener("orientationchange", syncVisibleViewport);

    // After chrome animates, refresh GSAP pin/scrub math
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refreshTriggers = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        syncVisibleViewport();
        ScrollTrigger.refresh();
      }, 120);
    };
    vv?.addEventListener("resize", refreshTriggers);
    window.addEventListener("orientationchange", refreshTriggers);

    if (!isMobileDevice()) {
      return () => {
        vv?.removeEventListener("resize", syncVisibleViewport);
        vv?.removeEventListener("scroll", syncVisibleViewport);
        vv?.removeEventListener("resize", refreshTriggers);
        window.removeEventListener("resize", syncVisibleViewport);
        window.removeEventListener("orientationchange", syncVisibleViewport);
        window.removeEventListener("orientationchange", refreshTriggers);
        clearTimeout(refreshTimer);
      };
    }

    let armed = true;
    const onFirstGesture = () => {
      if (!armed) return;
      armed = false;

      const doc = document as FullscreenDocument;
      if (document.fullscreenElement || doc.webkitFullscreenElement) return;

      const el = document.documentElement as FullscreenElement;
      const req =
        el.requestFullscreen?.bind(el) ||
        el.webkitRequestFullscreen?.bind(el);
      if (req) {
        Promise.resolve(req()).catch(() => {
          /* iOS Safari often blocks — visualViewport sizing still applies */
        });
      }

      window.removeEventListener("touchend", onFirstGesture);
      window.removeEventListener("pointerup", onFirstGesture);
      window.removeEventListener("click", onFirstGesture);
    };

    window.addEventListener("touchend", onFirstGesture, { passive: true });
    window.addEventListener("pointerup", onFirstGesture, { passive: true });
    window.addEventListener("click", onFirstGesture);

    return () => {
      armed = false;
      vv?.removeEventListener("resize", syncVisibleViewport);
      vv?.removeEventListener("scroll", syncVisibleViewport);
      vv?.removeEventListener("resize", refreshTriggers);
      window.removeEventListener("resize", syncVisibleViewport);
      window.removeEventListener("orientationchange", syncVisibleViewport);
      window.removeEventListener("orientationchange", refreshTriggers);
      window.removeEventListener("touchend", onFirstGesture);
      window.removeEventListener("pointerup", onFirstGesture);
      window.removeEventListener("click", onFirstGesture);
      clearTimeout(refreshTimer);
    };
  }, []);

  return null;
}
