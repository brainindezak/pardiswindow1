"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "@/lib/content";
import { cn, faDigits } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeadline } from "@/components/ui/SplitHeadline";

const FACADES = [
  { cols: 6, rows: 4, tilt: -8, warm: 0.85 },
  { cols: 4, rows: 7, tilt: 6, warm: 0.6 },
  { cols: 8, rows: 3, tilt: -3, warm: 0.7 },
  { cols: 5, rows: 8, tilt: 10, warm: 0.5 },
  { cols: 7, rows: 5, tilt: -6, warm: 0.75 },
] as const;

/**
 * Light Projection Gallery — a sun-path study. Time of day sweeps a light
 * source across an abstract facade; shadows, reflections and pane glow are
 * computed from the angle. Clearly labelled abstract; records are verified.
 */
export function ProjectLightArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hour, setHour] = useState(15.5);
  const [auto, setAuto] = useState(true);
  const [dir, setDir] = useState<1 | -1>(1);
  const project = projects[active];
  const facade = FACADES[active % FACADES.length];

  // Sun sweep 6:00 → 19:00
  useEffect(() => {
    if (!auto) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = window.setInterval(() => setHour((h) => (h >= 19 ? 6 : h + 0.05)), 60);
    return () => window.clearInterval(t);
  }, [auto]);

  const step = (d: 1 | -1) => {
    setDir(d);
    setActive((a) => (a + d + projects.length) % projects.length);
  };

  // Sun geometry
  const t = (hour - 6) / 13; // 0..1
  const azimuth = -60 + t * 120; // deg, left→right
  const elevation = Math.sin(t * Math.PI); // 0..1..0
  const lightX = 50 + Math.sin((azimuth * Math.PI) / 180) * 48; // %
  const lightY = 78 - elevation * 62; // %
  const shadowDx = -Math.sin((azimuth * Math.PI) / 180) * 18;
  const shadowDy = (1 - elevation) * 14 + 6;
  const warmth = 1 - elevation; // golden at low sun
  const hueA = `rgba(${Math.round(255)}, ${Math.round(214 - warmth * 60)}, ${Math.round(160 - warmth * 80)}, `;

  const vars = {
    "--lx": `${lightX}%`,
    "--ly": `${lightY}%`,
    "--sx": `${shadowDx}px`,
    "--sy": `${shadowDy}px`,
    "--sun": `${hueA}${0.55 + warmth * 0.25})`,
    "--sun-soft": `${hueA}${0.12 + warmth * 0.1})`,
    "--sky": `rgba(${Math.round(20 + elevation * 30)}, ${Math.round(22 + elevation * 40)}, ${Math.round(32 + elevation * 60)}, 1)`,
  } as CSSProperties;

  const hh = Math.floor(hour);
  const mm = Math.round((hour - hh) * 60);

  return (
    <section ref={sectionRef} id="project-light" className="relative overflow-hidden bg-[#161312] py-24 text-cloud md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_20%_100%,rgba(169,128,90,.22),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1fr_.9fr] md:items-end md:gap-20">
          <div>
            <SectionLabel index="۰۵" total="۰۶" title="Light Projection Gallery" tone="dark" />
            <SplitHeadline text="هر پروژه، یک قاب تازه برای نور است." className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.8vw,4.2rem)] font-semibold leading-[1.06]" />
          </div>
          <p className="max-w-md text-balance text-sm leading-8 text-cloud/60 md:justify-self-end md:text-base">
            مسیر خورشید را روی یک نمای انتزاعی حرکت دهید و ببینید بازشوها چگونه نور را قاب می‌کنند. رکوردها همان اجراهای مستند پردیس هستند؛ نما بازسازی واقعی پروژه نیست.
          </p>
        </div>

        <div className="mt-14 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
          {/* Sun-path stage */}
          <div className="light-stage relative min-h-[520px] overflow-hidden rounded-[34px] border border-cloud/10 shadow-[0_50px_120px_-60px_rgba(0,0,0,.95)] sm:min-h-[600px]" style={vars}>
            <div className="absolute inset-0 transition-colors duration-700" style={{ background: "var(--sky)" }} />
            <div className="light-sun pointer-events-none absolute inset-0" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(243,241,234,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,.5)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
            {/* ground line */}
            <div className="absolute inset-x-0 bottom-[16%] h-px bg-cloud/25" />

            {/* header */}
            <div className="absolute inset-x-6 top-6 flex items-start justify-between md:inset-x-8 md:top-8">
              <div>
                <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-cloud/45">Sun-path study · abstract facade</p>
                <p className="mt-1 font-technical text-[10px] uppercase tracking-[0.2em] text-bronze">Record {faDigits(String(active + 1).padStart(2, "0"))} / {faDigits(String(projects.length).padStart(2, "0"))}</p>
              </div>
              <div className="rounded-full border border-cloud/15 bg-black/30 px-3 py-1.5 font-technical text-[11px] tabular-nums text-cloud/80 backdrop-blur-md">
                {faDigits(String(hh).padStart(2, "0"))}:{faDigits(String(mm).padStart(2, "0"))}
              </div>
            </div>

            {/* facade */}
            <Facade key={active} cols={facade.cols} rows={facade.rows} tilt={facade.tilt} dir={dir} lightX={lightX} lightY={lightY} />

            {/* sun disc */}
            <div className="light-disc pointer-events-none absolute size-16 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: "var(--lx)", top: "var(--ly)" }} />

            {/* controls */}
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-cloud/15 bg-black/35 p-4 backdrop-blur-xl md:inset-x-8 md:bottom-8">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="sun-hour" className="text-sm font-medium">ساعت روز</label>
                <button type="button" onClick={() => setAuto((a) => !a)} className="rounded-full border border-cloud/20 px-3 py-1 font-technical text-[10px] uppercase tracking-[0.2em] text-cloud/70 hover:border-bronze hover:text-bronze">{auto ? "Pause sun" : "Play sun"}</button>
              </div>
              <input id="sun-hour" type="range" min={6} max={19} step={0.05} value={hour} onChange={(e) => { setAuto(false); setHour(Number(e.target.value)); }} className="sun-range mt-3 w-full" style={{ "--t": t } as CSSProperties} />
              <div className="mt-1 flex justify-between font-technical text-[9px] uppercase tracking-[0.2em] text-cloud/40"><span>06:00</span><span>Noon</span><span>19:00</span></div>
            </div>
          </div>

          {/* Dossier */}
          <div className="flex flex-col rounded-[34px] border border-cloud/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
            <div className="flex items-center justify-between border-b border-cloud/10 pb-5">
              <span className="font-technical text-[10px] uppercase tracking-[0.24em] text-cloud/45">Project dossier</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="قبلی" className="flex size-11 items-center justify-center rounded-full border border-cloud/20 transition-colors hover:border-bronze hover:text-bronze active:scale-95">→</button>
                <button type="button" onClick={() => step(1)} aria-label="بعدی" className="flex size-11 items-center justify-center rounded-full border border-cloud/20 transition-colors hover:border-bronze hover:text-bronze active:scale-95">←</button>
              </div>
            </div>

            <div key={active} className={cn("mt-8 flex-1", dir === 1 ? "slide-in-right" : "slide-in-left")}>
              <p className="font-technical text-[64px] leading-none tabular-nums text-cloud/10 md:text-[96px]">{faDigits(String(active + 1).padStart(2, "0"))}</p>
              <h3 className="-mt-6 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight md:-mt-9">{project.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2 font-technical text-[10px] uppercase tracking-[0.2em]">
                <span className="rounded-full border border-cloud/15 px-3 py-1 text-cloud/70">{project.province}</span>
                <span className="rounded-full border border-bronze/40 px-3 py-1 text-bronze">{faDigits(project.year)}</span>
              </div>
              <p className="mt-6 text-sm leading-8 text-cloud/70 md:text-base">{project.detail}</p>
            </div>

            <div className="mt-8 border-t border-cloud/10 pt-5">
              <div className="flex gap-1.5">
                {projects.map((p, i) => (
                  <button key={p.id} type="button" onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }} aria-label={p.title} className={cn("h-1 flex-1 rounded-full transition-all", i === active ? "bg-bronze" : "bg-cloud/15 hover:bg-cloud/35")} />
                ))}
              </div>
              <a href="/projects" data-cursor="view" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bronze transition-colors hover:text-cloud">آرشیو کامل پروژه‌ها <span>←</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Facade({ cols, rows, tilt, dir, lightX, lightY }: { cols: number; rows: number; tilt: number; dir: 1 | -1; lightX: number; lightY: number }) {
  const cells = Array.from({ length: cols * rows }, (_, i) => i);
  return (
    <div className={cn("absolute inset-x-[12%] top-[20%] bottom-[16%] [perspective:1100px]", dir === 1 ? "slide-in-right" : "slide-in-left")}>
      <div className="light-facade relative h-full w-full" style={{ transform: `rotateY(${tilt}deg)` }}>
        {/* building shadow on ground */}
        <div className="light-shadow absolute -bottom-1 left-0 right-0 h-8 rounded-[50%] blur-md" />
        <div className="absolute inset-0 border border-cloud/25 bg-[#1e1a19]" />
        <div className="absolute inset-3 grid gap-[4px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0,1fr))` }}>
          {cells.map((c) => {
            // Pane centre in facade space (0..100); the specular highlight is
            // the sun's position relative to this pane, so it slides across
            // the facade as the hour changes and each pane catches it in turn.
            const col = c % cols;
            const row = Math.floor(c / cols);
            const cx = ((col + 0.5) / cols) * 100;
            const cy = ((row + 0.5) / rows) * 100;
            const px = 50 + (lightX - cx) * 1.4;
            const py = 50 + (lightY - cy) * 1.4;
            const dist = Math.hypot(lightX - cx, lightY - cy);
            const intensity = Math.max(0, 1 - dist / 55);
            return (
              <span key={c} className="light-pane relative overflow-hidden border border-cloud/15" style={{ "--px": `${px}%`, "--py": `${py}%`, "--k": intensity } as CSSProperties}>
                <span className="light-reveal absolute inset-0" />
                <span className="light-mullion absolute inset-y-0 left-1/2 w-px bg-cloud/20" />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
