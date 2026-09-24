// Regression tests for scripts/extract-wrangler-preview-url.mjs — `npm run test:tools`.
// The fixture is the real stdout of the 2026-09-25 M2 controlled Preview (`wrangler preview --name m2-smoke --json`,
// Wrangler 4.137.0) with the author fields redacted; it is the exact output that broke `jq` in the preview job.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { assertHostname, extractPreviewUrl, findJsonObjectSpans } from '../../scripts/extract-wrangler-preview-url.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const script = resolve(here, '../../scripts/extract-wrangler-preview-url.mjs');
const fixture = readFileSync(resolve(here, '../fixtures/wrangler-preview/m2-smoke.stdout.txt'), 'utf8');
// The account's Workers subdomain in the captured output is replaced by `example-subdomain` (configuration, not a
// fixture concern); everything else — progress lines, key names, ids, URL shape — is the real output.
const FIXTURE_URL = 'https://m2-smoke-ccso-portfolio.example-subdomain.workers.dev';
const FIXTURE_HOST = 'm2-smoke-ccso-portfolio.example-subdomain.workers.dev';

/** Runs the CLI exactly as the preview job does: the captured stdout piped in, the URL expected on stdout. */
function runCli(input, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { input, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

test('real Wrangler 4.137 output: progress lines before the JSON', () => {
  assert.equal(extractPreviewUrl(fixture), FIXTURE_URL);
  assert.match(fixture, /^🌀 Building list of assets/, 'fixture still starts with the progress lines');
  assert.equal(fixture.includes('"preview_urls"'), false, 'Wrangler 4.137 uses .preview.urls, not .preview_urls');
});

test('CLI on the real output prints exactly the URL and exits 0', () => {
  const { status, stdout } = runCli(fixture);
  assert.equal(status, 0);
  assert.equal(stdout, `${FIXTURE_URL}\n`);
});

test('clean JSON, nested `.preview.urls[0]`', () => {
  assert.equal(extractPreviewUrl('{"preview":{"urls":["https://a.example.workers.dev"]}}'), 'https://a.example.workers.dev');
});

test('clean JSON, flat `.preview_urls[0]` (the documented Actions example)', () => {
  assert.equal(extractPreviewUrl('{"preview_urls":["https://b.example.workers.dev"],"other":1}\n'), 'https://b.example.workers.dev');
});

test('flat key wins over the nested one when both are present', () => {
  const text = '{"preview_urls":["https://flat.example"],"preview":{"urls":["https://nested.example"]}}';
  assert.equal(extractPreviewUrl(text), 'https://flat.example');
});

test('mixed output: progress lines, a `{`-prefixed progress line, the JSON, then a trailing log line', () => {
  const text = [
    '🌀 Starting asset upload...',
    '{uploading} 3 of 3 assets',
    '✨ Success! Uploaded 3 files (0.4 sec)',
    '',
    '{',
    '  "preview": { "name": "pr-7", "urls": ["https://pr-7-ccso-portfolio.example.workers.dev"] },',
    '  "deployment": { "urls": ["https://abc12345-ccso-portfolio.example.workers.dev"] }',
    '}',
    'Some trailing notice from Wrangler',
    '',
  ].join('\n');
  assert.equal(extractPreviewUrl(text), 'https://pr-7-ccso-portfolio.example.workers.dev');
});

test('two documents: the last one carrying a Preview URL wins', () => {
  const text = '{"preview":{"urls":["https://old.example"]}}\n{"preview":{"urls":["https://new.example"]}}\n';
  assert.equal(extractPreviewUrl(text), 'https://new.example');
});

test('the deployment URL alone is not accepted as the Preview URL', () => {
  const text = '{"deployment":{"urls":["https://abc12345-ccso-portfolio.example.workers.dev"]}}';
  assert.throws(() => extractPreviewUrl(text), /no JSON object with/);
});

test('missing Preview URL → CLI exits 1 with an empty stdout', () => {
  const { status, stdout, stderr } = runCli('✨ Success!\n{"preview":{"name":"pr-9","urls":[]}}\n');
  assert.equal(status, 1);
  assert.equal(stdout, '');
  assert.match(stderr, /no JSON object with/);
});

test('malformed output (truncated JSON) → CLI exits 1 with an empty stdout', () => {
  const truncated = fixture.slice(0, fixture.lastIndexOf('"urls"') + 40);
  const { status, stdout, stderr } = runCli(truncated);
  assert.equal(status, 1);
  assert.equal(stdout, '');
  assert.match(stderr, /no JSON object with/);
});

test('empty output → CLI exits 1', () => {
  const { status, stdout, stderr } = runCli('');
  assert.equal(status, 1);
  assert.equal(stdout, '');
  assert.match(stderr, /empty Wrangler output/);
});

test('non-https or non-string URL values fail closed', () => {
  assert.throws(() => extractPreviewUrl('{"preview":{"urls":["http://insecure.example"]}}'), /not an https URL/);
  assert.throws(() => extractPreviewUrl('{"preview":{"urls":["not a url"]}}'), /not a valid URL/);
  assert.throws(() => extractPreviewUrl('{"preview":{"urls":[42]}}'), /not a string/);
  assert.throws(() => extractPreviewUrl('{"preview_urls":[null]}'), /not a string/);
});

test('braces inside JSON strings do not end a span', () => {
  const text = '{"preview":{"urls":["https://c.example"],"message":"has } and { inside"}}';
  assert.equal(extractPreviewUrl(text), 'https://c.example');
  const spans = findJsonObjectSpans(text);
  assert.equal(spans[0][0], 0);
  assert.equal(spans[0][1], text.length);
});

test('--expect-hostname: the exact Preview hostname is accepted (case-insensitively)', () => {
  assert.equal(runCli(fixture, ['--expect-hostname', FIXTURE_HOST]).status, 0);
  assert.equal(runCli(fixture, [`--expect-hostname=${FIXTURE_HOST}`]).stdout, `${FIXTURE_URL}\n`);
  assert.equal(runCli(fixture, ['--expect-hostname', FIXTURE_HOST.toUpperCase()]).status, 0);
  assert.equal(assertHostname(FIXTURE_URL, FIXTURE_HOST), FIXTURE_URL);
});

test('--expect-hostname: any other hostname fails closed with an empty stdout', () => {
  const cases = [
    'pr-1-ccso-portfolio.example-subdomain.workers.dev', // another Preview of the same Worker
    'm2-smoke-ccso-portfolio.other-account.workers.dev', // another account's subdomain
    'example-subdomain.workers.dev', // a bare suffix is not a match
    'm2-smoke-ccso-portfolio.example-subdomain.workers.dev.attacker.example', // expected host as a prefix
    'x.m2-smoke-ccso-portfolio.example-subdomain.workers.dev', // expected host as a suffix
  ];
  for (const host of cases) {
    const { status, stdout, stderr } = runCli(fixture, ['--expect-hostname', host]);
    assert.equal(status, 1, host);
    assert.equal(stdout, '', host);
    assert.match(stderr, /does not match the expected hostname/, host);
  }
});

test('--expect-hostname: a missing or malformed expectation fails before the URL is emitted', () => {
  for (const args of [['--expect-hostname'], ['--expect-hostname', ''], ['--expect-hostname=pr-1-ccso-portfolio..workers.dev'], ['--expect-hostname', 'has space.workers.dev']]) {
    const { status, stdout, stderr } = runCli(fixture, args);
    assert.equal(status, 1, JSON.stringify(args));
    assert.equal(stdout, '', JSON.stringify(args));
    assert.match(stderr, /expected hostname/, JSON.stringify(args));
  }
  assert.throws(() => assertHostname(FIXTURE_URL, 'pr-1-ccso-portfolio..workers.dev'), /not a valid hostname/);
});

test('unknown options are rejected', () => {
  const { status, stdout, stderr } = runCli(fixture, ['--bogus']);
  assert.equal(status, 1);
  assert.equal(stdout, '');
  assert.match(stderr, /unknown option/);
});

test('file-path argument form reads the same output', () => {
  const result = spawnSync(process.execPath, [script, resolve(here, '../fixtures/wrangler-preview/m2-smoke.stdout.txt')], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${FIXTURE_URL}\n`);
});
