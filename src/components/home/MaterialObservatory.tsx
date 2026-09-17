"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { glassLayers, quality } from "@/lib/content";
import { prefersReducedMotion, supportsWebGL } from "@/lib/device";
import { useScrollProgress } from "@/lib/motion";
import { cn, faDigits } from "@/lib/utils";
import { SplitHeadline } from "@/components/ui/SplitHeadline";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ObservatoryLayer } from "@/components/three/GlassObservatoryScene";

const GlassObservatoryScene = dynamic(() => import("@/components/three/GlassObservatoryScene"), { ssr: false, loading: () => null });

const ORDER: ObservatoryLayer[] = ["outer-pane", "spacer", "butyl", "argon", "polysulfide", "inner-pane"];

/**
 * Optic Observatory — a pinned, scroll-driven dissection of one Pardis
 * insulated glass unit. Real refraction in WebGL; hand-drawn technical
 * section as the accessible fallback. Every label is a verified layer.
 */
export function MaterialObservatory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const separationRef = useRef(0);
  const [active, setActive] = useState<ObservatoryLayer>("argon");
  const [manual, setManual] = useState<number | null>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setWebgl(supportsWebGL());
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Scroll → separation (pinned range 0.18 … 0.72 of the section travel).
  const scrollSep = Math.min(1, Math.max(0, (progress - 0.18) / 0.54));
  const separation = manual ?? scrollSep;
  separationRef.current = separation;

  // Auto-focus the layer that's "in the light" as we pull apart.
  useEffect(() => {
    if (manual !== null) return;
    const idx = Math.min(ORDER.length - 1, Math.floor(scrollSep * ORDER.length));
    if (scrollSep > 0.05) setActive(ORDER[idx]);
  }, [scrollSep, manual]);

  const activeIndex = ORDER.indexOf(active);
  const layer = glassLayers.find((l) => l.id === active) ?? glassLayers[3];

  return (
    <section ref={sectionRef} id="material-observatory" className="relative bg-graphite text-cloud" style={{ height: "260vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgba(91,110,245,.22),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(243,241,234,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,.5)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

        {/* Stage */}
        <div className="absolute inset-0">
          {webgl ? (
            <GlassObservatoryScene separationRef={separationRef} activeLayer={active} onPick={(l) => { setActive(l); setManual(separation < 0.4 ? 0.85 : separation); }} reducedMotion={reduced} active={inView} />
          ) : webgl === false ? (
            <SectionFallback separation={separation} active={active} />
          ) : null}
        </div>

        {/* Copy — right column, RTL first */}
        <div className="relative z-10 mx-auto grid h-full w-full max-w-[1440px] grid-rows-[auto_1fr_auto] px-5 pb-8 pt-28 md:px-10 md:pb-12 md:pt-32">
          <div className="flex items-start justify-between">
            <div className="max-w-xl">
              <SectionLabel index="۰۲" total="۰۶" title="Optic Observatory" tone="dark" />
              <SplitHeadline text="یک شیشه، شش لایه‌ی تصمیم‌گیرنده." className="mt-5 text-balance text-[clamp(1.9rem,4.6vw,3.9rem)] font-semibold leading-[1.08]" />
            </div>
            <div className="hidden text-left md:block">
              <p className="font-technical text-[10px] uppercase tracking-[0.3em] text-cloud/40">Separation</p>
              <p className="mt-1 font-technical text-3xl tabular-nums text-argon-glow">{faDigits(Math.round(separation * 100)).padStart(2, "۰")}%</p>
            </div>
          </div>

          <div />

          {/* Bottom console */}
          <div className="grid gap-4 md:grid-cols-[1.1fr_.9fr] md:items-end">
            <div className="rounded-[26px] border border-cloud/15 bg-graphite/70 p-5 backdrop-blur-xl md:p-6">
              <div className="flex items-center justify-between border-b border-cloud/10 pb-4">
                <span className="font-technical text-[10px] uppercase tracking-[0.26em] text-cloud/45">Layer {faDigits(String(activeIndex + 1).padStart(2, "0"))} / ۰۶</span>
                <span className="font-technical text-[10px] uppercase tracking-[0.2em] text-argon-glow">{active.replace("-", " ")}</span>
              </div>
              <h3 key={active} className="observatory-swap mt-5 text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">{layer.label}</h3>
              <p key={`${active}-d`} className="observatory-swap mt-3 max-w-lg text-sm leading-8 text-cloud/70 [animation-delay:80ms]">{layer.detail}</p>

              <div className="mt-6">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={separation}
                  onChange={(e) => setManual(Number(e.target.value))}
                  aria-label="جداسازی لایه‌های شیشه"
                  className="material-range w-full"
                  style={{ "--s": separation } as React.CSSProperties}
                />
                <div className="mt-2 flex items-center justify-between font-technical text-[9px] uppercase tracking-[0.2em] text-cloud/40">
                  <span>Sealed</span>
                  {manual !== null ? (
                    <button type="button" onClick={() => setManual(null)} className="text-argon-glow hover:text-cloud">بازگشت به اسکرول</button>
                  ) : (
                    <span>Scroll to dissect</span>
                  )}
                  <span>Exploded</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:grid-cols-2">
              {ORDER.map((id, i) => {
                const l = glassLayers.find((x) => x.id === id)!;
                const on = id === active;
                return (
                  <button
                    key={id}
                    type="button"
                    data-cursor="detail"
                    onClick={() => { setActive(id); setManual(Math.max(separation, 0.85)); }}
                    aria-pressed={on}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border px-3 py-3 text-right transition-all duration-300",
                      on ? "border-argon bg-argon/20 text-cloud shadow-[0_0_0_1px_rgba(143,157,255,.5),0_18px_40px_-24px_rgba(91,110,245,.9)]" : "border-cloud/12 bg-white/[0.04] text-cloud/70 hover:border-cloud/30",
                    )}
                  >
                    <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-cloud/45">{faDigits(String(i + 1).padStart(2, "0"))}</span>
                    <span className="mt-1 block truncate text-[12px] font-medium">{l.label}</span>
                    <span className={cn("absolute inset-x-0 bottom-0 h-0.5 bg-argon-glow transition-transform duration-500 origin-right", on ? "scale-x-100" : "scale-x-0")} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate ribbon */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 hidden border-t border-cloud/10 bg-graphite/60 py-2 backdrop-blur md:block">
          <p className="mx-auto max-w-[1440px] px-10 text-center font-technical text-[10px] uppercase tracking-[0.28em] text-cloud/45">{quality.certificate}</p>
        </div>
      </div>
    </section>
  );
}

/** Accessible, no-WebGL fallback: an exploded technical section in SVG. */
function SectionFallback({ separation, active }: { separation: number; active: ObservatoryLayer }) {
  const spread = 26 + separation * 120;
  const layersSvg: { id: ObservatoryLayer; w: number; fill: string }[] = [
    { id: "outer-pane", w: 10, fill: "rgba(200,232,228,.55)" },
    { id: "spacer", w: 16, fill: "rgba(180,187,194,.9)" },
    { id: "butyl", w: 5, fill: "#141414" },
    { id: "argon", w: 28, fill: "rgba(111,128,255,.35)" },
    { id: "polysulfide", w: 7, fill: "#1a1a1c" },
    { id: "inner-pane", w: 10, fill: "rgba(200,232,228,.55)" },
  ];
  const total = layersSvg.reduce((a, l) => a + l.w, 0) + spread * (layersSvg.length - 1);
  let x = 500 - total / 2;
  return (
    <svg viewBox="0 0 1000 560" className="h-full w-full" role="img" aria-label="مقطع فنی شیشه دوجداره">
      {layersSvg.map((l) => {
        const rect = <rect key={l.id} x={x} y={90} width={l.w} height={380} fill={l.fill} stroke={l.id === active ? "#8f9dff" : "rgba(243,241,234,.3)"} strokeWidth={l.id === active ? 2 : 1} />;
        x += l.w + spread;
        return rect;
      })}
    </svg>
  );
}
