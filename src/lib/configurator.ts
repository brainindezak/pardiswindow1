import { catalog, type CatalogItem } from "./catalog";
import { productFamilies, productionLines, type ProductFamily, type ProductionLine } from "./content";
import { faDigits } from "./utils";

// ---------------------------------------------------------------------------
// Product Studio configurator model.
// ---------------------------------------------------------------------------
// Verified facts (from pardiswindow.com): product families, UPVC opening
// types, aluminium normal/thermal-break profiles, double/multi glazing with
// argon, security-door veneers (راش/فلزی/لامینوکس/PVC), and the listed
// product sizes used as presets. Colour swatches are *customer preferences*
// communicated with the order (labelled as such in the UI) — they are not
// presented as a verified catalogue of finishes.
// ---------------------------------------------------------------------------

export type FamilyId = "upvc" | "aluminum" | "glass" | "security-doors";
export type OpeningId = "hinged" | "tilt" | "sliding" | "inward-door" | "french-door";
export type GlazingId = "double" | "multi";
export type AluminumProfile = "normal" | "thermal-break";
export type SashCount = 1 | 2;

export type Finish = { id: string; label: string; hex: string; metalness: number; roughness: number };

export type OpeningOption = {
  id: OpeningId;
  label: string;
  english: string;
  kind: "window" | "door";
  sashes: SashCount;
  sashChoice: boolean;
  catalogId: string;
  guide: string;
};

export type SizePreset = { label: string; width: number; height: number; sashes?: SashCount; source?: "pardis" };
export type SizeRange = { width: [number, number]; height: [number, number] };

export type StudioConfig = {
  family: FamilyId;
  opening: OpeningId;
  sashes: SashCount;
  aluminumProfile: AluminumProfile;
  glazing: GlazingId;
  finishId: string;
  width: number; // mm
  height: number; // mm
  quantity: number;
};

export const families: { id: FamilyId; label: string; english: string; short: string }[] = [
  { id: "upvc", label: "درب و پنجره UPVC", english: "UPVC", short: "UPVC" },
  { id: "aluminum", label: "درب و پنجره آلومینیومی", english: "ALUMINUM", short: "آلومینیوم" },
  { id: "glass", label: "شیشه دوجداره و چندجداره", english: "GLAZING", short: "شیشه" },
  { id: "security-doors", label: "درب‌های امنیتی", english: "SECURITY", short: "درب امنیتی" },
];

export const openings: OpeningOption[] = [
  {
    id: "hinged",
    label: "لولایی",
    english: "CASEMENT",
    kind: "window",
    sashes: 1,
    sashChoice: true,
    catalogId: "upvc-hinged",
    guide: "بازشوی کامل لنگه برای تهویه و نظافت آسان؛ رایج‌ترین انتخاب فضاهای مسکونی و اداری.",
  },
  {
    id: "tilt",
    label: "تک‌حالته (لولای متقابل)",
    english: "TILT",
    kind: "window",
    sashes: 1,
    sashChoice: false,
    catalogId: "upvc-tilt",
    guide: "لولای متقابل، بازشوی کنترل‌شده از بالا؛ مناسب فضاهایی که تهویه‌ی محدود و ایمن می‌خواهند.",
  },
  {
    id: "sliding",
    label: "کشویی (فریم جفت‌ریل)",
    english: "SLIDING",
    kind: "window",
    sashes: 2,
    sashChoice: false,
    catalogId: "upvc-sliding",
    guide: "دو لنگه روی فریم جفت‌ریل؛ برای بازشوهای عریض که فضای بازشدن لنگه به داخل محدود است.",
  },
  {
    id: "inward-door",
    label: "درب درون‌بازشو",
    english: "INWARD DOOR",
    kind: "door",
    sashes: 1,
    sashChoice: true,
    catalogId: "upvc-inward-door",
    guide: "درب تمام‌قد UPVC با بازشوی به داخل؛ دسترسی به تراس، بالکن و حیاط.",
  },
  {
    id: "french-door",
    label: "درب فرانسوی (لولای متقابل)",
    english: "FRENCH DOOR",
    kind: "door",
    sashes: 2,
    sashChoice: false,
    catalogId: "upvc-french-door",
    guide: "دو لنگه با لولای متقابل و بدون ستون میانی؛ یک بازشوی معماری بزرگ و یکپارچه.",
  },
];

export const upvcFinishes: Finish[] = [
  { id: "white", label: "سفید", hex: "#f2f0e9", metalness: 0, roughness: 0.55 },
  { id: "anthracite", label: "آنتراسیت", hex: "#3b3f45", metalness: 0.05, roughness: 0.5 },
  { id: "golden-oak", label: "بلوط طلایی", hex: "#b07a3c", metalness: 0, roughness: 0.7 },
  { id: "walnut", label: "گردویی", hex: "#5a3c2b", metalness: 0, roughness: 0.68 },
];

