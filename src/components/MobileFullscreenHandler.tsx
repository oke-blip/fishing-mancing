"use client";

import { useEffect } from "react";
import { scheduleScrollTriggerRefresh } from "@/components/scenes/discreteVideoScrub";

/**
 * Keep a stable CSS viewport height without locking document scroll.
 */
export function MobileFullscreenHandler() {
  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const h = Math.max(window.innerHeight, 1);
      const w = Math.max(window.innerWidth, 1);
      root.style.setProperty("--app-height", `${h}px`);
      root.style.setProperty("--app-width", `${w}px`);
    };

    sync();

    const onChange = () => {
      sync();
      scheduleScrollTriggerRefresh(300);
    };

    window.addEventListener("resize", onChange);
    window.addEventListener("orientationchange", onChange);

    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);

  return null;
}
