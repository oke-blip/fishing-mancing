"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Sync CSS vars to the visible viewport height so mobile browser chrome
 * does not cover stages. Does NOT request fullscreen (breaks scroll on many phones).
 */
export function MobileFullscreenHandler() {
  useEffect(() => {
    const root = document.documentElement;

    const syncVisibleViewport = () => {
      const vv = window.visualViewport;
      // Prefer layout viewport for width; visual height excludes browser chrome
      const height = Math.round(vv?.height ?? window.innerHeight);
      const width = Math.round(window.innerWidth);

      if (height > 0) root.style.setProperty("--app-height", `${height}px`);
      if (width > 0) root.style.setProperty("--app-width", `${width}px`);
      root.style.setProperty("--app-top", "0px");
      root.style.setProperty("--app-left", "0px");
    };

    syncVisibleViewport();

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const onChange = () => {
      syncVisibleViewport();
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    const vv = window.visualViewport;
    // Only resize — not visualViewport "scroll" (fires constantly on iOS and janks layout)
    vv?.addEventListener("resize", onChange);
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);

    return () => {
      vv?.removeEventListener("resize", onChange);
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
      clearTimeout(refreshTimer);
    };
  }, []);

  return null;
}
