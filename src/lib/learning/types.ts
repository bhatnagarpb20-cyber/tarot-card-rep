import { z } from "zod";
import { CATEGORIES } from "@/lib/tarot/types";

export const progressInputSchema = z.object({
  lessonId: z.string().regex(/^[a-z0-9-]+$/).max(80),
  status: z.enum(["started", "completed"]),
});

export const quizInputSchema = z.object({
  subjectType: z.enum(["lesson", "card"]),
  subjectId: z.string().max(80),
  score: z.number().int().min(0),
  total: z.number().int().min(1).max(50),
  answers: z.array(z.number().int().min(-1).max(10)).max(50),
}).refine((q) => q.score <= q.total, { message: "Score cannot exceed total" });

export const practiceInputSchema = z.object({
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.enum(CATEGORIES),
  cards: z.array(z.object({ cardId: z.string(), reversed: z.boolean(), position: z.number().int() })).min(1).max(5),
  observations: z.record(z.string().max(2000)).default({}),
  interpretation: z.string().max(10000).default(""),
  feedback: z.record(z.unknown()).nullable().default(null),
});

export type ProgressInput = z.infer<typeof progressInputSchema>;
export type QuizInput = z.infer<typeof quizInputSchema>;
export type PracticeInput = z.infer<typeof practiceInputSchema>;

export interface LearningState {
  progress: Record<string, { status: "started" | "completed"; completedAt: string | null }>;
  quizAttempts: (QuizInput & { id: string; createdAt: string })[];
  practice: (PracticeInput & { id: string; createdAt: string })[];
}
