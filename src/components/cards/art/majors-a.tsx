/** Major Arcana III–IX. */
import { CardSvg, COBALT, CREAM, Flower, INK, line, Mountains, PAPER, RAINBOW, Rays, Sparkle, Star5, SUN } from "./kit";
import { Arm, Castle, Crescent, Head, Lion, Person, Throne, Tree, Wing } from "./figures";

const STONE = "#c9ccd6";
const BLOND = "#c99a2c";
const RED = "#e8283c";
const GREEN = "#1e9a6a";

function Wheat({ x, y, h = 110, lean = 0 }: { x: number; y: number; h?: number; lean?: number }) {
  return (
    <g>
      <path d={`M${x} ${y}q${lean / 2} ${-h / 2} ${lean} ${-h}`} {...line} strokeWidth="1.8" />
      {Array.from({ length: 6 }, (_, i) => {
        const t = 0.55 + i * 0.08;
        const px = x + lean * t;
        const py = y - h * t;
        return (
          <g key={i}>
            <ellipse cx={px - 6} cy={py} rx={4} ry={8} transform={`rotate(-30 ${px - 6} ${py})`} fill={SUN} stroke={INK} strokeWidth="1.3" />
            <ellipse cx={px + 6} cy={py} rx={4} ry={8} transform={`rotate(30 ${px + 6} ${py})`} fill={SUN} stroke={INK} strokeWidth="1.3" />
          </g>
        );
      })}
    </g>
  );
}

export const EMPRESS_ALT =
  "The Empress: a cobalt-skinned woman with golden hair sits on a cushioned throne in a rainbow robe, a crown of twelve stars above her and a sceptre in her hand; a heart-shaped shield with the Venus sign leans beside her, ripe wheat grows at her feet, and a waterfall pours through the trees behind.";

export function TheEmpress() {
  return (
    <CardSvg id="major-03-the-empress" label={EMPRESS_ALT} title="The Empress" numeral="III">
      <Rays cx={300} cy={300} r0={60} r1={190} count={56} color={COBALT} width={1.8} broken />
      <Tree x={70} y={640} s={0.75} />
      <Tree x={540} y={600} s={0.6} />
      <path d="M470 140c-8 60 10 120 0 180s10 120 0 180M486 140c-8 60 10 120 0 180s10 120 0 180M502 150c-8 60 10 120 0 180s10 120 0 180" fill="none" stroke={COBALT} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <Throne x={300} top={290} ground={780} w={210} color="#f47ca8" />
      <Person
        id="empress"
        x={300}
        y={330}
        colors={RAINBOW.regal}
        bottom={780}
        hem={150}
        hair="long"
        hairColor={BLOND}
        arms={
          <>
            <Arm pts={[[254, 400], [230, 450], [218, 500]]} />
            <Arm pts={[[346, 400], [360, 460], [320, 520]]} />
          </>
        }
      />
      {/* Crown of twelve stars */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (-170 + (160 * i) / 11) * (Math.PI / 180);
        return <Star5 key={i} x={300 + Math.cos(a) * 46} y={312 + Math.sin(a) * 46} r={5} color={SUN} />;
      })}
      {/* Sceptre */}
      <path d="M218 512V380" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M218 512V380" stroke={SUN} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx={218} cy={372} r={10} fill={SUN} stroke={INK} strokeWidth="2" />
      {/* Venus shield */}
      <path d="M120 690c-30-30-20-70 10-64 14 2 20 14 20 14s6-12 20-14c30-6 40 34 10 64l-30 28z" {...line} fill={PAPER} />
      <circle cx={150} cy={672} r={11} fill="none" stroke={COBALT} strokeWidth="2.6" />
      <path d="M150 683v18M142 694h16" stroke={COBALT} strokeWidth="2.6" strokeLinecap="round" />
      {/* Wheat field */}
      {[60, 92, 420, 452, 486, 520, 550].map((wx, i) => (
        <Wheat key={wx} x={wx} y={800} h={90 + (i % 3) * 18} lean={(i % 2 ? 1 : -1) * 10} />
      ))}
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const EMPEROR_ALT =
  "The Emperor: a bearded, crowned ruler sits on a grey stone throne carved with ram heads, wearing a red robe over armour; he holds an ankh-topped sceptre and a golden orb, with barren orange mountains and a ray burst behind him.";

