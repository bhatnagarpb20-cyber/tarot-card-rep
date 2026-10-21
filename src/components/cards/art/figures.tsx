/**
 * Figures, creatures and furniture for the deck. Everything is drawn at a natural scale around an
 * anchor point and positioned with `x`, `y` and `s`, so cards compose them like stickers.
 */
import type { ReactNode } from "react";
import { COBALT, CREAM, INK, line, PAPER, RainbowFall, SUN } from "./kit";

type Pt = readonly [number, number];

const PROFILE_FACE = "M-23 -7C-23 -27-5-37 11-31 21-27 25-17 24-7L32 3 24 7C25 13 22 17 17 19 11 31-1 35-11 31-23 25-25 9-23-7z";

export type Hair = "short" | "long" | "bun" | "curly" | "none" | "hood" | "bald";

/** Hair that falls behind the body; draw before the robe. */
export function HairBack({ x, y, s = 1, hair, color = INK }: { x: number; y: number; s?: number; hair: Hair; color?: string }) {
  if (hair !== "long" && hair !== "curly") return null;
  const d = hair === "long" ? "M-25-8C-31 30-34 70-40 104H40C34 70 31 30 25-8z" : "M-30-10C-40 10-40 40-30 60-20 70 20 70 30 60 40 40 40 10 30-10z";
  return <path transform={`translate(${x} ${y}) scale(${s})`} d={d} fill={color} stroke={INK} strokeWidth={2 / s} strokeLinejoin="round" />;
}

/** A head with simple features. `facing` left/right draws a profile. */
export function Head({ x, y, s = 1, facing = "front", hair = "short", hairColor = INK, skin = COBALT, crown, eyes = "closed" }: { x: number; y: number; s?: number; facing?: "front" | "left" | "right"; hair?: Hair; hairColor?: string; skin?: string; crown?: "gold" | "laurel" | "moon" | "triple" | "helmet" | "cap"; eyes?: "closed" | "open" | "down" }) {
  const flip = facing === "left" ? -1 : 1;
  const sw = 2.2 / s;
  const face =
    facing === "front" ? (
      <>
        <ellipse cx={0} cy={0} rx={21} ry={26} fill={skin} stroke={INK} strokeWidth={sw} />
        {eyes === "open" ? (
          <>
            <circle cx={-8} cy={0} r={2.2} fill={PAPER} />
            <circle cx={8} cy={0} r={2.2} fill={PAPER} />
          </>
        ) : (
          <path d={eyes === "down" ? "M-11 2c3 1 6 1 8 0M3 2c3 1 6 1 8 0" : "M-11 0c3 2 6 2 8 0M3 0c3 2 6 2 8 0"} {...line} stroke={PAPER} strokeWidth={1.6 / s} />
        )}
        <path d="M0 6v7M-5 18c3 2 7 2 10 0" {...line} stroke={PAPER} strokeWidth={1.6 / s} />
      </>
    ) : (
      <>
        <path d={PROFILE_FACE} fill={skin} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
        <path d={eyes === "open" ? "M8-6a2 2 0 1 0 0.1 0" : "M5-5c3 2 7 2 10-1"} {...line} stroke={PAPER} strokeWidth={1.8 / s} />
      </>
    );
  const cap = (() => {
    if (hair === "none" || hair === "bald") return null;
    if (hair === "hood")
      return <path d="M-30 30C-36 0-30-34 0-38 30-34 36 0 30 30 24 10 16-14 0-16-16-14-24 10-30 30z" fill="#7c7f8c" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />;
    if (facing === "front") {
      const d =
        hair === "curly"
          ? "M-24 4c-10-8-6-22 2-26-2-12 10-20 20-14 8-8 22-4 24 6 10 2 12 16 4 24-2-10-8-18-16-20-8 6-20 8-34 30z"
          : "M-22 2c-6-26 8-44 24-44s32 16 24 44c-2-14-8-24-18-28-6 8-18 12-30 12z";
      return (
        <>
          <path d={d} fill={hairColor} stroke={INK} strokeWidth={sw / 1.5} strokeLinejoin="round" />
          {hair === "bun" && <circle cx={0} cy={-34} r={11} fill={hairColor} stroke={INK} strokeWidth={sw / 1.5} />}
        </>
      );
    }
    return (
      <g transform={`scale(${flip} 1)`}>
        <path d="M18-26C6-40-20-38-26-18-30-4-26 12-18 22-24 8-22-6-14-14-4-22 8-24 18-26z" fill={hairColor} stroke={INK} strokeWidth={sw / 1.5} strokeLinejoin="round" />
        {hair === "bun" && <circle cx={-22} cy={-22} r={10} fill={hairColor} stroke={INK} strokeWidth={sw / 1.5} />}
      </g>
    );
  })();
  const crownEl = (() => {
    switch (crown) {
      case "gold":
        return <path d="M-19-22l-4-18 10 9 13-15 13 15 10-9-4 18z" fill={SUN} stroke={INK} strokeWidth={sw / 1.2} strokeLinejoin="round" />;
      case "triple":
        return <path d="M-14-22c0-30 28-30 28 0M-10-34h20M-8-44h16M0-56v-8" fill={SUN} stroke={INK} strokeWidth={sw / 1.2} strokeLinejoin="round" />;
      case "laurel":
        return <path d="M-22-14c4-14 14-22 22-24 8 2 18 10 22 24M-18-22l-6-4M-12-30l-4-6M18-22l6-4M12-30l4-6" fill="none" stroke="#1e9a6a" strokeWidth={3 / s} strokeLinecap="round" />;
      case "moon":
        return (
          <>
            <circle cx={0} cy={-40} r={10} fill={SUN} stroke={INK} strokeWidth={sw / 1.2} />
            <path d="M-24-34a12 12 0 0 0 12-16 10 10 0 0 1-12 16zM24-34a12 12 0 0 1-12-16 10 10 0 0 0 12 16z" fill={SUN} stroke={INK} strokeWidth={sw / 1.3} />
          </>
        );
      case "helmet":
        return <path d="M-24 0C-26-30-12-42 0-42S26-30 24 0C18-6 10-10 0-10S-18-6-24 0zM0-42c6-14 20-18 30-14-8 2-14 8-16 16" fill="#c9ccd6" stroke={INK} strokeWidth={sw / 1.2} strokeLinejoin="round" />;
      case "cap":
        return <path d="M-24-12c0-22 14-32 28-30 16 2 26 14 24 30zM20-30c10-14 24-18 34-16-10 4-18 10-22 20" fill="#e8283c" stroke={INK} strokeWidth={sw / 1.2} strokeLinejoin="round" />;
      default:
        return null;
    }
  })();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {facing === "front" ? face : <g transform={`scale(${flip} 1)`}>{face}</g>}
      {cap}
      {crownEl}
    </g>
  );
}

