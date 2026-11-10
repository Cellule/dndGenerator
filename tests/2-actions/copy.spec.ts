import { expect, test } from "@playwright/test";

// Unlike Cypress, Playwright can grant clipboard permissions,
// so this test runs instead of being skipped.
test.describe("Actions - Copy", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("copy npc to clipboard", async ({ page }) => {
    // The page also renders a hidden print-only copy of the card; use the visible one.
    // The app copies the whole character sheet, so assert on the description sentence.
    const descriptionSentence = await page
      .getByTestId("npc-description")
      .first()
      .locator("p:not([hidden])")
      .first()
      .textContent();
    await page.getByTestId("copy-button").click();
    const copiedText = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedText).toContain(descriptionSentence ?? "");
  });
});
