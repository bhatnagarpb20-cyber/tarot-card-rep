/** The suit of Cups: blues and pinks, water everywhere. */
import { CardSvg, COBALT, CREAM, INK, line, Mountains, PAPER, Rays, Sparkle, SUN } from "./kit";
import { Arm, Castle, Cloud, Crescent, Head, Horse, Person, Rider, Throne, Tree, Water, Wing } from "./figures";
import { Cup } from "./suits";
import { Bench, Dove, Fish, GREEN, Ground, HandFromCloud, Hill, LilyPad, ORANGE, PINK, RED, Ship, SKY, STONE, SUIT_COLORS, Grapes } from "./minor-kit";

const C = SUIT_COLORS.cups;

export const ALT = {
  "cups-01-ace": "Ace of Cups: a cobalt hand reaches from a cloud holding a golden chalice that overflows in five streams into a pond of water lilies, while a white dove descends with a wafer.",
  "cups-02-two": "Two of Cups: two figures face each other and exchange golden cups beneath a winged caduceus crowned with a lion's head, with a little house on the hill behind.",
  "cups-03-three": "Three of Cups: three women in rainbow robes dance in a circle, raising their cups high above a harvest of pumpkins and grapes.",
  "cups-04-four": "Four of Cups: a figure sits under a tree with arms crossed, ignoring three cups on the grass and a fourth offered by a hand from a cloud.",
  "cups-05-five": "Five of Cups: a figure in a dark cloak bows their head over three spilled cups, not yet seeing the two cups still standing behind them or the bridge leading to a castle across the river.",
  "cups-06-six": "Six of Cups: in an old village courtyard a child offers a smaller child a cup filled with flowers; six flower-filled cups stand around them and a guard walks away in the background.",
  "cups-07-seven": "Seven of Cups: a dark silhouetted figure gazes at seven cups floating on clouds, each holding a different vision: a castle, jewels, a wreath, a dragon, a snake, a face and a veiled glowing figure.",
  "cups-08-eight": "Eight of Cups: a figure with a staff walks away up a rocky mountain path under a moon that holds the sun, leaving behind eight stacked cups with a gap in the row.",
  "cups-09-nine": "Nine of Cups: a contented figure in a red cap sits with arms crossed and a smile before a draped bench displaying nine cups in an arc.",
  "cups-10-ten": "Ten of Cups: ten cups arc across the sky in a rainbow over a couple with raised arms and two dancing children, a cottage beside the river.",
  "cups-11-page": "Page of Cups: a page in a lotus-patterned tunic stands by the sea, relaxed, looking at a little fish peeking out of the cup in their hand.",
  "cups-12-knight": "Knight of Cups: a knight in a winged helmet rides a calm white horse beside a flowing river, holding a cup out in front of him.",
  "cups-13-queen": "Queen of Cups: a crowned queen sits on a throne carved with shells and cherubs at the water's edge, gazing into an ornate lidded chalice held in both hands.",
  "cups-14-king": "King of Cups: a crowned king with a fish amulet sits on a throne floating on a choppy sea, holding a cup and a sceptre; a ship sails behind and a fish leaps from the waves.",
} as const;

export function AceOfCups() {
  return (
    <CardSvg id="cups-01-ace" label={ALT["cups-01-ace"]} title="Ace of Cups">
      <Rays cx={300} cy={400} r0={80} r1={220} count={60} broken />
      <path d="M60 790c80-40 400-40 480 0" fill={SKY} stroke={COBALT} strokeWidth="2" />
      <LilyPad x={120} y={780} />
      <LilyPad x={470} y={776} />
      <LilyPad x={380} y={790} />
      {[-40, -20, 0, 20, 40].map((d) => (
        <path key={d} d={`M${300 + d / 2} 360c${d} 120 ${d * 2} 260 ${d * 3} 400`} fill="none" stroke={COBALT} strokeWidth="2.4" strokeLinecap="round" />
      ))}
      <HandFromCloud cx={100} cy={420} hx={296} hy={470}>
        <Cup x={300} y={500} s={2} />
      </HandFromCloud>
      <g transform="rotate(180 300 230)">
        <Dove x={300} y={230} s={1.1} />
      </g>
      <circle cx={300} cy={286} r={12} fill={PAPER} stroke={INK} strokeWidth="1.8" />
      <path d="M300 278v16M292 286h16" stroke={INK} strokeWidth="1.6" />
    </CardSvg>
  );
}

