"use client";

import { ScrubbedVideoScene } from "./ScrubbedVideoScene";

/** Scene 8 — climax / cliffhanger (`/assets/scene8.mp4`), discrete 0.1s seeks */
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
