// Tests for scripts/smoke-preview.sh — `npm run test:tools`.
// A loopback mock plays a deployed Preview (the edge's navigation-only custom-404 semantics included) and records
// every request's headers, so the Cloudflare Access contract — both variables or neither, fail closed before any
// request — is verified without a real credential, a real Preview or network access. The values below are dummies.
// The script runs through the async `spawn`: the mock lives in this process, so a synchronous spawn would block
// the event loop that has to answer the script's requests.

import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const script = resolve(here, '../../scripts/smoke-preview.sh');

const CLIENT_ID = 'dummy-client-id.access';
const CLIENT_SECRET = 'dummy-client-secret-not-a-real-credential';

const page = (robots, canonical) =>
  `<!DOCTYPE html><html><head><link rel="canonical" href="${canonical}"><meta name="robots" content="${robots}"></head><body>site</body></html>`;
const notFoundPage =
  '<!DOCTYPE html><html><head><meta name="robots" content="noindex"></head><body><code>ROUTE_NOT_FOUND</code></body></html>';

/** Per-run mock behaviour; reset by run(). */
const mock = { navigationServesCustom404: true };
let requests = [];
let server;
let base;

function handle(req, res) {
  requests.push({ path: req.url, headers: { ...req.headers } });
  const send = (status, body, headers = {}) => {
    res.writeHead(status, { 'content-type': 'text/html', ...headers });
    res.end(body);
  };
  switch (req.url) {
    case '/':
      return send(200, page('noindex, nofollow', 'https://ccso.shsl.world/'));
    case '/robots.txt':
      return send(200, 'User-agent: *\nAllow: /\n', { 'content-type': 'text/plain' });
    case '/sitemap-index.xml':
      return send(200, '<sitemapindex/>', { 'content-type': 'application/xml' });
    case '/case-studies':
      return send(307, '', { location: '/case-studies/' });
    case '/case-studies/':
      return send(200, page('noindex, nofollow', 'https://ccso.shsl.world/case-studies/'));
    default:
      // The edge: dist/404.html for a navigation request, a plain body for every other client — both HTTP 404.
      if (req.headers['sec-fetch-mode'] === 'navigate' && mock.navigationServesCustom404) return send(404, notFoundPage);
      return send(404, 'Not found');
  }
}

before(async () => {
  server = createServer(handle);
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

/**
 * Runs the script against the mock with exactly the given variables on top of an environment scrubbed of the
 * variables under test. Resolves with the exit status, both output streams and the requests the mock saw.
 */
function run({ env = {}, target = base, navigationServesCustom404 = true } = {}) {
  requests = [];
  mock.navigationServesCustom404 = navigationServesCustom404;
  const scrubbed = { ...process.env };
  for (const name of ['CF_ACCESS_CLIENT_ID', 'CF_ACCESS_CLIENT_SECRET', 'PUBLIC_SITE_INDEXABLE']) delete scrubbed[name];
  return new Promise((done, fail) => {
    const child = spawn('bash', [script, target], { env: { ...scrubbed, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', fail);
    child.on('close', (status) => done({ status, stdout, stderr, requests }));
  });
}

const accessHeadersOf = (r) => [r.headers['cf-access-client-id'], r.headers['cf-access-client-secret']];

// Every request the script makes, in order — the complete list of requests that would carry the Access token.
const EXPECTED_REQUESTS = [
  '/', // status
  '/this-route-does-not-exist/', // status, bare client
  '/this-route-does-not-exist/', // status, navigation
  '/this-route-does-not-exist/', // body, navigation
  '/robots.txt',
  '/sitemap-index.xml',
  '/case-studies', // redirect target
  '/', // body: canonical + robots meta
];

test('neither Access variable: every check passes over loopback and no Access header is sent', async () => {
  const { status, stdout, requests: seen } = await run();
  assert.equal(status, 0, stdout);
  assert.match(stdout, /all checks passed/);
  assert.equal(stdout.match(/^FAIL/gm), null);
  assert.deepEqual(seen.map((r) => r.path), EXPECTED_REQUESTS);
  for (const r of seen) assert.deepEqual(accessHeadersOf(r), [undefined, undefined], r.path);
});

test('both Access variables: every request carries CF-Access-Client-Id and CF-Access-Client-Secret', async () => {
  const { status, stdout, requests: seen } = await run({
    env: { CF_ACCESS_CLIENT_ID: CLIENT_ID, CF_ACCESS_CLIENT_SECRET: CLIENT_SECRET },
  });
  assert.equal(status, 0, stdout);
  assert.match(stdout, /Access service token present/);
  assert.deepEqual(seen.map((r) => r.path), EXPECTED_REQUESTS);
  for (const r of seen) assert.deepEqual(accessHeadersOf(r), [CLIENT_ID, CLIENT_SECRET], r.path);
  assert.equal(stdout.includes(CLIENT_SECRET), false, 'the secret is never printed');
});

for (const only of ['CF_ACCESS_CLIENT_ID', 'CF_ACCESS_CLIENT_SECRET']) {
  test(`only ${only}: refuses to run before any network request`, async () => {
    const { status, stdout, stderr, requests: seen } = await run({ env: { [only]: 'lonely-value' } });
    assert.equal(status, 1);
    assert.equal(seen.length, 0, 'no request reached the mock');
    assert.match(stderr, /must be set together/);
    assert.equal(stdout.match(/^(ok|FAIL)/gm), null, 'no check ran');
  });
}

test('a navigation request that does not get the custom 404 page fails the contract', async () => {
  const { status, stdout } = await run({ navigationServesCustom404: false });
  assert.equal(status, 1);
  assert.match(stdout, /^FAIL {2}custom 404 page on navigation/m);
  assert.match(stdout, /^ok {4}GET unknown route status \(navigation\) → 404/m, 'the status contract still holds');
});

test('PUBLIC_SITE_INDEXABLE=true against a pre-launch host fails on the robots check only', async () => {
  const { status, stdout } = await run({ env: { PUBLIC_SITE_INDEXABLE: 'true' } });
  assert.equal(status, 1);
  const failures = stdout.match(/^FAIL.*$/gm) ?? [];
  assert.equal(failures.length, 1, stdout);
  assert.match(failures[0], /homepage robots meta \(PUBLIC_SITE_INDEXABLE=true\).*expected \[index, follow\]/);
});

test('a non-loopback http base URL is refused before any request', async () => {
  const { status, stderr, requests: seen } = await run({ target: 'http://example.com' });
  assert.equal(status, 1);
  assert.equal(seen.length, 0);
  assert.match(stderr, /must be https/);
});
