import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", title: /Career Empire/, heading: /Year 12 Careers just levelled up/i },
  { path: "/student/", title: /Career Empire Student Pathway/, heading: /Your Career Empire starts here/i },
  { path: "/teacher/", title: /Career Empire Teacher Pathway/, heading: /Teacher/i },
  { path: "/modules/est-prep/", title: /EST Prep/, heading: /Enter the EST Lab/i }
];

for (const pageSpec of pages) {
  test(`${pageSpec.path} loads its primary screen`, async ({ page }) => {
    await page.goto(pageSpec.path, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(pageSpec.title);
    await expect(page.getByRole("heading", { name: pageSpec.heading }).first()).toBeVisible();
  });
}