export function TwoOfCups() {
  return (
    <CardSvg id="cups-02-two" label={ALT["cups-02-two"]} title="Two of Cups">
      <Rays cx={300} cy={300} r0={50} r1={170} count={48} />
      <Hill x0={200} x1={420} y={600} h={90} />
      <path d="M296 560h24v-20l-12-10-12 10z" {...line} fill={PAPER} />
      {/* Caduceus with a winged lion's head */}
      <path d="M300 460V250" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M300 450c-24-14 24-30 0-44s24-30 0-44 24-30 0-44M300 450c24-14-24-30 0-44s-24-30 0-44-24-30 0-44" fill="none" stroke={GREEN} strokeWidth="3.4" />
      <Wing x={290} y={250} s={0.35} flip />
      <Wing x={310} y={250} s={0.35} />
      <circle cx={300} cy={230} r={22} fill={ORANGE} stroke={INK} strokeWidth="2" />
      <circle cx={300} cy={232} r={13} fill={SUN} stroke={INK} strokeWidth="1.6" />
      <Person id="c2a" x={180} y={420} colors={C} bottom={800} hem={100} facing="right" hair="long" hairColor={SUN} arms={<Arm pts={[[214, 490], [244, 530], [270, 520]]} />} />
      <Person id="c2b" x={420} y={420} colors={[...C].reverse()} bottom={800} hem={100} facing="left" hair="curly" crown="laurel" arms={<Arm pts={[[386, 490], [356, 530], [330, 520]]} />} />
      <Cup x={270} y={540} s={0.8} />
      <Cup x={330} y={540} s={0.8} />
      <Ground />
    </CardSvg>
  );
}

export function ThreeOfCups() {
  const figs: [number, string[], "long" | "curly" | "bun"][] = [
    [170, [PINK, RED, ORANGE, SUN], "long"],
    [300, [CREAM, SKY, "#fbf3e2", PINK], "bun"],
    [430, [SUN, ORANGE, GREEN, CREAM], "curly"],
  ];
  return (
    <CardSvg id="cups-03-three" label={ALT["cups-03-three"]} title="Three of Cups">
      <Rays cx={300} cy={260} r0={50} r1={180} count={56} />
      {figs.map(([fx, cols, hair], i) => (
        <g key={i}>
          <Person
            id={`c3-${i}`}
            x={fx}
            y={440 + (i === 1 ? -20 : 0)}
            s={0.85}
            colors={cols}
            bottom={790}
            hem={80}
            hair={hair}
            hairColor={[SUN, INK, "#7a3b1f"][i]}
            arms={<Arm pts={[[fx + (i === 2 ? -30 : 30), 500], [fx + (i === 2 ? -36 : 36), 420], [fx + (i === 0 ? 50 : i === 2 ? -50 : 10), 340]]} w={14} />}
          />
          <Cup x={fx + (i === 0 ? 50 : i === 2 ? -50 : 10)} y={330} s={0.8} />
        </g>
      ))}
      {[[90, 790], [130, 798], [480, 792]].map(([px, py], i) => (
        <ellipse key={i} cx={px} cy={py} rx={22} ry={16} fill={ORANGE} stroke={INK} strokeWidth="2" />
      ))}
      <Grapes x={530} y={796} />
      <Ground />
    </CardSvg>
  );
}

export function FourOfCups() {
  return (
    <CardSvg id="cups-04-four" label={ALT["cups-04-four"]} title="Four of Cups">
      <Tree x={150} y={720} s={1.3} />
      <Person
        id="c4"
        x={220}
        y={480}
        colors={C}
        bottom={790}
        hem={100}
        hair="short"
        over={
          <g>
            <Arm pts={[[180, 550], [230, 580], [270, 560]]} hand={false} />
            <Arm pts={[[260, 550], [210, 590], [172, 566]]} hand={false} />
          </g>
        }
      />
      {[330, 390, 450].map((cx) => (
        <Cup key={cx} x={cx} y={800} s={0.9} />
      ))}
      <HandFromCloud cx={500} cy={330} hx={380} hy={380} flip>
        <Cup x={380} y={440} s={0.9} />
      </HandFromCloud>
      <Ground />
    </CardSvg>
  );
}

