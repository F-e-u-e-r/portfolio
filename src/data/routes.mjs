// Route-state policy — the single source of truth for what is indexable.
// Consumed by: astro.config.mjs (sitemap filter), BaseLayout (robots enforcement),
// src/pages/robots.txt.ts (sitemap advertising) and scripts/verify-dist.mjs (the dist gate).
// Plain ESM so the Astro config can import it without a TypeScript loader.

/** Routes that exist in the IA but whose content has not launched: 200 + noindex, nofollow, never in the sitemap. */
export const PLACEHOLDER_ROUTES = ['/about/', '/writing/', '/topics/'];

/** Degraded-state page: 200 + noindex, nofollow, never in the sitemap. */
export const MAINTENANCE_ROUTES = ['/under-maintenance/'];

/** Astro's 404 route — emitted as /404.html and served with a real 404 status by Workers Static Assets. */
export const NOT_FOUND_ROUTE = '/404/';

export const ROBOTS = /** @type {const} */ ({
  live: 'index, follow',
  prelaunch: 'noindex, nofollow',
  placeholder: 'noindex, nofollow',
  maintenance: 'noindex, nofollow',
  'not-found': 'noindex',
});

/** Normalise a pathname, URL or dist-relative file path to the `/segment/` form used above. */
export function normalizePath(input) {
  let p = String(input);
  try {
    p = new URL(p).pathname;
  } catch {
    /* already a pathname */
  }
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (p.endsWith('.html')) p = `${p.slice(0, -'.html'.length)}/`; // /404.html → /404/
  if (!p.endsWith('/')) p = `${p}/`;
  return p;
}

/** @returns {'live' | 'placeholder' | 'maintenance' | 'not-found'} */
export function routeState(pathnameOrUrl) {
  const p = normalizePath(pathnameOrUrl);
  if (p === NOT_FOUND_ROUTE) return 'not-found';
  if (PLACEHOLDER_ROUTES.includes(p)) return 'placeholder';
  if (MAINTENANCE_ROUTES.includes(p)) return 'maintenance';
  return 'live';
}

/** Sitemap membership: live routes only — placeholder, maintenance and 404 never appear. */
export function isSitemapRoute(pathnameOrUrl) {
  return routeState(pathnameOrUrl) === 'live';
}

/** PUBLIC_SITE_INDEXABLE: only the exact string "true" opens indexing. Unset or anything else fails closed. */
export function parseIndexable(value) {
  return value === 'true';
}

/** The robots directive the policy requires for a route, given the site-wide flag. */
export function robotsFor(pathnameOrUrl, siteIndexable) {
  const state = routeState(pathnameOrUrl);
  if (state !== 'live') return ROBOTS[state];
  return siteIndexable ? ROBOTS.live : ROBOTS.prelaunch;
}
