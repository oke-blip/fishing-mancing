"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ComicPhase = "intro" | "dive" | "narrative";

type SetupFn = () => void;

type MotionComicContextValue = {
  rootRef: RefObject<HTMLDivElement | null>;
  phase: ComicPhase;
  setPhase: (phase: ComicPhase) => void;
  registerSetup: (id: string, setup: SetupFn) => void;
  unregisterSetup: (id: string) => void;
};

const MotionComicContext = createContext<MotionComicContextValue | null>(null);

/**
 * MotionComicProvider — shared root + phase state.
 * Registered setups all run inside one gsap.context(); unmount reverts everything.
 */
export function MotionComicProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const setupsRef = useRef<Map<string, SetupFn>>(new Map());
  const [phase, setPhase] = useState<ComicPhase>("intro");
  const [version, setVersion] = useState(0);

  const registerSetup = useCallback((id: string, setup: SetupFn) => {
    setupsRef.current.set(id, setup);
    setVersion((v) => v + 1);
  }, []);

  const unregisterSetup = useCallback((id: string) => {
    setupsRef.current.delete(id);
    setVersion((v) => v + 1);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || setupsRef.current.size === 0) return;

    const ctx = gsap.context(() => {
      setupsRef.current.forEach((setup) => setup());
    }, root);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [version]);

  const value = useMemo(
    () => ({
      rootRef,
      phase,
      setPhase,
      registerSetup,
      unregisterSetup,
    }),
    [phase, registerSetup, unregisterSetup],
  );

  return (
    <MotionComicContext.Provider value={value}>
      <div ref={rootRef} className="motion-comic relative w-full">
        {children}
      </div>
    </MotionComicContext.Provider>
  );
}

export function useMotionComic() {
  const ctx = useContext(MotionComicContext);
  if (!ctx) {
    throw new Error("useMotionComic must be used within MotionComicProvider");
  }
  return ctx;
}

/** Register a GSAP setup with the shared MotionComic gsap.context(). */
export function useComicGsap(id: string, setup: SetupFn, deps: unknown[] = []) {
  const { registerSetup, unregisterSetup } = useMotionComic();
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useLayoutEffect(() => {
    const runner = () => setupRef.current();
    registerSetup(id, runner);
    return () => unregisterSetup(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, registerSetup, unregisterSetup, ...deps]);
}
