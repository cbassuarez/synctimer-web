import { test, expect } from '@playwright/test';
import fs from 'node:fs';

async function goToDeployWithOneHost(page: any) {
  await page.goto('/qr');

  // Step 1: Mode
  await expect(page.getByTestId('mode-wifi')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('mode-wifi').click();
  await expect(page.getByTestId('wizard-next')).toBeEnabled();
  await page.getByTestId('wizard-next').click();

  // Step 2: Hosts
  await expect(page.getByTestId('hosts-add')).toBeVisible();
  await page.getByTestId('hosts-add').click();

  await expect(page.getByTestId('host-uuid-0')).toBeVisible();
  await page.getByTestId('host-uuid-0').fill('123e4567-e89b-12d3-a456-426614174000');
  await page.getByTestId('host-name-0').fill('Main');

  await page.getByTestId('wizard-next').click();

  // Step 3: Room label + options (optional; don’t depend on labels)
  await expect(page.getByTestId('room-label')).toBeVisible();
  await page.getByTestId('wizard-next').click();

  // Step 4: Review
  // If you already have a stable join-url test id, keep using it (looks like you do).
  await expect(page.getByTestId('qr-join-url')).toBeVisible();
  await expect(page.getByTestId('qr-join-url')).toContainText('https://synctimerapp.com/join?');

  await page.getByTestId('wizard-next').click();

  // Step 5: Deploy
  await expect(page.getByTestId('deploy-copy-link')).toBeVisible();
  await expect(page.getByTestId('deploy-download-svg')).toBeVisible();
  await expect(page.getByTestId('deploy-download-png')).toBeVisible();
}

test('qr tool builds join url and exports svg', async ({ page }) => {
  await goToDeployWithOneHost(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('deploy-download-svg').click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.svg$/i);

  const p = await download.path();
  expect(p).toBeTruthy();

  const svg = fs.readFileSync(p!, 'utf8');
  expect(svg).toContain('<svg');
});

test('qr tool exports branded png', async ({ page }) => {
  await goToDeployWithOneHost(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('deploy-download-png').click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.png$/i);

  const p = await download.path();
  expect(p).toBeTruthy();

  // Lightweight sanity: non-empty file
  const buf = fs.readFileSync(p!);
  expect(buf.byteLength).toBeGreaterThan(1000);
});
