import type { Metadata } from "next";
import { QuestionReading } from "@/components/reading/QuestionReading";

export const metadata: Metadata = { title: "Readings" };

export default function ReadingsPage() {
  return <QuestionReading />;
}
