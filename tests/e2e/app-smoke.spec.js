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
});

test("Avatar Studio style controls update the visible avatar", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  const getPreviewHtml = () => page.locator("#avatar-render").evaluate(element => element.innerHTML);
  await expect(page.locator("#avatar-render svg")).toBeVisible();

  const initialPreview = await getPreviewHtml();
  await page.getByRole("button", { name: "Deep" }).click();
  const deepSkinPreview = await getPreviewHtml();
  expect(deepSkinPreview).not.toBe(initialPreview);
  expect(deepSkinPreview).toContain("#38251f");

  await page.getByRole("tab", { name: "Hair" }).click();
  await page.getByRole("button", { name: "Blonde" }).click();
  const blondeHairPreview = await getPreviewHtml();
  expect(blondeHairPreview).toContain("#d9b85d");

  await page.getByRole("tab", { name: "Outfit" }).click();
  await page.getByRole("button", { name: "Hi-vis gear" }).click();
  const hiVisPreview = await getPreviewHtml();
  expect(hiVisPreview).toContain("#f6b73c");
});
