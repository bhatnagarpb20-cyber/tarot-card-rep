/**
 * Drawing kit for the Inhale Exhale deck: fine black line art on textured paper, cobalt figures,
 * flowing rainbow robes and golden ray bursts. Every card is a 600 × 1000 SVG built from these
 * pieces so the 78 cards read as one deck.
 */
import type { ReactNode } from "react";

export const W = 600;
export const H = 1000;

export const INK = "#1b1a1f";
export const PAPER = "#efeae0";
export const COBALT = "#1d3fd8";
export const SUN = "#f2c12e";
export const CREAM = "#f7ecd4";

/** Robe stripe palettes, warm to cool. */
export const RAINBOW = {
  sunset: ["#f7ecd4", "#c99a2c", "#f2c12e", "#f28a2e", "#f25c6e", "#e8283c", "#c2184b", "#1d3fd8"],
  spring: ["#f7ecd4", "#f2c12e", "#f28a2e", "#ee3e86", "#1e9a6a", "#1d3fd8"],
  regal: ["#1d3fd8", "#e5197a", "#f47ca8", "#f28a2e", "#ff6a00", "#f2c12e", "#e8283c", "#c99a2c", "#f7ecd4", "#fbf3e2"],
} as const;

export const line = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/**
 * Paper grain: one small embossed-noise tile, rasterised once by the browser and shared by every
 * card (a per-card SVG filter would be recomputed 78 times on the deck page).
 */
const GRAIN = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='7' stitchTiles='stitch'/><feDiffuseLighting lighting-color='#fff' surfaceScale='1.6'><feDistantLight azimuth='45' elevation='62'/></feDiffuseLighting></filter><rect width='240' height='240' filter='url(#n)'/></svg>",
)}`;

/** Card frame: paper ground with a subtle embossed texture, then the illustration, then the title. */
export function CardSvg({ id, label, title, numeral, children }: { id: string; label: string; title: string; numeral?: string; children: ReactNode }) {
  const tex = `paper-${id}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="block h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={tex} width="240" height="240" patternUnits="userSpaceOnUse">
          <image href={GRAIN} width="240" height="240" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={PAPER} />
      <rect width={W} height={H} fill={`url(#${tex})`} opacity="0.55" style={{ mixBlendMode: "multiply" }} />
      {numeral && (
        <text x={W / 2} y="78" textAnchor="middle" fill={INK} fontSize="22" letterSpacing="6" fontFamily="var(--font-display), sans-serif" fontWeight="500">
          {numeral}
        </text>
      )}
      {children}
      <Title text={title} />
    </svg>
  );
}

export function Title({ text }: { text: string }) {
  // Approximate rendered width (27 px caps with 4.5 px tracking) so the side rules clear the words.
  const half = (text.length * 21) / 2 + 18;
  return (
    <g>
      <path d={`M${W / 2 - half} 925h-30M${W / 2 + half} 925h30`} stroke={COBALT} strokeWidth="1.6" strokeLinecap="round" />
      <text x={W / 2} y="933" textAnchor="middle" fill={INK} fontSize="27" letterSpacing="4.5" fontFamily="var(--font-display), sans-serif" fontWeight="500">
        {text.toUpperCase()}
      </text>
    </g>
  );
}

/** Radiating ray burst. `broken` leaves small gaps so the rays shimmer like the reference engravings. */
export function Rays({ cx, cy, r0, r1, count = 56, color = SUN, width = 2.2, from = 0, to = 360, broken = false }: { cx: number; cy: number; r0: number; r1: number; count?: number; color?: string; width?: number; from?: number; to?: number; broken?: boolean }) {
  const full = to - from >= 360;
  const n = full ? count : count - 1;
  const rays = Array.from({ length: count }, (_, i) => {
    const a = ((from + ((to - from) * i) / n - 90) * Math.PI) / 180;
    // Alternate long and short rays for rhythm.
    const outer = i % 2 ? r1 : r1 - (r1 - r0) * 0.22;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    if (broken && i % 3 === 0) {
      const mid = r0 + (outer - r0) * 0.55;
      return `M${cx + cos * r0} ${cy + sin * r0}L${cx + cos * mid} ${cy + sin * mid}M${cx + cos * (mid + 10)} ${cy + sin * (mid + 10)}L${cx + cos * outer} ${cy + sin * outer}`;
    }
    return `M${cx + cos * r0} ${cy + sin * r0}L${cx + cos * outer} ${cy + sin * outer}`;
  });
  return <path d={rays.join("")} stroke={color} strokeWidth={width} strokeLinecap="round" fill="none" />;
}

