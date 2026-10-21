// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import "./font-env";
import { composeCard, writeDeliveryFiles } from "./process";
import { buildPrompt, loadArtCards, loadSpec } from "./lib";
import { fitTitle } from "./frame";
import { CARD_IDS } from "@/content/cards";

const spec = loadSpec();
const solid = (w: number, h: number) => sharp({ create: { width: w, height: h, channels: 3, background: "#445577" } }).png().toBuffer();

describe("illustration specification", () => {
  it("defines art for exactly the 78 canonical cards", () => {
    expect(loadArtCards().map((c) => c.id)).toEqual([...CARD_IDS]);
  });

  it("builds every prompt from the same locked structure", () => {
    for (const card of loadArtCards()) {
      const prompt = buildPrompt(card, spec);
      expect(prompt).toContain(spec.prompt.style);
      expect(prompt).toContain(spec.prompt.palette);
      expect(prompt).toContain(spec.prompt.negative);
      expect(prompt).toContain(card.name);
      for (const s of card.symbols) expect(prompt).toContain(s);
    }
  });

  it("fits every card title on the title plate", () => {
    for (const card of loadArtCards()) {
      const fit = fitTitle(card.name, spec.frame.titleFont);
      expect(fit.size).toBeGreaterThanOrEqual(spec.frame.titleFont.minSize);
      expect(fit.squeeze, card.name).toBe(false);
    }
  });
});

describe("art processing", () => {
  it("composes a 2:3 master at the spec size", async () => {
    const r = await composeCard(await solid(1024, 1536), { name: "The Fool", numeral: "0" }, spec, "art");
    const meta = await sharp(r.master).metadata();
    expect([meta.width, meta.height]).toEqual([1200, 1800]);
    expect(r.warnings).toEqual([]);
  });

  it("rejects sources below the minimum resolution", async () => {
    await expect(composeCard(await solid(115, 190), { name: "The Fool", numeral: "0" }, spec, "art")).rejects.toThrow(/minimum/);
  });

  it("flags non-2:3 sources for review instead of silently cropping", async () => {
    const r = await composeCard(await solid(1536, 1536), { name: "The Fool", numeral: "0" }, spec, "art");
    expect(r.warnings[0]).toMatch(/not 2:3/);
  });

  it("writes every delivery width and format with a content hash", async () => {
    const out = mkdtempSync(path.join(tmpdir(), "arcana-"));
    const r = await composeCard(await solid(1024, 1536), { name: "The Magician", numeral: "I" }, spec, "art");
    const d = await writeDeliveryFiles("major-01-the-magician", r.master, spec, out);
    const files = readdirSync(out);
    expect(files).toHaveLength(spec.output.deliveryWidths.length * spec.output.formats.length);
    expect(files.every((f) => f.startsWith(`major-01-the-magician.${d.hash}-`))).toBe(true);
    expect(d.lqip).toMatch(/^data:image\/webp;base64,/);
    const meta = await sharp(path.join(out, `major-01-the-magician.${d.hash}-480.webp`)).metadata();
    expect([meta.width, meta.height]).toEqual([480, 720]);
  }, 60_000);
});
