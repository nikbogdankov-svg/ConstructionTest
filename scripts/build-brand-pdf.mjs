// Builds BRAND.pdf from BRAND.md: markdown → styled HTML → headless Chrome print.
// Usage: npm run brand:pdf   (set CHROME_PATH if Chrome isn't in a standard location)
// Needs network once, to fetch the Google Fonts used in the PDF.
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const root = resolve(import.meta.dirname, "..");
const md = readFileSync(join(root, "BRAND.md"), "utf8");
let body = renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm] }, md));

// Put a colour chip in front of every hex value.
body = body.replace(/(?<![\w&;"'=/-])#([0-9A-Fa-f]{6})\b/g, (m, hex) => `<span class="sw" style="background:#${hex}"></span>${m}`);

const tokens = readFileSync(join(root, "styles/tokens.css"), "utf8");
const v = (name) => tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];

const logo = (f) => `file://${join(root, "public/brand", f)}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Plinthwork Brandbook</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:wght@400;700&family=Atkinson+Hyperlegible+Next:wght@400;700&family=Barlow+Condensed:wght@600;700&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 16mm 14mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Atkinson Hyperlegible Next", sans-serif; color: ${v("ink")}; font-size: 10pt; line-height: 1.5; }
  h1, h2, h3 { font-family: "Barlow Condensed", sans-serif; font-weight: 600; line-height: 1.1; break-after: avoid; }
  h1 { font-size: 34pt; margin: 0 0 6pt; }
  h2 { font-size: 22pt; margin: 22pt 0 8pt; padding-bottom: 6pt; border-bottom: 2px solid ${v("spruce-700")};
       background-image: repeating-linear-gradient(to right, ${v("concrete-400")} 0 1px, transparent 1px 8px); background-size: 100% 5px; background-repeat: no-repeat; background-position: bottom left; }
  h2:not(:first-of-type) { break-before: page; }
  h3 { font-size: 15pt; margin: 14pt 0 6pt; color: ${v("spruce-800")}; }
  a { color: ${v("spruce-700")}; }
  blockquote { margin: 0 0 12pt; padding: 8pt 12pt; background: ${v("concrete-50")}; border-left: 4px solid ${v("lime-300")}; }
  blockquote p { margin: 2pt 0; }
  hr { display: none; }
  table { width: 100%; border-collapse: collapse; margin: 6pt 0 12pt; font-size: 8.6pt; break-inside: auto; }
  tr { break-inside: avoid; }
  th { text-align: left; background: ${v("concrete-50")}; border-bottom: 2px solid ${v("concrete-400")}; padding: 4pt 6pt; }
  td { border-bottom: 1px solid ${v("concrete-200")}; padding: 4pt 6pt; vertical-align: top; }
  code { font-family: "Atkinson Hyperlegible Mono", monospace; font-size: 0.92em; background: ${v("concrete-50")}; padding: 0 3px; border-radius: 2px; }
  pre { background: ${v("spruce-950")}; color: ${v("night-100")}; padding: 10pt; border-radius: 6px; font-size: 8.5pt; white-space: pre-wrap; }
  pre code { background: none; color: inherit; }
  td code { white-space: nowrap; }
  .sw { display: inline-block; width: 9pt; height: 9pt; border-radius: 2px; border: 1px solid ${v("concrete-300")}; vertical-align: -1pt; margin-right: 3pt; }
  .cover { display: flex; gap: 18pt; align-items: center; margin-bottom: 18pt; }
  .cover .dark { background: ${v("night-900")}; padding: 10pt 14pt; border-radius: 6px; }
  .bar { height: 10pt; display: flex; margin-bottom: 18pt; border-radius: 2px; overflow: hidden; }
  .bar span { flex: 1; }
</style></head><body>
<div class="cover">
  <img src="${logo("plinthwork-wordmark.svg")}" height="54">
  <span class="dark"><img src="${logo("plumb-wordmark-dark.svg")}" height="44"></span>
</div>
<div class="bar">${["spruce-950", "spruce-700", "spruce-300", "lime-300", "concrete-25", "concrete-200", "concrete-600", "ink"].map((t) => `<span style="background:${v(t)}"></span>`).join("")}</div>
${body}
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), "brand-pdf-"));
const htmlPath = join(dir, "brand.html");
writeFileSync(htmlPath, html);

const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error(`Chrome not found. HTML written to ${htmlPath}; print it to PDF manually or set CHROME_PATH.`);
  process.exit(1);
}
execFileSync(chrome, [
  "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
  "--virtual-time-budget=15000", `--print-to-pdf=${join(root, "BRAND.pdf")}`, `file://${htmlPath}`,
], { stdio: "inherit" });
console.log("Wrote BRAND.pdf");
