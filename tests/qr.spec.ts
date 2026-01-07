import { test, expect } from '@playwright/test';

test('qr tool builds join url and exports svg', async ({ page }) => {
  await page.goto('/qr');
  await page.getByLabel('Host Share Link(s) or join link').fill(
    'https://synctimerapp.com/host?v=1&host_uuid=123e4567-e89b-12d3-a456-426614174000&device_name=Main',
  );
  await page.getByRole('button', { name: 'Parse' }).click();

  const joinUrl = page.locator('.right textarea[readonly]');
  await expect(joinUrl).toContainText('https://synctimerapp.com/join?');
  await expect(joinUrl).toContainText('/join?');

  await expect(page.locator('.preview .qr svg')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export SVG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('synctimer-qr.svg');
});

test('home header renders and qr link navigates', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-header')).toBeVisible();

  await page.getByRole('link', { name: 'Generate Join QR' }).click();
  await expect(page).toHaveURL(/\\/qr/);
});
