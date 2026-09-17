import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { quality } from "@/lib/content";
import { faDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "کیفیت",
  description:
    "فرآیند کنترل کیفیت در و پنجره پردیس و گواهینامه‌ی مرکز تحقیقات مسکن و شهرسازی برای تولید استاندارد شیشه‌های دوجداره.",
  alternates: { canonical: "/quality" },
};

const STAGES = [
  {
    title: "بازرسی مواد اولیه",
    detail: "پروفیل UPVC، آلومینیوم، شیشه خام و یراق‌آلات پیش از ورود به خط تولید بررسی می‌شوند.",
    scope: "INPUT",
  },
  {
    title: "کنترل حین تولید",
    detail: "تراز‌بندی قاب، استحکام درز جوش چهارگوش و دقت ماشین‌کاری CNC در حین اجرا پایش می‌شود.",
    scope: "IN-PROCESS",
  },
  {
    title: "بازرسی شیشه دوجداره",
    detail:
      "خم اسپیسر، تزریق سیلیکاژل، چسب بوتیل، تزریق گاز آرگون و درزگیری پلی‌سولفاید مطابق استاندارد کنترل می‌شود.",
    scope: "IGU LINE",
  },
  {
    title: "بازرسی نهایی پیش از تحویل",
    detail: "محصول نهایی — پنجره، درب یا درب امنیتی — پیش از ارسال به نمایندگی یا پروژه بازبینی می‌شود.",
    scope: "OUTPUT",
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        index="۰۳"
        kicker="Quality Assurance"
        title="کیفیت، مرحله‌ای جدا نیست."
        description={quality.process}
      />

      {/* Certificate — the single strongest proof */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[30px] border border-argon/25 bg-argon-soft/45 p-8 md:p-12">
              <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-argon/20 blur-3xl" />
              <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
                <div className="grid size-24 shrink-0 place-items-center rounded-2xl border-2 border-argon/40 bg-paper md:size-28">
                  <svg viewBox="0 0 48 48" className="size-12 text-argon md:size-14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M24 4l16 7v12c0 10-7 18-16 21-9-3-16-11-16-21V11z" strokeLinejoin="round" />
                    <path d="M17 24l5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-technical text-[10px] uppercase tracking-[0.26em] text-argon">Certification</p>
                  <p className="mt-4 text-balance text-lg font-semibold leading-9 text-ink md:text-2xl">
                    {quality.certificate}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Inspection chain */}
      <section className="border-y border-ink/10 bg-paper-dim py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="۰۱" total="۰۲" title="Inspection Chain" />
          <h2 className="mt-5 max-w-2xl text-balance text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-[1.15] text-ink">
            چهار ایستگاه بازرسی، از ورود ماده تا تحویل محصول.
          </h2>

          <ol className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((stage, i) => (
              <Reveal key={stage.title} delay={i * 80} as="li">
                <div className="group relative h-full overflow-hidden rounded-[24px] border border-ink/10 bg-paper p-6 transition-all hover:-translate-y-1 hover:border-argon/40 hover:shadow-[0_28px_60px_-40px_rgba(21,23,26,.6)]">
                  <div className="flex items-start justify-between">
                    <span className="font-technical text-3xl leading-none tabular-nums text-ink/12 transition-colors group-hover:text-argon/40">
                      {faDigits(String(i + 1).padStart(2, "0"))}
                    </span>
                    <span className="rounded-full border border-ink/12 px-2.5 py-1 font-technical text-[9px] uppercase tracking-[0.16em] text-ink-mute">
                      {stage.scope}
                    </span>
                  </div>
                  <h3 className="mt-8 text-base font-semibold leading-snug text-ink">{stage.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-ink-soft">{stage.detail}</p>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 origin-right scale-x-0 bg-argon transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="۰۲" total="۰۲" title="Guarantee" />
          <Reveal className="mt-10">
            <div className="grid items-center gap-8 rounded-[30px] bg-ink p-8 text-cloud md:grid-cols-[auto_1fr_auto] md:gap-12 md:p-12">
              <div className="text-center">
                <p className="font-technical text-[clamp(3.5rem,9vw,6rem)] font-semibold leading-none tabular-nums text-bronze">
                  {faDigits(5)}
                </p>
                <p className="mt-1 font-technical text-[10px] uppercase tracking-[0.26em] text-cloud/45">Years</p>
              </div>
              <p className="text-balance text-lg leading-9 md:text-xl">{quality.guarantee}</p>
              <Link
                href="/contact"
                data-cursor="order"
                className="shrink-0 rounded-full bg-cloud px-6 py-3.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-argon hover:text-cloud"
              >
                مشاوره فنی
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
