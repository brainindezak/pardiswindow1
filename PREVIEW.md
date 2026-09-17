# آنلاین کردن پیش‌نمایش سایت (رایگان — حدود ۱ دقیقه)

نسخه‌ی آماده و بیلدشده‌ی سایت داخل پوشه‌ی `docs/` کامیت شده است. برای اینکه
مشتری بتواند آن را ببیند، فقط باید GitHub Pages را روشن کنید — هیچ build،
دیتابیس یا سرویس دیگری لازم نیست.

## مراحل

1. به آدرس زیر بروید:
   **Settings → Pages**
   `https://github.com/brainindezak/pardiswindow1/settings/pages`

2. در بخش **Build and deployment** این دو مقدار را انتخاب کنید:
   - **Source:** `Deploy from a branch`
   - **Branch:** `arena/01a0ae8f-pardiswindow1`  و پوشه: **`/docs`**

3. **Save** را بزنید و حدود ۱ دقیقه صبر کنید.

## آدرس نهایی برای ارسال به مشتری

```
https://brainindezak.github.io/pardiswindow1/
```

---

## ⚠️ یک نکته مهم

مخزن شما **private** است و GitHub Pages برای مخازن خصوصی فقط در پلن **Pro**
کار می‌کند. اگر پلن رایگان دارید، یکی از این دو کار را بکنید:

- **ساده‌ترین راه:** مخزن را موقتاً public کنید
  (`Settings → General → Danger Zone → Change visibility`).
  چون این فقط یک پیش‌نمایش است و هیچ رمز، کلید یا اطلاعات مشتری در آن وجود
  ندارد، ریسک عملی ندارد.
- یا مخزن را در حالت خصوصی نگه دارید و به‌جای Pages از Vercel استفاده کنید
  (راهنما در `DEPLOY.md`).

---

## چه چیزهایی در این نسخه کار می‌کند؟

| بخش | وضعیت |
|---|---|
| همه‌ی ۸ صفحه، طراحی، فونت فارسی، RTL | ✅ کامل |
| انیمیشن‌ها و بخش‌های سه‌بعدی | ✅ کامل |
| فرم تماس | ⚠️ غیرفعال (نیاز به سرور دارد) — پیام راهنما و شماره تماس شرکت را نشان می‌دهد |
| ایندکس در گوگل | ⛔ عمداً بسته است تا نسخه‌ی نیمه‌کاره در نتایج جستجو ظاهر نشود |

## به‌روزرسانی پیش‌نمایش بعد از تغییر در سایت

```bash
NEXT_PUBLIC_STATIC_EXPORT=1 \
NEXT_PUBLIC_BASE_PATH=/pardiswindow1 \
NEXT_PUBLIC_SITE_URL=https://brainindezak.github.io/pardiswindow1 \
npm run build:static

rm -rf docs && cp -r out docs && touch docs/.nojekyll
git add docs && git commit -m "Update preview" && git push
```
