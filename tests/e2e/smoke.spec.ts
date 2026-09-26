import { test, expect, type Page } from '@playwright/test';

const robots = (page: Page) => page.locator('meta[name="robots"]').getAttribute('content');
// Public navigation (src/data/site.ts): only destinations with substantive content — the header, the mobile
// menu and the footer render the same list (docs/DECISIONS.md, 2026-09-27 — pure evidence portfolio).
const PUBLIC_NAV = ['Case Studies', 'Journey', 'Lab', 'Contact'];
const UNLINKED_ROUTES = ['/about/', '/writing/', '/topics/', '/internal-builds/'];

test('homepage renders with the site title', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle('Eric So — Business Transformation & Applied AI');
  await expect(page.locator('h1')).toContainText('applied AI');
});

test('homepage ends on existing evidence, with no Writing launch promise', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await expect(main).not.toContainText('To be launched');
  await expect(main).not.toContainText('Planned themes');
  await expect(main.locator('a[href="/writing/"]')).toHaveCount(0);
  await expect(main.locator('.lab-block a[href="/lab/"]')).toBeVisible();
  await expect(main.locator('.lab-block .status')).not.toHaveCount(0);
});

test('desktop header shows the public sections', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop layout only');
  await page.goto('/');
  await expect(page.locator('nav[aria-label="Primary"] a')).toHaveText(PUBLIC_NAV);
});

test('mobile disclosure menu lists the public sections and GitHub, nothing marked Soon', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile layout only');
  await page.goto('/');
  await expect(page.locator('nav[aria-label="Primary"]')).toBeHidden();
  await page.locator('details.menu summary').click();
  const panel = page.locator('.menu__panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('a')).toHaveText([...PUBLIC_NAV, 'GitHub ↗']);
  await expect(panel).not.toContainText('Soon');
});

test('no public chrome carries a Soon label or a link to an unlinked route', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header.site-header')).not.toContainText('Soon');
  await expect(page.locator('footer.site-footer')).not.toContainText('Soon');
  await expect(page.locator('nav[aria-label="Footer"] a')).toHaveText(PUBLIC_NAV);
  for (const href of UNLINKED_ROUTES) {
    await expect(page.locator(`header a[href="${href}"], footer a[href="${href}"]`)).toHaveCount(0);
  }
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

test('Contact is a neutral utility page: Email and GitHub only', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.locator('h1')).toHaveText('Contact');
  await expect(page.locator('.contact-row__label')).toHaveText(['Email', 'GitHub / Feuer']);
  const main = page.locator('main');
  for (const phrase of ['Get in touch', 'fastest route', 'Resume', 'Coming soon']) {
    await expect(main).not.toContainText(phrase);
  }
});

test('unknown routes return a real 404 with the custom page', async ({ page }) => {
  const res = await page.goto('/this-route-does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('ROUTE_NOT_FOUND');
  expect(await robots(page)).toBe('noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('Internal Builds is no longer a route: the normal 404 contract applies', async ({ page }) => {
  const res = await page.goto('/internal-builds/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('ROUTE_NOT_FOUND');
  expect(await robots(page)).toBe('noindex');
});

test('a bare path redirects to its trailing-slash form', async ({ page }) => {
  const res = await page.goto('/case-studies');
  expect(res?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe('/case-studies/');
});

test('In Preparation pages are served but not indexable, and promise no specific item', async ({ page }) => {
  for (const path of ['/writing/', '/topics/', '/about/']) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('.state-tag')).toHaveText('In preparation');
    expect(await robots(page)).toBe('noindex, nofollow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://ccso.shsl.world${path}`);
    await expect(page.locator('main')).not.toContainText('First article');
  }
});

test('short pages end with the footer at the viewport bottom; long pages still scroll', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop page shell');
  // Taller than the Contact page's content, so a shell that does not grow leaves a dead band under the footer.
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.goto('/contact/');
  const shell = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    scrollHeight: document.documentElement.scrollHeight,
    footerBottom: document.querySelector('footer.site-footer')!.getBoundingClientRect().bottom + window.scrollY,
  }));
  expect(shell.scrollHeight).toBe(shell.innerHeight);
  expect(Math.abs(shell.footerBottom - shell.innerHeight)).toBeLessThanOrEqual(1);
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight)).toBe(true);
});

test('Under Maintenance page renders chromeless and noindex', async ({ page }) => {
  const res = await page.goto('/under-maintenance/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('.maint__state')).toHaveText('DEGRADED');
  await expect(page.locator('header.site-header')).toHaveCount(0);
  expect(await robots(page)).toBe('noindex, nofollow');
});
