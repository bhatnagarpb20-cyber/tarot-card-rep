/**
 * The deck frame: one deterministic SVG overlay (antique-gold arch, celestial spandrels, numeral
 * medallion, title plate) composited over every illustration so borders and titles are identical
 * across all 78 cards. Coordinates are on the 1200×1800 master defined in art/style-spec.json.
 */
import type { StyleSpec } from "./lib";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Approximate Cinzel advance widths (em) — capitals are wide, lowercase render as small caps. */
function estimateWidthEm(text: string, letterSpacing: number): number {
  let w = 0;
  for (const ch of text) {
    if (ch === " ") w += 0.28;
    else if (/[MW]/.test(ch)) w += 0.95;
    else if (/[A-Z]/.test(ch)) w += 0.72;
    else if (/[mw]/.test(ch)) w += 0.78;
    else if (/[a-z]/.test(ch)) w += 0.58;
    else w += 0.4;
    w += letterSpacing;
  }
  return w;
}

export function fitTitle(title: string, f: StyleSpec["frame"]["titleFont"]): { size: number; squeeze: boolean } {
  const em = estimateWidthEm(title, f.letterSpacing);
  const ideal = f.maxTextWidth / em;
  if (ideal >= f.maxSize) return { size: f.maxSize, squeeze: false };
  if (ideal >= f.minSize) return { size: Math.floor(ideal), squeeze: false };
  return { size: f.minSize, squeeze: true };
}

function windowPath(w: StyleSpec["frame"]["window"], inset = 0): string {
  const l = w.left + inset;
  const r = w.right - inset;
  const t = w.top + inset;
  const s = w.shoulder + inset * 0.4;
  const b = w.bottom - inset;
  const cx = (l + r) / 2;
  const k = (r - l) * 0.24;
  return `M${l},${b} L${l},${s} C${l},${s - (s - t) * 0.6} ${cx - k},${t} ${cx},${t} C${cx + k},${t} ${r},${s - (s - t) * 0.6} ${r},${s} L${r},${b} Z`;
}

function star(cx: number, cy: number, r: number, points = 4, inner = 0.32): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (Math.PI / points) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * inner;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}"/>`;
}

function leaf(x: number, y: number, angle: number, len = 26): string {
  return `<path transform="translate(${x} ${y}) rotate(${angle})" d="M0,0 C${len * 0.3},-${len * 0.28} ${len * 0.7},-${len * 0.28} ${len},0 C${len * 0.7},${len * 0.28} ${len * 0.3},${len * 0.28} 0,0 Z"/>`;
}

/** Fixed pseudo-random star field so every card's frame is pixel-identical. */
function frameStars(width: number, height: number): string {
  let seed = 20261021;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const out: string[] = [];
  for (let i = 0; i < 70; i++) {
    const x = rnd() * width;
    const y = rnd() * height;
    const inWindowColumn = x > 70 && x < width - 70 && y > 80 && y < height - 40;
    if (inWindowColumn) continue;
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + rnd() * 1.6).toFixed(2)}" opacity="${(0.35 + rnd() * 0.5).toFixed(2)}"/>`);
  }
  return out.join("");
}

export interface FrameInput {
  title: string;
  numeral: string | null;
}

