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
