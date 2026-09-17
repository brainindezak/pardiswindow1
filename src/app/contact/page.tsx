import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/lib/content";
import { faDigits } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "ارتباط با ما",
  description: "درخواست مشاوره، استعلام قیمت یا نمایندگی در و پنجره پردیس؛ کارخانه سبزوار.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent("شهرک صنعتی سبزوار");

  return (
    <>
      <PageHero
        index="۰۷"
        kicker="Contact & Orders"
        title="گفت‌وگو را شروع کنید."
        description="فرم زیر را پر کنید یا مستقیم با کارخانه در سبزوار تماس بگیرید. تیم فنی پردیس بر اساس معماری و بودجه‌ی پروژه‌ی شما بهترین سیستم را پیشنهاد می‌دهد."
      />

      <section className="bg-paper py-16 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-10">
          <Reveal className="flex flex-col gap-10">
            <div>
              <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">تلفن کارخانه</p>
              <div className="mt-3 flex flex-col gap-1">
                {company.phones.map((p) => (
                  <a key={p} href={`tel:${p}`} className="font-technical text-lg font-medium text-ink hover:text-argon">
                    {faDigits(p)}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">ایمیل</p>
              <a href={`mailto:${company.email}`} className="mt-3 block text-lg font-medium text-ink hover:text-argon">
                {company.email}
              </a>
            </div>
            <div>
              <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">آدرس کارخانه</p>
              <p className="mt-3 max-w-sm text-base leading-8 text-ink-soft">{company.addressLine}</p>
            </div>
            <div>
              <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">شبکه اجتماعی</p>
              <a
                href={company.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 block text-base font-medium text-ink hover:text-argon"
              >
                اینستاگرام در و پنجره پردیس
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl border border-paper-line">
              <iframe
                title="نقشه محل کارخانه در و پنجره پردیس در شهرک صنعتی سبزوار"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                className="h-64 w-full grayscale"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal delay={100} className="rounded-2xl border border-paper-line bg-paper-dim/40 p-7 md:p-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
