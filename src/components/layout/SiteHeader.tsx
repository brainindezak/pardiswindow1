"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const dragStart = useRef<number | null>(null);
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
    const id = requestAnimationFrame(() => {
      setDrag(0);
      setOpen(false);
    });
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

  /* ── swipe-down-to-dismiss ──────────────────────────────────────
     Only starts from a downward gesture that begins while the list is
     already scrolled to the top, so it never fights the scroll. */
  const onSheetPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") return;
    const scroller = sheetRef.current?.querySelector(".overflow-y-auto");
    if (scroller && scroller.scrollTop > 0) return;
    dragStart.current = e.clientY;
  };

  const onSheetPointerMove = (e: ReactPointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientY - dragStart.current;
    if (delta <= 0) {
      if (dragging) setDrag(0);
      return;
    }
    if (!dragging) setDragging(true);
    // Resist past the halfway point so the sheet feels physical.
    setDrag(delta > 120 ? 120 + (delta - 120) * 0.35 : delta);
  };

  const onSheetPointerUp = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    setDragging(false);
    setDrag((d) => {
      if (d > 110) setOpen(false);
      return 0;
    });
  };

  /* Mirror `open` into a ref the scroll sampler can read without
     re-subscribing. The drag offset is reset at each call site that closes
     the sheet, so no state is synced from an effect. */
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const closeSheet = () => {
    setDrag(0);
    setOpen(false);
  };

  /* Keyboard + focus contract for the sheet: Escape closes it, focus moves
     into it on open and returns to the toggle on close. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrag(0);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    const t = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 260);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
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

      {/* ══ MOBILE NAVIGATION ═══════════════════════════════════
          Rebuilt as a bottom sheet rather than a dropdown hanging off the
          bar. Three reasons this is the right shape on a phone:

          1. Reachability — a top dropdown puts destinations at the far end
             of the screen, the hardest place to reach one-handed. A bottom
             sheet opens under the thumb.
          2. It can never be clipped. The old panel was positioned from the
             bar's height plus the safe-area inset; whenever that maths was
             off the panel hung off-screen and read as "half visible".
             Anchoring to the bottom edge removes the dependency entirely.
          3. It is the platform-native pattern on both iOS and Android, so
             it needs no explanation — including the drag handle and the
             swipe-down-to-dismiss gesture.                               */}
      <div
        dir="rtl"
        className={cn("fixed inset-0 z-[60] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        {/* scrim */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="بستن منو"
          onClick={closeSheet}
          className={cn(
            "absolute inset-0 h-full w-full cursor-default bg-graphite/60 backdrop-blur-[6px] transition-opacity duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <nav
          ref={sheetRef}
          id="mobile-nav"
          aria-label="ناوبری موبایل"
          style={{ transform: open ? `translate3d(0,${drag}px,0)` : undefined }}
          onPointerDown={onSheetPointerDown}
          onPointerMove={onSheetPointerMove}
          onPointerUp={onSheetPointerUp}
          onPointerCancel={onSheetPointerUp}
          className={cn(
            "nv-sheet absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[26px] border-t border-white/[0.12] bg-[#0c0e12]/97 shadow-[0_-30px_90px_-20px_rgba(0,0,0,.85)] backdrop-blur-2xl",
            dragging ? "transition-none" : "transition-transform duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)]",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          {/* drag handle — also the affordance for swipe-to-dismiss */}
          <div className="grid shrink-0 cursor-grab touch-none place-items-center pb-1 pt-3 active:cursor-grabbing">
            <span aria-hidden className="h-1 w-10 rounded-full bg-cloud/25" />
          </div>

          <div className="flex items-center justify-between px-5 pb-3 pt-1">
            <span className="font-technical text-[9.5px] uppercase tracking-[0.3em] text-cloud/40">Menu</span>
            <button
              type="button"
              onClick={closeSheet}
              aria-label="بستن منو"
              className="-me-1.5 flex size-11 items-center justify-center rounded-full text-cloud/55 transition-colors active:bg-white/[.06] active:text-cloud"
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* destinations */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-1">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: open ? `${90 + i * 42}ms` : "0ms" }}
                  className={cn(
                    "nv-m relative flex items-center gap-3.5 rounded-[15px] px-4 py-[15px] transition-[transform,opacity,background-color] duration-[560ms] ease-[cubic-bezier(.16,1,.3,1)] active:scale-[.985] active:bg-white/[.05]",
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    active ? "text-cloud" : "text-cloud/70",
                  )}
                >
                  {active && <span aria-hidden className="nv-m-lit" />}
                  <span aria-hidden className={cn("nv-m-dot", active && "is-on")} />
                  <span className="relative flex-1 text-[16px] font-semibold tracking-tight">{link.label}</span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className={cn("relative size-4 shrink-0 transition-colors", active ? "text-argon-glow" : "text-cloud/25")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* actions — pinned above the home indicator */}
          <div
            style={{ transitionDelay: open ? `${110 + navLinks.length * 42}ms` : "0ms" }}
            className={cn(
              "shrink-0 border-t border-white/[0.07] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 transition-opacity duration-500",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            <Link
              href="/contact"
              className="relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-[15px] bg-cloud text-[14px] font-semibold text-ink transition-transform duration-300 active:scale-[.98]"
            >
              <span className="nv-pulse size-1.5 rounded-full bg-argon" />
              استعلام و مشاوره
            </Link>
            <a
              href={`tel:${company.phones[0]}`}
              className="mt-2.5 flex h-[46px] w-full items-center justify-center gap-2 rounded-[15px] border border-white/[0.12] text-cloud/75 transition-colors active:bg-white/[.05]"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-[15px] opacity-60" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.6a1 1 0 01-.25 1z" />
              </svg>
              <span className="font-technical text-[13px] tabular-nums tracking-wide">{faDigits(company.phones[0])}</span>
            </a>
          </div>
        </nav>
      </div>

    </>
  );
}
