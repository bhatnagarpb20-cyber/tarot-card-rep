/** Shared helpers for the illustration pipeline: spec loading, prompt building, manifest I/O. */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { MAJOR_NAMES, majorId, minorId, minorName, toRoman, RANK_WORDS } from "@/lib/tarot/ids";
import { SUITS, type Suit } from "@/lib/tarot/types";

export const ROOT = path.resolve(__dirname, "../..");
export const ART_DIR = path.join(ROOT, "art");
export const MANIFEST_PATH = path.join(ART_DIR, "manifest.json");
export const REGISTRY_PATH = path.join(ROOT, "src/generated/card-art.json");
export const PUBLIC_CARDS_DIR = path.join(ROOT, "public/cards");

export interface StyleSpec {
  version: string;
  palette: Record<string, { hex: string; role: string }>;
  output: { masterWidth: number; masterHeight: number; deliveryWidths: number[]; formats: ("avif" | "webp" | "jpg")[]; quality: { avif: number; webp: number; jpg: number } };
  sourceArt: { minWidth: number; minHeight: number; aspectTolerance: number; acceptedExtensions: string[] };
  frame: {
    outerInset: number;
    window: { left: number; right: number; top: number; shoulder: number; bottom: number };
    medallion: { cx: number; cy: number; r: number };
    titlePlate: { left: number; right: number; top: number; bottom: number };
    titleFont: { family: string; weight: number; maxSize: number; minSize: number; letterSpacing: number; maxTextWidth: number };
    numeralFont: { family: string; weight: number; size: number };
  };
  prompt: { preamble: string; style: string; palette: string; composition: string; negative: string; allowedGlyphsTemplate: string };
  review: { checks: Record<string, string>; referenceCards: string[] };
}

interface CardDef {
  scene: string;
  symbols: string[];
  allowedGlyphs?: string[];
  notes?: string;
}
interface Definitions {
  major: (CardDef & { number: number; name: string })[];
  suits: Record<Suit, { element: string; emblem: string; cards: (CardDef & { rank: number })[] }>;
}

export function loadSpec(): StyleSpec {
  return JSON.parse(readFileSync(path.join(ART_DIR, "style-spec.json"), "utf8"));
}

function loadDefinitions(): Definitions {
  return JSON.parse(readFileSync(path.join(ART_DIR, "cards.definitions.json"), "utf8"));
}

export interface ArtCard {
  id: string;
  name: string;
  /** Text for the medallion: Roman numeral for majors, null for minors (they show a star). */
  numeral: string | null;
  suit: Suit | null;
  emblem: string | null;
  scene: string;
  symbols: string[];
  allowedGlyphs: string[];
  notes: string | null;
}

/** All 78 cards with their illustration definitions, keyed by canonical id. Throws if any is missing. */
export function loadArtCards(): ArtCard[] {
  const defs = loadDefinitions();
  const cards: ArtCard[] = MAJOR_NAMES.map((name, n) => {
    const d = defs.major.find((m) => m.number === n);
    if (!d) throw new Error(`Missing art definition for major ${n}`);
    if (d.name !== name) throw new Error(`Art definition name mismatch for ${n}: ${d.name} vs ${name}`);
    return { id: majorId(n), name, numeral: toRoman(n), suit: null, emblem: null, scene: d.scene, symbols: d.symbols, allowedGlyphs: d.allowedGlyphs ?? [], notes: d.notes ?? null };
  });
  for (const suit of SUITS) {
    const s = defs.suits[suit];
    for (let rank = 1; rank <= RANK_WORDS.length; rank++) {
      const d = s.cards.find((c) => c.rank === rank);
      if (!d) throw new Error(`Missing art definition for ${suit} ${rank}`);
      cards.push({ id: minorId(suit, rank), name: minorName(suit, rank), numeral: null, suit, emblem: s.emblem, scene: d.scene, symbols: d.symbols, allowedGlyphs: d.allowedGlyphs ?? [], notes: d.notes ?? null });
    }
  }
  return cards;
}

