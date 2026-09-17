import { productFamilies } from "./content";

// ---------------------------------------------------------------------------
// Flattened, filterable product catalog.
// ---------------------------------------------------------------------------
// Every field below is a direct restructuring of facts already present in
// `content.ts` (itself sourced from pardiswindow.com). No specs, materials,
// or claims are invented here — variants are simply broken into individually
// filterable records with a short engineering note drawn from the existing
// production-line / advantage copy so the explorer can surface finer detail
// without fabricating anything new.
// ---------------------------------------------------------------------------

type CatalogKind = "window" | "door" | "mixed" | "glass" | "security";

export type CatalogItem = {
  id: string;
  familyId: string;
  familyTitle: string;
  familyEnglish: string;
  kind: CatalogKind;
  kindLabel: string;
  title: string;
  facet: string;
  facetGroup: string;
  note: string;
  tags: string[];
  accent: "argon" | "bronze";
};

const upvc = productFamilies.find((f) => f.id === "upvc")!;
const aluminum = productFamilies.find((f) => f.id === "aluminum")!;
const glass = productFamilies.find((f) => f.id === "glass")!;
const security = productFamilies.find((f) => f.id === "security-doors")!;

export const catalog: CatalogItem[] = [
  {
    id: "upvc-hinged",
    familyId: upvc.id,
    familyTitle: upvc.title,
    familyEnglish: upvc.englishLabel,
    kind: "window",
    kindLabel: "پنجره",
    title: "پنجره لولایی (بازشوی لولایی معمول)",
    facet: "لولایی",
    facetGroup: "نوع بازشو",
    note: "جوش هم‌زمان چهار گوشه با دستگاه Elumatec آلمان؛ قاب چندحفره‌ای برای استحکام و دوام.",
    tags: [upvc.advantages[0], upvc.advantages[1]],
    accent: "argon",
  },
  {
    id: "upvc-tilt",
    familyId: upvc.id,
    familyTitle: upvc.title,
    familyEnglish: upvc.englishLabel,
    kind: "window",
    kindLabel: "پنجره",
    title: "پنجره تک‌حالته با لولای متقابل",
    facet: "تک‌حالته",
    facetGroup: "نوع بازشو",
    note: "لولای متقابل برای کنترل دقیق بازشو؛ عایق‌بندی حرارتی و صوتی پایدار در همان قاب چندحفره‌ای.",
    tags: [upvc.advantages[0], upvc.advantages[2]],
    accent: "argon",
  },
  {
    id: "upvc-sliding",
    familyId: upvc.id,
    familyTitle: upvc.title,
    familyEnglish: upvc.englishLabel,
    kind: "window",
    kindLabel: "پنجره",
    title: "پنجره کشویی با فریم جفت‌ریل",
    facet: "کشویی",
    facetGroup: "نوع بازشو",
    note: "فریم جفت‌ریل برای حرکت روان لنگه‌ها؛ مناسب بازشوهای عریض با محدودیت فضای بازشدن به داخل یا بیرون.",
    tags: [upvc.advantages[2], upvc.advantages[0]],
    accent: "argon",
  },
  {
    id: "upvc-inward-door",
    familyId: upvc.id,
    familyTitle: upvc.title,
    familyEnglish: upvc.englishLabel,
    kind: "door",
    kindLabel: "درب",
    title: "درب درون‌بازشو UPVC",
    facet: "درون‌بازشو",
    facetGroup: "نوع بازشو",
    note: "همان قاب چندحفره‌ای UPVC در مقیاس درب؛ جوش چهارسر همزمان برای استحکام گوشه‌ها.",
    tags: [upvc.advantages[1], upvc.advantages[0]],
    accent: "argon",
  },
  {
    id: "upvc-french-door",
    familyId: upvc.id,
    familyTitle: upvc.title,
    familyEnglish: upvc.englishLabel,
    kind: "door",
    kindLabel: "درب",
    title: "درب مدل فرانسوی با لولای متقابل",
    facet: "فرانسوی",
    facetGroup: "نوع بازشو",
    note: "دو لنگه با لولای متقابل برای بازشوهای معماری بزرگ؛ سازگار با شیشه دو یا چندجداره.",
    tags: [upvc.advantages[2], upvc.advantages[1]],
    accent: "argon",
  },
  {
    id: "aluminum-normal",
    familyId: aluminum.id,
    familyTitle: aluminum.title,
    familyEnglish: aluminum.englishLabel,
    kind: "mixed",
    kindLabel: "درب و پنجره آلومینیومی",
    title: "پروفیل نرمال",
    facet: "نرمال",
    facetGroup: "نوع پروفیل",
    note: "ماشین‌کاری CNC با تجهیزات CMS؛ مقاومت بالا در برابر رطوبت، خوردگی و تابش نور خورشید.",
    tags: [aluminum.advantages[0], aluminum.advantages[2]],
    accent: "bronze",
  },
  {
    id: "aluminum-thermal-break",
    familyId: aluminum.id,
    familyTitle: aluminum.title,
    familyEnglish: aluminum.englishLabel,
    kind: "mixed",
    kindLabel: "درب و پنجره آلومینیومی",
    title: "پروفیل ترمال‌بریک (شکست حرارتی)",
    facet: "ترمال‌بریک",
    facetGroup: "نوع پروفیل",
    note: "شکست حرارتی میان دو پوسته‌ی آلومینیوم؛ همان دقت ماشین‌کاری CNC، برای نماهای با نیاز عایق‌بندی بیشتر.",
    tags: [aluminum.advantages[1], aluminum.advantages[2]],
    accent: "bronze",
  },
  {
    id: "glass-double",
    familyId: glass.id,
    familyTitle: glass.title,
    familyEnglish: glass.englishLabel,
    kind: "glass",
    kindLabel: "شیشه",
    title: "دوجداره استاندارد",
    facet: "دوجداره",
    facetGroup: "ساختار شیشه",
    note: "فاصله‌انداز آلومینیومی، سیلیکاژل رطوبت‌گیر و گاز آرگون میان دو لایه شیشه.",
    tags: [glass.advantages[0], glass.advantages[1]],
    accent: "argon",
  },
  {
    id: "glass-multi",
    familyId: glass.id,
    familyTitle: glass.title,
    familyEnglish: glass.englishLabel,
    kind: "glass",
    kindLabel: "شیشه",
    title: "چندجداره (چند لایه شیشه)",
    facet: "چندجداره",
    facetGroup: "ساختار شیشه",
    note: "لایه‌ی شیشه‌ی اضافه برای عایق‌بندی حرارتی و صوتی بیشتر؛ همان درزگیری دولایه بوتیل و پلی‌سولفاید.",
    tags: [glass.advantages[2], glass.advantages[0]],
    accent: "argon",
  },
  {
    id: "security-rush",
    familyId: security.id,
    familyTitle: security.title,
    familyEnglish: security.englishLabel,
    kind: "security",
    kindLabel: "درب امنیتی",
    title: "روکش راش (روکش چوبی)",
    facet: "روکش راش",
    facetGroup: "نوع روکش",
    note: "ورق ایمنی فولادی سراسری با پارتیشن گالوانیزه داخلی؛ روکش راش با رنگ پلی‌اورتان.",
    tags: [security.advantages[0], security.advantages[2]],
    accent: "bronze",
  },
  {
    id: "security-metal",
    familyId: security.id,
    familyTitle: security.title,
    familyEnglish: security.englishLabel,
    kind: "security",
    kindLabel: "درب امنیتی",
    title: "روکش فلزی",
    facet: "روکش فلزی",
    facetGroup: "نوع روکش",
    note: "بدنه‌ی فولادی با روکش فلزی؛ قفل ضدسرقت کاله، چشمی، درکوب و دستگیره استاندارد.",
    tags: [security.advantages[1], security.advantages[2]],
    accent: "bronze",
  },
  {
    id: "security-laminox",
    familyId: security.id,
    familyTitle: security.title,
    familyEnglish: security.englishLabel,
    kind: "security",
    kindLabel: "درب امنیتی",
    title: "روکش لامینوکس",
    facet: "روکش لامینوکس",
    facetGroup: "نوع روکش",
    note: "روکش لامینوکس مقاوم در برابر سایش، روی همان بدنه‌ی فولادی با پارتیشن‌بندی داخلی.",
    tags: [security.advantages[0], security.advantages[2]],
    accent: "bronze",
  },
  {
    id: "security-pvc",
    familyId: security.id,
    familyTitle: security.title,
    familyEnglish: security.englishLabel,
    kind: "security",
    kindLabel: "درب امنیتی",
    title: "روکش PVC",
    facet: "روکش PVC",
    facetGroup: "نوع روکش",
    note: "روکش PVC اقتصادی‌تر با همان استحکام ورق فولادی سراسری و ۵ سال ضمانت.",
    tags: [security.advantages[2], security.advantages[0]],
    accent: "bronze",
  },
];


export const catalogKinds: { id: CatalogKind; label: string }[] = [
  { id: "window", label: "پنجره" },
  { id: "door", label: "درب" },
  { id: "mixed", label: "درب و پنجره آلومینیومی" },
  { id: "glass", label: "شیشه" },
  { id: "security", label: "درب امنیتی" },
];
