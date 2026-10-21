/**
 * Renders vector card art to PNG for review: `tsx scripts/art/preview-vector.tsx <out-dir> [card-id...]`.
 * Uses the same fonts as the app so titles match.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";

const out = resolve(process.argv[2] ?? "art/preview");
mkdirSync(out, { recursive: true });

const font = (file: string) => readFileSync(join("src/fonts", file)).toString("base64");
const css = `
@font-face { font-family: Bricolage; src: url(data:font/woff2;base64,${font("bricolage-grotesque-latin-variable.woff2")}) format("woff2"); font-weight: 200 800; }
:root { --font-display: Bricolage; }
body { margin: 0; background: #0f0a1a; }
.card { width: 600px; height: 1000px; }`;

async function main() {
  // The app compiles JSX with Next's automatic runtime; under tsx it falls back to React.createElement.
  (globalThis as { React?: typeof React }).React = React;
  const { VECTOR_ART } = await import("../../src/components/cards/art");
  const ids = process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(VECTOR_ART);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 600, height: 1000 } });
  for (const id of ids) {
    const entry = VECTOR_ART[id];
    if (!entry) throw new Error(`No vector art for ${id}`);
    const svg = renderToStaticMarkup(React.createElement(entry.Component));
    await page.setContent(`<!doctype html><style>${css}</style><div class="card">${svg}</div>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(out, `${id}.png`) });
    console.log(`rendered ${id}`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