/** Builds the generation prompt for one card from the locked spec. Same structure for all 78. */
export function buildPrompt(card: ArtCard, spec: StyleSpec): string {
  const subject = card.suit
    ? `Card: ${card.name} (suit of ${card.suit}; the suit emblem is ${card.emblem} — show exactly the number of emblems the scene describes).`
    : `Card: ${card.name}, Major Arcana ${card.numeral}.`;
  const glyphs = card.allowedGlyphs.length ? ` ${spec.prompt.allowedGlyphsTemplate.replace("{glyphs}", card.allowedGlyphs.map((g) => `"${g}"`).join(" and "))}` : "";
  return [
    spec.prompt.preamble,
    subject,
    `Scene: ${card.scene}`,
    `Required traditional Rider–Waite–Smith symbols, all clearly visible: ${card.symbols.join("; ")}.`,
    spec.prompt.style,
    spec.prompt.palette,
    spec.prompt.composition,
    spec.prompt.negative + glyphs,
  ].join("\n");
}

/** Accessible description: what the artwork shows, without repeating "image of". */
export function buildAlt(card: ArtCard): string {
  return `${card.name} tarot card. ${card.scene}`;
}

export type GenerationStatus = "not_started" | "in_progress" | "generated" | "processed" | "failed";
export type ReviewStatus = "not_reviewed" | "approved" | "changes_requested" | "rejected";
export type CheckResult = "pass" | "fail" | null;

export interface ManifestEntry {
  id: string;
  name: string;
  /** Base filename shared by source, master and delivery files. */
  filename: string;
  /** Where the source illustration must be placed for processing. It does not exist until supplied. */
  expectedSource: string;
  prompt: string;
  alt: string;
  symbols: string[];
  deviations: string[];
  specVersion: string;
  generation: {
    status: GenerationStatus;
    tool: string | null;
    reference: string | null;
    generatedAt: string | null;
    notes: string | null;
  };
  /** Present only after the pipeline has produced real files from a real source image. */
  assets: null | {
    sourceFile: string;
    sourceSha256: string;
    master: string;
    width: number;
    height: number;
    hash: string;
    files: string[];
    processedAt: string;
    mode: "art" | "finished";
    /** Tiny blurred preview shown while the full image loads. */
    lqip: string;
  };
  review: {
    status: ReviewStatus;
    checks: { consistency: CheckResult; symbolism: CheckResult; readability: CheckResult; cropping: CheckResult; color: CheckResult; suitDetails: CheckResult };
    reviewer: string | null;
    reviewedAt: string | null;
    notes: string | null;
  };
  corrections: { raisedAt: string; issue: string; action: string; status: "open" | "resolved" }[];
}

export interface Manifest {
  $comment: string;
  specVersion: string;
  updatedAt: string;
  summary: Record<string, number>;
  rejectedSubmissions: { file: string; receivedAt: string; reason: string; issues: string[] }[];
  cards: ManifestEntry[];
}

export function readManifest(): Manifest | null {
  return existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) : null;
}

export function summarize(cards: ManifestEntry[]): Record<string, number> {
  const s: Record<string, number> = { total: cards.length };
  for (const c of cards) {
    s[`generation:${c.generation.status}`] = (s[`generation:${c.generation.status}`] ?? 0) + 1;
    s[`review:${c.review.status}`] = (s[`review:${c.review.status}`] ?? 0) + 1;
  }
  s.withAssets = cards.filter((c) => c.assets).length;
  return s;
}

export function writeManifest(m: Manifest) {
  m.updatedAt = new Date().toISOString();
  m.summary = summarize(m.cards);
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2) + "\n");
}

export interface RegistryEntry {
  alt: string;
  reviewStatus: ReviewStatus;
  /** null until real processed files exist. */
  image: null | { hash: string; widths: number[]; formats: string[]; width: number; height: number; lqip: string };
}

/** Writes the slim, client-safe registry the app reads. Only lists files that actually exist. */
export function writeRegistry(m: Manifest, spec: StyleSpec) {
  const out: Record<string, RegistryEntry> = {};
  for (const c of m.cards) {
    const filesExist = c.assets?.files.every((f) => existsSync(path.join(ROOT, f))) ?? false;
    out[c.id] = {
      alt: c.alt,
      reviewStatus: c.review.status,
      image:
        c.assets && filesExist && c.review.status !== "rejected"
          ? { hash: c.assets.hash, widths: spec.output.deliveryWidths, formats: spec.output.formats, width: c.assets.width, height: c.assets.height, lqip: c.assets.lqip }
          : null,
    };
  }
  mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  writeFileSync(REGISTRY_PATH, JSON.stringify(out, null, 2) + "\n");
}

export function publicPath(id: string, hash: string, width: number, format: string) {
  return `public/cards/${id}.${hash}-${width}.${format}`;
}
