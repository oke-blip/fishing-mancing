"use client";

import { ScrubbedVideoScene } from "./ScrubbedVideoScene";

/**
 * Scene7Video — action / struggle beat (scroll-scrubbed MP4).
 * Same Lenis-friendly playhead lerp as Scene 6.
 */
export function Scene7Video() {
  return (
    <ScrubbedVideoScene
      id="scene-7-video"
      src="/assets/scene7.mp4"
      ariaLabel="Scene 7: Action"
      loadingLabel="The line holds…"
      errorLabel="Unable to load Scene 7 video."
      className="bg-[#041018]"
    />
  );
}
