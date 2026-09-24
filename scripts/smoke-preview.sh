#!/usr/bin/env bash
# smoke-preview.sh — contract checks against a deployed copy of dist/ (a Worker Preview, or any deployed host).
#
# Usage:  bash scripts/smoke-preview.sh https://pr-12-ccso-portfolio.<subdomain>.workers.dev
#         PUBLIC_SITE_INDEXABLE=true bash scripts/smoke-preview.sh <base-url>   # launch-mode build (M3)
#         bash scripts/smoke-preview.sh http://127.0.0.1:8787                    # local wrangler dev (loopback only)
# Exit 0 = every check passed; exit 1 = the failed checks are listed. Nothing is mutated.
#
# Cloudflare Access service token (for Previews behind Access "Previews only"):
#   CF_ACCESS_CLIENT_ID + CF_ACCESS_CLIENT_SECRET both set → every request carries CF-Access-Client-Id / -Secret;
#   neither set                                            → plain requests (a public host, or local dev);
#   exactly one set                                        → refuse to run, before any network request.
# The credentials only ever go to the base URL given on the command line; the caller pins that hostname first
# (ci.yml: the parser's --expect-hostname), so the token cannot be sent to an unexpected host.
#
# bash + curl, not Node: the custom-404 check must send `Sec-Fetch-Mode: navigate`, a forbidden request header
# that Node's fetch (undici) silently drops — verified 2026-09-25 against a live deployment URL; curl sends it.
#
# Observed edge semantics (M2 controlled Preview, 2026-09-25; compatibility flag assets_navigation_prefers_asset_serving):
# with `not_found_handling = "404-page"` the edge serves dist/404.html only to navigation requests
# (`Sec-Fetch-Mode: navigate` — a browser address-bar load) and a plain-text body to every other client;
# both are HTTP 404. `wrangler dev` serves 404.html to every request, so this difference never shows locally.
# Contract encoded below: 404 status for any unknown route; the ROUTE_NOT_FOUND page for navigation requests.
set -euo pipefail

BASE="${1:?usage: smoke-preview.sh <base-url>}"
BASE="${BASE%/}"
case "$BASE" in
  https://*) ;;
  http://127.0.0.1|http://127.0.0.1:*|http://localhost|http://localhost:*)
    echo "smoke-preview: loopback http — local semantics (wrangler dev serves 404.html to every client), not the edge" ;;
  *) echo "smoke-preview: base URL must be https:// (or loopback http for local dev); got: $BASE" >&2; exit 1 ;;
esac

# Cloudflare Access: both-or-neither, decided before the first request leaves this script.
ACCESS_ID="${CF_ACCESS_CLIENT_ID:-}"
ACCESS_SECRET="${CF_ACCESS_CLIENT_SECRET:-}"
ACCESS_HEADERS=()
if [ -n "$ACCESS_ID" ] && [ -n "$ACCESS_SECRET" ]; then
  ACCESS_HEADERS=(-H "CF-Access-Client-Id: $ACCESS_ID" -H "CF-Access-Client-Secret: $ACCESS_SECRET")
  echo "smoke-preview: Cloudflare Access service token present — every request carries CF-Access-Client-Id / -Secret"
elif [ -n "$ACCESS_ID" ] || [ -n "$ACCESS_SECRET" ]; then
  echo "smoke-preview: CF_ACCESS_CLIENT_ID and CF_ACCESS_CLIENT_SECRET must be set together (exactly one is set) — refusing to run" >&2
  exit 1
fi

# The robots meta on live routes follows the build mode — the same rule as scripts/verify-dist.mjs
# (src/data/routes.mjs: ROBOTS.live when PUBLIC_SITE_INDEXABLE is exactly "true", ROBOTS.prelaunch otherwise).
if [ "${PUBLIC_SITE_INDEXABLE:-false}" = "true" ]; then
  EXPECTED_ROBOTS='index, follow'
else
  EXPECTED_ROBOTS='noindex, nofollow'
fi

failures=0
check() { # label expected actual
  if [ "$2" = "$3" ]; then
    printf 'ok    %s → %s\n' "$1" "$3"
  else
    printf 'FAIL  %s → expected [%s], got [%s]\n' "$1" "$2" "$3"
    failures=$((failures + 1))
  fi
}
# Every request goes through req(): the Access headers (when configured) are attached here and nowhere else.
# The `${arr[@]+...}` form keeps an empty array safe under `set -u` on bash 3.2 (macOS) as well as bash 5.
req() { curl -sS ${ACCESS_HEADERS[@]+"${ACCESS_HEADERS[@]}"} "$@"; }
# curl prints `000` as the status when the connection itself fails (its reason goes to stderr, into the job log).
status() { req -o /dev/null -w '%{http_code}' "$@" || true; }
fetch() { req "$@" || true; }
attr() { # html attribute-value extraction: attr <html> <regex-with-one-capture>
  printf '%s' "$1" | grep -o "$2" | head -1 | sed -E 's/.*="([^"]*)"$/\1/'
}

unknown="$BASE/this-route-does-not-exist/"

check "GET / status" 200 "$(status "$BASE/")"
check "GET unknown route status (bare client)" 404 "$(status "$unknown")"
check "GET unknown route status (navigation)" 404 "$(status -H 'Sec-Fetch-Mode: navigate' "$unknown")"
nav_body="$(fetch -H 'Sec-Fetch-Mode: navigate' "$unknown")"
check "custom 404 page on navigation (ROUTE_NOT_FOUND present)" yes "$( [[ "$nav_body" == *ROUTE_NOT_FOUND* ]] && echo yes || echo no )"
check "custom 404 page robots meta" "noindex" "$(attr "$nav_body" '<meta name="robots" content="[^"]*"')"
check "custom 404 page has no canonical" 0 "$(printf '%s' "$nav_body" | grep -c 'rel="canonical"' || true)"
check "GET /robots.txt status" 200 "$(status "$BASE/robots.txt")"
check "GET /sitemap-index.xml status" 200 "$(status "$BASE/sitemap-index.xml")"
check "GET /case-studies redirects to the trailing-slash form" "$BASE/case-studies/" "$(req -o /dev/null -w '%{redirect_url}' "$BASE/case-studies" || true)"

home="$(fetch "$BASE/")"
check "homepage canonical" 'https://ccso.shsl.world/' "$(attr "$home" '<link rel="canonical" href="[^"]*"')"
check "homepage robots meta (PUBLIC_SITE_INDEXABLE=${PUBLIC_SITE_INDEXABLE:-false})" "$EXPECTED_ROBOTS" "$(attr "$home" '<meta name="robots" content="[^"]*"')"

if [ "$failures" -ne 0 ]; then
  echo "smoke-preview: $failures check(s) failed against $BASE" >&2
  exit 1
fi
echo "smoke-preview: all checks passed against $BASE"
