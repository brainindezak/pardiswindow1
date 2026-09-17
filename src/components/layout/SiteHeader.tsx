"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company, navLinks } from "@/lib/content";
import { cn, faDigits } from "@/lib/utils";

/**
 * SILL — the navigation read as a window sill in elevation.
 *
 * A single hairline rail. Measured Persian type with technical indices.
 * One travelling aperture marker, with jamb ticks, seats beneath the active
 * destination. The single flourish: hovering an opening drops a short shaft
 * of light below the sill, as if the opening were letting light through.
 *
 * The marker lives INSIDE the nav element, so `offsetLeft` is measured
 * against its own offset parent — the earlier build positioned it against a
 * different container, which is why it never aligned.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      setScrolled(y > 24);
      if (pathname === "/") {
        const vh = window.innerHeight;
        setDark(y < vh * 1.15 || (y > vh * 2.05 && y < vh * 4.95));
      } else {
        setDark(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  /* Seat the aperture marker under the active destination. Measured with
     offsetLeft/offsetWidth against the nav, which is the marker's own
     offset parent — exact, and immune to page scroll. */
  useEffect(() => {
    const place = () => {
      const mark = markRef.current;
      const active = itemsRef.current[pathname];
      if (!mark) return;
      if (!active) {
        mark.style.opacity = "0";
        return;
      }
      const inset = 11;
      mark.style.opacity = "1";
      mark.style.width = `${Math.max(16, active.offsetWidth - inset * 2)}px`;
      mark.style.transform = `translate3d(${active.offsetLeft + inset}px, 0, 0)`;
    };
    place();
    const t = window.setTimeout(place, 150);
    window.addEventListener("resize", place);
    if (document.fonts?.ready) void document.fonts.ready.then(place);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", place);
    };
  }, [pathname, scrolled, dark]);

  return (
    <>
      <header dir="rtl" className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <div className={cn("nv mx-auto max-w-[1400px]", dark ? "nv-dark" : "nv-light")}>
          <div
            className={cn(
              "flex items-center justify-between gap-4 px-3 transition-[height] duration-500 md:px-5",
              scrolled ? "h-[54px] md:h-[60px]" : "h-[62px] md:h-[70px]",
            )}
          >
            {/* ── brand: a window elevation that opens ─────────── */}
            <Link
              href="/"
              data-cursor="view"
              aria-label="در و پنجره پردیس — صفحه اصلی"
              className="group flex shrink-0 items-center gap-2.5"
            >
              <span className={cn("nv-mk block", dark ? "text-cloud" : "text-ink")} aria-hidden>
                <span className="nv-mk-g" />
                <span className="nv-mk-s nv-mk-l" />
                <span className="nv-mk-s nv-mk-r" />
              </span>
              <span className="flex flex-col leading-none">
                <span className={cn("text-[14px] font-semibold tracking-tight md:text-[15px]", dark ? "text-cloud" : "text-ink")}>
                  در و پنجره پردیس
                </span>
                <span className={cn("mt-1 font-technical text-[8px] uppercase tracking-[0.26em]", dark ? "text-cloud/45" : "text-ink-mute")}>
                  PARDIS · {faDigits(company.founded)}
                </span>
              </span>
            </Link>

            {/* ── destinations ─────────────────────────────────── */}
            <nav ref={navRef} aria-label="ناوبری اصلی" className="nv-row hidden lg:flex">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-cursor="view"
                    ref={(el) => {
                      itemsRef.current[link.href] = el;
                    }}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "nv-a",
                      dark
                        ? active
                          ? "text-cloud"
                          : "text-cloud/62 hover:text-cloud"
                        : active
                          ? "text-ink"
                          : "text-ink-soft hover:text-ink",
                    )}
                  >
                    <span className="nv-i">{faDigits(String(i + 1).padStart(2, "0"))}</span>
                    <span>{link.label}</span>
                    <span className="nv-shaft" aria-hidden />
                  </Link>
                );
              })}
              <span ref={markRef} className="nv-mark" aria-hidden style={{ opacity: 0 }} />
            </nav>

            {/* ── actions ──────────────────────────────────────── */}
            <div className="flex shrink-0 items-center gap-3">
              <a
                href={`tel:${company.phones[0]}`}
                data-cursor="detail"
                className={cn(
                  "hidden font-technical text-[12px] tabular-nums tracking-wide transition-colors hover:text-argon md:block",
                  dark ? "text-cloud/65" : "text-ink-soft",
                )}
              >
                {faDigits(company.phones[0])}
              </a>

              <Link
                href="/contact"
                data-cursor="order"
                className={cn(
                  "hidden items-center gap-2 rounded-[9px] px-4 py-2.5 text-[12.5px] font-semibold transition-colors duration-300 md:inline-flex",
                  dark ? "bg-cloud text-ink hover:bg-argon hover:text-cloud" : "bg-ink text-cloud hover:bg-argon",
                )}
              >
                <span className="size-1.5 rounded-full bg-argon-glow" />
                استعلام و مشاوره
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "بستن منو" : "باز کردن منو"}
                className={cn(
                  "flex size-9 items-center justify-center rounded-[9px] border lg:hidden",
                  dark ? "border-white/18 text-cloud" : "border-ink/14 text-ink",
                )}
              >
                <span className="flex flex-col gap-1.5">
                  <span className={cn("block h-px w-4 bg-current transition-transform duration-300", open && "translate-y-[3.5px] rotate-45")} />
                  <span className={cn("block h-px w-4 bg-current transition-transform duration-300", open && "-translate-y-[3.5px] -rotate-45")} />
                </span>
              </button>
            </div>
          </div>

          <span className="nv-p" aria-hidden>
            <span className="nv-p-f" style={{ width: `${progress * 100}%` }} />
          </span>
        </div>
      </header>

      {/* ── mobile sheet ───────────────────────────────────────── */}
      <div dir="rtl" className={cn("fixed inset-0 z-40 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <div
          className={cn("absolute inset-0 bg-graphite/72 backdrop-blur-md transition-opacity duration-400", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <nav
          aria-label="ناوبری موبایل"
          className={cn(
            "absolute inset-x-3 top-[78px] overflow-hidden rounded-[18px] border border-white/[0.1] bg-[#0d0f13]/96 shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
          )}
        >
          <div className="p-3">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ transitionDelay: open ? `${55 + i * 32}ms` : "0ms" }}
                  className={cn(
                    "flex items-center justify-between border-b border-white/[0.06] px-3 py-3.5 transition-all duration-300 last:border-b-0",
                    open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0",
                    active ? "text-argon-glow" : "text-cloud/80",
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-technical text-[8.5px] tabular-nums opacity-50">
                      {faDigits(String(i + 1).padStart(2, "0"))}
                    </span>
                    <span className="text-[15px] font-semibold">{link.label}</span>
                  </span>
                  <span aria-hidden className="text-sm opacity-40">←</span>
                </Link>
              );
            })}

            <div
              style={{ transitionDelay: open ? `${55 + navLinks.length * 32}ms` : "0ms" }}
              className={cn("mt-3 flex items-center justify-between gap-3 px-3 pt-3 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
            >
              <a href={`tel:${company.phones[0]}`} className="font-technical text-[12px] tabular-nums text-cloud/60">
                {faDigits(company.phones[0])}
              </a>
              <Link href="/contact" className="rounded-[9px] bg-cloud px-4 py-2.5 text-[12.5px] font-semibold text-ink">
                استعلام و مشاوره
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
