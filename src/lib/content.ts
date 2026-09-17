// ---------------------------------------------------------------------------
// PARDIS DOORS & WINDOWS — factual content ledger
// ---------------------------------------------------------------------------
// Every string in this file is sourced from pardiswindow.com (the company's
// own site). Nothing here is invented: no fabricated certifications, no
// invented technical numbers, no imaginary products. Where the source site
// does not provide a number or spec, we describe the capability in general,
// truthful terms instead of guessing. This file is the single source of
// truth consumed by every page/component so copy never drifts.
// ---------------------------------------------------------------------------

export const company = {
  legalName: "مجتمع تولیدی در و پنجره پردیس (سهامی خاص)",
  brand: "در و پنجره پردیس",
  registrationNo: "۳۸۸۳",
  nationalId: "۱۴۰۰۶۱۷۲۰۰۶",
  holding: "هلدینگ صنعتی اسرار پویای شرق",
  founded: 1387, // شمسی
  foundedGregorian: 2008,
  location: "شهرک صنعتی سبزوار",
  addressLine: "خراسان رضوی، سبزوار، شهرک صنعتی سبزوار، تلاش ۶، کیلومتر ۱۱ جاده تهران",
  facilityAreaSqm: 9000,
  specialists: 130,
  representations: 30,
  tagline: "کیفیت حق شماست؛ عایق‌بندی پایدار با تجهیزات مدرن",
  positioning: "بزرگ‌ترین تولیدکننده درب و پنجره UPVC با شیشه‌های چندجداره در شرق کشور",
  phones: ["051-44333303", "051-44333302"],
  email: "pardis.win@gmail.com",
  instagram: "https://www.instagram.com/pardiswindow/",
} as const;

export const machinery = [
  {
    brand: "Elumatec",
    origin: "آلمان",
    role: "دستگاه جوش چهارسر تمام‌اتوماتیک",
    detail:
      "جوشکاری هم‌زمان هر چهار گوشه‌ی قاب پروفیل UPVC؛ ضامن تراز‌بندی دقیق، استحکام درز جوش و اجرای بدون برآمدگی در بالاترین سرعت تولید.",
  },
  {
    brand: "CMS",
    origin: "ایتالیا",
    role: "مرکز ماشین‌کاری CNC پروفیل",
    detail: "برش و ماشین‌کاری دقیق پروفیل‌های UPVC و آلومینیوم پیش از مونتاژ.",
  },
] as const;

export const stats = [
  { value: 1387, suffix: "", label: "آغاز فعالیت", note: "شهرک صنعتی سبزوار" },
  { value: 9000, suffix: "m²", label: "مساحت تولیدی", note: "خطوط تولید یکپارچه" },
  { value: 130, suffix: "+", label: "نیروی متخصص", note: "مهندسی، تولید و کنترل کیفیت" },
  { value: 30, suffix: "+", label: "نمایندگی فعال", note: "سراسر ایران" },
] as const;

export type ProductionLine = {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  steps: string[];
  machinery?: string;
};

