import { expect, test } from "@playwright/test";

test("deck library lists all 78 cards and card pages teach and test", async ({ page }) => {
  await page.goto("/deck");
  await expect(page.locator('a[href^="/deck/"]')).toHaveCount(78);
  await page.getByRole("link", { name: "Cups" }).first().click();
  await expect(page.locator('a[href^="/deck/cups-"]')).toHaveCount(14);

  await page.goto("/deck/major-02-the-high-priestess");
  await expect(page.getByRole("heading", { level: 1, name: "The High Priestess" })).toBeVisible();
  await expect(page.getByText("Established tradition · Waite, 1911 (paraphrased)")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Symbolism — and why it matters" })).toBeVisible();

  // Observation exercise: observations first, then reference.
  await page.getByLabel("What objects, animals, colours and symbols stand out?").fill("two pillars, a crescent moon and a scroll");
  await page.getByRole("button", { name: "Reveal the reference symbolism" }).click();
  await expect(page.getByRole("heading", { name: "Traditional symbols you noticed" })).toBeVisible();

  // Quiz requires all answers, then scores.
  await page.getByRole("button", { name: "Check my answers" }).click();
  await expect(page.getByText("Please answer every question before checking.")).toBeVisible();
  const groups = page.locator("form").filter({ hasText: "The High Priestess quiz" }).locator("fieldset");
  const n = await groups.count();
  for (let i = 0; i < n; i++) await groups.nth(i).getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check my answers" }).click();
  await expect(page.getByText(/You scored \d of 4/)).toBeVisible();
});

test("three-card question reading uses position meanings, distinct cards and saves to the journal", async ({ page }) => {
  await page.goto("/readings");
  await page.getByRole("radio", { name: /Three-card reading/ }).check();
  await expect(page.getByText("Situation:").first()).toBeVisible();
  await page.getByRole("button", { name: /Shuffle and draw 3 cards/ }).click();
  await expect(page.getByText("Please write your question")).toBeVisible();
  await page.getByLabel("Career & work").check();
  await page.getByLabel("3. Your question").fill("How should I approach my project deadline?");
  await page.getByRole("button", { name: /Shuffle and draw 3 cards/ }).click();

  await expect(page.getByText(/Choose a card for “Situation”/)).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: "Face-down card 2 of 13" }).click();
  await page.getByRole("button", { name: "Face-down card 7 of 13" }).click();
  await page.getByRole("button", { name: "Face-down card 11 of 13" }).click();

  for (const pos of ["Situation", "Challenge", "Guidance"]) await page.getByRole("button", { name: `Turn over the ${pos} card` }).click();
  await page.getByLabel("Your interpretation first").fill("The first card shows effort; the second shows a block; the third suggests help.");
  await page.getByRole("button", { name: "Save to journal" }).click();

  await expect(page.getByRole("heading", { name: "How the cards relate" })).toBeVisible();
  const names = await page.locator("article ol > li h3").allTextContents();
  expect(names).toHaveLength(3);
  expect(new Set(names.map((t) => t.split("—")[0].trim())).size).toBe(3);

  await page.goto("/journal");
  await expect(page.getByText("“How should I approach my project deadline?”")).toBeVisible();
  await page.getByText("“How should I approach my project deadline?”").click();
  await expect(page.getByText("The first card shows effort")).toBeVisible();
});

test("academy lesson can be completed and practice gives constructive feedback", async ({ page }) => {
  await page.goto("/academy");
  await expect(page.getByRole("heading", { name: "The beginner path" })).toBeVisible();
  await page.getByRole("link", { name: "Level 1 · Introduction to tarot" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByRole("button", { name: "✓ Lesson completed" })).toBeVisible();
  await page.goto("/academy");
  await expect(page.getByText("1 of 12 lessons completed")).toBeVisible();

  await page.goto("/academy/practice");
  await page.getByRole("radio", { name: /Advanced/ }).check();
  await page.getByRole("button", { name: "Draw practice cards" }).click();
  await page.getByLabel(/Your interpretation/).fill("The figure in the first card is moving forward, but the second card shows a block, so the third card suggests patience and support from others.");
  await page.getByRole("button", { name: "Submit and reveal the reference" }).click();
  await expect(page.getByRole("heading", { name: "Feedback on your reasoning" })).toBeVisible();
  await expect(page.getByText("Several interpretations can be reasonable.")).toBeVisible();
});

test("settings, privacy and sign-in pages state their limitations honestly", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("You're using guest mode.")).toBeVisible();
  await page.getByLabel("Use reversed cards").uncheck();
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByText("Settings saved.")).toBeVisible();

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Accounts aren't set up yet" })).toBeVisible();

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "How cards are drawn" })).toBeVisible();
  await expect(page.getByText(/0 of 78 illustrations are complete/)).toBeVisible();
});
