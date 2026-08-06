import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Desktop step; mobile uses larger steps + scroll-end flush */
export const TIME_STEP = 0.2;
export const TIME_STEP_MOBILE = 0.6;

/** 1s of video ≈ this many px of scroll */
export const PX_PER_VIDEO_SECOND = 1000;
export const PX_PER_VIDEO_SECOND_MOBILE = 450;

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
export function scheduleScrollTriggerRefresh(delay = 280) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, delay);
}

type FlushFn = () => void;
const mobileSeekFlushers = new Set<FlushFn>();
let scrollEndBound = false;

function ensureScrollEndBridge() {
  if (scrollEndBound || typeof window === "undefined") return;
  scrollEndBound = true;
  ScrollTrigger.addEventListener("scrollEnd", () => {
    mobileSeekFlushers.forEach((fn) => fn());
  });
}

/**
 * Wait until the video has decodable frames (fixes blank / half-loaded mobile scrub).
 */
export function whenVideoPlayable(
  video: HTMLVideoElement,
  timeoutMs = 8000,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (video.readyState >= 2) {
      resolve(true);
      return;
    }

    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onErr);
      clearTimeout(timer);
      resolve(ok);
    };
    const onReady = () => finish(true);
    const onErr = () => finish(false);

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", onErr);
    const timer = setTimeout(() => finish(video.readyState >= 1), timeoutMs);

    try {
      video.load();
    } catch {
      /* ignore */
    }
  });
}

function quantizeTime(video: HTMLVideoElement, progress: number, step: number) {
  const raw = progress * video.duration;
  return Math.min(
    video.duration,
    Math.max(0, Math.round(raw / step) * step),
  );
}

/**
 * Apply a discrete seek if the stepped time changed enough and decoder is free.
 */
export function applyDiscreteSeek(
  video: HTMLVideoElement,
  progress: number,
  lastSeekTime: { current: number },
  step: number,
): void {
  if (!video.duration || Number.isNaN(video.duration)) return;
  if (video.seeking || video.readyState < 2) return;

  const steppedTime = quantizeTime(video, progress, step);
  if (Math.abs(steppedTime - lastSeekTime.current) < step * 0.75) return;

  lastSeekTime.current = steppedTime;
  try {
    video.currentTime = steppedTime;
  } catch {
    /* seek storm / not ready */
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
 * ScrollTrigger that seeks video in discrete jumps.
 * On mobile: mostly seeks when finger velocity is low or scroll ends —
 * mid-swipe seeking is what causes stutter.
 */
export function createDiscreteVideoScrub({
  trigger,
  pin,
  video,
  progressToVideo,
  onUpdateExtra,
}: DiscreteScrubOptions) {
  const lastSeekTime = { current: -1 };
  const pendingProgress = { current: 0 };
  const step = getTimeStep();
  const touch = isTouchDevice();

  const mapProgress = (p: number) =>
    progressToVideo ? progressToVideo(p) : p;

  const flush = () => {
    applyDiscreteSeek(video, pendingProgress.current, lastSeekTime, step);
  };

  if (touch) {
    ensureScrollEndBridge();
    mobileSeekFlushers.add(flush);
  }

  const st = ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    pin,
    pinType: touch ? "transform" : "fixed",
    scrub: false,
    anticipatePin: touch ? 0 : 1,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    preventOverlaps: true,
    onUpdate: (self) => {
      if (!self.isActive) return;

      const videoProgress = mapProgress(self.progress);
      pendingProgress.current = videoProgress;

      if (touch) {
        // Only scrub while the finger is nearly still — avoids decoder hitch mid-swipe
        const velocity = Math.abs(self.getVelocity());
        if (velocity < 400) {
          applyDiscreteSeek(video, videoProgress, lastSeekTime, step);
        }
      } else {
        applyDiscreteSeek(video, videoProgress, lastSeekTime, step);
      }

      onUpdateExtra?.(self);
    },
    onRefresh: () => {
      // Re-apply after layout so the frame matches scroll position
      flush();
    },
    onKill: () => {
      mobileSeekFlushers.delete(flush);
    },
  });

  return st;
}
