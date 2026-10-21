import type { CardContent } from "@/lib/tarot/types";

/**
 * Major Arcana content, indexed by card number (0–21).
 * `traditional` paraphrases Waite's divinatory notes (Pictorial Key, 1911); everything else is
 * contemporary reflective interpretation written for this app.
 */
export const MAJOR_CONTENT: CardContent[] = [
  // 0 — The Fool
  {
    keywords: {
      upright: ["beginnings", "openness", "spontaneity", "trust", "a leap of faith"],
      reversed: ["recklessness", "hesitation", "naivety", "carelessness"],
    },
    traditional:
      "Waite lists folly, extravagance and frenzy for the upright card, and negligence, carelessness and apathy reversed; in his symbolic description the Fool is the spirit setting out in search of experience.",
    symbols: [
      { element: "The cliff edge", meaning: "The threshold of the unknown: the next step cannot be seen, only taken." },
      { element: "The white rose", meaning: "Innocence and a pure motive carried into the journey." },
      { element: "The small bundle", meaning: "Everything the traveller needs is light and already with them; past baggage has been left behind." },
      { element: "The white dog", meaning: "Instinct and loyal companionship, either warning of the edge or urging the traveller on." },
      { element: "The sun and open sky", meaning: "A bright, unclouded beginning and a sense of possibility." },
    ],
    upright:
      "A fresh start asks for curiosity more than certainty. The Fool invites you to begin before you feel fully ready and to treat not-knowing as part of the adventure.",
    reversed:
      "Either the leap is being made without looking, or fear is stopping a step that is genuinely yours to take. Check whether you are being careless or merely cautious.",
    contexts: {
      love: "Approach connection with openness and playfulness rather than a script; a new relationship or a new way of relating can begin here.",
      career: "A new role, project or field is calling; enthusiasm is an asset, but pair it with a little research.",
      finances: "Fresh starts with money are possible, but impulsive spending or untested ventures need a safety net.",
      family: "A household change or new chapter may feel unfamiliar; lightness and curiosity help everyone adjust.",
      growth: "You are being asked to try something as a beginner and to let go of needing to look competent.",
    },
    shadow: "Freedom can become avoidance: drifting from commitment to commitment so nothing has to be finished.",
    misconceptions: [
      "The Fool does not mean the querent is foolish; it describes the innocent, open state of a beginner.",
      "Despite being numbered 0, it is not 'nothing' — zero is the potential that precedes the whole journey.",
    ],
    example:
      "Someone asking whether to join a pottery class after years of only doing work-related learning draws The Fool: the card encourages enrolling for the joy of it, without demanding a clear purpose.",
    reflection: [
      "Where in my life am I waiting to feel ready before beginning?",
      "What would I try if I allowed myself to be a beginner?",
    ],
    memoryAid: "Zero baggage, full sky: the Fool travels light toward the unknown.",
    action: "Take one small, low-risk first step toward something new today, without planning the whole route.",
    related: [
      { id: "major-01-the-magician", reason: "The next step of the journey: potential turns into deliberate skill." },
      { id: "major-21-the-world", reason: "The journey's completion, after which the Fool begins again." },
      { id: "wands-01-ace", reason: "Shares the spark of a new beginning, focused through action." },
    ],
  },
  // 1 — The Magician
  {
    keywords: {
      upright: ["skill", "willpower", "focus", "resourcefulness", "manifestation"],
      reversed: ["manipulation", "scattered energy", "untapped talent", "trickery"],
    },
    traditional:
      "Waite gives skill, diplomacy, subtlety, self-confidence and will for the upright card; reversed he names the physician or magus in a negative sense, disgrace and disquiet.",
    symbols: [
      { element: "Wand raised, hand pointing down", meaning: "'As above, so below': the Magician channels inspiration into the material world." },
      { element: "The four suit tools on the table", meaning: "Wand, cup, sword and pentacle — every resource needed is already present." },
      { element: "The infinity sign", meaning: "Limitless potential and the continuous flow of energy and will." },
      { element: "The serpent belt", meaning: "A snake eating its tail: renewal and the eternal cycle." },
      { element: "Roses and lilies", meaning: "Desire and pure thought cultivated together in the garden." },
    ],
    upright:
      "You have the tools, the skills and the focus to make something real. The Magician asks you to act deliberately and to align intention with concrete steps.",
    reversed:
      "Energy is scattered, talent is going unused, or skill is being used to persuade rather than to serve. Check whether someone — possibly you — is overselling.",
    contexts: {
      love: "Clear, honest communication of what you want can shift a relationship; beware charm that is used as a tactic.",
      career: "A strong moment to pitch, present, launch or demonstrate competence; gather your resources and act.",
      finances: "Resourcefulness can turn what you already have into opportunity; be wary of schemes promising effortless gain.",
      family: "You may be the one who can coordinate or fix a practical problem at home by organising what is available.",
      growth: "Notice the abilities you already possess instead of waiting for new ones; practise a skill with intent.",
    },
    shadow: "Mastery without integrity becomes manipulation: performing confidence to control outcomes or people.",
    misconceptions: [
      "The Magician is not about literal magic; it describes focused will and the skilful use of resources.",
      "It does not promise success automatically — it shows the capacity to act, which still requires action.",
    ],
    example:
      "Someone asking how to approach a job interview draws The Magician: the card points to preparing concrete examples of their skills and presenting them with confidence.",
    reflection: [
      "Which of my resources am I overlooking right now?",
      "Where would focused effort make the biggest difference this week?",
    ],
    memoryAid: "One hand to the sky, one to the ground: the Magician connects idea and action.",
    action: "List the four resources you have for your current goal — energy, feeling, thinking, material — and use one deliberately today.",
    related: [
      { id: "major-00-the-fool", reason: "The open potential the Magician learns to direct." },
      { id: "major-02-the-high-priestess", reason: "Her receptive inner knowing balances his outward action." },
      { id: "pentacles-08-eight", reason: "Skill developed through practical, repeated effort." },
    ],
  },
  // 2 — The High Priestess
  {
    keywords: {
      upright: ["intuition", "inner knowing", "mystery", "stillness", "the unconscious"],
      reversed: ["secrets", "disconnection from intuition", "surface knowledge", "withdrawal"],
    },
    traditional:
      "Waite associates the upright card with secrets, mystery, the future not yet revealed, silence and wisdom; reversed with passion, conceit and surface knowledge.",
    symbols: [
      { element: "The dark and pale pillars", meaning: "Marked B and J, they suggest duality — severity and mercy, unknown and known — with the Priestess seated at the balance point." },
      { element: "The pomegranate veil", meaning: "A threshold to hidden knowledge; what lies behind is glimpsed but not handed over." },
      { element: "The half-hidden scroll", meaning: "Sacred or secret law, only partly revealed." },
      { element: "The crescent moon and lunar crown", meaning: "Cycles, reflection and the intuitive, receptive mind." },
      { element: "Still water beyond the veil", meaning: "The depths of the unconscious, calm on the surface." },
    ],
    upright:
      "The answer may not come from more information but from quiet attention. The High Priestess invites patience, listening and trust in what you sense but cannot yet explain.",
    reversed:
      "You may be ignoring an inner signal, or something is being kept hidden. It can also mean relying on surface facts while avoiding a deeper truth.",
    contexts: {
      love: "Not everything is spoken yet; give the relationship space and notice what you sense rather than forcing disclosure.",
      career: "Hold your counsel, observe before acting, and trust your read of a situation that others have not noticed yet.",
      finances: "Wait for fuller information before committing; hidden terms or details deserve a careful look.",
      family: "Quiet presence may help more than advice; some family matters unfold only when no one pushes.",
      growth: "Make room for stillness — meditation, journaling, dreams — to hear what you already know.",
    },
    shadow: "Silence can become secrecy or aloofness, withholding from others to keep control.",
    misconceptions: [
      "She is not passive or powerless; her stillness is an active, attentive form of knowing.",
      "The card does not reveal a specific secret about another person — it asks you to attend to what is hidden from you, including within yourself.",
    ],
    example:
      "Someone torn between two job offers draws The High Priestess: rather than another spreadsheet, the card suggests sitting quietly with each option and noticing their bodily response.",
    reflection: [
      "What do I already sense about this situation that I haven't admitted?",
      "Where would patience serve me better than action?",
    ],
    memoryAid: "Between the pillars, behind the veil: she knows, and she waits.",
    action: "Spend ten minutes in silence with your question today and write down the first impression that surfaces.",
    related: [
      { id: "major-01-the-magician", reason: "Active will paired with her receptive wisdom." },
      { id: "major-18-the-moon", reason: "Both explore intuition and the unconscious; the Moon adds uncertainty and illusion." },
      { id: "cups-13-queen", reason: "Shares emotional depth and intuitive perception." },
    ],
  },
  // 3 — The Empress
  {
    keywords: {
      upright: ["abundance", "nurturing", "fertility", "creativity", "sensuality"],
      reversed: ["creative block", "dependence", "neglect of self", "smothering"],
    },
    traditional:
      "Waite lists fruitfulness, action, initiative and length of days for the upright card, with difficulty and doubt also possible; reversed he gives light, truth and the unravelling of involved matters, and vacillation.",
    symbols: [
      { element: "Crown of twelve stars", meaning: "Connection to the cycles of the year and the celestial order." },
      { element: "Ripening wheat", meaning: "Harvest and the reward of patient growth." },
      { element: "Venus shield", meaning: "Love, beauty and the creative feminine principle." },
      { element: "Pomegranate robe", meaning: "Fertility and abundance, linking her to the High Priestess's veil." },
      { element: "Forest and waterfall", meaning: "Life flowing freely; nature as nourishment." },
    ],
    upright:
      "Growth comes through care, pleasure and patience. The Empress invites you to nourish what you love — a project, a relationship, your own body — and let it flourish in its own time.",
    reversed:
      "Care may be flowing in only one direction, or creativity feels blocked. Consider whether you are neglecting yourself or over-mothering something that needs room.",
    contexts: {
      love: "Warmth, affection and attentive care can deepen a bond; enjoy the relationship rather than managing it.",
      career: "Creative work and projects that need nurturing are favoured; growth may be gradual but genuine.",
      finances: "A sense of plenty is possible through steady cultivation; enjoy comforts without overspending.",
      family: "Caretaking is central — of children, parents or the home — and so is receiving care in return.",
      growth: "Reconnect with your senses, with nature and with making things for pleasure.",
    },
    shadow: "Nurture can become control or self-erasure: giving so much that you disappear, or holding on too tightly.",
    misconceptions: [
      "The Empress is not only about pregnancy or motherhood; she represents creative abundance in any form.",
      "It is not limited to women — anyone can embody nurturing creativity.",
    ],
    example:
      "Someone asking how to revive a stalled novel draws The Empress: the card suggests writing for pleasure in a beautiful setting rather than forcing a deadline.",
    reflection: [
      "What in my life is ready to grow if I tend it?",
      "How am I nourishing myself this week?",
    ],
    memoryAid: "The Empress is the garden in full bloom: tend it and it feeds you.",
    action: "Do one thing purely for sensory pleasure or care today — cook, walk outdoors, tend a plant — and notice its effect.",
    related: [
      { id: "major-04-the-emperor", reason: "Her nurturing abundance is complemented by his structure." },
      { id: "pentacles-09-nine", reason: "Shares self-sufficient abundance enjoyed in a garden." },
      { id: "pentacles-13-queen", reason: "Practical, earthly nurturing in the suit of Pentacles." },
    ],
  },
  // 4 — The Emperor
  {
    keywords: {
      upright: ["structure", "authority", "stability", "leadership", "protection"],
      reversed: ["rigidity", "domination", "lack of discipline", "misused power"],
    },
    traditional:
      "Waite gives stability, power, protection, realisation, reason and conviction for the upright card; reversed, benevolence and compassion but also obstruction and immaturity.",
    symbols: [
      { element: "Stone throne with ram heads", meaning: "Aries energy: initiative, assertion and solid, lasting authority." },
      { element: "Armour beneath the robe", meaning: "Readiness to defend what has been built." },
      { element: "Ankh sceptre and orb", meaning: "Rule over life and the world: responsibility for the realm." },
      { element: "Barren mountains", meaning: "Hard-won order imposed on a demanding landscape." },
    ],
    upright:
      "Clear structure, boundaries and responsible leadership create the stability you need. The Emperor asks you to take charge, make rules that serve, and follow through.",
    reversed:
      "Structure has become rigid or controlling — or it is missing entirely. Consider whether authority, yours or someone else's, is protecting or dominating.",
    contexts: {
      love: "Reliability and clear commitments support the relationship; watch for one partner controlling the other.",
      career: "Leadership, organisation and accountability are needed; a good time to set systems and expectations.",
      finances: "Budgets, plans and disciplined management build security.",
      family: "Someone needs to provide structure and protection; healthy boundaries make the household feel safe.",
      growth: "Self-discipline and routines turn intentions into results; become the steady authority in your own life.",
    },
    shadow: "Order can harden into tyranny: insisting on control because uncertainty feels unbearable.",
    misconceptions: [
      "The Emperor is not inherently oppressive; healthy authority protects and enables.",
      "It does not always represent a father or a man — it describes a function of structure and leadership.",
    ],
    example:
      "Someone overwhelmed by freelance chaos draws The Emperor: the card suggests setting fixed working hours, a simple invoicing system and clear client boundaries.",
    reflection: [
      "Where do I need firmer structure or boundaries?",
      "Is my need for control serving me or limiting me?",
    ],
    memoryAid: "Rams on a stone throne: the Emperor builds order that lasts.",
    action: "Create one simple rule or routine that would bring order to the area of life that feels most chaotic.",
    related: [
      { id: "major-03-the-empress", reason: "His structure balances her creative abundance." },
      { id: "major-05-the-hierophant", reason: "Worldly authority followed by spiritual and traditional authority." },
      { id: "wands-14-king", reason: "Visionary leadership in the suit of Wands." },
    ],
  },
  // 5 — The Hierophant
  {
    keywords: {
      upright: ["tradition", "teaching", "shared beliefs", "institutions", "mentorship"],
      reversed: ["unconventionality", "challenging dogma", "rigid conformity", "personal beliefs"],
    },
    traditional:
      "Waite lists marriage, alliance, captivity and servitude, as well as mercy, goodness and inspiration, for the upright card; reversed, society, concord, over-kindness and weakness.",
    symbols: [
      { element: "Triple crown and triple cross", meaning: "Authority across several levels of existence; the keeper of a spiritual tradition." },
      { element: "Hand raised in blessing", meaning: "Knowledge passed on through recognised ritual and teaching." },
      { element: "Crossed keys", meaning: "Access to hidden or sacred knowledge, held by the institution." },
      { element: "Two kneeling acolytes", meaning: "Students receiving instruction; learning within a lineage." },
      { element: "Grey pillars", meaning: "The formal structure of the temple or institution." },
    ],
    upright:
      "Learning from a tradition, teacher or community can guide you now. The Hierophant asks what established wisdom offers and where belonging to a shared practice could help.",
    reversed:
      "Conventional answers may not fit. It can signal questioning inherited rules, finding your own path — or, conversely, conforming out of fear.",
    contexts: {
      love: "Shared values and commitments matter; conventional milestones or family expectations may be in focus.",
      career: "Formal training, institutions, credentials or a mentor can help; follow established procedures.",
      finances: "Conventional, well-tested approaches are wiser than speculation; seek qualified advice.",
      family: "Traditions, rituals and inherited values shape the situation; honour them or consciously renegotiate them.",
      growth: "Study with a teacher or within a tradition — then decide which beliefs are truly your own.",
    },
    shadow: "Tradition can become dogma, where belonging requires silencing your own conscience.",
    misconceptions: [
      "The card is not exclusively religious; it covers any formal system of learning or shared belief.",
      "Reversed does not automatically mean rebellion is right — it asks you to examine your relationship to convention.",
    ],
    example:
      "Someone teaching themselves to code draws The Hierophant: the card suggests joining a structured course or finding a mentor rather than continuing alone.",
    reflection: [
      "Which teachings or traditions genuinely support me?",
      "What beliefs have I inherited without examining?",
    ],
    memoryAid: "Keys at his feet, students before him: the Hierophant hands down what was learned.",
    action: "Seek out one trusted teacher, text or community practice relevant to your question this week.",
    related: [
      { id: "major-02-the-high-priestess", reason: "Hidden, inner wisdom versus taught, outer tradition." },
      { id: "pentacles-03-three", reason: "Collaborative learning within an established craft." },
      { id: "major-04-the-emperor", reason: "Temporal authority alongside his spiritual authority." },
    ],
  },
  // 6 — The Lovers
  {
    keywords: {
      upright: ["love", "union", "values-based choice", "harmony", "alignment"],
      reversed: ["disharmony", "misaligned values", "avoidance of choice", "imbalance"],
    },
    traditional:
      "Waite gives attraction, love, beauty and trials overcome for the upright card, and failure and foolish designs reversed.",
    symbols: [
      { element: "The angel above", meaning: "A higher blessing or principle presiding over the union; often linked to healing." },
      { element: "The two figures", meaning: "Two people, or two parts of the self, meeting in openness and honesty." },
      { element: "Tree with serpent and fruit", meaning: "Desire, temptation and the knowledge that comes from choice." },
      { element: "Tree of flames", meaning: "Passion and spiritual energy." },
      { element: "The mountain between them", meaning: "A shared aspiration — or the challenge they must face together." },
    ],
    upright:
      "A meaningful union or a choice rooted in your values is at hand. The Lovers asks you to choose wholeheartedly what you truly value, not what is merely convenient.",
    reversed:
      "Something is out of alignment: values clash, communication falters, or a decision is being avoided. Look at where you are divided within yourself.",
    contexts: {
      love: "Deep connection and mutual choice are highlighted; the question is whether both people's values align.",
      career: "A partnership or decision that must reflect your values; choose work you can fully commit to.",
      finances: "Joint finances or a values-based choice about money; be honest about shared priorities.",
      family: "Harmony depends on honest communication about what each person truly wants.",
      growth: "Integrate opposing parts of yourself; choose in line with who you want to become.",
    },
    shadow: "Romantic idealisation can mask avoidance of a real decision or of incompatibilities.",
    misconceptions: [
      "The Lovers is not only about romance; at its core it is about choice and alignment of values.",
      "It does not guarantee that a specific person feels a certain way or will become your partner.",
    ],
    example:
      "Someone deciding whether to move abroad with a partner draws The Lovers: the card points to an honest conversation about what each of them values in the move.",
    reflection: [
      "What do I truly value in this situation?",
      "Where am I avoiding a choice by keeping all options open?",
    ],
    memoryAid: "Two figures, one blessing: the Lovers choose with the heart and the values aligned.",
    action: "Write down your top three values for this situation and check whether your current choice honours them.",
    related: [
      { id: "cups-02-two", reason: "Mutual attraction and partnership on the emotional plane." },
      { id: "major-15-the-devil", reason: "Mirrors the Lovers' composition, showing attachment without free choice." },
      { id: "major-14-temperance", reason: "Another angelic card concerned with blending and balance." },
    ],
  },
  // 7 — The Chariot
  {
    keywords: {
      upright: ["willpower", "determination", "direction", "victory", "self-mastery"],
      reversed: ["loss of direction", "scattered effort", "aggression", "lack of control"],
    },
    traditional:
      "Waite lists succour, providence, triumph, presumption and trouble for the upright card; reversed, riot, quarrel, dispute and defeat.",
    symbols: [
      { element: "Black and white sphinxes", meaning: "Opposing forces that must be steered together by will rather than reins." },
      { element: "No reins", meaning: "Control comes from inner discipline, not force." },
      { element: "Starry canopy", meaning: "Celestial guidance and the charioteer's higher purpose." },
      { element: "Armour and crescent moons", meaning: "Protection and emotional defences for the journey." },
      { element: "The city behind", meaning: "Leaving the familiar to pursue a goal." },
    ],
    upright:
      "Focused determination carries you forward. The Chariot asks you to harness competing impulses toward one clear direction and keep going.",
    reversed:
      "You may be pulled in opposite directions, pushing too hard, or unsure of the destination. Pause to reclaim direction before forcing progress.",
    contexts: {
      love: "Progress requires both people moving in the same direction; avoid trying to 'win' the relationship.",
      career: "Drive and discipline bring success against competition; set a clear target and commit.",
      finances: "Steady, focused effort toward a specific financial goal pays off.",
      family: "Someone must steer conflicting needs toward a shared plan without steamrolling others.",
      growth: "Master your impulses; use determination to move through obstacles rather than around them.",
    },
    shadow: "Determination becomes domination: winning at all costs or refusing to change course.",
    misconceptions: [
      "The Chariot does not always mean literal travel or vehicles, though it can.",
      "Victory here is earned through self-control; it is not guaranteed luck.",
    ],
    example:
      "Someone training for a marathon while managing a busy job draws The Chariot: the card highlights a disciplined schedule that unites both commitments.",
    reflection: [
      "What two forces in me need to pull in the same direction?",
      "What exactly is my destination?",
    ],
    memoryAid: "Two sphinxes, no reins: the Chariot steers by will alone.",
    action: "Name one concrete goal and the single next action that moves you toward it — then do it today.",
    related: [
      { id: "major-08-strength", reason: "Strength tames with gentleness where the Chariot directs with will." },
      { id: "wands-06-six", reason: "Victory and public recognition after effort." },
      { id: "swords-12-knight", reason: "Driven forward motion — sometimes too fast." },
    ],
  },
  // 8 — Strength
  {
    keywords: {
      upright: ["courage", "compassion", "gentle strength", "patience", "inner resilience"],
      reversed: ["self-doubt", "insecurity", "raw emotion", "forcefulness"],
    },
    traditional:
      "Waite gives power, energy, action, courage, magnanimity and complete success for the upright card; reversed, despotism, abuse of power, weakness and discord. (Waite placed Strength at VIII, exchanging it with Justice.)",
    symbols: [
      { element: "The woman closing the lion's jaws", meaning: "Instinct and passion mastered through gentleness, not violence." },
      { element: "The infinity sign", meaning: "The same limitless energy seen above the Magician, now expressed as patient power." },
      { element: "The flower garland", meaning: "Beauty and nature binding wild force softly." },
      { element: "The calm lion", meaning: "Desire, anger or fear that has been befriended rather than defeated." },
    ],
    upright:
      "True strength is patient, compassionate and steady. This card asks you to meet fear or strong emotion with calm courage instead of force.",
    reversed:
      "Self-doubt or overwhelming emotion may be in charge. Alternatively, you may be trying to dominate something that needs gentleness.",
    contexts: {
      love: "Patience and kindness, especially in tense moments, strengthen trust; gentleness is not weakness.",
      career: "Quiet confidence and emotional steadiness earn respect; handle difficult people with composure.",
      finances: "Resist impulsive reactions; steady self-control protects your resources.",
      family: "Compassionate firmness helps — especially with children or anyone acting out of fear.",
      growth: "Befriend your instincts and emotions rather than suppressing them; courage grows with practice.",
    },
    shadow: "Endurance can turn into suppressing your own needs to keep the peace.",
    misconceptions: [
      "Strength is not about physical power or aggression.",
      "In some decks this card is numbered XI; Waite's numbering places it at VIII. Both conventions are valid.",
    ],
    example:
      "Someone dreading a difficult conversation with a sibling draws Strength: the card suggests going in calmly, listening first and holding their position without hostility.",
    reflection: [
      "What strong feeling in me needs gentle handling rather than control?",
      "Where have I already shown quiet courage?",
    ],
    memoryAid: "A gentle hand on the lion's jaw: Strength wins by kindness.",
    action: "When a strong reaction arises today, take three slow breaths before responding.",
    related: [
      { id: "major-07-the-chariot", reason: "Will directed outward versus courage directed inward." },
      { id: "wands-09-nine", reason: "Resilience and persistence under pressure." },
      { id: "major-11-justice", reason: "The card Waite swapped in numbering with Strength." },
    ],
  },
  // 9 — The Hermit
  {
    keywords: {
      upright: ["introspection", "solitude", "inner guidance", "wisdom", "searching"],
      reversed: ["isolation", "loneliness", "withdrawal", "avoiding reflection"],
    },
    traditional:
      "Waite lists prudence and circumspection, but also dissimulation and corruption, for the upright card; reversed, concealment, disguise, fear and unreasoned caution.",
    symbols: [
      { element: "The lantern with a six-pointed star", meaning: "Inner wisdom that lights only the next step." },
      { element: "The mountain peak", meaning: "Hard-won perspective achieved through effort and solitude." },
      { element: "The staff", meaning: "Support, patience and steady progress on the path." },
      { element: "The grey cloak", meaning: "Humility and withdrawal from worldly attention." },
    ],
    upright:
      "Step back from noise to find your own answers. The Hermit invites solitude, reflection and seeking guidance from within — or from a wise mentor.",
    reversed:
      "Solitude may have become isolation, or you may be avoiding the reflection you need. Consider whether it is time to come down the mountain and reconnect.",
    contexts: {
      love: "Time alone to understand your own needs may be necessary before or within a relationship.",
      career: "Deep, focused, independent work or a period of reassessing your direction is favoured.",
      finances: "Review your finances quietly and carefully before making decisions.",
      family: "Someone may need space; respecting solitude can preserve closeness.",
      growth: "Retreat, contemplation and study lead to authentic insight.",
    },
    shadow: "Wisdom can become aloofness — withdrawing so that no one can challenge or reach you.",
    misconceptions: [
      "The Hermit does not predict permanent loneliness; solitude is chosen and purposeful.",
      "It does not always mean physically being alone — it can be an inner withdrawal for reflection.",
    ],
    example:
      "Someone feeling lost after graduating draws The Hermit: the card suggests a reflective period of journaling and conversations with a mentor before committing to a path.",
    reflection: [
      "What answer might I hear if the world were quieter?",
      "Is my solitude nourishing me or hiding me?",
    ],
    memoryAid: "A lantern on the mountain: the Hermit lights one step at a time.",
    action: "Schedule thirty minutes of uninterrupted solitude this week to reflect on your question.",
    related: [
      { id: "major-02-the-high-priestess", reason: "Both turn inward; the Hermit actively seeks while she receives." },
      { id: "swords-04-four", reason: "Rest and retreat for recovery and clarity." },
      { id: "cups-08-eight", reason: "Walking away from the familiar in search of deeper meaning." },
    ],
  },
  // 10 — Wheel of Fortune
  {
    keywords: {
      upright: ["cycles", "change", "turning points", "fortune", "timing"],
      reversed: ["resistance to change", "setbacks", "feeling out of control", "repeating patterns"],
    },
    traditional:
      "Waite gives destiny, fortune, success, elevation and luck for the upright card; reversed, increase, abundance and superfluity.",
    symbols: [
      { element: "The great wheel", meaning: "The ceaseless turning of fortune, seasons and life cycles." },
      { element: "Sphinx with sword", meaning: "Wisdom and balance presiding over change." },
      { element: "Serpent descending", meaning: "The downward phase of the cycle — descent into matter or difficulty." },
      { element: "Jackal-headed figure rising", meaning: "The upward phase — rising fortunes and renewal." },
      { element: "Four winged creatures reading", meaning: "The fixed signs of the zodiac and the elements: stability and learning amid change." },
    ],
    upright:
      "Circumstances are turning. The Wheel invites you to recognise cycles, adapt to change and make the most of a moment of momentum.",
    reversed:
      "Change may feel like a setback, or you may be resisting a cycle that needs to turn. Look for the pattern you keep repeating.",
    contexts: {
      love: "A relationship may be entering a new phase; flexibility helps you meet it.",
      career: "Unexpected opportunities or shifts; timing matters, so be ready to act.",
      finances: "Finances move in cycles; prepare for downturns in good times and stay steady in lean ones.",
      family: "Life-stage changes — births, moves, ageing — are reshaping family roles.",
      growth: "Notice recurring patterns in your life and what they are teaching you.",
    },
    shadow: "Believing everything is fate can become a reason to avoid responsibility for your choices.",
    misconceptions: [
      "The Wheel does not mean luck is guaranteed; it describes change, which can bring ups or downs.",
      "It does not mean your choices are irrelevant — how you respond to change still matters.",
    ],
    example:
      "Someone whose company announced a restructure draws the Wheel of Fortune: the card suggests treating the change as a turning point and preparing for new opportunities.",
    reflection: [
      "What cycle in my life is turning right now?",
      "What pattern keeps returning, and what is it asking of me?",
    ],
    memoryAid: "What rises falls and what falls rises: the Wheel keeps turning.",
    action: "Identify one pattern that repeats in your life and write down one way to respond differently next time.",
    related: [
      { id: "major-21-the-world", reason: "Shares the four creatures in its corners; completion of a cycle." },
      { id: "major-11-justice", reason: "Fortune balanced by the consequences of choices." },
      { id: "pentacles-02-two", reason: "Adapting gracefully to fluctuating circumstances." },
    ],
  },
  // 11 — Justice
  {
    keywords: {
      upright: ["fairness", "truth", "accountability", "cause and effect", "clarity"],
      reversed: ["unfairness", "dishonesty", "avoiding accountability", "bias"],
    },
    traditional:
      "Waite lists equity, rightness, probity and the triumph of the deserving side in law for the upright card; reversed, legal complications, bias and excessive severity.",
    symbols: [
      { element: "The upright double-edged sword", meaning: "Clear, impartial decision that cuts both ways." },
      { element: "The balanced scales", meaning: "Weighing evidence and outcomes fairly." },
      { element: "The pillars and veil", meaning: "A formal threshold of judgement, echoing the High Priestess." },
      { element: "The visible white shoe", meaning: "Readiness to act on a decision once it is made." },
    ],
    upright:
      "Honesty and fairness lead the way. Justice asks you to look clearly at the facts, take responsibility for your part and make a balanced decision.",
    reversed:
      "Something feels unfair, or accountability is being avoided. Check your own biases as well as others' before judging.",
    contexts: {
      love: "Fairness and honest reciprocity matter; address imbalances directly.",
      career: "Contracts, decisions and evaluations should be handled transparently; integrity is noticed.",
      finances: "Read the fine print, settle debts and keep accurate records.",
      family: "Fair distribution of responsibility and honest conversations restore balance.",
      growth: "Own the consequences of your choices; align actions with your principles.",
    },
    shadow: "Judgement can harden into self-righteousness or harshness without compassion.",
    misconceptions: [
      "Justice does not guarantee winning a legal case; it emphasises fair process and consequences.",
      "Numbering differs between traditions: Waite places Justice at XI; older Marseille-style decks place it at VIII.",
    ],
    example:
      "Someone unsure whether to report a billing error in their favour draws Justice: the card points toward honesty and correcting the record.",
    reflection: [
      "What are the facts here, separate from my feelings about them?",
      "What is my part in this situation?",
    ],
    memoryAid: "Sword up, scales level: Justice weighs truly and cuts cleanly.",
    action: "Write down both sides of a decision you are facing as fairly as you can, then choose.",
    related: [
      { id: "swords-14-king", reason: "Clear, principled judgement in the suit of Swords." },
      { id: "major-20-judgement", reason: "Final evaluation and accountability on a larger scale." },
      { id: "major-08-strength", reason: "The card exchanged with Justice in Waite's numbering." },
    ],
  },
  // 12 — The Hanged Man
  {
    keywords: {
      upright: ["surrender", "pause", "new perspective", "letting go", "suspension"],
      reversed: ["stalling", "resistance", "needless sacrifice", "indecision"],
    },
    traditional:
      "Waite gives wisdom, circumspection, discernment, trials, sacrifice and intuition for the upright card; reversed, selfishness and the crowd.",
    symbols: [
      { element: "Hanging upside down by one foot", meaning: "A voluntary reversal of perspective; seeing the world differently." },
      { element: "The halo", meaning: "Insight and illumination that come from surrender." },
      { element: "The living T-shaped tree", meaning: "Growth and life continuing even during suspension." },
      { element: "Crossed leg", meaning: "A deliberate, composed posture — this is acceptance, not punishment." },
    ],
    upright:
      "Progress comes from pausing and seeing things differently. The Hanged Man invites you to let go of forcing an outcome and allow a new perspective to emerge.",
    reversed:
      "You may be stuck in limbo, resisting a necessary pause, or sacrificing without purpose. Ask what you are waiting for.",
    contexts: {
      love: "Stop pushing for resolution; viewing the relationship from your partner's perspective may reveal something new.",
      career: "A delay or pause can be used to rethink your approach rather than forcing progress.",
      finances: "Hold off on major moves; reassess priorities before committing money.",
      family: "Letting go of being right can shift a stuck dynamic.",
      growth: "Surrender control and see what the pause teaches you.",
    },
    shadow: "Waiting can become martyrdom or a way of avoiding decisions indefinitely.",
    misconceptions: [
      "The Hanged Man is not about punishment or literal hanging; the figure is serene.",
      "It does not mean nothing is happening — inner change often occurs during outer stillness.",
    ],
    example:
      "Someone frustrated that a house sale has stalled draws The Hanged Man: the card suggests using the pause to reconsider whether this move is still the right one.",
    reflection: [
      "What would change if I looked at this from the opposite angle?",
      "What am I trying to force that might need to be released?",
    ],
    memoryAid: "Upside down and haloed: the Hanged Man sees anew by letting go.",
    action: "Describe your situation from the viewpoint of someone who disagrees with you.",
    related: [
      { id: "swords-04-four", reason: "Rest and suspension that prepares for renewal." },
      { id: "major-13-death", reason: "Surrender precedes transformation." },
      { id: "cups-04-four", reason: "Withdrawal that can either stagnate or reveal new options." },
    ],
  },
  // 13 — Death
  {
    keywords: {
      upright: ["endings", "transformation", "transition", "release", "clearing"],
      reversed: ["resisting change", "stagnation", "fear of endings", "lingering"],
    },
    traditional:
      "Waite lists end, mortality, destruction and corruption for the upright card; reversed, inertia, sleep, lethargy and petrifaction.",
    symbols: [
      { element: "Skeleton in armour on a white horse", meaning: "The inevitable, impartial force of change." },
      { element: "Banner with a white rose", meaning: "Purity and the promise of renewal within endings." },
      { element: "Figures of king, bishop, maiden and child", meaning: "Change comes to everyone regardless of status." },
      { element: "Sun rising between two towers", meaning: "A new day — rebirth after the ending." },
      { element: "River with a boat", meaning: "The passage from one state to another." },
    ],
    upright:
      "Something is ending so that something new can begin. Death asks you to accept a transition, release what is complete and make space for transformation.",
    reversed:
      "Clinging to what is over keeps you stuck. Notice where fear of an ending is preventing natural change.",
    contexts: {
      love: "A relationship pattern — or a relationship — may be ending or transforming into something different.",
      career: "A job, role or approach is concluding; transition opens the door to new work.",
      finances: "Old financial habits need to end; restructuring creates healthier foundations.",
      family: "Family roles are changing; grieving the old form allows a new one to emerge.",
      growth: "Let an outdated identity or belief go; transformation follows release.",
    },
    shadow: "Fear of loss can lead to holding on long after something has died.",
    misconceptions: [
      "The Death card almost never means literal physical death in reflective practice; it symbolises transformation and endings.",
      "It is not inherently negative — endings are often relief and renewal.",
    ],
    example:
      "Someone asking about a friendship that has felt hollow for years draws Death: the card suggests acknowledging that the old form has ended and allowing it to change.",
    reflection: [
      "What in my life has already ended that I have not yet released?",
      "What might grow in the space that an ending creates?",
    ],
    memoryAid: "A white rose on a black banner, a sun between towers: Death clears the way for dawn.",
    action: "Let go of one thing — an object, habit or commitment — that belongs to a finished chapter.",
    related: [
      { id: "major-12-the-hanged-man", reason: "Surrender that precedes transformation." },
      { id: "major-20-judgement", reason: "Rebirth and awakening after an ending." },
      { id: "swords-10-ten", reason: "A painful ending with dawn breaking on the horizon." },
    ],
  },
  // 14 — Temperance
  {
    keywords: {
      upright: ["balance", "moderation", "patience", "blending", "healing"],
      reversed: ["imbalance", "excess", "impatience", "discord"],
    },
    traditional:
      "Waite gives economy, moderation, frugality, management and accommodation for the upright card; reversed, disunion, unfortunate combinations and competing interests.",
    symbols: [
      { element: "Water poured between two cups", meaning: "Blending opposites into a balanced whole; alchemy and patience." },
      { element: "One foot on land, one in water", meaning: "Balance between material and emotional realms." },
      { element: "The angel", meaning: "Healing and guidance — often associated with the archangel Michael." },
      { element: "Path to a crowned light", meaning: "The long, steady road toward integration and purpose." },
      { element: "Irises", meaning: "Messages and the bridge between worlds." },
    ],
    upright:
      "Patience and moderation bring healing. Temperance invites you to blend different elements wisely, find the middle way and let things develop in their own time.",
    reversed:
      "Something is out of balance — excess, impatience or conflicting priorities. Look for what needs to be dialled down or brought back into proportion.",
    contexts: {
      love: "Compromise and patience help two different people find a harmonious rhythm.",
      career: "Collaboration and balancing competing demands lead to steady progress.",
      finances: "Moderate, consistent saving and spending create stability.",
      family: "A calm mediator can blend different personalities and needs.",
      growth: "Integrate opposing parts of yourself; healing happens gradually.",
    },
    shadow: "Moderation can become avoidance of strong feelings or necessary conflict.",
    misconceptions: [
      "Temperance is not about abstinence; it is about the right mixture.",
      "Patience here is active refinement, not passivity.",
    ],
    example:
      "Someone burning out from overwork draws Temperance: the card points to a sustainable rhythm that blends effort and rest.",
    reflection: [
      "What in my life is out of proportion?",
      "Which two things could I blend rather than choose between?",
    ],
    memoryAid: "Water flowing between cups: Temperance finds the perfect mix.",
    action: "Identify one area of excess and reduce it by a small, sustainable amount this week.",
    related: [
      { id: "major-06-the-lovers", reason: "Another angelic card about bringing opposites together." },
      { id: "cups-06-six", reason: "Gentle, nourishing exchange." },
      { id: "major-15-the-devil", reason: "The next card shows what happens when moderation is lost." },
    ],
  },
  // 15 — The Devil
  {
    keywords: {
      upright: ["attachment", "compulsion", "materialism", "shadow self", "restriction"],
      reversed: ["release", "breaking free", "reclaiming power", "awareness of patterns"],
    },
    traditional:
      "Waite lists ravage, violence, vehemence, force and fatality for the upright card — 'that which is predestined but is not for this reason evil'; reversed, evil fatality, weakness and blindness.",
    symbols: [
      { element: "The horned figure", meaning: "Instinctive appetites and the shadow side given power over us." },
      { element: "Loose chains on the couple", meaning: "Bondage that is partly self-chosen — the chains could be lifted off." },
      { element: "The inverted pentagram", meaning: "Material concerns placed above spirit." },
      { element: "The lowered torch", meaning: "Energy directed downward into compulsion." },
      { element: "Echo of the Lovers", meaning: "The same couple, now bound rather than blessed." },
    ],
    upright:
      "Something holds more power over you than it should — a habit, fear, relationship or desire. The Devil asks you to see the chain clearly and recognise that it may be looser than it looks.",
    reversed:
      "Awareness is growing and release is possible. You may be ready to break a pattern or reclaim choice — though old habits may pull back.",
    contexts: {
      love: "Look at patterns of dependency, jealousy or control; passion is healthiest when freely chosen.",
      career: "Feeling trapped by money, status or a toxic environment; consider what you are trading for security.",
      finances: "Debt, overspending or compulsive habits deserve honest attention.",
      family: "Unhealthy dynamics or obligations may feel binding; awareness is the first step to change.",
      growth: "Face your shadow without shame — understanding a compulsion begins to loosen it.",
    },
    shadow: "Denial — insisting there is no chain at all — keeps the pattern in place.",
    misconceptions: [
      "The Devil does not indicate literal evil or supernatural forces; it symbolises attachment and compulsion.",
      "It does not mean you are a bad person; it points to patterns that limit freedom.",
    ],
    example:
      "Someone asking why they cannot stop checking their phone at night draws The Devil: the card reflects a compulsive habit and invites them to notice how loose the chain really is.",
    reflection: [
      "What has more power over me than I want it to?",
      "What do I gain from this attachment, and what does it cost?",
    ],
    memoryAid: "Chains loose around their necks: the Devil binds only those who stay.",
    action: "Name one compulsive habit and create one small barrier to it today.",
    related: [
      { id: "major-06-the-lovers", reason: "Its compositional mirror: free choice versus bondage." },
      { id: "swords-08-eight", reason: "Feeling trapped by restrictions that are partly mental." },
      { id: "major-16-the-tower", reason: "What happens when false structures are finally broken." },
    ],
  },
  // 16 — The Tower
  {
    keywords: {
      upright: ["sudden change", "upheaval", "revelation", "collapse of illusions", "awakening"],
      reversed: ["averted disaster", "fear of change", "delayed upheaval", "inner transformation"],
    },
    traditional:
      "Waite lists misery, distress, adversity, calamity, deception and ruin — unforeseen catastrophe — for the upright card; reversed, the same in a lesser degree, as well as oppression and imprisonment.",
    symbols: [
      { element: "Lightning striking the tower", meaning: "Sudden truth or revelation that shatters false structures." },
      { element: "The crown blown off", meaning: "Ego, pride or false authority overthrown." },
      { element: "Falling figures", meaning: "Being thrown out of old certainties without warning." },
      { element: "Falling flame-drops", meaning: "Divine sparks — insight within the destruction." },
      { element: "The rocky crag", meaning: "Foundations that were never as secure as they seemed." },
    ],
    upright:
      "Something built on unstable foundations is coming down. The Tower can be shocking, but it clears away illusions so that you can rebuild on truth.",
    reversed:
      "Upheaval may be internal, delayed or narrowly avoided. Resisting a necessary collapse can prolong the discomfort.",
    contexts: {
      love: "A revelation may shake the relationship; honesty, though painful, creates a more truthful foundation.",
      career: "Sudden change — restructuring, a project collapsing — forces a rethink of direction.",
      finances: "Unexpected expenses or losses highlight weak financial foundations; build an emergency buffer.",
      family: "A disruptive event or truth surfaces; stability can be rebuilt on more honest ground.",
      growth: "A breakthrough in awareness tears down a belief that no longer holds.",
    },
    shadow: "Clinging to the ruins and refusing to see what the collapse revealed.",
    misconceptions: [
      "The Tower does not predict disasters; it symbolises the collapse of false structures and illusions.",
      "It is not purely negative — liberation often follows the shock.",
    ],
    example:
      "Someone whose long-term plan suddenly falls through draws The Tower: the card reflects the shock and invites them to notice what the collapse revealed about the plan's foundations.",
    reflection: [
      "What structure in my life rests on a shaky foundation?",
      "What truth has recently broken through?",
    ],
    memoryAid: "Lightning strikes the crown: the Tower falls so truth can stand.",
    action: "Identify one assumption that recent events have challenged and write down what you now know instead.",
    related: [
      { id: "major-17-the-star", reason: "Hope and healing following the upheaval." },
      { id: "major-13-death", reason: "Transformation through endings, slower and more natural." },
      { id: "swords-03-three", reason: "Painful truth that clears the way for healing." },
    ],
  },
  // 17 — The Star
  {
    keywords: {
      upright: ["hope", "renewal", "inspiration", "healing", "serenity"],
      reversed: ["discouragement", "lack of faith", "disconnection", "despondency"],
    },
    traditional:
      "Waite records loss, theft and abandonment for the upright card while noting another reading of hope and bright prospects; reversed, arrogance, haughtiness and impotence. Modern practice almost universally follows the 'hope' reading.",
    symbols: [
      { element: "The great eight-pointed star", meaning: "Guidance, inspiration and hope after darkness." },
      { element: "Seven smaller stars", meaning: "The classical planets or chakras: harmony across levels." },
      { element: "Water poured on land and pool", meaning: "Renewal of both emotional and material life; generosity flowing freely." },
      { element: "The unadorned figure", meaning: "Vulnerability and authenticity — nothing left to hide." },
      { element: "The ibis in the tree", meaning: "Thought, wisdom and the soul's renewal." },
    ],
    upright:
      "After difficulty, hope returns. The Star invites gentle healing, renewed faith in the future and openness to inspiration.",
    reversed:
      "Hope feels distant or faith has faded. Small acts of self-care and reconnection with what inspires you can relight the star.",
    contexts: {
      love: "Healing and renewed openness are possible; vulnerability and honesty restore connection.",
      career: "Inspiration returns; pursue work that feels meaningful and aligned with your hopes.",
      finances: "Recovery after a setback is possible through steady, hopeful steps.",
      family: "A period of calm and healing after tension; gentle generosity helps.",
      growth: "Reconnect with purpose and trust that renewal is underway.",
    },
    shadow: "Hope without action can become passive wishing.",
    misconceptions: [
      "The Star does not guarantee wishes will come true; it represents hope and renewal.",
      "Waite listed loss among its meanings, but the hopeful reading has become standard; both are recorded here for transparency.",
    ],
    example:
      "Someone recovering from a long illness draws The Star: the card reflects gradual renewal and encourages gentle optimism.",
    reflection: [
      "What gives me hope right now?",
      "How can I pour something back into the world from what I have received?",
    ],
    memoryAid: "Water poured beneath a great star: hope flows back after the storm.",
    action: "Write down one hope for the coming month and one small step that nourishes it.",
    related: [
      { id: "major-16-the-tower", reason: "The upheaval the Star heals from." },
      { id: "major-18-the-moon", reason: "The next stage: navigating uncertainty by moonlight." },
      { id: "cups-01-ace", reason: "Overflowing emotional renewal." },
    ],
  },
  // 18 — The Moon
  {
    keywords: {
      upright: ["uncertainty", "illusion", "intuition", "dreams", "the unconscious"],
      reversed: ["clarity emerging", "releasing fear", "confusion lifting", "repressed feelings"],
    },
    traditional:
      "Waite lists hidden enemies, danger, darkness, deception and error for the upright card; reversed, instability, inconstancy and lesser degrees of deception.",
    symbols: [
      { element: "The moon with a face", meaning: "Reflected, changing light: things are not fully visible." },
      { element: "Dog and wolf", meaning: "The tamed and wild sides of our nature responding to the moon." },
      { element: "Crayfish emerging from the pool", meaning: "Deep fears and unconscious material rising to the surface." },
      { element: "Path between two towers", meaning: "The uncertain road into the unknown between familiar boundaries." },
      { element: "Falling drops", meaning: "Influence and nourishment descending, even in darkness." },
    ],
    upright:
      "Not everything is clear, and fear or imagination may distort what you see. The Moon asks you to move carefully, trust intuition and avoid jumping to conclusions.",
    reversed:
      "Confusion is beginning to lift, or suppressed fears are surfacing to be faced. Clarity returns as you name what was hidden.",
    contexts: {
      love: "Uncertainty or projections may cloud the relationship; avoid assumptions and seek honest clarity.",
      career: "Information may be incomplete; verify facts before acting and trust your instincts about what is off.",
      finances: "Be cautious with unclear deals or unknown terms; read carefully.",
      family: "Unspoken fears or misunderstandings may be at play; gentle questions help.",
      growth: "Explore dreams, fears and the unconscious; not every fear reflects reality.",
    },
    shadow: "Anxiety can become self-deception, building stories that feel true but are not.",
    misconceptions: [
      "The Moon does not prove someone is deceiving you; it points to uncertainty and the need for clarity.",
      "It is not purely negative — it is also the card of intuition and imagination.",
    ],
    example:
      "Someone anxious about a vague message from their manager draws The Moon: the card suggests asking for clarification instead of imagining the worst.",
    reflection: [
      "What am I assuming without evidence?",
      "What is my intuition telling me beneath the fear?",
    ],
    memoryAid: "Dog and wolf howl at the moon: the path is real, but the shadows deceive.",
    action: "Write down one fear about your situation, then list what you actually know for certain.",
    related: [
      { id: "major-02-the-high-priestess", reason: "Intuition and hidden knowledge, but calmer and clearer." },
      { id: "major-19-the-sun", reason: "The clarity and joy that follow the night." },
      { id: "cups-07-seven", reason: "Illusions and fantasies that cloud judgement." },
    ],
  },
  // 19 — The Sun
  {
    keywords: {
      upright: ["joy", "vitality", "success", "clarity", "warmth"],
      reversed: ["temporary setbacks", "dimmed enthusiasm", "overconfidence", "inner child blocked"],
    },
    traditional:
      "Waite gives material happiness, fortunate marriage and contentment for the upright card; reversed, the same in a lesser sense.",
    symbols: [
      { element: "The radiant sun", meaning: "Life-giving energy, clarity and consciousness." },
      { element: "The child on a white horse", meaning: "Innocence, joy and freedom — the renewed self." },
      { element: "Sunflowers", meaning: "Growth turning toward the light; abundance." },
      { element: "The garden wall", meaning: "Safety and the cultivated life left behind for open joy." },
      { element: "The banner", meaning: "Celebration and the victory of vitality." },
    ],
    upright:
      "Clarity, warmth and joy shine on the situation. The Sun invites you to celebrate, express yourself openly and enjoy what is going well.",
    reversed:
      "Joy may be dimmed temporarily, or optimism has tipped into overconfidence. The light is still there; let yourself feel it.",
    contexts: {
      love: "Warmth, openness and shared happiness characterise the relationship.",
      career: "Success, recognition and confidence; your work is seen clearly.",
      finances: "A positive, stable period; enjoy it while keeping sensible habits.",
      family: "Joyful time together, play and celebration strengthen bonds.",
      growth: "Reconnect with playfulness and authentic self-expression.",
    },
    shadow: "Relentless positivity can avoid acknowledging real problems.",
    misconceptions: [
      "Reversed Sun is rarely read as negative; it usually indicates a softer or delayed form of joy.",
      "The card does not guarantee success in a specific venture; it reflects clarity and vitality.",
    ],
    example:
      "Someone wondering whether to share their art online draws The Sun: the card encourages confident, joyful self-expression.",
    reflection: [
      "What is going well that I could celebrate more fully?",
      "When did I last feel playful?",
    ],
    memoryAid: "A child on a white horse under a smiling sun: pure, open joy.",
    action: "Do one thing today simply because it brings you joy, and share it with someone.",
    related: [
      { id: "major-18-the-moon", reason: "The night of uncertainty before the Sun's clarity." },
      { id: "cups-10-ten", reason: "Emotional fulfilment and family happiness." },
      { id: "wands-04-four", reason: "Celebration and homecoming." },
    ],
  },
  // 20 — Judgement
  {
    keywords: {
      upright: ["awakening", "reckoning", "renewal", "calling", "absolution"],
      reversed: ["self-doubt", "harsh self-judgement", "ignoring a calling", "stagnation"],
    },
    traditional:
      "Waite lists change of position, renewal and outcome for the upright card; reversed, weakness, cowardice and simplicity, as well as deliberation, decision and sentence.",
    symbols: [
      { element: "The angel with a trumpet", meaning: "A call to awaken and rise to a higher purpose." },
      { element: "Figures rising from coffins", meaning: "Rebirth and liberation from the past." },
      { element: "The red-cross banner", meaning: "Balance and the meeting of spiritual and material." },
      { element: "Mountains and water", meaning: "The vast perspective available once one rises." },
    ],
    upright:
      "A call is sounding — to reflect on your path, forgive the past and rise into a new chapter. Judgement asks you to answer it honestly.",
    reversed:
      "Self-criticism or fear may stop you from responding to a calling. Release harsh judgement so you can move forward.",
    contexts: {
      love: "Reflect honestly on relationship patterns; forgiveness or a renewed commitment may be needed.",
      career: "A calling or significant reassessment; consider whether your work reflects who you are becoming.",
      finances: "Review past decisions, learn from them and make a fresh plan.",
      family: "Reconciliation and honest reckoning can renew family bonds.",
      growth: "Wake up to your purpose; let go of past versions of yourself.",
    },
    shadow: "Reckoning can become relentless self-judgement that prevents renewal.",
    misconceptions: [
      "Judgement is not about being judged by others; it is about self-reflection and awakening.",
      "It does not predict a specific external verdict.",
    ],
    example:
      "Someone considering returning to study after years away draws Judgement: the card reflects a calling that invites them to rise to a new chapter.",
    reflection: [
      "What is calling me forward right now?",
      "What past mistake am I ready to forgive?",
    ],
    memoryAid: "A trumpet sounds and the sleepers rise: Judgement calls you to awaken.",
    action: "Write a short letter forgiving yourself for one past decision, and name what you choose now.",
    related: [
      { id: "major-13-death", reason: "Endings that make room for rebirth." },
      { id: "major-11-justice", reason: "Accountability on a personal rather than universal scale." },
      { id: "major-21-the-world", reason: "The completion that follows awakening." },
    ],
  },
  // 21 — The World
  {
    keywords: {
      upright: ["completion", "wholeness", "achievement", "integration", "fulfilment"],
      reversed: ["incompletion", "lack of closure", "delays", "seeking shortcuts"],
    },
    traditional:
      "Waite gives assured success, recompense, voyage, change of place and emigration for the upright card; reversed, inertia, fixity, stagnation and permanence.",
    symbols: [
      { element: "The dancing figure", meaning: "Freedom and joy in harmony with the whole." },
      { element: "The laurel wreath", meaning: "Victory, completion and the cycle closed." },
      { element: "Infinity ribbons", meaning: "Continuity: every ending opens a new cycle." },
      { element: "Four creatures in the corners", meaning: "The four elements and fixed signs integrated in balance." },
      { element: "Two wands", meaning: "Mastery of opposites, held lightly." },
    ],
    upright:
      "A cycle reaches completion and integration. The World invites you to recognise what you have achieved, celebrate it and prepare for the next journey.",
    reversed:
      "Something remains unfinished, or closure is missing. Look at the loose ends that need tying up before you move on.",
    contexts: {
      love: "A relationship reaches a fulfilling milestone, or you feel whole within yourself.",
      career: "Completion of a major project or goal; recognition and readiness for a new challenge.",
      finances: "A financial goal is reached; secure it and plan the next stage.",
      family: "A family chapter closes harmoniously; celebrate shared milestones.",
      growth: "You have integrated important lessons; feel the wholeness before beginning again.",
    },
    shadow: "Fear of finishing — staying in the familiar cycle to avoid the unknown next one.",
    misconceptions: [
      "The World is not a permanent end point; completion leads naturally back to the Fool.",
      "It does not always mean literal world travel, though Waite included voyage among its meanings.",
    ],
    example:
      "Someone finishing a degree draws The World: the card reflects completion and encourages celebrating before starting the next chapter.",
    reflection: [
      "What have I completed that I haven't fully acknowledged?",
      "What loose ends need closure before I move on?",
    ],
    memoryAid: "A dancer in a laurel wreath: the World completes the circle.",
    action: "Mark a recent completion with a small ritual or celebration, and note one lesson it taught you.",
    related: [
      { id: "major-00-the-fool", reason: "The beginning that follows completion." },
      { id: "major-10-wheel-of-fortune", reason: "Shares the four creatures; cycles and wholeness." },
      { id: "cups-10-ten", reason: "Emotional fulfilment and harmony." },
    ],
  },
];
