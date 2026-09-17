import type { ReactNode } from "react";
import { SplitHeadline } from "@/components/ui/SplitHeadline";
import { faDigits } from "@/lib/utils";

/**
 * Elevation Header — the shared masthead for every interior page. Built as a
 * drawing sheet: index in the corner, a measured rule, a drawn elevation
 * motif on the left, and the page title set as a masked reveal.
 */
export function PageHero({
  index,
  kicker,
  title,
  description,
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink/10 bg-[#101218] pb-14 pt-32 text-cloud md:pb-20 md:pt-40">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(243,241,234,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,.55)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(143,157,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(143,157,255,.7)_1px,transparent_1px)] [background-size:150px_150px]" />
      <div className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full bg-argon/20 blur-[130px]" />

      {/* drawn elevation motif */}
      <svg aria-hidden className="pointer-events-none absolute -left-10 bottom-[-18%] hidden h-[130%] w-[380px] text-cloud/[0.13] lg:block" viewBox="0 0 300 420" fill="none" stroke="currentColor">
        <rect x="40" y="30" width="220" height="330" strokeWidth="1.5" />
        <rect x="62" y="52" width="176" height="286" strokeWidth="1" />
        <line x1="150" y1="52" x2="150" y2="338" strokeWidth="1" />
        <path d="M238 52 L150 195 L238 338" strokeWidth="0.8" strokeDasharray="5 5" />
        <path d="M62 52 L150 195 L62 338" strokeWidth="0.8" strokeDasharray="5 5" />
        <line x1="40" y1="382" x2="260" y2="382" strokeWidth="0.8" />
        <line x1="40" y1="374" x2="40" y2="390" strokeWidth="0.8" />
        <line x1="260" y1="374" x2="260" y2="390" strokeWidth="0.8" />
      </svg>

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex items-center gap-4">
          <span className="font-technical text-xs tabular-nums tracking-[0.2em] text-argon-glow">{faDigits(index)}</span>
          <span className="h-px w-12 bg-cloud/25" />
          <span className="font-technical text-[10px] uppercase tracking-[0.3em] text-cloud/50">{kicker}</span>
        </div>

        <SplitHeadline
          as="h1"
          text={title}
          className="mt-7 max-w-4xl text-balance text-[clamp(2.1rem,5.2vw,4rem)] font-semibold leading-[1.1]"
        />

        <p className="mt-6 max-w-2xl text-balance text-[15px] leading-8 text-cloud/65 md:text-base">{description}</p>

        {children}
      </div>
    </header>
  );
}
