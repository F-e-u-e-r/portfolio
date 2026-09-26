#!/usr/bin/env node
// Dist gate (`npm run test:site`) — zero dependencies. Verifies the built site in dist/ against the
// route-state policy in src/data/routes.mjs, so the policy, the pages and the gate cannot drift.
// Exit 0 = every check passed; exit 1 = failures listed. Set PUBLIC_SITE_INDEXABLE=true to verify a launch build.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { normalizePath, parseIndexable, robotsFor, routeState, isSitemapRoute } from '../src/data/routes.mjs';

const SITE = 'https://ccso.shsl.world';
const DIST = resolve(process.argv[2] ?? 'dist');
const indexable = parseIndexable(process.env.PUBLIC_SITE_INDEXABLE);
const HOME_TITLE = 'Eric So — Business Transformation & Applied AI';
const TITLE_SUFFIX = ' | Eric So';
const REQUIRED_ARTIFACTS = ['index.html', '404.html', 'robots.txt', 'sitemap-index.xml', 'og.png', 'favicon.svg', 'apple-touch-icon.png'];
// robots.txt groups, in order, exactly as src/pages/robots.txt.ts emits them (DECISIONS 2026-09-24 + 2026-09-26):
// search / discovery allowed, training reuse disallowed; Cloudflare's /cdn-cgi/ excluded in every allow group.
const ROBOTS_TXT_POLICY = [
  'User-agent: *\nAllow: /\nDisallow: /cdn-cgi/',
  'User-agent: OAI-SearchBot\nAllow: /\nDisallow: /cdn-cgi/',
  'User-agent: Claude-SearchBot\nAllow: /\nDisallow: /cdn-cgi/',
  'User-agent: GPTBot\nDisallow: /',
  'User-agent: ClaudeBot\nDisallow: /',
  'User-agent: Google-Extended\nDisallow: /',
];

const failures = [];
let checks = 0;
const check = (cond, message) => {
  checks += 1;
  if (!cond) failures.push(message);
};

if (!existsSync(DIST)) {
  console.error(`verify-dist: ${DIST} does not exist — run \`npm run build\` first`);
  process.exit(1);
}

// ---------- helpers ----------
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)) ?? tag.match(new RegExp(`\\s${name}='([^']*)'`));
  return m ? decode(m[1]) : undefined;
};
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0]);
const metaContent = (html, key, value) =>
  tags(html, /<meta\s[^>]*>/g)
    .filter((t) => attr(t, key) === value)
    .map((t) => attr(t, 'content'));
