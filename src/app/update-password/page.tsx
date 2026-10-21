import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "New password", robots: { index: false } };

export default function Page() {
  return <UpdatePasswordForm />;
}
