import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";
import { ROUTES, SUPPORTED_LANGS, pathFor } from "./routes";
import { canonicalUrl } from "./siteConfig";

test("every route publishes identical clean-URL HTML and directory metadata on the new domain", () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "xaluca-social-pages-"));
  try {
    fs.copyFileSync(path.resolve("public/index.html"), path.join(output, "index.html"));
    execFileSync(process.execPath, [path.resolve("scripts/generate-social-pages.cjs"), "--output", output]);
    for (const id of Object.keys(ROUTES)) {
      for (const lang of SUPPORTED_LANGS) {
        const route = pathFor(lang, id).replace(/\/$/, "");
        const relative = route.replace(/^\//, "");
        const index = fs.readFileSync(path.join(output, relative, "index.html"), "utf8");
        expect(index).toContain(`<link rel="canonical" href="${canonicalUrl(route)}"`);
        expect(index).toContain(`<meta property="og:url" content="${canonicalUrl(route)}"`);
        expect(index).not.toContain("xalucatravel.com");
        if (relative) expect(fs.readFileSync(path.join(output, `${relative}.html`), "utf8")).toBe(index);
      }
    }
  } finally {
    fs.rmSync(output, { recursive: true, force: true });
  }
});
