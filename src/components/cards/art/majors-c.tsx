/** Major Arcana XVI–XXI. */
import { CardSvg, COBALT, CREAM, Flower, INK, line, Mountains, PAPER, RAINBOW, Rays, Sparkle, SUN } from "./kit";
import { Arm, Canine, Cloud, FourCreatures, Horse, Person, Rider, Star8, Tree, Wing } from "./figures";
import { Wand } from "./suits";

const STONE = "#c9ccd6";
const RED = "#e8283c";
const GREEN = "#1e9a6a";
const ORANGE = "#f28a2e";

function Drop({ x, y, r = 7, fill = SUN }: { x: number; y: number; r?: number; fill?: string }) {
  return <path d={`M${x} ${y - r * 1.6}c${r * 0.6} ${r} ${r} ${r * 1.4} ${r} ${r * 1.9}a${r} ${r} 0 0 1-${r * 2} 0c0-${r * 0.5} ${r * 0.4}-${r * 0.9} ${r}-${r * 1.9}z`} fill={fill} stroke={INK} strokeWidth="1.6" />;
}

export const TOWER_ALT =
  "The Tower: lightning strikes a tall grey tower on a rocky crag, blowing its golden crown from the top; flames burst from the windows, two figures fall headlong through the air, and golden drops of fire rain down through a stormy sky.";

export function TheTower() {
  return (
    <CardSvg id="major-16-the-tower" label={TOWER_ALT} title="The Tower" numeral="XVI">
      <rect width={600} height={1000} fill={INK} opacity="0.07" />
      <Cloud x={130} y={150} s={1.2} fill={STONE} />
      <path d="M150 170l40 60-20 6 50 84-6-62 22-4-36-84z" fill={SUN} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M0 800L90 700 150 720 220 660H380L440 700 520 690 600 760V800z" {...line} fill={STONE} />
      <path d="M230 660V340h140v320" {...line} fill={PAPER} />
      <path d="M220 340h160v-30h-20v14h-20v-14h-20v14h-20v-14h-20v14h-20v-14h-20v14h-20v-14h-20z" {...line} fill={PAPER} />
      {[[270, 420], [330, 500], [270, 580]].map(([wx, wy], i) => (
        <g key={i}>
          <path d={`M${wx - 12} ${wy + 24}v-24a12 12 0 0 1 24 0v24z`} {...line} fill={INK} />
          <path d={`M${wx} ${wy - 4}c10 6 16 16 12 26-6-4-10-4-12 0-2-4-6-4-12 0-4-10 2-20 12-26z`} fill={ORANGE} stroke={INK} strokeWidth="1.4" />
        </g>
      ))}
      <path d="M300 310c20-30 50-40 60-80 10 30 30 40 20 80" fill={ORANGE} stroke={INK} strokeWidth="2" />
      <path d="M396 258l-4-22 12 8 12-16 14 12 12-6-4 22z" transform="rotate(28 420 250)" fill={SUN} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <g transform="rotate(150 140 470)">
        <Person id="fall-l" x={140} y={470} s={0.6} colors={[RED, SUN, COBALT]} bottom={600} hem={46} hair="short" crown="gold" />
      </g>
      <g transform="rotate(-160 470 520)">
        <Person id="fall-r" x={470} y={520} s={0.6} colors={[COBALT, "#7fb0ff", CREAM]} bottom={650} hem={46} hair="long" />
      </g>
      {[[90, 300], [180, 360], [420, 400], [510, 300], [120, 620], [480, 640], [400, 230], [60, 480]].map(([dx, dy], i) => (
        <Drop key={i} x={dx} y={dy} r={6} />
      ))}
    </CardSvg>
  );
}

export const STAR_ALT =
  "The Star: under a great golden eight-pointed star and seven smaller stars, a kneeling figure in a pale rainbow robe pours water from two jugs, one into a still pool and one onto the land in five streams; an ibis perches in a tree on a hill behind.";

