"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { company, contactTopics } from "@/lib/content";
import { useCountUp, useInViewOnce } from "@/lib/motion";
import { cn, faDigits } from "@/lib/utils";
import { SplitHeadline } from "@/components/ui/SplitHeadline";

type Topic = (typeof contactTopics)[number];

const COPY: Record<Topic["value"], { lead: string; next: string }> = {
  quote: { lead: "پیکربندی و ابعاد را دارید؟ برای بررسی و قیمت‌گذاری دقیق ارسال کنید.", next: "کارشناس فنی برای اندازه‌گیری و تأیید مشخصات تماس می‌گیرد." },
  consultation: { lead: "برای انتخاب سیستم متناسب با معماری، بازشو و اقلیم پروژه گفت‌وگو کنید.", next: "پیشنهاد سیستم و جزئیات اجرا بر اساس نقشه‌ی شما ارائه می‌شود." },
  representation: { lead: "برای پیوستن به شبکه‌ی نمایندگی‌های پردیس، درخواست اولیه‌تان را ثبت کنید.", next: "شرایط همکاری و مراحل بعدی توسط واحد فروش اعلام می‌شود." },
  cooperation: { lead: "برای همکاری، تأمین یا پیمانکاری، مسیر گفت‌وگو با مجموعه را آغاز کنید.", next: "واحد مربوطه درخواست را بررسی و با شما هماهنگ می‌کند." },
  other: { lead: "هر سؤال یا درخواست دیگری دارید، مستقیم به تیم پردیس می‌رسد.", next: "پاسخ از طریق تماس یا ایمیل ثبت‌شده ارسال می‌شود." },
};

/**
 * Kinetic Threshold — the closing bookend to the site's opening window.
 * Choosing a channel swings a casement open on its hinge and reveals the
 * request panel; the CTA carries the topic into /contact for real pre-fill.
 */