export function TheEmperor() {
  return (
    <CardSvg id="major-04-the-emperor" label={EMPEROR_ALT} title="The Emperor" numeral="IV">
      <Rays cx={300} cy={300} r0={70} r1={230} count={60} broken />
      <Mountains x={20} y={620} w={260} h={220} fill="#f9b27a" />
      <Mountains x={330} y={620} w={250} h={180} fill="#f28a2e" />
      <Throne x={300} top={290} ground={790} w={230} color={STONE} carving="ram" />
      {/* Armoured feet */}
      <path d="M250 790h40l-4-22h-32zM310 790h40l-4-22h-32z" {...line} fill={STONE} />
      <Person
        id="emperor"
        x={300}
        y={330}
        colors={[RED, "#c2184b", "#f28a2e", RED, "#c2184b", "#f28a2e", RED]}
        bottom={772}
        hem={140}
        crown="gold"
        hair="short"
        hairColor={CREAM}
        over={<path d="M276 382c0 30 10 54 24 54s24-24 24-54" fill={CREAM} stroke={INK} strokeWidth="2" />}
        arms={
          <>
            <Arm pts={[[256, 400], [226, 450], [230, 500]]} />
            <Arm pts={[[344, 400], [374, 450], [370, 500]]} />
          </>
        }
      />
      {/* Beard */}
      <path d="M282 344c0 26 8 44 18 44s18-18 18-44c-6 6-12 8-18 8s-12-2-18-8z" fill={CREAM} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* Ankh sceptre */}
      <path d="M230 506V380" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M230 506V380" stroke={SUN} strokeWidth="4" strokeLinecap="round" />
      <path d="M216 384h28M230 384c-12-8-12-30 0-30s12 22 0 30z" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      {/* Orb */}
      <circle cx={372} cy={494} r={18} fill={SUN} stroke={INK} strokeWidth="2.2" />
      <path d="M372 476v-10M366 470h12" {...line} />
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const HIEROPHANT_ALT =
  "The Hierophant: a teacher in a red and gold robe and a triple crown sits between two grey pillars, raising one hand in blessing and holding a triple cross; two crossed golden keys lie at his feet and two kneeling acolytes, one in roses and one in lilies, listen before him.";

export function TheHierophant() {
  return (
    <CardSvg id="major-05-the-hierophant" label={HIEROPHANT_ALT} title="The Hierophant" numeral="V">
      <Rays cx={300} cy={290} r0={70} r1={210} count={56} broken />
      {[110, 490].map((px) => (
        <g key={px}>
          <rect x={px - 26} y={220} width={52} height={500} fill={STONE} stroke={INK} strokeWidth="2.4" />
          <path d={`M${px - 34} 220h68l-8-18h-52z`} {...line} fill={STONE} />
          <path d={`M${px - 12} 240v460M${px + 12} 240v460`} stroke={INK} strokeWidth="1.2" opacity="0.4" />
        </g>
      ))}
      <Throne x={300} top={280} ground={720} w={190} color={STONE} />
      <Person
        id="hierophant"
        x={300}
        y={320}
        colors={[RED, SUN, "#c2184b", CREAM, "#c2184b", SUN, RED]}
        bottom={720}
        hem={130}
        crown="triple"
        hair="none"
        arms={
          <>
            <Arm pts={[[256, 390], [230, 360], [236, 312]]} />
            <Arm pts={[[344, 390], [376, 430], [384, 470]]} />
          </>
        }
      />
      {/* Blessing fingers */}
      <path d="M232 302v-14M240 302v-14" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M232 302v-14M240 302v-14" stroke={COBALT} strokeWidth="3.5" strokeLinecap="round" />
      {/* Triple cross */}
      <path d="M384 560V240" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M384 560V240" stroke={SUN} strokeWidth="4" strokeLinecap="round" />
      <path d="M370 256h28M364 272h40M358 288h52" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* Crossed keys */}
      {[-30, 30].map((r) => (
        <g key={r} transform={`rotate(${r} 300 752)`}>
          <path d="M300 724v56M300 772h10M300 762h8" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <circle cx={300} cy={716} r={9} fill={SUN} stroke={INK} strokeWidth="2" />
        </g>
      ))}
      {/* Kneeling acolytes */}
      <Person id="acolyte-l" x={140} y={680} s={0.55} colors={[RED, "#f47ca8", RED, "#f47ca8"]} bottom={800} hem={50} facing="right" hair="bald" />
      <Person id="acolyte-r" x={460} y={680} s={0.55} colors={[PAPER, "#f7ecd4", GREEN, PAPER]} bottom={800} hem={50} facing="left" hair="bald" />
      <Flower x={150} y={712} stem={0} r={7} color={RED} petals={8} />
      <Flower x={450} y={712} stem={0} r={7} petals={6} />
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const LOVERS_ALT =
  "The Lovers: two cobalt-skinned figures in flowing rainbow robes face each other and reach out their hands, beneath an angel with rainbow wings and a great golden sun; a fruit tree with a serpent stands behind one, a tree of flames behind the other, and a mountain rises between them.";

export function TheLovers() {
  return (
    <CardSvg id="major-06-the-lovers" label={LOVERS_ALT} title="The Lovers" numeral="VI">
      <Rays cx={300} cy={210} r0={50} r1={150} count={60} />
      <circle cx={300} cy={210} r={40} fill={SUN} stroke={INK} strokeWidth="2" />
      <Mountains x={210} y={600} w={180} h={150} />
      {/* Tree with serpent and fruit */}
      <Tree x={90} y={720} s={0.85} fruit={RED} />
      <path d="M86 700c14-10-10-22 4-32s-10-22 4-32" fill="none" stroke={GREEN} strokeWidth="5" strokeLinecap="round" />
      {/* Tree of flames */}
      <path d="M514 720V560" {...line} strokeWidth="3" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${474 + (i % 3) * 30} ${600 - Math.floor(i / 3) * 30}c-6-14 4-22 8-30 6 10 12 18 4 30z`} fill={i % 2 ? "#f28a2e" : RED} stroke={INK} strokeWidth="1.4" />
      ))}
      {/* Angel */}
      <Wing x={286} y={250} s={0.7} flip />
      <Wing x={314} y={250} s={0.7} />
      <Person id="lovers-angel" x={300} y={240} s={0.6} colors={["#f7ecd4", "#7fb0ff", "#f7ecd4", "#7fb0ff"]} bottom={360} hem={50} hair="curly" hairColor={RED} />
      {/* The couple */}
      <Person
        id="lover-l"
        x={190}
        y={470}
        colors={["#fbf3e2", "#f7ecd4", SUN, "#f28a2e", "#ee3e86"]}
        bottom={800}
        hem={110}
        facing="right"
        hair="long"
        hairColor={COBALT}
        arms={<Arm pts={[[226, 540], [258, 580], [282, 576]]} />}
      />
      <Person
        id="lover-r"
        x={410}
        y={470}
        colors={["#e8283c", SUN, GREEN, COBALT, "#ee3e86"]}
        bottom={800}
        hem={110}
        facing="left"
        hair="curly"
        arms={<Arm pts={[[374, 540], [342, 580], [318, 576]]} />}
      />
      <path d="M291 600c-6-8-14-6-14 2 0 8 14 16 14 16s14-8 14-16c0-8-8-10-14-2z" fill={SUN} stroke={INK} strokeWidth="1.8" />
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

function Sphinx({ x, y, dark }: { x: number; y: number; dark: boolean }) {
  const fill = dark ? INK : PAPER;
  return (
    <g>
      <path d={`M${x - 70} ${y}c-4-30 10-50 40-54 30-4 70 0 90 12 10 8 14 24 10 42z`} {...line} fill={fill} />
      <path d={`M${x - 70} ${y}v-6M${x - 30} ${y}v-6M${x + 40} ${y}v-6`} {...line} stroke={dark ? PAPER : INK} />
      <path d={`M${x - 92} ${y - 30}c-4-30 14-52 34-52 18 0 30 16 30 34l-6 22z`} fill={SUN} stroke={INK} strokeWidth="2" />
      <path d={`M${x - 88} ${y - 50}h56M${x - 90} ${y - 38}h58`} stroke={COBALT} strokeWidth="3" />
      <Head x={x - 62} y={y - 46} s={0.6} facing="front" hair="none" skin={dark ? INK : PAPER} />
    </g>
  );
}

export const CHARIOT_ALT =
  "The Chariot: an armoured charioteer with crescent moons on the shoulders stands in a stone chariot beneath a cobalt canopy of stars, holding a golden wand and no reins; a black and a white sphinx rest before the chariot and a walled city stands behind.";

export function TheChariot() {
  return (
    <CardSvg id="major-07-the-chariot" label={CHARIOT_ALT} title="The Chariot" numeral="VII">
      <Rays cx={300} cy={330} r0={70} r1={220} count={60} broken />
      <Castle x={90} y={560} s={1.2} />
      <Castle x={510} y={560} s={1.1} />
      {/* Canopy of stars */}
      <path d="M150 220c60-30 240-30 300 0v30c-60-24-240-24-300 0z" {...line} fill={COBALT} />
      {[180, 230, 280, 330, 380, 420].map((sx, i) => (
        <Star5 key={sx} x={sx} y={226 + (i % 2) * 6} r={6} color={SUN} />
      ))}
      <path d="M160 240V560M440 240V560" {...line} strokeWidth="4" />
      <Person
        id="chariot"
        x={300}
        y={330}
        colors={[STONE, COBALT, STONE, SUN, STONE, COBALT, STONE]}
        bottom={600}
        hem={90}
        crown="gold"
        arms={
          <>
            <Arm pts={[[256, 400], [236, 440], [246, 470]]} />
            <Arm pts={[[344, 400], [370, 380], [380, 330]]} />
          </>
        }
      />
      <Crescent x={258} y={394} r={13} rot={-90} />
      <Crescent x={342} y={394} r={13} rot={-90} />
      {/* Wand */}
      <path d="M380 420V250" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M380 420V250" stroke={SUN} strokeWidth="4" strokeLinecap="round" />
      <circle cx={380} cy={244} r={9} fill={SUN} stroke={INK} strokeWidth="2" />
      {/* Chariot body */}
      <path d="M170 540h260v130H170z" {...line} fill={STONE} />
      <path d="M260 590c20-16 60-16 80 0M300 580v30" {...line} />
      <path d="M232 600c-20-10-40-6-52 6M368 600c20-10 40-6 52 6" {...line} fill="none" />
      <circle cx={196} cy={690} r={30} {...line} fill={PAPER} />
      <circle cx={404} cy={690} r={30} {...line} fill={PAPER} />
      <path d="M196 660v60M166 690h60M404 660v60M374 690h60" {...line} strokeWidth="1.4" />
      <Sphinx x={220} y={800} dark />
      <g transform="translate(600 0) scale(-1 1)">
        <Sphinx x={220} y={800} dark={false} />
      </g>
      <path d="M40 800H560" {...line} />
    </CardSvg>
  );
}

export const STRENGTH_ALT =
  "Strength: a woman in a rainbow robe with a garland of flowers and an infinity sign above her head gently closes the jaws of a calm golden lion, under a soft burst of rays with a mountain in the distance.";

export function Strength() {
  return (
    <CardSvg id="major-08-strength" label={STRENGTH_ALT} title="Strength" numeral="VIII">
      <Rays cx={180} cy={450} r0={56} r1={200} count={60} />
      <Mountains x={330} y={560} w={240} h={150} />
      <path d="M170 372c-10-12-30-12-30 0s20 12 30 0 30-12 30 0-20 12-30 0z" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <Lion x={390} y={800} s={1.15} />
      <Person
        id="strength"
        x={170}
        y={450}
        s={0.9}
        colors={["#fbf3e2", "#f7ecd4", SUN, "#f28a2e", "#ee3e86", GREEN]}
        bottom={800}
        hem={100}
        facing="right"
        hair="long"
        hairColor={BLOND}
        arms={
          <>
            <Arm pts={[[202, 510], [240, 600], [298, 690]]} />
            <Arm pts={[[198, 514], [234, 630], [304, 726]]} />
          </>
        }
      />
      {/* Garland */}
      {[[-20, -24], [-6, -29], [9, -27], [22, -18]].map(([dx, dy], i) => (
        <circle key={i} cx={170 + dx} cy={450 + dy} r={5.5} fill={i % 2 ? RED : PAPER} stroke={INK} strokeWidth="1.4" />
      ))}
      {[[140, 574], [158, 592], [178, 598], [198, 590]].map(([fx, fy], i) => (
        <circle key={i} cx={fx} cy={fy} r={6.5} fill={i % 2 ? RED : PAPER} stroke={INK} strokeWidth="1.4" />
      ))}
      <path d="M40 800H560" {...line} />
      <Sparkle x={500} y={300} r={10} />
      <Sparkle x={90} y={250} r={8} />
    </CardSvg>
  );
}

export const HERMIT_ALT =
  "The Hermit: a hooded figure in a grey cloak stands alone on a snowy mountain peak at night, holding up a lantern that shines with a six-pointed star and leaning on a tall staff, with small stars in the dark sky.";

export function TheHermit() {
  return (
    <CardSvg id="major-09-the-hermit" label={HERMIT_ALT} title="The Hermit" numeral="IX">
      <rect x={0} y={0} width={600} height={1000} fill={COBALT} opacity="0.08" />
      {[[90, 160], [520, 120], [470, 230], [130, 330], [560, 380], [60, 480]].map(([sx, sy], i) => (
        <Star5 key={i} x={sx} y={sy} r={i % 2 ? 5 : 8} />
      ))}
      <path d="M0 800L170 610 240 660 330 560 600 800z" {...line} fill={PAPER} />
      <path d="M170 610l20 30 18-14 32 34M330 560l-24 40 24-10 22 24" {...line} strokeWidth="1.6" fill="none" />
      {/* Lantern light */}
      <Rays cx={200} cy={420} r0={30} r1={110} count={36} />
      <Person
        id="hermit"
        x={330}
        y={330}
        colors={["#5a5d6a", "#7c7f8c", "#a5a8b5", "#c9ccd6", "#a5a8b5", "#7c7f8c"]}
        bottom={720}
        hem={110}
        lean={-10}
        facing="left"
        hair="hood"
        over={<path d="M320 350c4 30 10 50 0 70" stroke={CREAM} strokeWidth="10" strokeLinecap="round" fill="none" />}
        arms={
          <>
            <Arm pts={[[296, 400], [256, 420], [214, 402]]} sleeve="#7c7f8c" />
            <Arm pts={[[360, 400], [392, 440], [400, 470]]} sleeve="#7c7f8c" />
          </>
        }
      />
      {/* Beard */}
      <path d="M318 346c-10 20-6 44 4 54 4-14 10-30 14-48z" fill={CREAM} stroke={INK} strokeWidth="1.8" />
      {/* Lantern */}
      <path d="M200 380v14" {...line} />
      <path d="M184 396h32l-4 50h-24z" {...line} fill={SUN} />
      <path d="M200 408l5 9h-10zM200 432l5-9h-10z" fill={PAPER} stroke={INK} strokeWidth="1.2" />
      {/* Staff */}
      <path d="M402 300V730" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M402 300V730" stroke={SUN} strokeWidth="5" strokeLinecap="round" />
    </CardSvg>
  );
}
