// Checks WCAG 2.2 contrast for the brand's text/background token pairs,
// reading the values straight from styles/tokens.css (light and dark).
// Usage: node scripts/check-contrast.mjs   (exits 1 if any pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../styles/tokens.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

function block(selector) {
  const out = {};
  // Top-level rule blocks whose selector list contains `selector` (e.g. ":root, .light").
  for (const m of css.matchAll(/(^|\n)([^{}@/][^{}]*)\{([^{}]*)\}/g)) {
    const selectors = m[2].split(",").map((x) => x.trim());
    if (!selectors.includes(selector)) continue;
    for (const d of m[3].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  }
  return out;
}
const root = block(":root");
const dark = { ...root, ...block(".dark") };

function resolve(vars, name, depth = 0) {
  const v = vars[name];
  if (!v || depth > 10) throw new Error(`Unknown token --${name}`);
  const m = v.match(/^var\(--([a-z0-9-]+)\)$/);
  return m ? resolve(vars, m[1], depth + 1) : v;
}
function lum(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [foreground, background, minimum] — 4.5 text, 3.0 large text / UI parts
const pairs = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["foreground", "surface-sunken", 4.5],
  ["foreground-muted", "background", 4.5],
  ["foreground-muted", "surface", 4.5],
  ["foreground-subtle", "surface", 4.5],
  ["foreground-subtle", "background", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["primary-foreground", "primary-hover", 4.5],
  ["primary", "surface", 4.5],
  ["primary", "background", 4.5],
  ["primary-subtle-foreground", "primary-subtle", 4.5],
  ["accent-foreground", "accent", 4.5],
  ["accent-foreground", "accent-hover", 4.5],
  ["accent-subtle-foreground", "accent-subtle", 4.5],
  ["success-foreground", "success", 4.5],
  ["success-subtle-foreground", "success-subtle", 4.5],
  ["warning-foreground", "warning", 4.5],
  ["warning-subtle-foreground", "warning-subtle", 4.5],
  ["danger-foreground", "danger", 4.5],
  ["danger", "surface", 4.5],
  ["danger-subtle-foreground", "danger-subtle", 4.5],
  ["info-foreground", "info", 4.5],
  ["info-subtle-foreground", "info-subtle", 4.5],
  ["highlight-foreground", "highlight", 4.5],
  ["input-border", "surface", 3.0],
  // Focus ring: light mode relies on the ink inner line, dark mode on the lime halo.
  ["ring-inner", "background", 3.0, "light"],
  ["ring", "background", 3.0, "dark"],
];

let failed = 0;
const rows = [];
for (const [mode, vars] of [["light", root], ["dark", dark]]) {
  for (const [fg, bg, min, only] of pairs) {
    if (only && only !== mode) continue;
    const r = ratio(resolve(vars, fg), resolve(vars, bg));
    const ok = r >= min;
    if (!ok) failed++;
    rows.push({ mode, pair: `${fg} on ${bg}`, fg: resolve(vars, fg), bg: resolve(vars, bg), ratio: r.toFixed(2), min, result: ok ? "PASS" : "FAIL" });
  }
}
if (process.argv.includes("--md")) {
  console.log("| Mode | Pair | Colours | Ratio | Needs | Result |\n|---|---|---|---|---|---|");
  for (const r of rows) console.log(`| ${r.mode} | \`${r.pair}\` | ${r.fg} / ${r.bg} | ${r.ratio}:1 | ${r.min}:1 | ${r.result} |`);
} else {
  console.table(rows);
}
console.log(failed ? `\n${failed} pair(s) below WCAG AA.` : "\nAll pairs pass WCAG AA.");
process.exit(failed ? 1 : 0);
