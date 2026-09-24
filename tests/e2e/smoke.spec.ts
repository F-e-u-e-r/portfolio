import { test, expect, type Page } from '@playwright/test';

const robots = (page: Page) => page.locator('meta[name="robots"]').getAttribute('content');

test('homepage renders with the site title', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle('Eric So — Business Transformation & Applied AI');
  await expect(page.locator('h1')).toContainText('applied AI');
});

test('desktop header shows the five primary sections', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop layout only');
  await page.goto('/');
  const links = page.locator('nav[aria-label="Primary"] a');
  await expect(links).toHaveCount(5);
  await expect(links).toHaveText(['Case Studies', 'Journey', 'Lab', 'About', 'Contact']);
});

test('mobile disclosure menu lists every route, Soon items marked', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile layout only');
  await page.goto('/');
  await expect(page.locator('nav[aria-label="Primary"]')).toBeHidden();
  await page.locator('details.menu summary').click();
  const panel = page.locator('.menu__panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('a')).toHaveCount(9); // 8 routes + GitHub
  await expect(panel.locator('.nav__soon')).toHaveCount(3);
});

test('Matrix boot runs on a first visit and marks itself seen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#matrix-boot')).toHaveCount(0, { timeout: 5_000 }); // ~0.95s boot, then removed
  expect(await page.evaluate(() => localStorage.getItem('boot-seen'))).toBe('1');
  await expect(page.locator('html')).not.toHaveAttribute('data-booting', '');
});

test('Matrix boot is skipped on a repeat visit', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('boot-seen', '1'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-boot-skip', '');
  await expect(page.locator('#matrix-boot')).toHaveCount(0);
});

test('Matrix boot is skipped under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-boot-skip', '');
  await expect(page.locator('#matrix-boot')).toHaveCount(0);
});

test('Journey renders the professional spine and the build stream', async ({ page }) => {
  await page.goto('/journey/');
  await expect(page.locator('.spine .spine__node').first()).toBeVisible();
  await expect(page.locator('.rows .row').first()).toBeVisible();
  expect(await page.locator('.rows .row .chip').count()).toBeGreaterThan(0);
});

test('unknown routes return a real 404 with the custom page', async ({ page }) => {
  const res = await page.goto('/this-route-does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('ROUTE_NOT_FOUND');
  expect(await robots(page)).toBe('noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('a bare path redirects to its trailing-slash form', async ({ page }) => {
  const res = await page.goto('/case-studies');
  expect(res?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe('/case-studies/');
});

test('In Preparation pages are served but not indexable', async ({ page }) => {
  const res = await page.goto('/writing/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toContainText('being prepared');
  expect(await robots(page)).toBe('noindex, nofollow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ccso.shsl.world/writing/');
});

test('Under Maintenance page renders chromeless and noindex', async ({ page }) => {
  const res = await page.goto('/under-maintenance/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('.maint__state')).toHaveText('DEGRADED');
  await expect(page.locator('header.site-header')).toHaveCount(0);
  expect(await robots(page)).toBe('noindex, nofollow');
});
