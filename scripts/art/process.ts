/**
 * Ingests real source illustrations from art/source/<card-id>.<png|jpg|jpeg|webp>, validates them,
 * composites the deck frame and title, and writes optimised delivery files to public/cards/.
 * Updates art/manifest.json and src/generated/card-art.json. Never invents files: a card only
 * gets `assets` when its source image exists and every output file has been written.
 *
 *   npm run art:process                          # all cards with a source file
 *   npm run art:process -- major-00-the-fool     # specific cards
 *   npm run art:process -- --mode finished <id>  # source is already framed and titled
 *   npm run art:process -- --tool "Figma generate_image" --ref "<link or job id>" <id>
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import "./font-env";
import sharp from "sharp";
import { buildFrameSvg } from "./frame";
import { ART_DIR, PUBLIC_CARDS_DIR, ROOT, loadArtCards, loadSpec, publicPath, readManifest, writeManifest, writeRegistry, type StyleSpec } from "./lib";

interface Options {
  ids: string[];
  mode: "art" | "finished";
  tool: string | null;
  ref: string | null;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = { ids: [], mode: "art", tool: null, ref: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--mode") opts.mode = argv[++i] === "finished" ? "finished" : "art";
    else if (a === "--tool") opts.tool = argv[++i];
    else if (a === "--ref") opts.ref = argv[++i];
    else opts.ids.push(a);
  }
  return opts;
}

export function findSource(id: string, spec: StyleSpec, dir = path.join(ART_DIR, "source")): string | null {
  if (!existsSync(dir)) return null;
  const match = readdirSync(dir).find((f) => {
    const ext = path.extname(f).toLowerCase();
    return path.basename(f, path.extname(f)) === id && spec.sourceArt.acceptedExtensions.includes(ext);
  });
  return match ? path.join(dir, match) : null;
}

export interface ProcessResult {
  master: Buffer;
  width: number;
  height: number;
  warnings: string[];
}

/** Validates and composes one card. Pure with respect to the filesystem (returns buffers). */
export async function composeCard(source: Buffer, card: { name: string; numeral: string | null }, spec: StyleSpec, mode: "art" | "finished"): Promise<ProcessResult> {
  const { masterWidth: W, masterHeight: H } = spec.output;
  const meta = await sharp(source).metadata();
  if (!meta.width || !meta.height) throw new Error("Could not read image dimensions");
  const warnings: string[] = [];
  if (meta.width < spec.sourceArt.minWidth || meta.height < spec.sourceArt.minHeight) {
    throw new Error(`Source is ${meta.width}×${meta.height}; minimum is ${spec.sourceArt.minWidth}×${spec.sourceArt.minHeight}`);
  }
  const ratio = meta.width / meta.height;
  const target = W / H;
  if (Math.abs(ratio - target) / target > spec.sourceArt.aspectTolerance) {
    warnings.push(`Source aspect ${meta.width}×${meta.height} (${ratio.toFixed(3)}) is not 2:3; centre-cropped to 2:3 — check cropping.`);
  }
  const base = sharp(source).rotate().resize(W, H, { fit: "cover", position: "centre" }).toColourspace("srgb");
  const layers: sharp.OverlayOptions[] = mode === "art" ? [{ input: Buffer.from(buildFrameSvg({ title: card.name, numeral: card.numeral }, spec)), top: 0, left: 0 }] : [];
  const master = await base.composite(layers).png({ compressionLevel: 9 }).toBuffer();
  return { master, width: W, height: H, warnings };
}

