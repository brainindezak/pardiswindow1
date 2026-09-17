import type { CatalogItem } from "@/lib/catalog";

/**
 * A minimal architectural-plan style glyph per catalog item — distinct
 * strokes for opening mechanism, door swing, aluminum profile chamber,
 * glazing layers, and security-door lock, so the eye can scan the grid by
 * shape before reading a single word.
 */
export function ProductGlyph({ item, className }: { item: CatalogItem; className?: string }) {
  const cls = className ?? "size-8";

  if (item.kind === "window") {
    if (item.facet === "کشویی") {
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
          <path d="M4 4h16v16H4z M12 4v16 M4 9l-1.4 -1.4 M4 9h3 M20 15l1.4 1.4 M20 15h-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (item.facet === "تک‌حالته") {
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
          <path d="M4 4h16v16H4z M6 6l12 0 M12 6l-4 6l8 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
        <path d="M4 4h16v16H4z M4 4l14 3v10l-14 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (item.kind === "door") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
        <path d="M7 3h10v18H7z M9 3l10 2v16l-10 -2 M17.2 12.4v0.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (item.kind === "mixed") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
        <rect x="3.5" y="3.5" width="17" height="17" rx="1.2" />
        <rect x="7" y="7" width="10" height="10" rx="0.8" />
        <path d="M3.5 3.5l3.5 3.5 M20.5 3.5l-3.5 3.5 M3.5 20.5l3.5 -3.5 M20.5 20.5l-3.5 -3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (item.kind === "glass") {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
        <path d="M5 4v16 M9.4 4v16 M14.6 4v16 M19 4v16" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d="M12 3l7 3v5c0 4.5 -2.9 8 -7 10c-4.1 -2 -7 -5.5 -7 -10V6z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="11.4" r="1.5" />
      <path d="M12 12.9v2.4" strokeLinecap="round" />
    </svg>
  );
}