/** An outlined limb from a list of points (smoothed), ending in a hand. */
export function Arm({ pts, w = 16, skin = COBALT, hand = true, sleeve }: { pts: readonly Pt[]; w?: number; skin?: string; hand?: boolean; sleeve?: string }) {
  const d = smooth(pts);
  const end = pts[pts.length - 1];
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={w + 4} />
      <path d={d} stroke={sleeve ?? skin} strokeWidth={w} />
      {hand && <circle cx={end[0]} cy={end[1]} r={w * 0.62} fill={skin} stroke={INK} strokeWidth="2" />}
    </g>
  );
}

/** Catmull-Rom style smoothing through points. */
export function smooth(pts: readonly Pt[]): string {
  if (pts.length < 3) return `M${pts.map((p) => p.join(" ")).join("L")}`;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/**
 * A robed figure: hair, rainbow robe with rounded shoulders, neck and head. Head centre is (x, y);
 * the robe runs to `bottom` (absolute y). Arms are passed in absolute coordinates via `arms`
 * (drawn in front) and `armsBehind`.
 */
export function Person({
  id,
  x,
  y,
  s = 1,
  colors,
  bottom = 800,
  hem = 140,
  lean = 0,
  flare = 0.5,
  shoulder = 54,
  facing = "front",
  hair = "short",
  hairColor = INK,
  skin = COBALT,
  crown,
  eyes,
  arms,
  armsBehind,
  feet,
  over,
}: {
  id: string;
  x: number;
  y: number;
  s?: number;
  colors: readonly string[];
  bottom?: number;
  hem?: number;
  lean?: number;
  flare?: number;
  shoulder?: number;
  facing?: "front" | "left" | "right";
  hair?: Hair;
  hairColor?: string;
  skin?: string;
  crown?: "gold" | "laurel" | "moon" | "triple" | "helmet" | "cap";
  eyes?: "closed" | "open" | "down";
  arms?: ReactNode;
  armsBehind?: ReactNode;
  feet?: boolean;
  over?: ReactNode;
}) {
  const top = y + 48 * s;
  const sh = shoulder * s;
  const clip = `robe-${id}`;
  const shoulders = `M${x - sh} ${top + 36 * s}C${x - sh} ${top + 14 * s} ${x - sh + 16 * s} ${top + 2 * s} ${x - 18 * s} ${top}H${x + 18 * s}C${x + sh - 16 * s} ${top + 2 * s} ${x + sh} ${top + 14 * s} ${x + sh} ${top + 36 * s}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={`${shoulders}L${x + hem + lean + 40} ${bottom + 2}H${x - hem + lean - 40}z`} />
        </clipPath>
      </defs>
      <HairBack x={x} y={y} s={s} hair={hair} color={hairColor} />
      {armsBehind}
      {feet && (
        <g>
          <ellipse cx={x - 22 * s + lean} cy={bottom} rx={16 * s} ry={7 * s} fill={skin} stroke={INK} strokeWidth="2" />
          <ellipse cx={x + 22 * s + lean} cy={bottom} rx={16 * s} ry={7 * s} fill={skin} stroke={INK} strokeWidth="2" />
        </g>
      )}
      <g clipPath={`url(#${clip})`}>
        <RainbowFall top={[x - sh, x + sh]} topY={top} bottom={[x - hem, x + hem]} bottomY={bottom} colors={colors} flare={flare} lean={lean} />
      </g>
      <path d={shoulders} {...line} />
      {over}
      <path d={`M${x - 10 * s} ${y + 18 * s}h${20 * s}l${2 * s} ${32 * s}h${-24 * s}z`} fill={skin} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <Head x={x} y={y} s={s} facing={facing} hair={hair} hairColor={hairColor} skin={skin} crown={crown} eyes={eyes} />
      {arms}
    </g>
  );
}

/** Side-view horse, facing right; (x, y) is the ground point under its hind hooves. */
export function Horse({ x, y, s = 1, flip = false, color = PAPER, rearing = false, mane = INK }: { x: number; y: number; s?: number; flip?: boolean; color?: string; rearing?: boolean; mane?: string }) {
  const body =
    "M40 95C30 100 22 120 28 140 34 160 40 170 44 180L40 250H54L58 185C70 175 90 170 110 172 140 174 170 172 186 168L190 250H204L206 170C216 150 220 130 218 116 222 100 236 84 250 76 262 74 276 78 286 70 292 62 290 52 282 48 270 40 256 28 248 18L244 6 238 20C222 30 206 50 194 70 170 78 120 80 90 82 70 84 50 88 40 95z";
  const far = "M66 180L64 250H76L80 180zM174 170L172 250H184L188 170z";
  const stroke = color === INK ? PAPER : INK;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) ${rearing ? "rotate(-18 50 250)" : ""} translate(-40 -250)`}>
      <path d={far} fill={color} stroke={INK} strokeWidth="2" strokeLinejoin="round" opacity="0.85" />
      <path d="M36 98C10 110 6 150 16 186M30 104C14 124 14 156 24 180" {...line} stroke={mane} strokeWidth="5" />
      <path d={body} fill={color} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M244 14C226 26 210 46 198 68M236 24C222 36 212 50 204 66M228 32C218 42 212 52 208 62" {...line} stroke={mane} strokeWidth="4" />
      <circle cx={262} cy={46} r={3} fill={stroke} />
      <path d="M282 62c-4 2-8 2-10 0" {...line} stroke={stroke} strokeWidth="1.6" />
    </g>
  );
}

/** A rider seated on a horse: torso, one visible leg and arms. (x, y) is the rider's head. */
export function Rider({ id, x, y, colors, skin = COBALT, hair = "short" as Hair, hairColor = INK, crown, facing = "right" as "left" | "right", arms, s = 1 }: { id: string; x: number; y: number; colors: readonly string[]; skin?: string; hair?: Hair; hairColor?: string; crown?: "gold" | "laurel" | "moon" | "triple" | "helmet" | "cap"; facing?: "left" | "right"; arms?: ReactNode; s?: number }) {
  return (
    <g>
      <Person id={id} x={x} y={y} s={s} colors={colors} bottom={y + 170 * s} hem={62 * s} shoulder={44} facing={facing} hair={hair} hairColor={hairColor} crown={crown} skin={skin} arms={arms} />
      <Arm pts={[[x + 10 * s, y + 150 * s], [x + 22 * s, y + 190 * s], [x + 14 * s, y + 222 * s]]} w={18 * s} skin={skin} hand={false} />
      <path d={`M${x + 4 * s} ${y + 222 * s}h${24 * s}l${4 * s} ${8 * s}h${-30 * s}z`} fill={INK} />
    </g>
  );
}

/** A throne seen from the front: high back, seat and optional carvings. (x, ground) is centre-bottom. */
export function Throne({ x, ground = 800, top = 330, w = 220, color = CREAM, carving }: { x: number; ground?: number; top?: number; w?: number; color?: string; carving?: "ram" | "lion" | "fish" | "butterfly" | "bull" }) {
  const hw = w / 2;
  return (
    <g>
      <path d={`M${x - hw} ${ground}V${top + 40}C${x - hw} ${top} ${x - hw + 30} ${top - 20} ${x} ${top - 20}S${x + hw} ${top} ${x + hw} ${top + 40}V${ground}z`} {...line} fill={color} />
      <path d={`M${x - hw + 18} ${ground}V${top + 50}M${x + hw - 18} ${ground}V${top + 50}`} {...line} strokeWidth="1.4" />
      <path d={`M${x - hw - 20} ${ground - 160}h${w + 40}v24h${-w - 40}z`} {...line} fill={color} />
      {carving && <Carving x={x - hw - 4} y={ground - 196} kind={carving} />}
      {carving && <Carving x={x + hw + 4} y={ground - 196} kind={carving} />}
    </g>
  );
}

function Carving({ x, y, kind }: { x: number; y: number; kind: "ram" | "lion" | "fish" | "butterfly" | "bull" }) {
  switch (kind) {
    case "ram":
      return <path d={`M${x - 14} ${y}a14 14 0 1 1 14 14 8 8 0 1 0-8-8`} {...line} strokeWidth="3" fill={SUN} />;
    case "lion":
      return (
        <g>
          <circle cx={x} cy={y} r={16} fill={SUN} stroke={INK} strokeWidth="2" />
          <circle cx={x} cy={y} r={8} fill="#f28a2e" stroke={INK} strokeWidth="1.6" />
        </g>
      );
    case "fish":
      return <path d={`M${x - 16} ${y}c8-10 22-10 30 0-8 10-22 10-30 0zm30 0l10-8v16z`} {...line} fill="#7fb0ff" />;
    case "butterfly":
      return <path d={`M${x} ${y}c-14-14-22 0-12 8-10 8 0 18 12 2 12 16 22 6 12-2 10-8 2-22-12-8z`} {...line} fill="#7fb0ff" strokeWidth="1.6" />;
    case "bull":
      return <path d={`M${x - 14} ${y - 10}c4 6 8 8 14 8s10-2 14-8M${x - 8} ${y}a8 10 0 1 0 16 0 8 10 0 1 0-16 0`} {...line} fill={SUN} strokeWidth="2" />;
  }
}

/** A striped rainbow wing. (x, y) is the root; `flip` mirrors it to the left. */
export function Wing({ x, y, s = 1, flip = false, colors = ["#f7ecd4", "#f2c12e", "#f28a2e", "#e8283c", "#1d3fd8"] }: { x: number; y: number; s?: number; flip?: boolean; colors?: readonly string[] }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {colors.map((c, i) => {
        const len = 170 - i * 22;
        const a = -70 + i * 18;
        return <path key={c} d={`M0 0C${len * 0.4} ${-30 + i * 6} ${len} ${-60 + i * 20} ${len} ${-40 + i * 24}C${len * 0.7} ${-10 + i * 18} ${len * 0.3} ${4 + i * 4} 0 ${12 + i * 2}z`} transform={`rotate(${a + 60} 0 0)`} fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
      })}
    </g>
  );
}

/** A small cloud of linked arcs. */
export function Cloud({ x, y, s = 1, fill = PAPER }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-60 10c-16 0-20-22-4-26 0-18 22-26 34-14 6-16 32-16 38 2 16-6 32 6 28 22 14 4 12 16 0 16z" {...line} strokeWidth={2.2 / s} fill={fill} />;
}

/** A line-art tree: trunk and leafy crown, optionally with fruit. */
export function Tree({ x, y, s = 1, fruit, leaf = "#1e9a6a" }: { x: number; y: number; s?: number; fruit?: string; leaf?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0V-90M-6-60l-22-24M-6-74l20-22" {...line} strokeWidth={3 / s} />
      <path d="M-70-120c-10-34 20-60 50-52 10-28 56-28 64 4 30-4 46 30 26 50 10 26-20 44-44 30-14 18-48 18-60-2-26 6-46-12-36-30z" {...line} strokeWidth={2.2 / s} fill={PAPER} />
      {[[-44, -130], [-14, -150], [20, -140], [40, -110], [-30, -100], [6, -112]].map(([fx, fy], i) =>
        fruit ? <circle key={i} cx={fx} cy={fy} r={7} fill={fruit} stroke={INK} strokeWidth={1.6 / s} /> : <path key={i} d={`M${fx} ${fy}c6-8 14-8 18-2-6 6-12 6-18 2z`} fill={leaf} stroke={INK} strokeWidth={1.4 / s} />,
      )}
    </g>
  );
}

/** Castle on a hill, small and distant. (x, y) is the base centre. */
export function Castle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} {...line} strokeWidth={2 / s}>
      <path d="M-50 0V-40h12v-8h8v8h12v-20l14-12 14 12v20h12v-8h8v8h12V0z" fill={PAPER} />
      <path d="M-6 0v-14a6 6 0 0 1 12 0V0M-30-24h6M24-24h6" />
    </g>
  );
}

/** Rows of gentle waves. */
export function Water({ y, x0 = 40, x1 = 560, rows = 2, color = COBALT, gap = 24 }: { y: number; x0?: number; x1?: number; rows?: number; color?: string; gap?: number }) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round">
      {Array.from({ length: rows }, (_, r) => {
        let d = `M${x0 + (r % 2) * 20} ${y + r * gap}`;
        for (let xx = x0 + (r % 2) * 20; xx < x1 - 40; xx += 40) d += `c10-8 20-8 20 0s10 8 20 0`;
        return <path key={r} d={d} strokeWidth={2.2 - r * 0.3} opacity={1 - r * 0.15} />;
      })}
    </g>
  );
}

/** Crescent moon. */
export function Crescent({ x, y, r = 20, rot = 0, fill = SUN }: { x: number; y: number; r?: number; rot?: number; fill?: string }) {
  // Outer circle minus an equal circle shifted right: arcs meet at x = d/2.
  const d = r * 0.7;
  const h = Math.sqrt(r * r - (d * d) / 4);
  return <path transform={`translate(${x} ${y}) rotate(${rot})`} d={`M${d / 2} ${-h}A${r} ${r} 0 1 0 ${d / 2} ${h}A${r} ${r} 0 0 1 ${d / 2} ${-h}z`} fill={fill} stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
}

/** Simple flying bird. */
export function Bird({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - 10 * s} ${y}q${5 * s}-${6 * s} ${10 * s} 0q${5 * s}-${6 * s} ${10 * s} 0`} {...line} strokeWidth="1.8" />;
}

