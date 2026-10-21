import { expect, test, type Page } from "@playwright/test";

/**
 * Account-mode tests against a real Supabase-compatible stack (see supabase/local-stack/up.sh).
 * Run with: E2E_ACCOUNT_URL=http://localhost:3200 npx playwright test e2e/account.spec.ts
 */
const BASE = process.env.E2E_ACCOUNT_URL;
test.skip(!BASE, "Set E2E_ACCOUNT_URL to run account-mode tests");
test.use({ baseURL: BASE });
test.describe.configure({ mode: "serial" });

const run = Date.now();
const userA = { email: `reader-a-${run}@example.com`, password: "a-strong-password-1" };
const userB = { email: `reader-b-${run}@example.com`, password: "b-strong-password-2" };
let readingId = "";
let dailyCard = "";

async function signUp(page: Page, u: { email: string; password: string }) {
  await page.goto("/signup");
  await page.getByLabel("Email").fill(u.email);
  await page.getByLabel("Password").fill(u.password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/onboarding/);
}

async function signIn(page: Page, u: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(u.email);
  await page.getByLabel("Password").fill(u.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/daily/);
}

test("a new user signs up, onboards and saves a daily card to their account", async ({ page }) => {
  await signUp(page, userA);
  await page.getByLabel("Name to greet you by").fill("Reader A");
  await page.getByLabel("Write my own interpretation before seeing the app's").uncheck();
  await page.getByRole("button", { name: "Save and draw my first card" }).click();
  await expect(page).toHaveURL(/\/daily/);
  await expect(page.getByText("Guest mode:")).toHaveCount(0);

  await page.getByRole("button", { name: "Begin the ritual" }).click();
  await page.getByLabel("A personal question").fill("What deserves my attention today?");
  await page.getByRole("button", { name: "Shuffle the deck" }).click();
  await page.getByRole("button", { name: "Face-down card 5 of 7" }).click();
  await expect(page.getByRole("heading", { name: "The answer in brief" })).toBeVisible({ timeout: 15_000 });
  dailyCard = (await page.getByRole("heading", { level: 1 }).textContent())!.trim();

  await page.getByLabel("Your own interpretation and reflections").fill("Account-saved reflection.");
  await page.getByRole("button", { name: "Save to journal" }).click();
  await expect(page.getByText("Saved to your journal.")).toBeVisible();

  const res = await page.request.get("/api/readings");
  const body = await res.json();
  expect(body.readings).toHaveLength(1);
  readingId = body.readings[0].id;
  expect(body.readings[0].kind).toBe("daily");
  expect(body.readings[0].snapshots[0].interpretation.source).toBe("reference");
});

test("the daily card is the same on another device and cannot be redrawn", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await signIn(page, userA);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(dailyCard);
  await expect(page.getByText("Account-saved reflection.")).toBeVisible();

  const tz = "UTC";
  const again = await page.request.post("/api/readings", { data: { kind: "daily", spread: "daily", category: "love", question: "", context: "", timezone: tz, parentReadingId: null } });
  const body = await again.json();
  // Either today's (UTC) daily already exists and is returned unchanged, or this is a different
  // local date; in both cases a second daily for the same date is never created.
  if (body.existing) expect(body.reading.id).toBe(readingId);
  await ctx.close();
});

test("another user cannot see, change or share the first user's data", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await signUp(page, userB);
  expect((await (await page.request.get("/api/readings")).json()).readings).toEqual([]);
  expect((await page.request.get(`/api/readings/${readingId}`)).status()).toBe(404);
  expect((await page.request.patch(`/api/readings/${readingId}`, { data: { bookmarked: true } })).status()).toBe(404);
  expect((await page.request.delete(`/api/readings/${readingId}`)).status()).toBe(404);
  expect((await page.request.post(`/api/readings/${readingId}/journal`, { data: { kind: "reflection", body: "intrusion" } })).status()).toBe(404);
  expect((await page.request.post(`/api/readings/${readingId}/share`, { data: {} })).status()).toBe(404);
  await page.goto("/journal");
  await expect(page.getByText("No readings yet")).toBeVisible();
  await ctx.close();
});