export const productionLines: ProductionLine[] = [
  {
    id: "upvc",
    index: "۰۱",
    title: "خط تولید درب و پنجره UPVC",
    short: "جوش چهارسر هم‌زمان با دقت آلمانی",
    description:
      "پروفیل‌های UPVC روی دستگاه جوش چهارسر فوق‌پیشرفته‌ی Elumatec آلمان، هر چهار گوشه‌ی قاب را هم‌زمان جوش می‌خورند؛ نتیجه، تراز‌بندی دقیق، استحکام بالای درز جوش و اجرای کاملاً بدون برآمدگی در بالاترین سرعت تولید است.",
    steps: [
      "برش دقیق پروفیل بر اساس اندازه سفارش",
      "ماشین‌کاری و آماده‌سازی محل یراق‌آلات",
      "جوش هم‌زمان چهار گوشه با Elumatec آلمان",
      "پاک‌سازی درز جوش و کنترل تراز قاب",
      "نصب یراق‌آلات و مونتاژ نهایی",
    ],
    machinery: "Elumatec – آلمان",
  },
  {
    id: "aluminum",
    title: "خط تولید درب و پنجره آلومینیوم",
    index: "۰۲",
    short: "برش، ماشین‌کاری، مونتاژ با استاندارد فنی",
    description:
      "از برش و ماشین‌کاری پروفیل تا مونتاژ، نصب یراق‌آلات و کنترل کیفیت، تمامی مراحل با رعایت استانداردهای فنی انجام می‌شود تا محصولی بادوام، زیبا و قابل‌اعتماد تحویل داده شود؛ مقاوم در برابر رطوبت، خوردگی، تغییرات آب‌وهوایی و تابش نور خورشید.",
    steps: [
      "برش و ماشین‌کاری CNC پروفیل آلومینیوم",
      "آماده‌سازی اتصالات و گوشه‌جوش/پرچ",
      "مونتاژ فریم و نصب یراق‌آلات",
      "کنترل کیفیت ابعادی و اجرایی",
    ],
    machinery: "CMS",
  },
  {
    id: "glass",
    title: "خط تولید شیشه‌های دوجداره",
    index: "۰۳",
    short: "از برش تا تزریق گاز آرگون",
    description:
      "برش خودکار شیشه، شست‌وشو، خم اسپیسر، تزریق سیلیکاژل، چسب بوتیل، پرس شیشه، تزریق گاز آرگون و در نهایت چسب پلی‌سولفاید — تمام مراحل با پیشرفته‌ترین تجهیزات روز تولید می‌شود. پردیس یکی از معدود تولیدکنندگان کشور با گواهی مرکز تحقیقات مسکن و شهرسازی برای تولید استاندارد شیشه دوجداره است.",
    steps: [
      "برش خودکار و شست‌وشوی شیشه",
      "خم‌کاری اسپیسر (فاصله‌انداز آلومینیومی)",
      "تزریق سیلیکاژل درون اسپیسر (رطوبت‌گیری)",
      "چسب بوتیل و پرس دو جداره شیشه",
      "تزریق گاز آرگون در محفظه میانی",
      "درزگیری نهایی با چسب پلی‌سولفاید",
    ],
  },
  {
    id: "security",
    title: "خط تولید درب‌های امنیتی",
    index: "۰۴",
    short: "استحکام صنعتی، پوشش تشریفاتی",
    description:
      "بدنه‌ای از ورق ایمنی فولادی سراسری و پارتیشن‌بندی داخلی از قوطی آهنی و گالوانیزه (ضخامت ورق چهارچوب ۱٫۲۵ میلی‌متر)، با روکش راش، فلزی، لامینوکس یا PVC، رنگ پلی‌اورتان روی روکش و رنگ الکترواستاتیک روی چهارچوب. قفل ضدسرقت برند کاله، چشمی، درکوب و دستگیره در استاندارد کامل، با ۵ سال ضمانت.",
    steps: [
      "برش و شکل‌دهی ورق فولادی سراسری",
      "پارتیشن‌بندی داخلی با قوطی آهنی/گالوانیزه",
      "نصب قفل کاله، چشمی، درکوب و دستگیره",
      "روکش‌کاری (راش، فلزی، لامینوکس یا PVC)",
      "رنگ پلی‌اورتان روکش و رنگ الکترواستاتیک چهارچوب",
    ],
  },
];

export type ProductFamily = {
  id: string;
  index: string;
  title: string;
  englishLabel: string;
  intro: string;
  variants: string[];
  advantages: string[];
};

