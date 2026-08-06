import { AssetPlaceholder } from "./AssetPlaceholder";

/**
 * Scene 2 — Into the Depths (deep vertical scroll).
 * Swap for layers from image_079383.jpg.
 */
export function Scene2Depths() {
  return (
    <section
      id="scene-2"
      className="scene-2 relative w-full"
      aria-label="Scene 2: Into the Depths"
    >
      {/* Tall scroll runway — camera follows jig downward */}
      <div className="scene-2__column relative h-[300vh] w-full overflow-hidden">
        <div className="scene-2__world sticky top-0 h-screen w-full overflow-hidden">
          <div className="scene-2__layers absolute inset-x-0 top-0 h-[200%] will-change-transform">
            {/* Surface / upper water */}
            <div className="comic-panel absolute inset-x-0 top-0 h-1/2 bg-[#0e5a6e]">
              <AssetPlaceholder
                label="BG: Surface Cross-Section (image_079383)"
                className="absolute inset-0 bg-gradient-to-b from-[#87b8c8] via-[#1a7a8a] to-[#0a3a4a]"
              />
              <AssetPlaceholder
                label="Boat Silhouette Surface"
                className="absolute top-[6%] left-1/2 h-8 w-28 -translate-x-1/2 bg-[#1a2030]/90"
              />
              <AssetPlaceholder
                label="God Rays"
                className="scene-2__rays absolute top-0 left-[30%] h-[55%] w-[40%] bg-gradient-to-b from-white/25 to-transparent opacity-60"
              />

              {/* Tiny fish school — idle swim */}
              <div className="scene-2__fish-school absolute top-[45%] left-[20%] flex gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="scene-2__fish h-2 w-5 rounded-full bg-[#c5d4dc]/80"
                    style={{ marginTop: (i % 3) * 6 }}
                  />
                ))}
              </div>

              {/* Hidden glowing eye in rocks */}
              <div className="scene-2__eye absolute top-[52%] right-[18%] h-8 w-8 rounded-full bg-monster-eye opacity-0 shadow-[0_0_28px_10px_rgba(240,196,32,0.55)]" />

              <span className="comic-label absolute top-5 left-5 z-10">
                — DEEP WATER —
              </span>
              <span className="sfx scene-2__sfx-twirl absolute top-[38%] left-[42%] z-10 text-3xl text-white/80 opacity-0">
                TWIRL-TWIRL
              </span>
            </div>

            {/* Ocean floor */}
            <div className="comic-panel absolute inset-x-0 bottom-0 h-1/2 bg-[#0a1820]">
              <AssetPlaceholder
                label="BG: Ocean Floor Cave"
                className="absolute inset-0 bg-gradient-to-b from-[#0a3a4a] via-[#0a1a22] to-[#050c10]"
              />
              <AssetPlaceholder
                label="Rocks & Coral"
                className="absolute bottom-0 left-0 h-[40%] w-full bg-gradient-to-t from-[#1a2a28] to-transparent"
              />

              <div className="scene-2__monster absolute right-[-20%] bottom-[12%] h-[55%] w-[48%] opacity-0">
                <AssetPlaceholder
                  label="Giant Fish Monster"
                  className="h-full w-full bg-gradient-to-l from-[#3a4038] via-[#2a3028] to-[#1a2018]"
                />
              </div>

              <div className="speech-bubble speech-bubble--jagged scene-2__bubble absolute top-[18%] right-[28%] z-10 opacity-0">
                FINALLY… IT&apos;S HERE.
              </div>
              <span className="comic-label absolute right-5 bottom-5 z-10">
                On the Shelf.
              </span>
            </div>
          </div>

          {/* Metal jig — tracked in sticky viewport */}
          <div className="scene-2__jig absolute top-[18%] left-1/2 z-30 h-14 w-8 -translate-x-1/2 will-change-transform">
            <AssetPlaceholder
              label="Sinking Metal Jig"
              className="h-full w-full rounded-b-full bg-gradient-to-b from-[#e8ecf0] to-[#6a7480] shadow-lg"
            />
            <div className="absolute top-0 left-1/2 h-[200vh] w-px -translate-x-1/2 -translate-y-full bg-white/25" />
          </div>

          {/* Subtle water distortion overlay */}
          <div
            className="scene-2__distortion pointer-events-none absolute inset-0 z-40 opacity-30 mix-blend-soft-light"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.15),transparent_55%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
