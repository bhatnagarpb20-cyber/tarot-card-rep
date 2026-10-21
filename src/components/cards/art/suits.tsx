/** The four suit objects, drawn to match the deck's line style. */
import { COBALT, CREAM, INK, line, PAPER, SUN } from "./kit";

/** A living wand: a cream staff with small green leaves sprouting from it. */
export function Wand({ x1, y1, x2, y2, leaves = 3, w = 9 }: { x1: number; y1: number; x2: number; y2: number; leaves?: number; w?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return (
    <g>
      <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={INK} strokeWidth={w + 4} strokeLinecap="round" />
      <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={CREAM} strokeWidth={w} strokeLinecap="round" />
      {Array.from({ length: leaves }, (_, i) => {
        const t = 0.25 + (0.6 * i) / Math.max(1, leaves - 1);
        const side = i % 2 ? 1 : -1;
        const bx = x1 + dx * t + nx * side * (w / 2);
        const by = y1 + dy * t + ny * side * (w / 2);
        const tx = bx + nx * side * 16 + (dx / len) * 8;
        const ty = by + ny * side * 16 + (dy / len) * 8;
        return <path key={i} d={`M${bx} ${by}Q${(bx + tx) / 2 + (dx / len) * 8} ${(by + ty) / 2 + (dy / len) * 8} ${tx} ${ty}Q${(bx + tx) / 2 - (dx / len) * 4} ${(by + ty) / 2 - (dy / len) * 4} ${bx} ${by}z`} fill="#1e9a6a" stroke={INK} strokeWidth="1.4" />;
      })}
    </g>
  );
}

/** A goblet; (x, y) is the centre of its foot. */
export function Cup({ x, y, s = 1, fill = SUN, overflow = false, flowers = false, tipped = 0 }: { x: number; y: number; s?: number; fill?: string; overflow?: boolean; flowers?: boolean; tipped?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tipped}) scale(${s})`}>
      {overflow && <path d="M-14-62c-6 20-10 40-16 60M0-62v62M14-62c6 20 10 40 16 60" stroke={COBALT} strokeWidth={2.4 / s} fill="none" strokeLinecap="round" />}
      <path d="M-22-62h44c0 26-10 38-22 38s-22-12-22-38zM0-24v16M-14 0h28l-4-8h-20z" {...line} strokeWidth={2.2 / s} fill={fill} />
      <path d="M-18-54h36" {...line} strokeWidth={1.4 / s} />
      {flowers && (
        <g>
          {[-10, 2, 13].map((fx, i) => (
            <circle key={i} cx={fx} cy={-68 - (i % 2) * 6} r={6} fill={i === 1 ? "#ee3e86" : PAPER} stroke={INK} strokeWidth={1.4 / s} />
          ))}
        </g>
      )}
    </g>
  );
}

/** A sword; (x, y) is the hilt, `angle` 0 points the blade straight up. */
export function Sword({ x, y, angle = 0, len = 220, s = 1, crown = false }: { x: number; y: number; angle?: number; len?: number; s?: number; crown?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <path d={`M-7 -8L-7 ${-len}L0 ${-len - 18}L7 ${-len}L7 -8z`} {...line} strokeWidth={2 / s} fill={PAPER} />
      <path d={`M0 -14V${-len + 6}`} {...line} strokeWidth={1.2 / s} />
      <path d="M-28-8h56" stroke={INK} strokeWidth={9 / s} strokeLinecap="round" />
      <path d="M-28-8h56" stroke={SUN} strokeWidth={5 / s} strokeLinecap="round" />
      <path d="M0-6V28" stroke={INK} strokeWidth={10 / s} strokeLinecap="round" />
      <path d="M0-6V28" stroke={COBALT} strokeWidth={6 / s} strokeLinecap="round" />
      <circle cx={0} cy={34} r={6} fill={SUN} stroke={INK} strokeWidth={1.8 / s} />
      {crown && <path d={`M-20 ${-len - 22}l-4-22 10 10 14-16 14 16 10-10-4 22z`} fill={SUN} stroke={INK} strokeWidth={2 / s} strokeLinejoin="round" />}
    </g>
  );
}

/** A golden coin engraved with a five-pointed star. */
export function Pentacle({ x, y, r = 24 }: { x: number; y: number; r?: number }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    return `${(x + Math.cos(a) * r * 0.72).toFixed(1)} ${(y + Math.sin(a) * r * 0.72).toFixed(1)}`;
  });
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={SUN} stroke={INK} strokeWidth="2.2" />
      <circle cx={x} cy={y} r={r * 0.82} fill="none" stroke={INK} strokeWidth="1.2" />
      <path d={`M${pts.join("L")}z`} fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    </g>
  );
}
