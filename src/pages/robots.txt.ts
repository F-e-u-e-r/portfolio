// robots.txt generated at build time from the canonical `site` and the PUBLIC_SITE_INDEXABLE flag.
// Crawl policy (DECISIONS 2026-09-24 + 2026-09-26): search / discovery allowed, general model-training reuse disallowed.
// Search-oriented AI crawlers may crawl, training crawlers may not, and `Google-Extended` — Google's control token
// for Gemini training / grounding, not a crawler; no effect on Google Search inclusion or ranking — is disallowed.
// Cloudflare's `/cdn-cgi/` endpoint (Web Analytics beacon, challenges) is not site content and is excluded in every
// allow group: a crawler applies only its most specific group and the `*` group is never merged into a named group.
// Indexing is governed by the per-page robots meta (BaseLayout), not by this file.
import type { APIRoute } from 'astro';
import { parseIndexable } from '../data/routes.mjs';

const ALLOW_SITE = ['Allow: /', 'Disallow: /cdn-cgi/'] as const;
const DISALLOW_ALL = ['Disallow: /'] as const;

const POLICY: ReadonlyArray<readonly [agent: string, rules: ReadonlyArray<string>]> = [
  ['*', ALLOW_SITE],
  ['OAI-SearchBot', ALLOW_SITE],
  ['Claude-SearchBot', ALLOW_SITE],
  ['GPTBot', DISALLOW_ALL],
  ['ClaudeBot', DISALLOW_ALL],
  ['Google-Extended', DISALLOW_ALL],
];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://ccso.shsl.world');
  const blocks = POLICY.map(([agent, rules]) => [`User-agent: ${agent}`, ...rules].join('\n'));
  // Pre-launch the sitemap is still built (so the dist gate can verify it) but not advertised.
  if (parseIndexable(import.meta.env.PUBLIC_SITE_INDEXABLE)) {
    blocks.push(`Sitemap: ${new URL('/sitemap-index.xml', origin).href}`);
  }
  return new Response(`${blocks.join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