export const productFamilies: ProductFamily[] = [
  {
    id: "upvc",
    index: "۰۱",
    title: "درب و پنجره UPVC",
    englishLabel: "UPVC SYSTEMS",
    intro:
      "محصول پایه و اصلی‌ترین خط پردیس: قاب‌های چندحفره‌ای UPVC با جوش چهارسر همزمان، همراه شیشه دو یا چندجداره.",
    variants: [
      "پنجره لولایی (بازشوی لولایی معمول)",
      "پنجره تک‌حالته با لولای متقابل",
      "پنجره کشویی با فریم جفت‌ریل",
      "درب درون‌بازشو UPVC",
      "درب مدل فرانسوی با لولای متقابل",
    ],
    advantages: [
      "عایق‌بندی حرارتی و صوتی پایدار",
      "قاب چندحفره‌ای برای استحکام و دوام",
      "تنوع بازشو متناسب با معماری هر پروژه",
    ],
  },
  {
    id: "aluminum",
    index: "۰۲",
    title: "درب و پنجره آلومینیومی",
    englishLabel: "ALUMINUM SYSTEMS",
    intro:
      "خط تولید آلومینیوم پردیس با ماشین‌کاری CNC دقیق، سیستم‌هایی سبک، مقاوم و بادوام برای نماهای مدرن اجرا می‌کند.",
    variants: ["پروفیل نرمال", "پروفیل ترمال‌بریک (شکست حرارتی)"],
    advantages: [
      "مقاومت بالا در برابر رطوبت و خوردگی",
      "پایداری رنگ در برابر تابش نور خورشید",
      "دقت اجرایی حاصل از ماشین‌کاری CNC",
    ],
  },
  {
    id: "glass",
    index: "۰۳",
    title: "شیشه دوجداره و چندجداره",
    englishLabel: "INSULATED GLAZING",
    intro:
      "قلب مهندسی عایق‌بندی پردیس. دو یا چند لایه شیشه با فاصله‌انداز آلومینیومی، رطوبت‌گیر سیلیکاژل و گاز آرگون میان‌لایه.",
    variants: ["دوجداره استاندارد", "چندجداره (چند لایه شیشه)"],
    advantages: [
      "کاهش انتقال حرارت با گاز آرگون میان‌لایه",
      "رطوبت‌گیری دائم با سیلیکاژل درون اسپیسر",
      "درزگیری دولایه با چسب بوتیل و پلی‌سولفاید",
    ],
  },
  {
    id: "security-doors",
    index: "۰۴",
    title: "درب‌های امنیتی (ضدسرقت)",
    englishLabel: "SECURITY DOORS",
    intro:
      "بدنه‌ای صنعتی برای امنیت، با پوششی که در استاندارد دکوراسیون داخلی باقی می‌ماند.",
    variants: [
      "روکش راش (روکش چوبی)",
      "روکش فلزی",
      "روکش لامینوکس",
      "روکش PVC",
    ],
    advantages: [
      "ورق ایمنی فولادی سراسری و پارتیشن داخلی گالوانیزه",
      "قفل ضدسرقت کاله، چشمی، درکوب و دستگیره استاندارد",
      "۵ سال ضمانت کیفیت",
    ],
  },
];

export const glassLayers = [
  {
    id: "outer-pane",
    label: "شیشه بیرونی",
    detail: "لایه‌ی نخست رو به فضای بیرونی؛ اولین سد در برابر آفتاب، باد و صدا.",
  },
  {
    id: "spacer",
    label: "فاصله‌انداز آلومینیومی (اسپیسر)",
    detail: "قاب باریک آلومینیومی حاوی دانه‌های سیلیکاژل که رطوبت میان دو شیشه را به‌طور دائم جذب می‌کند.",
  },
  {
    id: "butyl",
    label: "چسب بوتیل",
    detail: "درزگیری اولیه‌ی لبه‌ی اسپیسر پیش از پرس نهایی شیشه.",
  },
  {
    id: "argon",
    label: "محفظه گاز آرگون",
    detail: "جایگزینی هوای میان دو شیشه با گاز بی‌اثر آرگون برای کاهش انتقال حرارت میان‌لایه.",
  },
  {
    id: "polysulfide",
    label: "چسب پلی‌سولفاید",
    detail: "درزگیری نهایی دور تا دور شیشه؛ مانع نفوذ رطوبت و تثبیت‌کننده‌ی سازه‌ی دوجداره.",
  },
  {
    id: "inner-pane",
    label: "شیشه داخلی",
    detail: "لایه‌ی دوم رو به فضای داخلی؛ حفظ دمای محیط و کاهش انتقال صدا.",
  },
] as const;

export const quality = {
  certificate:
    "پردیس یکی از معدود شرکت‌های کشور است که موفق به کسب گواهینامه‌ی مرکز تحقیقات مسکن و شهرسازی برای تولید استاندارد شیشه‌های دوجداره شده است.",
  process:
    "کنترل کیفیت در پردیس مرحله‌ای جدا نیست؛ در هر چهار خط تولید — UPVC، آلومینیوم، شیشه دوجداره و درب امنیتی — ابعاد، تراز، استحکام درز و اجرای یراق‌آلات پیش از تحویل بازرسی می‌شود.",
  guarantee: "درب‌های امنیتی پردیس با ۵ سال ضمانت کیفیت عرضه می‌شوند.",
} as const;

