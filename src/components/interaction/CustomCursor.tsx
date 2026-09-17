"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/motion";

/**
 * APERTURE — the pointer is a window.
 *
 * Four corner brackets plus a cross of mullions. The eye completes the
 * rectangle, so the mark stays light while still reading unmistakably as
 * a window in elevation.
 *
 *   rest   19px · mullions crossed (closed)
 *   hover  27px · brackets push out, vertical mullion retracts, horizontal
 *                 fades — the sashes part
 *   press  14px · everything shuts tight
 *
 * Rendered in mix-blend-mode:difference, so it inverts against whatever is
 * beneath — paper, graphite, photography, WebGL — with zero tone-detection
 * logic. Tracks the pointer with no easing: on a mark this small, lag reads
 * as imprecision, and this site is about precision.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  // Derived from the environment during render — no setState cascade, and it
  // stays correct if the user plugs in a mouse or changes the motion setting.
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mounted = finePointer && !reduced;

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.add("has-aperture");

    let x = -100;
    let y = -100;
    let frame = 0;
    let revealed = false;

    const INTERACTIVE =
      "a,button,[role='button'],input,select,textarea,label,summary,[data-cursor]";

    const paint = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // Reveal on the very first movement — never depend on pointerenter,
      // which does not fire reliably on `window`.
      if (!revealed) {
        node.style.opacity = "1";
        revealed = true;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);

      const node = ref.current;
      if (!node) return;
      const hit = (event.target as HTMLElement | null)?.closest(INTERACTIVE);
      const next = hit ? "1" : "0";
      if (node.dataset.on !== next) node.dataset.on = next;
    };

    const onDown = () => {
      const node = ref.current;
      if (node) node.dataset.press = "1";
    };
    const onUp = () => {
      const node = ref.current;
      if (node) node.dataset.press = "0";
    };
    const onOut = (event: PointerEvent) => {
      // Only hide when the pointer truly leaves the document.
      if (event.relatedTarget === null && ref.current) {
        ref.current.style.opacity = "0";
        revealed = false;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerout", onOut);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-aperture");
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div ref={ref} aria-hidden className="apr" data-on="0" data-press="0">
      <span className="apr-f">
        <span className="apr-c apr-c-tl" />
        <span className="apr-c apr-c-tr" />
        <span className="apr-c apr-c-bl" />
        <span className="apr-c apr-c-br" />
        <span className="apr-m apr-m-v" />
        <span className="apr-m apr-m-h" />
      </span>
    </div>
  );
}
