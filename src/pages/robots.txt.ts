// robots.txt generated at build time from the canonical `site` and the PUBLIC_SITE_INDEXABLE flag.
// Crawl policy (DECISIONS 2026-09-24): search-oriented AI crawlers may crawl, training crawlers may not.
// `Google-Extended` is deliberately absent — that decision is still open.
// Indexing is governed by the per-page robots meta (BaseLayout), not by this file.
import type { APIRoute } from 'astro';
import { parseIndexable } from '../data/routes.mjs';

const POLICY: ReadonlyArray<readonly [agent: string, rule: 'Allow' | 'Disallow']> = [
  ['*', 'Allow'],
  ['OAI-SearchBot', 'Allow'],
  ['Claude-SearchBot', 'Allow'],
  ['GPTBot', 'Disallow'],
  ['ClaudeBot', 'Disallow'],
];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://ccso.shsl.world');
  const blocks = POLICY.map(([agent, rule]) => `User-agent: ${agent}\n${rule}: /`);
  // Pre-launch the sitemap is still built (so the dist gate can verify it) but not advertised.
  if (parseIndexable(import.meta.env.PUBLIC_SITE_INDEXABLE)) {
    blocks.push(`Sitemap: ${new URL('/sitemap-index.xml', origin).href}`);
  }
  return new Response(`${blocks.join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
