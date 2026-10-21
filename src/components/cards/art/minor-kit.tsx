/** Scenery and props used by the Minor Arcana. */
import type { ReactNode } from "react";
import { COBALT, CREAM, INK, line, PAPER, SUN } from "./kit";
import { Arm, Cloud } from "./figures";

export const STONE = "#c9ccd6";
export const RED = "#e8283c";
export const GREEN = "#1e9a6a";
export const ORANGE = "#f28a2e";
export const PINK = "#f47ca8";
export const SKY = "#7fb0ff";
export const LILAC = "#8a5cf0";
export const SAND = "#f9d79a";

/** Robe palettes by suit, so each suit has its own colour temperature. */
export const SUIT_COLORS = {
  wands: ["#f7ecd4", SUN, ORANGE, RED, "#c2184b", ORANGE, SUN],
  cups: ["#fbf3e2", SKY, COBALT, PINK, "#ee3e86", SKY, "#fbf3e2"],
  swords: ["#fbf3e2", STONE, SKY, LILAC, COBALT, STONE, "#fbf3e2"],
  pentacles: ["#f7ecd4", "#c99a2c", SUN, GREEN, "#0f6b49", "#c99a2c", "#f7ecd4"],
} as const;

/** A hand reaching out of a cloud from the left (or right), holding whatever `children` draws at (hx, hy). */
export function HandFromCloud({ cx, cy, hx, hy, flip = false, children }: { cx: number; cy: number; hx: number; hy: number; flip?: boolean; children?: ReactNode }) {
  return (
    <g>
      {children}
      <Arm pts={[[cx + (flip ? -30 : 30), cy], [(cx + hx) / 2, (cy + hy) / 2 + 10], [hx, hy]]} w={22} />
      <Cloud x={cx} y={cy + 10} s={1.3} />
    </g>
  );
}

export function Ground({ y = 800 }: { y?: number }) {
  return <path d={`M40 ${y}H560`} {...line} />;
}

export function Hill({ x0, x1, y, h, fill = PAPER }: { x0: number; x1: number; y: number; h: number; fill?: string }) {
  return <path d={`M${x0} ${y}C${x0 + (x1 - x0) * 0.25} ${y - h} ${x0 + (x1 - x0) * 0.75} ${y - h} ${x1} ${y}`} {...line} fill={fill} />;
}

export function Ship({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-30 0h60l-10 12h-40z" {...line} fill={PAPER} />
      <path d="M0 0v-46M0-44l22 36H0zM0-40l-18 30H0z" {...line} fill={CREAM} />
    </g>
  );
}

export function Pyramids({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-70 0l40-60 40 60zM-10 0l30-44 30 44z" {...line} fill={SAND} />
      <path d="M-30-60L-20 0M20-44l6 44" {...line} strokeWidth="1.2" />
    </g>
  );
}

export function Heart({ x, y, s = 1, fill = RED }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 40C-60 0-70-40-40-56-20-66 0-50 0-36 0-50 20-66 40-56 70-40 60 0 0 40z" {...line} strokeWidth={2.4 / s} fill={fill} />;
}

export function Rain({ x0, x1, y0, y1, color = COBALT }: { x0: number; x1: number; y0: number; y1: number; color?: string }) {
  const lines = [];
  for (let x = x0; x < x1; x += 22) for (let y = y0 + ((x / 22) % 3) * 14; y < y1; y += 44) lines.push(`M${x} ${y}l-6 16`);
  return <path d={lines.join("")} stroke={color} strokeWidth="2" strokeLinecap="round" />;
}

export function Snow({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const dots = [];
  for (let x = x0; x < x1; x += 34) for (let y = y0 + ((x / 34) % 3) * 16; y < y1; y += 48) dots.push([x + ((y / 48) % 2) * 12, y]);
  return (
    <g>
      {dots.map(([dx, dy], i) => (
        <circle key={i} cx={dx} cy={dy} r={3} fill={PAPER} stroke={INK} strokeWidth="1" />
      ))}
    </g>
  );
}

/** Arched stained-glass window with coloured panes. */
export function StainedGlass({ x, y, w = 160, h = 220, children }: { x: number; y: number; w?: number; h?: number; children?: ReactNode }) {
  const hw = w / 2;
  const panes = [SKY, SUN, PINK, GREEN, LILAC, ORANGE];
  return (
    <g>
      <path d={`M${x - hw} ${y + h}V${y + hw}A${hw} ${hw} 0 0 1 ${x + hw} ${y + hw}V${y + h}z`} {...line} fill={SUN} />
      {panes.map((c, i) => (
        <rect key={i} x={x - hw + 10 + (i % 3) * ((w - 20) / 3)} y={y + hw + Math.floor(i / 3) * ((h - hw - 10) / 2)} width={(w - 20) / 3} height={(h - hw - 10) / 2} fill={c} stroke={INK} strokeWidth="1.4" />
      ))}
      {children}
    </g>
  );
}

export function Cat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-20 0c-6-24 0-44 14-50l-4-16 12 10c4-2 10-2 14 0l12-10-4 16c14 6 20 26 14 50z" {...line} fill={INK} />
      <path d="M22-4c18 0 24-18 14-28" {...line} strokeWidth="5" />
      <circle cx={-2} cy={-44} r={2.4} fill={SUN} />
      <circle cx={10} cy={-44} r={2.4} fill={SUN} />
    </g>
  );
}

