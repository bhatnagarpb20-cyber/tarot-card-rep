import { practiceInputSchema, progressInputSchema, quizInputSchema, type LearningState, type PracticeInput, type ProgressInput, type QuizInput } from "./types";

const KEY = "daily-arcana:learning:v1";
const empty = (): LearningState => ({ progress: {}, quizAttempts: [], practice: [] });

function load(): LearningState {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}
function save(s: LearningState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    throw new Error("This browser would not let us save learning progress on this device.");
  }
}

/** Guest learning progress, stored only in this browser. */
export const guestLearning = {
  state: load,
  setProgress(raw: ProgressInput) {
    const input = progressInputSchema.parse(raw);
    const s = load();
    const prev = s.progress[input.lessonId];
    if (prev?.status === "completed" && input.status === "started") return;
    s.progress[input.lessonId] = { status: input.status, completedAt: input.status === "completed" ? new Date().toISOString() : null };
    save(s);
  },
  addQuiz(raw: QuizInput) {
    const input = quizInputSchema.parse(raw);
    const s = load();
    s.quizAttempts.push({ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    save(s);
  },
  addPractice(raw: PracticeInput) {
    const input = practiceInputSchema.parse(raw);
    const s = load();
    s.practice.push({ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    save(s);
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* nothing stored */
    }
  },
};
