import { z } from "zod";
import { CATEGORIES } from "@/lib/tarot/types";

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().max(80).optional(),
  timezone: z.string().min(1).max(64).optional(),
  onboarded: z.boolean().optional(),
  allowReversals: z.boolean().optional(),
  writeBeforeReveal: z.boolean().optional(),
  aiInterpretations: z.boolean().optional(),
  defaultCategory: z.enum(CATEGORIES).optional(),
  reducedMotion: z.boolean().optional(),
});
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export interface ProfileView {
  email: string | null;
  displayName: string;
  timezone: string;
  onboarded: boolean;
  allowReversals: boolean;
  writeBeforeReveal: boolean;
  aiInterpretations: boolean;
  defaultCategory: string;
  reducedMotion: boolean;
}
