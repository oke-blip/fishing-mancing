"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldLockToLandscape } from "@/components/PortraitLock";

/**
 * Safety net for mobile OEMs that leave overflow/touch locks stuck
 * or block muted video until a user gesture.
 */
export function MobileScrollFix() {
  useEffect(() => {
    const unlock = () => {
      if (shouldLockToLandscape()) return;

      const html = document.documentElement;
      const body = document.body;
      html.classList.remove("is-portrait");
      body.classList.remove("is-portrait");
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.height = "";
      body.style.height = "";
      html.style.touchAction = "";
      body.style.touchAction = "pan-y";

      // Nudge muted videos after first gesture (autoplay policies)
      document.querySelectorAll("video").forEach((node) => {
        const video = node as HTMLVideoElement;
        video.muted = true;
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        if (video.dataset.autoUnlock === "true") {
          video.play().catch(() => {});
        }
      });

      ScrollTrigger.refresh();
    };

    const onFirstGesture = () => {
      unlock();
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("pointerdown", onFirstGesture);
    };

    window.addEventListener("touchstart", onFirstGesture, { passive: true });
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });

    // Periodic self-heal if landscape but still locked (some WebViews)
    const heal = window.setInterval(() => {
      if (!shouldLockToLandscape() && document.documentElement.classList.contains("is-portrait")) {
        unlock();
      }
    }, 1000);

    return () => {
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.clearInterval(heal);
    };
  }, []);

  return null;
}
