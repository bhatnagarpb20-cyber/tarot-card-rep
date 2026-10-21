/** Renders the frame over a neutral test gradient for visual QA. Writes only to the given output dir. */
import "./font-env";
import sharp from "sharp";
import path from "node:path";
import { composeCard } from "./process";
import { loadArtCards, loadSpec } from "./lib";

async function main() {
  const out = process.argv[2];
  if (!out) throw new Error("usage: preview-frame <outDir> [ids...]");
  const spec = loadSpec();
  const ids = process.argv.slice(3);
  const cards = loadArtCards().filter((c) => !ids.length || ids.includes(c.id));
  const test = await sharp({ create: { width: 1024, height: 1536, channels: 3, background: "#3a4a7a" } })
    .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26305e"/><stop offset="1" stop-color="#8a6f4a"/></linearGradient></defs><rect width="1024" height="1536" fill="url(#g)"/><text x="512" y="768" font-size="48" text-anchor="middle" fill="#fff" font-family="DejaVu Sans">TEST GRADIENT — NOT ARTWORK</text></svg>`) }])
    .png().toBuffer();
  for (const c of cards) {
    const r = await composeCard(test, c, spec, "art");
    await sharp(r.master).resize(600).toFile(path.join(out, `${c.id}.png`));
  }
  console.log(`Rendered ${cards.length} frame previews to ${out}`);
}
main();
