import type { Metadata } from "next";
import { PracticeMode } from "@/components/learning/PracticeMode";
import { SectionHeading } from "@/components/ornament/Ornaments";

export const metadata: Metadata = { title: "Practice mode" };

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Academy" title="Practice interpretation" intro="Draw a card, interpret it without help, then compare your reasoning with the reference. Practice draws are separate from your readings." />
      <PracticeMode />
    </div>
  );
}
