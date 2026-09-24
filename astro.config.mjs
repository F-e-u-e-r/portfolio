// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { isSitemapRoute } from './src/data/routes.mjs';

// Portfolio v1 — Astro, static-first (§34). Output builds to dist/ and is served by
// Cloudflare Workers Static Assets (wrangler.toml). Canonical domain per scope §2.
export default defineConfig({
  site: 'https://ccso.shsl.world',
  // Directory output + trailing slashes everywhere: /about/ is the one canonical form, in dev and in
  // production (Workers Static Assets `html_handling = "auto-trailing-slash"` redirects /about → /about/).
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // Prefetch is a subtle, professional enhancement (Motion Hierarchy §37, level 4).
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    // Always generated — also pre-launch — so the dist gate can verify it; robots.txt only advertises it
    // when PUBLIC_SITE_INDEXABLE=true. Membership comes from the route-state policy: live routes only.
    sitemap({
      filter: (page) => isSitemapRoute(page),
    }),
  ],
});
