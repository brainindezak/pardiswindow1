import Link from "next/link";
import { company, navLinks } from "@/lib/content";
import { faDigits } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#090b10] text-cloud">
      {/* Background Architectural Atmosphere */}
      <div className="pointer-events-none absolute -bottom-48 -left-32 size-[580px] rounded-full bg-argon/15 blur-[160px]" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] size-[500px] rounded-full bg-bronze/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(243,241,234,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-20 md:px-10 md:pt-28">
        {/* Top Feature Banner */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.03] p-6 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-argon-glow/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="font-technical text-[10px] uppercase tracking-[0.28em] text-argon-glow">
                Architecture × Material × Light × Engineering
              </span>
              <h3 className="mt-3 text-balance text-2xl font-bold leading-tight md:text-3xl">
                پروژه‌ی بعدی شما، بازشوی بعدی ماست.
              </h3>
              <p className="mt-3 text-sm leading-7 text-cloud/70">
                مشاوره فنی، انتخاب سیستم پروفیل، ساختار شیشه و قیمت‌گذاری بر اساس مشخصات معماری ساختمان شما.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                data-cursor="order"
                className="inline-flex items-center gap-2.5 rounded-full bg-cloud px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all hover:bg-argon hover:text-cloud"
              >
                <span>شروع استعلام و مشاوره</span>
                <span aria-hidden>←</span>
              </Link>
              <a
                href={`tel:${company.phones[0]}`}
                data-cursor="detail"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3.5 font-technical text-sm tabular-nums text-cloud/85 transition-colors hover:border-argon-glow hover:text-argon-glow"
              >
                <span>📞</span>
                <span>{faDigits(company.phones[0])}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Directory */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-technical text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.05em] text-cloud">
              PARDIS<span className="text-argon-glow">.</span>
            </h2>
            <p className="mt-4 text-base font-bold text-cloud/90">{company.brand}</p>
            <p className="mt-3 text-xs leading-6 text-cloud/60">
              {company.positioning}. فعال از سال {faDigits(company.founded)} در {company.location} با اتکا به {faDigits(company.facilityAreaSqm)} مترمربع مساحت تولیدی.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              <span className="text-[11px] font-medium text-cloud/70">
                بیش از {faDigits(company.representations)} نمایندگی فعال سراسر کشور
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-argon-glow">
              Navigation
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-cloud/75">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor="view"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-argon-glow"
                  >
                    <span className="opacity-40">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  data-cursor="view"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-argon-glow"
                >
                  <span className="opacity-40">›</span>
                  <span>ارتباط و سفارش</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Channels */}
          <div>
            <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-argon-glow">
              Contact Channels
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-cloud/75">
              <div>
                <p className="text-[11px] text-cloud/45">تلفن‌های کارخانه:</p>
                {company.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    data-cursor="detail"
                    className="block font-technical text-sm tabular-nums text-cloud/90 transition-colors hover:text-argon-glow"
                  >
                    {faDigits(phone)}
                  </a>
                ))}
              </div>
              <div>
                <p className="text-[11px] text-cloud/45">پست الکترونیک:</p>
                <a
                  href={`mailto:${company.email}`}
                  data-cursor="detail"
                  className="block font-technical text-sm text-cloud/90 transition-colors hover:text-argon-glow"
                >
                  {company.email}
                </a>
              </div>
              <div>
                <a
                  href={company.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="open"
                  className="inline-flex items-center gap-1.5 text-xs text-argon-glow hover:underline"
                >
                  <span>اینستاگرام پردیس</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Plant Address & Credentials */}
          <div>
            <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-argon-glow">
              Plant Location
            </p>
            <p className="mt-4 text-xs leading-6 text-cloud/75">
              {company.addressLine}
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-5 text-cloud/55">
              <p>{company.legalName}</p>
              <p className="font-technical tabular-nums">
                شماره ثبت: {faDigits(company.registrationNo)} · شناسه ملی: {faDigits(company.nationalId)}
              </p>
              <p>وابسته به {company.holding}</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-cloud/45 md:flex-row md:items-center md:justify-between">
          <p>© {faDigits(new Date().getFullYear())} {company.brand}. تمامی حقوق محفوظ است.</p>
          <p className="font-technical uppercase tracking-[0.2em] text-cloud/40">
            Precision Engineering · Insulated Glazing · Modern Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}
