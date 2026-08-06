"use client";

import { ScrubbedVideoScene } from "./ScrubbedVideoScene";

/**
 * Scene6MonsterReveal — jig / monster reveal (scroll-scrubbed MP4).
 * Uses shared ScrubbedVideoScene: playhead proxy + ticker lerp.
 */
export function Scene6MonsterReveal() {
  return (
    <ScrubbedVideoScene
      id="scene-6-monster-reveal"
      src="/assets/scene6-monster.mp4"
      ariaLabel="Scene 6: Monster Reveal"
      loadingLabel="Something stirs…"
      errorLabel="Unable to load monster reveal video."
      className="bg-[#02080f]"
    />
  );
}
