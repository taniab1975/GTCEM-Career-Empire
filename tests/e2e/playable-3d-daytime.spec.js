import { expect, test } from "@playwright/test";

test("playable-3d town loads with daytime outdoor lighting", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/playable-3d/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Career Empire/);
  await expect(page.getByRole("heading", { name: "Town Square" })).toBeVisible();
  await expect(page.locator("#scene")).toBeVisible();
  await expect(page.locator("#loading")).toBeHidden({ timeout: 45000 });
  await expect(page.locator("#scene")).toHaveAttribute("data-rendered", "true", { timeout: 15000 });

  const diagnostics = await page.locator("#diagnostics").evaluate(element => JSON.parse(element.dataset.state || element.value));
  expect(diagnostics.mode).toBe("town");
  expect(diagnostics.lighting.readsAsDaytime).toBe(true);
  expect(diagnostics.lighting.environmentIntensity).toBeGreaterThanOrEqual(0.8);
  expect(diagnostics.lighting.sunIntensity).toBeGreaterThanOrEqual(5);
  expect(diagnostics.lighting.fogNear).toBeGreaterThanOrEqual(120);
  expect(diagnostics.pixelColours).toBeGreaterThan(8);
});
