/** The suit of Swords: cool greys, sky blue and lilac; wind, cloud and stone. */
import { CardSvg, COBALT, CREAM, INK, line, PAPER, Rays, Sparkle, SUN } from "./kit";
import { Arm, Castle, Cloud, Crescent, Horse, Person, Rider, Throne, Water } from "./figures";
import { Sword } from "./suits";
import { Bird2, Boat, Butterfly, GREEN, Ground, HandFromCloud, Heart, Hill, LILAC, PINK, Rain, RED, SKY, STONE, StainedGlass, SUIT_COLORS, Tent } from "./minor-kit";

const C = SUIT_COLORS.swords;

function Blindfold({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - 22 * s} ${y - 2 * s}h${44 * s}v${9 * s}h${-44 * s}z`} fill={PAPER} stroke={INK} strokeWidth="1.8" />;
}

function Cypress({ x, y, h = 220 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <path d={`M${x} ${y}v-20`} {...line} />
      <path d={`M${x} ${y - h}c-26 40-26 ${h - 60} 0 ${h - 20}c26-40 26-${h - 60} 0-${h - 20}z`} fill={GREEN} stroke={INK} strokeWidth="2" />
    </g>
  );
}

function BentTree({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y}c10-60 40-100 80-130`} {...line} strokeWidth="4" />
      <path d={`M${x + 50} ${y - 150}c20-20 60-20 80 0-10 20-50 30-80 0z`} fill={GREEN} stroke={INK} strokeWidth="1.8" />
    </g>
  );
}

export const ALT = {
  "swords-01-ace": "Ace of Swords: a cobalt hand reaches from a cloud gripping an upright sword whose tip passes through a golden crown hung with olive and palm, above jagged mountains.",
  "swords-02-two": "Two of Swords: a blindfolded figure sits on a stone bench with arms crossed over the heart, balancing two swords, the sea and rocks behind under a crescent moon.",
  "swords-03-three": "Three of Swords: a red heart pierced by three swords hangs beneath storm clouds and falling rain, with no figures.",
  "swords-04-four": "Four of Swords: the effigy of a knight lies at rest on a tomb with hands joined in prayer, three swords hanging on the wall above and one lying beside, a stained-glass window glowing.",
  "swords-05-five": "Five of Swords: a smirking figure gathers three swords while two swords lie on the ground and two defeated figures walk away under a torn, windy sky.",
  "swords-06-six": "Six of Swords: a ferryman poles a boat carrying a cloaked woman and child, six swords standing upright in the bow; the water is rough behind them and calm ahead.",
  "swords-07-seven": "Seven of Swords: a figure tiptoes away from a camp of tents carrying five swords and glancing back over their shoulder at the two left planted in the ground.",
  "swords-08-eight": "Eight of Swords: a blindfolded figure with loose bindings stands on marshy ground surrounded by eight upright swords, a castle on the distant cliff.",
  "swords-09-nine": "Nine of Swords: in a dark room a figure sits up in bed with face in hands beneath nine swords on the wall, a quilt of roses across their lap.",
  "swords-10-ten": "Ten of Swords: a figure lies face down pierced by ten swords under a dark sky, while a golden dawn breaks over calm water on the horizon.",
  "swords-11-page": "Page of Swords: an alert young figure stands on a windswept hill holding a sword upright with both hands while birds scatter across a cloudy sky.",
  "swords-12-knight": "Knight of Swords: a knight charges at full gallop on a white horse with sword raised forward, past wind-bent trees, butterflies and birds on the harness and in the sky.",
  "swords-13-queen": "Queen of Swords: a crowned queen sits on a stone throne carved with butterflies, holding a sword upright and extending her other hand, a single bird flying above the clouds.",
  "swords-14-king": "King of Swords: a crowned king sits facing forward on a throne carved with butterflies and crescent moons, holding an upright sword, with cypress trees and birds behind him.",
} as const;

