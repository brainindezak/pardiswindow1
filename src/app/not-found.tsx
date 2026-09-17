import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <p className="font-technical text-xs uppercase tracking-[0.3em] text-ink-mute">۴۰۴ · صفحه یافت نشد</p>
      <h1 className="text-balance text-3xl font-semibold text-ink md:text-4xl">
        این بازشو در نقشه‌ی پردیس تعریف نشده است.
      </h1>
      <p className="max-w-md text-sm leading-7 text-ink-soft">
        صفحه‌ای که به دنبال آن بودید پیدا نشد یا جابه‌جا شده است. می‌توانید به صفحه اصلی بازگردید.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-cloud transition-colors hover:bg-argon"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
