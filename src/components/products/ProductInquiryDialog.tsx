"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductFamily } from "@/lib/content";
import { submitContactRequest } from "@/lib/contact-client";

type Status = "idle" | "loading" | "success" | "error";
type SummaryLine = { label: string; value: string };

export function ProductInquiryDialog({
  family,
  variantLabel,
  summary,
  presetDimensions,
  onClose,
}: {
  family: ProductFamily;
  variantLabel?: string;
  summary?: SummaryLine[];
  presetDimensions?: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", city: "", dimensions: presetDimensions ?? "" });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const lines = [
      `سفارش/استعلام محصول: ${variantLabel ? `${variantLabel} — ${family.title}` : family.title}`,
      ...(summary ?? []).map((line) => `${line.label}: ${line.value}`),
      `توضیح تکمیلی ابعاد/تعداد: ${form.dimensions || "ذکر نشده"}`,
    ];
    try {
      const data = await submitContactRequest({
        name: form.name,
        phone: form.phone,
        city: form.city,
        topic: "quote",
        message: lines.join("\n"),
      });
      if (!data.ok) {
        setStatus("error");
        setMessage(data.message ?? "ثبت درخواست انجام نشد.");
        return;
      }
      setStatus("success");
      setMessage("درخواست شما ثبت شد؛ کارشناسان پردیس برای اندازه‌گیری و ادامه‌ی سفارش با شما تماس می‌گیرند.");
    } catch {
      setStatus("error");
      setMessage("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/55 p-3 backdrop-blur-md md:items-center md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-order-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/70 bg-paper/92 p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره سفارش"
          className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-ink/15 text-lg text-ink-soft transition-colors hover:border-argon hover:text-argon"
        >
          ×
        </button>

        <div className="max-w-lg">
          <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-argon">ORDER WINDOW · {family.englishLabel}</p>
          <h2 id="product-order-title" className="mt-4 text-[clamp(1.7rem,4vw,2.5rem)] font-semibold leading-tight text-ink">
            سفارش {variantLabel ?? family.title}
          </h2>
          {variantLabel ? (
            <p className="mt-2 font-technical text-[11px] uppercase tracking-[0.18em] text-ink-mute">از خانواده {family.title}</p>
          ) : null}
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            اطلاعات تماس را ثبت کنید تا برای اندازه‌گیری دقیق، تأیید مشخصات و قیمت‌گذاری با شما تماس بگیریم.
          </p>
        </div>

        {summary && summary.length ? (
          <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {summary.map((line) => (
              <div key={line.label} className="bg-paper px-4 py-3">
                <dt className="font-technical text-[9px] uppercase tracking-[0.18em] text-ink-mute">{line.label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{line.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {status === "success" ? (
          <div role="status" className="mt-8 rounded-2xl border border-success/30 bg-success/10 p-7">
            <p className="text-lg font-semibold text-ink">درخواست با موفقیت ثبت شد.</p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{message}</p>
            <button type="button" onClick={onClose} className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cloud hover:bg-argon">
              بستن پنجره
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-medium text-ink-soft">
                نام و نام‌خانوادگی
                <input required minLength={2} value={form.name} onChange={update("name")} className="order-input" placeholder="مثلاً محمد رضایی" />
              </label>
              <label className="grid gap-2 text-xs font-medium text-ink-soft">
                شماره تماس
                <input required dir="ltr" value={form.phone} onChange={update("phone")} className="order-input text-right" placeholder="09xxxxxxxxx" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-medium text-ink-soft">
                شهر
                <input value={form.city} onChange={update("city")} className="order-input" placeholder="مثلاً مشهد" />
              </label>
              <label className="grid gap-2 text-xs font-medium text-ink-soft">
                توضیح تکمیلی (اختیاری)
                <input value={form.dimensions} onChange={update("dimensions")} className="order-input" placeholder="مثلاً طبقه، تعداد واحد، زمان اجرا" />
              </label>
            </div>
            {status === "error" ? (
              <p role="alert" className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {message}
              </p>
            ) : null}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-5 text-ink-mute">
                ثبت این فرم به معنی ثبت درخواست مشاوره است؛ قیمت نهایی پس از بررسی مشخصات پروژه اعلام می‌شود.
              </p>
              <button
                type="submit"
                disabled={status === "loading"}
                data-cursor="open"
                className="shrink-0 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-cloud transition-colors hover:bg-argon disabled:opacity-50"
              >
                {status === "loading" ? "در حال ارسال…" : "ارسال درخواست سفارش"}
              </button>
            </div>
          </form>
        )}
      </div>
      <style jsx global>{`
        .order-input {
          width: 100%;
          border: 1px solid var(--color-paper-line);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.45);
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          color: var(--color-ink);
          transition:
            border-color 0.2s,
            background 0.2s;
        }
        .order-input:focus {
          outline: none;
          border-color: var(--color-argon);
          background: rgba(255, 255, 255, 0.75);
        }
      `}</style>
    </div>
  );
}
