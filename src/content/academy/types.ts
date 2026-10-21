import { z } from "zod";

export const quizQuestionSchema = z.object({
  question: z.string().min(8),
  options: z.array(z.string().min(1)).min(3).max(5),
  answerIndex: z.number().int().min(0),
  explanation: z.string().min(10),
});
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const lessonSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  summary: z.string().min(10),
  objectives: z.array(z.string().min(5)).min(2),
  sections: z
    .array(
      z.object({
        heading: z.string().min(2),
        paragraphs: z.array(z.string().min(10)).min(1),
        /** Optional label marking the section as tradition vs modern practice. */
        note: z.string().optional(),
      }),
    )
    .min(2),
  examples: z.array(z.object({ title: z.string().min(2), body: z.string().min(10) })).min(1),
  exercise: z.object({ prompt: z.string().min(10), steps: z.array(z.string().min(5)).min(2) }),
  quiz: z.array(quizQuestionSchema).min(3),
  /** Card ids illustrated alongside the lesson. */
  cards: z.array(z.string()).default([]),
  contentVersion: z.string(),
});
export type Lesson = z.infer<typeof lessonSchema>;

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}
