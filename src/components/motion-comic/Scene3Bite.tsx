import { AssetPlaceholder } from "./AssetPlaceholder";

/**
 * Scene 3 — The Bite (pinned while scroll drives SFX / line tension).
 * Swap for layers from image_079360.jpg.
 */
export function Scene3Bite() {
  return (
    <section
      id="scene-3"
      className="scene-3 relative h-[100dvh] w-full overflow-hidden"
      aria-label="Scene 3: The Bite"
    >
      <div className="scene-3__pin relative grid h-full w-full grid-cols-1 grid-rows-[1.1fr_1fr] gap-1 bg-comic-ink md:grid-cols-2 md:grid-rows-2">
        {/* Top — thrashing monster (spans full width on md) */}
        <div className="comic-panel relative md:col-span-2">
          <AssetPlaceholder
            label="BG: Underwater Thrash (image_079360)"
            className="absolute inset-0 bg-gradient-to-r from-[#0a2a32] via-[#0e3a40] to-[#1a2830]"
          />
          <AssetPlaceholder
            label="Monster Body Thrashing"
            className="scene-3__monster absolute bottom-[8%] left-[10%] h-[70%] w-[70%] bg-gradient-to-r from-[#2a3228] to-[#4a5048]"
          />
          <div className="speech-bubble speech-bubble--jagged scene-3__bubble-roar absolute top-[12%] left-[8%] z-10 max-w-xs opacity-0">
            GRAAAGH! MINE! I&apos;LL TEAR YOU APART!
          </div>
          <span className="sfx scene-3__sfx-crunch absolute top-[30%] right-[18%] z-20 scale-50 text-5xl text-[#f5d76e] opacity-0 md:text-7xl">
            CRUNCH!
          </span>
          <span className="sfx scene-3__sfx-snap absolute top-[48%] right-[28%] z-20 scale-50 text-4xl text-white opacity-0">
            SNAP!
          </span>
        </div>

        {/* Bottom-left — bite close-up */}
        <div className="comic-panel relative">
          <AssetPlaceholder
            label="BG: Bite Close-up"
            className="absolute inset-0 bg-gradient-to-br from-[#0a2028] to-[#1a1510]"
          />
          <AssetPlaceholder
            label="Monster Jaw + Jig"
            className="absolute inset-[12%] bg-gradient-to-t from-[#3a3830] to-[#5a5848]"
          />
          <span className="sfx scene-3__sfx-strain absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-50 text-4xl text-white opacity-0 md:text-6xl">
            LINE STRAIN!
          </span>
          <span className="comic-label absolute bottom-4 left-4 z-10">
            The Surface Struggle
          </span>
        </div>

        {/* Bottom-right — Gutom on surface */}
        <div className="comic-panel relative">
          <AssetPlaceholder
            label="BG: Surface Struggle"
            className="absolute inset-0 bg-gradient-to-b from-[#8aa8b8] to-[#2a5a6a]"
          />
          <AssetPlaceholder
            label="Gutom + Bent Rod"
            className="scene-3__gutom absolute right-[8%] bottom-[10%] h-[75%] w-[55%] bg-gradient-to-b from-gutom-jacket to-[#2a3038]"
          />
          {/* Fishing line — snaps tight on scroll */}
          <div className="scene-3__line absolute top-[18%] right-[42%] h-[55%] w-0.5 origin-top bg-white/70 will-change-transform" />
          <div className="speech-bubble speech-bubble--jagged scene-3__bubble-hold absolute top-[10%] left-[6%] z-10 max-w-[12rem] opacity-0">
            GAHHH! … IT&apos;S A MONSTER! GOTTA HOLD ON!
          </div>
          <span className="sfx scene-3__sfx-bend absolute bottom-[28%] left-[10%] z-20 scale-50 text-3xl text-[#c8e0ec] opacity-0">
            BEEEND! SCREEEECH!
          </span>
        </div>
      </div>
    </section>
  );
}
