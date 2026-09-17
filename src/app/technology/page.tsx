import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { company, glassLayers, machinery, productionLines } from "@/lib/content";
import { faDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "فناوری تولید",
  description:
    "چهار خط تولید در و پنجره پردیس — UPVC، آلومینیوم، شیشه دوجداره و درب امنیتی — با ماشین‌آلات Elumatec آلمان و CMS در مجتمع ۹٬۰۰۰ مترمربعی سبزوار.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        index="۰۲"
        kicker="Manufacturing Technology"
        title="فناوری‌ای که در پس هر قاب پنهان است."
        description={`مجتمع پردیس با ${faDigits(company.facilityAreaSqm)} مترمربع مساحت تولیدی در ${company.location}، چهار خط تولید مستقل را با ماشین‌آلات تمام‌اتوماتیک اداره می‌کند.`}
      >
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
          {machinery.map((m) => (
            <div key={m.brand} className="group rounded-2xl border border-cloud/12 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:border-argon-glow/40">
              <div className="flex items-baseline justify-between">
                <p className="font-technical text-xl font-semibold tracking-tight text-cloud">{m.brand}</p>
                <span className="font-technical text-[10px] uppercase tracking-[0.22em] text-argon-glow">{m.origin}</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-cloud/60">{m.role}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Four lines — long-form reference */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="۰۱" total="۰۳" title="Production Lines" />
          <h2 className="mt-5 max-w-2xl text-balance text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-[1.15] text-ink">
            چهار خط، چهار منطق ساخت متفاوت.
          </h2>

          <div className="mt-14 flex flex-col gap-4">
            {productionLines.map((line, i) => (
              <Reveal key={line.id} delay={i * 70}>
                <article className="group grid gap-6 rounded-[26px] border border-ink/10 bg-paper-dim/40 p-6 transition-colors hover:border-ink/25 md:grid-cols-[auto_1fr_1.25fr] md:items-start md:gap-10 md:p-8">
                  <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="font-technical text-[clamp(2rem,4vw,3.2rem)] leading-none tabular-nums text-ink/15 transition-colors group-hover:text-argon/35">
                      {faDigits(line.index)}
                    </span>
                    {line.machinery ? (
                      <span className="rounded-full border border-bronze/35 bg-bronze-soft/40 px-2.5 py-1 font-technical text-[9px] uppercase tracking-[0.15em] text-bronze">
                        {line.machinery}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold leading-snug text-ink">{line.title}</h3>
                    <p className="mt-2 text-sm text-argon">{line.short}</p>
                    <p className="mt-4 text-sm leading-8 text-ink-soft">{line.description}</p>
                  </div>

                  <ol className="grid gap-2 sm:grid-cols-2">
                    {line.steps.map((step, si) => (
                      <li key={step} className="flex items-start gap-2.5 rounded-xl border border-ink/[0.07] bg-paper p-3">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink/[0.06] font-technical text-[9px] tabular-nums text-ink-soft">
                          {faDigits(String(si + 1).padStart(2, "0"))}
                        </span>
                        <span className="text-xs leading-6 text-ink">{step}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Glazing build-up reference */}
      <section className="border-y border-ink/10 bg-paper-dim py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="۰۲" total="۰۳" title="Glazing Build-up" />
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_.9fr] md:items-end md:gap-16">
            <h2 className="max-w-2xl text-balance text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-[1.15] text-ink">
              ترتیب دقیق لایه‌ها در واحد شیشه.
            </h2>
            <p className="text-sm leading-8 text-ink-soft">
              همان توالی که در خط تولید شیشه دوجداره اجرا می‌شود — از شیشه‌ی بیرونی تا درزگیری نهایی.
            </p>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {glassLayers.map((layer, i) => (
              <Reveal key={layer.id} delay={i * 50} as="li" className="flex flex-col bg-paper p-6">
                <div className="flex items-center justify-between">
                  <span className="font-technical text-[10px] tabular-nums tracking-[0.2em] text-argon">
                    {faDigits(String(i + 1).padStart(2, "0"))}
                  </span>
                  <span className="h-px w-8 bg-ink/15" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink">{layer.label}</h3>
                <p className="mt-2.5 text-xs leading-6 text-ink-soft">{layer.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Machinery detail */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="۰۳" total="۰۳" title="Machinery" />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {machinery.map((m, i) => (
              <Reveal key={m.brand} delay={i * 90}>
                <div className="relative h-full overflow-hidden rounded-[26px] bg-ink p-8 text-cloud">
                  <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-argon/20 blur-3xl" />
                  <div className="relative">
                    <p className="font-technical text-[10px] uppercase tracking-[0.26em] text-argon-glow">{m.origin}</p>
                    <p className="mt-3 font-technical text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-none tracking-tight">{m.brand}</p>
                    <p className="mt-3 text-sm font-medium text-cloud/85">{m.role}</p>
                    <p className="mt-5 border-t border-cloud/12 pt-5 text-sm leading-8 text-cloud/60">{m.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[26px] border border-argon/25 bg-argon-soft/40 p-7 md:flex-row md:items-center md:p-9">
            <div>
              <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-argon">Next step</p>
              <p className="mt-2 max-w-xl text-balance text-lg font-semibold leading-8 text-ink">
                محصولی که این خطوط تولید می‌کنند را در استودیوی سه‌بعدی ببینید و پیکربندی کنید.
              </p>
            </div>
            <Link href="/products" data-cursor="order" className="shrink-0 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-argon">
              ورود به استودیوی محصول ←
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