export function AceOfSwords() {
  return (
    <CardSvg id="swords-01-ace" label={ALT["swords-01-ace"]} title="Ace of Swords">
      <Rays cx={300} cy={300} r0={60} r1={220} count={60} broken />
      <path d="M40 800L120 690 170 730 250 640 330 720 400 650 480 730 560 680V800z" {...line} fill={STONE} />
      <HandFromCloud cx={100} cy={500} hx={296} hy={560}>
        <Sword x={300} y={580} len={330} crown />
      </HandFromCloud>
      <path d="M282 210c-30 20-40 50-34 80M318 210c30 20 40 50 34 80" fill="none" stroke={GREEN} strokeWidth="3" />
      {[[256, 250], [252, 274], [344, 250], [348, 274]].map(([lx, ly], i) => (
        <path key={i} d={`M${lx} ${ly}c${i < 2 ? -10 : 10}-6 ${i < 2 ? -18 : 18}-2 ${i < 2 ? -20 : 20} 6-8 2-16 0-20-6z`} fill={GREEN} stroke={INK} strokeWidth="1.2" />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function TwoOfSwords() {
  return (
    <CardSvg id="swords-02-two" label={ALT["swords-02-two"]} title="Two of Swords">
      <Crescent x={470} y={150} r={30} />
      <Water y={560} rows={3} gap={22} />
      <path d="M60 560l30-40 30 40zM460 560l20-30 30 30z" {...line} fill={STONE} />
      <path d="M190 680h220v120H190z" {...line} fill={STONE} />
      <Person
        id="s2"
        x={300}
        y={430}
        colors={C}
        bottom={720}
        hem={110}
        hair="long"
        over={
          <g>
            <Arm pts={[[256, 500], [300, 540], [338, 520]]} />
            <Arm pts={[[344, 500], [300, 548], [262, 520]]} />
          </g>
        }
      />
      <Blindfold x={300} y={428} />
      <Sword x={338} y={520} angle={38} len={250} />
      <Sword x={262} y={520} angle={-38} len={250} />
      <Ground />
    </CardSvg>
  );
}

export function ThreeOfSwords() {
  return (
    <CardSvg id="swords-03-three" label={ALT["swords-03-three"]} title="Three of Swords">
      <Rain x0={60} x1={560} y0={260} y1={820} />
      <Cloud x={160} y={200} s={1.5} fill={STONE} />
      <Cloud x={420} y={180} s={1.6} fill={STONE} />
      <Heart x={300} y={500} s={2.4} />
      <Sword x={300} y={230} angle={180} len={340} />
      <Sword x={190} y={280} angle={150} len={320} />
      <Sword x={410} y={280} angle={-150} len={320} />
    </CardSvg>
  );
}

export function FourOfSwords() {
  return (
    <CardSvg id="swords-04-four" label={ALT["swords-04-four"]} title="Four of Swords">
      <StainedGlass x={110} y={160} w={130} h={240} />
      {[260, 360, 460].map((sx) => (
        <Sword key={sx} x={sx} y={170} angle={180} len={260} s={0.9} />
      ))}
      <path d="M60 640h480v160H60z" {...line} fill={STONE} />
      <path d="M60 680h480" {...line} strokeWidth="1.4" />
      <g transform="rotate(-90 300 600)">
        <Person id="s4" x={300} y={360} colors={[STONE, "#a5a8b5", PAPER, "#a5a8b5", STONE]} bottom={600} hem={70} shoulder={46} hair="short" />
      </g>
      <path d="M270 600l12-26 12 26" stroke={INK} strokeWidth="10" strokeLinecap="round" fill="none" />
      <Sword x={120} y={740} angle={90} len={300} s={0.9} />
    </CardSvg>
  );
}

export function FiveOfSwords() {
  return (
    <CardSvg id="swords-05-five" label={ALT["swords-05-five"]} title="Five of Swords">
      <path d="M40 220c60-40 120 10 180-20s120-40 160 0 120 20 180-10" {...line} fill="none" />
      <path d="M60 300c80-30 160 20 240-10s140-10 220 10" {...line} fill="none" />
      <Water y={620} x0={300} x1={560} rows={2} />
      <Person id="s5b" x={410} y={540} s={0.5} colors={[SKY, COBALT]} bottom={660} hem={34} hair="short" />
      <Person id="s5c" x={480} y={560} s={0.45} colors={[PINK, LILAC]} bottom={670} hem={30} hair="long" />
      <Person
        id="s5"
        x={220}
        y={390}
        colors={[RED, "#c2184b", SUN, RED]}
        bottom={800}
        hem={100}
        facing="right"
        eyes="open"
        arms={<Arm pts={[[256, 460], [290, 500], [300, 520]]} />}
      />
      <Sword x={182} y={500} angle={-20} len={200} s={0.9} />
      <Sword x={200} y={510} angle={-6} len={210} s={0.9} />
      <Sword x={300} y={530} angle={170} len={220} s={0.9} />
      <Sword x={380} y={790} angle={100} len={150} s={0.8} />
      <Sword x={430} y={800} angle={80} len={130} s={0.8} />
      <Ground />
    </CardSvg>
  );
}

export function SixOfSwords() {
  return (
    <CardSvg id="swords-06-six" label={ALT["swords-06-six"]} title="Six of Swords">
      <Hill x0={40} x1={300} y={560} h={80} fill="#bfe3c4" />
      <path d="M40 600h220" stroke={COBALT} strokeWidth="2" />
      <path d="M40 640h200" stroke={COBALT} strokeWidth="2" opacity="0.7" />
      <Water y={620} x0={300} x1={580} rows={5} gap={26} />
      {[200, 230, 260, 290, 320, 350].map((sx) => (
        <Sword key={sx} x={sx} y={700} len={190} s={0.8} />
      ))}
      <Person id="s6w" x={290} y={600} s={0.7} colors={[STONE, "#7c7f8c", STONE]} bottom={720} hem={60} hair="hood" facing="left" />
      <Person id="s6c" x={230} y={640} s={0.45} colors={[SUN, CREAM]} bottom={720} hem={30} hair="curly" />
      <Person id="s6f" x={420} y={500} s={0.8} colors={[RED, "#c2184b", SUN]} bottom={720} hem={56} facing="left" hair="short" arms={<Arm pts={[[400, 556], [380, 590], [372, 620]]} w={13} />} />
      <path d="M372 400L330 800" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <Boat x={300} y={720} s={1.2} />
      <Water y={790} x0={40} x1={560} rows={2} />
    </CardSvg>
  );
}

export function SevenOfSwords() {
  return (
    <CardSvg id="swords-07-seven" label={ALT["swords-07-seven"]} title="Seven of Swords">
      <Tent x={110} y={600} s={1.4} fill={SKY} />
      <Tent x={210} y={600} s={1.1} fill={PINK} />
      <Tent x={500} y={600} s={1.2} fill={SUN} />
      <path d="M40 600H560" {...line} />
      <Sword x={110} y={650} angle={180} len={170} s={0.9} />
      <Sword x={160} y={650} angle={180} len={170} s={0.9} />
      <g transform="rotate(10 330 800)">
        <Person id="s7" x={330} y={420} colors={[RED, SUN, "#c2184b", SUN]} bottom={800} hem={90} facing="left" crown="cap" eyes="open" arms={<Arm pts={[[364, 490], [380, 540], [360, 560]]} />} />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <Sword key={i} x={360 + i * 6} y={570} angle={40 + i * 6} len={190} s={0.8} />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function EightOfSwords() {
  return (
    <CardSvg id="swords-08-eight" label={ALT["swords-08-eight"]} title="Eight of Swords">
      <path d="M380 520l60-60 120 20V560H380z" {...line} fill={STONE} />
      <Castle x={480} y={470} s={0.8} />
      {[70, 120, 170, 220, 380, 430, 480, 530].map((sx, i) => (
        <Sword key={sx} x={sx} y={800 - (300 - (i % 4) * 30) * 0.9} angle={180} len={300 - (i % 4) * 30} s={0.9} />
      ))}
      <Person id="s8" x={300} y={430} colors={[RED, "#c2184b", RED]} bottom={800} hem={90} hair="long" />
      <Blindfold x={300} y={428} />
      {[520, 580, 640, 700].map((ry) => (
        <path key={ry} d={`M240 ${ry}c40 10 80 10 120 0`} stroke={INK} strokeWidth="4" fill="none" />
      ))}
      {[[100, 820], [260, 826], [470, 824]].map(([px, py], i) => (
        <ellipse key={i} cx={px} cy={py} rx={40} ry={8} fill={SKY} stroke={COBALT} strokeWidth="1.6" />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function NineOfSwords() {
  return (
    <CardSvg id="swords-09-nine" label={ALT["swords-09-nine"]} title="Nine of Swords">
      <rect x={30} y={100} width={540} height={760} rx={16} fill={INK} />
      {Array.from({ length: 9 }, (_, i) => (
        <Sword key={i} x={90} y={160 + i * 38} angle={90} len={380} s={0.9} />
      ))}
      <path d="M60 800V640h480v160" {...line} stroke={CREAM} fill="#b07a3c" />
      <Person
        id="s9"
        x={300}
        y={560}
        colors={[PAPER, CREAM, PAPER]}
        bottom={720}
        hem={70}
        hair="long"
        arms={
          <>
            <Arm pts={[[260, 630], [254, 590], [286, 562]]} w={14} />
            <Arm pts={[[340, 630], [346, 590], [314, 562]]} w={14} />
          </>
        }
      />
      <path d="M80 690h440v90H80z" fill={COBALT} stroke={CREAM} strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={84 + (i % 6) * 73} y={694 + Math.floor(i / 6) * 43} width={70} height={40} fill={i % 2 ? RED : COBALT} stroke={CREAM} strokeWidth="1" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={120 + i * 73} cy={735} r={8} fill={PINK} stroke={CREAM} strokeWidth="1.2" />
      ))}
    </CardSvg>
  );
}

export function TenOfSwords() {
  return (
    <CardSvg id="swords-10-ten" label={ALT["swords-10-ten"]} title="Ten of Swords">
      <rect x={30} y={100} width={540} height={520} rx={16} fill={INK} />
      <path d="M30 560h540v60H30z" fill={SUN} />
      <Rays cx={300} cy={620} r0={30} r1={120} count={30} from={-80} to={80} color={SUN} />
      <Water y={660} rows={2} />
      <path d="M100 800c60-30 340-30 420-10l-20 20H100z" {...line} fill={RED} />
      <g transform="rotate(-90 300 760)">
        <Person id="s10" x={300} y={560} s={0.8} colors={[STONE, "#7c7f8c"]} bottom={760} hem={50} hair="short" facing="front" />
      </g>
      {Array.from({ length: 10 }, (_, i) => (
        <Sword key={i} x={170 + i * 30} y={500 + (i % 2) * 10} angle={180} len={310} s={0.8} />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function PageOfSwords() {
  return (
    <CardSvg id="swords-11-page" label={ALT["swords-11-page"]} title="Page of Swords">
      <Cloud x={130} y={230} s={1.3} />
      <Cloud x={470} y={280} s={1.1} />
      {[[400, 170], [440, 200], [480, 160], [360, 220], [520, 220]].map(([bx, by], i) => (
        <Bird2 key={i} x={bx} y={by} s={0.9} />
      ))}
      <Hill x0={40} x1={560} y={800} h={150} />
      <Person id="s11" x={300} y={400} colors={C} bottom={720} hem={90} lean={-14} hair="short" eyes="open" arms={<Arm pts={[[260, 470], [276, 530], [300, 560]]} />} />
      <Sword x={300} y={580} len={340} />
      <path d="M240 420c-20 0-40-6-60-16M240 440c-16 4-34 4-52-2" {...line} strokeWidth="1.8" />
    </CardSvg>
  );
}

export function KnightOfSwords() {
  return (
    <CardSvg id="swords-12-knight" label={ALT["swords-12-knight"]} title="Knight of Swords">
      <BentTree x={460} y={800} />
      <BentTree x={520} y={790} />
      <Cloud x={140} y={200} s={1.2} />
      <Bird2 x={420} y={200} />
      <Bird2 x={470} y={230} s={0.8} />
      <Butterfly x={170} y={600} s={0.9} />
      <Horse x={110} y={800} s={1} />
      <Rider id="s12" x={240} y={420} colors={C} crown="helmet" arms={<Arm pts={[[270, 470], [320, 440], [360, 400]]} />} />
      <Sword x={360} y={400} angle={50} len={230} />
      <Ground />
    </CardSvg>
  );
}

export function QueenOfSwords() {
  return (
    <CardSvg id="swords-13-queen" label={ALT["swords-13-queen"]} title="Queen of Swords">
      <Cloud x={140} y={640} s={1.3} />
      <Cloud x={470} y={660} s={1.1} />
      <Bird2 x={470} y={170} s={1.2} />
      <Throne x={300} top={300} ground={790} w={220} color={STONE} carving="butterfly" />
      <Person
        id="s13"
        x={300}
        y={340}
        colors={C}
        bottom={790}
        hem={140}
        crown="gold"
        hair="long"
        hairColor={CREAM}
        arms={
          <>
            <Arm pts={[[256, 410], [236, 460], [244, 500]]} />
            <Arm pts={[[344, 410], [384, 420], [420, 400]]} />
          </>
        }
      />
      <Sword x={244} y={510} len={320} />
      <Butterfly x={300} y={290} s={0.8} fill={LILAC} />
      <Ground />
    </CardSvg>
  );
}

export function KingOfSwords() {
  return (
    <CardSvg id="swords-14-king" label={ALT["swords-14-king"]} title="King of Swords">
      <Cypress x={90} y={800} h={340} />
      <Cypress x={510} y={800} h={300} />
      <Bird2 x={430} y={170} />
      <Bird2 x={470} y={200} s={0.8} />
      <Throne x={300} top={300} ground={790} w={220} color={STONE} carving="butterfly" />
      <Crescent x={260} y={290} r={14} rot={-90} />
      <Crescent x={340} y={290} r={14} rot={-90} />
      <Person
        id="s14"
        x={300}
        y={340}
        colors={[COBALT, SKY, LILAC, SKY, COBALT]}
        bottom={790}
        hem={140}
        crown="gold"
        hair="short"
        eyes="open"
        arms={
          <>
            <Arm pts={[[344, 410], [370, 450], [370, 500]]} />
            <Arm pts={[[256, 410], [240, 460], [262, 500]]} />
          </>
        }
      />
      <Sword x={370} y={510} len={320} />
      <Ground />
      <Sparkle x={300} y={180} r={9} />
    </CardSvg>
  );
}

