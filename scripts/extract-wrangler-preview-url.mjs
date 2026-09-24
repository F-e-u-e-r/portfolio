#!/usr/bin/env node
// extract-wrangler-preview-url.mjs — fail-closed extraction of the Preview URL from `wrangler preview --json`.
//
// Why not `jq` on the raw stdout: Wrangler 4.137 prints the asset-upload progress lines to STDOUT before the
// JSON document (observed on the M2 controlled Preview, 2026-09-25; the real output is kept as
// tests/fixtures/wrangler-preview/m2-smoke.stdout.txt), so `jq` stops at "Invalid numeric literal".
// Why not `sed -n '/^{/,$p'`: any future progress line that starts with `{` breaks it again.
//
// Contract: scan the whole output for JSON objects, take the LAST one that carries a Preview URL —
// `.preview_urls[0]` or `.preview.urls[0]` — require it to be an https URL, print exactly that URL.
// Anything else (no JSON, no URL, a malformed document, a non-https value) exits 1 with nothing on stdout.
// With `--expect-hostname <host>` the URL is emitted only if its hostname is exactly that host (the preview job
// pins `pr-<PR>-<worker>.<CLOUDFLARE_WORKERS_SUBDOMAIN>.workers.dev`, so the Access service token that the
// smoke sends afterwards can never travel to any other host); a missing or malformed expectation also exits 1.
//
// Usage:  node scripts/extract-wrangler-preview-url.mjs [--expect-hostname <host>] < wrangler-stdout
//         node scripts/extract-wrangler-preview-url.mjs [--expect-hostname <host>] path/to/captured-stdout
// Tests:  npm run test:tools  (tests/tools/extract-wrangler-preview-url.test.mjs)

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// One or more dot-separated labels of letters, digits and inner hyphens — a hostname, not a pattern.
const HOSTNAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

/**
 * Every balanced `{ … }` span in `text`, in order of its opening brace. String literals and escapes are
 * honoured so braces inside strings do not end a span. Unbalanced openings yield nothing.
 * @param {string} text
 * @returns {Array<[number, number]>} [start, endExclusive] pairs
 */
export function findJsonObjectSpans(text) {
  const spans = [];
  for (let start = 0; start < text.length; start += 1) {
    if (text[start] !== '{') continue;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i += 1) {
      const ch = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          spans.push([start, i + 1]);
          break;
        }
      }
    }
  }
  return spans;
}

/**
 * `{ url }` when the parsed object carries a Preview URL slot — `.preview_urls[0]` first, else `.preview.urls[0]` —
 * whatever its value (a null or non-string value is then rejected as such, never skipped); undefined when the
 * object is not a `wrangler preview` result at all (no such key, or an empty array).
 */
function previewUrlOf(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return undefined;
  if (Array.isArray(value.preview_urls) && value.preview_urls.length > 0) return { url: value.preview_urls[0] };
  const nested = value.preview;
  if (nested !== null && typeof nested === 'object' && Array.isArray(nested.urls) && nested.urls.length > 0) {
    return { url: nested.urls[0] };
  }
  return undefined;
}

/**
 * @param {string} text  raw `wrangler preview --json` stdout (progress lines allowed before or after the JSON)
 * @returns {string}     the Preview URL, exactly as Wrangler printed it
 * @throws {Error}       when no JSON object carries a Preview URL, or the value is not an https URL
 */
export function extractPreviewUrl(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('empty Wrangler output — no JSON document to read');
  }
  let candidate;
  let candidateStart = -1;
  for (const [start, end] of findJsonObjectSpans(text)) {
    let parsed;
    try {
      parsed = JSON.parse(text.slice(start, end));
    } catch {
      continue; // a `{` inside a progress line, or a truncated document
    }
    const hit = previewUrlOf(parsed);
    if (hit !== undefined && start > candidateStart) {
      candidate = hit.url;
      candidateStart = start;
    }
  }
  if (candidateStart < 0) {
    throw new Error('no JSON object with `.preview_urls[0]` or `.preview.urls[0]` in the Wrangler output');
  }
  if (typeof candidate !== 'string') {
    throw new Error(`Preview URL is not a string (got ${JSON.stringify(candidate)})`);
  }
  let parsedUrl;
  try {
    parsedUrl = new URL(candidate);
  } catch {
    throw new Error(`Preview URL is not a valid URL: ${JSON.stringify(candidate)}`);
  }
  if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname === '') {
    throw new Error(`Preview URL is not an https URL: ${JSON.stringify(candidate)}`);
  }
  return candidate;
}

/**
 * @param {string} url       a URL already accepted by extractPreviewUrl
 * @param {unknown} expected the exact hostname the URL must have (compared case-insensitively, never as a suffix)
 * @returns {string}         the same URL
 * @throws {Error}           when the expectation is missing or malformed, or the hostname differs
 */
export function assertHostname(url, expected) {
  if (typeof expected !== 'string' || expected.trim() === '') {
    throw new Error('expected hostname is empty — is the repository variable CLOUDFLARE_WORKERS_SUBDOMAIN set?');
  }
  const want = expected.trim().toLowerCase();
  if (!HOSTNAME.test(want)) {
    throw new Error(`expected hostname is not a valid hostname: ${JSON.stringify(expected)}`);
  }
  const host = new URL(url).hostname;
  if (host !== want) {
    throw new Error(`Preview URL hostname ${JSON.stringify(host)} does not match the expected hostname ${JSON.stringify(want)}`);
  }
  return url;
}

function parseArgs(argv) {
  /** @type {{ expectHostname?: string, file?: string }} */
  const options = {};
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--expect-hostname') {
      options.expectHostname = args[i + 1] ?? '';
      i += 1;
    } else if (arg.startsWith('--expect-hostname=')) {
      options.expectHostname = arg.slice('--expect-hostname='.length);
    } else if (arg.startsWith('--')) {
      throw new Error(`unknown option ${arg}`);
    } else if (options.file === undefined) {
      options.file = arg;
    } else {
      throw new Error(`unexpected argument ${arg}`);
    }
  }
  return options;
}

function main(argv) {
  const { expectHostname, file } = parseArgs(argv);
  const source = file !== undefined ? readFileSync(file, 'utf8') : readFileSync(0, 'utf8');
  let url = extractPreviewUrl(source);
  if (expectHostname !== undefined) url = assertHostname(url, expectHostname);
  process.stdout.write(`${url}\n`);
}

const invokedDirectly =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  try {
    main(process.argv);
  } catch (error) {
    process.stderr.write(`extract-wrangler-preview-url: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}
