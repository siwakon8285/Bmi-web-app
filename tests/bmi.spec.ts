import { test, expect } from '@playwright/test';

const generateRandomUser = () => {
  const timestamp = Date.now();
  return {
    username: `user_${timestamp}`,
    password: 'password123'
  };
};

const user = generateRandomUser();

test.describe('BMI App End-to-End Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ request }) => {
    // Ensure database tables exist
    const response = await request.get('/api/setup');
    expect(response.ok()).toBeTruthy();
  });

  test('Case 1: User Registration', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[id="username"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('button:has-text("Register")');
    
    // Expect to be redirected to login page or show success
    // Based on previous code, it redirects to login or stays on register with success message?
    // Let's assume it redirects to login or we can check URL
    await expect(page).toHaveURL(/.*login/);
  });

  test('Case 2: User Login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[id="username"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('button:has-text("Sign In")');

    // Expect to be redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('Case 3: Calculate BMI - Normal Weight', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[id="username"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*dashboard/);

    // Fill BMI form
    await page.getByLabel('Weight (kg)').fill('70');
    await page.getByLabel('Height (cm)').fill('175');
    await page.click('button:has-text("Calculate & Save")');

    // Verify result
    // BMI = 70 / (1.75 * 1.75) = 22.86 -> Normal
    await expect(page.locator('body')).toContainText('Normal');
  });

  test('Case 4: Calculate BMI - Obese', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[id="username"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*dashboard/);

    // Fill BMI form
    await page.getByLabel('Weight (kg)').fill('100');
    await page.getByLabel('Height (cm)').fill('160');
    await page.click('button:has-text("Calculate & Save")');

    // Verify result
    // BMI = 100 / (1.6 * 1.6) = 39.06 -> Obese
    await expect(page.locator('body')).toContainText('Obese');
  });

  test('Case 5: Logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[id="username"]', user.username);
    await page.fill('input[id="password"]', user.password);
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*dashboard/);

    // Click logout
    await page.click('button:has-text("Logout")');

    // Expect to be redirected to login
    await expect(page).toHaveURL(/.*login/);
  });
});
