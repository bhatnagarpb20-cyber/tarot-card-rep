import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/daily", "/readings", "/deck", "/deck/major-00-the-fool", "/academy", "/academy/beginner-05-numbers", "/academy/practice", "/journal", "/settings", "/about", "/login", "/signup"];

for (const path of PAGES) {
  test(`no WCAG 2.1 AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary).toEqual([]);
  });
}
