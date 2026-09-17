import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CustomCursor } from "@/components/interaction/CustomCursor";
import { SmoothScrollProvider } from "@/components/interaction/SmoothScrollProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { company } from "@/lib/content";
import { isIndexable, siteUrl } from "@/lib/site";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "در و پنجره پردیس — معماری، متریال، نور، مهندسی",
    template: "%s | در و پنجره پردیس",
  },
  description:
    "مجتمع تولیدی در و پنجره پردیس، بزرگ‌ترین تولیدکننده درب و پنجره UPVC با شیشه‌های چندجداره در شرق کشور؛ فعال از سال ۱۳۸۷ در شهرک صنعتی سبزوار.",
  keywords: [
    "در و پنجره پردیس",
    "پنجره UPVC",
    "درب و پنجره آلومینیوم",
    "شیشه دوجداره",
    "درب ضد سرقت",
    "سبزوار",
  ],
  openGraph: {
    title: "در و پنجره پردیس — معماری، متریال، نور، مهندسی",
    description:
      "بزرگ‌ترین تولیدکننده درب و پنجره UPVC با شیشه‌های چندجداره در شرق کشور. یک تجربه دیجیتال درباره‌ی جزئیاتی که پنجره را می‌سازند.",
    url: siteUrl,
    siteName: "در و پنجره پردیس",
    locale: "fa_IR",
    type: "website",
    images: ["/images/hero-detail.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "در و پنجره پردیس",
    description: "معماری × متریال × نور × مهندسی",
    images: ["/images/hero-detail.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d10" },
  ],
  width: "device-width",
  initialScale: 1,
  // Lets the layout paint edge-to-edge on notched phones while
  // `env(safe-area-inset-*)` keeps the header clear of the status bar.
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.brand,
  legalName: company.legalName,
  alternateName: "پردیس",
  foundingDate: "2008-04-01",
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 51, maxValue: 200 },
  address: {
    "@type": "PostalAddress",
    streetAddress: company.addressLine,
    addressCountry: "IR",
  },
  telephone: company.phones[0],
  email: company.email,
  sameAs: [company.instagram],
  url: siteUrl,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="font-sans">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <a
          href="#main-content"
          className="fixed right-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm text-cloud transition-transform focus:translate-y-0"
        >
          رفتن به محتوای اصلی
        </a>
        <SmoothScrollProvider>
          <CustomCursor />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
