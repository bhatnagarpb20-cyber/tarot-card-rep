import type { Metadata } from "next";
import { ReadingDetail } from "@/components/reading/ReadingDetail";

export const metadata: Metadata = { title: "Reading", robots: { index: false } };

export default async function ReadingPage({ params }: { params: Promise<{ id: string }> }) {
  return <ReadingDetail id={(await params).id} />;
}