export function ConsultationPortal() {
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useInViewOnce(sectionRef, 0.35);
  const [topic, setTopic] = useState<Topic>(contactTopics[0]);
  const [open, setOpen] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const reps = useCountUp(company.representations, seen, 1400);
  const staff = useCountUp(company.specialists, seen, 1600);
  const area = useCountUp(company.facilityAreaSqm, seen, 1800);

  useEffect(() => {
    if (seen) {
      const t = window.setTimeout(() => setOpen(true), 500);
      return () => window.clearTimeout(t);
    }
  }, [seen]);

  // Magnetic CTA
  const magnet = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const node = ctaRef.current;
    if (!node || event.pointerType === "touch") return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    node.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
  };
  const release = () => {
    if (ctaRef.current) ctaRef.current.style.transform = "";
  };

  return (
    <section ref={sectionRef} id="consultation" className="relative overflow-hidden bg-graphite py-24 text-cloud md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(91,110,245,.35),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_10%_90%,rgba(169,128,90,.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(243,241,234,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,.6)_1px,transparent_1px)] [background-size:120px_120px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.05fr_.95fr] md:items-end md:gap-20">
          <div>
            <p className="font-technical text-[10px] uppercase tracking-[0.3em] text-argon-glow">۰۶ / ۰۶ · Kinetic Threshold</p>
            <SplitHeadline text="پروژه‌ی شما، بازشوی بعدی ماست." className="mt-5 max-w-3xl text-balance text-[clamp(2.2rem,5.2vw,4.7rem)] font-semibold leading-[1.03]" />
          </div>
          <p className="max-w-md text-balance text-sm leading-8 text-cloud/65 md:justify-self-end md:text-base">
            مسیر گفت‌وگو را انتخاب کنید؛ پنجره باز می‌شود و درخواست شما مستقیم در سامانه‌ی پردیس ثبت می‌گردد.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-10">
          {/* Channel list */}
          <div className="flex flex-col gap-2">
            {contactTopics.map((t, i) => {
              const on = t.value === topic.value;
              return (
                <button key={t.value} type="button" data-cursor="open" onClick={() => { setTopic(t); setOpen(true); }} aria-pressed={on}
                  className={cn("group relative flex items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 text-right transition-all duration-300", on ? "border-argon bg-argon text-cloud shadow-[0_24px_60px_-30px_rgba(91,110,245,.9)]" : "border-cloud/12 bg-white/[0.04] text-cloud/75 hover:border-cloud/30 hover:bg-white/[0.07]")}>
                  <span className="flex items-center gap-4">
                    <span className={cn("font-technical text-[10px] tracking-[0.2em]", on ? "text-cloud/70" : "text-cloud/40")}>{faDigits(String(i + 1).padStart(2, "0"))}</span>
                    <span className="text-[15px] font-medium">{t.label}</span>
                  </span>
                  <span className={cn("font-technical text-lg transition-transform duration-300 group-hover:-translate-x-1", on ? "text-cloud" : "text-cloud/40")}>←</span>
                </button>
              );
            })}

            {/* Live network meters */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Meter value={faDigits(reps)} suffix="+" label="نمایندگی" />
              <Meter value={faDigits(staff)} suffix="+" label="متخصص" />
              <Meter value={faDigits(area)} suffix="m²" label="مساحت تولید" />
            </div>
          </div>

          {/* The window */}
          <div className="relative min-h-[520px] rounded-[34px] border border-cloud/12 bg-[#0a0b10] p-4 shadow-[0_60px_140px_-70px_rgba(0,0,0,1)] md:p-6" style={{ perspective: "1800px" }}>
            {/* what lies beyond: the request panel */}
            <div className="absolute inset-4 overflow-hidden rounded-[26px] border border-cloud/10 bg-[radial-gradient(80%_70%_at_50%_100%,rgba(91,110,245,.35),rgba(10,11,16,1)_70%)] md:inset-6">
              <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30 [background-image:linear-gradient(rgba(243,241,234,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,.5)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent)]" />
              <div key={topic.value} className={cn("observatory-swap relative flex h-full flex-col justify-between p-6 md:p-9 transition-opacity duration-700", open ? "opacity-100" : "opacity-0")}>
                <div>
                  <div className="flex items-center justify-between border-b border-cloud/10 pb-4">
                    <span className="font-technical text-[10px] uppercase tracking-[0.26em] text-cloud/45">Request panel</span>
                    <span className="font-technical text-[10px] uppercase tracking-[0.2em] text-argon-glow">{topic.value}</span>
                  </div>
                  <h3 className="mt-8 text-[clamp(1.8rem,3.6vw,3rem)] font-semibold leading-tight">{topic.label}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-8 text-cloud/75 md:text-base">{COPY[topic.value].lead}</p>
                  <p className="mt-3 max-w-lg text-xs leading-6 text-cloud/45">{COPY[topic.value].next}</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-cloud/55">
                    <p>کارخانه: <a href={`tel:${company.phones[0]}`} className="font-technical text-cloud hover:text-argon-glow">{faDigits(company.phones[0])}</a></p>
                    <p className="mt-1 font-technical">{company.email}</p>
                  </div>
                  <Link ref={ctaRef} href={`/contact?topic=${topic.value}`} data-cursor="open" onPointerMove={magnet} onPointerLeave={release}
                    className="magnetic inline-flex items-center gap-3 rounded-full bg-cloud px-7 py-4 text-sm font-semibold text-ink transition-[transform,box-shadow] duration-200 hover:shadow-[0_0_0_6px_rgba(243,241,234,.12),0_30px_60px_-20px_rgba(143,157,255,.6)]">
                    ورود به فرم درخواست <span aria-hidden>←</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* the casement sash — swings on its right hinge (RTL) */}
            <div className="pointer-events-none absolute inset-4 md:inset-6" style={{ transformStyle: "preserve-3d" }}>
              <div className={cn("portal-sash absolute inset-0 rounded-[26px] border-[10px] border-graphite-soft md:border-[14px]", open && "is-open")}>
                <div className="absolute inset-0 rounded-[14px] border border-cloud/15 bg-gradient-to-bl from-cloud/[0.16] via-argon/10 to-transparent backdrop-blur-[2px]" />
                <div className="absolute inset-4 rounded-[10px] border border-cloud/12" />
                <span className="absolute left-4 top-1/2 h-12 w-2 -translate-y-1/2 rounded-full bg-cloud/30" />
                <span className="absolute inset-x-0 top-1/2 h-px bg-cloud/10" />
                <span className="absolute right-0 top-[18%] h-6 w-1 rounded-full bg-cloud/40" />
                <span className="absolute right-0 bottom-[18%] h-6 w-1 rounded-full bg-cloud/40" />
              </div>
            </div>

            {!open ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="rounded-full border border-cloud/20 bg-black/40 px-4 py-2 font-technical text-[10px] uppercase tracking-[0.3em] text-cloud/70 backdrop-blur">Select a channel to open</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cloud/10 pt-6 text-xs text-cloud/50 md:flex-row md:items-center md:justify-between">
          <p>{company.addressLine}</p>
          <p className="font-technical uppercase tracking-[0.26em]">Architecture × Material × Light × Engineering</p>
        </div>
      </div>
    </section>
  );
}

function Meter({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  return (
    <div className="rounded-2xl border border-cloud/12 bg-white/[0.04] px-3 py-3 text-center">
      <p className="font-technical text-2xl leading-none tabular-nums text-cloud">{value}<span className="text-xs text-argon-glow">{suffix}</span></p>
      <p className="mt-1.5 text-[11px] text-cloud/55">{label}</p>
    </div>
  );
}
