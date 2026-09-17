"use client";

import { useEffect, useRef, useState } from "react";
import { quality } from "@/lib/content";
import { useCountUp, useInViewOnce } from "@/lib/motion";
import { cn, faDigits } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeadline } from "@/components/ui/SplitHeadline";

const GATES = [
  { id: "dimension", n: "01", title: "ابعاد و تراز قاب", instrument: "Dial gauge", detail: "ابعاد و تراز محصول در هر چهار خط تولید پیش از تحویل بازرسی می‌شود.", metric: { label: "خوانش تراز", value: 0, unit: "mm", tolerance: "±0.1" } },
  { id: "weld", n: "02", title: "استحکام درز جوش", instrument: "Elumatec", detail: "در خط UPVC، جوش هم‌زمان چهار گوشه برای استحکام درز و اجرای بدون برآمدگی کنترل می‌شود.", metric: { label: "گوشه‌های جوش هم‌زمان", value: 4, unit: "/4", tolerance: "PASS" } },
  { id: "hardware", n: "03", title: "اجرای یراق‌آلات", instrument: "Function test", detail: "نصب و عملکرد یراق‌آلات، بخشی از کنترل محصول پیش از تحویل است.", metric: { label: "چرخه‌ی عملکرد", value: 100, unit: "%", tolerance: "OK" } },
  { id: "glass", n: "04", title: "واحد شیشه دوجداره", instrument: "IGU line", detail: "برش، شست‌وشو، اسپیسر، سیلیکاژل، بوتیل، پرس، آرگون و پلی‌سولفاید در خط شیشه بازرسی می‌شوند.", metric: { label: "مراحل بازرسی", value: 8, unit: "/8", tolerance: "CERTIFIED" } },
] as const;

type Gate = (typeof GATES)[number];

/**
 * Measurement Bench — inspection expressed as instrumentation: a settling
 * dial gauge, a caliper opening to the verified 1.25 mm sheet thickness, and
 * four gates that stamp PASS in sequence. Copy is verified QC scope only.
 */
