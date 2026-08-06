# Motion Comics

Scroll-driven landscape motion comic built with **Next.js**, **Tailwind CSS**, and **GSAP ScrollTrigger**.

## Scenes

| Scene | Layout | Story |
|-------|--------|--------|
| 0 | Pinned | Captain Gutom intro → water-dive transition |
| 1 | Horizontal pin | Harbor → sail → cast (`image_0793a2`) |
| 2 | Vertical | Jig sinks; monster waits (`image_079383`) |
| 3 | Pinned | Bite + SFX sequence (`image_079360`) |
| 4 | Horizontal pin | Breach + Gutom reveal → Next Chapter (`image_079342`) |

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Best viewed in landscape / wide desktop.

## Swapping placeholders

Colored `AssetPlaceholder` blocks are tagged with labels. Replace them with layered PNGs:

```tsx
// Example
<Image src="/assets/gutom-boat.png" alt="" fill className="object-contain" />
```

Reference art lives under `public/assets/` when you add your panels.

## Animation model

- **Scroll-linked:** GSAP timelines with `ScrollTrigger` + `scrub: true`
- **Idle:** `yoyo: true, repeat: -1` (boat bob, fish swim, god-ray pulse)
- **Cleanup:** `gsap.context()` inside `MotionComic` reverts on unmount