export function FiveOfCups() {
  return (
    <CardSvg id="cups-05-five" label={ALT["cups-05-five"]} title="Five of Cups">
      <Castle x={500} y={560} s={1} />
      <path d="M360 600c30-30 70-30 100 0" {...line} fill="none" />
      <path d="M360 600h100v20H360z" {...line} fill={STONE} />
      <Water y={610} x0={40} x1={560} rows={2} />
      <Person id="c5" x={280} y={400} colors={[INK, "#2a2c36", INK, "#3b3d48", INK]} bottom={800} hem={110} facing="left" hair="hood" eyes="down" />
      {[[110, 790], [160, 800], [200, 784]].map(([cx, cy], i) => (
        <g key={i}>
          <path d={`M${cx - 30} ${cy + 6}c10-6 30-6 46 0`} fill={i === 1 ? RED : SKY} opacity="0.7" />
          <Cup x={cx} y={cy} s={0.8} tipped={-90} />
        </g>
      ))}
      <Cup x={420} y={800} s={0.9} />
      <Cup x={480} y={800} s={0.9} />
      <Ground />
    </CardSvg>
  );
}

export function SixOfCups() {
  return (
    <CardSvg id="cups-06-six" label={ALT["cups-06-six"]} title="Six of Cups">
      <path d="M40 300h160v360H40zM400 260h160v400H400z" {...line} fill={STONE} />
      <path d="M40 300l80-50 80 50M400 260l80-50 80 50" {...line} fill={STONE} />
      <path d="M90 400h40v50H90zM450 360h40v50h-40z" {...line} fill={SUN} />
      <Person id="guard" x={480} y={520} s={0.5} colors={[STONE, "#7c7f8c"]} bottom={640} hem={40} facing="right" crown="helmet" />
      <Person id="c6a" x={240} y={450} colors={[RED, SUN, PINK, CREAM]} bottom={800} hem={90} facing="right" crown="cap" arms={<Arm pts={[[272, 520], [300, 560], [320, 560]]} />} />
      <Person id="c6b" x={380} y={560} s={0.7} colors={[SKY, CREAM, PINK]} bottom={800} hem={60} facing="left" hair="long" hairColor={SUN} />
      <Cup x={324} y={600} s={0.8} flowers />
      <path d="M60 720h180v40H60z" {...line} fill={STONE} />
      {[90, 150, 210].map((cx) => (
        <Cup key={cx} x={cx} y={720} s={0.7} flowers />
      ))}
      <Cup x={460} y={800} s={0.7} flowers />
      <Cup x={520} y={800} s={0.7} flowers />
      <Ground />
    </CardSvg>
  );
}

export function SevenOfCups() {
  const spots: [number, number][] = [[140, 330], [300, 290], [460, 330], [140, 560], [300, 520], [460, 560], [300, 720]];
  const visions = [
    <Castle key="v0" x={140} y={250} s={0.6} />,
    <path key="v1" d="M286 214l14-18 14 18-14 18z" {...line} fill="#7fb0ff" />,
    <path key="v2" d="M444 230c0-16 32-16 32 0s-32 16-32 0" fill="none" stroke={GREEN} strokeWidth="6" />,
    <path key="v3" d="M110 470c20-20 40 10 60-10M164 452l12 8" fill="none" stroke={RED} strokeWidth="6" strokeLinecap="round" />,
    <path key="v4" d="M280 440c20-10 0-30 20-40s0-30 20-30" fill="none" stroke={GREEN} strokeWidth="5" strokeLinecap="round" />,
    <Head key="v5" x={460} y={466} s={0.6} hair="curly" />,
    <g key="v6">
      <Rays cx={300} cy={630} r0={22} r1={50} count={20} />
      <path d="M284 660c0-30 6-50 16-50s16 20 16 50z" {...line} fill={CREAM} />
    </g>,
  ];
  return (
    <CardSvg id="cups-07-seven" label={ALT["cups-07-seven"]} title="Seven of Cups">
      {spots.map(([sx, sy], i) => (
        <g key={i}>
          <Cloud x={sx} y={sy + 10} s={0.8} />
          {visions[i]}
          <Cup x={sx} y={sy} s={0.8} />
        </g>
      ))}
      <Person id="c7" x={90} y={720} s={0.8} colors={[INK, INK]} bottom={860} hem={60} skin={INK} hair="short" />
    </CardSvg>
  );
}

