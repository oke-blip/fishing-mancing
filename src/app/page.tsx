import { SmoothScroll } from "@/components/SmoothScroll";
import { Scene1VideoIntro } from "@/components/scenes/Scene1VideoIntro";
import { Scene2DiveTransition } from "@/components/scenes/Scene2DiveTransition";
import { HarborSeaSequence } from "@/components/scenes/HarborSeaSequence";
import { Scene5DeepOceanVideo } from "@/components/scenes/Scene5DeepOceanVideo";
import { Scene6MonsterReveal } from "@/components/scenes/Scene6MonsterReveal";
import { Scene7Video } from "@/components/scenes/Scene7Video";
import { Scene8Video } from "@/components/scenes/Scene8Video";

/**
 * Motion Comic — Scenes 6–8 share scrubbed-video + Lenis lerp mechanics.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-sea-deep">
        <Scene1VideoIntro />
        <Scene2DiveTransition />
        <HarborSeaSequence />
        <Scene5DeepOceanVideo />
        <Scene6MonsterReveal />
        <Scene7Video />
        <Scene8Video />
      </main>
    </SmoothScroll>
  );
}
