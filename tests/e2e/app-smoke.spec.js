import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", title: /Career Empire/, heading: /Year 12 Careers just levelled up/i },
  { path: "/student/", title: /Career Empire Student Pathway/, heading: /Your Career Empire starts here/i },
  { path: "/teacher/", title: /Career Empire Teacher Pathway/, heading: /Teacher/i },
  { path: "/modules/est-prep/", title: /EST Prep/, heading: /Enter the EST Lab/i },
  { path: "/modules/avatar/", title: /Avatar Studio/, heading: /Build your future self/i }
];

for (const pageSpec of pages) {
  test(`${pageSpec.path} loads its primary screen`, async ({ page }) => {
    await page.goto(pageSpec.path, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(pageSpec.title);
    await expect(page.getByRole("heading", { name: pageSpec.heading }).first()).toBeVisible();
  });
}

test("Avatar Studio saves a future-self profile locally", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  await page.getByRole("tab", { name: "Future" }).click();
  await page.getByLabel("Occupation I am curious about").fill("Graphic designer");
  await page.getByLabel("Training or skills I may need").fill("Portfolio practice and design software");
  await page.getByLabel("A strength I want this avatar to show").fill("Creative problem solving");
  await page.getByRole("button", { name: "Save Avatar" }).click();

  await expect(page.getByText("Saved 100% avatar profile.")).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("career-empire-avatar-v1")));
  expect(saved.latest.occupation).toBe("Graphic designer");
  expect(saved.latest.completion).toBe(100);
  expect(saved.latest.avatarSpec.slots.uniform).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.hairStyle).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.eyeColour).toBeTruthy();
});

test("Avatar Studio defaults to the ECC rig bases", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#avatar-render .avatar-production-rig")).toBeVisible();
  await expect(page.locator('[data-avatar-value="custom-trousers"]')).toHaveCount(0);
  await expect(page.locator('[data-avatar-value="custom-skirt"]')).toHaveCount(0);
  await expect(page.locator('[data-avatar-value="ecc-boy-rig-source"]')).toBeVisible();
  await expect(page.locator('[data-avatar-value="ecc-girl-rig-source"]')).toBeVisible();
});

test("Avatar Studio ECC rig uses starter modular art layers", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  const getPreviewHtml = () => page.locator("#avatar-render").evaluate(element => element.innerHTML);

  await page.locator('[data-avatar-value="ecc-boy-rig-source"]').click();
  await expect(page.locator("#avatar-render .avatar-production-rig")).toBeVisible();
  expect(await getPreviewHtml()).toContain('data-rig-layer="sheet-base.png"');

  await page.locator('[data-avatar-value="deep"]').click();
  const deepSkinPreview = await getPreviewHtml();
  expect(deepSkinPreview).toContain('data-rig-layer="skin/mask.png:tint"');
  expect(deepSkinPreview).toContain('data-rig-tint-kind="skin"');
  expect(deepSkinPreview).toContain("#38251f");

  await page.locator('[data-avatar-key="eyeColour"][data-avatar-value="green"]').click();
  const greenEyesPreview = await getPreviewHtml();
  expect(greenEyesPreview).toContain('data-rig-feature="eye-colour"');
  expect(greenEyesPreview).toContain('data-eye-colour="green"');
  expect(greenEyesPreview).toContain("#5f7d32");

  await page.getByRole("tab", { name: "Hair" }).click();
  await expect(page.locator('[data-avatar-value="crop"]')).toBeDisabled();
  await expect(page.locator('[data-avatar-value="curls"]')).toBeDisabled();
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="brown"]')).toBeVisible();
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="blonde"]')).toBeDisabled();

  await page.getByRole("tab", { name: "Outfit" }).click();
  await expect(page.locator('[data-avatar-value="ecc-current-uniform"]')).toBeVisible();
  await expect(page.locator('[data-avatar-value="ecc-sports"]')).toBeDisabled();
  await page.locator('[data-avatar-value="earrings"]').click();
  const earringsPreview = await getPreviewHtml();
  expect(earringsPreview).toContain('data-rig-layer="accessories/small-earrings.png"');
  await expect(page.locator('[data-avatar-value="badge"]')).toBeDisabled();
  await expect(page.locator('[data-avatar-value="glasses"]')).toBeDisabled();

  await page.getByRole("tab", { name: "Looks" }).click();
  await page.locator('[data-avatar-value="freckled"]').click();
  expect(await getPreviewHtml()).toContain('data-rig-feature="freckles"');
});

test("Initiative rewards salary only when learning progress is proven", async ({ page }) => {
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

  await page.getByRole("button", { name: "Test the gate" }).click();
  await expect(page.locator("#reward-console")).toContainText("Gate still locked");
  await expect(page.locator("#metric-salary-boost")).toHaveText("$0");

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

  await expect(page.locator("#reward-console")).toContainText("Unlock Gate salary banked");
  await expect(page.locator("#metric-salary-boost")).toHaveText("$500");
  await expect(page.locator("#metric-tax-contribution")).toHaveText("$50");

  const afterGate = await page.evaluate(() => ({
    moduleState: JSON.parse(localStorage.getItem("career-empire-initiative-progress-v1")),
    session: JSON.parse(localStorage.getItem("career-empire-session"))
  }));
  expect(afterGate.moduleState.salaryBoost).toBe(500);
  expect(afterGate.moduleState.taxContribution).toBe(50);
  expect(afterGate.moduleState.rewardedMilestones["unlock-gate"].earnedDelta).toBe(500);
  expect(afterGate.session.annualSalary).toBe(25500);
  expect(afterGate.session.taxPaid).toBe(50);
  expect(afterGate.session.economyLog[0].moduleId).toBe("initiative");
  expect(afterGate.session.economyLog[0].earnedDelta).toBe(500);

  await page.locator('[data-pathway="scenario"]').click();
  await page.getByRole("button", { name: "Submit scenario proof" }).click();
  await expect(page.locator("#reward-console")).toContainText("Mission proof not banked yet");
  await expect(page.locator("#pathway-feedback")).toContainText("Mission proof needs one more pass");
  await expect(page.locator("#metric-salary-boost")).toHaveText("$500");

  const afterScenario = await page.evaluate(() => JSON.parse(localStorage.getItem("career-empire-initiative-progress-v1")));
  expect(afterScenario.salaryBoost).toBe(500);
  expect(afterScenario.taxContribution).toBe(50);
});