export function TheStar() {
  return (
    <CardSvg id="major-17-the-star" label={STAR_ALT} title="The Star" numeral="XVII">
      <Rays cx={300} cy={210} r0={70} r1={150} count={48} width={1.6} />
      <Star8 x={300} y={210} r={66} />
      {[[110, 140], [490, 140], [80, 260], [520, 260], [150, 360], [450, 360], [300, 360]].map(([sx, sy], i) => (
        <Star8 key={i} x={sx} y={sy} r={18} fill={i % 2 ? CREAM : SUN} />
      ))}
      <Mountains x={40} y={600} w={200} h={120} />
      <Tree x={110} y={560} s={0.6} />
      <path d="M96 470c-8-10-4-22 6-24l14-2-10 6c4 6 2 14-4 18zM100 470v14" {...line} fill={PAPER} strokeWidth="1.8" />
      <path d="M300 800c60-40 200-40 260-10v10z" fill="#7fb0ff" opacity="0.6" />
      <path d="M300 792c40-12 80-12 120 0s60 12 140 0" stroke={COBALT} strokeWidth="2.2" fill="none" />
      <Person
        id="star"
        x={270}
        y={470}
        colors={["#fbf3e2", "#7fb0ff", "#f7ecd4", "#f47ca8", "#fbf3e2"]}
        bottom={790}
        hem={110}
        lean={-10}
        facing="right"
        hair="long"
        hairColor={SUN}
        arms={
          <>
            <Arm pts={[[232, 540], [200, 600], [176, 640]]} />
            <Arm pts={[[306, 540], [350, 600], [380, 650]]} />
          </>
        }
      />
      {/* Jugs and streams */}
      <path d="M160 630h28l4 30-18 10-18-10z" {...line} fill={RED} />
      <path d="M368 640h28l4 30-18 10-18-10z" {...line} fill={RED} />
      {[-16, -8, 0, 8, 16].map((d) => (
        <path key={d} d={`M172 672c${d} 40 ${d * 2} 80 ${d * 3} 120`} fill="none" stroke={COBALT} strokeWidth="2" strokeLinecap="round" />
      ))}
      <path d="M384 680c10 40 20 80 30 110" fill="none" stroke={COBALT} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M40 800H300" {...line} />
    </CardSvg>
  );
}

export const MOON_ALT =
  "The Moon: a large golden moon with a sleeping face in its crescent sheds rays and falling drops over a path that winds between two towers; a pale dog and a grey wolf howl up at it, and a crayfish crawls out of a blue pool in the foreground.";

export function TheMoon() {
  return (
    <CardSvg id="major-18-the-moon" label={MOON_ALT} title="The Moon" numeral="XVIII">
      <rect width={600} height={1000} fill={COBALT} opacity="0.07" />
      <Rays cx={300} cy={220} r0={80} r1={190} count={56} broken />
      <circle cx={300} cy={220} r={74} fill={SUN} stroke={INK} strokeWidth="2.2" />
      <path d="M326 156a72 72 0 1 0 0 128 58 58 0 1 1 0-128z" fill={CREAM} stroke={INK} strokeWidth="2" />
      <path d="M284 210c4 3 9 3 12 0M282 246c6 4 12 4 16 0M296 222l6 10-6 2" {...line} strokeWidth="1.8" />
      {[[220, 330], [260, 360], [300, 340], [340, 360], [380, 330]].map(([dx, dy], i) => (
        <path key={i} d={`M${dx} ${dy}c4 6 6 10 6 14a6 6 0 0 1-12 0c0-4 2-8 6-14z`} fill={SUN} stroke={INK} strokeWidth="1.4" />
      ))}
      {/* Towers */}
      {[90, 510].map((tx) => (
        <g key={tx}>
          <path d={`M${tx - 30} 640V440h60v200`} {...line} fill={STONE} />
          <path d={`M${tx - 36} 440h72v-20h-12v10h-12v-10h-12v10h-12v-10h-12v10h-12z`} {...line} fill={STONE} />
          <path d={`M${tx - 8} 500v-16a8 8 0 0 1 16 0v16z`} {...line} fill={INK} />
        </g>
      ))}
      <Mountains x={200} y={560} w={200} h={110} />
      <path d="M300 560c-30 60 40 100 0 160s-40 60 0 80" fill="none" stroke={INK} strokeWidth="1.8" strokeDasharray="6 8" />
      <Canine x={190} y={760} />
      <Canine x={410} y={760} flip color={STONE} />
      <path d="M40 760H560" {...line} />
      <path d="M60 800c80-30 400-30 480 0" fill="#7fb0ff" stroke={COBALT} strokeWidth="2" />
      {/* Crayfish */}
      <g transform="translate(300 800)">
        <path d="M-14 0c-2-20 4-36 14-40 10 4 16 20 14 40z" {...line} fill={ORANGE} />
        <path d="M-10-34c-14-10-20-22-14-30M10-34c14-10 20-22 14-30" {...line} strokeWidth="2" />
        <path d="M-26-64c-8-4-10-12-4-16 4 4 8 6 12 4zM26-64c8-4 10-12 4-16-4 4-8 6-12 4z" {...line} fill={ORANGE} strokeWidth="1.6" />
      </g>
    </CardSvg>
  );
}

