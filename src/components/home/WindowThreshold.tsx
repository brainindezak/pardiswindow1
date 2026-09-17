"use client";

import { useEffect, useRef } from "react";
import { useHydrated, useMediaQuery } from "@/lib/motion";
import { IdentityField } from "./IdentityField";

function easeOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * THE THRESHOLD — the site's signature entrance.
 *
 * A single architectural window, closed, fills the first viewport. As the
 * visitor scrolls, its two casement sashes swing open on their hinges and
 * the visitor passes through the frame into the Identity Field beyond.
 * Used exactly once, at the door — a threshold should only be crossed once.
 */
export function WindowThreshold() {
  const wrapperRef = useRef<HTMLElement>(null);
  const leftSashRef = useRef<HTMLDivElement>(null);
  const rightSashRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  // Read during render via an external store: correct on the very first
  // client paint and live if the OS setting changes mid-session.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated || reduced) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;

    const apply = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

      const openAmt = easeOutCubic(Math.min(1, progress / 0.62));
      const fadeAmt = easeOutCubic(Math.max(0, (progress - 0.72) / 0.28));

      wrapper.style.setProperty("--tp", progress.toFixed(4));

      if (leftSashRef.current) {
        leftSashRef.current.style.transform = `rotateY(${-96 * openAmt}deg) rotateX(${-3 * openAmt}deg)`;
      }
      if (rightSashRef.current) {
        rightSashRef.current.style.transform = `rotateY(${96 * openAmt}deg) rotateX(${-3 * openAmt}deg)`;
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = String(0.1 + openAmt * 0.55);
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - Math.min(1, progress / 0.1));
      }
      if (skipRef.current) {
        skipRef.current.style.opacity = String(1 - Math.min(1, progress / 0.14));
        skipRef.current.style.pointerEvents = progress > 0.14 ? "none" : "auto";
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(1 - fadeAmt);
        overlayRef.current.style.pointerEvents = progress > 0.97 ? "none" : "auto";
      }

      raf = requestAnimationFrame(apply);
    };

    raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [reduced, hydrated]);

  const skipIntro = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const target = wrapper.offsetTop + wrapper.offsetHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  /* Reduced-motion visitors skip the kinetic hero entirely — but the page
     must keep its H1, so emit the heading on its own. */
  if (reduced) {
    return (
      <h1 className="sr-only">
        در و پنجره پردیس — تولیدکننده درب و پنجره UPVC، آلومینیوم و شیشه‌های چندجداره در سبزوار
      </h1>
    );
  }

  return (
    <section
      ref={wrapperRef}
      aria-label="ورود به تجربه‌ی پردیس"
      className="relative bg-graphite"
      style={{ height: hydrated ? "220vh" : "100vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-graphite">
        {/* The hero is a purely visual composition (every layer below is
            aria-hidden), so the page's accessible title lives here. Visually
            hidden, but it is what screen readers and search engines read as
            the document's H1. */}
        <h1 className="sr-only">
          در و پنجره پردیس — تولیدکننده درب و پنجره UPVC، آلومینیوم و شیشه‌های چندجداره در سبزوار
        </h1>

        {/* Layer 0 — the identity field beyond the window */}
        <div className="absolute inset-0">
          <IdentityField />
          <div
            ref={glowRef}
            className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(143,157,255,0.35),transparent_70%)]"
            style={{ opacity: 0.1 }}
          />
        </div>

        {/* Layer 1 — the window rig */}
        <div ref={overlayRef} className="absolute inset-0 flex items-center justify-center px-4">
          <div className="relative aspect-[16/10] w-[min(94vw,1200px)] max-h-[78vh]" style={{ perspective: "2200px" }}>
            <div className="absolute inset-0 rounded-[6px] border-[10px] border-graphite-soft shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)] md:border-[14px]">
              <CornerMark className="-left-px -top-px" />
              <CornerMark className="-right-px -top-px rotate-90" />
              <CornerMark className="-right-px -bottom-px rotate-180" />
              <CornerMark className="-left-px -bottom-px -rotate-90" />
            </div>

            <div className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-graphite-soft md:w-[9px]" />

            <div className="absolute inset-y-0 left-0 w-1/2 pl-[10px] md:pl-[14px]" style={{ transformStyle: "preserve-3d" }}>
              <div
                ref={leftSashRef}
                className="h-full w-full border border-cloud/10 bg-gradient-to-br from-cloud/[0.14] via-argon/10 to-transparent backdrop-blur-[1px]"
                style={{ transformOrigin: "left center", transformStyle: "preserve-3d", willChange: "transform" }}
              >
                <div className="absolute inset-3 border border-cloud/15 md:inset-4" />
                <span className="absolute right-3 top-1/2 h-9 w-1.5 -translate-y-1/2 rounded-full bg-cloud/25 md:right-4" />
              </div>
            </div>

            <div className="absolute inset-y-0 right-0 w-1/2 pr-[10px] md:pr-[14px]" style={{ transformStyle: "preserve-3d" }}>
              <div
                ref={rightSashRef}
                className="h-full w-full border border-cloud/10 bg-gradient-to-bl from-cloud/[0.14] via-argon/10 to-transparent backdrop-blur-[1px]"
                style={{ transformOrigin: "right center", transformStyle: "preserve-3d", willChange: "transform" }}
              >
                <div className="absolute inset-3 border border-cloud/15 md:inset-4" />
                <span className="absolute left-3 top-1/2 h-9 w-1.5 -translate-y-1/2 rounded-full bg-cloud/25 md:left-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-5 pt-8 font-technical text-[10px] uppercase tracking-[0.32em] text-cloud-mute md:px-10 md:pt-10">
          <span>Pardis · Doors & Windows</span>
          <span>The Threshold</span>
        </div>

        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 text-cloud-mute md:bottom-14">
          <span className="flex size-9 items-center justify-center rounded-full border border-cloud/25">
            <span className="block h-3.5 w-px animate-pulse bg-argon-glow" />
          </span>
          <p className="font-technical text-[10px] uppercase tracking-[0.28em]">اسکرول کنید و وارد شوید</p>
        </div>

        <button
          ref={skipRef}
          type="button"
          onClick={skipIntro}
          className="absolute bottom-8 left-5 rounded-full border border-cloud/25 px-4 py-2 font-technical text-[10px] uppercase tracking-[0.2em] text-cloud-mute transition-colors hover:border-argon-glow hover:text-argon-glow md:bottom-10 md:left-10"
        >
          رد شدن از مقدمه ↓
        </button>
      </div>
    </section>
  );
}

function CornerMark({ className }: { className: string }) {
  return (
    <span className={"pointer-events-none absolute size-3 " + className} aria-hidden>
      <span className="absolute inset-x-0 top-0 h-px bg-argon-glow/70" />
      <span className="absolute inset-y-0 left-0 w-px bg-argon-glow/70" />
    </span>
  );
}
