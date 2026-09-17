"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { catalog, catalogKinds, type CatalogItem } from "@/lib/catalog";
import {
  applyCatalogItem,
  buildOrderText,
  buildSummary,
  catalogItemFor,
  clampConfig,
  defaultConfig,
  defaultsFor,
  families,
  familyFinish,
  familyRecord,
  finishesFor,
  openingFor,
  openingsFor,
  presetsFor,
  productionLineFor,
  sizeRangeFor,
  type FamilyId,
  type StudioConfig,
} from "@/lib/configurator";
import { prefersReducedMotion, supportsWebGL } from "@/lib/device";
import { faDigits } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { ViewState } from "@/components/three/ProductModels";
import { ElevationDrawing } from "./ElevationDrawing";
import { ProductGlyph } from "./ProductGlyph";
import { ProductInquiryDialog } from "./ProductInquiryDialog";
import { StudioLoader } from "@/components/ui/StudioLoader";

const ProductViewer = dynamic(() => import("@/components/three/ProductViewer"), {
  ssr: false,
  loading: () => <StudioLoader />,
});

const INITIAL_VIEW: ViewState = { open: false, explode: false, cutaway: false, yaw: 0 };

export function ProductStudio() {
  const [config, setConfigState] = useState<StudioConfig>(defaultConfig);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [autoRotate, setAutoRotate] = useState(false);
  const [renderMode, setRenderMode] = useState<"3d" | "2d">("3d");
  const [familyFilter, setFamilyFilter] = useState<FamilyId | "all">("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"specs" | "process" | "guide">("specs");
  const [orderOpen, setOrderOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [coarse, setCoarse] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const node = viewerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "240px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timeout);
  }, [copied]);

  const patch = (changes: Partial<StudioConfig>) => setConfigState((current) => clampConfig({ ...current, ...changes }));

  const switchFamily = (family: FamilyId) => {
    setConfigState((current) => ({ ...defaultsFor(family), quantity: current.quantity }));
    setView((current) => ({ ...current, open: false, explode: false, cutaway: false }));
  };

  const loadItem = (item: CatalogItem) => {
    setConfigState((current) => applyCatalogItem(current, item));
    setView((current) => ({ ...current, open: false, explode: false, cutaway: false }));
  };

  const item = catalogItemFor(config);
  const family = familyRecord(config);
  const openings = openingsFor(config.family);
  const opening = openingFor(config);
  const finishes = finishesFor(config.family);
  const finish = familyFinish(config);
  const range = sizeRangeFor(config);
  const presets = presetsFor(config);
  const summary = buildSummary(config);
  const line = productionLineFor(config);
  const hasOpening = config.family === "upvc" || config.family === "aluminum";
  const hasGlazing = config.family !== "security-doors";
  const show3D = webgl === true && renderMode === "3d";

  const railItems = useMemo(() => {
    const q = query.trim();
    return catalog.filter((entry) => {
      if (familyFilter !== "all" && entry.familyId !== familyFilter) return false;
      if (kindFilter !== "all" && entry.kind !== kindFilter) return false;
      if (!q) return true;
      return `${entry.title} ${entry.familyTitle} ${entry.facet} ${entry.note}`.includes(q);
    });
  }, [familyFilter, kindFilter, query]);

  const tools = [
    {
      id: "open",
      label: view.open ? "بستن" : "باز کردن",
      active: view.open,
      show: config.family !== "glass",
      onClick: () => setView((v) => ({ ...v, open: !v.open })),
    },
    {
      id: "explode",
      label: "نمای انفجاری",
      active: view.explode,
      show: config.family === "glass",
      onClick: () => setView((v) => ({ ...v, explode: !v.explode })),
    },
    {
      id: "cutaway",
      label: "برش داخلی",
      active: view.cutaway,
      show: config.family === "security-doors",
      onClick: () => setView((v) => ({ ...v, cutaway: !v.cutaway })),
    },
    { id: "auto", label: "چرخش خودکار", active: autoRotate, show: show3D, onClick: () => setAutoRotate((v) => !v) },
    { id: "left", label: "↺", active: false, show: show3D, onClick: () => setView((v) => ({ ...v, yaw: v.yaw - Math.PI / 4 })) },
    { id: "right", label: "↻", active: false, show: show3D, onClick: () => setView((v) => ({ ...v, yaw: v.yaw + Math.PI / 4 })) },
    {
      id: "reset",
      label: "بازنشانی نما",
      active: false,
      show: true,
      onClick: () => {
        setView(INITIAL_VIEW);
        setAutoRotate(false);
      },
    },
  ];

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderText(config));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-36" id="product-studio">
      <div className="pointer-events-none absolute -left-40 top-24 size-[480px] rounded-full bg-argon/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="۰۱" title="Product Studio" />
            <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[1.08] text-ink">
              محصول را ببینید، بسازید، سفارش دهید.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-ink-soft md:mb-1">
            هر محصول پردیس را در سه‌بعد بچرخانید، باز کنید، ابعاد و رنگ را تغییر دهید و دقیقاً همان پیکربندی را برای
            اندازه‌گیری و قیمت‌گذاری ثبت کنید.
          </p>
        </Reveal>

        {/* Live filter console + catalog rail */}
        <Reveal delay={60} className="mt-12 rounded-[26px] border border-white/70 bg-white/55 p-4 shadow-[0_18px_50px_-32px_rgba(21,23,26,0.55)] backdrop-blur-xl md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">
              <Chip active={familyFilter === "all"} onClick={() => setFamilyFilter("all")}>
                همه خانواده‌ها
              </Chip>
              {families.map((f) => (
                <Chip key={f.id} active={familyFilter === f.id} onClick={() => setFamilyFilter(f.id)}>
                  {f.short}
                </Chip>
              ))}
            </div>
            <span className="hidden h-6 w-px bg-ink/10 lg:block" />
            <div className="flex flex-wrap gap-2">
              <Chip active={kindFilter === "all"} onClick={() => setKindFilter("all")} tone="soft">
                همه کاربری‌ها
              </Chip>
              {catalogKinds.map((kind) => (
                <Chip key={kind.id} active={kindFilter === kind.id} onClick={() => setKindFilter(kind.id)} tone="soft">
                  {kind.label}
                </Chip>
              ))}
            </div>
            <div className="relative lg:mr-auto lg:w-72">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M20 20l-4.5 -4.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جست‌وجو؛ مثلاً «کشویی» یا «راش»"
                aria-label="جست‌وجوی محصول"
                className="w-full rounded-full border border-ink/10 bg-white/70 py-2.5 pr-11 pl-4 text-sm text-ink placeholder:text-ink-mute focus:border-argon focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-ink-mute">
            <span>
              <span className="font-technical text-ink">{faDigits(railItems.length)}</span> محصول برای انتخاب
            </span>
            {familyFilter !== "all" || kindFilter !== "all" || query ? (
              <button
                type="button"
                onClick={() => {
                  setFamilyFilter("all");
                  setKindFilter("all");
                  setQuery("");
                }}
                className="font-medium text-argon hover:underline"
              >
                پاک‌کردن فیلترها
              </button>
            ) : null}
          </div>

          <div className="no-scrollbar -mx-4 mt-3 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 md:-mx-5 md:px-5">
            {railItems.length === 0 ? (
              <p className="w-full rounded-2xl border border-dashed border-ink/15 px-5 py-6 text-center text-sm text-ink-soft">
                محصولی با این فیلترها پیدا نشد؛ فیلترها را تغییر دهید.
              </p>
            ) : (
              railItems.map((entry) => {
                const selected = item?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    data-cursor="view"
                    onClick={() => loadItem(entry)}
                    aria-pressed={selected}
                    className={`group flex w-[230px] shrink-0 snap-start items-center gap-3 rounded-2xl border p-3 text-right transition-all ${
                      selected
                        ? "border-argon bg-argon text-cloud shadow-[0_18px_40px_-24px_rgba(91,110,245,.9)]"
                        : "border-ink/10 bg-white/60 text-ink hover:-translate-y-0.5 hover:border-ink/30"
                    }`}
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        selected ? "bg-white/15 text-cloud" : entry.accent === "argon" ? "bg-argon-soft text-argon" : "bg-bronze-soft text-bronze"
                      }`}
                    >
                      <ProductGlyph item={entry} className="size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold leading-tight">{entry.title}</span>
                      <span className={`mt-1 block font-technical text-[9px] uppercase tracking-[0.16em] ${selected ? "text-cloud/70" : "text-ink-mute"}`}>
                        {entry.familyEnglish} · {entry.facet}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </Reveal>

        {/* Viewer + configurator */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.32fr_0.88fr]">
          <div className="flex flex-col gap-4">
            <div
              ref={viewerRef}
              data-cursor="rotate"
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0e1013] shadow-[0_40px_90px_-50px_rgba(12,13,16,0.9)] md:aspect-[16/11]"
            >
              {webgl === null ? (
                <StudioLoader />
              ) : show3D ? (
                <ProductViewer
                  config={config}
                  view={view}
                  quality={coarse ? "lite" : "high"}
                  interactive={!coarse}
                  active={inView}
                  autoRotate={autoRotate && !reduced}
                />
              ) : (
                <ElevationDrawing config={config} />
              )}

              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
                <div className="rounded-full border border-white/15 bg-graphite/70 px-3 py-1.5 font-technical text-[10px] uppercase tracking-[0.22em] text-cloud/80 backdrop-blur-md">
                  {show3D ? "STUDIO · 3D" : "STUDIO · ELEVATION"}
                </div>
                <div className="max-w-[60%] rounded-2xl border border-white/15 bg-graphite/70 px-4 py-2.5 text-left backdrop-blur-md" dir="rtl">
                  <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-argon-glow">{family.englishLabel}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-cloud">{item?.title ?? family.title}</p>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 md:p-5">
                <div className="pointer-events-auto flex flex-wrap gap-1.5">
                  {webgl ? (
                    <ToolButton active={renderMode === "3d"} onClick={() => setRenderMode(renderMode === "3d" ? "2d" : "3d")}>
                      {renderMode === "3d" ? "نقشه ۲D" : "نمای ۳D"}
                    </ToolButton>
                  ) : null}
                  {tools
                    .filter((tool) => tool.show)
                    .map((tool) => (
                      <ToolButton key={tool.id} active={tool.active} onClick={tool.onClick}>
                        {tool.label}
                      </ToolButton>
                    ))}
                </div>
                <p className="hidden font-technical text-[9px] uppercase tracking-[0.2em] text-cloud/45 md:block">
                  {coarse ? "Use the buttons to rotate" : "Drag to rotate · Scroll to zoom"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-4">
              <Stat label="ابعاد" value={`${faDigits(config.width)} × ${faDigits(config.height)}`} unit="mm" />
              <Stat
                label={hasOpening ? "بازشو" : hasGlazing ? "ساختار" : "روکش"}
                value={hasOpening ? `${opening.label}` : hasGlazing ? (config.glazing === "multi" ? "چندجداره" : "دوجداره") : finish.label}
              />
              <Stat label={config.family === "glass" ? "گاز میانی" : "رنگ / روکش"} value={config.family === "glass" ? "آرگون" : finish.label} swatch={config.family === "glass" ? undefined : finish.hex} />
              <Stat label="تعداد" value={faDigits(config.quantity)} unit="عدد" />
            </div>
          </div>

          {/* Configurator panel */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[26px] border border-white/70 bg-white/55 p-5 backdrop-blur-xl md:p-6">
              <Group label="Family" title="خانواده محصول">
                <div className="grid grid-cols-2 gap-2">
                  {families.map((f) => {
                    const glyphItem = catalog.find((c) => c.familyId === f.id);
                    const active = config.family === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        data-cursor="view"
                        onClick={() => switchFamily(f.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-right transition-all ${
                          active ? "border-ink bg-ink text-cloud" : "border-ink/10 bg-white/60 text-ink hover:border-ink/30"
                        }`}
                      >
                        {glyphItem ? (
                          <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/15" : "bg-paper-dim/70"}`}>
                            <ProductGlyph item={glyphItem} className="size-5" />
                          </span>
                        ) : null}
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold">{f.short}</span>
                          <span className={`block font-technical text-[9px] uppercase tracking-[0.16em] ${active ? "text-cloud/60" : "text-ink-mute"}`}>{f.english}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Group>

              {hasOpening ? (
                <Group label="Opening" title="نوع بازشو">
                  <div className="flex flex-wrap gap-2">
                    {openings.map((o) => (
                      <Chip key={o.id} active={config.opening === o.id} onClick={() => patch({ opening: o.id, sashes: o.sashes })}>
                        {o.label}
                      </Chip>
                    ))}
                  </div>
                  {opening.sashChoice ? (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-ink-soft">تعداد لنگه</span>
                      <Segmented
                        options={[
                          { value: 1, label: "یک لنگه" },
                          { value: 2, label: "دو لنگه" },
                        ]}
                        value={config.sashes}
                        onChange={(value) => patch({ sashes: value as 1 | 2 })}
                      />
                    </div>
                  ) : null}
                  {config.family === "aluminum" ? (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-ink-soft">نوع پروفیل</span>
                      <Segmented
                        options={[
                          { value: "normal", label: "نرمال" },
                          { value: "thermal-break", label: "ترمال‌بریک" },
                        ]}
                        value={config.aluminumProfile}
                        onChange={(value) => patch({ aluminumProfile: value as "normal" | "thermal-break" })}
                      />
                    </div>
                  ) : null}
                </Group>
              ) : null}

              <Group label="Dimensions" title="ابعاد (میلی‌متر)">
                <RangeField label="عرض" value={config.width} min={range.width[0]} max={range.width[1]} onChange={(width) => patch({ width })} />
                <RangeField label="ارتفاع" value={config.height} min={range.height[0]} max={range.height[1]} onChange={(height) => patch({ height })} />
                {presets.length ? (
                  <div className="mt-3">
                    <p className="mb-2 font-technical text-[9px] uppercase tracking-[0.18em] text-ink-mute">
                      {presets.some((p) => p.source === "pardis") ? "ابعاد فهرست‌شده‌ی پردیس (ارتفاع × عرض)" : "ابعاد پیشنهادی (ارتفاع × عرض)"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((preset) => {
                        const active = preset.width === config.width && preset.height === config.height;
                        return (
                          <Chip
                            key={preset.label}
                            active={active}
                            tone="soft"
                            onClick={() => patch({ width: preset.width, height: preset.height, ...(preset.sashes ? { sashes: preset.sashes } : {}) })}
                          >
                            <span className="font-technical">{preset.label}</span>
                            {preset.source === "pardis" ? <span className="mr-1.5 inline-block size-1.5 rounded-full bg-bronze align-middle" /> : null}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </Group>

              {finishes.length ? (
                <Group label="Finish" title={config.family === "security-doors" ? "نوع روکش" : "ترجیح رنگ / روکش"}>
                  <div className="flex flex-wrap gap-2.5">
                    {finishes.map((f) => {
                      const active = config.finishId === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          data-cursor="detail"
                          onClick={() => patch({ finishId: f.id })}
                          aria-pressed={active}
                          title={f.label}
                          className={`flex items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-3 text-xs transition-all ${
                            active ? "border-ink bg-ink text-cloud" : "border-ink/10 bg-white/60 text-ink hover:border-ink/30"
                          }`}
                        >
                          <span className="size-6 rounded-full border border-black/10 shadow-inner" style={{ background: f.hex }} />
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                  {config.family !== "security-doors" ? (
                    <p className="mt-2 text-[11px] leading-5 text-ink-mute">تنوع نهایی رنگ و روکش با مشاوره‌ی کارشناس پردیس تأیید می‌شود.</p>
                  ) : null}
                </Group>
              ) : null}

              {hasGlazing ? (
                <Group label="Glazing" title="ساختار شیشه">
                  <Segmented
                    options={[
                      { value: "double", label: "دوجداره" },
                      { value: "multi", label: "چندجداره" },
                    ]}
                    value={config.glazing}
                    onChange={(value) => patch({ glazing: value as "double" | "multi" })}
                  />
                  <p className="mt-2 text-[11px] leading-5 text-ink-mute">اسپیسر آلومینیومی با سیلیکاژل، گاز آرگون در محفظه‌ی میانی، درزگیری بوتیل و پلی‌سولفاید.</p>
                </Group>
              ) : null}

              <Group label="Quantity" title="تعداد">
                <div className="flex items-center gap-3">
                  <Stepper value={config.quantity} onChange={(quantity) => patch({ quantity })} />
                  <span className="text-xs text-ink-soft">عدد از این پیکربندی</span>
                </div>
              </Group>
            </div>

            {/* Order summary */}
            <div className="rounded-[26px] bg-ink p-5 text-cloud md:p-6">
              <div className="flex items-center justify-between border-b border-cloud/10 pb-4">
                <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-argon-glow">Order sheet</p>
                <p className="font-technical text-[10px] text-cloud/45">{item?.id.toUpperCase()}</p>
              </div>
              <dl className="mt-4 grid gap-2.5">
                {summary.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 text-sm">
                    <dt className="text-cloud/55">{row.label}</dt>
                    <dd className="text-left font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[11px] leading-5 text-cloud/45">قیمت پس از اندازه‌گیری و بررسی مشخصات پروژه توسط کارشناس اعلام می‌شود.</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  data-cursor="order"
                  onClick={() => setOrderOpen(true)}
                  className="flex-1 rounded-full bg-argon px-5 py-3.5 text-sm font-medium text-cloud transition-transform hover:-translate-y-0.5"
                >
                  سفارش این پیکربندی
                </button>
                <button
                  type="button"
                  onClick={copySummary}
                  className="rounded-full border border-cloud/25 px-5 py-3.5 text-sm font-medium text-cloud/85 transition-colors hover:border-argon-glow hover:text-argon-glow"
                >
                  {copied ? "کپی شد ✓" : "کپی مشخصات"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <Reveal delay={80} className="mt-6 rounded-[26px] border border-ink/10 bg-paper-dim/40 p-5 md:p-7">
          <div className="flex flex-wrap gap-2 border-b border-ink/10 pb-4">
            <TabButton active={tab === "specs"} onClick={() => setTab("specs")}>
              جزئیات فنی
            </TabButton>
            <TabButton active={tab === "process"} onClick={() => setTab("process")}>
              فرآیند تولید
            </TabButton>
            <TabButton active={tab === "guide"} onClick={() => setTab("guide")}>
              راهنمای انتخاب
            </TabButton>
          </div>

          {tab === "specs" ? (
            <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-argon">{item?.familyEnglish}</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">{item?.title}</h3>
                <p className="mt-4 text-sm leading-8 text-ink-soft">{item?.note}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item?.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-ink/10 bg-paper px-3 py-1 text-[11px] text-ink-soft">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">مزیت‌های مهندسی خانواده</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {family.advantages.map((adv) => (
                    <li key={adv} className="flex items-start gap-2.5 text-sm leading-6 text-ink">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-argon" />
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {tab === "process" && line ? (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-ink">{line.title}</h3>
                {line.machinery ? (
                  <span className="rounded-full border border-ink/10 px-3 py-1.5 font-technical text-[10px] uppercase tracking-[0.15em] text-ink-mute">{line.machinery}</span>
                ) : null}
              </div>
              <ol className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {line.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-ink/8 bg-paper p-4 text-sm leading-6 text-ink">
                    <span className="font-technical text-argon">{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {tab === "guide" ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-argon/25 bg-argon-soft/40 p-5">
                <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-argon">این پیکربندی</p>
                <p className="mt-3 text-sm leading-8 text-ink">
                  {hasOpening
                    ? opening.guide
                    : config.family === "glass"
                      ? config.glazing === "multi"
                        ? "لایه‌ی شیشه‌ی اضافه برای عایق‌بندی حرارتی و صوتی بیشتر؛ مناسب نماهای پرتابش یا فضاهای نیازمند سکوت."
                        : "ساختار استاندارد دو لایه با گاز آرگون؛ انتخاب متعادل برای اغلب پروژه‌های مسکونی و اداری."
                      : "بدنه‌ی فولادی سراسری با پارتیشن‌بندی داخلی، قفل ضدسرقت کاله و ۵ سال ضمانت؛ روکش را متناسب با دکوراسیون ورودی انتخاب کنید."}
                </p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-paper p-5">
                <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-ink-mute">پیش از سفارش</p>
                <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-6 text-ink-soft">
                  <li>· ابعاد را از داخل چهارچوب ساختمانی (عرض × ارتفاع) اندازه بگیرید؛ اندازه‌گیری نهایی توسط کارشناس انجام می‌شود.</li>
                  <li>· جهت بازشو و محل دستگیره را بر اساس چیدمان داخلی مشخص کنید.</li>
                  <li>· برای پروژه‌های چندواحدی، تعداد و تنوع ابعاد را در توضیح تکمیلی ذکر کنید.</li>
                </ul>
              </div>
            </div>
          ) : null}
        </Reveal>

        {/* Mobile sticky order bar */}
        <div className="sticky bottom-3 z-20 mt-6 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-full border border-white/70 bg-ink/90 py-2 pr-4 pl-2 text-cloud shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{item?.title}</p>
              <p className="font-technical text-[10px] text-cloud/55">
                {faDigits(config.width)} × {faDigits(config.height)} mm · {faDigits(config.quantity)}
              </p>
            </div>
            <button type="button" onClick={() => setOrderOpen(true)} className="shrink-0 rounded-full bg-argon px-4 py-2.5 text-xs font-medium text-cloud">
              سفارش
            </button>
          </div>
        </div>
      </div>

      {orderOpen ? (
        <ProductInquiryDialog
          family={family}
          variantLabel={item?.title}
          summary={summary}
          onClose={() => setOrderOpen(false)}
        />
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* UI atoms                                                             */
/* ------------------------------------------------------------------ */

function Group({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink/8 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-ink-mute">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone = "solid",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "solid" | "soft";
}) {
  const activeClass = tone === "solid" ? "border-argon bg-argon text-cloud" : "border-ink bg-ink text-cloud";
  return (
    <button
      type="button"
      data-cursor="detail"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? activeClass : "border-ink/12 bg-white/50 text-ink-soft hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-ink/10 bg-white/60 p-1">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            option.value === value ? "bg-ink text-cloud" : "text-ink-soft hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between">
        <label className="text-xs text-ink-soft">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            dir="ltr"
            min={min}
            max={max}
            step={10}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              const next = Number(draft);
              onChange(Number.isFinite(next) ? next : value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") (event.target as HTMLInputElement).blur();
            }}
            className="w-20 rounded-lg border border-ink/10 bg-white/70 px-2 py-1 text-right font-technical text-xs text-ink focus:border-argon focus:outline-none"
            aria-label={`${label} به میلی‌متر`}
          />
          <span className="font-technical text-[10px] text-ink-mute">mm</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-argon"
        aria-label={label}
      />
      <div className="mt-1 flex justify-between font-technical text-[9px] text-ink-mute">
        <span>{faDigits(min)}</span>
        <span>{faDigits(max)}</span>
      </div>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/10 bg-white/60">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="کاهش تعداد" className="size-9 rounded-full text-lg text-ink disabled:opacity-30">
        −
      </button>
      <span className="w-10 text-center font-technical text-sm text-ink">{faDigits(value)}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="افزایش تعداد" className="size-9 rounded-full text-lg text-ink">
        +
      </button>
    </div>
  );
}

function ToolButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      data-cursor="detail"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md transition-colors ${
        active ? "border-argon bg-argon text-cloud" : "border-white/15 bg-graphite/70 text-cloud/85 hover:border-argon-glow hover:text-argon-glow"
      }`}
    >
      {children}
    </button>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "bg-ink text-cloud" : "text-ink-soft hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, unit, swatch }: { label: string; value: string; unit?: string; swatch?: string }) {
  return (
    <div className="flex flex-col gap-1 bg-paper px-4 py-3.5">
      <span className="font-technical text-[9px] uppercase tracking-[0.18em] text-ink-mute">{label}</span>
      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
        {swatch ? <span className="size-3 rounded-full border border-black/10" style={{ background: swatch }} /> : null}
        <span className="truncate">{value}</span>
        {unit ? <span className="font-technical text-[10px] text-ink-mute">{unit}</span> : null}
      </span>
    </div>
  );
}
