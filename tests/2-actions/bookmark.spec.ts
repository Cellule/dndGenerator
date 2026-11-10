import { expect, test } from "@playwright/test";

test.describe("Generate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have exact same npc when bookmarked", async ({ page }) => {
    // The page also renders a hidden print-only copy of the card; use the visible one
    const description = page.getByTestId("npc-description").first();
    const text = await description.textContent();
    await page.getByTestId("bookmark-button").click();
    // should have added query param "d" to location
    await expect(page).toHaveURL(/\?d=/);
    await page.reload();
    await expect(description).toContainText(text ?? "");
  });
});
