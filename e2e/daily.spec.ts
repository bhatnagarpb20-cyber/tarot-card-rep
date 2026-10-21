import { expect, test } from "@playwright/test";

test.describe("daily ritual (guest mode)", () => {
  test("draws, reveals, interprets, journals, and keeps the same card after refresh", async ({ page }) => {
    await page.goto("/daily");
    await expect(page.getByText("Guest mode:")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Your daily card awaits/ })).toBeVisible();
    await page.getByRole("button", { name: "Begin the ritual" }).click();

    await page.getByLabel("Your intention").fill("to stay curious");
    await page.getByLabel("Career & work").check();
    await page.getByLabel("A personal question").fill("What should I focus on at work today?");
    await page.getByRole("button", { name: "Shuffle the deck" }).click();

    await expect(page.getByRole("heading", { name: "Choose the card that calls to you" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: /Face-down card \d of 7/ })).toHaveCount(7);
    await page.getByRole("button", { name: "Face-down card 4 of 7" }).click();

    // Write-before-reveal step.
    const impressions = page.getByLabel("Before you read the interpretation: what do you notice?");
    await expect(impressions).toBeVisible({ timeout: 10_000 });
    await impressions.fill("A figure looking upward; it feels hopeful.");
    await page.getByRole("button", { name: "Save to journal" }).click();

    // Interpretation.
    await expect(page.getByText("Today's card ·")).toBeVisible();
    const cardName = (await page.getByRole("heading", { level: 1 }).textContent())!.trim();
    await expect(page.getByRole("heading", { name: "The answer in brief" })).toBeVisible();
    await expect(page.getByText("What should I focus on at work today?").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Practical next steps" })).toBeVisible();
    await expect(page.getByText("Reference reading", { exact: true })).toBeVisible();
    await expect(page.getByText("A figure looking upward; it feels hopeful.")).toBeVisible();
    // The card face is either finished artwork described in its label, or labelled honestly as pending.
    await expect(page.getByRole("img", { name: new RegExp(`^${cardName}(:|\\..*Illustration not yet available)`) }).first()).toBeVisible();

    // AI unavailable is explained, not hidden.
    await expect(page.getByText("AI interpretation unavailable")).toBeVisible();

    await page.getByLabel("Your own interpretation and reflections").fill("I want to finish one thing properly.");
    await page.getByLabel("Resonated").check();
    await page.getByRole("button", { name: "Save to journal" }).click();
    await expect(page.getByText("Saved to your journal.")).toBeVisible();

    // Refresh: same card, no new ritual.
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(cardName);
    await expect(page.getByText("I want to finish one thing properly.")).toBeVisible();

    // Extra pull is labelled and separate.
    await page.getByRole("button", { name: "Draw an additional card" }).click();
    await expect(page.getByText("Additional pull · saved separately")).toBeVisible();
    await page.getByRole("button", { name: "Shuffle the deck" }).click();
    await page.getByRole("button", { name: "Face-down card 1 of 7" }).click();
    await page.getByRole("button", { name: "Skip and show the interpretation" }).click();
    await expect(page.getByText("Additional pull · saved as a separate reading")).toBeVisible();
    await expect(page.getByRole("button", { name: /Daily card/ })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(cardName);
  });

  test("is keyboard operable", async ({ page }) => {
    await page.goto("/daily");
    await page.getByRole("button", { name: "Begin the ritual" }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Shuffle the deck" }).focus();
    await page.keyboard.press("Enter");
    const first = page.getByRole("button", { name: "Face-down card 1 of 7" });
    await expect(first).toBeVisible({ timeout: 10_000 });
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Before you read the interpretation: what do you notice?")).toBeVisible({ timeout: 10_000 });
  });
});
