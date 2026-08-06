import { AssetPlaceholder } from "./AssetPlaceholder";

/**
 * Scene 4 — The Struggle & Reveal (horizontal scroll → freeze-frame).
 * Swap for layers from image_079342.jpg.
 */
export function Scene4Struggle() {
  return (
    <section
      id="scene-4"
      className="scene-4 relative h-[100dvh] w-full overflow-hidden"
      aria-label="Scene 4: The Struggle & Reveal"
    >
      <div className="scene-4__track flex h-full w-[200vw] will-change-transform">
        {/* Panel — Monster breach */}
        <div className="comic-panel relative h-full w-[100dvw] shrink-0 bg-[#1a2830]">
          <AssetPlaceholder
            label="BG: Stormy Sea (image_079342)"
            className="scene-4__sky absolute inset-0 bg-gradient-to-b from-[#2a3540] via-[#3a4a55] to-[#1a4a5a]"
          />
          <AssetPlaceholder
            label="Ocean Surface"
            className="absolute bottom-0 left-0 h-[42%] w-full bg-gradient-to-t from-[#0a2a38] to-[#2a5a6a]"
          />

          <div className="scene-4__monster absolute bottom-[8%] left-[18%] h-[72%] w-[55%] will-change-transform">
            <AssetPlaceholder
              label="Monster Leaping"
              className="h-full w-full bg-gradient-to-t from-[#2a3228] via-[#4a5040] to-[#3a4038]"
            />
          </div>

          <div className="scene-4__splash absolute bottom-[28%] left-[12%] h-[35%] w-[40%] will-change-transform">
            <AssetPlaceholder
              label="Splash Assets"
              className="h-full w-full bg-gradient-to-t from-white/70 via-white/30 to-transparent"
            />
          </div>

          <span className="sfx scene-4__sfx-whoosh absolute top-[10%] left-[8%] z-10 text-4xl text-white opacity-0 md:text-6xl">
            KA-WHOOSH!
          </span>
          <span className="sfx scene-4__sfx-thrash absolute top-[22%] left-[28%] z-10 text-3xl text-[#d0e0e8] opacity-0">
            THRAAASH!
          </span>
          <div className="speech-bubble speech-bubble--jagged scene-4__bubble-monster absolute top-[18%] right-[10%] z-10 opacity-0">
            RRRRAAAGH! YOU CAN&apos;T ESCAPE!
          </div>
        </div>

        {/* Panel — Gutom intensity + next chapter freeze */}
        <div className="comic-panel relative h-full w-[100dvw] shrink-0 bg-[#6a8a9a]">
          <AssetPlaceholder
            label="BG: Pale Sky Close-up"
            className="absolute inset-0 bg-gradient-to-b from-[#a8c0cc] to-[#6a8a98]"
          />

          <div className="scene-4__gutom-panel absolute inset-[8%] overflow-hidden will-change-transform">
            <AssetPlaceholder
              label="Gutom Intense Expression"
              className="absolute inset-0 bg-gradient-to-b from-gutom-jacket via-[#5a4838] to-[#2a3038]"
            />
          </div>

          <span className="sfx scene-4__sfx-creak absolute bottom-[30%] left-[8%] z-10 text-4xl text-white opacity-0">
            CREEAK! SNAP!
          </span>
          <div className="speech-bubble speech-bubble--jagged scene-4__bubble-gutom absolute top-[12%] right-[8%] z-10 opacity-0">
            IT&apos;S ABOUT THE GODDAMN TIME!
          </div>

          {/* End freeze-frame */}
          <div className="scene-4__freeze pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-comic-ink/0 opacity-0">
            <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.4em] text-sea-foam uppercase">
              End of Chapter One
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-wider text-white md:text-6xl">
              NEXT CHAPTER
            </h2>
            <p className="mt-4 font-[family-name:var(--font-comic)] text-2xl text-comic-yellow">
              TO BE CONTINUED…
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
