import { test, expect } from '@playwright/test';

test.describe('Basic functionality', () => {
   test('should load the homepage', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Circle/);
   });

   test('should have working navigation', async ({ page }) => {
      await page.goto('/');
      // Add more navigation tests based on your app structure
   });

   test('API health check', async ({ request }) => {
      const response = await request.get('/api/health');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data).toHaveProperty('status');
   });
});
