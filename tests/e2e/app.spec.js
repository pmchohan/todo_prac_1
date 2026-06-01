import { expect, test } from "@playwright/test";

test("opens the usable Yaad-Dehani workspace", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("button", { name: /add entry/i }).first()).toBeVisible();
  await expect(page.getByLabel("Yaad-Dehani summary").getByText("یاد دہانی")).toBeVisible();
});

test("creates and completes an entry", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /add entry/i }).first().click();
  await page.getByLabel("Title").fill("Water the basil");
  await page.getByRole("button", { name: /save entry/i }).click();

  await expect(page.getByText("Water the basil")).toBeVisible();
  await page.getByRole("button", { name: /mark completed/i }).click();
  await expect(page.getByText("Marked complete.")).toBeVisible();
});
