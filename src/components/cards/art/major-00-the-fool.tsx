import { CardSvg, COBALT, CREAM, Flower, INK, Limb, line, Mountains, PAPER, RAINBOW, RainbowFall, Rays, Sparkle, SUN } from "./kit";

export const FOOL_ALT =
  "The Fool: a cobalt-skinned traveller in a rainbow cloak steps toward a cliff edge, face lifted to a burst of golden rays, a staff with a small bundle over one shoulder and a white rose in the other hand, while a little dog leaps at their heels and distant mountains glow at sunrise.";

export function TheFool() {
  return (
    <CardSvg id="major-00-the-fool" label={FOOL_ALT} title="The Fool" numeral="0">
      <defs>
        {/* Rounded shoulders for the cloak */}
        <clipPath id="fool-cloak">
          <path d="M286 352C286 330 302 318 324 316H360C382 318 398 330 398 352L404 420 480 820H0V352z" />
        </clipPath>
      </defs>

      {/* Halo of rays behind the head */}
      <Rays cx={340} cy={262} r0={58} r1={200} count={64} broken />

      {/* Distance beyond the cliff: a low sun behind mountains */}
      <Rays cx={540} cy={778} r0={24} r1={50} count={13} from={-75} to={75} width={1.8} />
      <circle cx={540} cy={778} r={18} fill={SUN} />
      <Mountains x={488} y={826} w={100} h={58} />
      <path d="M478 690l9 6 9-6M506 708l7 5 7-5" {...line} strokeWidth="1.8" />

      {/* The cliff: a ledge that ends in a rocky drop */}
      <path d="M0 800H480l-8 18 12 22-10 26 6 40" {...line} />
      <path d="M462 830l-16 4M468 864l-20 2M40 822h34M250 828h44M380 840h26" {...line} strokeWidth="1.5" />

      {/* Wildflowers */}
      <Flower x={30} y={746} stem={54} angle={-6} />
      <Flower x={232} y={770} stem={30} angle={8} r={6} petals={5} />

      {/* Staff resting on the shoulder, bundle behind */}
      <path d="M190 228L330 330" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M166 210c-12 6-14 24-2 33 12 9 32 6 38-6 6-13-4-30-18-31-7 0-13 1-18 4z" {...line} fill={CREAM} />
      <path d="M182 210l-6-14m6 14 9-12" {...line} strokeWidth="1.8" />

      {/* Rainbow cloak, swept back by the wind */}
      <g clipPath="url(#fool-cloak)">
        <RainbowFall top={[286, 398]} topY={316} bottom={[150, 448]} bottomY={798} colors={RAINBOW.sunset} flare={0.45} lean={-20} />
      </g>
      <path d="M286 352C286 330 302 318 324 316H360C382 318 398 330 398 352" {...line} />

      {/* Front foot stepping out from under the hem, toward the edge */}
      <Limb d="M420 772C432 780 440 784 448 788" w={16} />
      <path d="M440 782c10-4 26-2 32 6 2 4-2 7-8 7h-26z" fill={COBALT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />

      {/* Arm bent to hold the staff */}
      <Limb d="M298 346C274 354 266 334 290 316" w={17} />
      <circle cx={292} cy={314} r={10} fill={COBALT} stroke={INK} strokeWidth="2" />

      {/* Arm reaching forward with a white rose */}
      <Limb d="M388 342C408 362 426 372 458 362" w={16} />
      <circle cx={462} cy={360} r={9.5} fill={COBALT} stroke={INK} strokeWidth="2" />
      <Flower x={480} y={312} stem={44} angle={16} petals={7} r={10} />

      {/* Neck and face in profile, lifted toward the light */}
      <path d="M330 280h24l4 38h-32z" fill={COBALT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M322 250C322 230 340 220 356 226 366 230 370 240 369 250L377 260 369 264C370 270 367 274 362 276 356 288 344 292 334 288 322 282 320 266 322 250z" fill={COBALT} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M350 252c3 2 7 2 10-1" {...line} stroke={PAPER} strokeWidth="1.8" />
      {/* Hair streaming back in the wind */}
      <path d="M360 228C348 212 320 214 312 232 306 246 310 262 316 272 304 268 292 262 282 250 290 252 298 252 302 248 292 244 284 236 280 226 290 232 300 234 308 230 316 216 344 210 360 228z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M296 240c8 2 14 0 20-4M290 252c8 0 14-2 20-6" {...line} strokeWidth="1.3" />

      {/* A little dog leaping up at the traveller */}
      <path
        d="M70 760C66 742 76 728 94 724 114 720 136 718 152 712 158 700 164 690 172 686L174 672 184 664 186 680C196 682 204 688 208 694L210 701C202 705 192 705 186 703 180 712 174 722 172 730 180 735 190 739 198 736L200 745C188 750 172 748 160 742 150 746 140 750 128 752 124 766 120 780 122 792L112 794C110 782 108 770 104 762 94 766 82 768 70 760z"
        {...line}
        fill={PAPER}
      />
      <path d="M72 750C56 744 50 728 58 716" {...line} />
      <circle cx={194} cy={690} r={2.4} fill={INK} />

      {/* Sparkles */}
      <Sparkle x={522} y={292} r={11} />
      <Sparkle x={536} y={408} r={7} />
      <Sparkle x={504} y={452} r={9} />
      <Sparkle x={136} y={330} r={7} color={COBALT} />
    </CardSvg>
  );
}
