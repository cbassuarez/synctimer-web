import { test, expect } from '@playwright/test';

test('qr tool builds join url and exports svg', async ({ page }) => {
  await page.goto('/qr');
  await page.getByLabel('Paste Host Share Link(s)').fill(
    'https://synctimerapp.com/host?v=1&host_uuid=123e4567-e89b-12d3-a456-426614174000&device_name=Main',
  );

  await expect(page.locator('.qr-summary__chip.is-ready')).toBeVisible();

  const joinUrl = page.getByTestId('qr-join-url');
  await expect(joinUrl).toContainText('https://synctimerapp.com/join?');
  await expect(joinUrl).toContainText('/join?');

  await expect(page.locator('aside.qr-output .qr-output__preview .qr svg')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SVG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('synctimer-qr.svg');
});

test('qr tool exports branded png', async ({ page }) => {
  await page.goto('/qr');
  await page.getByLabel('Paste Host Share Link(s)').fill(
    'https://synctimerapp.com/host?v=1&host_uuid=123e4567-e89b-12d3-a456-426614174000&device_name=Main',
  );

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('synctimer-qr.png');
  const path = await download.path();
  expect(path).not.toBeNull();
});

test('home header renders and qr link navigates', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-header')).toBeVisible();

  await page.getByRole('link', { name: 'Generate Join QR' }).click();
  await expect(page).toHaveURL(/\/qr/);
});