export const SUN_ALT =
  "The Sun: a radiant golden sun with a smiling face shines over a garden wall lined with sunflowers, while a joyful child crowned with flowers rides a white horse, holding a flowing red banner.";

export function TheSun() {
  return (
    <CardSvg id="major-19-the-sun" label={SUN_ALT} title="The Sun" numeral="XIX">
      <Rays cx={300} cy={230} r0={90} r1={210} count={64} width={2.4} />
      <circle cx={300} cy={230} r={86} fill={SUN} stroke={INK} strokeWidth="2.4" />
      <path d="M268 222c6 5 14 5 20 0M312 222c6 5 14 5 20 0M300 230v18M282 262c10 10 26 10 36 0" {...line} strokeWidth="2.2" />
      <circle cx={268} cy={248} r={8} fill="#f47ca8" />
      <circle cx={332} cy={248} r={8} fill="#f47ca8" />
      {/* Garden wall with sunflowers */}
      {[70, 140, 210, 390, 460, 530].map((fx, i) => (
        <Flower key={fx} x={fx} y={520 + (i % 2) * 20} stem={110} r={20} petals={12} color={SUN} />
      ))}
      <path d="M30 600h540v80H30z" {...line} fill="#f9b27a" />
      {Array.from({ length: 3 }, (_, r) => (
        <path key={r} d={`M30 ${626 + r * 26}h540`} {...line} strokeWidth="1.4" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${60 + i * 45 + ((i % 2) * 22)} 600v26M${60 + i * 45} 626v26M${82 + i * 45} 652v28`} {...line} strokeWidth="1.2" />
      ))}
      <Horse x={130} y={800} s={1} />
      {/* Red banner */}
      <path d="M192 470L170 320" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M170 324c40-10 90 0 130 30-40 0-60 30-110 40z" {...line} fill={RED} />
      <Rider
        id="sun-child"
        x={220}
        y={520}
        s={0.75}
        colors={[CREAM, "#fbf3e2"]}
        hair="curly"
        hairColor={SUN}
        crown="laurel"
        facing="right"
        arms={
          <>
            <Arm pts={[[194, 570], [180, 520], [188, 470]]} w={13} />
            <Arm pts={[[246, 570], [280, 560], [310, 540]]} w={13} />
          </>
        }
      />
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const JUDGEMENT_ALT =
  "Judgement: an angel with rainbow wings bursts from the clouds blowing a golden trumpet hung with a white banner bearing a red cross; below, three cobalt figures rise with open arms from coffins floating on the water, with snowy mountains behind.";

export function Judgement() {
  return (
    <CardSvg id="major-20-judgement" label={JUDGEMENT_ALT} title="Judgement" numeral="XX">
      <Rays cx={300} cy={230} r0={60} r1={210} count={60} broken />
      <Wing x={286} y={240} s={0.9} flip />
      <Wing x={314} y={240} s={0.9} />
      <Person id="judgement-angel" x={300} y={220} s={0.8} colors={["#fbf3e2", "#7fb0ff", "#f7ecd4", "#7fb0ff"]} bottom={380} hem={60} hair="curly" hairColor={RED} />
      <Cloud x={180} y={360} s={1.3} />
      <Cloud x={430} y={350} s={1.1} />
      <Cloud x={300} y={390} s={1.4} />
      {/* Trumpet with banner */}
      <path d="M270 270L170 440l26 10z" {...line} fill={SUN} />
      <path d="M190 360h70v50h-70z" {...line} fill={PAPER} />
      <path d="M225 366v38M200 385h50" stroke={RED} strokeWidth="6" />
      <Mountains x={20} y={640} w={240} h={140} />
      <Mountains x={340} y={640} w={240} h={150} />
      <path d="M40 700c40-8 80-8 120 0s80 8 120 0 80-8 120 0 80 8 120 0" stroke={COBALT} strokeWidth="2.2" fill="none" />
      {[[140, 560], [300, 540], [460, 560]].map(([fx, fy], i) => (
        <g key={i}>
          <Person
            id={`rising-${i}`}
            x={fx}
            y={fy}
            s={0.75}
            colors={[CREAM]}
            bottom={fy + 170}
            hem={44}
            hair={i === 1 ? "curly" : i === 0 ? "short" : "long"}
            skin={COBALT}
            arms={
              <>
                <Arm pts={[[fx - 34, fy + 50], [fx - 60, fy + 10], [fx - 66, fy - 30]]} w={12} />
                <Arm pts={[[fx + 34, fy + 50], [fx + 60, fy + 10], [fx + 66, fy - 30]]} w={12} />
              </>
            }
          />
          <path d={`M${fx - 70} ${fy + 160}h140v60h-140z`} {...line} fill={STONE} />
        </g>
      ))}
      <path d="M40 790c40-8 80-8 120 0s80 8 120 0 80-8 120 0 80 8 120 0" stroke={COBALT} strokeWidth="2.2" fill="none" />
    </CardSvg>
  );
}

export const WORLD_ALT =
  "The World: a dancing figure wrapped in a rainbow sash floats inside an oval laurel wreath tied with red infinity ribbons, holding a small wand in each hand; an angel, an eagle, a bull and a lion watch from clouds in the four corners.";

export function TheWorld() {
  const cx = 300;
  const cy = 470;
  return (
    <CardSvg id="major-21-the-world" label={WORLD_ALT} title="The World" numeral="XXI">
      <Rays cx={cx} cy={cy} r0={160} r1={230} count={72} width={1.6} />
      {/* Laurel wreath */}
      {Array.from({ length: 44 }, (_, i) => {
        const a = (i / 44) * Math.PI * 2;
        const x = cx + Math.cos(a) * 150;
        const y = cy + Math.sin(a) * 250;
        const deg = (a * 180) / Math.PI + 90;
        return <ellipse key={i} cx={x} cy={y} rx={8} ry={18} transform={`rotate(${deg + (i % 2 ? 30 : -30)} ${x} ${y})`} fill={GREEN} stroke={INK} strokeWidth="1.4" />;
      })}
      {[cy - 250, cy + 250].map((ry) => (
        <path key={ry} d={`M${cx} ${ry}c-12-14-34-14-34 0s22 14 34 0 34-14 34 0-22 14-34 0z`} fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />
      ))}
      <Person
        id="world"
        x={cx}
        y={330}
        colors={RAINBOW.regal}
        bottom={600}
        hem={70}
        lean={14}
        hair="long"
        hairColor={RED}
        arms={
          <>
            <Arm pts={[[258, 400], [220, 420], [196, 450]]} />
            <Arm pts={[[342, 400], [380, 380], [404, 350]]} />
          </>
        }
      />
      {/* Dancing legs */}
      <Arm pts={[[300, 590], [300, 650], [296, 700]]} w={18} hand={false} />
      <Arm pts={[[316, 590], [350, 630], [306, 650]]} w={18} hand={false} />
      <Wand x1={190} y1={420} x2={204} y2={480} leaves={0} w={7} />
      <Wand x1={398} y1={320} x2={412} y2={380} leaves={0} w={7} />
      <FourCreatures top={150} bottom={830} />
      <Sparkle x={300} y={180} r={10} />
    </CardSvg>
  );
}

