import { openingFor, type StudioConfig } from "@/lib/configurator";
import { faDigits } from "@/lib/utils";

const BOX_W = 720;
const BOX_H = 520;
const PAD = 96;
const LINE = "#d9d6cc";
const DIM = "#8f9dff";
const GLASS = "rgba(91,110,245,0.14)";
const TECH = "var(--font-technical)";

/**
 * A technical elevation drawing of the configured product. Doubles as the
 * no-WebGL fallback and as the "2D / نقشه" view inside the studio.
 */
export function ElevationDrawing({ config }: { config: StudioConfig }) {
  const scale = Math.min((BOX_W - PAD * 2) / config.width, (BOX_H - PAD * 2) / config.height);
  const W = config.width * scale;
  const H = config.height * scale;
  const x0 = (BOX_W - W) / 2;
  const y0 = (BOX_H - H) / 2 - 12;

  return (
    <svg
      viewBox={`0 0 ${BOX_W} ${BOX_H}`}
      className="h-full w-full"
      role="img"
      aria-label={`نقشه نمای محصول با ابعاد ${config.width} در ${config.height} میلی‌متر`}
    >
      <defs>
        <pattern id="pardis-elevation-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="rgba(243,241,234,0.05)" />
        </pattern>
      </defs>
      <rect width={BOX_W} height={BOX_H} fill="#0e1013" />
      <rect width={BOX_W} height={BOX_H} fill="url(#pardis-elevation-grid)" />

      {config.family === "glass" ? (
        <GlassSection x0={x0} y0={y0} W={W} H={H} config={config} />
      ) : config.family === "security-doors" ? (
        <DoorElevation x0={x0} y0={y0} W={W} H={H} scale={scale} />
      ) : (
        <WindowElevation x0={x0} y0={y0} W={W} H={H} scale={scale} config={config} />
      )}

      <HDim x={x0} y={y0 + H + 42} w={W} label={`${faDigits(config.width)} mm`} />
      <VDim x={x0 + W + 42} y={y0} h={H} label={`${faDigits(config.height)} mm`} />

      <g fontFamily={TECH} fontSize="10" fill="rgba(243,241,234,0.45)" letterSpacing="2">
        <text x={20} y={BOX_H - 20}>PARDIS / ELEVATION</text>
        <text x={BOX_W - 20} y={BOX_H - 20} textAnchor="end">
          NTS
        </text>
      </g>
    </svg>
  );
}

function HDim({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g stroke={DIM} strokeWidth="1">
      <line x1={x} x2={x + w} y1={y} y2={y} />
      <line x1={x} x2={x} y1={y - 8} y2={y + 8} />
      <line x1={x + w} x2={x + w} y1={y - 8} y2={y + 8} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="13" fontFamily={TECH} fill={DIM} stroke="none">
        {label}
      </text>
    </g>
  );
}

