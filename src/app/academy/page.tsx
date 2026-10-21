import type { Metadata } from "next";
import Link from "next/link";
import { COURSES } from "@/content/academy";
import { SectionHeading } from "@/components/ornament/Ornaments";
import { SuitEmblem } from "@/components/cards/SuitEmblem";
import type { Suit } from "@/lib/tarot/types";
import { CourseProgress, LearningStateProvider, LessonStatus } from "@/components/learning/LearningState";

export const metadata: Metadata = { title: "Learning academy" };

const ACCENTS = ["text-acid", "text-hot", "text-teal", "text-lilac", "text-sun"];
const SUITS: Suit[] = ["wands", "cups", "swords", "pentacles"];

const SHORTCUTS = [
  { href: "/academy/practice", eyebrow: "Try it", accent: "!text-acid", title: "Practice mode", body: "Draw a card, read it on your own, then compare with the reference. Beginner to advanced." },
  { href: "/deck", eyebrow: "Look it up", accent: "!text-hot", title: "78 card lessons", body: "Symbolism, meanings, observation exercises and a quiz for every card." },
  { href: "/journal", eyebrow: "Track it", accent: "!text-teal", title: "Your progress", body: "Lessons, quizzes and practice history live in your journal's Patterns tab." },
];

export default function AcademyPage() {
  return (
    <LearningStateProvider>
      <div className="space-y-12">
        <SectionHeading eyebrow="Learn to read for yourself" title="The tarot academy" intro="Structured lessons, all 78 card lessons, and practice that builds your own interpretive skill — so you can read without relying on anyone else's interpretation." />
        <div className="grid gap-4 sm:grid-cols-3">
          {SHORTCUTS.map((c) => (
            <Link key={c.href} href={c.href} className="panel-night group block p-6 text-cream no-underline hover:-translate-y-1 hover:border-cream/40">
              <p className={`eyebrow ${c.accent}`}>{c.eyebrow}</p>
              <h2 className="mt-2 text-2xl">{c.title}</h2>
              <p className="mt-1 text-sm text-cream/75">{c.body}</p>
            </Link>
          ))}
        </div>
        {COURSES.map((course) => (
          <section key={course.id} aria-labelledby={`c-${course.id}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id={`c-${course.id}`} className="text-4xl">
                  {course.title}
                </h2>
                <p className="mt-2 text-cream/75">{course.description}</p>
              </div>
            </div>
            <div className="mt-5">
              <CourseProgress lessonIds={course.lessons.map((l) => l.id)} />
            </div>
            <ol className="mt-6 grid gap-4 md:grid-cols-2">
              {course.lessons.map((l, i) => {
                const [prefix, name] = l.title.includes(" · ") ? l.title.split(" · ") : ["", l.title];
                const accent = ACCENTS[i % ACCENTS.length];
                const suit = SUITS.find((x) => x === prefix.toLowerCase());
                return (
                  <li key={l.id} className="panel-night group relative flex gap-5 p-5 transition-transform hover:-translate-y-1 hover:border-cream/40">
                    <span aria-hidden="true" className={`w-12 shrink-0 font-[family-name:var(--font-heading)] text-5xl leading-none ${accent}`}>
                      {suit ? <SuitEmblem suit={suit} className="h-12 w-12" /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      {suit && (
                        <p aria-hidden="true" className="eyebrow mb-1">
                          {prefix}
                        </p>
                      )}
                      <h3 className="text-2xl leading-tight">
                        {/* The whole tile is clickable; the link text stays the full lesson title for screen readers. */}
                        <Link href={`/academy/${l.id}`} className="text-cream no-underline after:absolute after:inset-0 after:rounded-[1.25rem] after:content-['']">
                          {prefix && <span className="sr-only">{prefix} · </span>}
                          {name}
                        </Link>
                      </h3>
                      <p className="mt-1.5 text-sm text-cream/70">{l.summary}</p>
                      <div className="mt-3">
                        <LessonStatus lessonId={l.id} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </LearningStateProvider>
  );
}
