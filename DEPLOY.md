# انتشار عمومی سایت پردیس

سایت برای سه مسیر انتشار آماده شده است. همه‌ی آن‌ها بدون قرار دادن هیچ رمز یا
اطلاعات حساسی در مخزن کار می‌کنند.

> ⚠️ توکن این محیط اجازه‌ی ساخت فایل workflow را نداشت، بنابراین دو فایل آماده
> در پوشه‌ی `deploy/` قرار دارند. برای فعال شدن، فقط آن‌ها را به
> `.github/workflows/` منتقل کنید (دستورش پایین آمده).

---

## گزینه ۱ — Vercel (پیشنهادی: سایت کامل با دیتابیس و فرم تماس)

1. یک دیتابیس رایگان Postgres بسازید (Neon یا Vercel Postgres) و رشته‌ی اتصال آن را بردارید.
2. در [vercel.com/new](https://vercel.com/new) مخزن `pardiswindow1` را import کنید و برنچ
   `arena/01a0ae8f-pardiswindow1` را انتخاب کنید.
3. در **Settings → Environment Variables** این‌ها را اضافه کنید:

   | نام | مقدار | توضیح |
   |---|---|---|
   | `DATABASE_URL` | رشته‌ی اتصال Neon | **Secret** — هرگز در کد نیاید |
   | `NEXT_PUBLIC_SITE_URL` | `https://<project>.vercel.app` | آدرس نهایی |
   | `NEXT_PUBLIC_ALLOW_INDEXING` | `0` تا زمان نهایی شدن، بعد `1` | کنترل ایندکس گوگل |

4. Deploy. سپس یک بار جدول‌ها را بسازید:
   `DATABASE_URL="..." npx drizzle-kit push --config drizzle.config.json`

هدرهای امنیتی از `vercel.json` و `next.config.ts` اعمال می‌شوند.

---

## گزینه ۲ — GitHub Pages (دمو استاتیک و رایگان)

```bash
git mv deploy/deploy-pages.yml .github/workflows/deploy-pages.yml
git mv deploy/ci.yml .github/workflows/ci.yml
git commit -m "Enable deployment workflows"
git push origin arena/01a0ae8f-pardiswindow1
```

سپس در **Settings → Pages** گزینه‌ی *Source* را روی **GitHub Actions** بگذارید.
(برای مخزن خصوصی، Pages نیازمند حساب Pro است؛ در غیر این‌صورت مخزن را public کنید.)

آدرس نهایی: `https://brainindezak.github.io/pardiswindow1/`

در این حالت سرور و دیتابیسی وجود ندارد، پس فرم تماس به یک سرویس فرم بیرونی وصل می‌شود:
در **Settings → Secrets and variables → Actions → Variables** یک متغیر
`CONTACT_ENDPOINT` با آدرس Formspree/Web3Forms خود بسازید. اگر تنظیم نشود، فرم
پیام محترمانه‌ای نمایش می‌دهد و شماره تماس شرکت را پیشنهاد می‌کند.

---

## گزینه ۳ — سرور شخصی / VPS با Docker

```bash
cp .env.example .env     # سپس POSTGRES_PASSWORD، SITE_DOMAIN و SITE_URL را پر کنید
docker compose up -d --build
```

- Caddy به‌صورت خودکار گواهی HTTPS از Let's Encrypt می‌گیرد.
- پورت دیتابیس به بیرون باز **نیست**؛ فقط کانتینر برنامه به آن دسترسی دارد.
- کانتینر برنامه با کاربر غیر-root اجرا می‌شود و healthcheck دارد.

---

## نکات امنیتی اعمال‌شده

- `.env` و خروجی‌های بیلد در `.gitignore` هستند؛ هیچ credential ای در مخزن نیست.
- هدرهای امنیتی: HSTS، `X-Content-Type-Options`، `X-Frame-Options`،
  `Referrer-Policy`، `Permissions-Policy`. هدر `X-Powered-By` حذف شده.
- محدودیت نرخ روی `/api/contact`: حداکثر ۵ درخواست در دقیقه برای هر IP (پاسخ ۴۲۹).
- اعتبارسنجی ورودی سمت سرور با Zod و پیام‌های خطای فارسی.
- تا وقتی `NEXT_PUBLIC_ALLOW_INDEXING=1` نشود، `robots.txt` کل سایت را از
  دسترس موتورهای جستجو خارج می‌کند تا نسخه‌ی پیش‌نمایش ایندکس نشود.
- workflow ها با کمترین سطح دسترسی (`permissions:`) تعریف شده‌اند.
