/** The suit of Wands: warm sunset robes, desert and sunlit country. */
import { CardSvg, COBALT, CREAM, Flower, INK, line, Mountains, PAPER, Rays, Sparkle, SUN } from "./kit";
import { Arm, Castle, Head, Horse, Person, Rider, Throne } from "./figures";
import { Wand } from "./suits";
import { Cat, GREEN, Ground, HandFromCloud, Hill, ORANGE, Pyramids, RED, SAND, Salamander, Ship, SKY, STONE, SUIT_COLORS } from "./minor-kit";

const C = SUIT_COLORS.wands;

function Leaf({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return <path transform={`rotate(${r} ${x} ${y})`} d={`M${x} ${y}c6-10 16-10 20-2-6 6-14 8-20 2z`} fill={GREEN} stroke={INK} strokeWidth="1.3" />;
}

export const ALT = {
  "wands-01-ace": "Ace of Wands: a cobalt hand reaches from a cloud holding a tall sprouting wand against a burst of golden rays, green leaves drifting down toward a castle on a distant hill.",
  "wands-02-two": "Two of Wands: a figure in a sunset robe stands on a castle battlement holding a small globe and one wand, while a second wand is fixed to the wall; the sea and hills stretch away and a rose and lily are carved on the stone.",
  "wands-03-three": "Three of Wands: a figure seen from behind stands on a high cliff beside three planted wands, holding one, watching ships sail across the sea below.",
  "wands-04-four": "Four of Wands: four wands hold up a canopy garland of flowers; two figures raise bouquets in celebration with a castle behind them.",
  "wands-05-five": "Five of Wands: five figures in different coloured robes brandish wands that cross in a lively tangle, sparring rather than fighting.",
  "wands-06-six": "Six of Wands: a laurel-crowned rider on a white horse carries a wand topped with a victory wreath while a crowd raises five more wands.",
  "wands-07-seven": "Seven of Wands: a figure on high ground, wearing mismatched shoes, holds one wand across their body to fend off six wands rising from below.",
  "wands-08-eight": "Eight of Wands: eight wands fly in parallel through an open sky above a river and green hills, with no figures in sight.",
  "wands-09-nine": "Nine of Wands: a figure with a bandaged head leans on a wand and glances warily aside, standing before a palisade of eight more wands.",
  "wands-10-ten": "Ten of Wands: a bent figure trudges toward a distant town carrying a heavy bundle of ten wands that hides their face.",
  "wands-11-page": "Page of Wands: a young figure in a feathered red cap and a tunic patterned with salamanders studies a tall wand in the desert, pyramids behind.",
  "wands-12-knight": "Knight of Wands: a knight in a salamander tunic raises a wand on a rearing white horse, pyramids rising from the desert behind.",
  "wands-13-queen": "Queen of Wands: a crowned queen sits on a throne carved with lions, holding a sunflower and an upright wand, a black cat sitting at her feet.",
  "wands-14-king": "King of Wands: a crowned king leans forward on a throne carved with lions, holding a flowering wand, a living salamander at his feet.",
} as const;

export function AceOfWands() {
  return (
    <CardSvg id="wands-01-ace" label={ALT["wands-01-ace"]} title="Ace of Wands">
      <Rays cx={300} cy={420} r0={80} r1={230} count={64} broken />
      <Hill x0={330} x1={600} y={800} h={140} />
      <Castle x={470} y={720} s={1} />
      <HandFromCloud cx={110} cy={470} hx={294} hy={500}>
        <Wand x1={286} y1={720} x2={304} y2={210} leaves={6} w={16} />
      </HandFromCloud>
      <Leaf x={380} y={540} r={20} />
      <Leaf x={420} y={610} r={-30} />
      <Leaf x={350} y={660} r={60} />
      <Ground />
    </CardSvg>
  );
}

export function TwoOfWands() {
  return (
    <CardSvg id="wands-02-two" label={ALT["wands-02-two"]} title="Two of Wands">
      <Rays cx={300} cy={360} r0={70} r1={200} count={52} broken />
      <Mountains x={360} y={560} w={200} h={90} />
      <path d="M40 600c40-8 80-8 120 0s80 8 120 0 80-8 120 0 80 8 120 0" stroke={COBALT} strokeWidth="2.2" fill="none" />
      <Wand x1={110} y1={800} x2={110} y2={300} leaves={3} />
      <Person
        id="w2"
        x={290}
        y={380}
        colors={C}
        bottom={700}
        hem={100}
        facing="right"
        crown="cap"
        arms={
          <>
            <Arm pts={[[256, 450], [300, 480], [366, 470]]} />
            <Arm pts={[[324, 450], [380, 470], [430, 470]]} />
          </>
        }
      />
      <Wand x1={440} y1={720} x2={444} y2={290} leaves={3} />
      <circle cx={386} cy={448} r={26} fill={SKY} stroke={INK} strokeWidth="2" />
      <path d="M370 440c8-8 20-6 22 4-6 6 2 14 10 10M380 462c6 0 10 4 8 8" {...line} stroke={GREEN} strokeWidth="3" />
      <path d="M40 640h520v160H40z" {...line} fill={STONE} />
      <path d="M40 640v-20h40v20M120 640v-20h40v20M200 640v-20h40v20M280 640v-20h40v20M360 640v-20h40v20M440 640v-20h40v20M520 640v-20h40v20" {...line} fill={STONE} />
      <path d="M40 700h520M40 760h520" {...line} strokeWidth="1.2" />
      <Flower x={280} y={710} stem={0} r={12} color={RED} petals={8} />
      <Flower x={320} y={710} stem={0} r={12} petals={6} />
    </CardSvg>
  );
}

export function ThreeOfWands() {
  return (
    <CardSvg id="wands-03-three" label={ALT["wands-03-three"]} title="Three of Wands">
      <Rays cx={300} cy={300} r0={60} r1={190} count={52} />
      <path d="M40 700c40-8 80-8 120 0s80 8 120 0 80-8 120 0 80 8 120 0M60 740c40-8 80-8 120 0s80 8 120 0 80-8 120 0 80 8 120 0" stroke={COBALT} strokeWidth="2" fill="none" />
      <Ship x={130} y={690} s={0.8} />
      <Ship x={470} y={700} s={0.7} />
      <Ship x={330} y={760} s={0.6} />
      <Mountains x={380} y={660} w={180} h={70} />
      <Wand x1={120} y1={640} x2={110} y2={250} leaves={3} />
      <Wand x1={200} y1={640} x2={206} y2={270} leaves={3} />
      <Person
        id="w3"
        x={330}
        y={340}
        colors={C}
        bottom={640}
        hem={100}
        hair="short"
        armsBehind={<Arm pts={[[370, 410], [400, 440], [420, 430]]} />}
      />
      {/* Back of the head: we see their hair, not their face */}
      <ellipse cx={330} cy={338} rx={22} ry={26} fill={INK} stroke={INK} strokeWidth="2" />
      <Wand x1={430} y1={640} x2={424} y2={240} leaves={3} />
      <path d="M40 640H480l12 30" {...line} />
    </CardSvg>
  );
}

export function FourOfWands() {
  return (
    <CardSvg id="wands-04-four" label={ALT["wands-04-four"]} title="Four of Wands">
      <Rays cx={300} cy={540} r0={80} r1={220} count={56} />
      <Castle x={300} y={640} s={1.6} />
      <Person id="w4a" x={250} y={520} s={0.7} colors={C} bottom={760} hem={60} hair="long" hairColor={SUN} arms={<Arm pts={[[228, 568], [208, 530], [200, 490]]} w={12} />} />
      <Person id="w4b" x={350} y={520} s={0.7} colors={[...C].reverse()} bottom={760} hem={60} hair="curly" arms={<Arm pts={[[372, 568], [392, 530], [400, 490]]} w={12} />} />
      <Flower x={200} y={476} stem={0} r={10} color={RED} petals={8} />
      <Flower x={400} y={476} stem={0} r={10} petals={8} color={SUN} />
      {[120, 230, 370, 480].map((wx) => (
        <Wand key={wx} x1={wx} y1={800} x2={wx} y2={360} leaves={2} />
      ))}
      <path d="M120 380c40 40 70 40 110 0M230 380c40 40 100 40 140 0M370 380c40 40 70 40 110 0" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
      {[[150, 400], [175, 408], [200, 400], [270, 402], [300, 410], [330, 402], [400, 400], [425, 408], [450, 400]].map(([fx, fy], i) => (
        <circle key={i} cx={fx} cy={fy} r={7} fill={[RED, SUN, PAPER][i % 3]} stroke={INK} strokeWidth="1.4" />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function FiveOfWands() {
  const figs: [number, number, string[]][] = [
    [90, 520, [RED, ORANGE, SUN]],
    [195, 480, [COBALT, SKY, CREAM]],
    [300, 530, [GREEN, SUN, CREAM]],
    [405, 480, [ORANGE, RED, "#c2184b"]],
    [510, 520, [SUN, CREAM, ORANGE]],
  ];
  return (
    <CardSvg id="wands-05-five" label={ALT["wands-05-five"]} title="Five of Wands">
      <Rays cx={300} cy={330} r0={40} r1={180} count={48} />
      {figs.map(([fx, fy, cols], i) => (
        <Person key={i} id={`w5-${i}`} x={fx} y={fy} s={0.6} colors={cols} bottom={800} hem={50} facing={i < 2 ? "right" : i > 2 ? "left" : "front"} hair={(["short", "curly", "long", "bun", "short"] as const)[i]} />
      ))}
      <Wand x1={70} y1={640} x2={330} y2={270} leaves={2} />
      <Wand x1={530} y1={640} x2={270} y2={270} leaves={2} />
      <Wand x1={180} y1={620} x2={440} y2={300} leaves={2} />
      <Wand x1={420} y1={620} x2={160} y2={300} leaves={2} />
      <Wand x1={300} y1={660} x2={300} y2={250} leaves={2} />
      <Ground />
    </CardSvg>
  );
}

export function SixOfWands() {
  return (
    <CardSvg id="wands-06-six" label={ALT["wands-06-six"]} title="Six of Wands">
      <Rays cx={260} cy={300} r0={60} r1={200} count={56} />
      <Horse x={110} y={800} s={1} />
      <Wand x1={300} y1={560} x2={312} y2={210} leaves={2} />
      <circle cx={314} cy={214} r={26} fill="none" stroke={GREEN} strokeWidth="7" strokeDasharray="6 4" />
      <Rider
        id="w6"
        x={240}
        y={420}
        colors={C}
        crown="laurel"
        arms={<Arm pts={[[270, 470], [296, 500], [302, 470]]} />}
      />
      {[400, 450, 500, 545, 70].map((wx, i) => (
        <Wand key={wx} x1={wx} y1={860} x2={wx + (i % 2 ? 6 : -6)} y2={520 + (i % 3) * 20} leaves={2} />
      ))}
      {[420, 480, 530].map((hx) => (
        <Head key={hx} x={hx} y={770} s={0.7} hair="short" />
      ))}
    </CardSvg>
  );
}

export function SevenOfWands() {
  return (
    <CardSvg id="wands-07-seven" label={ALT["wands-07-seven"]} title="Seven of Wands">
      <Rays cx={380} cy={330} r0={60} r1={190} count={52} />
      <path d="M40 820C200 760 300 640 560 600V840H40z" {...line} fill={PAPER} />
      {[[60, 300], [110, 330], [160, 360], [210, 390], [260, 420], [310, 450]].map(([bx, tx], i) => (
        <Wand key={i} x1={bx} y1={850} x2={tx - 20} y2={640 + i * 6} leaves={1} />
      ))}
      <Person
        id="w7"
        x={420}
        y={360}
        colors={C}
        bottom={610}
        hem={70}
        facing="left"
        hair="curly"
        arms={
          <>
            <Arm pts={[[384, 430], [360, 470], [340, 470]]} />
            <Arm pts={[[452, 430], [470, 480], [440, 500]]} />
          </>
        }
      />
      <path d="M384 612h34l-4-12h-28zM430 612h34l-4-12h-28z" fill={PAPER} stroke={INK} strokeWidth="2" />
      <path d="M430 612h34l-4-12h-28z" fill={INK} />
      <Wand x1={300} y1={520} x2={500} y2={420} leaves={2} />
    </CardSvg>
  );
}

export function EightOfWands() {
  return (
    <CardSvg id="wands-08-eight" label={ALT["wands-08-eight"]} title="Eight of Wands">
      <circle cx={480} cy={200} r={30} fill={SUN} stroke={INK} strokeWidth="2" />
      <Rays cx={480} cy={200} r0={36} r1={80} count={24} />
      <Hill x0={40} x1={360} y={800} h={160} fill="#bfe3c4" />
      <Hill x0={260} x1={560} y={800} h={110} />
      <path d="M200 800c40-30 120-50 220-60" fill="none" stroke={COBALT} strokeWidth="3" />
      <path d="M440 700h40v-30l-20-14-20 14z" {...line} fill={PAPER} />
      {Array.from({ length: 8 }, (_, i) => {
        const x1 = 70 + i * 34;
        const y1 = 240 + i * 34;
        return <Wand key={i} x1={x1} y1={y1} x2={x1 + 300} y2={y1 + 170} leaves={2} />;
      })}
      <Ground />
    </CardSvg>
  );
}

export function NineOfWands() {
  return (
    <CardSvg id="wands-09-nine" label={ALT["wands-09-nine"]} title="Nine of Wands">
      <Rays cx={260} cy={360} r0={60} r1={170} count={44} />
      {[70, 135, 200, 330, 400, 460, 515, 560].map((wx) => (
        <Wand key={wx} x1={wx} y1={800} x2={wx} y2={400} leaves={1} />
      ))}
      <Person
        id="w9"
        x={260}
        y={380}
        colors={C}
        bottom={800}
        hem={110}
        facing="right"
        eyes="open"
        arms={
          <>
            <Arm pts={[[226, 450], [250, 500], [298, 520]]} />
            <Arm pts={[[294, 450], [320, 480], [318, 520]]} />
          </>
        }
      />
      <path d="M238 362c14-10 36-10 50 4" stroke={INK} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M238 362c14-10 36-10 50 4" stroke={PAPER} strokeWidth="7" strokeLinecap="round" fill="none" />
      <Wand x1={318} y1={800} x2={316} y2={380} leaves={2} w={11} />
      <Ground />
    </CardSvg>
  );
}

export function TenOfWands() {
  return (
    <CardSvg id="wands-10-ten" label={ALT["wands-10-ten"]} title="Ten of Wands">
      <Rays cx={480} cy={560} r0={30} r1={100} count={30} from={-80} to={80} />
      <Castle x={480} y={640} s={0.9} />
      <path d="M380 640H600" {...line} />
      <g transform="rotate(10 220 800)">
        <Person id="w10" x={220} y={420} colors={C} bottom={800} hem={100} facing="right" hair="short" arms={<Arm pts={[[256, 490], [290, 520], [320, 500]]} />} />
      </g>
      {Array.from({ length: 10 }, (_, i) => (
        <Wand key={i} x1={250 + i * 8} y1={760} x2={300 + i * 22} y2={240 + Math.abs(i - 4.5) * 10} leaves={1} w={8} />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function PageOfWands() {
  return (
    <CardSvg id="wands-11-page" label={ALT["wands-11-page"]} title="Page of Wands">
      <Rays cx={300} cy={320} r0={60} r1={200} count={56} />
      <path d="M40 700h520v100H40z" fill={SAND} />
      <Pyramids x={110} y={700} s={1} />
      <Pyramids x={500} y={700} s={0.8} />
      <Person
        id="w11"
        x={270}
        y={360}
        colors={[ORANGE, SUN, ORANGE, RED, ORANGE]}
        bottom={800}
        hem={100}
        facing="right"
        crown="cap"
        arms={
          <>
            <Arm pts={[[236, 430], [280, 470], [356, 470]]} />
            <Arm pts={[[304, 430], [340, 440], [362, 420]]} />
          </>
        }
      />
      <Salamander x={250} y={580} s={0.7} />
      <Salamander x={300} y={680} s={0.7} flip />
      <Wand x1={370} y1={800} x2={378} y2={220} leaves={3} />
      <Ground />
    </CardSvg>
  );
}

export function KnightOfWands() {
  return (
    <CardSvg id="wands-12-knight" label={ALT["wands-12-knight"]} title="Knight of Wands">
      <Rays cx={330} cy={300} r0={60} r1={200} count={56} />
      <path d="M40 720h520v80H40z" fill={SAND} />
      <Pyramids x={110} y={720} s={0.9} />
      <Pyramids x={500} y={720} s={0.8} />
      <Horse x={110} y={800} s={1} />
      <Rider
        id="w12"
        x={240}
        y={420}
        colors={[ORANGE, SUN, ORANGE, RED]}
        crown="helmet"
        arms={<Arm pts={[[270, 470], [310, 430], [330, 380]]} />}
      />
      <Salamander x={242} y={530} s={0.5} />
      <Wand x1={326} y1={470} x2={360} y2={210} leaves={3} />
      <Ground />
    </CardSvg>
  );
}

export function QueenOfWands() {
  return (
    <CardSvg id="wands-13-queen" label={ALT["wands-13-queen"]} title="Queen of Wands">
      <Rays cx={300} cy={330} r0={70} r1={220} count={60} />
      <Throne x={300} top={290} ground={790} w={220} color={SAND} carving="lion" />
      <Person
        id="w13"
        x={300}
        y={330}
        colors={C}
        bottom={790}
        hem={150}
        crown="gold"
        hair="long"
        hairColor="#c99a2c"
        arms={
          <>
            <Arm pts={[[256, 400], [226, 450], [220, 480]]} />
            <Arm pts={[[344, 400], [372, 450], [378, 500]]} />
          </>
        }
      />
      <Flower x={212} y={444} stem={40} r={18} petals={12} color={SUN} />
      <Wand x1={380} y1={790} x2={386} y2={280} leaves={2} />
      <Cat x={300} y={800} s={1.1} />
      <Ground />
    </CardSvg>
  );
}

export function KingOfWands() {
  return (
    <CardSvg id="wands-14-king" label={ALT["wands-14-king"]} title="King of Wands">
      <Rays cx={300} cy={330} r0={70} r1={220} count={60} />
      <Throne x={300} top={290} ground={790} w={220} color={SAND} carving="lion" />
      <Salamander x={190} y={340} s={0.6} />
      <Salamander x={410} y={340} s={0.6} flip />
      <Person
        id="w14"
        x={306}
        y={334}
        colors={[ORANGE, RED, SUN, ORANGE, RED]}
        bottom={790}
        hem={150}
        lean={10}
        crown="gold"
        hair="short"
        arms={
          <>
            <Arm pts={[[262, 404], [240, 460], [262, 500]]} />
            <Arm pts={[[350, 404], [380, 450], [392, 480]]} />
          </>
        }
      />
      <Wand x1={396} y1={760} x2={400} y2={250} leaves={5} />
      <Salamander x={430} y={790} s={0.9} flip />
      <Ground />
      <Sparkle x={110} y={200} r={9} />
    </CardSvg>
  );
}
