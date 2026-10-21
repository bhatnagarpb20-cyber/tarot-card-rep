import type { ComponentType } from "react";
import { FOOL_ALT, TheFool } from "./major-00-the-fool";
import { MAGICIAN_ALT, TheMagician } from "./major-01-the-magician";
import { HIGH_PRIESTESS_ALT, TheHighPriestess } from "./major-02-the-high-priestess";

/** Hand-drawn vector illustrations, keyed by card ID. Cards not listed here show the pending face. */
export const VECTOR_ART: Record<string, { Component: ComponentType; alt: string }> = {
  "major-00-the-fool": { Component: TheFool, alt: FOOL_ALT },
  "major-01-the-magician": { Component: TheMagician, alt: MAGICIAN_ALT },
  "major-02-the-high-priestess": { Component: TheHighPriestess, alt: HIGH_PRIESTESS_ALT },
};
