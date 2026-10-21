import type { Lesson } from "./types";

const v = "1.0.0";

export const BEGINNER_LESSONS: Lesson[] = [
  {
    id: "beginner-01-introduction",
    title: "Level 1 · Introduction to tarot",
    summary: "What tarot is, what it is not, and how this app approaches it as a practice of reflection.",
    objectives: [
      "Describe tarot as a symbolic, reflective practice rather than a scientific prediction method",
      "Know the basic history of the Rider–Waite–Smith deck this app is based on",
      "Set a personal intention for your learning",
    ],
    sections: [
      {
        heading: "What tarot is",
        paragraphs: [
          "A tarot deck is a set of 78 illustrated cards. Each card carries a cluster of traditional meanings and a picture full of symbols. When you draw cards in response to a question, you use those meanings and images as prompts for reflection: they offer perspectives you might not have considered on your own.",
          "This app treats tarot as a symbolic and reflective practice. There is no scientific evidence that tarot predicts future events, and we never present a reading as a guarantee. What tarot can do well is help you slow down, notice patterns, name feelings and consider options.",
        ],
      },
      {
        heading: "Where the Rider–Waite–Smith deck comes from",
        note: "Historical tradition",
        paragraphs: [
          "Playing cards with trump cards appeared in fifteenth-century Italy, where they were used for games. Their use for divination is documented later, especially from eighteenth-century France onward.",
          "In 1909 the illustrator Pamela Colman Smith painted a deck to the design of the occultist Arthur Edward Waite, published by the Rider company. Waite's companion book, The Pictorial Key to the Tarot (1911), describes the symbols and divinatory meanings. Smith's innovation was to illustrate every Minor Arcana card with a scene, which is why this deck is so widely used for learning. The Daily Arcana's artwork is original, but follows the symbolic tradition of that deck.",
        ],
      },
      {
        heading: "How to use this academy",
        paragraphs: [
          "Each level builds on the last. You will learn the structure of the deck, then the language of suits, numbers and court cards, then how to read imagery, spreads and combinations. The goal is for you to become a confident reader yourself — not to depend on the app's interpretations.",
        ],
      },
    ],
    examples: [
      { title: "Reflective framing", body: "Instead of asking “Will I get the job?”, a reflective reader asks “What should I keep in mind as I prepare for this interview?” The second question invites useful insight; the first invites false certainty." },
    ],
    exercise: {
      prompt: "Write a short learning intention for your tarot practice.",
      steps: ["Note why you are drawn to tarot.", "Name one thing you hope to understand better about yourself.", "Decide how often you would like to practise (for example, one daily card)."],
    },
    quiz: [
      { question: "How does this app describe tarot?", options: ["A scientifically proven way to predict the future", "A symbolic and reflective practice", "A game with no meaning"], answerIndex: 1, explanation: "Tarot is presented as a reflective, symbolic practice; no reading is a guarantee." },
      { question: "Who painted the original Rider–Waite–Smith deck?", options: ["Arthur Edward Waite", "Pamela Colman Smith", "Aleister Crowley"], answerIndex: 1, explanation: "Pamela Colman Smith painted the cards to Waite's design; Waite wrote the companion book." },
      { question: "What made the Rider–Waite–Smith Minor Arcana distinctive?", options: ["They had no numbers", "Every card was illustrated with a scene", "They used only black and white"], answerIndex: 1, explanation: "Fully illustrated pip cards made the deck especially useful for learning through imagery." },
    ],
    cards: ["major-00-the-fool"],
    contentVersion: v,
  },
  {
    id: "beginner-02-the-deck",
    title: "Level 2 · Understanding the 78-card deck",
    summary: "The structure of the deck: 22 Major Arcana and 56 Minor Arcana in four suits.",
    objectives: ["Explain the difference between the Major and Minor Arcana", "Name the four suits and their ranks", "Read a card's canonical name and number"],
    sections: [
      {
        heading: "Two halves",
        paragraphs: [
          "The Major Arcana are 22 cards numbered 0 (The Fool) to XXI (The World). They describe big life themes, turning points and archetypal experiences.",
          "The Minor Arcana are 56 cards in four suits — Wands, Cups, Swords and Pentacles. Each suit has Ace to Ten plus four court cards: Page, Knight, Queen and King. The Minor Arcana describe the everyday situations, actions and feelings through which those big themes play out.",
        ],
      },
      {
        heading: "Numbering conventions",
        note: "Tradition",
        paragraphs: [
          "This app follows Waite's sequence, in which Strength is VIII and Justice is XI. Older Marseille-style decks place Justice at VIII and Strength at XI. Both conventions are valid; what matters is consistency within one deck.",
          "Each card has a canonical ID used everywhere in the app, such as major-00-the-fool or cups-03-three, so your readings, journal and lessons always refer to exactly the same card.",
        ],
      },
    ],
    examples: [
      { title: "Weight in a spread", body: "If a three-card reading contains two Major Arcana, many readers take that as a sign that the question touches on significant life themes rather than passing circumstances." },
    ],
    exercise: {
      prompt: "Sort the deck in the Deck Library by arcana and suit.",
      steps: ["Open the Deck Library.", "Browse the 22 Major Arcana in order.", "Choose one suit and look at how the scenes change from Ace to Ten."],
    },
    quiz: [
      { question: "How many Major Arcana cards are there?", options: ["21", "22", "56"], answerIndex: 1, explanation: "There are 22 Major Arcana, numbered 0 to XXI." },
      { question: "Which is NOT a court card?", options: ["Page", "Knight", "Ace"], answerIndex: 2, explanation: "The court cards are Page, Knight, Queen and King. The Ace is the first numbered card." },
      { question: "In Waite's numbering, Strength is…", options: ["VIII", "XI", "IV"], answerIndex: 0, explanation: "Waite placed Strength at VIII and Justice at XI." },
    ],
    cards: ["major-08-strength", "major-11-justice"],
    contentVersion: v,
  },
  {
    id: "beginner-03-major-arcana",
    title: "Level 3 · The Major Arcana",
    summary: "The Fool's journey as a way to remember the 22 archetypes and how they relate.",
    objectives: ["Describe the Fool's journey as a learning framework", "Group the Major Arcana into three stages", "Recognise when a Major Arcana card marks a significant theme"],
    sections: [
      {
        heading: "The Fool's journey",
        note: "Modern teaching framework",
        paragraphs: [
          "A popular way to learn the Major Arcana is to imagine The Fool travelling through each card in turn, meeting teachers, trials and revelations. This framework is a modern teaching device rather than something Waite described, but it helps you remember how the cards relate.",
          "Stage one (I–VII) covers learning to live in the world: skill (Magician), intuition (High Priestess), nurture (Empress), structure (Emperor), tradition (Hierophant), choice (Lovers) and willpower (Chariot).",
          "Stage two (VIII–XIV) turns inward: courage (Strength), solitude (Hermit), cycles (Wheel), accountability (Justice), surrender (Hanged Man), endings (Death) and integration (Temperance).",
          "Stage three (XV–XXI) meets the deepest forces: attachment (Devil), upheaval (Tower), hope (Star), uncertainty (Moon), joy (Sun), awakening (Judgement) and completion (World).",
        ],
      },
      {
        heading: "Reading a Major Arcana card",
        paragraphs: [
          "When a Major Arcana card appears, ask what larger theme or lesson the situation is part of. Many readers give these cards extra weight, but they are not automatically more important than the Minor Arcana — a precise Minor card can be the most useful part of a reading.",
        ],
      },
    ],
    examples: [
      { title: "The Tower in a career question", body: "Rather than predicting disaster, The Tower might reflect that an assumption about a job has collapsed, and invite the question: what truer foundation can be built now?" },
    ],
    exercise: {
      prompt: "Tell the Fool's journey in your own words.",
      steps: ["Pick five consecutive Major Arcana cards.", "Write one sentence for each describing what the Fool learns.", "Notice how each lesson prepares for the next."],
    },
    quiz: [
      { question: "The Fool's journey is…", options: ["A rule Waite required", "A modern teaching framework", "A spread layout"], answerIndex: 1, explanation: "It is a popular modern way of remembering the Major Arcana, not a rule from Waite." },
      { question: "Which card represents completion?", options: ["The World", "The Star", "The Magician"], answerIndex: 0, explanation: "The World (XXI) represents completion and wholeness." },
      { question: "When a Major Arcana card appears, a helpful question is…", options: ["What larger theme is this part of?", "Who is lying to me?", "What exact date will this happen?"], answerIndex: 0, explanation: "Major Arcana cards point to broader life themes and lessons." },
    ],
    cards: ["major-00-the-fool", "major-21-the-world"],
    contentVersion: v,
  },
  {
    id: "beginner-04-minor-arcana",
    title: "Level 4 · The Minor Arcana and the four suits",
    summary: "How the four suits map to areas of experience, and why they are patterns rather than rigid rules.",
    objectives: ["Associate each suit with its element and themes", "Explain why suit meanings are broad patterns", "Identify a card's suit from its imagery"],
    sections: [
      {
        heading: "The four suits",
        paragraphs: [
          "Wands (fire) — action, initiative, creativity, ambition and energy.",
          "Cups (water) — emotions, relationships, intuition and connection.",
          "Swords (air) — thoughts, communication, decisions, conflict and discernment.",
          "Pentacles (earth) — material circumstances, work, resources, stability and practical development.",
        ],
      },
      {
        heading: "Patterns, not boxes",
        paragraphs: [
          "Suit associations are broad tendencies that help you orient yourself. A Cups card in a career question doesn't mean the answer is irrelevant to work — it suggests the emotional side of work, such as team relationships or whether the job feels meaningful. Always connect the suit's theme to the actual question.",
        ],
      },
    ],
    examples: [
      { title: "Same number, different suits", body: "The Three of Cups shows friends celebrating; the Three of Pentacles shows craftspeople collaborating. Both share the Three's theme of group effort and early growth, expressed through feeling and through work respectively." },
    ],
    exercise: {
      prompt: "Assign a suit to everyday situations.",
      steps: ["Write down three things that happened this week.", "Decide which suit best fits each one.", "Note any situation that fits more than one suit, and why."],
    },
    quiz: [
      { question: "Which suit is associated with thoughts and decisions?", options: ["Wands", "Swords", "Pentacles"], answerIndex: 1, explanation: "Swords correspond to air: thought, communication and decisions." },
      { question: "Which element is traditionally linked to Pentacles?", options: ["Earth", "Water", "Fire"], answerIndex: 0, explanation: "Pentacles are linked to earth and material matters." },
      { question: "A Cups card in a career question most likely highlights…", options: ["Only romance", "The emotional side of work", "Nothing relevant"], answerIndex: 1, explanation: "Suits are broad patterns; Cups bring the emotional dimension of any topic into focus." },
    ],
    cards: ["wands-01-ace", "cups-01-ace", "swords-01-ace", "pentacles-01-ace"],
    contentVersion: v,
  },
  {
    id: "beginner-05-numbers",
    title: "Level 5 · Number symbolism",
    summary: "The recurring meanings of Ace through Ten, and how suit and number combine.",
    objectives: ["Recall the general theme of each number", "Combine a number theme with a suit theme", "Recognise the numerical arc from beginning to completion"],
    sections: [
      {
        heading: "The numbered cards as a story",
        note: "Common modern teaching pattern",
        paragraphs: [
          "Ace — seed, potential, a gift. Two — duality, choice, partnership. Three — growth, collaboration, first results. Four — stability, structure, pause. Five — disruption, conflict, loss. Six — harmony restored, generosity, moving on. Seven — assessment, challenge, inner work. Eight — movement, effort, mastery or restriction. Nine — near-completion, intensity, self-reliance. Ten — completion, culmination, the end of a cycle and its consequences.",
          "These number themes are a teaching pattern widely used today. They do not perfectly match every card's traditional meaning, so treat them as a starting point and then look at the picture.",
        ],
      },
      {
        heading: "Suit + number",
        paragraphs: [
          "To interpret a numbered card, combine the number's stage with the suit's realm. Five (disruption) + Cups (feelings) = emotional loss: the Five of Cups. Five + Wands (energy) = competitive friction: the Five of Wands. Five + Pentacles (resources) = material hardship: the Five of Pentacles.",
        ],
      },
    ],
    examples: [
      { title: "Working it out", body: "Faced with the Eight of Swords and no memory of its meaning: Eight is movement or restriction, Swords is the mind. Restriction of the mind — feeling trapped by thoughts — which is exactly what the blindfolded figure among swords depicts." },
    ],
    exercise: {
      prompt: "Predict, then check.",
      steps: ["Choose a number and write its theme.", "Predict what that number means in each suit.", "Compare your predictions with the four card pages."],
    },
    quiz: [
      { question: "Which number is most associated with disruption and conflict?", options: ["Four", "Five", "Nine"], answerIndex: 1, explanation: "Fives typically mark disruption after the stability of the Fours." },
      { question: "Ten + Wands most likely means…", options: ["A heavy burden of responsibility", "A new spark", "Romantic union"], answerIndex: 0, explanation: "Ten is culmination; in Wands, energy taken to its limit becomes burden." },
      { question: "Number themes should be treated as…", options: ["Absolute rules", "A starting point, checked against the image", "Irrelevant"], answerIndex: 1, explanation: "They are a helpful pattern, but each card's picture and tradition refine the meaning." },
    ],
    cards: ["cups-05-five", "wands-05-five", "pentacles-05-five"],
    contentVersion: v,
  },
  {
    id: "beginner-06-court-cards",
    title: "Level 6 · Court cards",
    summary: "Pages, Knights, Queens and Kings as roles and patterns — not always literal people.",
    objectives: ["Describe the role of each court rank", "Combine rank and suit into a personality pattern", "Decide when a court card might represent a person versus an approach"],
    sections: [
      {
        heading: "The four ranks",
        paragraphs: [
          "Page — the student or messenger: curiosity, beginnings, learning. Knight — the pursuer: action, movement, taking the suit's energy to extremes. Queen — the inward master: mature, receptive, nurturing expression of the suit. King — the outward master: authority, responsibility and leadership in the suit.",
        ],
      },
      {
        heading: "Roles, not just people",
        note: "Tradition vs modern practice",
        paragraphs: [
          "Waite often described court cards as specific kinds of people — for example by complexion or occupation. Many modern readers instead treat them as roles or approaches that anyone can take, regardless of age or gender.",
          "When a court card appears, ask: is this describing someone in the situation, an approach I am taking, or an approach the situation needs? All three are valid readings; the question and context help you choose.",
        ],
      },
    ],
    examples: [
      { title: "Knight of Swords in a family question", body: "Rather than a specific person, the Knight of Swords might show that you are charging into a difficult conversation with arguments ready — and invite you to slow down." },
    ],
    exercise: {
      prompt: "Build the sixteen court personalities.",
      steps: ["Write one word for each rank.", "Write one word for each suit.", "Combine them for all sixteen cards and compare with the card pages."],
    },
    quiz: [
      { question: "Which rank represents action and pursuit?", options: ["Page", "Knight", "Queen"], answerIndex: 1, explanation: "Knights pursue and act, often taking the suit's energy to its extreme." },
      { question: "Modern practice often treats court cards as…", options: ["Always a specific stranger", "Roles or approaches anyone can embody", "Bad omens"], answerIndex: 1, explanation: "They can represent people, but also approaches you or the situation need." },
      { question: "Queen + Cups suggests…", options: ["Emotional depth and compassion", "Aggressive ambition", "Financial calculation"], answerIndex: 0, explanation: "The Queen's inward mastery combined with the suit of feeling." },
    ],
    cards: ["wands-11-page", "swords-12-knight", "cups-13-queen", "pentacles-14-king"],
    contentVersion: v,
  },
  {
    id: "beginner-07-reversals",
    title: "Level 7 · Upright and reversed cards",
    summary: "Several ways to read reversed cards — and the option not to use them at all.",
    objectives: ["Describe four common approaches to reversals", "Avoid reading every reversal as the opposite", "Decide whether to use reversals in your own practice"],
    sections: [
      {
        heading: "Approaches to reversals",
        paragraphs: [
          "Blocked or delayed — the card's energy is present but not flowing yet. Internalised — the energy is turned inward or private. Excessive — too much of the card's quality. Reconsider — a prompt to look again at the upright meaning from another angle.",
          "Reversals rarely mean the simple opposite. A reversed Sun is usually still joyful, just dimmed or delayed — Waite himself described it as 'the same in a lesser sense'.",
        ],
      },
      {
        heading: "You choose",
        paragraphs: [
          "Many experienced readers never use reversals, relying on position and surrounding cards for nuance. You can turn reversals off in Settings at any time. If you use them, decide in advance which approach you will try first, so you are not choosing whichever meaning you prefer after the fact.",
        ],
      },
    ],
    examples: [
      { title: "Reversed Strength", body: "Blocked: courage you have not yet accessed. Internalised: self-doubt. Excessive: forcing rather than gentleness. Context tells you which fits best." },
    ],
    exercise: {
      prompt: "Read one card four ways.",
      steps: ["Pick a card and read its upright meaning.", "Write a sentence for each of the four reversal approaches.", "Decide which approach feels most useful for your practice."],
    },
    quiz: [
      { question: "Which is NOT a common approach to reversals?", options: ["Blocked energy", "Excessive energy", "Always the exact opposite"], answerIndex: 2, explanation: "Reading every reversal as the opposite oversimplifies the card." },
      { question: "Can you practise tarot without reversals?", options: ["Yes, many readers do", "No, they are required", "Only with Major Arcana"], answerIndex: 0, explanation: "Reversals are optional and can be disabled in Settings." },
      { question: "Waite described the reversed Sun as…", options: ["Disaster", "The same in a lesser sense", "Imprisonment"], answerIndex: 1, explanation: "A softened or delayed version of the upright meaning." },
    ],
    cards: ["major-08-strength", "major-19-the-sun"],
    contentVersion: v,
  },
  {
    id: "beginner-08-imagery",
    title: "Level 8 · Reading card imagery and symbolism",
    summary: "A systematic way to observe a card so that meanings come from the picture, not just keywords.",
    objectives: ["Use an eight-step observation method", "Explain why a symbol carries its meaning", "Combine several symbols into an interpretation"],
    sections: [
      {
        heading: "Look before you look it up",
        paragraphs: [
          "Keywords are useful, but the picture holds far more. Try these questions in order: What do I notice first? Who or what is depicted? What is the figure doing? Which objects, animals, colours and symbols stand out? What is the emotional atmosphere? Where is the figure looking or moving? What tension or relationship exists in the scene? How might this relate to my question?",
        ],
      },
      {
        heading: "Why symbols mean what they do",
        paragraphs: [
          "Many symbols draw on shared cultural associations: water for emotion, mountains for challenge or perspective, a sunrise for renewal, a blindfold for not seeing. Some are specific to the esoteric tradition the deck came from, like the B and J pillars of the High Priestess. Each card page explains its symbols and marks which meanings are traditional.",
          "Symbols work together. The Fool's open sky, white rose and cliff edge combine into a single message: innocent trust stepping into the unknown.",
        ],
      },
    ],
    examples: [
      { title: "Eight of Cups, observed", body: "First noticed: a figure walking away. Doing: leaving neatly stacked cups. Atmosphere: twilight, solitary. Movement: toward mountains. Tension: a gap in the cups — something is missing. Interpretation: leaving something outwardly complete to search for deeper meaning." },
    ],
    exercise: {
      prompt: "Use the guided observation exercise on any card page.",
      steps: ["Open a card you don't know well.", "Answer the eight observation questions before reading the meaning.", "Compare your observations with the reference symbolism."],
    },
    quiz: [
      { question: "What is the first step in the observation method?", options: ["Look up the keywords", "Notice what stands out first", "Decide the answer"], answerIndex: 1, explanation: "Begin with your first impression of the image." },
      { question: "Water in tarot imagery commonly relates to…", options: ["Emotion and the unconscious", "Money", "Anger"], answerIndex: 0, explanation: "Water is widely associated with feeling and intuition." },
      { question: "Why combine symbols?", options: ["They form a single message together", "To make readings longer", "Symbols contradict each other"], answerIndex: 0, explanation: "A card's meaning emerges from how its symbols interact." },
    ],
    cards: ["cups-08-eight", "major-02-the-high-priestess"],
    contentVersion: v,
  },
  {
    id: "beginner-09-spreads",
    title: "Level 9 · Understanding spread positions",
    summary: "How a position changes what a card is telling you.",
    objectives: ["Explain what a spread position does", "Interpret the same card in different positions", "Choose an appropriate spread for a question"],
    sections: [
      {
        heading: "Positions give cards a job",
        paragraphs: [
          "A spread assigns each card a role — situation, challenge, guidance and so on. The position tells you which question the card is answering. The same card reads differently as a challenge than as guidance.",
          "This app offers three spreads: One-card (focus), Three-card (situation, challenge, guidance) and Five-card (context, underlying influence, obstacle, opportunity, recommended action). Position meanings are always shown before you select cards.",
        ],
      },
      {
        heading: "Choosing a spread",
        paragraphs: [
          "Use one card for a quick focus or daily reflection, three cards for most questions, and five cards when a situation has hidden factors you want to explore. More cards are not always better; a clear question and a simple spread often give the clearest insight.",
        ],
      },
    ],
    examples: [
      { title: "The Hermit in two positions", body: "As Challenge, The Hermit may point to isolation making things harder. As Guidance, it may recommend stepping back to reflect before deciding." },
    ],
    exercise: {
      prompt: "One card, three positions.",
      steps: ["Draw one card in Practice mode.", "Interpret it as a situation, as a challenge and as guidance.", "Notice how the position reshapes the meaning."],
    },
    quiz: [
      { question: "What does a spread position do?", options: ["Changes the card's name", "Gives the card a specific question to answer", "Makes the card reversed"], answerIndex: 1, explanation: "Positions frame what aspect of the question each card addresses." },
      { question: "Which spread suits a quick daily reflection?", options: ["One-card", "Five-card", "Celtic Cross"], answerIndex: 0, explanation: "A single card is ideal for a focused daily reflection." },
      { question: "In the three-card spread, the middle position is…", options: ["Guidance", "Challenge", "Outcome"], answerIndex: 1, explanation: "Situation, Challenge, Guidance." },
    ],
    cards: ["major-09-the-hermit"],
    contentVersion: v,
  },
  {
    id: "beginner-10-combinations",
    title: "Level 10 · Combining multiple cards",
    summary: "Reading cards as a story: shared suits, numbers, directions and contrasts.",
    objectives: ["Spot patterns across a spread", "Use contrast between cards meaningfully", "Synthesise several cards into one coherent message"],
    sections: [
      {
        heading: "Look for patterns",
        paragraphs: [
          "Dominant suit — several cards of one suit emphasise that realm. Many Major Arcana — broader life themes. Repeated numbers — a shared stage of development. Many reversals — energy blocked or turned inward. Direction — figures facing toward or away from each other can suggest connection or tension.",
        ],
      },
      {
        heading: "Tell a story",
        paragraphs: [
          "Read the cards in position order as sentences in one story. Ask how each card leads to the next, and where they agree or contrast. A contrast is not a contradiction — the Four of Swords (rest) next to the Eight of Wands (speed) might mean that rest now enables fast progress later.",
        ],
      },
    ],
    examples: [
      { title: "Situation, challenge, guidance", body: "Ten of Wands (overloaded), Two of Swords (avoiding a decision), Three of Pentacles (collaboration): you are carrying too much because you haven't decided what to share — bring others into the work." },
    ],
    exercise: {
      prompt: "Find three patterns.",
      steps: ["Draw three cards in Practice mode.", "List any shared suit, number or theme.", "Write a three-sentence story connecting them."],
    },
    quiz: [
      { question: "Several Cups cards in a spread suggest…", options: ["Emotional matters are emphasised", "Money is guaranteed", "Nothing"], answerIndex: 0, explanation: "A dominant suit emphasises its realm." },
      { question: "Two cards that seem to contrast…", options: ["Cancel each other out", "Can show a relationship or sequence", "Mean the reading failed"], answerIndex: 1, explanation: "Contrast often reveals dynamics, sequence or tension worth exploring." },
      { question: "A good synthesis…", options: ["Lists keywords separately", "Connects the cards into one coherent message", "Ignores positions"], answerIndex: 1, explanation: "Synthesis weaves the cards and positions into a single story." },
    ],
    cards: ["wands-10-ten", "swords-02-two", "pentacles-03-three"],
    contentVersion: v,
  },
  {
    id: "beginner-11-questions",
    title: "Level 11 · Asking useful tarot questions",
    summary: "How to phrase questions that lead to insight instead of false certainty.",
    objectives: ["Rewrite yes/no questions as open questions", "Keep questions focused on what you can influence", "Avoid questions about other people's private thoughts"],
    sections: [
      {
        heading: "Open, focused, empowering",
        paragraphs: [
          "Useful questions are open (“what”, “how”), focused on one situation, and centred on your own choices. “What can I do to improve communication with my sister?” works better than “Will my sister apologise?”",
        ],
      },
      {
        heading: "What tarot cannot tell you",
        paragraphs: [
          "Tarot cannot reveal what another person secretly thinks or feels, whether someone is faithful, or what they will do. It cannot guarantee a promotion, a relationship outcome or a financial result. This app will never claim to. Questions about medical, legal or financial decisions deserve qualified professional advice; tarot can at most help you reflect on how you feel about them.",
        ],
      },
    ],
    examples: [
      { title: "Rewriting", body: "“Does he love me?” → “What do I need to feel secure in this relationship?” · “Will I get rich?” → “What habits would support my financial goals?”" },
    ],
    exercise: {
      prompt: "Rewrite three questions.",
      steps: ["Write three questions you would like to ask.", "Rewrite each as an open question about your own choices.", "Pick the one you'd most like to explore in a reading."],
    },
    quiz: [
      { question: "Which question is most useful?", options: ["Will I get the job?", "What should I focus on as I prepare for the interview?", "Is my interviewer judging me?"], answerIndex: 1, explanation: "Open, self-focused questions lead to actionable insight." },
      { question: "Can tarot reveal another person's private feelings?", options: ["Yes, always", "No", "Only with Cups cards"], answerIndex: 1, explanation: "Readings never claim to know another person's private thoughts or intentions." },
      { question: "For a medical decision, tarot can…", options: ["Replace a doctor", "Help you reflect on your feelings, alongside professional advice", "Give a diagnosis"], answerIndex: 1, explanation: "Professional advice is essential; tarot can support reflection only." },
    ],
    cards: ["major-02-the-high-priestess"],
    contentVersion: v,
  },
  {
    id: "beginner-12-full-reading",
    title: "Level 12 · Conducting a complete reading",
    summary: "Putting it all together: from question to synthesis to reflection.",
    objectives: ["Follow a complete reading process", "Write your own interpretation before consulting references", "Reflect on a reading over time"],
    sections: [
      {
        heading: "The process",
        paragraphs: [
          "1. Settle and set an intention. 2. Write a clear, open question. 3. Choose a spread and read the positions. 4. Draw and observe each card before interpreting. 5. Interpret each card in its position. 6. Look for patterns and connections. 7. Synthesise a direct answer and practical steps. 8. Write a reflection question. 9. Record it in your journal.",
        ],
      },
      {
        heading: "Becoming your own reader",
        paragraphs: [
          "Whenever you can, write your interpretation before revealing the app's. Then compare: what did you notice that the reference missed? What did it point out that you overlooked? Over time, revisit old readings in your journal and note what resonated — without treating any reading as proof that it predicted events.",
        ],
      },
    ],
    examples: [
      { title: "A complete one-card reading", body: "Question: “How can I approach this week?” Card: Temperance upright. Observation: an angel balancing water between cups. Interpretation: pace yourself and blend effort with rest. Step: schedule two genuine breaks. Reflection: where am I overdoing it?" },
    ],
    exercise: {
      prompt: "Do a full three-card reading on your own.",
      steps: ["Start a three-card reading.", "Write your interpretation in the journal before revealing the app's.", "Compare and note one thing you learned."],
    },
    quiz: [
      { question: "What should you do before revealing the app's interpretation?", options: ["Nothing", "Write your own interpretation", "Draw more cards"], answerIndex: 1, explanation: "Writing first builds your confidence and independent skill." },
      { question: "When revisiting old readings, you should avoid…", options: ["Noting what resonated", "Treating a reading as proof it predicted events", "Learning from it"], answerIndex: 1, explanation: "Reflection is valuable; claiming predictive proof is not supported." },
      { question: "Which step comes right after drawing the cards?", options: ["Observe each card", "Close the app", "Ask a new question"], answerIndex: 0, explanation: "Observation comes before interpretation." },
    ],
    cards: ["major-14-temperance"],
    contentVersion: v,
  },
];
