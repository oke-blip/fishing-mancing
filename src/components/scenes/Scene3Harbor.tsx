"use client";

import Image from "next/image";

/**
 * Scene3Harbor — Harbor Departure (inside HarborSeaSequence).
 *
 * Fixes empty-dock / missing Gutom:
 *  • Huge hull aperture so the crouch fills the open deck (image_16)
 *  • No ultra-tight overflow that clipped the xPercent entrance off-screen
 *  • image_14 only + mix-blend-lighten to key the black matte (no white box)
 *  • Bottom clip-path tucks boots behind the gunwale (image_17 depth)
 *
 * Scrub on .captain-gutom (opacity + xPercent) → HarborSeaSequence.
 */
export function Scene3Harbor() {
  return (
    <section
      id="scene-3-harbor"
      className="relative h-full w-screen shrink-0 overflow-hidden bg-[#061428]"
      aria-label="Scene 3: The Harbor Departure"
    >
      {/* image_13 — always visible */}
      <Image
        src="/assets/scene-3-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="harbor-bg pointer-events-none absolute inset-0 z-0 object-cover"
      />

      {/*
        Hull zone — sized like the large green rect over the open boat.
        Overflow is intentionally loose (wide) so the scrubbed xPercent
        entrance is not clipped away before fade-in completes.
      */}
      <div className="absolute top-[24%] left-[30%] z-10 h-[66%] w-[58%] md:top-[22%] md:left-[32%] md:h-[68%] md:w-[56%] lg:top-[20%] lg:left-[34%] lg:w-[54%]">
        <div className="captain-gutom absolute inset-0 will-change-[opacity,transform]">
          <Image
            src="/assets/scene-3-char.png"
            alt="Captain Gutom"
            fill
            sizes="(max-width: 768px) 80vw, 60vw"
            priority
            className="object-contain object-bottom mix-blend-lighten [clip-path:inset(0_0_10%_0)]"
          />
        </div>
      </div>
    </section>
  );
}
