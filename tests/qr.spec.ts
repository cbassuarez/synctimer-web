import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';

async function goToDeployWithOneHost(page: Page) {
  await page.goto('/qr');

  // If persisted hash/prefill state auto-jumped to later steps (often Step 5),
  // jump back to Step 1 via the step rail.
  const railStepOne = page.getByTestId('wizard-rail-step-1');
  const railFallbackStepOne = page.locator('.qr-steps__node').first();
  await expect(railStepOne.or(railFallbackStepOne)).toBeVisible({ timeout: 15000 });
  if (await railStepOne.count()) {
    await railStepOne.click();
  } else {
    await railFallbackStepOne.click();
  }
  await expect(page.getByTestId('wizard-step-1')).toBeVisible({ timeout: 15000 });

  // Step 1: Mode
  await expect(page.getByTestId('mode-wifi')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('mode-wifi').click();
  await expect(page.getByTestId('wizard-next')).toBeEnabled({ timeout: 15000 });
  await page.getByTestId('wizard-next').click();

  // Step 2: Hosts
  await expect(page.getByTestId('wizard-step-2')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('hosts-add')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('hosts-add').click();
  await page.getByTestId('host-uuid-0').fill('123e4567-e89b-12d3-a456-426614174000');
  await page.getByTestId('host-name-0').fill('Main');
  await expect(page.getByTestId('wizard-next')).toBeEnabled({ timeout: 15000 });
  await page.getByTestId('wizard-next').click();

  // Step 3: Room + options (no-op)
  await expect(page.getByTestId('wizard-step-3')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('wizard-next')).toBeEnabled({ timeout: 15000 });
  await page.getByTestId('wizard-next').click();

  // Step 4: Review
  await expect(page.getByTestId('wizard-step-4')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('wizard-next')).toBeEnabled({ timeout: 15000 });
  await page.getByTestId('wizard-next').click();

  // Step 5: Deploy
  await expect(page.getByTestId('wizard-step-5')).toBeVisible({ timeout: 15000 });
}

test('qr tool builds join url and exports svg', async ({ page }) => {
  await goToDeployWithOneHost(page);
  await expect(page.getByTestId('deploy-download-svg')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('deploy-download-png')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('deploy-copy-link')).toBeVisible({ timeout: 15000 });

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
  await expect(page.getByTestId('deploy-download-svg')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('deploy-download-png')).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId('deploy-copy-link')).toBeVisible({ timeout: 15000 });

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
