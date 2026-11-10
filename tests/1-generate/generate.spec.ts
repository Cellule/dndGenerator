import { expect, test } from "@playwright/test";

test.describe("Generate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show a randomly generated npc on page load", async ({ page }) => {
    // The page also renders a hidden print-only copy of the card; use the visible one
    await expect(page.getByTestId("npc-description").first()).toContainText(/\d+ year old/);
  });

  test("should show a randomly generated npc when the generate button is clicked", async ({ page }) => {
    // The page also renders a hidden print-only copy of the card; use the visible one
    const description = page.getByTestId("npc-description").first();
    const text = await description.textContent();
    await page.getByTestId("generate-button").click();
    await expect(description).not.toContainText(text ?? "");
  });

  test.describe("User Input", () => {
    // TODO: Add tests for user input (race, sex, alignment, plot hook, occupation)
  });
});