/**
 * A fall of rainbow cloth: stripes run from a narrow top edge down to a wide hem, each seam a
 * smooth bell curve. `top`/`bottom` are [left, right] x-ranges; `lean` shifts the hem sideways.
 */
export function RainbowFall({ top, topY, bottom, bottomY, colors, flare = 0.55, lean = 0, outline = true }: { top: [number, number]; topY: number; bottom: [number, number]; bottomY: number; colors: readonly string[]; flare?: number; lean?: number; outline?: boolean }) {
  const n = colors.length;
  const tx = (k: number) => top[0] + ((top[1] - top[0]) * k) / n;
  const bx = (k: number) => bottom[0] + ((bottom[1] - bottom[0]) * k) / n + lean;
  const h = bottomY - topY;
  // Seam k as a cubic from top to hem; the hem end flares outward from the centre.
  const seam = (k: number) => {
    const t = tx(k);
    const b = bx(k);
    return { t, b, c1: [t, topY + h * flare] as const, c2: [b + (t - b) * 0.12, bottomY - h * 0.08] as const };
  };
  const stripes = colors.map((c, i) => {
    const a = seam(i);
    const z = seam(i + 1);
    const d = `M${a.t} ${topY}C${a.c1[0]} ${a.c1[1]} ${a.c2[0]} ${a.c2[1]} ${a.b} ${bottomY}L${z.b} ${bottomY}C${z.c2[0]} ${z.c2[1]} ${z.c1[0]} ${z.c1[1]} ${z.t} ${topY}Z`;
    return <path key={i} d={d} fill={c} stroke={outline ? INK : "none"} strokeWidth="2" strokeLinejoin="round" />;
  });
  return <g>{stripes}</g>;
}

/** An outlined limb: an ink stroke with a cobalt stroke laid inside it. */
export function Limb({ d, w = 18, color = COBALT }: { d: string; w?: number; color?: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={w + 4} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  );
}

/** Four-point sparkle star. */
export function Sparkle({ x, y, r = 10, color = SUN }: { x: number; y: number; r?: number; color?: string }) {
  const k = r * 0.22;
  return <path d={`M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`} fill={color} />;
}

/** Five-point star, for night skies. */
export function Star5({ x, y, r = 8, color = COBALT }: { x: number; y: number; r?: number; color?: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 ? r * 0.45 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${x + Math.cos(a) * rad},${y + Math.sin(a) * rad}`;
  });
  return <polygon points={pts.join(" ")} fill={color} />;
}

/** A simple line flower (rose or daisy) on a stem. */
export function Flower({ x, y, stem = 60, angle = 0, color = "none", petals = 6, r = 9 }: { x: number; y: number; stem?: number; angle?: number; color?: string; petals?: number; r?: number }) {
  return (
    <g transform={`rotate(${angle} ${x} ${y + stem})`}>
      <path d={`M${x} ${y + stem}C${x - 4} ${y + stem * 0.6} ${x + 4} ${y + stem * 0.35} ${x} ${y + r}`} {...line} strokeWidth="1.8" />
      <path d={`M${x} ${y + stem * 0.62}c8-6 16-6 20-2-6 5-13 6-20 2z`} {...line} strokeWidth="1.6" fill={PAPER} />
      {Array.from({ length: petals }, (_, i) => {
        const a = (360 / petals) * i;
        return <ellipse key={i} cx={x} cy={y - r * 0.9} rx={r * 0.45} ry={r * 0.95} transform={`rotate(${a} ${x} ${y})`} fill={color === "none" ? PAPER : color} stroke={INK} strokeWidth="1.5" />;
      })}
      <circle cx={x} cy={y} r={r * 0.35} fill={SUN} stroke={INK} strokeWidth="1.4" />
    </g>
  );
}

/** Distant mountains as a single line. */
export function Mountains({ x, y, w, h, fill = PAPER }: { x: number; y: number; w: number; h: number; fill?: string }) {
  const d = `M${x} ${y}L${x + w * 0.22} ${y - h * 0.7}L${x + w * 0.34} ${y - h * 0.45}L${x + w * 0.52} ${y - h}L${x + w * 0.7} ${y - h * 0.5}L${x + w * 0.8} ${y - h * 0.62}L${x + w} ${y}`;
  return <path d={d} {...line} fill={fill} />;
}
