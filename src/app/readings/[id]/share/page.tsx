import type { Metadata } from "next";
import Link from "next/link";
import { ShareManager } from "@/components/reading/ShareManager";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Share reading", robots: { index: false } };

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentUser();
  if (!session) {
    return (
      <div className="panel mx-auto max-w-md p-6 text-center">
        <h1 className="text-3xl">Sign in to share</h1>
        <p className="mt-2">Share links are available for readings saved to an account.</p>
        <Link href="/login" className="btn btn-primary mt-4">Sign in</Link>
      </div>
    );
  }
  return <ShareManager readingId={(await params).id} />;
}
