import { test, expect, type Page } from '@playwright/test';

// Signature mascot contract (docs/DECISIONS.md, 2026-09-27 "Signature mascot", M4-1.5): the AI Pet Usage golden
// retriever as a fixed, decorative, non-interactive, desktop-only sprite. Every number here is the contract.
const PET = '.pet';
const SPRITE = '.pet .pet__sprite';
const DESKTOP: [number, number][] = [[1280, 800], [1440, 900], [1920, 1080], [2560, 1440]];
const BELOW_BREAKPOINT: [number, number][] = [[1279, 800], [1024, 768]];
const CLEARANCE = 16; // px, from every adjacent content / footer text block
const INSET_LEFT = 16; // 1rem
const INSET_BOTTOM = 17.6; // 1.1rem
const SIZE = { width: 60, height: 54 }; // 20 × 18 cells at 3 px
const FOOTER_TEXT = ['.foot-id__line', '.foot-alias', '.foot-links', '.foot-nav', '.foot-legal'];
const ROUTES = ['/', '/case-studies/', '/journey/', '/lab/', '/contact/', '/about/', '/writing/', '/this-route-does-not-exist/'];

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
const rect = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height };
  }, selector) as Promise<Rect | null>;
const intersects = (a: Rect, b: Rect, margin = 0) =>
  !(a.right + margin <= b.left || a.left - margin >= b.right || a.bottom + margin <= b.top || a.top - margin >= b.bottom);
// The left edge of the text column = the smallest (container left + padding-left) over every matching container,
// so the widest section (not the centred hero or a narrow page head) sets the clearance.
const contentLeft = (page: Page, containerSelector: string) =>
  page.evaluate((sel) => {
    const lefts = [...document.querySelectorAll<HTMLElement>(sel)].map(
      (el) => el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft),
    );
    return lefts.length ? Math.min(...lefts) : null;
  }, containerSelector) as Promise<number | null>;
const desktopOnly = (name: string) => test.skip(name !== 'desktop', 'desktop mascot contract');

test('mascot is hidden on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile layout only');
  await page.goto('/');
  await expect(page.locator(PET)).toHaveCount(1);
  await expect(page.locator(PET)).toBeHidden();
});

test('mascot is hidden below the desktop breakpoint', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  for (const [w, h] of BELOW_BREAKPOINT) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');
    await expect(page.locator(PET)).toHaveCount(1);
    await expect(page.locator(PET)).toBeHidden();
  }
});

test('mascot is a fixed 60×54 lower-left sprite at every supported desktop width', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  for (const [w, h] of DESKTOP) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');
    await expect(page.locator(PET)).toBeVisible();
    expect(await page.locator(PET).evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
    const sprite = (await rect(page, SPRITE))!;
    expect(Math.abs(sprite.width - SIZE.width)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(sprite.height - SIZE.height)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(sprite.left - INSET_LEFT)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(h - sprite.bottom - INSET_BOTTOM)).toBeLessThanOrEqual(0.6);
    expect(sprite.top).toBeGreaterThan(0);
    expect(sprite.right).toBeLessThan(w);
  }
});

test('mascot keeps ≥16 px clear of content and footer text and never overlaps them', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  for (const [w, h] of DESKTOP) {
    await page.setViewportSize({ width: w, height: h });
    for (const path of ['/', '/contact/']) {
      await page.goto(path);
      const sprite = (await rect(page, SPRITE))!;
      // page top: the main content column
      const mainLeft = (await contentLeft(page, 'main .container'))!;
      expect(mainLeft - sprite.right, `${path} @${w}: main content column clearance`).toBeGreaterThanOrEqual(CLEARANCE);
      // page end: every footer text block, with a 16 px margin around the sprite
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const footerLeft = (await contentLeft(page, 'footer .container'))!;
      expect(footerLeft - sprite.right, `${path} @${w}: footer column clearance`).toBeGreaterThanOrEqual(CLEARANCE);
      for (const sel of FOOTER_TEXT) {
        const r = (await rect(page, sel))!;
        expect(intersects(sprite, r, CLEARANCE), `${path} @${w}: ${sel} within ${CLEARANCE}px of the mascot`).toBe(false);
      }
    }
  }
});

test('mascot never intercepts pointer input', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of ['/', '/contact/']) {
    await page.goto(path);
    const pet = page.locator(PET);
    expect(await pet.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');
    expect(await pet.evaluate((el) => getComputedStyle(el).cursor)).not.toBe('pointer');
    for (const scrollToEnd of [false, true]) {
      if (scrollToEnd) await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const hits = await page.evaluate((sel) => {
        const b = document.querySelector(sel)!.getBoundingClientRect();
        const points = [[(b.left + b.right) / 2, (b.top + b.bottom) / 2], [b.left + 1, b.top + 1], [b.right - 1, b.top + 1], [b.left + 1, b.bottom - 1], [b.right - 1, b.bottom - 1]];
        return points.map(([x, y]) => document.elementFromPoint(x, y)?.closest('.pet') !== null && document.elementFromPoint(x, y)?.closest('.pet') !== undefined);
      }, SPRITE);
      expect(hits, `${path} scrolled=${scrollToEnd}: hit-test reaches the mascot`).toEqual([false, false, false, false, false]);
    }
  }
});

test('mascot is decorative: aria-hidden, no focusable descendants, no tooltip, exactly one per page', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of ROUTES) {
    await page.goto(path);
    const pet = page.locator(PET);
    await expect(pet, `${path}: one mascot`).toHaveCount(1);
    await expect(pet).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator(`${PET} a, ${PET} button, ${PET} [tabindex], ${PET} input, ${PET} select, ${PET} textarea, ${PET} [contenteditable]`)).toHaveCount(0);
    await expect(page.locator(`${PET} title, ${PET} [title]`)).toHaveCount(0);
    await expect(page.locator(SPRITE)).toHaveAttribute('focusable', 'false');
  }
});

test('mascot causes no horizontal overflow', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  for (const [w, h] of DESKTOP) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `@${w}: horizontal overflow`).toBeLessThanOrEqual(0);
  }
});

test('reduced motion shows the static idle A frame and no animation', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const frames = await page.evaluate(() =>
    [...document.querySelectorAll('.pet .f')].map((g) => ({ cls: g.getAttribute('class'), visibility: getComputedStyle(g).visibility, animation: getComputedStyle(g).animationName })),
  );
  expect(frames.map((f) => f.cls)).toEqual(['f f-a', 'f f-b', 'f f-t']);
  expect(frames.every((f) => f.animation === 'none')).toBe(true);
  expect(frames.map((f) => f.visibility)).toEqual(['visible', 'hidden', 'hidden']);
});

test('normal motion alternates idle frames with exactly one visible frame at a time', async ({ page }, testInfo) => {
  desktopOnly(testInfo.project.name);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const seen = new Set<string>();
  for (let i = 0; i < 14; i++) {
    const visible = await page.evaluate(() => [...document.querySelectorAll('.pet .f')].filter((g) => getComputedStyle(g).visibility === 'visible').map((g) => g.getAttribute('class') ?? ''));
    expect(visible.length, `sample ${i}: exactly one frame visible`).toBe(1);
    seen.add(visible[0]);
    await page.waitForTimeout(150);
  }
  expect(seen.has('f f-a')).toBe(true);
  expect(seen.has('f f-b')).toBe(true);
});