const fileForPath = (pathname) => {
  const clean = pathname.split(/[?#]/)[0];
  const rel = clean.replace(/^\//, '');
  const candidates = clean.endsWith('/')
    ? [join(DIST, rel, 'index.html')]
    : [join(DIST, rel), join(DIST, `${rel}.html`), join(DIST, rel, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};
const routeOf = (file) => normalizePath(`/${relative(DIST, file).split(sep).join('/')}`);

// ---------- 1. required artifacts ----------
for (const f of REQUIRED_ARTIFACTS) check(existsSync(join(DIST, f)), `missing required artifact: ${f}`);

// ---------- 2. every HTML page ----------
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
check(pages.length > 0, 'no HTML pages found in dist/');
const livePages = [];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);
  const state = routeState(route);
  const where = `${route} (${relative(DIST, file)})`;
  if (state === 'live') livePages.push(route);

  // language + title convention + one description
  check(/<html\s[^>]*lang="en"/.test(html), `${where}: <html lang="en"> missing`);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (route === '/') check(title === HOME_TITLE, `${where}: homepage title is "${title}", expected "${HOME_TITLE}"`);
  else check(title.endsWith(TITLE_SUFFIX) && title.length > TITLE_SUFFIX.length, `${where}: title "${title}" does not follow "<Page> | Eric So"`);
  check(metaContent(html, 'name', 'description').filter(Boolean).length === 1, `${where}: exactly one non-empty meta description expected`);

  // robots: exactly one, equal to what the policy requires for this route in this mode
  const robots = metaContent(html, 'name', 'robots');
  const expected = robotsFor(route, indexable);
  check(robots.length === 1, `${where}: expected exactly one <meta name="robots">, found ${robots.length}`);
  check(robots[0] === expected, `${where}: robots is "${robots[0]}", policy requires "${expected}"`);
  if (!indexable) check(String(robots[0]).startsWith('noindex'), `${where}: pre-launch build must be noindex`);

  // canonical: none on 404; exactly one production URL with a trailing slash everywhere else
  const canonicals = tags(html, /<link\s[^>]*>/g)
    .filter((t) => attr(t, 'rel') === 'canonical')
    .map((t) => attr(t, 'href'));
  if (state === 'not-found') {
    check(canonicals.length === 0, `${where}: the 404 page must not declare a canonical`);
  } else {
    check(canonicals.length === 1, `${where}: expected exactly one canonical, found ${canonicals.length}`);
    check(canonicals[0] === `${SITE}${route}`, `${where}: canonical is "${canonicals[0]}", expected "${SITE}${route}"`);
    const ogUrl = metaContent(html, 'property', 'og:url');
    check(ogUrl.length === 1 && ogUrl[0] === canonicals[0], `${where}: og:url must equal the canonical`);
  }

  // social images: absolute production URLs
  for (const [key, name] of [['property', 'og:image'], ['name', 'twitter:image']]) {
    const v = metaContent(html, key, name);
    check(v.length === 1 && v[0].startsWith(`${SITE}/`), `${where}: ${name} must be one absolute ${SITE} URL`);
  }

  // internal links and asset references resolve inside dist/; page links carry the trailing slash
  const refs = [...html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]).filter((h) => !h.startsWith('//'));
  for (const ref of new Set(refs)) {
    check(Boolean(fileForPath(ref)), `${where}: internal reference ${ref} does not resolve in dist/`);
    const path = ref.split(/[?#]/)[0];
    if (!path.includes('.')) check(path.endsWith('/'), `${where}: internal link ${ref} lacks the trailing slash`);
  }
}

// ---------- 3. sitemap ----------
const sitemapIndex = join(DIST, 'sitemap-index.xml');
if (existsSync(sitemapIndex)) {
  const indexLocs = [...readFileSync(sitemapIndex, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(indexLocs.length >= 1 && indexLocs.every((u) => u.startsWith(`${SITE}/`)), 'sitemap-index.xml must reference sitemaps on the production origin');
  const urls = new Set();
  for (const loc of indexLocs) {
    const f = fileForPath(new URL(loc).pathname);
    check(Boolean(f), `sitemap file ${loc} is not in dist/`);
    if (f) for (const m of readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
  }
  const expectedUrls = new Set(livePages.filter((r) => isSitemapRoute(r)).map((r) => `${SITE}${r}`));
  for (const u of urls) {
    check(u.startsWith(`${SITE}/`) && u.endsWith('/'), `sitemap URL ${u} is not a trailing-slash production URL`);
    check(Boolean(fileForPath(new URL(u).pathname)), `sitemap URL ${u} does not resolve to a page in dist/`);
    check(routeState(u) === 'live', `sitemap lists a non-live route: ${u}`);
  }
  for (const u of expectedUrls) check(urls.has(u), `sitemap is missing the live route ${u}`);
}

// ---------- 4. robots.txt ----------
const robotsTxtPath = join(DIST, 'robots.txt');
if (existsSync(robotsTxtPath)) {
  const txt = readFileSync(robotsTxtPath, 'utf8');
  // Exact, ordered comparison: every policy group, nothing else, and the sitemap advertised only in launch mode.
  const groups = txt.trim().split(/\n{2,}/);
  const expected = indexable ? [...ROBOTS_TXT_POLICY, `Sitemap: ${SITE}/sitemap-index.xml`] : ROBOTS_TXT_POLICY;
  for (const block of ROBOTS_TXT_POLICY) check(groups.includes(block), `robots.txt is missing the group:\n${block}`);
  check(groups.length === expected.length, `robots.txt has ${groups.length} groups, policy expects ${expected.length}`);
  check(groups.every((g, i) => g === expected[i]), 'robots.txt groups must match the policy exactly and in order');
  const hasSitemap = groups.includes(`Sitemap: ${SITE}/sitemap-index.xml`);
  check(hasSitemap === indexable, indexable ? 'robots.txt must advertise the sitemap when PUBLIC_SITE_INDEXABLE=true' : 'pre-launch robots.txt must not advertise the sitemap');
}

// ---------- report ----------
const mode = indexable ? 'launch (PUBLIC_SITE_INDEXABLE=true)' : 'pre-launch (noindex everywhere)';
console.log(`verify-dist: ${pages.length} pages · ${livePages.length} live routes · mode: ${mode} · ${checks} checks`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('verify-dist: all checks passed');
