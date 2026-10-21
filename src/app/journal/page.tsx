import type { Metadata } from "next";
import { JournalHome } from "@/components/journal/JournalHome";

export const metadata: Metadata = { title: "Journal", robots: { index: false } };

export default function JournalPage() {
  return <JournalHome />;
}
