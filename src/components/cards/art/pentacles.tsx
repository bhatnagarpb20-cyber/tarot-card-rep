/** The suit of Pentacles: earthy greens and golds, gardens, workshops and estates. */
import { CardSvg, COBALT, CREAM, Flower, INK, line, Mountains, PAPER, Rays, Sparkle, SUN } from "./kit";
import { Arm, Canine, Castle, Horse, Person, Rider, Throne, Tree, Water } from "./figures";
import { Pentacle } from "./suits";
import { Arch, Grapes, GREEN, Ground, HandFromCloud, Hill, ORANGE, PINK, RED, Ship, SKY, Snow, StainedGlass, STONE, SUIT_COLORS, Vine } from "./minor-kit";

const C = SUIT_COLORS.pentacles;
const BROWN = "#b07a3c";

function Field({ x0, x1, y, rows = 4 }: { x0: number; x1: number; y: number; rows?: number }) {
  return (
    <g>
      <path d={`M${x0} ${y}h${x1 - x0}v${rows * 14}h${x0 - x1}z`} fill="#e6c38a" stroke={INK} strokeWidth="1.8" />
      {Array.from({ length: rows - 1 }, (_, i) => (
        <path key={i} d={`M${x0} ${y + (i + 1) * 14}h${x1 - x0}`} stroke={BROWN} strokeWidth="1.6" />
      ))}
    </g>
  );
}

