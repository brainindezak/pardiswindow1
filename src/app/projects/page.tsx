import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/lib/content";
import { faDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description:
    "پروژه‌های اجراشده با در و پنجره پردیس در سراسر ایران — از پروژه‌ی غدیر زاهدان تا برج‌های مسکونی و مجتمع‌های رفاهی.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const provinces = new Set(projects.map((p) => p.province).filter((p) => p !== "—"));

  return (
    <>
      <PageHero
        index="۰۴"
        kicker="Project Archive"
        title="پروژه‌هایی که پردیس در آن‌ها اجرا شده است."
        description="گزیده‌ای از پروژه‌های مستند نصب‌شده توسط نمایندگی‌های پردیس در سراسر کشور — از مجتمع‌های مسکونی و برج‌ها تا ساختمان‌های آموزشی و اداری."
      />

      {/* Archive summary */}
      <section className="border-b border-ink/10 bg-paper-dim py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <Reveal>
              <div className="rounded-[22px] border border-ink/10 bg-paper p-6">
                <p className="font-technical text-[clamp(2.2rem,4vw,3.2rem)] font-semibold leading-none tabular-nums text-ink">
                  {faDigits(projects.length)}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">پروژه‌ی مستند</p>
                <p className="mt-1 text-xs leading-6 text-ink-mute">اجراهای ثبت‌شده در آرشیو پردیس</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-[22px] border border-ink/10 bg-paper p-6">
                <p className="font-technical text-[clamp(2.2rem,4vw,3.2rem)] font-semibold leading-none tabular-nums text-ink">
                  {faDigits(provinces.size)}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">استان</p>
                <p className="mt-1 text-xs leading-6 text-ink-mute">{Array.from(provinces).join(" · ")}</p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="rounded-[22px] bg-ink p-6 text-cloud">
                <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-argon-glow">Network</p>
                <p className="mt-3 text-sm leading-7 text-cloud/80">
                  اجرا از طریق شبکه‌ی نمایندگی‌های پردیس در سراسر کشور انجام می‌شود.
                </p>
                <Link href="/contact?topic=consultation" data-cursor="view" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-argon-glow hover:text-cloud">
                  مشاوره اجرای پروژه <span aria-hidden>←</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ProjectsExplorer />

      {/* Closing */}
      <section className="bg-paper py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-ink/10 bg-paper-dim/50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <SectionLabel index="۰۲" total="۰۲" title="Your Project" />
              <p className="mt-5 max-w-xl text-balance text-lg font-semibold leading-9 text-ink md:text-xl">
                پروژه‌ی شما می‌تواند رکورد بعدی این آرشیو باشد.
              </p>
            </div>
            <Link href="/contact?topic=quote" data-cursor="order" className="shrink-0 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-argon">
              شروع پروژه ←
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