export function buildFrameSvg({ title, numeral }: FrameInput, spec: StyleSpec): string {
  const { masterWidth: W, masterHeight: H } = spec.output;
  const f = spec.frame;
  const p = Object.fromEntries(Object.entries(spec.palette).map(([k, v]) => [k, v.hex]));
  const win = windowPath(f.window);
  const tp = f.titlePlate;
  const med = f.medallion;
  const fit = fitTitle(title, f.titleFont);
  const titleY = (tp.top + tp.bottom) / 2 + fit.size * 0.34;
  const midX = W / 2;
  const o = f.outerInset;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.goldDark}"/>
      <stop offset="0.35" stop-color="${p.goldLight}"/>
      <stop offset="0.6" stop-color="${p.gold}"/>
      <stop offset="1" stop-color="${p.goldDark}"/>
    </linearGradient>
    <radialGradient id="field" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0" stop-color="${p.midnight}"/>
      <stop offset="1" stop-color="${p.midnightDeep}"/>
    </radialGradient>
    <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.midnight}"/>
      <stop offset="1" stop-color="${p.midnightDeep}"/>
    </linearGradient>
    <linearGradient id="windowShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.82" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="${p.midnightDeep}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>

  <!-- Frame field: everything outside the arched window -->
  <path fill-rule="evenodd" fill="url(#field)" d="M0,0 H${W} V${H} H0 Z ${win}"/>
  <g fill="${p.goldLight}">${frameStars(W, H)}</g>

  <!-- Soft shade at the bottom of the window so the title plate sits cleanly -->
  <path d="${win}" fill="url(#windowShade)"/>

  <!-- Outer borders -->
  <rect x="${o}" y="${o}" width="${W - 2 * o}" height="${H - 2 * o}" rx="20" fill="none" stroke="url(#gold)" stroke-width="6"/>
  <rect x="${o + 14}" y="${o + 14}" width="${W - 2 * o - 28}" height="${H - 2 * o - 28}" rx="12" fill="none" stroke="${p.gold}" stroke-width="1.5" opacity="0.8"/>

  <!-- Window mouldings -->
  <path d="${windowPath(f.window, -12)}" fill="none" stroke="${p.gold}" stroke-width="2" opacity="0.9"/>
  <path d="${win}" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <path d="${windowPath(f.window, 11)}" fill="none" stroke="${p.goldLight}" stroke-width="1.5" opacity="0.7"/>

  <!-- Side columns with nodes -->
  <g stroke="${p.gold}" stroke-width="1.5" fill="${p.gold}">
    <line x1="${o + 32}" y1="${f.window.shoulder + 60}" x2="${o + 32}" y2="${tp.top - 30}"/>
    <line x1="${W - o - 32}" y1="${f.window.shoulder + 60}" x2="${W - o - 32}" y2="${tp.top - 30}"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const y = f.window.shoulder + 120 + i * 160;
      return star(o + 32, y, 9) + star(W - o - 32, y, 9);
    }).join("")}
  </g>

  <!-- Spandrels: crescent moon (left), eight-point star (right), botanical whiplash vines -->
  <g fill="url(#gold)">
    <path d="M200,120 a54,54 0 1 0 54,78 a44,44 0 1 1 -54,-78 z"/>
    ${star(W - 200, 170, 46, 8, 0.42)}
  </g>
  <g fill="none" stroke="${p.gold}" stroke-width="2.2" stroke-linecap="round">
    <path d="M${o + 30},${f.window.shoulder + 40} C${o + 40},260 ${o + 70},150 ${o + 190},${o + 38}"/>
    <path d="M${W - o - 30},${f.window.shoulder + 40} C${W - o - 40},260 ${W - o - 70},150 ${W - o - 190},${o + 38}"/>
    <path d="M330,${o + 40} C370,${o + 70} 410,${o + 52} 440,${o + 30}" opacity="0.8"/>
    <path d="M${W - 330},${o + 40} C${W - 370},${o + 70} ${W - 410},${o + 52} ${W - 440},${o + 30}" opacity="0.8"/>
  </g>
  <g fill="${p.gold}" opacity="0.85">
    ${leaf(o + 44, 300, -70)}${leaf(o + 66, 220, -45)}${leaf(o + 110, 140, -25)}
    ${leaf(W - o - 44, 300, -110)}${leaf(W - o - 66, 220, -135)}${leaf(W - o - 110, 140, -155)}
    ${leaf(360, o + 58, 10, 20)}${leaf(W - 360, o + 58, 170, 20)}
  </g>
  <g fill="${p.goldLight}">${star(300, 250, 8)}${star(W - 300, 250, 8)}${star(130, 380, 6)}${star(W - 130, 380, 6)}</g>

  <!-- Medallion with rays -->
  <g stroke="${p.gold}" stroke-width="2" opacity="0.9">
    ${Array.from({ length: 16 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 16;
      const r1 = med.r + 8;
      const r2 = med.r + (i % 2 ? 18 : 30);
      return `<line x1="${(med.cx + r1 * Math.cos(a)).toFixed(1)}" y1="${(med.cy + r1 * Math.sin(a)).toFixed(1)}" x2="${(med.cx + r2 * Math.cos(a)).toFixed(1)}" y2="${(med.cy + r2 * Math.sin(a)).toFixed(1)}"/>`;
    }).join("")}
  </g>
  <circle cx="${med.cx}" cy="${med.cy}" r="${med.r}" fill="url(#plate)" stroke="url(#gold)" stroke-width="5"/>
  <circle cx="${med.cx}" cy="${med.cy}" r="${med.r - 9}" fill="none" stroke="${p.goldLight}" stroke-width="1.2" opacity="0.8"/>
  ${
    numeral
      ? `<text x="${med.cx}" y="${med.cy + f.numeralFont.size * 0.36}" text-anchor="middle" font-family="${f.numeralFont.family}" font-weight="${f.numeralFont.weight}" font-size="${numeral.length > 4 ? f.numeralFont.size - 8 : f.numeralFont.size}" fill="${p.ivory}" letter-spacing="2">${esc(numeral)}</text>`
      : `<g fill="${p.goldLight}">${star(med.cx, med.cy, 22, 8, 0.4)}</g>`
  }

  <!-- Title plate -->
  <line x1="${tp.left}" y1="${tp.top - 10}" x2="${tp.right}" y2="${tp.top - 10}" stroke="${p.gold}" stroke-width="2"/>
  <rect x="${tp.left}" y="${tp.top}" width="${tp.right - tp.left}" height="${tp.bottom - tp.top}" rx="10" fill="url(#plate)" stroke="url(#gold)" stroke-width="4"/>
  <rect x="${tp.left + 12}" y="${tp.top + 12}" width="${tp.right - tp.left - 24}" height="${tp.bottom - tp.top - 24}" rx="6" fill="none" stroke="${p.gold}" stroke-width="1.3" opacity="0.75"/>
  <g fill="${p.gold}">
    ${leaf(tp.left + 34, (tp.top + tp.bottom) / 2, -20, 30)}${leaf(tp.left + 34, (tp.top + tp.bottom) / 2, 20, 30)}
    ${leaf(tp.right - 34, (tp.top + tp.bottom) / 2, 200, 30)}${leaf(tp.right - 34, (tp.top + tp.bottom) / 2, 160, 30)}
  </g>
  <text x="${midX}" y="${titleY.toFixed(1)}" text-anchor="middle" font-family="${f.titleFont.family}" font-weight="${f.titleFont.weight}" font-size="${fit.size}" fill="${p.ivory}" letter-spacing="${(fit.size * f.titleFont.letterSpacing).toFixed(1)}"${fit.squeeze ? ` textLength="${f.titleFont.maxTextWidth}" lengthAdjust="spacingAndGlyphs"` : ""}>${esc(title)}</text>
  <g stroke="${p.gold}" stroke-width="1.5" fill="${p.gold}">
    <line x1="${midX - 120}" y1="${tp.bottom - 30}" x2="${midX - 16}" y2="${tp.bottom - 30}"/>
    <line x1="${midX + 16}" y1="${tp.bottom - 30}" x2="${midX + 120}" y2="${tp.bottom - 30}"/>
    ${star(midX, tp.bottom - 30, 8)}
  </g>
</svg>`;
}