/** A lion lying down, facing left (used for Strength, thrones and Queen of Wands). */
export function Lion({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M150 0c10-30 4-60-20-70-30-12-70-8-100-2" {...line} fill="none" strokeWidth="4" />
      <path d="M-40 0c-4-20 0-44 14-56 20-16 60-20 100-16 36 2 60 14 70 40 6 14 4 28 0 32z" {...line} fill="#f2c12e" />
      <path d="M-70-50c-20-26-4-64 30-66 30-4 50 22 44 50-6 26-30 40-54 34-10-2-16-8-20-18z" {...line} fill="#f28a2e" />
      <path d="M-58-58c-4-20 8-36 26-36 16 0 26 14 24 30-2 16-14 26-28 26-12 0-20-8-22-20z" {...line} fill="#f2c12e" />
      <path d="M-46-62c2 2 6 2 8 0M-26-62c2 2 6 2 8 0M-38-48c4 4 10 4 14 0" {...line} strokeWidth="1.8" />
      <path d="M10 0v-10M60 0v-10M100 0v-10" {...line} strokeWidth="2" />
    </g>
  );
}

/** A feathered banner on a pole. */
export function Banner({ x, y, h = 140, color = PAPER, emblem }: { x: number; y: number; h?: number; color?: string; emblem?: ReactNode }) {
  return (
    <g>
      <path d={`M${x} ${y}V${y + h}`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${x} ${y + 4}h70l-14 26 14 26h-70z`} {...line} fill={color} />
      {emblem}
    </g>
  );
}

function Book({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 22} ${y}l22 6 22-6v-16l-22 6-22-6zM${x} ${y + 6}v-16`} {...line} strokeWidth="1.8" fill={PAPER} />;
}

/** The four winged creatures (angel, eagle, bull, lion) reading on clouds in the corners. */
export function FourCreatures({ top, bottom }: { top: number; bottom: number }) {
  return (
    <g>
      <Cloud x={110} y={top} s={0.9} />
      <Wing x={98} y={top - 30} s={0.25} flip />
      <Wing x={122} y={top - 30} s={0.25} />
      <Head x={110} y={top - 38} s={0.6} hair="curly" hairColor={SUN} />
      <Book x={110} y={top + 20} />
      <Cloud x={490} y={top} s={0.9} />
      <path d={`M470 ${top - 30}c0-24 30-34 44-18l18 8-18 6c-4 18-34 22-44 4z`} {...line} fill={SUN} />
      <circle cx={500} cy={top - 42} r={2.6} fill={INK} />
      <Book x={490} y={top + 20} />
      <Cloud x={110} y={bottom} s={0.9} />
      <path d={`M86 ${bottom - 40}c-14-8-18-22-10-26 6 6 12 8 18 6 4-6 22-6 28 0 6 2 12 0 18-6 8 4 4 18-10 26-4 18-12 28-22 28s-18-10-22-28z`} {...line} fill={PAPER} />
      <Book x={110} y={bottom + 20} />
      <Cloud x={490} y={bottom} s={0.9} />
      <circle cx={490} cy={bottom - 46} r={26} fill="#f28a2e" stroke={INK} strokeWidth="2" />
      <circle cx={490} cy={bottom - 44} r={16} fill={SUN} stroke={INK} strokeWidth="1.8" />
      <path d={`M484 ${bottom - 46}c1 1 3 1 4 0M494 ${bottom - 46}c1 1 3 1 4 0M486 ${bottom - 38}c2 2 6 2 8 0`} {...line} strokeWidth="1.4" />
      <Book x={490} y={bottom + 20} />
    </g>
  );
}

/** A sitting canine, howling upward; `color` PAPER for the dog, grey for the wolf. */
export function Canine({ x, y, s = 1, flip = false, color = PAPER }: { x: number; y: number; s?: number; flip?: boolean; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-34 0C-40-30-30-60-12-78L-8-100C-8-118 4-128 16-126L20-146 28-124C38-118 48-108 54-98L50-92C40-94 30-92 22-86 18-68 22-40 28-20L30 0z" {...line} fill={color} />
      <path d="M-34 0c-16-6-20-20-12-30" {...line} />
      <path d="M4 0V-40" {...line} strokeWidth="1.6" />
      <circle cx={22} cy={-112} r={2.4} fill={INK} />
    </g>
  );
}

/** Eight-pointed star. */
export function Star8({ x, y, r = 30, fill = SUN }: { x: number; y: number; r?: number; fill?: string }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const rad = i % 2 ? r * 0.42 : r;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    return `${(x + Math.cos(a) * rad).toFixed(1)},${(y + Math.sin(a) * rad).toFixed(1)}`;
  });
  return <polygon points={pts.join(" ")} fill={fill} stroke={INK} strokeWidth="2" strokeLinejoin="round" />;
}
