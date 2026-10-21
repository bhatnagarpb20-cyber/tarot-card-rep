import { describe, expect, it } from "vitest";
import { DECK, getCard } from "./index";
import { validateDeck } from "@/lib/tarot/validate";
import { MAJOR_NAMES } from "@/lib/tarot/ids";

describe("78-card knowledge base", () => {
  it("passes full validation with no problems", () => {
    expect(validateDeck(DECK)).toEqual([]);
  });

  it("uses the conventional Rider–Waite–Smith major arcana sequence", () => {
    expect(DECK.slice(0, 22).map((c) => c.name)).toEqual([...MAJOR_NAMES]);
    expect(getCard("major-08-strength")?.name).toBe("Strength");
    expect(getCard("major-11-justice")?.name).toBe("Justice");
  });

  it("builds canonical ids and names for minor arcana", () => {
    expect(getCard("cups-01-ace")?.name).toBe("Ace of Cups");
    expect(getCard("swords-13-queen")?.name).toBe("Queen of Swords");
    expect(getCard("pentacles-14-king")?.numeral).toBe("King");
  });

  it("detects an incomplete deck", () => {
    const broken = DECK.slice(0, 77);
    expect(validateDeck(broken).some((p) => p.includes("Expected 78"))).toBe(true);
  });

  it("detects a dangling related-card reference", () => {
    const [first, ...rest] = DECK;
    const bad = { ...first, related: [{ id: "cups-02-two", reason: "fine reference here" }, { id: "major-21-the-wurld", reason: "typo reference here" }] };
    // Matches the id pattern but names no real card.
    expect(validateDeck([bad, ...rest]).some((p) => p.includes("unknown card"))).toBe(true);
  });
});
