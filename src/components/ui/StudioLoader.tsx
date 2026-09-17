"use client";

import { useEffect, useState } from "react";
import { faDigits } from "@/lib/utils";

const PHASES = ["آماده‌سازی استودیو", "ساخت هندسه‌ی پروفیل", "محاسبه‌ی نور و شیشه"];

/**
 * The studio's dedicated loading state — never a generic spinner. A window
 * aperture parts on its hinges while the pipeline reports what it is doing,
 * reusing the site's entrance gesture at component scale.
 */
export function StudioLoader() {
  const [phase, setPhase] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t0 = window.setTimeout(() => setOpen(true), 180);
    const t1 = window.setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 1100);
    return () => {
      window.clearTimeout(t0);
      window.clearInterval(t1);
    };
  }, []);

  return (
    <div role="status" aria-label="در حال بارگذاری استودیو" className="absolute inset-0 grid place-items-center bg-[#0e1013]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(243,241,234,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,.6)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      <div className="relative flex flex-col items-center gap-7">
        {/* aperture */}
        <div className="relative h-[92px] w-[132px] overflow-hidden rounded-[5px] border border-cloud/20 md:h-[112px] md:w-[164px]" style={{ perspective: "900px" }}>
          <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_60%,rgba(91,110,245,.45),transparent_70%)]" />
          <div
            className="absolute inset-y-0 left-0 w-1/2 origin-left border-r border-cloud/15 bg-gradient-to-br from-cloud/[0.16] via-argon/10 to-transparent transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ transform: open ? "rotateY(-72deg)" : "rotateY(0deg)" }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/2 origin-right border-l border-cloud/15 bg-gradient-to-bl from-cloud/[0.16] via-argon/10 to-transparent transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)]"
            style={{ transform: open ? "rotateY(72deg)" : "rotateY(0deg)" }}
          />
          <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-cloud/20" />
          {(["-left-px -top-px", "-right-px -top-px rotate-90", "-right-px -bottom-px rotate-180", "-left-px -bottom-px -rotate-90"] as const).map((pos, i) => (
            <span key={i} className={`absolute size-2.5 ${pos}`}>
              <span className="absolute inset-x-0 top-0 h-px bg-argon-glow/70" />
              <span className="absolute inset-y-0 left-0 w-px bg-argon-glow/70" />
            </span>
          ))}
        </div>

        {/* staged readout */}
        <div className="flex flex-col items-center gap-2.5">
          <p key={phase} className="observatory-swap font-technical text-[10px] uppercase tracking-[0.26em] text-cloud/70">
            {PHASES[phase]}
          </p>
          <div className="flex gap-1.5" aria-hidden>
            {PHASES.map((_, i) => (
              <span
                key={i}
                className={`h-px w-7 transition-colors duration-500 ${i === phase ? "bg-argon-glow" : "bg-cloud/20"}`}
              />
            ))}
          </div>
          <p className="font-technical text-[9px] tabular-nums tracking-[0.2em] text-cloud/30">
            PARDIS · {faDigits(String(phase + 1).padStart(2, "0"))}/{faDigits(String(PHASES.length).padStart(2, "0"))}
          </p>
        </div>
      </div>
    </div>
  );
}
