"use client";

import { ScrubbedVideoScene } from "./ScrubbedVideoScene";

/**
 * Scene8Video — climax / cliffhanger (scroll-scrubbed MP4).
 * Same ultra-smooth ticker lerp + duration × 1000px scroll as Scene 6.
 */
export function Scene8Video() {
  return (
    <ScrubbedVideoScene
      id="scene-8-video"
      src="/assets/scene8.mp4"
      ariaLabel="Scene 8: Climax"
      loadingLabel="To be continued…"
      errorLabel="Unable to load Scene 8 video."
      className="bg-[#050a10]"
    />
  );
}