export type Project = {
  id: string;
  title: string;
  province: string;
  year: string;
  detail: string;
};

export const projects: Project[] = [
  {
    id: "ghadir-zahedan",
    title: "پروژه غدیر، زاهدان",
    province: "سیستان و بلوچستان",
    year: "۱۳۹۵",
    detail: "اجرای فاز اول پروژه غدیر در شهر زاهدان، توسط نمایندگی زاهدان.",
  },
  {
    id: "narges-mahmoudabad",
    title: "برج نرگس، مجتمع آموزشی-رفاهی وزارت نفت",
    province: "مازندران",
    year: "—",
    detail: "تعویض پنجره‌های برج نرگس در مجتمع آموزشی و رفاهی وزارت نفت، محمودآباد.",
  },
  {
    id: "simulator-mahmoudabad",
    title: "سیمولاتور دانشکده علوم دریایی",
    province: "مازندران",
    year: "—",
    detail: "تعویض پنجره‌های سالن سیمولاتور دانشکده علوم دریایی محمودآباد.",
  },
  {
    id: "sepehr-saderat",
    title: "برج سپهر صادرات",
    province: "—",
    year: "—",
    detail: "تعویض پنجره‌های برج سپهر بانک صادرات.",
  },
  {
    id: "anabestani",
    title: "پروژه عنابستانی",
    province: "خراسان رضوی",
    year: "—",
    detail: "اجرای درب و پنجره UPVC پروژه عنابستانی.",
  },
];

export type KnowledgeTopic = {
  id: string;
  title: string;
  englishLabel: string;
  summary: string;
};

export const knowledgeTopics: KnowledgeTopic[] = [
  {
    id: "upvc",
    title: "درب و پنجره UPVC",
    englishLabel: "UPVC",
    summary:
      "چرا قاب چندحفره‌ای UPVC برای عایق‌بندی حرارتی و صوتی ساختمان‌های مسکونی و اداری انتخاب می‌شود.",
  },
  {
    id: "aluminum",
    title: "درب و پنجره آلومینیومی (نرمال و ترمال‌بریک)",
    englishLabel: "ALUMINUM",
    summary: "تفاوت پروفیل نرمال و ترمال‌بریک، و کاربرد هرکدام در نمای ساختمان.",
  },
  {
    id: "glass",
    title: "شیشه دوجداره و چندجداره",
    englishLabel: "GLAZING",
    summary: "نقش اسپیسر، سیلیکاژل و گاز آرگون در عملکرد حرارتی شیشه دوجداره.",
  },
  {
    id: "security-doors",
    title: "درب ضد سرقت",
    englishLabel: "SECURITY",
    summary: "اجزای یک درب امنیتی استاندارد؛ از ورق فولادی تا قفل و یراق‌آلات.",
  },
  {
    id: "facade",
    title: "نمای شیشه‌ای و کرتین وال",
    englishLabel: "CURTAIN WALL",
    summary: "کاربرد سیستم‌های شیشه‌ای در نمای ساختمان‌های بلندمرتبه و تجاری.",
  },
  {
    id: "handrail",
    title: "هندریل",
    englishLabel: "HANDRAIL",
    summary: "سیستم‌های نرده و هندریل شیشه‌ای/آلومینیومی مکمل نمای ساختمان.",
  },
  {
    id: "profiles",
    title: "معرفی پروفیل‌ها",
    englishLabel: "PROFILES",
    summary: "آشنایی با انواع پروفیل مورد استفاده در سیستم‌های UPVC و آلومینیوم.",
  },
];

export const navLinks = [
  { href: "/products", label: "محصولات" },
  { href: "/technology", label: "فناوری تولید" },
  { href: "/quality", label: "کیفیت" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/knowledge", label: "دانش‌نامه" },
  { href: "/about", label: "درباره پردیس" },
] as const;

export const contactTopics = [
  { value: "quote", label: "استعلام قیمت" },
  { value: "consultation", label: "درخواست مشاوره" },
  { value: "representation", label: "درخواست نمایندگی" },
  { value: "cooperation", label: "همکاری و تأمین" },
  { value: "other", label: "سایر موضوعات" },
] as const;