export const aluminumFinishes: Finish[] = [
  { id: "anodized", label: "آنودایز طبیعی", hex: "#bcc1c6", metalness: 0.85, roughness: 0.32 },
  { id: "white-powder", label: "سفید پودری", hex: "#eceae3", metalness: 0.35, roughness: 0.45 },
  { id: "anthracite", label: "آنتراسیت", hex: "#33363b", metalness: 0.6, roughness: 0.4 },
  { id: "bronze", label: "برنز", hex: "#8a6a4b", metalness: 0.75, roughness: 0.35 },
  { id: "black", label: "مشکی", hex: "#1c1e21", metalness: 0.6, roughness: 0.38 },
];

// Verified veneers from the security-door production line description.
export const securityVeneers: Finish[] = [
  { id: "rush", label: "روکش راش", hex: "#b78a5b", metalness: 0, roughness: 0.62 },
  { id: "metal", label: "روکش فلزی", hex: "#8d9298", metalness: 0.8, roughness: 0.35 },
  { id: "laminox", label: "روکش لامینوکس", hex: "#2c2e33", metalness: 0.15, roughness: 0.3 },
  { id: "pvc", label: "روکش PVC", hex: "#d8d2c4", metalness: 0, roughness: 0.6 },
];

const CLEAR_GLASS: Finish = { id: "clear", label: "شفاف", hex: "#dfe9e7", metalness: 0, roughness: 0.08 };

// Sizes listed by Pardis on its own site (product names are height × width).
export const sizePresets: Record<OpeningId, SizePreset[]> = {
  hinged: [
    { label: "۱۵۷۵ × ۸۷۵", width: 875, height: 1575, sashes: 1, source: "pardis" },
    { label: "۱۵۴۰ × ۷۷۰", width: 770, height: 1540, sashes: 1, source: "pardis" },
    { label: "۱۴۹۰ × ۸۶۰", width: 860, height: 1490, sashes: 1, source: "pardis" },
  ],
  tilt: [
    { label: "۱۶۱۳ × ۱۰۹۶", width: 1096, height: 1613, source: "pardis" },
    { label: "۱۶۳۵ × ۱۲۳۵", width: 1235, height: 1635, source: "pardis" },
    { label: "۱۵۲۰ × ۷۶۵ بلند", width: 765, height: 1520, source: "pardis" },
  ],
  sliding: [{ label: "۱۸۹۵ × ۱۵۳۰", width: 1530, height: 1895, source: "pardis" }],
  "inward-door": [{ label: "۱۹۹۵ × ۱۷۴۵", width: 1745, height: 1995, sashes: 2, source: "pardis" }],
  "french-door": [{ label: "۲۰۲۵ × ۱۳۰۰", width: 1300, height: 2025, source: "pardis" }],
};

const glassPresets: SizePreset[] = [
  { label: "۱۰۰۰ × ۸۰۰", width: 800, height: 1000 },
  { label: "۱۵۰۰ × ۱۲۰۰", width: 1200, height: 1500 },
  { label: "۲۰۰۰ × ۱۵۰۰", width: 1500, height: 2000 },
];

const securityPresets: SizePreset[] = [
  { label: "۲۱۰۰ × ۱۰۰۰", width: 1000, height: 2100 },
  { label: "۲۲۰۰ × ۱۱۰۰", width: 1100, height: 2200 },
];

export const defaultConfig: StudioConfig = {
  family: "upvc",
  opening: "hinged",
  sashes: 1,
  aluminumProfile: "normal",
  glazing: "double",
  finishId: "white",
  width: 875,
  height: 1575,
  quantity: 1,
};

export const mm = (value: number): number => value / 1000;

export function openingsFor(family: FamilyId): OpeningOption[] {
  if (family === "upvc") return openings;
  if (family === "aluminum") return openings.filter((o) => o.id === "hinged" || o.id === "sliding");
  return [];
}

export function openingFor(config: StudioConfig): OpeningOption {
  return openings.find((o) => o.id === config.opening) ?? openings[0];
}

export function finishesFor(family: FamilyId): Finish[] {
  switch (family) {
    case "upvc":
      return upvcFinishes;
    case "aluminum":
      return aluminumFinishes;
    case "security-doors":
      return securityVeneers;
    default:
      return [];
  }
}

export function familyFinish(config: StudioConfig): Finish {
  const list = finishesFor(config.family);
  return list.find((f) => f.id === config.finishId) ?? list[0] ?? CLEAR_GLASS;
}

export function sizeRangeFor(config: StudioConfig): SizeRange {
  if (config.family === "glass") return { width: [300, 2400], height: [300, 2400] };
  if (config.family === "security-doors") return { width: [800, 1300], height: [1950, 2300] };
  const opening = openingFor(config);
  if (opening.kind === "door") {
    return { width: config.sashes === 2 ? [1200, 2400] : [700, 1300], height: [1900, 2400] };
  }
  const wide = config.sashes === 2 || config.opening === "sliding";
  return { width: wide ? [900, 2400] : [500, 1500], height: [500, 2200] };
}

export function presetsFor(config: StudioConfig): SizePreset[] {
  if (config.family === "upvc") return sizePresets[config.opening];
  if (config.family === "glass") return glassPresets;
  if (config.family === "security-doors") return securityPresets;
  return [];
}

