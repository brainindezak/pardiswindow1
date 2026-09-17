export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const routes = ["", "/products", "/technology", "/quality", "/projects", "/knowledge", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  const now = new Date();
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
