import { test, expect } from '@playwright/test';

test('El robot inicia sesión en el CRM', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', process.env.TEST_EMAIL as string); 
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD as string);

    await page.click('button[type="submit"]');

    await expect(page.locator('h1')).toContainText('Gestión de clientes');
});