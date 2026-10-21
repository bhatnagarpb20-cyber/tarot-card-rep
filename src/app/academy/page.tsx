import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "@/content/academy";
import { SectionHeading } from "@/components/ornament/Ornaments";
import { CourseProgress, LearningStateProvider, LessonStatus } from "@/components/learning/LearningState";

export const metadata: Metadata = { title: "Learning academy" };

export default function AcademyPage() {
  return (
    <LearningStateProvider>
      <div className="space-y-12">
        <SectionHeading eyebrow="Learn to read for yourself" title="The tarot academy" intro="Structured lessons, all 78 card lessons, and practice that builds your own interpretive skill — so you can read without relying on anyone else's interpretation." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/academy/practice" className="panel-night block p-5 text-ink no-underline hover:border-gold">
            <h2 className="text-2xl text-vermilion">Practice mode</h2>
            <p className="mt-1 text-sm text-ink/85">Draw a card, interpret it unaided, then compare with the reference. Beginner to advanced.</p>
          </Link>
          <Link href="/deck" className="panel-night block p-5 text-ink no-underline hover:border-gold">
            <h2 className="text-2xl text-vermilion">78 card lessons</h2>
            <p className="mt-1 text-sm text-ink/85">Symbolism, meanings, observation exercises and a quiz for every card.</p>
          </Link>
          <Link href="/journal" className="panel-night block p-5 text-ink no-underline hover:border-gold">
            <h2 className="text-2xl text-vermilion">Your progress</h2>
            <p className="mt-1 text-sm text-ink/85">Lessons, quizzes and practice history in your journal's Patterns tab.</p>
          </Link>
        </div>
        {COURSES.map((course) => (
          <section key={course.id} aria-labelledby={`c-${course.id}`} className="panel p-5 sm:p-8">
            <h2 id={`c-${course.id}`} className="text-3xl">{course.title}</h2>
            <p className="mt-1">{course.description}</p>
            <div className="mt-4"><CourseProgress lessonIds={course.lessons.map((l) => l.id)} /></div>
            <ol className="mt-6 divide-y divide-gold-dark/20">
              {course.lessons.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/academy/${l.id}`} className="font-[family-name:var(--font-heading)] text-xl">{l.title}</Link>
                    <p className="text-sm opacity-80">{l.summary}</p>
                  </div>
                  <span className="rounded bg-page-sunk px-2 py-1"><LessonStatus lessonId={l.id} /></span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </LearningStateProvider>
  );
}
