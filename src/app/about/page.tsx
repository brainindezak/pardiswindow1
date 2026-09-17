import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { company, machinery, productionLines, stats } from "@/lib/content";
import { faDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره پردیس",
  description:
    "مجتمع تولیدی در و پنجره پردیس (سهامی خاص)، وابسته به هلدینگ صنعتی اسرار پویای شرق، از سال ۱۳۸۷ در شهرک صنعتی سبزوار فعالیت می‌کند.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="۰۶"
        kicker="The Company"
        title="از شهرک صنعتی سبزوار، تا سراسر ایران."
        description={`${company.legalName}، وابسته به ${company.holding}، فعالیت خود را از سال ${faDigits(company.founded)} در ${company.location} آغاز کرد و امروز به‌عنوان ${company.positioning} شناخته می‌شود.`}
      />

      {/* Figures */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-px overflow-hidden rounded-[26px] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="bg-paper p-7 md:p-8">
                <p className="font-technical text-[clamp(2rem,3.6vw,2.9rem)] font-semibold leading-none tabular-nums text-ink">
                  {faDigits(s.value)}
                  <span className="text-base text-argon">{s.suffix}</span>
                </p>
                <p className="mt-4 text-sm font-semibold text-ink">{s.label}</p>
                <p className="mt-1 text-xs leading-6 text-ink-mute">{s.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Registry + capability */}
      <section className="border-y border-ink/10 bg-paper-dim py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <SectionLabel index="۰۱" total="۰۲" title="Company Registry" />
              <h2 className="mt-5 text-balance text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.2] text-ink">
                هویت ثبتی و حقوقی.
              </h2>
              <dl className="mt-9 overflow-hidden rounded-[22px] border border-ink/10 bg-paper">
                <Row label="نام حقوقی" value={company.legalName} />
                <Row label="شماره ثبت" value={faDigits(company.registrationNo)} mono />
                <Row label="شناسه ملی" value={faDigits(company.nationalId)} mono />
                <Row label="هلدینگ مادر" value={company.holding} />
                <Row label="سال تأسیس" value={`${faDigits(company.founded)} خورشیدی`} />
                <Row label="محل استقرار" value={company.location} last />
              </dl>
            </Reveal>

            <Reveal delay={110}>
              <SectionLabel index="۰۲" total="۰۲" title="Capability" />
              <h2 className="mt-5 text-balance text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.2] text-ink">
                چهار خط تولید، دو برند ماشین‌آلات.
              </h2>

              <ul className="mt-9 grid gap-2 sm:grid-cols-2">
                {productionLines.map((line) => (
                  <li key={line.id}>
                    <Link
                      href="/technology"
                      data-cursor="view"
                      className="group flex h-full items-start gap-3 rounded-2xl border border-ink/10 bg-paper p-4 transition-colors hover:border-argon/40"
                    >
                      <span className="font-technical text-xs tabular-nums text-ink-mute">{faDigits(line.index)}</span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{line.title.replace("خط تولید ", "")}</span>
                        <span className="mt-1 block text-xs leading-6 text-ink-soft">{line.short}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {machinery.map((m) => (
                  <div key={m.brand} className="rounded-2xl bg-ink p-5 text-cloud">
                    <div className="flex items-baseline justify-between">
                      <p className="font-technical text-lg font-semibold tracking-tight">{m.brand}</p>
                      <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-argon-glow">{m.origin}</span>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-cloud/60">{m.role}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Network */}
      <section className="relative overflow-hidden bg-graphite py-20 text-cloud md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_75%_30%,rgba(91,110,245,.28),transparent_70%)]" />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-end md:gap-20">
            <div>
              <SectionLabel index="۰۳" title="Distribution Network" tone="dark" />
              <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.8rem,3.8vw,3rem)] font-semibold leading-[1.12]">
                بیش از {faDigits(company.representations)} نمایندگی، در سراسر کشور.
              </h2>
            </div>
            <p className="max-w-md text-balance text-sm leading-8 text-cloud/65 md:text-base">
              این شبکه، مشاوره، فروش و خدمات پس از فروش را نزدیک به مشتریان فراهم می‌کند. برای یافتن نزدیک‌ترین نمایندگی یا ثبت درخواست نمایندگی جدید، با تیم پردیس در ارتباط باشید.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-cloud/12 pt-8 sm:flex-row sm:flex-wrap">
            <Link href="/contact?topic=representation" data-cursor="order" className="rounded-full bg-cloud px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-argon hover:text-cloud">
              درخواست نمایندگی
            </Link>
            <Link href="/contact?topic=consultation" data-cursor="open" className="rounded-full border border-cloud/25 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-argon-glow hover:text-argon-glow">
              مشاوره پروژه
            </Link>
            <a href={`tel:${company.phones[0]}`} data-cursor="detail" className="rounded-full border border-cloud/15 px-6 py-3.5 font-technical text-sm tabular-nums text-cloud/70 transition-colors hover:border-cloud/40 hover:text-cloud">
              {faDigits(company.phones[0])}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-6 px-5 py-4 ${last ? "" : "border-b border-ink/[0.08]"}`}>
      <dt className="shrink-0 text-xs text-ink-mute">{label}</dt>
      <dd className={`text-left text-sm font-medium text-ink ${mono ? "font-technical tabular-nums" : ""}`}>{value}</dd>
    </div>
  );
}