function Rabbit({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 24} ${y}c-4-20 10-32 28-30 6-14 14-20 16-12-2 6-6 10-8 14 10 6 12 18 8 28z`} {...line} fill={PAPER} />
      <path d={`M${x + 12} ${y - 30}l-4-24 8 4 2 20`} {...line} fill={PAPER} />
      <circle cx={x + 12} cy={y - 22} r={2} fill={INK} />
    </g>
  );
}

export const ALT = {
  "pentacles-01-ace": "Ace of Pentacles: a cobalt hand from a cloud offers a large golden pentacle above a garden of white lilies, where a hedge archway opens onto distant mountains.",
  "pentacles-02-two": "Two of Pentacles: a dancing figure juggles two pentacles linked by a green infinity ribbon, while ships ride rolling waves behind.",
  "pentacles-03-three": "Three of Pentacles: a stonemason works on a bench inside a cathedral arch carved with three pentacles, while a hooded monk and a patron holding plans look on.",
  "pentacles-04-four": "Four of Pentacles: a crowned figure sits clutching a pentacle to the chest, with a pentacle on the crown and one under each foot, a city behind.",
  "pentacles-05-five": "Five of Pentacles: two figures, one on crutches with a bandaged leg, struggle through falling snow past a glowing stained-glass window marked with five pentacles.",
  "pentacles-06-six": "Six of Pentacles: a merchant holding balanced scales drops coins into the hands of two kneeling figures beneath six floating pentacles.",
  "pentacles-07-seven": "Seven of Pentacles: a farmer leans on a hoe in an open field, thoughtfully gazing at seven pentacles growing on a leafy vine.",
  "pentacles-08-eight": "Eight of Pentacles: a craftsman at a workbench carves a pentacle with hammer and chisel, finished pentacles displayed on a post beside him and a town in the distance.",
  "pentacles-09-nine": "Nine of Pentacles: an elegant woman stands in a vineyard heavy with grapes and pentacles, a hooded falcon on her gloved hand, a manor behind and a snail at her feet.",
  "pentacles-10-ten": "Ten of Pentacles: under an estate archway an elder sits with two dogs while a couple and child stand together, ten pentacles arranged in the pattern of the Tree of Life over the scene.",
  "pentacles-11-page": "Page of Pentacles: a young figure in a green meadow gazes at a pentacle held up in both hands, a ploughed field and a grove of trees behind.",
  "pentacles-12-knight": "Knight of Pentacles: a knight with oak sprigs on the helmet sits on a still black horse, holding a pentacle carefully above ploughed fields.",
  "pentacles-13-queen": "Queen of Pentacles: a crowned queen cradles a pentacle in her lap on a throne carved with goat heads, beneath a bower of roses, a rabbit at her feet.",
  "pentacles-14-king": "King of Pentacles: a crowned king in a robe of grapevines sits on a throne carved with bulls, holding a pentacle and a sceptre, an armoured foot showing and a castle behind.",
} as const;

export function AceOfPentacles() {
  return (
    <CardSvg id="pentacles-01-ace" label={ALT["pentacles-01-ace"]} title="Ace of Pentacles">
      <Rays cx={300} cy={380} r0={90} r1={210} count={60} broken />
      <Mountains x={240} y={700} w={140} h={80} />
      <path d="M220 800V680a80 80 0 0 1 160 0V800h-30V690a50 50 0 0 0-100 0V800z" {...line} fill={GREEN} />
      {[70, 110, 150, 450, 490, 530].map((fx, i) => (
        <Flower key={fx} x={fx} y={720 + (i % 2) * 20} stem={70} petals={6} r={11} />
      ))}
      <HandFromCloud cx={100} cy={420} hx={286} hy={452}>
        <Pentacle x={300} y={380} r={80} />
      </HandFromCloud>
      <Ground />
    </CardSvg>
  );
}

export function TwoOfPentacles() {
  return (
    <CardSvg id="pentacles-02-two" label={ALT["pentacles-02-two"]} title="Two of Pentacles">
      <path d="M40 560c60-60 120-60 180 0s120 60 180 0 120-60 160 0" fill="none" stroke={COBALT} strokeWidth="3" />
      <Ship x={130} y={540} s={0.9} />
      <Ship x={460} y={560} s={0.8} />
      <Water y={600} rows={2} />
      <g transform="rotate(-6 300 800)">
        <Person
          id="p2"
          x={300}
          y={400}
          colors={C}
          bottom={800}
          hem={100}
          crown="cap"
          arms={
            <>
              <Arm pts={[[256, 470], [230, 470], [214, 450]]} />
              <Arm pts={[[344, 470], [380, 520], [390, 560]]} />
            </>
          }
        />
      </g>
      <path d="M210 430c40-60 160 180 190 120 30-60-150 -120-190-120z" transform="rotate(4 300 500)" fill="none" stroke={GREEN} strokeWidth="6" strokeLinecap="round" />
      <Pentacle x={208} y={428} r={30} />
      <Pentacle x={392} y={572} r={30} />
      <Ground />
    </CardSvg>
  );
}

export function ThreeOfPentacles() {
  return (
    <CardSvg id="pentacles-03-three" label={ALT["pentacles-03-three"]} title="Three of Pentacles">
      <Arch x={300} y={800} w={440} h={700} />
      <Pentacle x={300} y={180} r={24} />
      <Pentacle x={250} y={230} r={22} />
      <Pentacle x={350} y={230} r={22} />
      <path d="M260 560h120v40H260z" {...line} fill={BROWN} />
      <Person id="p3m" x={320} y={420} s={0.75} colors={[ORANGE, SUN, CREAM]} bottom={560} hem={56} facing="left" crown="cap" arms={<Arm pts={[[300, 470], [270, 470], [250, 450]]} w={12} />} />
      <Person id="p3a" x={160} y={540} s={0.85} colors={["#7c7f8c", "#a5a8b5", "#7c7f8c"]} bottom={800} hem={70} facing="right" hair="hood" />
      <Person id="p3b" x={420} y={540} s={0.85} colors={[RED, SUN, "#c2184b"]} bottom={800} hem={70} facing="left" hair="short" arms={<Arm pts={[[392, 600], [360, 620], [330, 610]]} w={13} />} />
      <path d="M300 590l40 10 6 30-40-10z" {...line} fill={PAPER} />
      <path d="M306 602l30 8M306 612l28 8" {...line} strokeWidth="1" />
      <Ground />
    </CardSvg>
  );
}

export function FourOfPentacles() {
  return (
    <CardSvg id="pentacles-04-four" label={ALT["pentacles-04-four"]} title="Four of Pentacles">
      <Castle x={110} y={560} s={1.4} />
      <Castle x={490} y={560} s={1.2} />
      <path d="M40 560H560" {...line} />
      <path d="M200 700h200v100H200z" {...line} fill={STONE} />
      <Person
        id="p4"
        x={300}
        y={360}
        colors={[RED, "#c2184b", COBALT, "#c2184b", RED]}
        bottom={720}
        hem={110}
        crown="gold"
        eyes="open"
        over={<Pentacle x={300} y={470} r={36} />}
        arms={
          <>
            <Arm pts={[[256, 430], [262, 480], [282, 494]]} hand={false} />
            <Arm pts={[[344, 430], [338, 480], [318, 494]]} hand={false} />
          </>
        }
      />
      <Pentacle x={300} y={290} r={22} />
      <Pentacle x={250} y={736} r={26} />
      <Pentacle x={350} y={736} r={26} />
      <Ground />
    </CardSvg>
  );
}

export function FiveOfPentacles() {
  return (
    <CardSvg id="pentacles-05-five" label={ALT["pentacles-05-five"]} title="Five of Pentacles">
      <rect x={30} y={100} width={540} height={700} rx={16} fill={INK} opacity="0.85" />
      <StainedGlass x={430} y={170} w={160} h={300}>
        {[[400, 300], [460, 300], [430, 350], [400, 400], [460, 400]].map(([px, py], i) => (
          <Pentacle key={i} x={px} y={py} r={18} />
        ))}
      </StainedGlass>
      <Snow x0={50} x1={560} y0={120} y1={780} />
      <path d="M30 760c100-20 440-20 540 0v40H30z" fill={PAPER} stroke={INK} strokeWidth="2" />
      <Person id="p5a" x={180} y={520} s={0.9} colors={["#7c7f8c", "#a5a8b5", "#5a5d6a"]} bottom={790} hem={70} facing="right" hair="hood" eyes="down" />
      <path d="M150 600l-20 190M210 600l10 190" stroke={BROWN} strokeWidth="6" strokeLinecap="round" />
      <path d="M176 780h30" stroke={PAPER} strokeWidth="10" strokeLinecap="round" />
      <Person id="p5b" x={300} y={540} s={0.85} colors={[SKY, COBALT, "#7c7f8c"]} bottom={790} hem={66} facing="right" hair="hood" eyes="down" />
    </CardSvg>
  );
}

export function SixOfPentacles() {
  return (
    <CardSvg id="pentacles-06-six" label={ALT["pentacles-06-six"]} title="Six of Pentacles">
      {Array.from({ length: 6 }, (_, i) => {
        const a = Math.PI + (Math.PI * (i + 0.5)) / 6;
        return <Pentacle key={i} x={300 + Math.cos(a) * 200} y={300 + Math.sin(a) * 110} r={22} />;
      })}
      <Person
        id="p6"
        x={300}
        y={360}
        colors={[RED, "#c2184b", SUN, "#c2184b", RED]}
        bottom={800}
        hem={110}
        hair="short"
        arms={
          <>
            <Arm pts={[[256, 430], [226, 450], [214, 420]]} />
            <Arm pts={[[344, 430], [380, 480], [394, 540]]} />
          </>
        }
      />
      <path d="M214 410v-50M184 366h60M184 366l-10 24M184 366l10 24M244 366l-10 24M244 366l10 24" {...line} strokeWidth="2" />
      <path d="M164 390h40a20 8 0 0 1-40 0zM224 390h40a20 8 0 0 1-40 0z" {...line} fill={SUN} />
      {[[400, 580], [404, 610]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={7} fill={SUN} stroke={INK} strokeWidth="1.4" />
      ))}
      <Person id="p6a" x={470} y={640} s={0.6} colors={[STONE, "#7c7f8c"]} bottom={800} hem={50} facing="left" hair="hood" arms={<Arm pts={[[454, 676], [430, 650], [418, 640]]} w={11} />} />
      <Person id="p6b" x={110} y={650} s={0.6} colors={[BROWN, "#7c7f8c"]} bottom={800} hem={50} facing="right" hair="short" />
      <Ground />
    </CardSvg>
  );
}

export function SevenOfPentacles() {
  return (
    <CardSvg id="pentacles-07-seven" label={ALT["pentacles-07-seven"]} title="Seven of Pentacles">
      <Hill x0={40} x1={560} y={800} h={60} fill="#bfe3c4" />
      <Vine x={420} y={800} h={420} />
      {[[400, 420], [450, 470], [390, 520], [450, 580], [400, 640], [460, 690], [410, 740]].map(([px, py], i) => (
        <Pentacle key={i} x={px} y={py} r={24} />
      ))}
      <Person id="p7" x={200} y={400} colors={C} bottom={800} hem={100} facing="right" hair="short" eyes="down" arms={<Arm pts={[[236, 470], [270, 500], [290, 480]]} />} />
      <path d="M296 360L280 800M262 790h40" stroke={BROWN} strokeWidth="7" strokeLinecap="round" />
      <Ground />
    </CardSvg>
  );
}

export function EightOfPentacles() {
  return (
    <CardSvg id="pentacles-08-eight" label={ALT["pentacles-08-eight"]} title="Eight of Pentacles">
      <Castle x={480} y={600} s={0.8} />
      <path d="M380 600H600" {...line} />
      <path d="M110 800V260" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M110 800V260" stroke={BROWN} strokeWidth="9" strokeLinecap="round" />
      {[300, 370, 440, 510, 580, 650].map((py) => (
        <Pentacle key={py} x={110} y={py} r={26} />
      ))}
      <path d="M250 640h220v30H250zM270 670v130M450 670v130" {...line} fill={BROWN} />
      <Pentacle x={360} y={620} r={26} />
      <Person
        id="p8"
        x={330}
        y={420}
        colors={[COBALT, C[3], C[2]]}
        bottom={640}
        hem={80}
        hair="short"
        eyes="down"
        arms={
          <>
            <Arm pts={[[296, 490], [310, 560], [344, 600]]} />
            <Arm pts={[[364, 490], [400, 540], [392, 590]]} />
          </>
        }
      />
      <path d="M380 590l20-30M394 556h16" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <Pentacle x={200} y={790} r={22} />
      <Ground />
    </CardSvg>
  );
}

export function NineOfPentacles() {
  return (
    <CardSvg id="pentacles-09-nine" label={ALT["pentacles-09-nine"]} title="Nine of Pentacles">
      <path d="M440 520h110v-70l-55-40-55 40z" {...line} fill={PAPER} />
      <path d="M470 520v-30h20v30" {...line} />
      <Vine x={90} y={800} h={480} />
      <Vine x={520} y={800} h={260} />
      {[[80, 380], [110, 450], [70, 520], [110, 590], [80, 660], [500, 600], [540, 660], [500, 720], [130, 730]].map(([px, py], i) => (
        <Pentacle key={i} x={px} y={py} r={20} />
      ))}
      {[[130, 420], [60, 560], [540, 590]].map(([gx, gy], i) => (
        <Grapes key={i} x={gx} y={gy} />
      ))}
      <Person
        id="p9"
        x={300}
        y={360}
        colors={[SUN, "#c99a2c", GREEN, SUN, "#c99a2c"]}
        bottom={800}
        hem={110}
        facing="right"
        hair="long"
        hairColor={RED}
        crown="gold"
        arms={<Arm pts={[[336, 430], [370, 400], [380, 350]]} />}
      />
      <path d="M368 330c0-20 24-26 30-10l14 4-14 6c-2 12-26 14-30 0z" {...line} fill={BROWN} />
      <path d="M372 316c6-6 16-6 22 0" stroke={RED} strokeWidth="5" />
      <path d="M210 800c0-14 20-20 26-8 4-10 18-6 16 6z" {...line} fill={SUN} />
      <Ground />
    </CardSvg>
  );
}

export function TenOfPentacles() {
  const tree: [number, number][] = [[300, 170], [220, 230], [380, 230], [300, 290], [220, 350], [380, 350], [300, 410], [220, 470], [380, 470], [300, 540]];
  return (
    <CardSvg id="pentacles-10-ten" label={ALT["pentacles-10-ten"]} title="Ten of Pentacles">
      <Arch x={300} y={800} w={460} h={680} fill={STONE} />
      <Castle x={300} y={700} s={1.2} />
      <Person id="p10e" x={130} y={560} s={0.85} colors={[RED, SUN, COBALT, RED]} bottom={800} hem={80} facing="right" hair="short" hairColor={CREAM} />
      <Canine x={90} y={800} s={0.5} />
      <Canine x={200} y={800} s={0.5} color={STONE} />
      <Person id="p10a" x={340} y={560} s={0.8} colors={[COBALT, SKY, CREAM]} bottom={800} hem={66} facing="right" hair="short" />
      <Person id="p10b" x={430} y={560} s={0.8} colors={[RED, PINK, ORANGE]} bottom={800} hem={66} facing="left" hair="long" />
      <Person id="p10c" x={385} y={680} s={0.45} colors={[SUN, CREAM]} bottom={800} hem={36} hair="curly" hairColor={SUN} />
      {tree.map(([px, py], i) => (
        <Pentacle key={i} x={px} y={py} r={22} />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function PageOfPentacles() {
  return (
    <CardSvg id="pentacles-11-page" label={ALT["pentacles-11-page"]} title="Page of Pentacles">
      <Tree x={480} y={640} s={0.8} />
      <Tree x={540} y={660} s={0.6} />
      <Field x0={40} x1={300} y={600} rows={3} />
      <path d="M40 650c160-30 360-30 520 0V800H40z" fill="#bfe3c4" stroke={INK} strokeWidth="2" />
      <Person
        id="p11"
        x={260}
        y={380}
        colors={C}
        bottom={800}
        hem={100}
        facing="right"
        crown="cap"
        eyes="open"
        arms={
          <>
            <Arm pts={[[226, 450], [270, 430], [330, 380]]} />
            <Arm pts={[[294, 450], [330, 430], [348, 400]]} />
          </>
        }
      />
      <Pentacle x={350} y={360} r={34} />
      {[90, 150, 450].map((fx) => (
        <Flower key={fx} x={fx} y={740} stem={40} r={7} petals={5} color={SUN} />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function KnightOfPentacles() {
  return (
    <CardSvg id="pentacles-12-knight" label={ALT["pentacles-12-knight"]} title="Knight of Pentacles">
      <Field x0={40} x1={560} y={620} rows={5} />
      <Horse x={110} y={800} s={1} color={INK} mane={PAPER} />
      <Rider id="p12" x={240} y={420} colors={C} crown="helmet" arms={<Arm pts={[[270, 470], [300, 480], [320, 470]]} />} />
      <path d="M236 386c-6-12-2-22 8-24M252 384c4-12 14-16 22-12" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
      <Pentacle x={330} y={450} r={28} />
      <Ground />
    </CardSvg>
  );
}

export function QueenOfPentacles() {
  return (
    <CardSvg id="pentacles-13-queen" label={ALT["pentacles-13-queen"]} title="Queen of Pentacles">
      <path d="M90 800V330C90 180 510 180 510 330V800" fill="none" stroke={GREEN} strokeWidth="10" />
      {Array.from({ length: 14 }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / 13;
        return <Flower key={i} x={300 + Math.cos(a) * 210} y={330 + Math.sin(a) * 140} stem={0} r={10} petals={8} color={i % 2 ? RED : PINK} />;
      })}
      <Throne x={300} top={320} ground={790} w={210} color={STONE} carving="ram" />
      <Person
        id="p13"
        x={300}
        y={360}
        colors={[GREEN, RED, SUN, RED, GREEN]}
        bottom={790}
        hem={140}
        crown="gold"
        hair="long"
        eyes="down"
        arms={
          <>
            <Arm pts={[[256, 430], [254, 500], [278, 530]]} />
            <Arm pts={[[344, 430], [346, 500], [322, 530]]} />
          </>
        }
      />
      <Pentacle x={300} y={540} r={34} />
      <Rabbit x={500} y={790} />
      <Ground />
    </CardSvg>
  );
}

export function KingOfPentacles() {
  return (
    <CardSvg id="pentacles-14-king" label={ALT["pentacles-14-king"]} title="King of Pentacles">
      <Castle x={300} y={330} s={1.6} />
      <Throne x={300} top={330} ground={790} w={220} color={STONE} carving="bull" />
      <path d="M318 790h40l-4-20h-32z" {...line} fill={STONE} />
      <Person
        id="p14"
        x={300}
        y={370}
        colors={[INK, "#0f6b49", INK, "#0f6b49", INK]}
        bottom={776}
        hem={140}
        crown="gold"
        hair="short"
        over={
          <g>
            {[[270, 520], [330, 580], [260, 640], [340, 700], [300, 470]].map(([gx, gy], i) => (
              <Grapes key={i} x={gx} y={gy} />
            ))}
          </g>
        }
        arms={
          <>
            <Arm pts={[[256, 440], [230, 490], [244, 520]]} />
            <Arm pts={[[344, 440], [372, 480], [380, 510]]} />
          </>
        }
      />
      <Pentacle x={244} y={540} r={30} />
      <path d="M380 530V370" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M380 530V370" stroke={SUN} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx={380} cy={362} r={9} fill={SUN} stroke={INK} strokeWidth="2" />
      <Ground />
      <Sparkle x={110} y={200} r={9} />
    </CardSvg>
  );
}

