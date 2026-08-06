/**
 * Scene 0 — Clean full-screen video intro + SpongeBob dive into Scene 1.
 *
 * IMPORTANT: `/assets/intro-video-clean.mp4` MUST be a source file that is
 * already completely clean of any baked-in text, titles, or UI overlays.
 * Do not composite captions in the browser — replace the asset instead.
 */
export function Scene0Intro() {
  return (
    <section
      id="scene-0"
      className="scene-0 relative h-screen w-full overflow-hidden bg-black"
      aria-label="Scene 0: Introduction"
    >
      {/* Pure video stage — no text overlays */}
      <div className="scene-0__stage absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src="/assets/intro-video-clean.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      </div>

      {/* Water / bubble overlay — rises on scrub, then fades into Scene 1 */}
      <div
        className="scene-0__water absolute inset-0 z-20 will-change-transform"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a8fa8] via-[#0e5a6e] to-[#062538]" />
        <div className="scene-0__foam absolute top-0 right-0 left-0 h-16 bg-gradient-to-b from-[#a8e4ef]/80 via-[#5bb8c9]/40 to-transparent" />

        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="scene-0__bubble absolute rounded-full border border-white/30 bg-white/20"
            style={{
              width: `${8 + (i % 5) * 6}px`,
              height: `${8 + (i % 5) * 6}px`,
              left: `${6 + ((i * 7) % 88)}%`,
              bottom: `${8 + ((i * 11) % 70)}%`,
              opacity: 0.35 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>
    </section>
  );
}