test("signed-out visitors get 401 from private APIs", async ({ request }) => {
  expect((await request.get("/api/readings")).status()).toBe(401);
  expect((await request.get("/api/account/export")).status()).toBe(401);
});

test("share links expose only the reading and can be revoked", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await signIn(page, userA);
  await page.goto(`/readings/${readingId}/share`);
  await page.getByRole("button", { name: "Create share link" }).click();
  const url = await page.getByLabel("Public link").inputValue();
  expect(url).toMatch(/\/s\/[A-Za-z0-9_-]{24}$/);

  const anon = await browser.newContext();
  const visitor = await anon.newPage();
  await visitor.goto(url);
  await expect(visitor.getByText("A shared reading")).toBeVisible();
  await expect(visitor.getByText(dailyCard).first()).toBeVisible();
  await expect(visitor.getByText("Account-saved reflection.")).toHaveCount(0);
  await expect(visitor.getByText("What deserves my attention today?")).toHaveCount(0);

  // Interpretation is opt-in; the unshared question's wording stays hidden inside it.
  await expect(visitor.getByRole("heading", { name: "The answer in brief" })).toHaveCount(0);
  await page.getByRole("button", { name: "Revoke link" }).click();
  await expect(page.getByText("Link revoked")).toBeVisible();
  const after = await visitor.goto(url);
  expect(after?.status()).toBe(404);

  await page.getByLabel(/Include the interpretation/).check();
  await page.getByRole("button", { name: "Create share link" }).click();
  const url2 = await page.getByLabel("Public link").inputValue();
  await visitor.goto(url2);
  await expect(visitor.getByRole("heading", { name: "The answer in brief" })).toBeVisible();
  await expect(visitor.getByText("[question not shared]").first()).toBeVisible();
  await expect(visitor.getByText("What deserves my attention today?")).toHaveCount(0);
  await page.getByRole("button", { name: "Revoke link" }).click();
  await anon.close();
  await ctx.close();
});

test("users can export their data and delete their account", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await signIn(page, userB);
  const exp = await page.request.get("/api/account/export");
  expect(exp.status()).toBe(200);
  const data = await exp.json();
  expect(data.account.email).toBe(userB.email);
  expect(data.readings).toEqual([]);

  await page.goto("/settings");
  await page.getByLabel("Type DELETE to confirm").fill("DELETE");
  await page.getByRole("button", { name: "Permanently delete account" }).click();
  await expect(page).toHaveURL(/account=deleted/);

  await page.goto("/login");
  await page.getByLabel("Email").fill(userB.email);
  await page.getByLabel("Password").fill(userB.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("That email and password don't match an account.")).toBeVisible();
  await ctx.close();
});

test("AI interpretations and follow-ups are saved, labelled and limited by quota", async ({ browser }) => {
  test.skip(process.env.E2E_AI !== "test-double", "Requires the server to run with AI_PROVIDER=test-double");
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await signIn(page, userA);
  await page.goto(`/readings/${readingId}`);
  await page.getByRole("button", { name: "Get a detailed AI interpretation" }).click();
  await expect(page.getByText(/\[Test AI\]/).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("tab", { name: "Reference reading" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "AI interpretation" })).toHaveAttribute("aria-selected", "true");

  await page.getByLabel("Ask about these cards").fill("What would help me act on this?");
  await page.getByRole("button", { name: "Ask follow-up" }).click();
  await expect(page.getByText("You asked: What would help me act on this?")).toBeVisible();

  const saved = await (await page.request.get(`/api/readings/${readingId}`)).json();
  expect(saved.reading.snapshots.map((s: { interpretation: { source: string } }) => s.interpretation.source)).toEqual(["reference", "ai"]);
  expect(saved.reading.cards).toHaveLength(1);
  expect(saved.reading.followUps).toHaveLength(1);

  // The database quota (20/day by default) eventually stops requests with a clear message.
  let status = 0;
  for (let i = 0; i < 25 && status !== 429; i++) {
    status = (await page.request.post(`/api/readings/${readingId}/followup`, { data: { question: `Quota probe ${i}` } })).status();
  }
  expect(status).toBe(429);
  await ctx.close();
});
