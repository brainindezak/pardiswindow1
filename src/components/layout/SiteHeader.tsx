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
  const hoverRef = useRef<HTMLSpanElement>(null);
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

  /* Lock the page behind the mobile sheet. iOS Safari ignores
     `overflow:hidden` on the root, so the body is pinned at its current
     offset and restored afterwards — otherwise closing the menu teleports
     the visitor back to the top of the page. */
  useEffect(() => {
    if (!open) return;
    const { scrollY } = window;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
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
      <header
        dir="rtl"
        className="fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-6 md:pt-[calc(env(safe-area-inset-top)+1rem)]"
      >
        <div className={cn("nv mx-auto max-w-[1400px]", dark ? "nv-dark" : "nv-light")}>
          <div
            className={cn(
              "flex items-center justify-between gap-2.5 px-3 transition-[height] duration-500 md:gap-4 md:px-5",
              scrolled ? "h-[54px] md:h-[60px]" : "h-[62px] md:h-[70px]",
            )}
          >
            {/* ── brand: a window elevation that opens ─────────── */}
            {/* `min-w-0` lets the brand shrink instead of forcing the row
                wider than the bar on narrow phones. */}
            <Link
              href="/"
              data-cursor="view"
              aria-label="در و پنجره پردیس — صفحه اصلی"
              className="group flex min-w-0 items-center gap-2.5"
            >
              <span className={cn("nv-mk block shrink-0", dark ? "text-cloud" : "text-ink")} aria-hidden>
                <span className="nv-mk-g" />
                <span className="nv-mk-s nv-mk-l" />
                <span className="nv-mk-s nv-mk-r" />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className={cn("truncate text-[13.5px] font-semibold tracking-tight md:text-[15px]", dark ? "text-cloud" : "text-ink")}>
                  در و پنجره پردیس
                </span>
                <span className={cn("mt-1 truncate font-technical text-[8px] uppercase tracking-[0.26em]", dark ? "text-cloud/45" : "text-ink-mute")}>
                  PARDIS · {faDigits(company.founded)}
                </span>
              </span>
            </Link>

            {/* ── destinations ─────────────────────────────────── */}
            {/* A single pill of light follows the pointer between
                destinations, so hover reads as one continuous material
                rather than six separate boxes lighting up. */}
            <nav
              ref={navRef}
              aria-label="ناوبری اصلی"
              className="nv-row hidden lg:flex"
              onPointerLeave={() => {
                const g = hoverRef.current;
                if (g) g.style.opacity = "0";
              }}
              onPointerMove={(e) => {
                const g = hoverRef.current;
                const nav = navRef.current;
                if (!g || !nav) return;
                const target = (e.target as HTMLElement).closest<HTMLAnchorElement>(".nv-a");
                if (!target) {
                  g.style.opacity = "0";
                  return;
                }
                g.style.opacity = "1";
                g.style.width = `${target.offsetWidth}px`;
                g.style.transform = `translate3d(${target.offsetLeft}px, 0, 0)`;
              }}
            >
              {navLinks.map((link) => {
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
                    <span className="nv-t">{link.label}</span>
                    <span className="nv-shaft" aria-hidden />
                  </Link>
                );
              })}
              <span ref={hoverRef} className="nv-glow" aria-hidden style={{ opacity: 0 }} />
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
                  "nv-cta group/cta relative hidden items-center gap-2 overflow-hidden rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold transition-[background-color,color,transform,box-shadow] duration-300 active:scale-[.97] md:inline-flex",
                  dark ? "bg-cloud text-ink hover:bg-argon hover:text-cloud" : "bg-ink text-cloud hover:bg-argon",
                )}
              >
                <span className="nv-pulse relative size-1.5 rounded-full bg-argon-glow" />
                <span className="relative">استعلام و مشاوره</span>
                <span aria-hidden className="nv-sheen" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "بستن منو" : "باز کردن منو"}
                className={cn(
                  "relative flex size-10 shrink-0 items-center justify-center rounded-[11px] border transition-[background-color,border-color,transform] duration-300 active:scale-[.94] lg:hidden",
                  dark
                    ? "border-white/18 text-cloud active:bg-white/[.07]"
                    : "border-ink/14 text-ink active:bg-ink/[.05]",
                )}
              >
                <span className="flex flex-col gap-[5px]">
                  <span
                    className={cn(
                      "block h-px w-[17px] origin-center bg-current transition-transform duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]",
                      open && "translate-y-[3px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-px w-[17px] origin-center bg-current transition-transform duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]",
                      open && "-translate-y-[3px] -rotate-45",
                    )}
                  />
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
        {/* The sheet is anchored below the bar and is allowed to scroll: on
            short screens (landscape phones) a fixed-height panel would push
            the call-to-action out of reach. */}
        <nav
          aria-label="ناوبری موبایل"
          className={cn(
            "nv-sheet absolute inset-x-3 top-[calc(env(safe-area-inset-top)+var(--nv-h))] max-h-[calc(100dvh-var(--nv-h)-env(safe-area-inset-top)-1.5rem)] overflow-y-auto overscroll-contain rounded-[20px] border border-white/[0.1] bg-[#0d0f13]/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)] backdrop-blur-2xl transition-[transform,opacity] duration-[560ms] ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-[.985] opacity-0",
          )}
          style={{ ["--nv-h" as string]: scrolled ? "66px" : "74px" }}
        >
          <div className="p-3">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: open ? `${60 + i * 38}ms` : "0ms" }}
                  className={cn(
                    "nv-m group/mi relative flex items-center justify-between overflow-hidden rounded-[13px] px-3.5 py-3.5 transition-[transform,opacity,background-color,color] duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)] active:scale-[.985]",
                    open ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0",
                    active ? "text-cloud" : "text-cloud/72",
                  )}
                >
                  {/* active row reads as a lit opening */}
                  {active && <span aria-hidden className="nv-m-lit" />}
                  <span className="relative flex items-center gap-3">
                    <span aria-hidden className={cn("nv-m-dot", active && "is-on")} />
                    <span className="text-[15.5px] font-semibold tracking-tight">{link.label}</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "relative text-[13px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                      active ? "text-argon-glow opacity-90" : "opacity-35",
                    )}
                  >
                    ←
                  </span>
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
              <Link
                href="/contact"
                className="relative flex items-center gap-2 overflow-hidden rounded-[10px] bg-cloud px-4 py-2.5 text-[12.5px] font-semibold text-ink transition-transform duration-300 active:scale-[.97]"
              >
                <span className="nv-pulse size-1.5 rounded-full bg-argon" />
                استعلام و مشاوره
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
