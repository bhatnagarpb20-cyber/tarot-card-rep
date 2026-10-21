import { CardSvg, COBALT, CREAM, Flower, INK, Limb, line, PAPER, RAINBOW, RainbowFall, Rays, Sparkle, SUN } from "./kit";

export const MAGICIAN_ALT =
  "The Magician: a cobalt-skinned figure in a rainbow robe stands behind a draped table, one hand raising a wand to a burst of golden rays and the other pointing to the ground, an infinity sign above their head; on the table lie a cup, a sword, a pentacle and a wand, with roses and lilies at either side.";

export function TheMagician() {
  return (
    <CardSvg id="major-01-the-magician" label={MAGICIAN_ALT} title="The Magician" numeral="I">
      <defs>
        <clipPath id="magician-robe">
          <path d="M244 336C244 314 260 302 282 300H318C340 302 356 314 356 336L470 800H130z" />
        </clipPath>
      </defs>

      <Rays cx={300} cy={250} r0={62} r1={215} count={72} broken />
      {/* Infinity above the head */}
      <path d="M300 178c-10-12-30-12-30 0s20 12 30 0 30-12 30 0-20 12-30 0z" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />

      {/* Raised wand */}
      <path d="M196 120V250" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M196 120V250" stroke={CREAM} strokeWidth="6" strokeLinecap="round" />
      <circle cx={196} cy={116} r={7} fill={SUN} stroke={INK} strokeWidth="2" />

      {/* Robe */}
      <g clipPath="url(#magician-robe)">
        <RainbowFall top={[244, 356]} topY={300} bottom={[150, 450]} bottomY={800} colors={RAINBOW.regal} flare={0.5} />
      </g>
      <path d="M244 336C244 314 260 302 282 300H318C340 302 356 314 356 336" {...line} />
      {/* Belt */}
      <path d="M262 420c24 8 52 8 76 0" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M262 420c24 8 52 8 76 0" stroke={SUN} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Arm raised to the sky */}
      <Limb d="M252 324C226 300 206 270 198 214" w={17} />
      <circle cx={197} cy={206} r={11} fill={COBALT} stroke={INK} strokeWidth="2" />

      {/* Arm pointing to the earth */}
      <Limb d="M350 326C380 358 398 400 408 462" w={17} />
      <path d="M402 458c6-2 14 0 16 8l-2 30-6 0-2-22c-4 2-8 0-8-4z" fill={COBALT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />

      {/* Neck and face */}
      <path d="M288 270h24l2 32h-28z" fill={COBALT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx={300} cy={250} rx={22} ry={27} fill={COBALT} stroke={INK} strokeWidth="2.2" />
      <path d="M290 250c3 2 6 2 8 0M302 250c3 2 6 2 8 0M300 256v8M295 270c3 2 7 2 10 0" {...line} stroke={PAPER} strokeWidth="1.6" />
      {/* Hair */}
      <path d="M278 252c-6-26 8-44 24-44s32 16 24 44c-2-14-8-24-18-28-6 8-18 12-30 12z" fill={INK} />
      <path d="M278 252c-2 16-2 28 4 36M326 252c2 16 2 28-4 36" {...line} strokeWidth="5" />

      {/* The table and its four tools */}
      <path d="M118 640H482" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M130 642V800M470 642V800" {...line} />
      <path d="M130 642H470V748c-16 10-34 10-50 0-16 10-34 10-50 0-16 10-34 10-50 0-16 10-34 10-50 0-16 10-34 10-50 0-16 10-34 10-50 0-16 10-34 10-50 0z" {...line} fill={CREAM} />
      <path d="M150 680h300M150 700h300" stroke={COBALT} strokeWidth="1.6" strokeDasharray="2 8" strokeLinecap="round" />
      {/* Cup */}
      <path d="M150 586h40c0 22-8 34-20 34s-20-12-20-34zM170 620v12M156 638h28" {...line} fill={SUN} />
      {/* Sword lying flat */}
      <path d="M214 630H322l14 -4-14-4H214z" {...line} fill={PAPER} />
      <path d="M210 616v28M196 626h14" {...line} strokeWidth="4" />
      {/* Pentacle */}
      <circle cx={392} cy={612} r={24} fill={SUN} stroke={INK} strokeWidth="2.2" />
      <path d="M392 594l5.3 16.4h17.2l-13.9 10.1 5.3 16.4-13.9-10.1-13.9 10.1 5.3-16.4-13.9-10.1h17.2z" fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Wand lying flat */}
      <path d="M432 630l50-10" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M432 630l50-10" stroke={CREAM} strokeWidth="4.5" strokeLinecap="round" />

      {/* Ground, roses and lilies */}
      <path d="M50 800H550" {...line} />
      <Flower x={88} y={720} stem={80} angle={-8} color="#e8283c" petals={8} />
      <Flower x={62} y={756} stem={44} angle={6} r={7} petals={6} />
      <Flower x={514} y={716} stem={84} angle={8} petals={6} />
      <Flower x={540} y={760} stem={40} angle={-6} color="#e8283c" r={7} petals={8} />

      <Sparkle x={120} y={210} r={10} />
      <Sparkle x={482} y={260} r={12} />
      <Sparkle x={452} y={360} r={7} color={COBALT} />
      <Sparkle x={150} y={380} r={7} />
    </CardSvg>
  );
}
