import { AssetPlaceholder } from "./AssetPlaceholder";

/**
 * Scene 1 — The Departure (horizontal scroll).
 * Swap panels for layers from image_0793a2.jpg.
 */
export function Scene1Departure() {
  return (
    <section
      id="scene-1"
      className="scene-1 relative h-[100dvh] w-full overflow-hidden"
      aria-label="Scene 1: The Departure"
    >
      <div className="scene-1__track flex h-full w-[300vw] will-change-transform">
        {/* Panel A — Harbor docks */}
        <div className="comic-panel relative h-full w-[100dvw] shrink-0 bg-[#1a1530]">
          <AssetPlaceholder
            label="BG: Harbor Night (image_0793a2)"
            className="absolute inset-0 bg-gradient-to-b from-[#2a2048] via-[#1e3550] to-[#1a3a28]"
          />
          <AssetPlaceholder
            label="MG: Dock Lights"
            className="absolute top-[28%] right-[18%] h-3 w-3 rounded-full bg-harbor-glow shadow-[0_0_24px_8px_rgba(232,148,58,0.5)]"
          />
          <AssetPlaceholder
            label="FG: Nets & Crates"
            className="absolute bottom-0 left-0 h-[32%] w-[42%] bg-gradient-to-tr from-[#2d4a28] to-[#3a5c30]/80"
          />

          <div className="scene-1__boat absolute bottom-[18%] left-[28%] h-[38%] w-[36%]">
            <AssetPlaceholder
              label="Boat + Gutom (harbor)"
              className="absolute inset-0 rounded-sm bg-gradient-to-b from-gutom-jacket/90 to-[#3a3a42]"
            />
          </div>

          <span className="comic-label absolute top-5 left-5 z-10">
            Harbor Docks — 05:00 AM
          </span>
          <div className="speech-bubble absolute top-[18%] left-[52%] z-10 opacity-0 scene-1__bubble-a">
            Gotta check the fuel lines… She&apos;s gotta hold up today.
          </div>
        </div>

        {/* Panel B — Setting sail */}
        <div className="comic-panel relative h-full w-[100dvw] shrink-0 bg-[#4a7a9a]">
          <AssetPlaceholder
            label="BG: Open Sea Sunrise"
            className="absolute inset-0 bg-gradient-to-b from-[#87b8d4] via-[#f0c070] to-[#2a6a7a]"
          />
          <AssetPlaceholder
            label="Sun"
            className="absolute top-[22%] left-[12%] h-16 w-16 rounded-full bg-white shadow-[0_0_60px_20px_rgba(255,220,140,0.55)]"
          />
          <AssetPlaceholder
            label="Sea Surface Parallax"
            className="scene-1__sea absolute bottom-0 left-0 h-[45%] w-full bg-gradient-to-t from-[#0e4a5c] to-[#3a8a9a]/70"
          />

          <div className="scene-1__boat-sail absolute bottom-[22%] left-[20%] h-[34%] w-[40%]">
            <AssetPlaceholder
              label="Boat + Gutom (sailing)"
              className="absolute inset-0 bg-gradient-to-b from-[#5a4630] to-[#2a3038]"
            />
          </div>

          <span className="comic-label absolute top-5 left-5 z-10">
            Mid-morning
          </span>
          <div className="speech-bubble absolute top-[16%] right-[18%] z-10 opacity-0 scene-1__bubble-b">
            Perfect spot. Right on the edge of the shelf.
          </div>
          <span className="sfx scene-1__sfx-vroom absolute right-[8%] bottom-[40%] z-10 text-5xl text-white opacity-0 md:text-7xl">
            VRRRROOM
          </span>
        </div>

        {/* Panel C — The cast */}
        <div className="comic-panel relative h-full w-[100dvw] shrink-0 bg-[#5a9aba]">
          <AssetPlaceholder
            label="BG: Day Sea + Gulls"
            className="absolute inset-0 bg-gradient-to-b from-[#8ec4e0] via-[#6aabcc] to-[#2a7a8a]"
          />
          <AssetPlaceholder
            label="Waves FG"
            className="absolute bottom-0 left-0 h-[40%] w-full bg-gradient-to-t from-[#1a5a6a] to-transparent"
          />

          <div className="scene-1__boat-cast absolute bottom-[20%] right-[22%] h-[36%] w-[38%]">
            <AssetPlaceholder
              label="Boat + Gutom Casting"
              className="absolute inset-0 bg-gradient-to-b from-gutom-jacket to-[#2a3038]"
            />
          </div>

          {/* Metal jig — cast off-screen on scroll */}
          <div className="scene-1__jig absolute top-[38%] left-[48%] z-20 h-10 w-6">
            <AssetPlaceholder
              label="Metal Jig"
              className="h-full w-full rounded-b-full bg-gradient-to-b from-[#d8dde2] to-[#7a8490] shadow-md"
            />
          </div>

          <div className="speech-bubble absolute top-[14%] left-[12%] z-10 opacity-0 scene-1__bubble-c">
            Let&apos;s see who&apos;s waiting down there.
          </div>
          <span className="sfx scene-1__sfx-whoosh absolute top-[32%] left-[28%] z-10 text-5xl text-[#7ec8e0] opacity-0 md:text-6xl">
            WHOOSH!
          </span>
        </div>
      </div>
    </section>
  );
}
