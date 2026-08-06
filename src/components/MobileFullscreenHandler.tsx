"use client";

import { useEffect } from "react";
import { scheduleScrollTriggerRefresh } from "@/components/scenes/discreteVideoScrub";

/**
 * Sync CSS vars to the visible viewport height so mobile browser chrome
 * does not cover stages. Does NOT request fullscreen (breaks scroll on many phones).
 */
export function MobileFullscreenHandler() {
  useEffect(() => {
    const root = document.documentElement;

    const syncVisibleViewport = () => {
      const vv = window.visualViewport;
      const height = Math.round(vv?.height ?? window.innerHeight);
      const width = Math.round(window.innerWidth);

      if (height > 0) root.style.setProperty("--app-height", `${height}px`);
      if (width > 0) root.style.setProperty("--app-width", `${width}px`);
      root.style.setProperty("--app-top", "0px");
      root.style.setProperty("--app-left", "0px");
    };

    syncVisibleViewport();

    const onChange = () => {
      syncVisibleViewport();
      scheduleScrollTriggerRefresh(200);
    };

    const vv = window.visualViewport;
    vv?.addEventListener("resize", onChange);
    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);

    return () => {
      vv?.removeEventListener("resize", onChange);
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);

  return null;
}
