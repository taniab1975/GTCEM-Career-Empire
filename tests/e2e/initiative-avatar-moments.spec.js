import { expect, test } from "@playwright/test";

test("Initiative uses avatar moments for nudges and rewards", async ({ page }) => {
  await page.goto("/modules/initiative/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("career-empire-initiative-progress-v1");
    localStorage.setItem("career-empire-session", JSON.stringify({
      playerName: "Playwright Learner",
      annualSalary: 25000,
      salary: 25000,
      taxPaid: 0
    }));
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.locator(".ce-avatar-moment")).toHaveCount(0);

  await page.getByRole("button", { name: "Test the gate" }).click();
  const moment = page.locator(".ce-avatar-moment");
  await expect(moment).toBeVisible();
  await expect(moment.locator(".ce-avatar-moment__caption")).toHaveText("Review signal");
  await expect(moment.locator("video")).toHaveAttribute("src", /ecc-boy-think\.mp4/);

  const gateAnswers = {
    definition: "initiative",
    "low-stock": "act",
    "shelf-labels": "improve",
    "hazard-report": "speak",
    "busy-rush": "support",
    "new-register": "step-up"
  };
  for (const [id, value] of Object.entries(gateAnswers)) {
    await page.locator(`[data-core-answer="${id}"]`).selectOption(value);
  }
  await page.getByRole("button", { name: "Test the gate" }).click();

  await expect(moment.locator(".ce-avatar-moment__caption")).toHaveText("Salary banked");
  await expect(moment.locator("video")).toHaveAttribute("src", /ecc-boy-celebrate\.mp4/);

  await page.locator('[data-pathway="scenario"]').click();
  await expect(moment.locator(".ce-avatar-moment__caption")).toHaveText("Decode mission");
  await expect(moment.locator("video")).toHaveAttribute("src", /ecc-boy-wave\.mp4/);
});
