import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Desktop step; mobile uses a larger step to reduce decoder thrash */
export const TIME_STEP = 0.1;
export const TIME_STEP_MOBILE = 0.25;

/** 1s of video ≈ this many px of scroll */
export const PX_PER_VIDEO_SECOND = 1000;
export const PX_PER_VIDEO_SECOND_MOBILE = 700;

export function getTimeStep() {
  if (typeof window === "undefined") return TIME_STEP;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches
    ? TIME_STEP_MOBILE
    : TIME_STEP;
}

export function getPxPerVideoSecond() {
  if (typeof window === "undefined") return PX_PER_VIDEO_SECOND;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches
    ? PX_PER_VIDEO_SECOND_MOBILE
    : PX_PER_VIDEO_SECOND;
}

/**
 * Quantize scroll progress → video.currentTime in discrete steps.
 * Skips seeks while the element is already seeking (critical on mobile).
 */
export function seekVideoDiscrete(
  video: HTMLVideoElement,
  progress: number,
  lastSeekTime: { current: number },
  step = getTimeStep(),
): void {
  if (!video.duration || Number.isNaN(video.duration)) return;
  if (video.seeking || video.readyState < 1) return;

  const rawTargetTime = progress * video.duration;
  const steppedTime = Math.min(
    video.duration,
    Math.max(0, Math.round(rawTargetTime / step) * step),
  );

  if (Math.abs(steppedTime - lastSeekTime.current) >= step * 0.9) {
    lastSeekTime.current = steppedTime;
    try {
      video.currentTime = steppedTime;
    } catch {
      /* Some mobile browsers throw during seek storms */
    }
  }
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
  const step = getTimeStep();

  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    pin,
    scrub: false,
    anticipatePin: typeof pin === "object" ? 1 : 0,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    onUpdate: (self) => {
      const videoProgress = progressToVideo
        ? progressToVideo(self.progress)
        : self.progress;
      seekVideoDiscrete(video, videoProgress, lastSeekTime, step);
      onUpdateExtra?.(self);
    },
  });
}