export function Salamander({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-40 0c10-14 30-16 50-8 14 6 26 4 34-6-2 14-14 22-30 20-20-2-36 6-54-6z" {...line} fill={ORANGE} />
      <path d="M-20-6l-6-10M-4-8l2-12M14-4l-4 10M30 0l6 10" {...line} strokeWidth="1.8" />
      <circle cx={38} cy={-8} r={2} fill={INK} />
    </g>
  );
}

export function Dove({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0c-10-20 0-34 16-30 4 8 4 16 0 22 16-8 34-6 44 6-16 4-30 8-40 6-8 8-16 6-20-4z" {...line} fill={PAPER} />
      <path d="M2-24c-16-20-34-22-46-14 14 6 26 14 34 26M18-26c10-20 28-26 40-20-12 6-22 14-28 26" {...line} fill={PAPER} />
      <circle cx={6} cy={-22} r={1.8} fill={INK} />
    </g>
  );
}

export function Fish({ x, y, s = 1, flip = false, fill = SKY }: { x: number; y: number; s?: number; flip?: boolean; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-24 0c14-16 36-16 48 0-12 16-34 16-48 0zm48 0l14-12v24z" {...line} fill={fill} />
      <circle cx={-12} cy={-2} r={2} fill={INK} />
    </g>
  );
}

export function LilyPad({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={26} ry={8} fill={GREEN} stroke={INK} strokeWidth="1.6" />
      <path d={`M${x - 8} ${y - 4}c0-14 8-20 8-20s8 6 8 20c-4-4-12-4-16 0z`} fill={PINK} stroke={INK} strokeWidth="1.4" />
    </g>
  );
}

export function Butterfly({ x, y, s = 1, fill = SKY }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 0c-14-18-28-10-22 2-10 8 2 20 22 2 20 18 32 6 22-2 6-12-8-20-22-2z" {...line} strokeWidth={1.6 / s} fill={fill} />;
}

export function Tent({ x, y, s = 1, fill = PAPER }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 0L0-60 40 0zM0-60v-12M0-70l14 4-14 4" {...line} fill={fill} />
      <path d="M0 0l-10-30L0-60" {...line} strokeWidth="1.4" />
    </g>
  );
}

export function Boat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-110 0h220c-14 26-40 34-110 34S-96 26-110 0z" {...line} strokeWidth={2.4 / s} fill="#b07a3c" />;
}

export function Bench({ x, y, w = 260, fill = PINK }: { x: number; y: number; w?: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x - w / 2} ${y}h${w}v60h${-w}z`} {...line} fill={fill} />
      <path d={`M${x - w / 2} ${y + 20}c40 20 ${w - 80} 20 ${w} 0`} {...line} strokeWidth="1.4" />
    </g>
  );
}

export function Vine({ x, y, h = 200 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <path d={`M${x} ${y}c-14-${h / 4} 14-${h / 2} 0-${h * 0.75}s10-${h / 4} 0-${h / 4}`} {...line} stroke={GREEN} strokeWidth="4" />
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M${x + (i % 2 ? 4 : -4)} ${y - 30 - i * (h / 6)}c${i % 2 ? 10 : -10}-8 ${i % 2 ? 22 : -22}-6 ${i % 2 ? 24 : -24} 2-${10} 6-${18} 4-${24} -2z`} fill={GREEN} stroke={INK} strokeWidth="1.3" />
      ))}
    </g>
  );
}

export function Grapes({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[[0, 0], [-8, -10], [8, -10], [-14, -20], [0, -20], [14, -20]].map(([dx, dy], i) => (
        <circle key={i} cx={x + dx} cy={y + dy} r={6} fill={LILAC} stroke={INK} strokeWidth="1.2" />
      ))}
    </g>
  );
}

export function Arch({ x, y, w = 300, h = 420, fill = STONE }: { x: number; y: number; w?: number; h?: number; fill?: string }) {
  const hw = w / 2;
  return <path d={`M${x - hw} ${y}V${y - h + hw}A${hw} ${hw} 0 0 1 ${x + hw} ${y - h + hw}V${y}h-30V${y - h + hw}A${hw - 30} ${hw - 30} 0 0 0 ${x - hw + 30} ${y - h + hw}V${y}z`} {...line} fill={fill} />;
}

export function Bird2({ x, y, s = 1, fill = INK }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-16 0c6-10 12-10 16-2 4-8 10-8 16 2-6-4-10-2-16 4-6-6-10-8-16-4z" fill={fill} stroke={INK} strokeWidth="1.2" />;
}

