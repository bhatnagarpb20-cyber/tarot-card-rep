import type { Lesson } from "./types";

const v = "1.0.0";

export const SUIT_LESSONS: Lesson[] = [
  {
    id: "suits-wands",
    title: "Wands · Action, initiative and creative fire",
    summary: "The suit of fire: energy, ambition, creativity and the drive to begin.",
    objectives: ["Describe the themes of the Wands suit", "Trace the Wands story from Ace to Ten", "Apply Wands themes to different questions"],
    sections: [
      {
        heading: "The element of fire",
        paragraphs: [
          "Wands are living branches that sprout leaves — energy that grows. The suit covers action, initiative, creativity, ambition, passion and willpower. Wands ask: what do you want, and what will you do about it?",
        ],
      },
      {
        heading: "The Wands story",
        paragraphs: [
          "Ace — a spark. Two — planning from a secure base. Three — ventures launched. Four — celebration. Five — competition. Six — recognition. Seven — defending your position. Eight — rapid momentum. Nine — resilience. Ten — burden. The arc shows energy kindled, expanded, tested and finally over-extended.",
        ],
      },
      {
        heading: "In other areas of life",
        paragraphs: [
          "In love, Wands show passion and excitement. In finances, enterprise and risk. In growth, courage and creative expression. Too much fire burns out; too little leaves you stuck.",
        ],
      },
    ],
    examples: [{ title: "Five of Wands in a family question", body: "Rather than serious conflict, the Five of Wands may show lively competing opinions — everyone wants to be heard." }],
    exercise: { prompt: "Find your fire.", steps: ["List three things that energise you.", "Match each with a Wands card.", "Choose one action that feeds that energy this week."] },
    quiz: [
      { question: "Wands are associated with…", options: ["Fire", "Water", "Earth"], answerIndex: 0, explanation: "Wands correspond to fire: energy and action." },
      { question: "The Ten of Wands depicts…", options: ["A celebration", "Carrying a heavy burden", "A new idea"], answerIndex: 1, explanation: "A figure overloaded by ten wands." },
      { question: "Too much Wands energy can lead to…", options: ["Burnout", "Emotional numbness", "Financial stability"], answerIndex: 0, explanation: "Fire unchecked burns out." },
    ],
    cards: ["wands-01-ace", "wands-05-five", "wands-10-ten"],
    contentVersion: v,
  },
  {
    id: "suits-cups",
    title: "Cups · Emotions, relationships and intuition",
    summary: "The suit of water: feeling, connection, love and the inner life.",
    objectives: ["Describe the themes of the Cups suit", "Trace the Cups story from Ace to Ten", "Combine a Cups number with its suit meaning"],
    sections: [
      {
        heading: "The element of water",
        paragraphs: ["Cups hold and pour. The suit covers emotions, relationships, intuition, imagination and connection. Cups ask: what do you feel, and what do you need?"],
      },
      {
        heading: "The Cups story",
        paragraphs: [
          "Ace — an open heart. Two — partnership. Three — friendship. Four — apathy. Five — grief. Six — nostalgia. Seven — illusion and choice. Eight — walking away. Nine — contentment. Ten — lasting harmony.",
        ],
      },
      {
        heading: "Suit + number in practice",
        paragraphs: ["Combine the number's stage with feeling: Two (partnership) + Cups = mutual connection; Five (disruption) + Cups = emotional loss; Nine (near-completion) + Cups = emotional satisfaction."],
      },
    ],
    examples: [{ title: "Four of Cups at work", body: "Feeling uninspired by your current role while an opportunity waits unnoticed." }],
    exercise: { prompt: "Map your emotional week.", steps: ["Note the strongest feeling of each day.", "Match it with a Cups card.", "Reflect on what the pattern tells you."] },
    quiz: [
      { question: "Cups are associated with…", options: ["Water", "Air", "Fire"], answerIndex: 0, explanation: "Cups correspond to water and emotion." },
      { question: "Five + Cups combines to suggest…", options: ["Emotional loss", "Financial gain", "Speed"], answerIndex: 0, explanation: "Five's disruption in the realm of feeling." },
      { question: "Which Cups card shows walking away in search of meaning?", options: ["Eight of Cups", "Two of Cups", "Ten of Cups"], answerIndex: 0, explanation: "The Eight of Cups shows a figure leaving stacked cups behind." },
    ],
    cards: ["cups-02-two", "cups-05-five", "cups-09-nine"],
    contentVersion: v,
  },
  {
    id: "suits-swords",
    title: "Swords · Thought, communication and discernment",
    summary: "The suit of air: the mind, truth, decisions and conflict.",
    objectives: ["Describe the themes of the Swords suit", "Understand why Swords often look difficult", "Read Swords cards constructively"],
    sections: [
      {
        heading: "The element of air",
        paragraphs: ["Swords cut. The suit covers thoughts, communication, truth, decisions, conflict and discernment. Swords ask: what do you think, and is it true?"],
      },
      {
        heading: "Why Swords look hard",
        paragraphs: [
          "Many Swords images are painful — heartbreak, anxiety, defeat. That is because the mind can wound as well as clarify. Read them as invitations to examine thoughts: is this fear accurate? What truth needs to be faced? The Nine of Swords' swords hang on the wall, not in the dreamer.",
        ],
      },
      {
        heading: "The Swords story",
        paragraphs: ["Ace — clarity. Two — stalemate. Three — heartbreak. Four — rest. Five — hollow victory. Six — transition. Seven — strategy or deception. Eight — feeling trapped. Nine — anxiety. Ten — painful ending and dawn."],
      },
    ],
    examples: [{ title: "Eight of Swords in career", body: "Feeling stuck in a job may partly reflect beliefs about what is possible; the card invites listing options you haven't considered." }],
    exercise: { prompt: "Question a thought.", steps: ["Write down a worrying thought.", "Find the Swords card that matches it.", "List evidence for and against the thought."] },
    quiz: [
      { question: "Swords correspond to…", options: ["Air", "Earth", "Water"], answerIndex: 0, explanation: "Swords are the suit of air and the mind." },
      { question: "A constructive way to read difficult Swords cards is…", options: ["As fixed doom", "As invitations to examine thoughts", "To ignore them"], answerIndex: 1, explanation: "Swords often reflect thoughts that can be questioned." },
      { question: "Which card shows rest and recovery?", options: ["Four of Swords", "Five of Swords", "Ten of Swords"], answerIndex: 0, explanation: "A knight's effigy resting peacefully." },
    ],
    cards: ["swords-01-ace", "swords-08-eight", "swords-09-nine"],
    contentVersion: v,
  },
  {
    id: "suits-pentacles",
    title: "Pentacles · Resources, work and practical life",
    summary: "The suit of earth: money, work, body, home and slow, steady growth.",
    objectives: ["Describe the themes of the Pentacles suit", "Trace the Pentacles story from Ace to Ten", "Apply Pentacles to non-financial questions"],
    sections: [
      {
        heading: "The element of earth",
        paragraphs: ["Pentacles are coins engraved with a star — value made tangible. The suit covers material circumstances, work, money, health, home, resources and practical development. Pentacles ask: what are you building, and how will you sustain it?"],
      },
      {
        heading: "The Pentacles story",
        paragraphs: ["Ace — opportunity. Two — juggling. Three — collaboration. Four — holding on. Five — hardship. Six — generosity. Seven — patient assessment. Eight — craftsmanship. Nine — self-sufficiency. Ten — legacy."],
      },
      {
        heading: "Beyond money",
        paragraphs: ["Pentacles also describe the body, daily routines, skills and the physical environment. In a love question they point to practical commitment; in growth, to habits and embodiment."],
      },
    ],
    examples: [{ title: "Eight of Pentacles in personal growth", body: "Daily, deliberate practice of a skill — progress through repetition." }],
    exercise: { prompt: "Audit your foundations.", steps: ["Rate your sense of stability in work, money, health and home.", "Match the weakest area with a Pentacles card.", "Choose one practical step to strengthen it."] },
    quiz: [
      { question: "Pentacles correspond to…", options: ["Earth", "Fire", "Air"], answerIndex: 0, explanation: "Pentacles are the suit of earth and material life." },
      { question: "Pentacles can describe…", options: ["Only money", "Work, body, home and resources", "Only emotions"], answerIndex: 1, explanation: "The suit covers all practical, material matters." },
      { question: "Which card shows patient assessment of growth?", options: ["Seven of Pentacles", "Two of Pentacles", "Ace of Pentacles"], answerIndex: 0, explanation: "A farmer leaning on a hoe, considering the vine." },
    ],
    cards: ["pentacles-01-ace", "pentacles-07-seven", "pentacles-08-eight"],
    contentVersion: v,
  },
];
