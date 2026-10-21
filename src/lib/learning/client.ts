"use client";
import type { StorageMode } from "@/lib/readings/client";
import { ClientApiError } from "@/lib/readings/client";
import { guestLearning } from "./guest-store";
import type { LearningState, PracticeInput, ProgressInput, QuizInput } from "./types";

async function send<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
  } catch {
    throw new ClientApiError("You appear to be offline; progress could not be saved.", "offline", 0);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ClientApiError(body.error ?? "Request failed", body.code ?? "error", res.status);
  return body as T;
}

export function learningClient(mode: StorageMode) {
  if (mode === "guest") {
    return {
      state: async (): Promise<LearningState> => guestLearning.state(),
      setProgress: async (i: ProgressInput) => guestLearning.setProgress(i),
      addQuiz: async (i: QuizInput) => guestLearning.addQuiz(i),
      addPractice: async (i: PracticeInput) => guestLearning.addPractice(i),
    };
  }
  return {
    state: () => send<LearningState>("/api/learning"),
    setProgress: (i: ProgressInput) => send("/api/learning/progress", { method: "POST", body: JSON.stringify(i) }),
    addQuiz: (i: QuizInput) => send("/api/learning/quiz", { method: "POST", body: JSON.stringify(i) }),
    addPractice: (i: PracticeInput) => send("/api/learning/practice", { method: "POST", body: JSON.stringify(i) }),
  };
}