export function EightOfCups() {
  return (
    <CardSvg id="cups-08-eight" label={ALT["cups-08-eight"]} title="Eight of Cups">
      <circle cx={300} cy={200} r={50} fill={SUN} stroke={INK} strokeWidth="2" />
      <Crescent x={300} y={200} r={46} fill={CREAM} />
      <Mountains x={200} y={600} w={360} h={300} />
      <path d="M380 600l-30-80 40-60-20-80" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="6 8" />
      <Person id="c8" x={390} y={410} s={0.5} colors={[RED, "#c2184b"]} bottom={520} hem={36} hair="short" />
      <path d="M408 420v100" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <Water y={640} rows={2} />
      {[110, 170, 230, 290, 350].map((cx) => (
        <Cup key={cx} x={cx} y={800} s={0.8} />
      ))}
      {[140, 200, 320].map((cx) => (
        <Cup key={cx} x={cx} y={738} s={0.8} />
      ))}
      <Ground />
    </CardSvg>
  );
}

export function NineOfCups() {
  return (
    <CardSvg id="cups-09-nine" label={ALT["cups-09-nine"]} title="Nine of Cups">
      <Rays cx={300} cy={260} r0={60} r1={200} count={56} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / 8;
        return <Cup key={i} x={300 + Math.cos(a) * 220} y={420 + Math.sin(a) * 140} s={0.75} />;
      })}
      <Bench x={300} y={420} w={480} fill={SKY} />
      <Person
        id="c9"
        x={300}
        y={520}
        colors={C}
        bottom={800}
        hem={130}
        crown="cap"
        hair="short"
        over={
          <g>
            <Arm pts={[[256, 600], [310, 630], [346, 610]]} hand={false} />
            <Arm pts={[[344, 600], [290, 640], [254, 616]]} hand={false} />
          </g>
        }
      />
      <Ground />
    </CardSvg>
  );
}

export function TenOfCups() {
  const rainbow = ["#e8283c", ORANGE, SUN, GREEN, COBALT];
  return (
    <CardSvg id="cups-10-ten" label={ALT["cups-10-ten"]} title="Ten of Cups">
      {rainbow.map((c, i) => (
        <path key={c} d={`M${70 + i * 12} 480A${230 - i * 12} ${230 - i * 12} 0 0 1 ${530 - i * 12} 480`} fill="none" stroke={c} strokeWidth="12" />
      ))}
      {Array.from({ length: 10 }, (_, i) => {
        const a = Math.PI + (Math.PI * (i + 0.5)) / 10;
        return <Cup key={i} x={300 + Math.cos(a) * 236} y={516 + Math.sin(a) * 236} s={0.6} />;
      })}
      <Hill x0={380} x1={600} y={640} h={70} />
      <path d="M460 600h50v-30l-25-18-25 18z" {...line} fill={PAPER} />
      <path d="M40 680c80-10 160 0 260-20s200-10 260 0" fill="none" stroke={COBALT} strokeWidth="2.4" />
      <Person id="c10a" x={200} y={560} s={0.75} colors={[RED, SUN, CREAM]} bottom={800} hem={60} facing="right" hair="short" arms={<Arm pts={[[180, 600], [170, 560], [176, 520]]} w={12} />} />
      <Person id="c10b" x={270} y={560} s={0.75} colors={[SKY, COBALT, CREAM]} bottom={800} hem={60} facing="left" hair="long" arms={<Arm pts={[[290, 600], [300, 560], [296, 520]]} w={12} />} />
      <Person id="c10c" x={400} y={660} s={0.45} colors={[PINK, CREAM]} bottom={800} hem={36} hair="bun" />
      <Person id="c10d" x={460} y={660} s={0.45} colors={[SUN, ORANGE]} bottom={800} hem={36} hair="curly" />
      <Ground />
    </CardSvg>
  );
}

