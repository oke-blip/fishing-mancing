import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Seconds between allowed video seeks — 0.1s discrete steps */
export const TIME_STEP = 0.1;

/** 1s of video ≈ this many px of scroll */
export const PX_PER_VIDEO_SECOND = 1000;

/**
 * Quantize scroll progress → video.currentTime in TIME_STEP increments.
 * Skips redundant seeks when the stepped value has not changed enough.
 */
export function seekVideoDiscrete(
  video: HTMLVideoElement,
  progress: number,
  lastSeekTime: { current: number },
): void {
  if (!video.duration || Number.isNaN(video.duration)) return;

  const rawTargetTime = progress * video.duration;
  const steppedTime = Math.min(
    video.duration,
    Math.max(0, Math.round(rawTargetTime / TIME_STEP) * TIME_STEP),
  );

  if (Math.abs(steppedTime - lastSeekTime.current) >= TIME_STEP) {
    lastSeekTime.current = steppedTime;
    video.currentTime = steppedTime;
  }
}

export type DiscreteScrubOptions = {
  trigger: HTMLElement;
  pin: HTMLElement | boolean;
  video: HTMLVideoElement;
  /** Optional: map overall progress → video progress (e.g. after fade-in) */
  progressToVideo?: (scrollProgress: number) => number;
  onUpdateExtra?: (self: ScrollTrigger) => void;
};

/**
 * ScrollTrigger that seeks video in discrete TIME_STEP jumps (no scrub tween).
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

  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    pin,
    scrub: false,
    anticipatePin: typeof pin === "object" ? 1 : 0,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const videoProgress = progressToVideo
        ? progressToVideo(self.progress)
        : self.progress;
      seekVideoDiscrete(video, videoProgress, lastSeekTime);
      onUpdateExtra?.(self);
    },
  });
}
