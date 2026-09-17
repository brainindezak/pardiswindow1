import type { MetadataRoute } from "next";

const routes = ["", "/products", "/technology", "/quality", "/projects", "/knowledge", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pardiswindow.example";
  const now = new Date();
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
