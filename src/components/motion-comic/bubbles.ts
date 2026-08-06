import gsap from "gsap";

export type NaturalBubbleOptions = {
  count: number;
  className?: string;
  sizeRange?: [number, number];
  opacityRange?: [number, number];
};

/**
 * createNaturalBubbles — spawn diverse semi-transparent bubble divs.
 * Pure JS DOM (no particle library). Call inside gsap.context() so
 * child nodes + tweens are cleaned up together.
 */
export function createNaturalBubbles(
  container: HTMLElement,
  {
    count,
    className = "natural-bubble",
    sizeRange = [5, 28],
    opacityRange = [0.1, 0.48],
  }: NaturalBubbleOptions,
): HTMLElement[] {
  const bubbles: HTMLElement[] = [];
  const [minSize, maxSize] = sizeRange;
  const [minOp, maxOp] = opacityRange;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const size = minSize + Math.random() * (maxSize - minSize);
    const opacity = minOp + Math.random() * (maxOp - minOp);
    const highlight = 25 + Math.random() * 20;

    el.className = className;
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = [
      "position:absolute",
      "border-radius:9999px",
      "pointer-events:none",
      `width:${size}px`,
      `height:${size}px`,
      `opacity:${opacity}`,
      `left:${Math.random() * 100}%`,
      `bottom:${-8 - Math.random() * 35}%`,
      `background:radial-gradient(circle at ${highlight}% ${highlight}%, rgba(255,255,255,0.6), rgba(150,210,230,0.18) 42%, rgba(255,255,255,0.06))`,
      "border:1px solid rgba(255,255,255,0.22)",
      "will-change:transform",
      "box-shadow:inset -1px -1px 0 rgba(255,255,255,0.15)",
    ].join(";");

    container.appendChild(el);
    bubbles.push(el);
  }

  return bubbles;
}

/**
 * naturalIdleBubblesTimeline — continuous rise + wavy X drift.
 * Returns a parent timeline (repeat:-1 children) for optional pause/kill.
 */
export function naturalIdleBubblesTimeline(
  bubbles: HTMLElement[],
  options: { speedMult?: number } = {},
): gsap.core.Timeline {
  const { speedMult = 1 } = options;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const tl = gsap.timeline({ defaults: { force3D: true } });

  bubbles.forEach((el, i) => {
    const riseDuration = (7 + Math.random() * 12) / speedMult;
    const waveAmp = 14 + Math.random() * 38;
    const waveDuration = (1.5 + Math.random() * 2.6) / speedMult;
    const startDelay = Math.random() * riseDuration * 0.7;

    const rise = gsap.fromTo(
      el,
      { y: vh * (0.12 + (i % 9) * 0.1) },
      {
        y: -vh * 0.28 - Math.random() * 90,
        duration: riseDuration,
        ease: "none",
        repeat: -1,
        delay: startDelay,
      },
    );

    const wave = gsap.to(el, {
      x: `+=${waveAmp * (i % 2 === 0 ? 1 : -1)}`,
      duration: waveDuration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: Math.random() * waveDuration,
    });

    tl.add(rise, 0);
    tl.add(wave, 0);
  });

  return tl;
}

/** Alias kept for older dive helpers */
export const spawnBubbles = createNaturalBubbles;
export const animateIdleBubbles = (bubbles: HTMLElement[]) => {
  naturalIdleBubblesTimeline(bubbles);
};

export function prepareDiveBubbles(bubbles: HTMLElement[]): void {
  bubbles.forEach((el, i) => {
    gsap.set(el, {
      y: 90 + (i % 10) * 22,
      x: (Math.random() - 0.5) * 28,
      opacity: 0,
    });
  });
}
