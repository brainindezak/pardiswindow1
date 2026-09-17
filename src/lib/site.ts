/**
 * Canonical public address of the deployment.
 * Set NEXT_PUBLIC_SITE_URL in the hosting platform (Vercel / GitHub Actions).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://pardiswindow.example").replace(/\/$/, "");

/** Sub-path the site is served from (GitHub Pages project sites need one). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Keep preview deployments out of search results. */
export const isIndexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "1";
