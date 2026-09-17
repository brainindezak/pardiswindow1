import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { OpeningGlyph } from "@/components/products/OpeningGlyph";
import { ProductStudio } from "@/components/products/ProductStudio";
import { Reveal } from "@/components/ui/Reveal";
import { productFamilies, productionLines } from "@/lib/content";

export const metadata: Metadata = {
  title: "محصولات",
  description:
    "درب و پنجره UPVC، درب و پنجره آلومینیوم، شیشه دوجداره و چندجداره و درب‌های امنیتی در و پنجره پردیس.",
  alternates: { canonical: "/products" },
};

const securityDetail = productionLines.find((l) => l.id === "security");

export default function ProductsPage() {
  return (
    <>
      <PageHero
        index="۰۱"
        kicker="Product Systems"
        title="چهار سیستم صنعتی برای هر بازشو."
        description="هر خانواده‌ی محصول پردیس، حاصل یک خط تولید اختصاصی در کارخانه‌ی سبزوار است؛ از پروفیل UPVC چندحفره‌ای تا درب‌های امنیتی با ضمانت پنج‌ساله."
      />

      <ProductStudio />

      <div>
        {productFamilies.map((family, index) => (
          <section
            key={family.id}
            id={family.id}
            className={
              "scroll-mt-24 border-b border-paper-line py-20 md:py-28 " +
              (index % 2 === 1 ? "bg-paper-dim/40" : "bg-paper")
            }
          >
            <div className="mx-auto max-w-[1440px] px-5 md:px-10">
              <div className="grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
                <Reveal>
                  <p className="font-technical text-xs tracking-[0.2em] text-ink-mute">{family.index} / ۰۴</p>
                  <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.25] text-ink">
                    {family.title}
                  </h2>
                  <p className="mt-2 font-technical text-[11px] uppercase tracking-[0.22em] text-argon">
                    {family.englishLabel}
                  </p>
                  <p className="mt-6 max-w-md text-balance text-sm leading-7 text-ink-soft">{family.intro}</p>
                </Reveal>

                <div className="grid gap-8 sm:grid-cols-2">
                  <Reveal delay={80}>
                    <p className="mb-5 font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">
                      گونه‌های اجرایی
                    </p>
                    <ul className="flex flex-col gap-4">
                      {family.variants.map((v) => (
                        <li key={v} className="flex items-center gap-4 rounded-xl border border-paper-line bg-paper p-4">
                          <OpeningGlyph label={v} />
                          <span className="text-sm text-ink">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={140}>
                    <p className="mb-5 font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">
                      مزیت مهندسی
                    </p>
                    <ul className="flex flex-col gap-3">
                      {family.advantages.map((v) => (
                        <li
                          key={v}
                          className="rounded-xl border border-transparent bg-ink/[0.03] p-4 text-sm leading-6 text-ink"
                        >
                          {v}
                        </li>
                      ))}
                    </ul>
                    {family.id === "security-doors" && securityDetail ? (
                      <p className="mt-5 text-balance rounded-xl border border-bronze/30 bg-bronze-soft/40 p-4 text-sm leading-7 text-ink-soft">
                        {securityDetail.description}
                      </p>
                    ) : null}
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-graphite py-20 text-cloud md:py-28">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-technical text-xs uppercase tracking-[0.24em] text-argon-glow">مشاوره فنی</p>
            <h2 className="mt-4 max-w-lg text-balance text-2xl font-semibold leading-snug md:text-3xl">
              نمی‌دانید کدام سیستم برای پروژه‌ی شما مناسب است؟
            </h2>
          </div>
          <Link
            href="/contact"
            data-cursor="open"
            className="inline-flex items-center gap-2 rounded-full bg-cloud px-6 py-3.5 text-sm font-medium text-graphite transition-colors hover:bg-argon hover:text-cloud"
          >
            دریافت مشاوره رایگان
            <span aria-hidden>←</span>
          </Link>
        </div>
      </section>
    </>
  );
}
