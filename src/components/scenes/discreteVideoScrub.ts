import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TIME_STEP = 0.2;
export const TIME_STEP_MOBILE = 0.5;

export const PX_PER_VIDEO_SECOND = 1000;
export const PX_PER_VIDEO_SECOND_MOBILE = 500;

/** Fallback scroll length before metadata arrives — page must always be scrollable */
export const MIN_SCRUB_VIEWPORTS = 3;

export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function getTimeStep() {
  return isTouchDevice() ? TIME_STEP_MOBILE : TIME_STEP;
}

export function getPxPerVideoSecond() {
  return isTouchDevice() ? PX_PER_VIDEO_SECOND_MOBILE : PX_PER_VIDEO_SECOND;
}

export function getMinScrubHeight() {
  if (typeof window === "undefined") return 2400;
  return Math.round(window.innerHeight * MIN_SCRUB_VIEWPORTS);
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
export function scheduleScrollTriggerRefresh(delay = 300) {
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
 * Resolve as soon as duration is known (loadedmetadata).
 * Do NOT call video.load() here — that aborts in-flight fetches on iOS/Android.
 */
export function whenVideoHasDuration(
  video: HTMLVideoElement,
  timeoutMs = 12000,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (video.duration && !Number.isNaN(video.duration) && video.duration !== Infinity) {
      resolve(true);
      return;
    }

    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("error", onErr);
      clearTimeout(timer);
      resolve(ok);
    };

    const onMeta = () => {
      if (video.duration && !Number.isNaN(video.duration) && video.duration !== Infinity) {
        finish(true);
      }
    };
    const onErr = () => finish(false);

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("error", onErr);
    const timer = setTimeout(
      () =>
        finish(
          Boolean(
            video.duration && !Number.isNaN(video.duration) && video.duration !== Infinity,
          ),
        ),
      timeoutMs,
    );
  });
}

function quantizeTime(video: HTMLVideoElement, progress: number, step: number) {
  const raw = progress * video.duration;
  return Math.min(
    video.duration,
    Math.max(0, Math.round(raw / step) * step),
  );
}

export function applyDiscreteSeek(
  video: HTMLVideoElement,
  progress: number,
  lastSeekTime: { current: number },
  step: number,
): void {
  if (!video.duration || Number.isNaN(video.duration)) return;
  // HAVE_METADATA (1) is enough to assign currentTime on most mobile browsers
  if (video.readyState < 1 || video.seeking) return;

  const steppedTime = quantizeTime(video, progress, step);
  if (Math.abs(steppedTime - lastSeekTime.current) < step * 0.7) return;

  lastSeekTime.current = steppedTime;
  try {
    video.currentTime = steppedTime;
  } catch {
    /* ignore */
  }
}

export type DiscreteScrubOptions = {
  trigger: HTMLElement;
  pin: HTMLElement | boolean;
  video: HTMLVideoElement;
  progressToVideo?: (scrollProgress: number) => number;
  onUpdateExtra?: (self: ScrollTrigger) => void;
};

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

  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "bottom bottom",
    pin,
    // Default pin (fixed) is more reliable for scroll across OEMs than transform
    scrub: false,
    anticipatePin: 0,
    invalidateOnRefresh: true,
    fastScrollEnd: true,
    // preventOverlaps can freeze scroll when many pins stack on mobile
    preventOverlaps: false,
    onUpdate: (self) => {
      if (!self.isActive) return;

      const videoProgress = mapProgress(self.progress);
      pendingProgress.current = videoProgress;

      if (touch) {
        if (Math.abs(self.getVelocity()) < 500) {
          applyDiscreteSeek(video, videoProgress, lastSeekTime, step);
        }
      } else {
        applyDiscreteSeek(video, videoProgress, lastSeekTime, step);
      }

      onUpdateExtra?.(self);
    },
    onKill: () => {
      mobileSeekFlushers.delete(flush);
    },
  });
}
