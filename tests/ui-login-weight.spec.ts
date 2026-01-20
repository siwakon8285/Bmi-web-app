import { test, expect } from '@playwright/test';

test.describe('UI Focus: Login & Weight Input', () => {

  // Setup: Create a user for testing
  // In a real scenario, you might use a pre-existing test user
  const testUser = {
    username: `ui_test_${Date.now()}`,
    password: 'password123'
  };

  test.beforeAll(async ({ request }) => {
    // Ensure database tables exist
    await request.get('/api/setup');

    // Pre-register user via API to save time and focus UI test on Login
    await request.post('/api/auth/register', {
      data: testUser
    });
  });

  test('Should login and input weight successfully', async ({ page }) => {
    // Enable Console Logs for debugging
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));

    // Increase timeout for this specific test
    test.setTimeout(60000);

    // 1. Visit Login Page
    console.log('Visiting Login Page...');
    await page.goto('/login');

    // 2. Perform Login
    console.log('Filling Login Form...');
    await page.fill('input[id="username"]', testUser.username);
    await page.fill('input[id="password"]', testUser.password);
    await page.click('button:has-text("Sign In")');

    // Verify redirection to Dashboard
    console.log('Waiting for Dashboard redirection...');
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    
    // Explicitly wait for Dashboard content to load
    await page.waitForLoadState('networkidle');

    // 3. Input Weight and Height
    console.log('Looking for Weight Input...');
    try {
        // Use a more robust selector that works even if ID is missing (e.g. in production)
        // Weight is typically the first number input on the dashboard
        await page.waitForSelector('input[type="number"]', { state: 'visible', timeout: 30000 });
        
        await page.locator('input[type="number"]').nth(0).fill('75');
        await page.locator('input[type="number"]').nth(1).fill('180');
        
        // Click Calculate button
        await page.click('button:has-text("Calculate & Save")');
        
    } catch (error) {
        console.log('!!! ELEMENT NOT FOUND !!!');
        console.log('Current URL:', page.url());
        console.log('Page Title:', await page.title());
        throw error;
    }

    // 5. Verify Result shows up
    console.log('Verifying result...');
    await expect(page.locator('body')).toContainText('Normal');
    
    // Optional: Check if input fields are cleared after save
    // Use robust selector matching production environment
    await expect(page.locator('input[type="number"]').nth(0)).toBeEmpty();

  });
});
