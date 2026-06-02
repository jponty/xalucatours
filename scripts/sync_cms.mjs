/**
 * sync_cms.mjs — One-click sync of CMS content between environments.
 * ------------------------------------------------------------------
 * All editable content (image slots, text slots, global pricing) lives in
 * MongoDB; image binaries live in the SHARED object storage. So copying the
 * DB records is enough to push your PREVIEW edits to PRODUCTION without a
 * database redeploy.
 *
 * Backend endpoints used:
 *   GET  /api/cms/export            (read-only)
 *   POST /api/cms/import            (admin-protected; Bearer token)
 *   POST /api/admin/login           (exchange password → token)
 *
 * USAGE
 *   # One-click: copy preview → production
 *   node scripts/sync_cms.mjs sync \
 *        --from https://morocco-trips-2.preview.emergentagent.com \
 *        --to   https://trip-curator-8.emergent.host \
 *        --password xaluca
 *
 *   # Just snapshot the source to a file
 *   node scripts/sync_cms.mjs export --from <URL> --out cms_export.json
 *
 *   # Push a saved snapshot into a target
 *   node scripts/sync_cms.mjs import --to <URL> --password <pwd> --in cms_export.json
 *
 * FLAGS
 *   --from <url>      source backend (default: REACT_APP_BACKEND_URL = preview)
 *   --to <url>        target backend (required for import/sync)
 *   --password <pwd>  admin password of the TARGET (default: backend/.env ADMIN_PASSWORD)
 *   --in <file>       input json for `import`
 *   --out <file>      output json for `export` (default: cms_export.json)
 *   --wipe            clear target slot collections before importing (full mirror)
 * ------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function envValue(file, key) {
  try {
    const txt = fs.readFileSync(path.join(ROOT, file), "utf8");
    const line = txt.split("\n").find((l) => l.startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim().replace(/^["']|["']$/g, "") : null;
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) { args[key] = next; i++; }
      else args[key] = true;
    } else {
      args._.push(a);
    }
  }
  return args;
}

const trimUrl = (u) => (u || "").replace(/\/+$/, "");

async function exportCms(fromUrl) {
  const res = await fetch(`${fromUrl}/api/cms/export`);
  if (!res.ok) throw new Error(`export failed (${res.status}) from ${fromUrl}`);
  return res.json();
}

async function login(toUrl, password) {
  const res = await fetch(`${toUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error(`admin login failed (${res.status}) at ${toUrl} — check --password`);
  const j = await res.json();
  if (!j.token) throw new Error("admin login returned no token");
  return j.token;
}

async function importCms(toUrl, token, data, wipe) {
  const body = {
    image_slots: data.image_slots || [],
    text_slots: data.text_slots || [],
    pricing: data.pricing || null,
    wipe: !!wipe,
  };
  const res = await fetch(`${toUrl}/api/cms/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`import failed (${res.status}) at ${toUrl}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const previewUrl = trimUrl(envValue("frontend/.env", "REACT_APP_BACKEND_URL"));
  const from = trimUrl(args.from) || previewUrl;
  const to = trimUrl(args.to);
  const password = args.password || envValue("backend/.env", "ADMIN_PASSWORD");
  const wipe = !!args.wipe;

  if (!cmd || !["export", "import", "sync"].includes(cmd)) {
    console.log("Usage: node scripts/sync_cms.mjs <export|import|sync> [flags]\nSee header of this file for flags.");
    process.exit(1);
  }

  if (cmd === "export") {
    if (!from) throw new Error("missing --from");
    console.log(`Exporting CMS from ${from} …`);
    const data = await exportCms(from);
    const out = args.out || "cms_export.json";
    fs.writeFileSync(path.resolve(ROOT, out), JSON.stringify(data, null, 2));
    console.log(`✓ Exported ${data.counts.image_slots} image slots + ${data.counts.text_slots} text slots → ${out}`);
    return;
  }

  if (cmd === "import") {
    if (!to) throw new Error("missing --to (target backend URL)");
    if (!password) throw new Error("missing --password (target admin password)");
    const inFile = args.in || "cms_export.json";
    const data = JSON.parse(fs.readFileSync(path.resolve(ROOT, inFile), "utf8"));
    console.log(`Logging in to ${to} …`);
    const token = await login(to, password);
    console.log(`Importing into ${to}${wipe ? " (WIPE mode)" : ""} …`);
    const r = await importCms(to, token, data, wipe);
    console.log(`✓ Imported:`, r.imported);
    return;
  }

  // sync = export(from) → import(to)
  if (!from) throw new Error("missing --from");
  if (!to) throw new Error("missing --to (target backend URL)");
  if (!password) throw new Error("missing --password (target admin password)");
  console.log(`SYNC  ${from}\n  →   ${to}${wipe ? "  (WIPE mode)" : ""}\n`);
  const data = await exportCms(from);
  console.log(`Exported ${data.counts.image_slots} image slots + ${data.counts.text_slots} text slots.`);
  const token = await login(to, password);
  const r = await importCms(to, token, data, wipe);
  console.log(`✓ Done. Imported:`, r.imported);
  console.log(`\nTip: hard-refresh the target site to see the changes (API responses are no-store).`);
}

main().catch((e) => { console.error("✗", e.message); process.exit(1); });
