import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { knowledgeTopics } from "@/lib/content";
import { faDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "دانش‌نامه",
  description:
    "راهنمای موضوعی پردیس: UPVC، آلومینیوم نرمال و ترمال‌بریک، شیشه دوجداره، درب ضد سرقت، نمای شیشه‌ای و کرتین وال، هندریل و پروفیل‌ها.",
  alternates: { canonical: "/knowledge" },
};

const ROUTES: Record<string, string> = {
  upvc: "/products#upvc",
  aluminum: "/products#aluminum",
  glass: "/products#glass",
  "security-doors": "/products#security-doors",
  facade: "/contact?topic=consultation",
  handrail: "/contact?topic=consultation",
  profiles: "/technology",
};

const CTA: Record<string, string> = {
  upvc: "مشاهده سیستم UPVC",
  aluminum: "مشاهده سیستم آلومینیوم",
  glass: "مشاهده شیشه دوجداره",
  "security-doors": "مشاهده درب امنیتی",
  facade: "مشاوره نما و کرتین وال",
  handrail: "مشاوره هندریل",
  profiles: "مشاهده فناوری تولید",
};

export default function KnowledgePage() {
  const [lead, ...rest] = knowledgeTopics;

  return (
    <>
      <PageHero
        index="۰۵"
        kicker="Knowledge Base"
        title="پیش از انتخاب، جنس تصمیم‌تان را بشناسید."
        description={`${faDigits(knowledgeTopics.length)} موضوع کلیدی که تیم فنی پردیس در تولید و مشاوره با آن‌ها سروکار دارد — از پروفیل و شیشه تا نما و هندریل.`}
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          {/* Lead topic — editorial feature */}
          <Reveal>
            <Link
              href={ROUTES[lead.id] ?? "/contact"}
              data-cursor="view"
              className="group relative grid overflow-hidden rounded-[30px] bg-ink text-cloud md:grid-cols-[1.15fr_.85fr]"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-argon/25 blur-[100px] transition-transform duration-1000 group-hover:scale-125" />
              <div className="relative p-8 md:p-12">
                <div className="flex items-center gap-3">
                  <span className="font-technical text-[10px] tabular-nums tracking-[0.2em] text-argon-glow">{faDigits("۰۱")}</span>
                  <span className="h-px w-10 bg-cloud/25" />
                  <span className="font-technical text-[10px] uppercase tracking-[0.26em] text-cloud/50">{lead.englishLabel}</span>
                </div>
                <h2 className="mt-8 text-balance text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-[1.15]">{lead.title}</h2>
                <p className="mt-5 max-w-lg text-balance text-sm leading-8 text-cloud/65 md:text-base">{lead.summary}</p>
                <span className="mt-9 inline-flex items-center gap-2 rounded-full border border-cloud/25 px-5 py-2.5 text-sm font-medium transition-colors group-hover:border-argon-glow group-hover:text-argon-glow">
                  {CTA[lead.id]} <span aria-hidden>←</span>
                </span>
              </div>
              {/* drawn multi-chamber profile */}
              <div className="relative hidden items-center justify-center border-r border-cloud/10 md:flex">
                <svg viewBox="0 0 260 200" className="h-auto w-[72%] text-cloud/25" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="20" y="40" width="220" height="120" />
                  <rect x="34" y="54" width="60" height="92" />
                  <rect x="102" y="54" width="52" height="92" />
                  <rect x="162" y="54" width="64" height="92" />
                  <rect x="110" y="70" width="36" height="60" className="text-argon-glow" stroke="#8f9dff" />
                  <line x1="20" y1="176" x2="240" y2="176" strokeWidth="0.8" />
                  <line x1="20" y1="170" x2="20" y2="182" strokeWidth="0.8" />
                  <line x1="240" y1="170" x2="240" y2="182" strokeWidth="0.8" />
                </svg>
              </div>
            </Link>
          </Reveal>

          {/* Remaining topics */}
          <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((topic, i) => (
              <Reveal key={topic.id} delay={i * 60} as="li">
                <Link
                  href={ROUTES[topic.id] ?? "/contact"}
                  data-cursor="view"
                  className="group flex h-full flex-col rounded-[24px] border border-ink/10 bg-paper-dim/40 p-7 transition-all hover:-translate-y-1 hover:border-argon/40 hover:bg-paper hover:shadow-[0_28px_60px_-40px_rgba(21,23,26,.55)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-technical text-[10px] tabular-nums tracking-[0.2em] text-ink-mute">
                      {faDigits(String(i + 2).padStart(2, "0"))}
                    </span>
                    <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-argon">{topic.englishLabel}</span>
                  </div>
                  <h2 className="mt-7 text-lg font-semibold leading-snug text-ink">{topic.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-ink-soft">{topic.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-ink transition-colors group-hover:text-argon">
                    {CTA[topic.id]}
                    <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="mt-6 flex flex-col items-start justify-between gap-5 rounded-[26px] border border-ink/12 bg-paper-dim/50 p-7 md:flex-row md:items-center md:p-9">
            <p className="max-w-xl text-balance text-base leading-8 text-ink">
              پاسخ سؤال‌تان اینجا نبود؟ تیم فنی پردیس مستقیم راهنمایی می‌کند.
            </p>
            <Link href="/contact?topic=consultation" data-cursor="order" className="shrink-0 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-argon">
              پرسش از کارشناس ←
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
