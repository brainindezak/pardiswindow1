"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/**
 * Returns 0→1 as `ref` travels from entering the bottom of the viewport to
 * leaving the top. rAF-throttled and passive; safe for many instances.
 */
export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>, offset = 0): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const travelled = vh - rect.top + offset;
      setProgress(Math.min(1, Math.max(0, travelled / total)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, offset]);

  return progress;
}

/** True once the element has entered the viewport (never resets). */
export function useInViewOnce<T extends HTMLElement>(ref: RefObject<T | null>, threshold = 0.3): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, threshold, seen]);
  return seen;
}

/** Eased numeric counter that runs once when `start` flips true. */
export function useCountUp(target: number, start: boolean, duration = 1400): number {
  const [value, setValue] = useState(0);
  const frame = useRef(0);
  useEffect(() => {
    if (!start) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Jump straight to the final value, but do it on the next frame so the
      // update is not a synchronous cascading render inside the effect body.
      frame.current = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame.current);
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(target * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, start, duration]);
  return value;
}

/**
 * Subscribe to a CSS media query the React-correct way.
 *
 * `useSyncExternalStore` reads the value during render (no setState-in-effect
 * cascade) and keeps it live if the user changes the setting or rotates the
 * device. The server snapshot is `false`, so SSR markup matches the
 * pre-hydration client render.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True once the component has hydrated on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
