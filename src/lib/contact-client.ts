import { company } from "@/lib/content";

/**
 * Where contact submissions are sent.
 *
 * - Full deployments (Vercel / Docker / VPS) leave this unset and use the
 *   built-in `/api/contact` route, which validates and persists to Postgres.
 * - Static deployments (GitHub Pages) have no server runtime, so they point
 *   `NEXT_PUBLIC_CONTACT_ENDPOINT` at an external form service (Formspree,
 *   Basin, Web3Forms, ...). No credentials live in the bundle beyond that
 *   public submit URL, and nothing is stored in the browser.
 */
const externalEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT?.trim();
const hasServerRuntime = process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1";

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  topic: string;
  message: string;
};

export type ContactResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const offlineFallbackMessage = `ارسال آنلاین در این نسخه‌ی نمایشی فعال نیست. لطفاً با ${company.phones[0]} تماس بگیرید یا به ${company.email} ایمیل بزنید.`;

export async function submitContactRequest(payload: ContactPayload): Promise<ContactResult> {
  if (externalEndpoint) {
    const response = await fetch(externalEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return { ok: false, message: "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید." };
    }
    return { ok: true };
  }

  if (!hasServerRuntime) {
    return { ok: false, message: offlineFallbackMessage };
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as ContactResult;
  if (!response.ok || !data.ok) {
    return {
      ok: false,
      message: data.message ?? "ثبت درخواست با خطا مواجه شد.",
      fieldErrors: data.fieldErrors,
    };
  }
  return { ok: true };
}
