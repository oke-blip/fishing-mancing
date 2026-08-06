"use client";

import { ScrubbedVideoScene } from "./ScrubbedVideoScene";

/** Scene 7 — action beat (`/assets/scene7.mp4`), discrete 0.1s seeks */
export function Scene7Video() {
  return (
    <ScrubbedVideoScene
      id="scene-7-video"
      src="/assets/scene7.mp4"
      ariaLabel="Scene 7: Action"
      loadingLabel="The line holds…"
      errorLabel="Unable to load Scene 7 video."
      className="bg-[#02080f]"
    />
  );
}
