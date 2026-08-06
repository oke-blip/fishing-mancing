"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function isCoarsePointer() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function isPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}

/**
 * Desktop: Lenis smooth wheel + ScrollTrigger.
 * Mobile/touch: native scroll only — Lenis commonly blocks touch scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Touch devices: do not instantiate Lenis
    if (isCoarsePointer()) {
      const onOrient = () => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      window.addEventListener("orientationchange", onOrient);
      window.addEventListener("resize", onOrient);
      return () => {
        window.removeEventListener("orientationchange", onOrient);
        window.removeEventListener("resize", onOrient);
      };
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const syncPortrait = () => {
      if (isPortrait()) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
      } else {
        lenis.start();
        ScrollTrigger.refresh();
      }
    };

    syncPortrait();
    window.addEventListener("orientationchange", syncPortrait);
    window.addEventListener("resize", syncPortrait);

    const tick = (time: number) => {
      if (!isPortrait()) lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("orientationchange", syncPortrait);
      window.removeEventListener("resize", syncPortrait);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <div className="comic-root">{children}</div>;
}
