import { SmoothScroll } from "@/components/SmoothScroll";
import { PortraitLock } from "@/components/PortraitLock";
import { ScrollBackgroundVideo } from "@/components/ScrollBackgroundVideo";
import { Scene1VideoIntro } from "@/components/scenes/Scene1VideoIntro";
import { Scene2DiveTransition } from "@/components/scenes/Scene2DiveTransition";
import { HarborSeaSequence } from "@/components/scenes/HarborSeaSequence";
import { Scene5DeepOceanVideo } from "@/components/scenes/Scene5DeepOceanVideo";
import { Scene6MonsterReveal } from "@/components/scenes/Scene6MonsterReveal";
import { Scene7Video } from "@/components/scenes/Scene7Video";
import { Scene8Video } from "@/components/scenes/Scene8Video";

/**
 * PortraitLock sits above the comic root so it stays visible when
 * portrait mode hides .comic-root. Landscape unlocks scroll + scenes.
 */
export default function Home() {
  return (
    <>
      <PortraitLock />
      <SmoothScroll>
        <ScrollBackgroundVideo
          src="/assets/YOUR_BACKGROUND_VIDEO.mp4"
          minViewportHeights={8}
        >
          <main className="relative min-h-[var(--app-height,100svh)] w-full overflow-x-hidden bg-transparent">
            <Scene1VideoIntro />
            <Scene2DiveTransition />
            <HarborSeaSequence />
            <Scene5DeepOceanVideo />
            <Scene6MonsterReveal />
            <Scene7Video />
            <Scene8Video />
          </main>
        </ScrollBackgroundVideo>
      </SmoothScroll>
    </>
  );
}
