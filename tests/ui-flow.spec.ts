import { test, expect } from '@playwright/test';

test.describe('UI Interactive Tests', () => {
  
  test('Login and BMI Input UI Flow', async ({ page }) => {
    // 1. Go to Login Page
    await page.goto('/login');
    
    // 2. Perform Login (using a known test account or create one before if needed)
    // Note: In a real scenario, you might want to use a setup step to create a user.
    // For this UI test, we assume the user from previous tests might exist or we register one.
    // Let's Register a fresh user to be safe for this UI flow.
    await page.goto('/register');
    const timestamp = Date.now();
    const username = `ui_test_${timestamp}`;
    const password = 'password123';
    
    await page.fill('input[id="username"]', username);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Register")');
    await expect(page).toHaveURL(/.*login/);

    // 3. Login
    await page.fill('input[id="username"]', username);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/.*dashboard/);

    // 4. Input Weight and Height (Slowly to simulate user behavior if needed, or just fill)
    await page.getByLabel('Weight (kg)').fill('65');
    await page.getByLabel('Height (cm)').fill('170');
    
    // 5. Verify UI elements update (if any real-time validation) or click Calculate
    await page.click('button:has-text("Calculate & Save")');

    // 6. Verify Result UI
    await expect(page.locator('body')).toContainText('Normal');
    
    // Pause here if running in UI mode to let user inspect
    // await page.pause(); 
  });

});
