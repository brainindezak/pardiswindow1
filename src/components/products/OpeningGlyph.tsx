const TYPE_PATHS: Record<string, string> = {
  hinged: "M4 4h16v16H4z M4 4l14 3v10l-14 3", // swing arc suggestion
  sliding: "M4 6h16M4 12h16M4 18h16 M7 6l-2 -2 M17 18l2 2",
  tilt: "M4 4h16v16H4z M6 6l12 0 M12 6l-4 6l8 0z",
  fixed: "M4 4h16v16H4z M4 12h16 M12 4v16",
};

function pickType(label: string): keyof typeof TYPE_PATHS {
  if (label.includes("کشویی")) return "sliding";
  if (label.includes("ثابت")) return "fixed";
  if (label.includes("تک‌حالته") || label.includes("تک حالته")) return "tilt";
  return "hinged";
}

/** A minimal architectural-plan style glyph indicating the opening mechanism. */
export function OpeningGlyph({ label }: { label: string }) {
  const type = pickType(label);
  return (
    <svg viewBox="0 0 24 24" className="size-9 shrink-0 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="0.9">
      <path d={TYPE_PATHS[type]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
