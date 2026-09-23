# Decisions — Portfolio v1

Concise decision log (newest first). Each entry: decision · rejected alternative · why.

## 2026-09-24 — Public repository standard
- **One metadata standard for the public repos: [`PUBLIC_REPO_STANDARD.md`](PUBLIC_REPO_STANDARD.md)** (tiers, description, top fold, topics, releases, status, integrity). Rejected: the `ai-pet-usage` README as a full gold-standard skeleton (issue #1's original approach). Why: it forced identical documentation, over-length descriptions and 13–16-topic lists, and would have introduced capability claims — see [`reviews/2026-09-24-public-repo-metadata-review.md`](reviews/2026-09-24-public-repo-metadata-review.md) (decisions D1–D10).
- **Release naming has a governed exception, not a blanket rule.** `ai-pet-usage` keeps `alpha-vX.Y.Z` until its updater / release workflow / Homebrew cask are migrated together; `skills` (Opus Pack — repository renamed from `opus-pack` on 2026-09-24) gets canonical release `v0.1.16` (pre-release flag), matching its `plugin.json` version of record.
- **`tradingview-mcp` made private and removed from public scope** (portfolio Lab, the standard, issue #1). Rejected: keeping it public as a derivative tier with a hygiene standard. Why: the portfolio is a curated evidence layer, not an inventory; its capabilities are represented more strongly by Worldview Council, Opus Pack, Tailscale AI Egress, AI Pet Usage and the Employment RAG. The README truth fix (its PR #28) stays in the private repository; the empty derivative tier was removed and forks are Tier B.
- **Repository status badges use five states** (LIVE / ACTIVE / PROTOTYPE / BUILDING / ARCHIVED); the site's §38 enum keeps `IN_DEVELOPMENT` until §38 is revisited (maps to BUILDING for badges).

## 2026-09-24 — Solo-maintained repository rulesets
- **PRs and required CI remain mandatory; an external approving review is not required.** Applied to `ai-pet-usage`, `skills`, `tailscale-ai-egress`, `religion-council`, `ai-arena`: `required_approving_review_count` 1 → 0 (and `require_last_push_approval` true → false on `ai-arena`, which otherwise still demanded an approval). Untouched: PR required, required status checks where configured, block force-push / deletion, linear history where configured, and the bypass list (Repository Admin role, PR-only — currently the owner alone). Rejected: routine owner `--admin` bypass with exception comments (an exception that becomes the normal process). Revisit if a repository gains additional maintainers. `ai-pet-usage` initially had no `required_status_checks` rule; its `swift-tests` job now runs on every pull request and is the sole required check (`strict: false`), validated end to end on a PR that was blocked while the check was pending and merged without approval once green.

## 2026-09-24 — Deploy readiness (decided; implemented at deploy)
- **`robots.txt` + sitemap are deploy requirements** (`@astrojs/sitemap`; `robots.txt` points at `/sitemap-index.xml`). JSON-LD is launch polish; web fonts are visual polish. Rejected: one undifferentiated "at deploy" bundle.
- **`noindex, nofollow` meta on `/under-maintenance` and placeholder pages** (Writing, Topics). Why: `robots.txt` controls crawling, not indexing.
- **AI crawlers — discoverable, not training by default:** allow `OAI-SearchBot` and `Claude-SearchBot`; disallow `GPTBot` and `ClaudeBot`. `Google-Extended` (Gemini grounding *and* training) is an open content-use choice, deliberately not decided yet.
- **No `ai.txt` in v1** — still an Internet-Draft, not a standard. **`llms.txt` only once real content exists** (RAG + Sales-to-Ops + About + first article). Rejected: an AI index that points at placeholders.

## 2026-09-23 — Phase 1 foundation
- **Framework: Astro 7, static output.** Rejected: an SSR adapter. Why: the site is static-first (§34); the RAG live demo (Phase 4) is a separate Cloudflare Worker, not an Astro SSR route.
- **Hosting: Cloudflare Workers Static Assets** (`wrangler.toml` → `dist/`). Deploy deferred — needs `wrangler login` (the user's Cloudflare auth).
- **Content: Astro Content Layer collections** (`cases`, `lab`) with a Zod schema (§35); `site`/`journey` as typed TS modules under `src/data/`. Why: a typed backbone so adding a project never requires a layout rewrite.
- **Design: dark-first tokens, one refined Matrix-green accent** used sparingly (§36, 80/15/5). Motion restrained (§37). Matrix boot self-skips on repeat visits and goes static under `prefers-reduced-motion` (§5).
- **Status enum + capability keys centralised** (§38): `LIVE / ACTIVE / PROTOTYPE / BUILDING / IN_DEVELOPMENT / ARCHIVED`.
- **Package manager: npm.** TS path aliases are declared in `tsconfig.json` but imports are relative in code (robust across the build).
- **TypeScript pinned to ^6** (not 7) — `@astrojs/check` peer requires `^5 || ^6`.

## Open / deferred
- Real content for all cases + about + journey milestones (MVP pass).
- LinkedIn URL + hosted resume (`src/data/site.ts` TODO).
- Google Fonts (Inter / JetBrains Mono) vs. current system stack.
- Cloudflare deploy + custom domain `ccso.shsl.world`; `secc.studio` → redirect.
