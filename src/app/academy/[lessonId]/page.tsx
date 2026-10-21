import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_LESSONS, getLesson } from "@/content/academy";
import { requireCard } from "@/content/cards";
import { TarotCard } from "@/components/cards/TarotCard";
import { Divider } from "@/components/ornament/Ornaments";
import { Quiz } from "@/components/learning/Quiz";
import { LearningStateProvider, MarkLessonComplete } from "@/components/learning/LearningState";

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ lessonId: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const found = getLesson((await params).lessonId);
  return found ? { title: found.lesson.title, description: found.lesson.summary } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const found = getLesson((await params).lessonId);
  if (!found) notFound();
  const { lesson, course, index } = found;
  const prev = course.lessons[index - 1];
  const next = course.lessons[index + 1];

  return (
    <LearningStateProvider>
      <article className="mx-auto max-w-3xl space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm"><Link href="/academy">Academy</Link> / {course.title}</nav>
        <header className="text-center">
          <p className="eyebrow">{course.title} · Lesson {index + 1} of {course.lessons.length}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{lesson.title}</h1>
          <Divider className="mt-4" />
          <p className="mt-4 text-lg text-ink/85">{lesson.summary}</p>
        </header>

        <section aria-labelledby="obj" className="panel-night p-5">
          <h2 id="obj" className="text-2xl">You will learn to</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        </section>

        {lesson.cards.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-4" aria-label="Cards in this lesson">
            {lesson.cards.map((id) => (
              <li key={id} className="text-center">
                <Link href={`/deck/${id}`} className="block text-ink no-underline">
                  <TarotCard cardId={id} size="sm" />
                  <span className="mt-1 block text-sm">{requireCard(id).name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="panel prose-arcana space-y-8 p-5 sm:p-8">
          {lesson.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl">{s.heading}</h2>
              {s.note && <p className="eyebrow !text-xs !text-burgundy">{s.note}</p>}
              <div className="mt-2">{s.paragraphs.map((p) => <p key={p}>{p}</p>)}</div>
            </section>
          ))}
          <section>
            <h2 className="text-2xl">Examples</h2>
            {lesson.examples.map((e) => (
              <div key={e.title} className="mt-3 rounded border border-gold-dark/30 bg-white/40 p-3">
                <h3 className="font-semibold">{e.title}</h3>
                <p>{e.body}</p>
              </div>
            ))}
          </section>
          <section>
            <h2 className="text-2xl">Exercise</h2>
            <p className="mt-2">{lesson.exercise.prompt}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">{lesson.exercise.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </section>
        </div>

        <div className="panel p-5 sm:p-8">
          <Quiz questions={lesson.quiz} subjectType="lesson" subjectId={lesson.id} />
        </div>

        <div className="flex flex-col items-center gap-6">
          <MarkLessonComplete lessonId={lesson.id} />
          <nav aria-label="Lesson navigation" className="flex w-full justify-between gap-4 text-sm">
            {prev ? <Link href={`/academy/${prev.id}`}>← {prev.title}</Link> : <span />}
            {next ? <Link href={`/academy/${next.id}`}>{next.title} →</Link> : <Link href="/academy">Back to the academy →</Link>}
          </nav>
        </div>
      </article>
    </LearningStateProvider>
  );
}
