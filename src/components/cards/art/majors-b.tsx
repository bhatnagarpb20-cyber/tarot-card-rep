/** Major Arcana X–XV. */
import { CardSvg, COBALT, CREAM, Flower, INK, line, Mountains, PAPER, RAINBOW, Rays, Sparkle, Star5, SUN } from "./kit";
import { Arm, Crescent, FourCreatures, Head, Horse, Person, Rider, Wing } from "./figures";
import { Pentacle, Sword } from "./suits";

const STONE = "#c9ccd6";
const RED = "#e8283c";
const GREEN = "#1e9a6a";
const LILAC = "#8a5cf0";

export const WHEEL_ALT =
  "Wheel of Fortune: a great wheel of rainbow rings turns in the sky with a sphinx holding a sword seated on top, a serpent sliding down one side and a red jackal-headed figure rising on the other; in the four corners an angel, an eagle, a bull and a lion read open books on clouds.";

export function WheelOfFortune() {
  const cx = 300;
  const cy = 480;
  return (
    <CardSvg id="major-10-wheel-of-fortune" label={WHEEL_ALT} title="Wheel of Fortune" numeral="X">
      <Rays cx={cx} cy={cy} r0={190} r1={260} count={72} width={1.6} />
      {RAINBOW.sunset.slice().reverse().map((c, i) => (
        <circle key={i} cx={cx} cy={cy} r={170 - i * 12} fill="none" stroke={c} strokeWidth="12" />
      ))}
      <circle cx={cx} cy={cy} r={176} fill="none" stroke={INK} strokeWidth="2.4" />
      <circle cx={cx} cy={cy} r={78} fill={CREAM} stroke={INK} strokeWidth="2.4" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return <path key={i} d={`M${cx + Math.cos(a) * 20} ${cy + Math.sin(a) * 20}L${cx + Math.cos(a) * 78} ${cy + Math.sin(a) * 78}`} {...line} strokeWidth="2" />;
      })}
      <circle cx={cx} cy={cy} r={20} fill={SUN} stroke={INK} strokeWidth="2" />
      {/* Serpent descending */}
      <path d="M120 300c30 30-20 60 10 90s-20 60 10 90-20 60 10 90" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <path d="M120 300c30 30-20 60 10 90s-20 60 10 90-20 60 10 90" fill="none" stroke={GREEN} strokeWidth="8" strokeLinecap="round" />
      <circle cx={140} cy={572} r={10} fill={GREEN} stroke={INK} strokeWidth="2" />
      {/* Jackal-headed figure rising */}
      <Person id="anubis" x={480} y={560} s={0.7} colors={[RED, "#c2184b", RED]} bottom={700} hem={50} facing="left" hair="none" skin={RED} />
      <path d="M478 528l6-26 8 22M492 530l10-22 4 22" {...line} fill={RED} />
      {/* Sphinx with sword on top */}
      <path d="M250 316c0-24 20-36 50-36s50 12 50 36z" {...line} fill={COBALT} />
      <Head x={300} y={270} s={0.7} hair="none" />
      <path d="M280 254c0-20 40-20 40 0v8h-40z" fill={SUN} stroke={INK} strokeWidth="1.8" />
      <Sword x={340} y={300} len={90} s={0.8} />
      <FourCreatures top={150} bottom={800} />
    </CardSvg>
  );
}

function Scales({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y}v-70M${x - 50} ${y - 64}h100`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${x - 50} ${y - 64}l-16 40M${x - 50} ${y - 64}l16 40M${x + 50} ${y - 64}l-16 40M${x + 50} ${y - 64}l16 40`} {...line} strokeWidth="1.6" />
      <path d={`M${x - 70} ${y - 24}h40a20 10 0 0 1-40 0zM${x + 30} ${y - 24}h40a20 10 0 0 1-40 0z`} {...line} fill={SUN} />
    </g>
  );
}

export const JUSTICE_ALT =
  "Justice: a crowned figure in a red robe with a green mantle sits between two grey pillars before a purple veil, holding an upright double-edged sword in one hand and balanced golden scales in the other, one white shoe showing beneath the hem.";

