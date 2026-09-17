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
  const rawPathname = usePathname();
  /* `output: export` serves directory-style URLs, so the live pathname is
     `/quality/` while navLinks hold `/quality`. Without normalising, the
     active destination is never matched and the current page loses its
     marker in both the rail and the mobile index. */
  const pathname =
    rawPathname !== "/" && rawPathname.endsWith("/") ? rawPathname.slice(0, -1) : rawPathname;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const markRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<Record<string, HTMLAnchorElement | null>>({});

  /* The bar floats over whatever section happens to be beneath it, so its
     theme cannot be guessed from scroll offsets — the previous build hard-
     coded viewport multiples for the homepage and forced light everywhere
     else, which is why the bar went light-on-light over dark page heroes and
     appeared to vanish. Instead we sample the real element under the bar and
     read its computed background luminance. Correct on every page, at every
     breakpoint, regardless of section heights. */
  useEffect(() => {
    let raf = 0;

    const sample = () => {
      raf = 0;
      // While the sheet is open the body is pinned and a scrim covers the
      // page, so a hit-test would sample the overlay instead of the section.
      if (openRef.current) return;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      setScrolled(y > 24);

      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const probeY = rect.bottom + 6;
      const probeX = window.innerWidth / 2;

      // Ignore our own header while hit-testing.
      const previous = bar.style.pointerEvents;
      bar.style.pointerEvents = "none";
      const el = document.elementFromPoint(probeX, probeY);
      bar.style.pointerEvents = previous;
      if (!el) return;

      // Walk up until we meet a node that actually paints a background.
      let node: Element | null = el;
      let rgb: [number, number, number] | null = null;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const parts = m[1].split(",").map((n) => parseFloat(n));
          const alpha = parts[3] ?? 1;
          if (alpha > 0.5) {
            rgb = [parts[0], parts[1], parts[2]];
            break;
          }
        }
        node = node.parentElement;
      }
      if (!rgb) return;

      // Rec. 601 luma — cheap and accurate enough to pick a text colour.
      const luma = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
      setDark(luma < 0.5);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(sample);
    };

    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Close the sheet on navigation, scheduled so it does not cascade a
  // render synchronously inside the effect.
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

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

  /* Mirror `open` into a ref the scroll sampler can read without
     re-subscribing. The drag offset is reset at each call site that closes
     the sheet, so no state is synced from an effect. */
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const closeSheet = () => setOpen(false);

  /* Keyboard + focus contract for the sheet: Escape closes it, focus moves
     into it on open and returns to the toggle on close. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    /* The menu covers the page, so it must own the keyboard while open:
       Tab cycles within it and focus returns to the toggle on close. */
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = document.getElementById("mobile-nav");
      if (!panel) return;
      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keydown", trap);
    const toggle = toggleRef.current;
    const t = window.setTimeout(() => closeRef.current?.focus(), 220);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", trap);
      toggle?.focus();
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
        <div ref={barRef} className={cn("nv mx-auto max-w-[1400px]", dark ? "nv-dark" : "nv-light")}>
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
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "بستن منو" : "باز کردن منو"}
                className={cn(
                  "relative flex size-10 shrink-0 items-center justify-center rounded-[11px] border transition-[background-color,border-color,transform] duration-300 active:scale-[.94] lg:hidden",
                  dark
                    ? "border-white/18 text-cloud active:bg-white/[.07]"
                    : "border-ink/14 text-ink active:bg-ink/[.05]",
                )}
              >
                {/* Two bars of unequal length read as a menu; they converge
                    into an X. 1.5px keeps them crisp on 2x/3x screens. */}
                <span className="relative flex h-[14px] w-[18px] items-center justify-center">
                  <span
                    className={cn(
                      "absolute h-[1.5px] rounded-full bg-current transition-all duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]",
                      open ? "w-[18px] rotate-45" : "w-[18px] -translate-y-[3.5px]",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute h-[1.5px] rounded-full bg-current transition-all duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]",
                      open ? "w-[18px] -rotate-45" : "w-[12px] translate-x-[3px] translate-y-[3.5px]",
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

      {/* ══ MOBILE NAVIGATION — full-screen index ═══════════════════
          A proper table of contents rather than a small popover: the panel
          owns the whole screen, so nothing can clip it and the destinations
          get the room to be set as real typography. Opens as a clean wipe
          from the top; rows arrive in sequence.                          */}
      <div
        id="mobile-nav"
        dir="rtl"
        aria-hidden={!open}
        className={cn(
          "nv-menu fixed inset-0 z-[60] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* backdrop — its own layer so it can fade independently */}
        <div
          className={cn(
            "absolute inset-0 bg-[#0a0b0e] transition-opacity duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        {/* a soft argon horizon low in the panel, echoing the hero */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-[55%] transition-opacity duration-700",
            open ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "radial-gradient(120% 78% at 50% 118%, rgba(91,110,245,.28), transparent 68%)",
          }}
        />

        <div className="relative flex h-full flex-col">
          {/* the panel's own top row, aligned to the bar it replaces */}
          <div
            className="flex shrink-0 items-center justify-between px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
            style={{ minHeight: "64px" }}
          >
            <span
              className={cn(
                "font-technical text-[9.5px] uppercase tracking-[0.34em] text-cloud/40 transition-all duration-500",
                open ? "translate-y-0 opacity-100 delay-[160ms]" : "-translate-y-1 opacity-0",
              )}
            >
              Index
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={closeSheet}
              aria-label="بستن منو"
              className="-me-2.5 flex size-11 items-center justify-center rounded-full text-cloud/60 transition-colors active:bg-white/[.07] active:text-cloud"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* ── the index itself ─────────────────────────────────── */}
          <nav aria-label="ناوبری موبایل" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-4">
            <ul className="flex flex-col">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="nv-li">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      style={{ transitionDelay: open ? `${150 + i * 55}ms` : "0ms" }}
                      className={cn(
                        "nv-li-a group/li flex items-center justify-between gap-4 py-[18px] transition-[transform,opacity,color] duration-[620ms] ease-[cubic-bezier(.16,1,.3,1)]",
                        open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
                        active ? "text-cloud" : "text-cloud/75",
                      )}
                    >
                      <span className="flex min-w-0 items-baseline gap-3.5">
                        <span
                          aria-hidden
                          className={cn(
                            "font-technical text-[10px] tabular-nums tracking-[0.18em] transition-colors",
                            active ? "text-argon-glow" : "text-cloud/30",
                          )}
                        >
                          {faDigits(String(i + 1).padStart(2, "0"))}
                        </span>
                        <span className="nv-li-label truncate text-[26px] font-semibold leading-tight tracking-[-0.015em]">
                          {link.label}
                        </span>
                      </span>

                      {active ? (
                        <span aria-hidden className="nv-li-dot" />
                      ) : (
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="size-[18px] shrink-0 text-cloud/20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 6l-6 6 6 6" />
                        </svg>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── actions, above the home indicator ─────────────────── */}
          <div
            style={{ transitionDelay: open ? `${180 + navLinks.length * 55}ms` : "0ms" }}
            className={cn(
              "shrink-0 px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 transition-all duration-[560ms] ease-[cubic-bezier(.16,1,.3,1)]",
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <Link
              href="/contact"
              className="relative flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-[16px] bg-cloud text-[14.5px] font-semibold text-ink transition-transform duration-300 active:scale-[.98]"
            >
              <span className="nv-pulse size-1.5 rounded-full bg-argon" />
              استعلام و مشاوره
            </Link>

            <div className="mt-4 flex items-center justify-between">
              <a
                href={`tel:${company.phones[0]}`}
                className="flex items-center gap-2 text-cloud/60 transition-colors active:text-cloud"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-[14px] opacity-70" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.6a1 1 0 01-.25 1z" />
                </svg>
                <span className="font-technical text-[13px] tabular-nums tracking-wide">
                  {faDigits(company.phones[0])}
                </span>
              </a>
              <span className="font-technical text-[9px] uppercase tracking-[0.28em] text-cloud/25">
                Sabzevar · Iran
              </span>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
