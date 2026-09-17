"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { submitContactRequest } from "@/lib/contact-client";
import { contactTopics } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";
type ContactTopicValue = (typeof contactTopics)[number]["value"];

const initialValues: { name: string; phone: string; email: string; city: string; topic: ContactTopicValue; message: string } = {
  name: "",
  phone: "",
  email: "",
  city: "",
  topic: contactTopics[0].value,
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Requests arriving from the landing-page Consultation Portal retain the
  // visitor's chosen channel. URL parsing is intentionally client-side so the
  // static contact page stays fully prerenderable without a router bailout.
  useEffect(() => {
    const requestedTopic = new URLSearchParams(window.location.search).get("topic");
    const matchingTopic = contactTopics.find((topic) => topic.value === requestedTopic);
    if (matchingTopic) {
      setValues((current) => ({ ...current, topic: matchingTopic.value }));
    }
  }, []);

  const update = (key: keyof typeof values) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setFeedback(null);
    setFieldErrors({});

    try {
      const data = await submitContactRequest(values);

      if (!data.ok) {
        setStatus("error");
        setFeedback(data.message ?? "ثبت درخواست با خطا مواجه شد.");
        setFieldErrors(data.fieldErrors ?? {});
        return;
      }

      setStatus("success");
      setFeedback("درخواست شما ثبت شد. کارشناسان پردیس در اسرع وقت با شما تماس می‌گیرند.");
      setValues(initialValues);
    } catch {
      setStatus("error");
      setFeedback("ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center">
        <p className="text-lg font-semibold text-ink">درخواست شما با موفقیت ثبت شد.</p>
        <p className="mt-2 text-sm text-ink-soft">{feedback}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-medium text-ink hover:border-argon hover:text-argon"
        >
          ثبت درخواست جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="نام و نام‌خانوادگی" htmlFor="name" error={fieldErrors.name?.[0]}>
          <input
            id="name"
            required
            minLength={2}
            value={values.name}
            onChange={update("name")}
            className="input"
            placeholder="مثلاً محمد رضایی"
          />
        </Field>
        <Field label="شماره تماس" htmlFor="phone" error={fieldErrors.phone?.[0]}>
          <input
            id="phone"
            required
            dir="ltr"
            value={values.phone}
            onChange={update("phone")}
            className="input text-right"
            placeholder="09xxxxxxxxx"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="ایمیل (اختیاری)" htmlFor="email" error={fieldErrors.email?.[0]}>
          <input
            id="email"
            type="email"
            dir="ltr"
            value={values.email}
            onChange={update("email")}
            className="input text-right"
            placeholder="name@email.com"
          />
        </Field>
        <Field label="شهر (اختیاری)" htmlFor="city">
          <input id="city" value={values.city} onChange={update("city")} className="input" placeholder="مثلاً مشهد" />
        </Field>
      </div>

      <Field label="موضوع درخواست" htmlFor="topic">
        <select id="topic" value={values.topic} onChange={update("topic")} className="input">
          {contactTopics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="پیام شما" htmlFor="message" error={fieldErrors.message?.[0]}>
        <textarea
          id="message"
          required
          minLength={10}
          rows={5}
          value={values.message}
          onChange={update("message")}
          className="input resize-none"
          placeholder="ابعاد، تعداد، نوع سیستم یا هر توضیح دیگری که به مشاوره کمک می‌کند..."
        />
      </Field>

      {status === "error" && feedback ? (
        <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {feedback}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        data-cursor="open"
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-cloud transition-colors hover:bg-argon disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <span className="size-3.5 animate-spin rounded-full border-2 border-cloud/40 border-t-cloud" />
            در حال ارسال…
          </>
        ) : (
          "ارسال درخواست"
        )}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-paper-line);
          background: var(--color-paper);
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          color: var(--color-ink);
          transition: border-color 200ms ease;
        }
        .input:focus {
          outline: none;
          border-color: var(--color-argon);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-xs font-medium text-ink-soft">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
}