function VDim({ x, y, h, label }: { x: number; y: number; h: number; label: string }) {
  return (
    <g stroke={DIM} strokeWidth="1">
      <line x1={x} x2={x} y1={y} y2={y + h} />
      <line x1={x - 8} x2={x + 8} y1={y} y2={y} />
      <line x1={x - 8} x2={x + 8} y1={y + h} y2={y + h} />
      <text
        transform={`translate(${x + 22} ${y + h / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize="13"
        fontFamily={TECH}
        fill={DIM}
        stroke="none"
      >
        {label}
      </text>
    </g>
  );
}

function WindowElevation({
  x0,
  y0,
  W,
  H,
  scale,
  config,
}: {
  x0: number;
  y0: number;
  W: number;
  H: number;
  scale: number;
  config: StudioConfig;
}) {
  const al = config.family === "aluminum";
  const f = (al ? 56 : 70) * scale;
  const s = (al ? 50 : 60) * scale;
  const iw = W - f * 2;
  const ih = H - f * 2;
  const ix = x0 + f;
  const iy = y0 + f;
  const opening = openingFor(config);

  const sashes: { x: number; y: number; w: number; h: number; hinge: "left" | "right" | "bottom" | "slide" }[] = [];
  let mullion: { x: number; w: number } | null = null;

  if (config.opening === "sliding") {
    const sw = iw / 2 + s / 2;
    sashes.push({ x: ix, y: iy, w: sw, h: ih, hinge: "slide" });
    sashes.push({ x: ix + iw - sw, y: iy, w: sw, h: ih, hinge: "slide" });
  } else if (config.opening === "tilt") {
    sashes.push({ x: ix, y: iy, w: iw, h: ih, hinge: "bottom" });
  } else if (config.opening === "french-door") {
    sashes.push({ x: ix, y: iy, w: iw / 2, h: ih, hinge: "left" });
    sashes.push({ x: ix + iw / 2, y: iy, w: iw / 2, h: ih, hinge: "right" });
  } else if (config.sashes === 2) {
    const sw = (iw - f) / 2;
    mullion = { x: ix + sw, w: f };
    sashes.push({ x: ix, y: iy, w: sw, h: ih, hinge: "left" });
    sashes.push({ x: ix + sw + f, y: iy, w: sw, h: ih, hinge: "right" });
  } else {
    sashes.push({ x: ix, y: iy, w: iw, h: ih, hinge: "left" });
  }

  return (
    <g>
      <rect x={x0} y={y0} width={W} height={H} fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x={ix} y={iy} width={iw} height={ih} fill="none" stroke={LINE} strokeWidth="1" />
      {mullion ? <rect x={mullion.x} y={iy} width={mullion.w} height={ih} fill="rgba(243,241,234,0.06)" stroke={LINE} /> : null}

      {sashes.map((sash, i) => {
        const gx = sash.x + s;
        const gy = sash.y + s;
        const gw = sash.w - s * 2;
        const gh = sash.h - s * 2;
        const midY = sash.y + sash.h / 2;
        const midX = sash.x + sash.w / 2;
        return (
          <g key={i}>
            <rect x={sash.x} y={sash.y} width={sash.w} height={sash.h} fill="none" stroke={LINE} strokeWidth="1" />
            <rect x={gx} y={gy} width={gw} height={gh} fill={GLASS} stroke="rgba(243,241,234,0.35)" />
            {sash.hinge === "left" ? (
              <path
                d={`M${sash.x + sash.w} ${sash.y} L${sash.x} ${midY} L${sash.x + sash.w} ${sash.y + sash.h}`}
                fill="none"
                stroke={DIM}
                strokeDasharray="5 4"
              />
            ) : null}
            {sash.hinge === "right" ? (
              <path
                d={`M${sash.x} ${sash.y} L${sash.x + sash.w} ${midY} L${sash.x} ${sash.y + sash.h}`}
                fill="none"
                stroke={DIM}
                strokeDasharray="5 4"
              />
            ) : null}
            {sash.hinge === "bottom" ? (
              <path
                d={`M${sash.x} ${sash.y} L${midX} ${sash.y + sash.h} L${sash.x + sash.w} ${sash.y}`}
                fill="none"
                stroke={DIM}
                strokeDasharray="5 4"
              />
            ) : null}
            {sash.hinge === "slide" && i === 1 ? (
              <g stroke={DIM} fill="none">
                <line x1={midX + 26} x2={midX - 26} y1={midY} y2={midY} />
                <path d={`M${midX - 18} ${midY - 7} L${midX - 26} ${midY} L${midX - 18} ${midY + 7}`} />
              </g>
            ) : null}
            {sash.hinge !== "slide" || i === 1 ? (
              <rect
                x={sash.hinge === "right" || (sash.hinge === "slide" && i === 1) ? sash.x + s / 2 - 3 : sash.x + sash.w - s / 2 - 3}
                y={midY - 12}
                width={6}
                height={24}
                rx={2}
                fill={LINE}
              />
            ) : null}
          </g>
        );
      })}

      <text x={x0} y={y0 - 14} fontFamily={TECH} fontSize="10" fill="rgba(243,241,234,0.5)" letterSpacing="2">
        {opening.english} · {config.family === "aluminum" ? "ALUMINUM" : "UPVC"}
      </text>
    </g>
  );
}

function GlassSection({ x0, y0, W, H, config }: { x0: number; y0: number; W: number; H: number; config: StudioConfig }) {
  const panes = config.glazing === "multi" ? 3 : 2;
  const paneW = 12;
  const gap = 34;
  const total = panes * paneW + (panes - 1) * gap;
  const startX = x0 + W / 2 - total / 2;

  return (
    <g>
      <rect x={x0} y={y0} width={W} height={H} fill="none" stroke="rgba(243,241,234,0.18)" strokeDasharray="6 6" />
      {Array.from({ length: panes }, (_, i) => {
        const px = startX + i * (paneW + gap);
        return (
          <g key={i}>
            <rect x={px} y={y0 + 20} width={paneW} height={H - 40} fill={GLASS} stroke={LINE} />
            {i < panes - 1 ? (
              <g>
                <rect x={px + paneW} y={y0 + 20} width={gap} height={14} fill="rgba(179,185,191,0.55)" stroke={LINE} strokeWidth="0.8" />
                <rect x={px + paneW} y={y0 + H - 34} width={gap} height={14} fill="rgba(179,185,191,0.55)" stroke={LINE} strokeWidth="0.8" />
                <rect x={px + paneW} y={y0 + 34} width={gap} height={H - 68} fill="rgba(91,110,245,0.22)" />
                <text
                  transform={`translate(${px + paneW + gap / 2 + 4} ${y0 + H / 2}) rotate(-90)`}
                  textAnchor="middle"
                  fontFamily={TECH}
                  fontSize="10"
                  fill={DIM}
                  letterSpacing="2"
                >
                  ARGON
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
      <text x={x0} y={y0 - 14} fontFamily={TECH} fontSize="10" fill="rgba(243,241,234,0.5)" letterSpacing="2">
        {panes === 3 ? "TRIPLE" : "DOUBLE"} GLAZED UNIT · SECTION (SCHEMATIC)
      </text>
    </g>
  );
}

function DoorElevation({ x0, y0, W, H, scale }: { x0: number; y0: number; W: number; H: number; scale: number }) {
  const f = 85 * scale;
  const ix = x0 + f;
  const iy = y0 + f;
  const iw = W - f * 2;
  const ih = H - f;
  const eyeY = y0 + H - 1500 * scale;
  const midY = iy + ih / 2;

  return (
    <g>
      <path d={`M${x0} ${y0 + H} V${y0} H${x0 + W} V${y0 + H}`} fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x={ix} y={iy} width={iw} height={ih} fill="rgba(243,241,234,0.05)" stroke={LINE} />
      <rect x={ix + iw * 0.14} y={iy + ih * 0.12} width={iw * 0.72} height={ih * 0.3} fill="none" stroke="rgba(243,241,234,0.4)" />
      <rect x={ix + iw * 0.14} y={iy + ih * 0.55} width={iw * 0.72} height={ih * 0.26} fill="none" stroke="rgba(243,241,234,0.4)" />
      <path d={`M${ix + iw} ${iy} L${ix} ${midY} L${ix + iw} ${iy + ih}`} fill="none" stroke={DIM} strokeDasharray="5 4" />
      <circle cx={ix + iw / 2} cy={eyeY} r={4} fill="none" stroke={LINE} />
      <rect x={ix + iw - 34} y={midY - 3} width={26} height={6} rx={2} fill={LINE} />
      {[0.15, 0.5, 0.85].map((k) => (
        <rect key={k} x={ix - 5} y={iy + ih * k - 14} width={5} height={28} fill={LINE} />
      ))}
      <text x={x0} y={y0 - 14} fontFamily={TECH} fontSize="10" fill="rgba(243,241,234,0.5)" letterSpacing="2">
        SECURITY DOOR · ELEVATION
      </text>
    </g>
  );
}
