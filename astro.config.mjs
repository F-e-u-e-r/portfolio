// @ts-check
import { defineConfig } from 'astro/config';

// Portfolio v1 — Astro, static-first (§34).
// Output builds to dist/ and is served by Cloudflare Workers Static Assets.
// Canonical domain per scope §2.
export default defineConfig({
  site: 'https://ccso.shsl.world',
  // Static output by default. No SSR adapter in v1 — the RAG live demo (Phase 4)
  // is a separate Cloudflare Worker, not an Astro SSR route.
  build: {
    // Emit /page/index.html for clean URLs behind static hosting.
    format: 'directory',
  },
  // Prefetch is a subtle, professional enhancement (Motion Hierarchy §37, level 4).
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
