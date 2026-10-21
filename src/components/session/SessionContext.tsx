"use client";
import { createContext, useContext } from "react";
import type { StorageMode } from "@/lib/readings/client";

const SessionContext = createContext<{ mode: StorageMode }>({ mode: "guest" });

export function SessionProvider({ signedIn, children }: { signedIn: boolean; children: React.ReactNode }) {
  return <SessionContext.Provider value={{ mode: signedIn ? "account" : "guest" }}>{children}</SessionContext.Provider>;
}

/** "account" when signed in (data saved to Supabase), otherwise "guest" (this browser only). */
export function useStorageMode(): StorageMode {
  return useContext(SessionContext).mode;
}
