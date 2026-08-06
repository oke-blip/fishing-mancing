"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Geometry > orientation media query (OEM browsers disagree on orientation). */
export function shouldLockToLandscape() {
  if (typeof window === "undefined") return false;
  const touch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;
  if (!touch) return false;
  return window.innerHeight > window.innerWidth;
}

function clearScrollLocks() {
  const html = document.documentElement;
  const body = document.body;
  html.classList.remove("is-portrait");
  body.classList.remove("is-portrait");
  html.style.overflow = "";
  html.style.height = "";
  html.style.maxHeight = "";
  html.style.touchAction = "";
  body.style.overflow = "";
  body.style.height = "";
  body.style.maxHeight = "";
  body.style.touchAction = "";
}

/**
 * Portrait gate — only blocks when the viewport is taller than wide on a touch device.
 * Comic stays in the DOM (not visibility:hidden) so videos/IO keep working under the overlay.
 */
export function PortraitLock() {
  useEffect(() => {
    const sync = () => {
      const locked = shouldLockToLandscape();
      document.documentElement.classList.toggle("is-portrait", locked);
      document.body.classList.toggle("is-portrait", locked);

      if (locked) {
        window.scrollTo(0, 0);
      } else {
        clearScrollLocks();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };

    sync();
    window.addEventListener("orientationchange", sync);
    window.addEventListener("resize", sync);
    // iOS sometimes updates size after orientationchange
    window.addEventListener("orientationchange", () => {
      setTimeout(sync, 250);
      setTimeout(sync, 600);
    });

    return () => {
      window.removeEventListener("orientationchange", sync);
      window.removeEventListener("resize", sync);
      clearScrollLocks();
    };
  }, []);

  return (
    <div
      className="portrait-lock"
      role="dialog"
      aria-modal="true"
      aria-label="Please rotate your device to landscape"
    >
      <Image
        src="/assets/5.jpg"
        alt="Rotate your phone to landscape"
        fill
        priority
        sizes="100vw"
        className="portrait-lock__image"
      />
    </div>
  );
}
