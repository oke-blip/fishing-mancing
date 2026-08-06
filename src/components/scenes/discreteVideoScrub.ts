import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Desktop step; mobile uses larger steps to keep the main thread free */
export const TIME_STEP = 0.15;
export const TIME_STEP_MOBILE = 0.45;

/** 1s of video ≈ this many px of scroll */
export const PX_PER_VIDEO_SECOND = 1000;
export const PX_PER_VIDEO_SECOND_MOBILE = 500;

export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export function getTimeStep() {
  return isTouchDevice() ? TIME_STEP_MOBILE : TIME_STEP;
}

export function getPxPerVideoSecond() {
  return isTouchDevice() ? PX_PER_VIDEO_SECOND_MOBILE : PX_PER_VIDEO_SECOND;
}

/** Debounced global refresh — avoids refresh storms when many scenes load */
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
export function scheduleScrollTriggerRefresh(delay = 200) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}

/**
 * Queue at most one seek per animation frame.
 * Mobile decoders freeze the UI if currentTime is set every scroll event.
 */
export function seekVideoDiscrete(
  video: HTMLVideoElement,
  progress: number,
  lastSeekTime: { current: number },
  step = getTimeStep(),
  pendingRaf: { current: number | null },
): void {
  if (!video.duration || Number.isNaN(video.duration)) return;
  if (video.readyState < 1) return;

  const rawTargetTime = progress * video.duration;
  const steppedTime = Math.min(
    video.duration,
    Math.max(0, Math.round(rawTargetTime / step) * step),
  );

  if (Math.abs(steppedTime - lastSeekTime.current) < step * 0.85) return;

  // Always record intent; apply on next frame if not already seeking
  const apply = () => {
    pendingRaf.current = null;
    if (video.seeking || video.readyState < 1) return;
    if (Math.abs(steppedTime - lastSeekTime.current) < step * 0.5) return;
    lastSeekTime.current = steppedTime;
    try {
      video.currentTime = steppedTime;
    } catch {
      /* ignore seek storms */
    }
  };

  if (pendingRaf.current != null) return;
  pendingRaf.current = requestAnimationFrame(apply);
}

export type DiscreteScrubOptions = {
  trigger: HTMLElement;
  pin: HTMLElement | boolean;
  video: HTMLVideoElement;
  progressToVideo?: (scrollProgress: number) => number;
  onUpdateExtra?: (self: ScrollTrigger) => void;
};

/**
 * ScrollTrigger that seeks video in discrete jumps (no scrub tween).
 * Call inside gsap.context() so revert() cleans it up.
 */
export function createDiscreteVideoScrub({
  trigger,
  pin,
  video,
  progressToVideo,
  onUpdateExtra,
}: DiscreteScrubOptions) {
  const lastSeekTime = { current: -1 };
  const pendingRaf = { current: null as number | null };
  const step = getTimeStep();
  const touch = isTouchDevice();

  const st = ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    pin,
    // transform pins are cheaper / less sticky on mobile WebKit
    pinType: touch ? "transform" : "fixed",
    scrub: false,
    anticipatePin: touch ? 0 : 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    preventOverlaps: true,
    onUpdate: (self) => {
      // Skip video work when this pin is not the active one
      if (!self.isActive) return;

      const videoProgress = progressToVideo
        ? progressToVideo(self.progress)
        : self.progress;
      seekVideoDiscrete(video, videoProgress, lastSeekTime, step, pendingRaf);
      onUpdateExtra?.(self);
    },
    onLeave: () => {
      if (pendingRaf.current != null) {
        cancelAnimationFrame(pendingRaf.current);
        pendingRaf.current = null;
      }
    },
    onLeaveBack: () => {
      if (pendingRaf.current != null) {
        cancelAnimationFrame(pendingRaf.current);
        pendingRaf.current = null;
      }
    },
  });

  return st;
}