export async function writeDeliveryFiles(id: string, master: Buffer, spec: StyleSpec, outDir = PUBLIC_CARDS_DIR) {
  const hash = createHash("sha256").update(master).digest("hex").slice(0, 10);
  mkdirSync(outDir, { recursive: true });
  // Remove previous versions of this card so stale hashed files are not left behind.
  for (const f of readdirSync(outDir)) if (f.startsWith(`${id}.`)) rmSync(path.join(outDir, f));
  const files: string[] = [];
  for (const width of spec.output.deliveryWidths) {
    const resized = sharp(master).resize(width, Math.round((width * 3) / 2));
    for (const format of spec.output.formats) {
      const rel = publicPath(id, hash, width, format);
      const abs = path.join(outDir, path.basename(rel));
      const pipeline =
        format === "avif" ? resized.clone().avif({ quality: spec.output.quality.avif, effort: 5 })
        : format === "webp" ? resized.clone().webp({ quality: spec.output.quality.webp })
        : resized.clone().jpeg({ quality: spec.output.quality.jpg, mozjpeg: true, progressive: true });
      await pipeline.toFile(abs);
      files.push(rel);
    }
  }
  const lqipBuf = await sharp(master).resize(20, 30).blur(1).webp({ quality: 40 }).toBuffer();
  return { hash, files, lqip: `data:image/webp;base64,${lqipBuf.toString("base64")}` };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const spec = loadSpec();
  const manifest = readManifest();
  if (!manifest) throw new Error("art/manifest.json not found — run npm run art:manifest first");
  const cards = new Map(loadArtCards().map((c) => [c.id, c]));
  const targets = opts.ids.length ? opts.ids : manifest.cards.map((c) => c.id);
  const now = new Date().toISOString();
  let processed = 0;

  for (const id of targets) {
    const entry = manifest.cards.find((c) => c.id === id);
    const card = cards.get(id);
    if (!entry || !card) {
      console.error(`✗ Unknown card id ${id}`);
      process.exitCode = 1;
      continue;
    }
    const source = findSource(id, spec);
    if (!source) {
      if (opts.ids.length) console.warn(`– ${id}: no source file in art/source/ — skipped`);
      continue;
    }
    const buf = readFileSync(source);
    const sourceSha = createHash("sha256").update(buf).digest("hex");
    try {
      const result = await composeCard(buf, card, spec, opts.mode);
      const masterRel = `art/masters/${id}.png`;
      mkdirSync(path.join(ROOT, "art/masters"), { recursive: true });
      await sharp(result.master).toFile(path.join(ROOT, masterRel));
      const delivery = await writeDeliveryFiles(id, result.master, spec);
      const changed = entry.assets?.sourceSha256 !== sourceSha;
      entry.assets = {
        sourceFile: path.relative(ROOT, source),
        sourceSha256: sourceSha,
        master: masterRel,
        width: result.width,
        height: result.height,
        hash: delivery.hash,
        files: delivery.files,
        processedAt: now,
        mode: opts.mode,
        lqip: delivery.lqip,
      };
      entry.generation = {
        ...entry.generation,
        status: "processed",
        tool: opts.tool ?? entry.generation.tool ?? "supplied source file",
        reference: opts.ref ?? entry.generation.reference,
        generatedAt: entry.generation.generatedAt ?? now,
      };
      entry.specVersion = spec.version;
      if (changed) {
        entry.review = { ...entry.review, status: "not_reviewed", checks: { consistency: null, symbolism: null, readability: null, cropping: null, color: null, suitDetails: null }, reviewedAt: null };
      }
      for (const w of result.warnings) entry.corrections.push({ raisedAt: now, issue: w, action: "Reviewer to confirm nothing important was cropped, or regenerate at 2:3.", status: "open" });
      processed++;
      console.log(`✓ ${id} → ${delivery.files.length} files (hash ${delivery.hash})${result.warnings.length ? ` ⚠ ${result.warnings.join("; ")}` : ""}`);
    } catch (e) {
      entry.generation = { ...entry.generation, status: "failed", notes: `Processing failed: ${(e as Error).message}` };
      console.error(`✗ ${id}: ${(e as Error).message}`);
      process.exitCode = 1;
    }
  }

  writeManifest(manifest);
  writeRegistry(manifest, spec);
  console.log(`Processed ${processed} card(s).`, manifest.summary);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
