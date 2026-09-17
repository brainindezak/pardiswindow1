/**
 * THE IDENTITY FIELD — what lies beyond the threshold window.
 *
 * Not a photograph: a designed space built from the brand's four pillars.
 * ARCHITECTURE → a horizon, a curtain-wall grid and a perspective floor.
 * MATERIAL     → film grain and a stroked (glass-like) wordmark.
 * LIGHT        → a slow beam and a sheen that travels through the letters.
 * ENGINEERING  → measured type, technical labels, disciplined spacing.
 *
 * Reads `--tp` (threshold progress, 0→1) from the parent to move closer as
 * the casements swing open.
 */
export function IdentityField() {
  const radials = Array.from({ length: 17 }, (_, i) => 500 + (i - 8) * 150);
  const horizontals = Array.from({ length: 9 }, (_, i) => Math.pow((i + 1) / 9, 2.2) * 380);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#0a0b0f]">
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_82%,rgba(91,110,245,0.42),transparent_66%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(42%_28%_at_50%_63%,rgba(169,128,90,0.3),transparent_72%)]" />

      {/* curtain-wall rhythm above the horizon */}
      <div className="absolute inset-x-0 top-0 h-[62%] opacity-[0.07] [background-image:linear-gradient(rgba(243,241,234,1)_1px,transparent_1px),linear-gradient(90deg,rgba(243,241,234,1)_1px,transparent_1px)] [background-size:140px_180px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black)]" />

      {/* travelling light beam */}
      <div className="identity-beam absolute -left-1/4 top-[-30%] h-[170%] w-[36%] bg-[linear-gradient(90deg,transparent,rgba(243,241,234,0.14),transparent)] blur-2xl" />

      {/* horizon */}
      <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-cloud/35 to-transparent" />

      {/* perspective floor */}
      <svg className="absolute inset-x-0 bottom-0 h-[38%] w-full" viewBox="0 0 1000 380" preserveAspectRatio="none">
        {radials.map((x) => (
          <line key={x} x1="500" y1="0" x2={x} y2="380" stroke="rgba(243,241,234,0.08)" strokeWidth="1" />
        ))}
        {horizontals.map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(243,241,234,0.07)" strokeWidth="1" />
        ))}
        <line x1="500" y1="0" x2="500" y2="380" stroke="rgba(143,157,255,0.28)" strokeWidth="1" />
      </svg>

      {/* wordmark */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: "scale(calc(1 + var(--tp, 0) * 0.16))", transformOrigin: "50% 58%" }}
      >
        <div className="relative leading-none">
          <span
            className="block font-technical font-semibold leading-none tracking-[-0.07em]"
            style={{
              fontSize: "clamp(3.4rem, 26vw, 19rem)",
              color: "rgba(243,241,234,0.05)",
              WebkitTextStroke: "1px rgba(243,241,234,0.32)",
            }}
          >
            PARDIS
          </span>
          <span
            className="identity-shine absolute inset-0 block bg-clip-text font-technical font-semibold leading-none tracking-[-0.07em] text-transparent"
            style={{
              fontSize: "clamp(3.4rem, 26vw, 19rem)",
              backgroundImage: "linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.6) 50%, transparent 62%)",
              backgroundSize: "260% 100%",
            }}
          >
            PARDIS
          </span>
        </div>
        <p className="mt-3 text-[clamp(1.05rem,4.4vw,1.6rem)] font-medium text-cloud/85 md:mt-2">در و پنجره پردیس</p>
        <p className="mt-3 px-6 text-center font-technical text-[8.5px] uppercase leading-relaxed tracking-[0.3em] text-cloud/45 sm:text-[10px] sm:tracking-[0.42em]">
          Architecture × Material × Light × Engineering
        </p>
      </div>

      {/* corner technical marks */}
      <div className="absolute left-5 top-[62%] mt-3 hidden font-technical text-[9px] uppercase tracking-[0.3em] text-cloud/35 sm:block md:left-10">
        Horizon · 00
      </div>
      <div className="absolute right-5 top-[62%] mt-3 hidden font-technical text-[9px] uppercase tracking-[0.3em] text-cloud/35 sm:block md:right-10">
        Sabzevar · Iran
      </div>

      {/* material grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay">
        <filter id="pardis-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pardis-grain)" />
      </svg>

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(10,11,15,0.85))]" />
    </div>
  );
}
