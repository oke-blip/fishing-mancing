"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function isPortraitMobile() {
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  // Only gate real phones/tablets — never lock desktop narrow windows
  return portrait && coarse;
}

/**
 * Full-screen portrait gate using /assets/5.jpg.
 * Landscape (or desktop) unlocks the comic.
 */
export function PortraitLock() {
  useEffect(() => {
    const syncOrientation = () => {
      const locked = isPortraitMobile();
      document.documentElement.classList.toggle("is-portrait", locked);
      document.body.classList.toggle("is-portrait", locked);

      if (locked) {
        window.scrollTo(0, 0);
      } else {
        // Clear any stuck overflow from portrait CSS
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };

    syncOrientation();
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener?.("change", syncOrientation);
    window.addEventListener("orientationchange", syncOrientation);
    window.addEventListener("resize", syncOrientation);

    return () => {
      mq.removeEventListener?.("change", syncOrientation);
      window.removeEventListener("orientationchange", syncOrientation);
      window.removeEventListener("resize", syncOrientation);
      document.documentElement.classList.remove("is-portrait");
      document.body.classList.remove("is-portrait");
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