export function Justice() {
  return (
    <CardSvg id="major-11-justice" label={JUSTICE_ALT} title="Justice" numeral="XI">
      <path d="M140 250h320v480H140z" fill={LILAC} opacity="0.85" stroke={INK} strokeWidth="2" />
      <Rays cx={300} cy={330} r0={70} r1={190} count={52} width={1.6} />
      {[120, 480].map((px) => (
        <g key={px}>
          <rect x={px - 24} y={230} width={48} height={520} fill={STONE} stroke={INK} strokeWidth="2.4" />
          <path d={`M${px - 32} 230h64l-8-18h-48z`} {...line} fill={STONE} />
        </g>
      ))}
      <path d="M300 800h-60l6-20h48z" fill={PAPER} stroke={INK} strokeWidth="2" />
      <Person
        id="justice"
        x={300}
        y={330}
        colors={[GREEN, RED, "#c2184b", RED, "#c2184b", RED, GREEN]}
        bottom={782}
        hem={140}
        crown="gold"
        hair="long"
        arms={
          <>
            <Arm pts={[[256, 400], [232, 440], [244, 470]]} />
            <Arm pts={[[344, 400], [376, 460], [380, 520]]} />
          </>
        }
      />
      <path d="M262 800h44l-6-18h-34z" fill={PAPER} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <Sword x={244} y={470} len={240} />
      <Scales x={380} y={590} />
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const HANGED_MAN_ALT =
  "The Hanged Man: a calm figure hangs upside down by one foot from a living T-shaped tree, the other leg crossed behind to form a figure four and the arms folded behind the back, wearing a rainbow tunic, with a golden halo of rays around the head.";

export function TheHangedMan() {
  return (
    <CardSvg id="major-12-the-hanged-man" label={HANGED_MAN_ALT} title="The Hanged Man" numeral="XII">
      {/* Living tree */}
      <path d="M190 800V200M410 800V200" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d="M190 800V200M410 800V200" stroke="#b07a3c" strokeWidth="12" strokeLinecap="round" />
      <path d="M170 200H430" stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <path d="M170 200H430" stroke="#b07a3c" strokeWidth="14" strokeLinecap="round" />
      {[[200, 186], [250, 182], [350, 182], [400, 186], [190, 300], [410, 360], [190, 520], [410, 600]].map(([lx, ly], i) => (
        <path key={i} d={`M${lx} ${ly}c${i % 2 ? 8 : -8}-12 ${i % 2 ? 22 : -22}-12 ${i % 2 ? 26 : -26}-4-${i % 2 ? 6 : 6} 8-${18} 8-26 4z`} fill={GREEN} stroke={INK} strokeWidth="1.6" />
      ))}
      <path d="M300 208v40" {...line} strokeWidth="3" />
      {/* Halo around the head */}
      <Rays cx={300} cy={640} r0={40} r1={120} count={44} />
      <circle cx={300} cy={640} r={36} fill="none" stroke={SUN} strokeWidth="4" />
      {/* Legs: straight one tied, bent one crossed behind */}
      <Arm pts={[[304, 440], [340, 380], [304, 330]]} w={20} hand={false} sleeve={RED} />
      <Arm pts={[[300, 440], [300, 340], [300, 252]]} w={20} hand={false} sleeve={RED} />
      <ellipse cx={300} cy={246} rx={10} ry={14} fill={COBALT} stroke={INK} strokeWidth="2" />
      {/* Arms folded behind */}
      <Arm pts={[[256, 590], [234, 540], [270, 500]]} w={15} />
      <Arm pts={[[344, 590], [366, 540], [330, 500]]} w={15} />
      {/* Tunic hanging downward */}
      <g transform="rotate(180 300 520)">
        <Person id="hanged" x={300} y={392} colors={RAINBOW.spring} bottom={600} hem={60} shoulder={50} hair="none" />
      </g>
      <g transform="rotate(180 300 640)">
        <Head x={300} y={640} hair="short" hairColor={SUN} />
      </g>
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const DEATH_ALT =
  "Death: a skeleton in black armour rides a white horse, carrying a black banner marked with a white rose; a crown lies on the ground and a small kneeling figure looks up, while beyond a river with a little boat the sun rises between two towers.";

export function Death() {
  return (
    <CardSvg id="major-13-death" label={DEATH_ALT} title="Death" numeral="XIII">
      <Rays cx={480} cy={600} r0={30} r1={110} count={30} from={-80} to={80} />
      <circle cx={480} cy={600} r={26} fill={SUN} stroke={INK} strokeWidth="2" />
      <path d="M420 640V520h26v120M514 640V520h26v120" {...line} fill={PAPER} />
      <path d="M420 520l13-16 13 16M514 520l13-16 13 16" {...line} fill={PAPER} />
      <path d="M380 640H600" {...line} />
      <path d="M380 690c40-8 80-8 120 0s60 8 100 0" stroke={COBALT} strokeWidth="2.2" fill="none" />
      <path d="M470 676h50l-8 10h-34z" {...line} fill={PAPER} />
      <path d="M496 676v-24l14 18" {...line} strokeWidth="1.6" fill="none" />
      <Horse x={90} y={800} s={1.05} />
      <Rider id="death" x={250} y={430} colors={[INK, "#3b3d48", INK, "#3b3d48"]} hair="none" skin={PAPER} />
      {/* Skull */}
      <circle cx={250} cy={428} r={24} fill={PAPER} stroke={INK} strokeWidth="2.2" />
      <circle cx={242} cy={426} r={5} fill={INK} />
      <circle cx={259} cy={426} r={5} fill={INK} />
      <path d="M244 444h14M248 440v8M254 440v8" {...line} strokeWidth="1.4" />
      {/* Banner with white rose */}
      <path d="M200 520L196 250" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M196 256c-30 10-70 4-100-8l10 50-10 50c30 12 70 18 100 8z" {...line} fill={INK} />
      <Flower x={150} y={306} stem={0} r={14} petals={8} />
      <Arm pts={[[226, 500], [208, 512], [200, 510]]} w={14} skin={PAPER} />
      {/* Fallen crown and kneeling child */}
      <path d="M400 800l-6-20 12 8 10-14 10 14 12-8-6 20z" fill={SUN} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <Person id="child" x={380} y={700} s={0.5} colors={[SUN, "#f28a2e", SUN]} bottom={800} hem={36} facing="left" hair="curly" hairColor={SUN} />
      <path d="M40 800H380" {...line} />
    </CardSvg>
  );
}

export const TEMPERANCE_ALT =
  "Temperance: an angel with rainbow wings and a golden triangle on the breast stands with one foot on the shore and one in a pool, pouring a stream of water between two cups; irises bloom at the water's edge and a path winds up to a crowned sunrise between two peaks.";

export function Temperance() {
  return (
    <CardSvg id="major-14-temperance" label={TEMPERANCE_ALT} title="Temperance" numeral="XIV">
      <Rays cx={110} cy={300} r0={22} r1={60} count={24} />
      <circle cx={110} cy={300} r={18} fill={SUN} stroke={INK} strokeWidth="2" />
      <path d="M88 290l-4-14 10 6 16-12 16 12 10-6-4 14" {...line} fill={SUN} strokeWidth="1.6" />
      <Mountains x={40} y={380} w={150} h={90} />
      <path d="M110 380c-10 80 60 120 30 200s40 120 80 220" fill="none" stroke={INK} strokeWidth="1.8" strokeDasharray="6 8" />
      <Wing x={286} y={360} s={0.95} flip />
      <Wing x={314} y={360} s={0.95} />
      <path d="M330 800c40-30 120-30 230-10v10z" fill="#7fb0ff" opacity="0.6" />
      <path d="M320 790c40-14 80-14 120 0s60 14 120 0" stroke={COBALT} strokeWidth="2.2" fill="none" />
      <Person
        id="temperance"
        x={300}
        y={330}
        colors={["#fbf3e2", "#f7ecd4", "#7fb0ff", "#f7ecd4", "#fbf3e2"]}
        bottom={790}
        hem={120}
        hair="curly"
        hairColor={RED}
        feet
        over={<path d="M286 410h28v28h-28zM300 414l10 20h-20z" fill="none" stroke={INK} strokeWidth="1.8" />}
        arms={
          <>
            <Arm pts={[[256, 400], [230, 450], [232, 480]]} />
            <Arm pts={[[344, 400], [380, 440], [372, 560]]} />
          </>
        }
      />
      {/* Two cups and the stream between them */}
      <path d="M232 470h30c0 18-6 26-15 26s-15-8-15-26z" {...line} fill={SUN} />
      <path d="M358 560h30c0 18-6 26-15 26s-15-8-15-26z" {...line} fill={SUN} />
      <path d="M254 472c40-20 90 30 112 90" fill="none" stroke={COBALT} strokeWidth="4" strokeLinecap="round" />
      {/* Irises */}
      {[500, 530, 556].map((ix, i) => (
        <Flower key={ix} x={ix} y={700 + (i % 2) * 20} stem={70} color={LILAC} petals={3} r={11} />
      ))}
      <path d="M40 790H330" {...line} />
      <Sparkle x={500} y={260} r={10} />
    </CardSvg>
  );
}

export const DEVIL_ALT =
  "The Devil: a horned figure with dark bat wings crouches on a black pedestal under an inverted pentagram, one hand raised and the other holding a lowered torch; a couple with small horns and tails stand below, loosely chained to the pedestal, their chains wide enough to slip off.";

export function TheDevil() {
  return (
    <CardSvg id="major-15-the-devil" label={DEVIL_ALT} title="The Devil" numeral="XV">
      <Rays cx={300} cy={300} r0={70} r1={230} count={60} color={INK} width={1.4} broken />
      {/* Bat wings */}
      {[-1, 1].map((d) => (
        <path key={d} transform={`translate(300 0) scale(${d} 1) translate(-300 0)`} d="M330 360c60-60 160-80 210-50-30 6-40 30-36 54-24-14-50-4-56 20-20-16-50-10-60 14-20-14-40-20-58-10z" {...line} fill={INK} />
      ))}
      <g transform="rotate(180 300 210)">
        <Pentacle x={300} y={210} r={28} />
      </g>
      <Person
        id="devil"
        x={300}
        y={320}
        colors={["#3a1020", INK, "#5a1a2e", INK, "#3a1020"]}
        bottom={620}
        hem={90}
        hair="none"
        skin="#5a1a2e"
        eyes="open"
        arms={
          <>
            <Arm pts={[[256, 390], [226, 360], [222, 310]]} skin="#5a1a2e" />
            <Arm pts={[[344, 390], [376, 440], [380, 500]]} skin="#5a1a2e" />
          </>
        }
      />
      {/* Horns */}
      <path d="M284 300c-14-10-18-26-12-40 4 14 12 22 22 26zM316 300c14-10 18-26 12-40-4 14-12 22-22 26z" {...line} fill={PAPER} />
      {/* Lowered torch */}
      <path d="M380 500l30 90" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M380 500l30 90" stroke="#b07a3c" strokeWidth="5" strokeLinecap="round" />
      <path d="M408 586c10 10 22 14 22 30 0 14-12 20-22 18 8-8 2-18-6-20 0 10-8 14-14 10 6-10 6-24 20-38z" fill="#f28a2e" stroke={INK} strokeWidth="1.8" />
      {/* Pedestal and chains */}
      <path d="M220 620h160v180H220z" {...line} fill={INK} />
      <circle cx={300} cy={660} r={10} fill="none" stroke={PAPER} strokeWidth="3" />
      <path d="M300 670C260 700 200 700 170 690M300 670c40 30 100 30 130 20" fill="none" stroke={STONE} strokeWidth="3" strokeDasharray="6 4" />
      <Person id="devil-l" x={150} y={600} s={0.75} colors={[RED, "#f28a2e", SUN]} bottom={800} hem={60} facing="right" hair="long" />
      <Person id="devil-r" x={450} y={600} s={0.75} colors={[COBALT, GREEN, "#7fb0ff"]} bottom={800} hem={60} facing="left" hair="short" />
      <path d="M140 576l-6-14 12 6M160 576l6-14-12 6M440 576l-6-14 12 6M460 576l6-14-12 6" {...line} strokeWidth="2" fill="none" />
      <path d="M100 740c-20 10-30 30-20 50M500 740c20 10 30 30 20 50" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 800H560" {...line} />
      <Star5 x={80} y={140} r={6} color={INK} />
      <Crescent x={520} y={140} r={14} />
    </CardSvg>
  );
}