const clamp = (value: number, [min, max]: [number, number]) => Math.min(max, Math.max(min, Math.round(value)));

export function clampConfig(input: StudioConfig): StudioConfig {
  const config: StudioConfig = { ...input };
  if (config.family === "aluminum" && !openingsFor("aluminum").some((o) => o.id === config.opening)) {
    config.opening = "sliding";
  }
  if (config.opening === "sliding" || config.opening === "french-door") config.sashes = 2;
  if (config.opening === "tilt") config.sashes = 1;

  const finishes = finishesFor(config.family);
  if (finishes.length && !finishes.some((f) => f.id === config.finishId)) config.finishId = finishes[0].id;

  const range = sizeRangeFor(config);
  config.width = clamp(config.width, range.width);
  config.height = clamp(config.height, range.height);
  config.quantity = clamp(config.quantity, [1, 200]);
  return config;
}

export function defaultsFor(family: FamilyId): StudioConfig {
  switch (family) {
    case "aluminum":
      return {
        family,
        opening: "sliding",
        sashes: 2,
        aluminumProfile: "thermal-break",
        glazing: "double",
        finishId: "anodized",
        width: 1600,
        height: 1400,
        quantity: 1,
      };
    case "glass":
      return { ...defaultConfig, family, finishId: "clear", width: 1000, height: 1200 };
    case "security-doors":
      return { ...defaultConfig, family, finishId: "rush", width: 1000, height: 2100 };
    default:
      return { ...defaultConfig };
  }
}

export function catalogItemFor(config: StudioConfig): CatalogItem | undefined {
  let id: string;
  switch (config.family) {
    case "upvc":
      id = openingFor(config).catalogId;
      break;
    case "aluminum":
      id = config.aluminumProfile === "thermal-break" ? "aluminum-thermal-break" : "aluminum-normal";
      break;
    case "glass":
      id = config.glazing === "multi" ? "glass-multi" : "glass-double";
      break;
    default:
      id = `security-${config.finishId}`;
  }
  return catalog.find((c) => c.id === id);
}

export function applyCatalogItem(current: StudioConfig, item: CatalogItem): StudioConfig {
  const quantity = current.quantity;
  switch (item.familyId) {
    case "upvc": {
      const opening = openings.find((o) => o.catalogId === item.id) ?? openings[0];
      const keepFinish = current.family === "upvc" ? current.finishId : "white";
      return clampConfig({
        ...defaultsFor("upvc"),
        opening: opening.id,
        sashes: opening.sashes,
        finishId: keepFinish,
        glazing: current.glazing,
        quantity,
      });
    }
    case "aluminum":
      return clampConfig({
        ...defaultsFor("aluminum"),
        aluminumProfile: item.id === "aluminum-thermal-break" ? "thermal-break" : "normal",
        finishId: current.family === "aluminum" ? current.finishId : "anodized",
        quantity,
      });
    case "glass":
      return clampConfig({ ...defaultsFor("glass"), glazing: item.id === "glass-multi" ? "multi" : "double", quantity });
    default:
      return clampConfig({ ...defaultsFor("security-doors"), finishId: item.id.replace("security-", ""), quantity });
  }
}

export function familyRecord(config: StudioConfig): ProductFamily {
  return productFamilies.find((f) => f.id === config.family) ?? productFamilies[0];
}

export function productionLineFor(config: StudioConfig): ProductionLine | undefined {
  const map: Record<FamilyId, string> = { upvc: "upvc", aluminum: "aluminum", glass: "glass", "security-doors": "security" };
  return productionLines.find((l) => l.id === map[config.family]);
}

export function buildSummary(config: StudioConfig): { label: string; value: string }[] {
  const family = families.find((f) => f.id === config.family)!;
  const lines: { label: string; value: string }[] = [{ label: "خانواده", value: family.label }];

  if (config.family === "upvc" || config.family === "aluminum") {
    const opening = openingFor(config);
    lines.push({ label: "نوع بازشو", value: `${opening.label} · ${faDigits(config.sashes)} لنگه` });
  }
  if (config.family === "aluminum") {
    lines.push({ label: "نوع پروفیل", value: config.aluminumProfile === "thermal-break" ? "ترمال‌بریک (شکست حرارتی)" : "نرمال" });
  }
  lines.push({ label: "ابعاد (عرض × ارتفاع)", value: `${faDigits(config.width)} × ${faDigits(config.height)} میلی‌متر` });
  if (config.family !== "glass") {
    lines.push({ label: config.family === "security-doors" ? "روکش" : "ترجیح رنگ / روکش", value: familyFinish(config).label });
  }
  if (config.family !== "security-doors") {
    lines.push({ label: "ساختار شیشه", value: `${config.glazing === "multi" ? "چندجداره" : "دوجداره"} · گاز آرگون` });
  }
  lines.push({ label: "تعداد", value: `${faDigits(config.quantity)} عدد` });
  return lines;
}

export function buildOrderText(config: StudioConfig): string {
  return buildSummary(config)
    .map((line) => `${line.label}: ${line.value}`)
    .join("\n");
}
