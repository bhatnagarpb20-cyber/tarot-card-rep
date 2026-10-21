import Link from "next/link";
import { requireCard } from "@/content/cards";
import type { InterpretationSnapshot } from "@/lib/interpret/schema";
import { TarotCard } from "@/components/cards/TarotCard";
import { Divider } from "@/components/ornament/Ornaments";

function SourceBadge({ snapshot }: { snapshot: InterpretationSnapshot }) {
  const ai = snapshot.interpretation.source === "ai";
  return (
    <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-gold-dark/50 bg-parchment-deep/60 px-3 py-1 text-xs text-ink/80">
      <span className="font-[family-name:var(--font-display)] tracking-[0.12em] uppercase">{ai ? "AI interpretation" : "Reference reading"}</span>
      <span aria-hidden="true">·</span>
      <span>{ai ? `grounded in the card library · ${snapshot.generator.replace("anthropic:", "")}` : "assembled from the card library, no AI"}</span>
    </p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-xl text-burgundy">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/** Renders any interpretation snapshot (reference or AI) in the app's standard structure. */
export function InterpretationView({ snapshot, showCards = true, headingLevel = "h2" }: { snapshot: InterpretationSnapshot; showCards?: boolean; headingLevel?: "h2" | "h3" }) {
  const i = snapshot.interpretation;
  const H = headingLevel;
  return (
    <article className="panel p-5 sm:p-8" aria-label={i.source === "ai" ? "AI interpretation" : "Reference reading"}>
      <SourceBadge snapshot={snapshot} />
      <H className="mt-4 text-2xl sm:text-3xl">The answer in brief</H>
      <p className="mt-2 text-lg leading-relaxed">{i.directAnswer}</p>

      <Divider className="mt-6 !text-gold-dark" />

      <ol className="mt-4 space-y-8">
        {i.cards.map((c) => {
          const card = requireCard(c.cardId);
          return (
            <li key={c.position} className="grid gap-4 sm:grid-cols-[auto_1fr]">
              {showCards && <TarotCard cardId={c.cardId} reversed={c.reversed} size="sm" />}
              <div>
                <p className="eyebrow !text-burgundy">{c.positionLabel}</p>
                <h3 className="text-2xl">
                  {card.name} <span className="text-base font-normal italic text-ink/70">— {c.reversed ? "reversed" : "upright"}</span>
                </h3>
                <p className="mt-2">{c.inContext}</p>
                <details className="mt-3 rounded border border-gold-dark/30 bg-parchment-deep/40 p-3">
                  <summary className="cursor-pointer font-semibold">Traditional meaning &amp; symbolism</summary>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Tradition (Waite, 1911): </span>
                    {c.traditionalMeaning}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {c.symbolism.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <Link href={`/deck/${card.id}`} className="mt-2 inline-block text-sm">
                    Learn this card →
                  </Link>
                </details>
              </div>
            </li>
          );
        })}
      </ol>

      {i.connections && (
        <Section title="How the cards relate">
          <p>{i.connections}</p>
        </Section>
      )}
      <Section title="Patterns to notice">
        <p>{i.patterns}</p>
      </Section>
      <Section title="Challenges and opportunities">
        <p>{i.challengesAndOpportunities}</p>
      </Section>
      <Section title="Practical next steps">
        <ol className="list-decimal space-y-1 pl-5">
          {i.nextSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Section>
      <Section title="Outlook — and its uncertainty">
        <p>{i.outlook}</p>
      </Section>
      <Section title="A question to reflect on">
        <p className="font-[family-name:var(--font-heading)] text-xl italic">{i.reflectionPrompt}</p>
      </Section>
      <Section title="Why this interpretation fits these cards">
        <p className="text-sm text-ink/80">{i.whyThisFits}</p>
      </Section>
    </article>
  );
}
