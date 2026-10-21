import { CardSvg, COBALT, CREAM, INK, Limb, line, PAPER, RainbowFall, Rays, Sparkle, Star5, SUN } from "./kit";

export const HIGH_PRIESTESS_ALT =
  "The High Priestess: a cobalt-skinned priestess with long dark hair sits between a black pillar marked B and a pale pillar marked J, wearing a crown with a full moon between two crescents and holding a half-rolled scroll; a cobalt ray burst and a veil of pomegranates hang behind her, a crescent moon rests at her feet above rippling water, and small stars fill the night.";

function Pillar({ x, dark, letter }: { x: number; dark: boolean; letter: string }) {
  const fill = dark ? INK : CREAM;
  return (
    <g>
      <path d={`M${x - 34} 236h68l-8 18h-52z`} {...line} fill={fill} />
      <rect x={x - 26} y={254} width={52} height={526} fill={fill} stroke={INK} strokeWidth="2.4" />
      <path d={`M${x - 34} 800h68l-8-20h-52z`} {...line} fill={fill} />
      <path d={`M${x - 12} 300V740M${x + 12} 300V740`} stroke={dark ? CREAM : INK} strokeWidth="1.2" opacity="0.5" />
      <text x={x} y={296} textAnchor="middle" fontSize="30" fontFamily="var(--font-display), sans-serif" fontWeight="600" fill={dark ? CREAM : INK}>
        {letter}
      </text>
    </g>
  );
}

function Pomegranate({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill="#e8283c" stroke={INK} strokeWidth="1.6" />
      <path d={`M${x - 5} ${y - 10}l2-6 3 4 3-4 2 6`} {...line} strokeWidth="1.4" />
    </g>
  );
}

export function TheHighPriestess() {
  return (
    <CardSvg id="major-02-the-high-priestess" label={HIGH_PRIESTESS_ALT} title="The High Priestess" numeral="II">
      <defs>
        <clipPath id="priestess-robe">
          <path d="M252 386C252 364 268 352 288 350H312C332 352 348 364 348 386L440 790H160z" />
        </clipPath>
      </defs>

      {/* Night sky */}
      <Star5 x={92} y={150} r={9} />
      <Star5 x={512} y={128} r={7} />
      <Star5 x={540} y={184} r={5} />
      <Star5 x={64} y={208} r={5} />
      <Sparkle x={470} y={170} r={8} color={SUN} />

      {/* Veil of pomegranates between the pillars */}
      <path d="M150 330C230 316 370 316 450 330V700H150z" {...line} fill={CREAM} />
      {[[190, 380], [410, 380], [180, 470], [420, 470], [196, 560], [404, 560], [186, 650], [414, 650]].map(([x, y]) => (
        <Pomegranate key={`${x}-${y}`} x={x} y={y} />
      ))}
      <Rays cx={300} cy={316} r0={56} r1={150} count={44} color={COBALT} width={1.8} broken />

      <Pillar x={118} dark letter="B" />
      <Pillar x={482} dark={false} letter="J" />

      {/* Long hair falling behind the shoulders */}
      <path d="M278 290C268 330 258 380 248 430H352C342 380 332 330 322 290z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />

      {/* Robe falling to the floor */}
      <g clipPath="url(#priestess-robe)">
        <RainbowFall top={[252, 348]} topY={350} bottom={[166, 434]} bottomY={790} colors={["#1d3fd8", "#2f6ff0", "#7fb0ff", "#f7ecd4", "#fbf3e2", "#f7ecd4", "#7fb0ff", "#2f6ff0", "#1d3fd8"]} flare={0.55} />
      </g>
      <path d="M252 386C252 364 268 352 288 350H312C332 352 348 364 348 386" {...line} />
      {/* Cross at the breast */}
      <path d="M300 372v26M288 384h24" stroke={CREAM} strokeWidth="4" strokeLinecap="round" />

      {/* Hands holding a half-rolled scroll */}
      <Limb d="M260 380C250 420 258 450 282 470" w={15} />
      <Limb d="M340 380C350 420 342 450 318 468" w={15} />
      <path d="M270 462l60-12 6 30-60 12z" {...line} fill={PAPER} />
      <path d="M280 470l40-8M282 478l40-8" {...line} strokeWidth="1.2" />
      <ellipse cx={274} cy={478} rx={8} ry={16} transform="rotate(-12 274 478)" {...line} fill={CREAM} />
      <circle cx={284} cy={472} r={9} fill={COBALT} stroke={INK} strokeWidth="2" />
      <circle cx={318} cy={466} r={9} fill={COBALT} stroke={INK} strokeWidth="2" />

      {/* Head, hair and moon crown */}
      <path d="M290 320h20l2 32h-24z" fill={COBALT} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx={300} cy={302} rx={21} ry={26} fill={COBALT} stroke={INK} strokeWidth="2.2" />
      <path d="M291 302c3 2 6 2 8 0M302 302c3 2 6 2 8 0M300 308v7M296 320c3 2 6 2 8 0" {...line} stroke={PAPER} strokeWidth="1.5" />
      <path d="M279 300c-2-22 8-34 21-34s23 12 21 34c-4-12-12-18-21-18s-17 6-21 18z" fill={INK} />
      <circle cx={300} cy={254} r={13} fill={SUN} stroke={INK} strokeWidth="2" />
      <path d="M270 262a16 16 0 0 0 16-22 14 14 0 0 1-16 22zM330 262a16 16 0 0 1-16-22 14 14 0 0 0 16 22z" fill={SUN} stroke={INK} strokeWidth="1.8" />

      {/* Crescent moon at her feet, water below */}
      <path d="M232 780c30 28 106 28 136 0-30 14-106 14-136 0z" fill={SUN} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M60 820c20-8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0 40 8 60 0" stroke={COBALT} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M90 846c20-8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0" stroke={COBALT} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
    </CardSvg>
  );
}