export function PageOfCups() {
  return (
    <CardSvg id="cups-11-page" label={ALT["cups-11-page"]} title="Page of Cups">
      <Water y={620} rows={4} gap={26} />
      <Person
        id="c11"
        x={270}
        y={360}
        colors={[PINK, SKY, "#fbf3e2", PINK, SKY]}
        bottom={800}
        hem={100}
        facing="right"
        crown="cap"
        arms={<Arm pts={[[300, 430], [340, 470], [366, 460]]} />}
      />
      {[[250, 560], [290, 640], [240, 710]].map(([lx, ly], i) => (
        <path key={i} d={`M${lx} ${ly}c-10-10-10-20 0-26 10 6 10 16 0 26zM${lx} ${ly}c-14-4-20-12-16-20 8 0 14 8 16 20zM${lx} ${ly}c14-4 20-12 16-20-8 0-14 8-16 20z`} fill={PINK} stroke={INK} strokeWidth="1.2" />
      ))}
      <Cup x={372} y={500} s={0.9} />
      <Fish x={374} y={428} s={0.7} flip />
      <Ground />
    </CardSvg>
  );
}

export function KnightOfCups() {
  return (
    <CardSvg id="cups-12-knight" label={ALT["cups-12-knight"]} title="Knight of Cups">
      <Rays cx={330} cy={300} r0={50} r1={180} count={48} />
      <Mountains x={300} y={600} w={260} h={120} />
      <path d="M40 760c80-20 140-10 220-30s200-30 300-10" fill="none" stroke={COBALT} strokeWidth="3" />
      <Horse x={110} y={800} s={1} />
      <Rider id="c12" x={240} y={420} colors={C} crown="helmet" arms={<Arm pts={[[270, 470], [310, 480], [346, 470]]} />} />
      <Wing x={226} y={390} s={0.2} flip />
      <Wing x={254} y={390} s={0.2} />
      <Cup x={350} y={500} s={0.8} />
      <Ground />
    </CardSvg>
  );
}

export function QueenOfCups() {
  return (
    <CardSvg id="cups-13-queen" label={ALT["cups-13-queen"]} title="Queen of Cups">
      <Rays cx={300} cy={330} r0={70} r1={210} count={56} color={COBALT} width={1.6} />
      <Throne x={300} top={290} ground={760} w={220} color={SKY} carving="fish" />
      {[200, 400].map((cx) => (
        <g key={cx}>
          <Wing x={cx - 6} y={290} s={0.18} flip />
          <Wing x={cx + 6} y={290} s={0.18} />
          <Head x={cx} y={284} s={0.4} hair="curly" hairColor={SUN} />
        </g>
      ))}
      <Person
        id="c13"
        x={300}
        y={330}
        colors={C}
        bottom={760}
        hem={140}
        crown="gold"
        hair="long"
        eyes="down"
        arms={
          <>
            <Arm pts={[[256, 400], [250, 460], [286, 480]]} />
            <Arm pts={[[344, 400], [350, 460], [314, 480]]} />
          </>
        }
      />
      <Cup x={300} y={520} s={0.9} />
      <path d="M280 456c0-14 40-14 40 0zM300 442v-8" {...line} fill={SUN} />
      <path d="M278 476c-14 0-14-16 0-14M322 476c14 0 14-16 0-14" {...line} fill="none" />
      <Water y={790} rows={2} />
    </CardSvg>
  );
}

export function KingOfCups() {
  return (
    <CardSvg id="cups-14-king" label={ALT["cups-14-king"]} title="King of Cups">
      <Ship x={110} y={600} s={1} />
      <Fish x={490} y={600} s={1.2} fill={ORANGE} />
      <path d="M440 640c10-20 30-30 50-36" fill="none" stroke={COBALT} strokeWidth="2" strokeDasharray="4 6" />
      <Throne x={300} top={300} ground={700} w={210} color={SKY} carving="fish" />
      <Person
        id="c14"
        x={300}
        y={340}
        colors={[COBALT, SKY, "#fbf3e2", SKY, COBALT]}
        bottom={700}
        hem={120}
        crown="gold"
        hair="short"
        over={<Fish x={300} y={420} s={0.5} fill={SUN} />}
        arms={
          <>
            <Arm pts={[[256, 410], [232, 460], [244, 490]]} />
            <Arm pts={[[344, 410], [372, 450], [380, 480]]} />
          </>
        }
      />
      <Cup x={244} y={520} s={0.8} />
      <path d="M380 500V330" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M380 500V330" stroke={SUN} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M200 700h200v30H200z" {...line} fill={STONE} />
      <Water y={760} rows={3} gap={22} />
      <Sparkle x={500} y={200} r={10} />
    </CardSvg>
  );
}
