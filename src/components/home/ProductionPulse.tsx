"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { machinery, productionLines } from "@/lib/content";
import { useInViewOnce } from "@/lib/motion";
import { cn, faDigits } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeadline } from "@/components/ui/SplitHeadline";

type LineId = "upvc" | "aluminum" | "glass" | "security";

/**
 * Production Blueprint — a self-drawing CAD plotter. Each verified line is a
 * different drawing; the plotter head traces it and stations light in the
 * true order. UPVC visibly shows the four-corner simultaneous weld.
 */
export function ProductionPulse() {
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useInViewOnce(sectionRef, 0.25);
  const [lineId, setLineId] = useState<LineId>("upvc");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [drawKey, setDrawKey] = useState(0);

  const line = productionLines.find((l) => l.id === lineId) ?? productionLines[0];
  const steps = line.steps;

  useEffect(() => {
    if (!seen || !playing) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % steps.length), 2600);
    return () => window.clearInterval(t);
  }, [seen, playing, steps.length]);

  const choose = (id: LineId) => {
    setLineId(id);
    setStep(0);
    setPlaying(true);
    setDrawKey((k) => k + 1);
  };

  const pct = steps.length > 1 ? step / (steps.length - 1) : 1;

  return (
    <section ref={sectionRef} id="production-blueprint" className="relative overflow-hidden bg-paper py-24 md:py-36">
      {/* blueprint paper texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(rgba(21,23,26,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(21,23,26,.06)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(21,23,26,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(21,23,26,.1)_1px,transparent_1px)] [background-size:140px_140px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.05fr_.95fr] md:items-end md:gap-16">
          <div>
            <SectionLabel index="۰۳" total="۰۶" title="Production Blueprint" />
            <SplitHeadline text="ساخت، یک ترسیم پیوسته است؛ نه چند مرحله‌ی جدا." className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.06] text-ink" />
          </div>
          <p className="max-w-md text-balance text-sm leading-8 text-ink-soft md:justify-self-end md:text-base">
            چهار خط تولید مستقل در مجتمع {faDigits(9000)} مترمربعی سبزوار. هر خط را انتخاب کنید تا نقشه‌ی آن، ایستگاه به ایستگاه، ترسیم شود.
          </p>
        </div>

        {/* Line tabs */}
        <div className="mt-12 flex flex-wrap gap-2">
          {productionLines.map((l) => {
            const on = l.id === lineId;
            return (
              <button key={l.id} type="button" data-cursor="explore" onClick={() => choose(l.id as LineId)} aria-pressed={on}
                className={cn("group relative overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium transition-all", on ? "border-ink bg-ink text-cloud" : "border-ink/15 bg-white/50 text-ink-soft hover:border-ink/40 hover:text-ink")}>
                <span className="font-technical text-[10px] tracking-[0.2em] opacity-60">{l.index}</span>
                <span className="mr-2">{l.title.replace("خط تولید ", "")}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          {/* Blueprint canvas */}
          <div className="relative overflow-hidden rounded-[30px] border border-ink/12 bg-[#0f1a2b] p-5 text-cloud shadow-[0_46px_110px_-60px_rgba(15,26,43,.9)] md:p-8">
            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(143,157,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(143,157,255,.6)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(143,157,255,.9)_1px,transparent_1px),linear-gradient(90deg,rgba(143,157,255,.9)_1px,transparent_1px)] [background-size:120px_120px]" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="font-technical text-[10px] uppercase tracking-[0.3em] text-argon-glow">Drawing no. PW-{line.index}</p>
                <h3 className="mt-2 text-xl font-semibold md:text-2xl">{line.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {line.machinery ? <span className="hidden rounded-full border border-argon-glow/30 bg-argon/10 px-3 py-1.5 font-technical text-[10px] uppercase tracking-[0.16em] text-argon-glow sm:inline">{line.machinery}</span> : null}
                <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={playing} aria-label={playing ? "توقف" : "پخش"} className="flex size-10 items-center justify-center rounded-full border border-cloud/20 bg-white/[0.06] font-technical text-xs transition-colors hover:border-argon-glow hover:text-argon-glow">
                  {playing ? "Ⅱ" : "▶"}
                </button>
              </div>
            </div>

            <div className="relative mt-6 aspect-[16/10] w-full">
              <Blueprint key={drawKey} id={lineId} step={step} total={steps.length} />
            </div>

            {/* Station strip */}
            <div className="relative mt-4 border-t border-argon-glow/20 pt-5">
              <div className="relative h-1 w-full rounded-full bg-cloud/10">
                <div className="absolute inset-y-0 right-0 rounded-full bg-argon-glow transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `${pct * 100}%` }} />
                {steps.map((_, i) => {
                  const p = steps.length > 1 ? i / (steps.length - 1) : 1;
                  return (
                    <button key={i} type="button" onClick={() => { setStep(i); setPlaying(false); }} aria-label={`ایستگاه ${i + 1}`}
                      className={cn("absolute top-1/2 size-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 transition-all", i <= step ? "border-argon-glow bg-argon" : "border-cloud/30 bg-[#0f1a2b]", i === step && "scale-125 shadow-[0_0_0_6px_rgba(91,110,245,.2)]")}
                      style={{ right: `${p * 100}%` }} />
                  );
                })}
              </div>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-argon-glow">Station {faDigits(String(step + 1).padStart(2, "0"))} / {faDigits(String(steps.length).padStart(2, "0"))}</p>
                  <p key={step} className="observatory-swap mt-2 max-w-xl text-lg font-semibold leading-8 md:text-xl">{steps[step]}</p>
                </div>
                <p className="max-w-xs text-xs leading-6 text-cloud/50">{line.short}</p>
              </div>
            </div>
          </div>

          {/* Right rail: steps list + machinery */}
          <div className="flex flex-col gap-4">
            <ol className="rounded-[26px] border border-ink/10 bg-white/55 p-3 backdrop-blur-xl">
              {steps.map((s, i) => (
                <li key={s}>
                  <button type="button" onClick={() => { setStep(i); setPlaying(false); }} aria-pressed={i === step}
                    className={cn("flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-right transition-colors", i === step ? "bg-ink text-cloud" : i < step ? "text-ink" : "text-ink-soft hover:bg-paper-dim/70")}>
                    <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border font-technical text-[10px]", i === step ? "border-argon-glow text-argon-glow" : i < step ? "border-argon bg-argon text-cloud" : "border-ink/20 text-ink-mute")}>{i < step ? "✓" : String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm leading-6">{s}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {machinery.map((m) => (
                <div key={m.brand} className="group relative overflow-hidden rounded-[22px] border border-ink/10 bg-ink p-5 text-cloud">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-argon/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                  <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-argon-glow">{m.origin}</p>
                  <p className="mt-2 font-technical text-2xl font-semibold tracking-tight">{m.brand}</p>
                  <p className="mt-1 text-xs text-cloud/70">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Self-drawing SVG blueprints per production line                     */
/* ------------------------------------------------------------------ */

const STROKE = "#9fabff";
const DIM = "rgba(243,241,234,.5)";
const HOT = "#ffd27a";

function Blueprint({ id, step, total }: { id: LineId; step: number; total: number }) {
  const p = total > 1 ? step / (total - 1) : 1;
  const style = { "--p": p } as CSSProperties;
  return (
    <svg viewBox="0 0 800 500" className="blueprint h-full w-full" style={style} role="img" aria-label={`نقشه فنی ${id}`}>
      <defs>
        <filter id="bp-glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <marker id="bp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill={DIM} /></marker>
      </defs>
      {/* title block */}
      <g fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2">
        <rect x="560" y="430" width="222" height="52" fill="none" stroke={DIM} strokeWidth="0.8" />
        <text x="572" y="450">PARDIS · DOORS & WINDOWS · SABZEVAR</text>
        <text x="572" y="470">SCALE NTS · REV {String(step + 1).padStart(2, "0")}</text>
      </g>
      {id === "upvc" ? <UpvcDrawing step={step} /> : id === "aluminum" ? <AluminumDrawing step={step} /> : id === "glass" ? <GlassDrawing step={step} /> : <SecurityDrawing step={step} />}
    </svg>
  );
}

function Dim({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label: string }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const vertical = x1 === x2;
  return (
    <g stroke={DIM} strokeWidth="0.8" fontFamily="var(--font-technical)" fontSize="10" fill={DIM}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
      <text x={vertical ? mx + 8 : mx} y={vertical ? my : my - 6} textAnchor={vertical ? "start" : "middle"} stroke="none">{label}</text>
    </g>
  );
}

function UpvcDrawing({ step }: { step: number }) {
  // 0 cut · 1 machining · 2 weld 4 corners · 3 clean/level · 4 hardware
  const weld = step >= 2;
  const corners = [[150, 90], [650, 90], [650, 410], [150, 410]] as const;
  return (
    <g fill="none" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* frame outline — draws itself */}
      <rect className="bp-draw" x="150" y="90" width="500" height="320" pathLength={1} />
      <rect className="bp-draw" x="182" y="122" width="436" height="256" pathLength={1} style={{ animationDelay: "0.3s" }} />
      {/* profile chambers (multi-chamber section) hint at top */}
      <g className="bp-draw" style={{ animationDelay: "0.55s" }} strokeWidth="1">
        <rect x="150" y="90" width="500" height="32" pathLength={1} />
        <line x1="270" y1="90" x2="270" y2="122" pathLength={1} />
        <line x1="400" y1="90" x2="400" y2="122" pathLength={1} />
        <line x1="530" y1="90" x2="530" y2="122" pathLength={1} />
      </g>
      {/* cut marks (step 0) */}
      {step >= 0 ? <g className="bp-pop" stroke={HOT} strokeWidth="1.2"><line x1="150" y1="60" x2="150" y2="440" strokeDasharray="4 4" /><line x1="650" y1="60" x2="650" y2="440" strokeDasharray="4 4" /></g> : null}
      {/* machining pockets (step 1) */}
      {step >= 1 ? <g className="bp-pop"><rect x="596" y="230" width="14" height="40" /><rect x="190" y="230" width="14" height="40" /><circle cx="603" cy="215" r="3" /><circle cx="603" cy="285" r="3" /></g> : null}
      {/* four-corner weld (step 2) — simultaneous flash */}
      {corners.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="16" stroke={weld ? HOT : STROKE} strokeOpacity={weld ? 1 : 0.35} className={weld ? "bp-weld" : undefined} filter={weld ? "url(#bp-glow)" : undefined} />
          {weld ? <circle r="4" fill={HOT} stroke="none" className="bp-weld" /> : null}
        </g>
      ))}
      {/* level check (step 3) */}
      {step >= 3 ? <g className="bp-pop" stroke={DIM}><line x1="150" y1="250" x2="650" y2="250" strokeDasharray="2 6" /><line x1="400" y1="90" x2="400" y2="410" strokeDasharray="2 6" /></g> : null}
      {/* hardware (step 4) */}
      {step >= 4 ? <g className="bp-pop" stroke={HOT}><rect x="600" y="236" width="8" height="28" rx="2" /><line x1="604" y1="264" x2="604" y2="300" /></g> : null}
      <Dim x1={150} y1={460} x2={650} y2={460} label="W" />
      <Dim x1={700} y1={90} x2={700} y2={410} label="H" />
      <text x="160" y="480" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2">ELUMATEC · 4-CORNER SIMULTANEOUS WELD</text>
    </g>
  );
}

function AluminumDrawing({ step }: { step: number }) {
  // 0 CNC cut/machining · 1 joints · 2 assembly/hardware · 3 QC
  const headX = 150 + Math.min(step, 3) * 160;
  return (
    <g fill="none" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
      {/* thermal-break profile section */}
      <g className="bp-draw" pathLength={1}>
        <path d="M150 120 h180 v90 h-180 z" pathLength={1} />
        <path d="M330 120 h180 v90 h-180 z" pathLength={1} style={{ animationDelay: ".2s" }} />
        <path d="M330 140 v50 M345 140 v50" strokeDasharray="3 3" pathLength={1} style={{ animationDelay: ".4s" }} />
      </g>
      <text x="345" y="112" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2">POLYAMIDE THERMAL BREAK</text>
      {/* long extrusion + CNC head */}
      <rect className="bp-draw" x="150" y="290" width="500" height="60" pathLength={1} style={{ animationDelay: ".5s" }} />
      <g className="bp-head" style={{ transform: `translateX(${headX - 150}px)`, transition: "transform 900ms cubic-bezier(.16,1,.3,1)" }}>
        <rect x="140" y="250" width="24" height="34" rx="3" stroke={HOT} />
        <line x1="152" y1="284" x2="152" y2="350" stroke={HOT} strokeDasharray="3 3" />
        <circle cx="152" cy="350" r="3" fill={HOT} stroke="none" filter="url(#bp-glow)" />
      </g>
      {step >= 1 ? <g className="bp-pop" stroke={HOT}><path d="M150 290 l-20 -20 M650 290 l20 -20" /><rect x="128" y="262" width="10" height="10" /><rect x="662" y="262" width="10" height="10" /></g> : null}
      {step >= 2 ? <g className="bp-pop"><rect x="392" y="304" width="16" height="32" rx="2" /><circle cx="400" cy="298" r="2.5" /></g> : null}
      {step >= 3 ? <g className="bp-pop" stroke={DIM}><line x1="150" y1="380" x2="650" y2="380" strokeDasharray="2 6" /><text x="400" y="400" textAnchor="middle" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2" stroke="none">DIMENSIONAL QC · PASS</text></g> : null}
      <Dim x1={150} y1={420} x2={650} y2={420} label="L" />
      <text x="160" y="480" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2">CMS · CNC MACHINING CENTRE</text>
    </g>
  );
}

function GlassDrawing({ step }: { step: number }) {
  // 0 cut/wash · 1 spacer bend · 2 silica · 3 butyl+press · 4 argon · 5 polysulfide
  return (
    <g fill="none" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {/* two panes in section, seen from the top */}
      <rect className="bp-draw" x="200" y="120" width="12" height="280" pathLength={1} />
      <rect className="bp-draw" x="588" y="120" width="12" height="280" pathLength={1} style={{ animationDelay: ".15s" }} />
      {step >= 0 ? <g className="bp-pop" stroke={HOT}><line x1="206" y1="90" x2="206" y2="430" strokeDasharray="4 4" /><line x1="594" y1="90" x2="594" y2="430" strokeDasharray="4 4" /></g> : null}
      {/* spacer frame bent (step 1) */}
      {step >= 1 ? <rect className="bp-draw" x="224" y="136" width="352" height="248" rx="6" pathLength={1} /> : null}
      {/* silica beads (step 2) */}
      {step >= 2 ? <g className="bp-pop" fill={DIM} stroke="none">{Array.from({ length: 22 }, (_, i) => <circle key={i} cx={236 + i * 15.5} cy="146" r="2.2" />)}</g> : null}
      {/* butyl + press (step 3) */}
      {step >= 3 ? <g className="bp-pop" stroke="#1a1a1a" strokeWidth="5"><line x1="212" y1="140" x2="212" y2="380" /><line x1="588" y1="140" x2="588" y2="380" /></g> : null}
      {/* argon fill (step 4) */}
      {step >= 4 ? <g className="bp-pop"><rect x="236" y="150" width="328" height="220" fill="rgba(111,128,255,.18)" stroke="none" /><text x="400" y="265" textAnchor="middle" fontFamily="var(--font-technical)" fontSize="12" fill="#9fabff" letterSpacing="4" stroke="none">ARGON</text></g> : null}
      {/* polysulfide (step 5) */}
      {step >= 5 ? <rect className="bp-pop" x="190" y="110" width="420" height="300" rx="8" stroke="#1a1a1c" strokeWidth="6" /> : null}
      <Dim x1={200} y1={440} x2={600} y2={440} label="UNIT WIDTH" />
      <text x="160" y="480" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2">IGU LINE · MINISTRY OF ROADS & URBAN DEVELOPMENT CERTIFIED</text>
    </g>
  );
}

function SecurityDrawing({ step }: { step: number }) {
  // 0 sheet cut · 1 partitions · 2 lock/eye/knocker/handle · 3 veneer · 4 paint
  return (
    <g fill="none" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect className="bp-draw" x="290" y="60" width="220" height="400" pathLength={1} />
      {step >= 0 ? <g className="bp-pop" stroke={HOT}><line x1="270" y1="40" x2="530" y2="40" strokeDasharray="4 4" /><text x="400" y="30" textAnchor="middle" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2" stroke="none">FULL STEEL SHEET</text></g> : null}
      {step >= 1 ? <g className="bp-pop" strokeOpacity=".8"><line x1="363" y1="60" x2="363" y2="460" /><line x1="437" y1="60" x2="437" y2="460" /><line x1="290" y1="193" x2="510" y2="193" /><line x1="290" y1="327" x2="510" y2="327" /></g> : null}
      {step >= 2 ? <g className="bp-pop" stroke={HOT}><rect x="478" y="240" width="18" height="46" rx="2" /><circle cx="400" cy="150" r="5" /><circle cx="400" cy="200" r="9" /><line x1="470" y1="262" x2="440" y2="262" /></g> : null}
      {step >= 3 ? <g className="bp-pop" stroke="#d7b483" strokeOpacity=".9"><rect x="306" y="80" width="188" height="150" rx="3" /><rect x="306" y="250" width="188" height="190" rx="3" /></g> : null}
      {step >= 4 ? <rect className="bp-pop" x="284" y="54" width="232" height="412" rx="4" stroke="#8f9dff" strokeDasharray="6 4" /> : null}
      <Dim x1={290} y1={478} x2={510} y2={478} label="W" />
      <Dim x1={560} y1={60} x2={560} y2={460} label="H" />
      <text x="160" y="480" fontFamily="var(--font-technical)" fontSize="10" fill={DIM} letterSpacing="2">KALE LOCK · 1.25 mm FRAME SHEET · 5-YEAR WARRANTY</text>
    </g>
  );
}
