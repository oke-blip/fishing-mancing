"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Full-screen portrait gate using /assets/5.jpg.
 * Blocks scroll until the device is landscape.
 */
export function PortraitLock() {
  useEffect(() => {
    const syncOrientation = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      document.documentElement.classList.toggle("is-portrait", portrait);
      document.body.classList.toggle("is-portrait", portrait);

      if (portrait) {
        window.scrollTo(0, 0);
      } else {
        // Recalc pins / scrub after rotating to landscape
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };

    syncOrientation();
    window.addEventListener("orientationchange", syncOrientation);
    window.addEventListener("resize", syncOrientation);

    return () => {
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
