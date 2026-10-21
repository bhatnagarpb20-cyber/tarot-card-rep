import type { Metadata } from "next";
import { DailyRitual } from "@/components/daily/DailyRitual";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Daily card" };

export default async function DailyPage() {
  const session = await getCurrentUser();
  return <DailyRitual mode={session ? "account" : "guest"} />;
}