export function QualityScanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useInViewOnce(sectionRef, 0.3);
  const [activeId, setActiveId] = useState<Gate["id"]>("dimension");
  const [stamped, setStamped] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState(false);
  const active = GATES.find((g) => g.id === activeId) ?? GATES[0];

  // Sequential inspection run
  useEffect(() => {
    if (!running) return;
    let i = 0;
    // Reset on the next frame so the run does not cascade a render inside
    // the effect body.
    const reset = requestAnimationFrame(() => {
      setStamped(new Set());
      setActiveId(GATES[0].id);
    });
    const t = window.setInterval(() => {
      setStamped((s) => new Set(s).add(GATES[i].id));
      i += 1;
      if (i >= GATES.length) {
        window.clearInterval(t);
        setRunning(false);
        return;
      }
      setActiveId(GATES[i].id);
    }, 1400);
    return () => {
      cancelAnimationFrame(reset);
      window.clearInterval(t);
    };
  }, [running]);

  const startedRef = useRef(false);
  useEffect(() => {
    if (!seen || startedRef.current) return;
    startedRef.current = true;
    const id = requestAnimationFrame(() => setRunning(true));
    return () => cancelAnimationFrame(id);
  }, [seen]);

  const sheet = useCountUp(125, seen, 1600) / 100; // 1.25 mm
  const warranty = useCountUp(5, seen, 1200);

  return (
    <section ref={sectionRef} id="quality-bench" className="relative overflow-hidden bg-paper-dim py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1fr_.92fr] md:items-end md:gap-20">
          <div>
            <SectionLabel index="۰۴" total="۰۶" title="Measurement Bench" />
            <SplitHeadline text="کیفیت، با ابزار اندازه‌گیری می‌شود؛ نه با ادعا." className="mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.07] text-ink" />
          </div>
          <p className="max-w-md text-balance text-sm leading-8 text-ink-soft md:justify-self-end md:text-base">{quality.process}</p>
        </div>

        <div className="mt-14 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
          {/* Instruments */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            {/* Dial gauge */}
            <div className="relative overflow-hidden rounded-[30px] border border-ink/10 bg-paper p-6 shadow-[0_30px_70px_-50px_rgba(21,23,26,.5)]">
              <div className="flex items-center justify-between">
                <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-ink-mute">Dial gauge · alignment</p>
                <span className={cn("rounded-full px-2.5 py-1 font-technical text-[10px] uppercase tracking-[0.18em]", stamped.has("dimension") ? "bg-success/15 text-success" : "bg-ink/5 text-ink-mute")}>{stamped.has("dimension") ? "PASS" : "MEASURING"}</span>
              </div>
              <DialGauge settle={seen} pass={stamped.has("dimension")} />
              <p className="mt-2 text-center font-technical text-[10px] uppercase tracking-[0.24em] text-ink-mute">Tolerance band ±0.1 mm</p>
            </div>

            {/* Caliper */}
            <div className="relative overflow-hidden rounded-[30px] border border-ink/10 bg-ink p-6 text-cloud shadow-[0_30px_70px_-50px_rgba(21,23,26,.8)]">
              <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-argon-glow">Caliper · security door frame sheet</p>
              <Caliper opening={sheet} />
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-technical text-[42px] leading-none tabular-nums">{faDigits(sheet.toFixed(2))}<span className="mr-2 text-base text-cloud/50">mm</span></p>
                  <p className="mt-2 text-xs text-cloud/60">ضخامت ورق چهارچوب درب امنیتی</p>
                </div>
                <div className="text-left">
                  <p className="font-technical text-[42px] leading-none tabular-nums text-bronze">{faDigits(warranty)}</p>
                  <p className="mt-2 text-xs text-cloud/60">سال ضمانت</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gates */}
          <div className="rounded-[30px] border border-ink/10 bg-paper p-5 shadow-[0_30px_70px_-50px_rgba(21,23,26,.5)] md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-5">
              <div>
                <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-ink-mute">Inspection run</p>
                <p className="mt-1 text-sm text-ink-soft">{faDigits(stamped.size)} / {faDigits(GATES.length)} گیت تأیید شده</p>
              </div>
              <button type="button" data-cursor="scan" onClick={() => setRunning(true)} disabled={running} className={cn("rounded-full border px-4 py-2 text-xs font-medium transition-all", running ? "border-ink/10 text-ink-mute" : "border-ink bg-ink text-cloud hover:bg-argon hover:border-argon")}>
                {running ? "در حال بازرسی…" : "اجرای مجدد بازرسی"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {GATES.map((g) => {
                const on = g.id === activeId;
                const ok = stamped.has(g.id);
                return (
                  <button key={g.id} type="button" data-cursor="detail" onClick={() => setActiveId(g.id)} aria-pressed={on}
                    className={cn("group relative overflow-hidden rounded-[22px] border p-5 text-right transition-all duration-300", on ? "border-ink bg-ink text-cloud shadow-[0_24px_50px_-30px_rgba(21,23,26,.8)]" : "border-ink/10 bg-paper-dim/50 text-ink hover:border-ink/30")}>
                    <div className="flex items-start justify-between">
                      <span className={cn("font-technical text-[10px] tracking-[0.2em]", on ? "text-argon-glow" : "text-ink-mute")}>{g.n} · {g.instrument}</span>
                      <span className={cn("stamp rounded-md border px-2 py-0.5 font-technical text-[10px] tracking-[0.2em] transition-all", ok ? "is-stamped border-success text-success" : "border-transparent text-transparent")}>PASS</span>
                    </div>
                    <p className="mt-4 text-base font-semibold">{g.title}</p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className={cn("font-technical text-2xl tabular-nums", on ? "text-cloud" : "text-ink")}>{ok ? faDigits(g.metric.value) : "—"}</span>
                      <span className={cn("font-technical text-xs", on ? "text-cloud/50" : "text-ink-mute")}>{g.metric.unit}</span>
                      <span className={cn("mr-auto font-technical text-[10px] tracking-[0.18em]", ok ? "text-success" : on ? "text-cloud/40" : "text-ink-mute")}>{g.metric.tolerance}</span>
                    </div>
                    <span className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-right bg-argon transition-transform duration-700", ok ? "scale-x-100" : "scale-x-0")} />
                  </button>
                );
              })}
            </div>

            <div key={activeId} className="observatory-swap mt-5 rounded-[22px] border border-ink/10 bg-paper-dim/60 p-5">
              <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-ink-mute">{active.n} · {active.instrument}</p>
              <p className="mt-2 text-sm leading-8 text-ink">{active.detail}</p>
            </div>

            <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-6 text-ink-soft">{quality.certificate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DialGauge({ settle, pass }: { settle: boolean; pass: boolean }) {
  const [angle, setAngle] = useState(-120);
  useEffect(() => {
    if (!settle) return;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      raf = requestAnimationFrame(() => setAngle(0));
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 2200);
      // damped oscillation settling to 0
      const a = -120 * Math.exp(-4.2 * t) * Math.cos(9 * t);
      setAngle(a);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [settle]);

  const ticks = Array.from({ length: 41 }, (_, i) => i - 20);
  return (
    <svg viewBox="0 0 240 150" className="mx-auto mt-4 w-full max-w-[280px]" role="img" aria-label="گیج تراز">
      <path d="M20 130 A100 100 0 0 1 220 130" fill="none" stroke="rgba(21,23,26,.12)" strokeWidth="14" />
      <path d="M96 41 A100 100 0 0 1 144 41" fill="none" stroke={pass ? "#2f8f5b" : "#5b6ef5"} strokeWidth="14" strokeOpacity=".35" />
      {ticks.map((t) => {
        const a = (t / 20) * 90;
        const r = a % 30 === 0 ? 14 : 7;
        const rad = ((a - 90) * Math.PI) / 180;
        const x1 = 120 + Math.cos(rad) * 86;
        const y1 = 130 + Math.sin(rad) * 86;
        const x2 = 120 + Math.cos(rad) * (86 - r);
        const y2 = 130 + Math.sin(rad) * (86 - r);
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#15171a" strokeOpacity={a % 30 === 0 ? 0.7 : 0.3} strokeWidth={a % 30 === 0 ? 1.4 : 0.8} />;
      })}
      <g transform={`rotate(${angle} 120 130)`} style={{ transition: "none" }}>
        <line x1="120" y1="130" x2="120" y2="46" stroke={pass ? "#2f8f5b" : "#c0442f"} strokeWidth="2" strokeLinecap="round" />
        <circle cx="120" cy="130" r="6" fill="#15171a" />
      </g>
      <text x="120" y="118" textAnchor="middle" fontFamily="var(--font-technical)" fontSize="12" fill="#15171a" opacity=".7">{faDigits((angle / 1200).toFixed(2))} mm</text>
    </svg>
  );
}

function Caliper({ opening }: { opening: number }) {
  // maps 0..1.25mm → 0..120px jaw travel
  const travel = (opening / 1.25) * 120;
  return (
    <svg viewBox="0 0 320 90" className="mt-5 w-full" role="img" aria-label="کولیس">
      <rect x="10" y="30" width="300" height="14" rx="2" fill="rgba(243,241,234,.12)" stroke="rgba(243,241,234,.3)" />
      {Array.from({ length: 31 }, (_, i) => (
        <line key={i} x1={20 + i * 9.5} y1={30} x2={20 + i * 9.5} y2={i % 5 === 0 ? 22 : 26} stroke="rgba(243,241,234,.6)" strokeWidth={i % 5 === 0 ? 1.2 : 0.7} />
      ))}
      {/* fixed jaw */}
      <rect x="20" y="44" width="10" height="36" rx="1" fill="#f3f1ea" />
      {/* moving jaw */}
      <g style={{ transform: `translateX(${travel}px)`, transition: "transform 200ms linear" }}>
        <rect x="30" y="44" width="10" height="36" rx="1" fill="#8f9dff" />
        <rect x="26" y="18" width="46" height="26" rx="3" fill="#1f2229" stroke="rgba(143,157,255,.5)" />
      </g>
      {/* the specimen sheet */}
      <rect x="30" y="52" width={Math.max(0, travel)} height="20" fill="rgba(169,128,90,.55)" />
    </svg>
  );
}
