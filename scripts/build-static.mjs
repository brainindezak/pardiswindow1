/**
 * Static-export build for CDN hosting (GitHub Pages / Cloudflare Pages).
 *
 * `output: "export"` cannot emit server route handlers, so the `/api` segment
 * is moved out of the app directory for the duration of the build and restored
 * afterwards — the source tree is left exactly as it was found.
 *
 * Contact submissions in this mode go to NEXT_PUBLIC_CONTACT_ENDPOINT
 * (an external form service); no database credentials are ever bundled.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const stashDir = path.join(root, ".api-stash");

let stashed = false;
if (existsSync(apiDir)) {
  rmSync(stashDir, { recursive: true, force: true });
  mkdirSync(path.dirname(stashDir), { recursive: true });
  renameSync(apiDir, stashDir);
  stashed = true;
}

const restore = () => {
  if (stashed && existsSync(stashDir)) {
    rmSync(apiDir, { recursive: true, force: true });
    renameSync(stashDir, apiDir);
  }
};

process.on("exit", restore);
process.on("SIGINT", () => process.exit(130));
process.on("SIGTERM", () => process.exit(143));

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "1" },
});

restore();
process.exit(result.status ?? 1);
