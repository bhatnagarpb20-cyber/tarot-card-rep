// Renders film.html frame by frame: node render.mjs <outDir> [from] [to] [every]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [out, from = '0', to = '899', every = '1'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await p.goto('file://' + join(here, 'film.html'));
await p.evaluate(() => window.ready);
for (let f = +from; f <= +to; f += +every) {
  await p.evaluate((ff) => window.render(ff), f);
  await p.screenshot({ path: join(out, `f${String(f).padStart(4, '0')}.png`) });
}
await b.close();
