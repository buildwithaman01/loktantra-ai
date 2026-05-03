import { test, expect } from "@playwright/test";

test.describe("Loktantra AI — Core User Flow", () => {

  test("home page loads with correct title and onboarding form", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Loktantra AI/);
    await expect(page.getByRole("heading", { name: /personalize your election guide/i })).toBeVisible();
  });

  test("onboarding form submit button is disabled until all fields are filled", async ({ page }) => {
    await page.goto("/");
    const submitBtn = page.locator('button[aria-label="Generate my personalized election guide"]');
    await expect(submitBtn).toBeDisabled();

    await page.fill('[aria-label="Enter your age"]', "22");
    await expect(submitBtn).toBeDisabled(); // Still disabled — state not selected

    await page.selectOption('[aria-label="Select your state"]', "Bihar");
    await page.locator('text=First-time voter').click();
    await expect(submitBtn).toBeEnabled();
  });

  test("onboarding form renders CommandCenter after submission", async ({ page }) => {
    await page.goto("/");
    await page.fill('[aria-label="Enter your age"]', "22");
    await page.selectOption('[aria-label="Select your state"]', "Bihar");
    await page.locator('label:has-text("First-time voter")').click();
    await page.locator('button[aria-label="Generate my personalized election guide"]').click();

    await expect(page.getByRole("region", { name: /ai election assistant/i })).toBeVisible({ timeout: 5000 });
  });

  test("user can submit a question and AI response container is not empty", async ({ page }) => {
    await page.goto("/");
    // Complete onboarding
    await page.fill('[aria-label="Enter your age"]', "25");
    await page.selectOption('[aria-label="Select your state"]', "Delhi");
    await page.locator('text=First-time voter').click();
    await page.locator('button[aria-label="Generate my personalized election guide"]').click();

    // Submit a question
    await page.fill('[aria-label="Enter your voting question"]', "I moved from Delhi to Bihar. What form do I need?");
    await page.locator('button[aria-label="Submit question"]').click();

    // Wait for AI response
    const responseRegion = page.locator('[aria-live="polite"]');
    await expect(responseRegion).not.toBeEmpty({ timeout: 20_000 });
  });

  test("skip-to-content link is the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/skip to main content/i);
  });

  test("accessibility bar buttons are keyboard-accessible", async ({ page }) => {
    await page.goto("/");
    const hcBtn = page.getByRole("button", { name: /enable high contrast/i });
    await hcBtn.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /disable high contrast/i })).toBeVisible();
  });
});
