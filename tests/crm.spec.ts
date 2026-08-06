import { test, expect } from '@playwright/test';

// PRUEBA RLS
test('Un intruso no puede ver los clientes de otros (Prueba RLS)', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.locator('body')).toContainText('No se han encontrado clientes');
});

// CREAR CLIENTE DESDE 0
test('El usuario puede crear un cliente particular', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', process.env.TEST_EMAIL as string); 
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD as string); 
    await page.click('button[type="submit"]');

    await expect(page.locator('h1')).toContainText('Gestión de clientes');

    await page.click('text="+ Añadir Nuevo Cliente"');

    const nombreAleatorio = 'Robot ' + Date.now();
    await page.fill('input[name="nombreCompleto"]', nombreAleatorio);
    await page.selectOption('select[name="tipoCliente"]', 'Particular');
    await page.fill('input[name="telefono"]', '600123456');

    await page.click('button:has-text("Guardar")');
    await expect(page.getByText('Cliente guardado correctamente').first()).toBeVisible();

    await expect(page.locator('body')).toContainText(nombreAleatorio);
});