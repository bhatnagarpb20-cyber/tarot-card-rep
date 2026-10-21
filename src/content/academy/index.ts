import { BEGINNER_LESSONS } from "./beginner";
import { SUIT_LESSONS } from "./suits";
import type { Course, Lesson } from "./types";

export const COURSES: Course[] = [
  {
    id: "beginner-path",
    title: "The beginner path",
    description: "Twelve progressive levels from your first card to a complete reading.",
    lessons: BEGINNER_LESSONS,
  },
  {
    id: "four-suits",
    title: "The four suits",
    description: "Deeper lessons on Wands, Cups, Swords and Pentacles, and how suit and number combine.",
    lessons: SUIT_LESSONS,
  },
];

const LESSONS = new Map<string, { lesson: Lesson; course: Course; index: number }>();
for (const course of COURSES) course.lessons.forEach((lesson, index) => LESSONS.set(lesson.id, { lesson, course, index }));

export function getLesson(id: string) {
  return LESSONS.get(id);
}

export const ALL_LESSONS: Lesson[] = COURSES.flatMap((c) => c.lessons);
export type { Course, Lesson } from "./types";
