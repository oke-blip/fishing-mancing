"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene8Climax — cliffhanger zoom reveal.
 *
 * Pinned scrub: subject scales/fades in, then ending text appears.
 * Replace /assets/scene8-bg.jpg and scene8-subject.png with finals.
 */
export function Scene8Climax() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const subject = section.querySelector<HTMLElement>(".scene-8__subject");
      const ending = section.querySelector<HTMLElement>(".scene-8__ending");
      if (!subject || !ending) return;

      gsap.set(subject, { scale: 0.5, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(ending, { opacity: 0, y: 24 });

      const climaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      climaxTl
        .addLabel("reveal-start")
        .to(
          subject,
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            duration: 0.7,
          },
          "reveal-start",
        )
        .addLabel("subject-full")
        .to(
          ending,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.25,
          },
          "subject-full",
        )
        .addLabel("cliffhanger");
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-8-climax"
      className="relative h-[100dvh] w-[100dvw] overflow-hidden bg-[#050a10]"
      aria-label="Scene 8: Climax — To Be Continued"
    >
      {/* Background — replace scene8-bg.jpg with final still / plate */}
      <Image
        src="/assets/scene8-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-comic-ink/80 via-transparent to-comic-ink/40"
        aria-hidden
      />

      {/* Foreground subject — replace scene8-subject.png with transparent PNG */}
      <div className="scene-8__subject absolute inset-[8%] z-10 will-change-[opacity,transform] md:inset-[10%]">
        <Image
          src="/assets/scene8-subject.png"
          alt="The monster revealed"
          fill
          sizes="100vw"
          className="object-contain object-center"
          priority
        />
      </div>

      <div className="scene-8__ending absolute inset-x-0 bottom-[12%] z-20 flex flex-col items-center px-6 text-center will-change-[opacity,transform]">
        <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.4em] text-sea-foam uppercase">
          End of Chapter One
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-tide)] text-4xl tracking-[0.12em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] md:text-6xl">
          TO BE CONTINUED...
        </h2>
      </div>
    </section>
  );
}
