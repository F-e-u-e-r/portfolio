# Roadmap & Changelog

Progress log for the Eric So portfolio (`ccso.shsl.world`). Timestamps in **UTC+8 (Asia/Hong_Kong)**, newest first.

Scope is frozen at **v1.0** — rationale in [`docs/DECISIONS.md`](docs/DECISIONS.md). The v1.0 scope defines Phases 1–7; this file tracks what has actually shipped.

---

## What we've done

### 2026-09-24

- **~05:30 — Step 4 COMPLETE** — (A) starledger #287 merged: the template builder never emits parent-only workflows (`EXCLUDE_WORKFLOWS`) and omits `# template-builder: omit` steps from `ci.yml` (fail-closed transform, 8 new tests; parent CI incl. the template self-test green). (B) starledger-template #3 merged (`7cf81f5`): regenerated from `starledger@44065b5` with `--verify` green, two commits (content sync; `.github` alignment), its CI green for the first time since generation; #1/#2 closed as superseded. (C) ai-pet-usage: `swift-tests` runs on every PR (#104), stable context name (#105), sole required status check (`strict: false`), validated by #106 (blocked while pending, merged without approval once green). Eight Tier-A lifecycle badges read back from `main`: 8/8.
- **~03:55 — Step 4b 7/8; rulesets aligned** — the five solo-maintained repos' rulesets set to PR + required CI, 0 approving reviews (`ai-arena` also `require_last_push_approval` off); every other rule and the bypass list untouched, verified by full ruleset read-back diffs. Badge PRs then merged without bypass: ai-pet-usage #103, skills #248, religion-council #63 (merge), tailscale-ai-egress #35, ai-arena #27 (squash — linear history). starledger-template: the formatting PR #2 exposed that its CI is structurally broken (inherited workflows reference `scripts/smoke-notifier-*.mjs` and `README.template.md`, which the sanitized template does not contain) — both PRs held pending a decision.
- **~03:15 — Step 4a COMPLETE; 4b partial** — descriptions + topics applied on all 9 public repos via `gh repo edit` (sequential; before/after captured; API read-back: descriptions exact, topics set-equal; visibility/homepage/default branch/license untouched). Status-badge PRs opened on all 8 Tier-A repos: merged portfolio #11 (BUILDING) and starledger #286 (ACTIVE); blocked by review rulesets with CI green — ai-pet-usage #103, skills #248, tailscale-ai-egress #35, religion-council #63, ai-arena #27; starledger-template #1 blocked by a pre-existing `prettier --check` failure in two issue-template YAML files (the `CI` workflow has failed on `main` since 2026-06-24).
- **~02:40 — Step 3 COMPLETE** — `skills` badge/`checks.py` PR #247 merged by owner bypass (explicit exception recorded on the PR; required CI checks green on the PR and again on the merge commit `df1248e`); annotated tag `v0.1.16` on the merge commit; GitHub pre-release published with notes covering the evolution since `alpha-0.1.2` without inventing intermediate tags.
- **~02:30 — Step 3 B/C done** — StarLedger `v1.3.0-alpha.1` pre-release cut (Discovery Inbox, P5) and the `v1.2.0-alpha.1` title clarified ("Reusable template (P4) alpha", body unchanged); StarLedger Template `v1.2.0-alpha.1` pre-release cut; `skills` badge/`checks.py` PR #247 opened (CI green; awaiting the ruleset's required review before tag `v0.1.16` + pre-release).
- **~02:10 — `tradingview-mcp` made private** and removed from public-repository / portfolio scope: Lab entry deleted, standard's derivative tier removed as empty (forks are now Tier B), issue #1 items removed; the review record keeps its historical findings with a post-review note.
- **~02:00 — Step 2 COMPLETE** — portfolio PR #6 (`6cee668`: README wording, ROADMAP state, Opus Pack journey chronology with evidence pointers, AI Pet Usage in Lab, `opus-pack` → `skills` rename record, deploy-readiness decisions) and the `tradingview-mcp` README truth-fix PR #28 (`41ff043`) merged.
- **~01:20 — Issue #1 re-based** — body replaced by a six-step implementation checklist that references the standard by section; the original 2026-09-23 body is preserved in the review record's Appendix A.
- **01:09 — PR #5 merged** (`cc9cb86`) — [`docs/PUBLIC_REPO_STANDARD.md`](docs/PUBLIC_REPO_STANDARD.md) v1 (tiers, description, top fold, topics, releases with the `ai-pet-usage` governed exception, five-state status, integrity, licensing state) + [`docs/reviews/2026-09-24-public-repo-metadata-review.md`](docs/reviews/2026-09-24-public-repo-metadata-review.md) + DECISIONS entries.
- **~00:00–00:50 — Public-repo metadata review** — three independent Sonnet 5 read-only gates (metadata audit, integrity critic, release-tooling trace); every material finding reproduced first-hand and GitHub state verified unchanged afterwards. Found: issue #1 had drifted from the consolidated standard; the `ai-pet-usage` tag scheme is a runtime/distribution contract (updater, release workflow, Homebrew cask); the Opus Pack journey row was the review's illustrative example verbatim.

### 2026-09-23

- **23:48 — PR #4 merged** (`096a4e9`) — Grok 4.6 fixes ×2 + ROADMAP/README; PR #2 closed as merged in the same merge (its branch was the base of `review/grok-4.6`).
- **23:45 — Grok 4.6 round-2 fixes committed** (`e4de03a`) — header-wrap regression fixed (desktop header trimmed to the 5 primary sections; Soon routes in footer + mobile menu), evidence honesty (only reachable evidence shown; a placeholder note when none), footer Soon badges, boot a11y (page inert while the overlay is up), hero alias footnote dropped.
- **~23:30 — Grok 4.6 round 2** (`xcheck --grok`) — validated round 1 and caught a regression (the longer brand re-opened the nav wrap) plus incomplete round-1 fixes.
- **23:15 — Grok 4.6 round-1 fixes committed** (`8eee0d9`) — Topics marked Soon, boot FOUC fixed (localStorage skip before paint), Lab-teaser WCAG + StatusBadge, evidence de-duplication, brand positioning, mobile build-stream dots + pet/footer clearance.
- **~22:50 — Grok 4.6 round 1** (`xcheck --grok`) — product / IA / content / design review; 7 findings (no high-severity).
- **21:15 — Roadmap published.** This file added and merged to `main`.
- **20:43 — PR #2 opened** — [Phase 1 cross-model review fixes](https://github.com/F-e-u-e-r/portfolio/pull/2) (`review/phase1-cross-model` → `main`); merged 23:48 together with PR #4.
- **20:42 — Review record committed** (`fbaf940`) — `docs/reviews/2026-09-23-phase1-cross-model.md` (lands with PR #2).
- **20:36 — Review fixes committed** (`a0934c3`) — 11 confirmed xcheck findings fixed; `astro build` (15 pages) + `astro check` (0 errors) green; header re-rendered at 960px; OG image 1200×630 generated.
- **20:00–20:35 — xcheck (cross-model review)** of Phase 1 by `gpt-5.6-sol` + `gpt-5.6-luna` (max effort). Round 1 complete (11 findings, no high-severity); each reproduced before fixing. Round 2 re-review quota-blocked (see xcheck output).
- **19:56 — Issue #1 opened** — [public-repo README / metadata cleanup](https://github.com/F-e-u-e-r/portfolio/issues/1): 9 public repos benchmarked against the `ai-pet-usage` gold standard.
- **19:54 — Phase 1 committed + pushed to `main`** (`386efbd`) — foundation + homepage shell.
- **~19:42 — Phase 1 build first green** — `astro build` 15 pages, `astro check` 0 errors.
- **17:51–19:40 — Phase 1 built** — Astro 7 static scaffold, design system, typed content schema, full IA routing, Matrix boot, Journey + Applied AI Build Stream, case-study template, maintenance/404, Cloudflare config; the public-repo README review ran in parallel (3 subagents).

---

## Output summary

**Phase 1 — foundation + homepage shell** (on `main`, `386efbd`)
- 15 static pages: Home, Case Studies (+4 dynamic cases), Journey, Lab, Internal Builds, Writing, Topics, About, Contact, `/under-maintenance`, 404.
- Typed content schema (§35): `cases` + `lab` collections (status, capabilities, evidence, milestones).
- Design system: dark-first tokens, one Matrix-green accent (§36, 80/15/5), restrained motion (§37).
- Matrix boot (§5), desktop pet (§14), unified status system (§38), Cloudflare Workers Static Assets config (§34).
- Gates: `astro build` → 15 pages · `astro check` → 0 errors, 0 warnings.

**Public-repo README review** → [Issue #1](https://github.com/F-e-u-e-r/portfolio/issues/1)
- 9 non-fork public repos audited vs the `ai-pet-usage` gold standard: per-repo issues + paste-ready descriptions + cross-cutting fixes + a house README template.
- P0: `tradingview-mcp` README identity bug (title + clone URLs point at the wrong repo `tradingview-mcp-review`; opening says 9 tools, ships 7); `opus-pack` version mismatch (README `alpha-0.1.16` vs latest tag `alpha-0.1.2`); `religion-council` 8 release titles still "Religion Council".
- Superseded 2026-09-24: issue #1 re-based onto `docs/PUBLIC_REPO_STANDARD.md`. The `opus-pack` "version mismatch" is a by-design decoupling (version of record is `plugin.json` `0.1.16`) — the fix is a canonical `v0.1.16` release, not a badge edit; the `religion-council` titles stay (historical names).

**Cross-model review fixes** → [PR #2](https://github.com/F-e-u-e-r/portfolio/pull/2) (merged 2026-09-23 23:48 via PR #4)
- 20 files, +94 / −31.

**Public-repo metadata standard** → [PR #5](https://github.com/F-e-u-e-r/portfolio/pull/5) (merged 2026-09-24 01:09)
- `docs/PUBLIC_REPO_STANDARD.md` v1 + review record (findings F1–F11, Opus Pack chronology, decisions D1–D10); issue #1 is the implementation checklist — steps 2–3 complete, steps 4–6 open.

---

## xcheck output (cross-model review of Phase 1)

**Reviewers:** `gpt-5.6-sol` + `gpt-5.6-luna` (`model_reasoning_effort=max`, via `codex exec`).
**Round 1:** complete. No high-severity defects. **11 unique findings** (4 raised by both), each reproduced before fixing:

| # | Sev | Finding | By | Status |
|---|-----|---------|----|--------|
| 1 | Med | `--c-fg-subtle` below WCAG AA (~3.9:1) | both | Fixed → `#828f88` (≥4.5:1 all surfaces) |
| 2 | Med | Desktop header nav wraps into two rows at ~901–999px | sol | Fixed → disclosure-menu breakpoint 900 → 1024px |
| 3 | Med | `tsconfig baseUrl` deprecated → `tsc` TS5101 | sol | Fixed → removed unused `baseUrl` + `paths` |
| 4 | Low | No `aria-current`; mobile links lack active state | both | Fixed |
| 5 | Low | Listing pages skip a heading level (h1 → h3) | sol | Fixed → `CaseCard` `h2` on listings; Lab `h2` |
| 6 | Low | Build-stream milestones not exposed to screen readers | luna | Fixed → `sr-only` milestone text |
| 7 | Low | Boot overlay fades (420ms) on repeat visits | luna | Fixed → instant removal |
| 8 | Low | `summary_large_image` but no `og:image` | both | Fixed → `public/og.png` (1200×630) + tags |
| 9 | Low | All 9 section pages share one meta description | sol | Fixed → per-page descriptions |
| 10 | Low | `prefetch` config inert (no link opts in) | both | Fixed → `prefetchAll: true` |
| 11 | Low | Maintenance page has no `h1` | luna | Fixed |

**Not a defect:** both reviewers' sandboxed `astro check` / `tsc --noEmit` failed only because the review sandbox was read-only (could not write `.astro/`); both gates pass cleanly in the normal environment.

**Round 2 (re-review of the fix diff):** **quota-blocked** — the OpenAI/Codex account hit its usage limit mid-run (resets **2026-09-24 ~01:00 UTC+8**), so no PROCEED/FIX verdict was returned; **none is inferred**. Round-1 fixes stand on execution-based verification (build, check, contrast recomputation, 960px header render). Re-run available after the quota resets.

> Reviewer-family note: `sol` and `luna` are two variants of one provider family (OpenAI GPT-5.6); both differ from the author family (Claude Opus 4.8), so this is a cross-family gate on the author, not two independent families.

### Grok 4.6 (high) — 2 rounds

Grok 4.6 (high) ran twice via `xcheck --grok`, each on two packets (the prior GPT review + PR #2 as context; and the site's structure / content / design). Grok is a live principal (not OS-sandboxed), so it ran review-only on a clean tree — the tree was verified untouched after each round. Grok found deeper product / IA / design issues than the GPT pass.

**Round 1** — 7 findings (no high-severity): nav stubs, boot FOUC (deferred-module flash + per-tab replay), unlinked content graphs, evidence-in-template, positioning, homepage density, Worldview repo name. Applied: Topics Soon, blocking head-script boot skip + localStorage, Lab-teaser StatusBadge, evidence de-dup, brand, mobile dots + pet clearance.

**Round 2** — validated round 1 and **caught a regression**: the longer brand + Soon pills re-opened the header wrap (~1025–1090px, measured). Applied: desktop header trimmed to 5 primary sections (Soon routes → footer + mobile menu; no wrap 861–1101px+); evidence honesty completed on cards + case pages (empty-state note); footer Soon badges; first-visit boot made keyboard/AT-safe (rest of page `inert`); hero alias dropped.

**Deferred with reasons** (not fixed this round): content-graph refactor (buildStream ↔ collections, lab detail pages) vs frozen scope §10/§27; journey roles / About answered fields / more transformation cases (need real career content, MVP pass); 10-section homepage (frozen §4); `religion-council` rename (held issue #1); web fonts + robots/sitemap/JSON-LD (at deploy).

---

## Next

- **Step 2 — COMPLETE.** `portfolio` PR #6 and the TradingView README truth-fix PR merged; `tradingview-mcp` made private and removed from public-repository / portfolio scope.
- **Step 3 — COMPLETE.** A: `skills` `v0.1.16` pre-release (tag on merge commit `df1248e`); B/C: StarLedger `v1.3.0-alpha.1` pre-release + `v1.2.0-alpha.1` title clarified, StarLedger Template `v1.2.0-alpha.1` pre-release; D/E: no action by design (religion-council's next genuine release carries "Worldview Council"; ai-pet-usage stays on its governed exception — migration ticket when that work is scheduled).
- **Step 4 — COMPLETE.** 4a descriptions + topics on all 9 public repos; 4b lifecycle badges on all 8 Tier-A repos (8/8 read back from `main`); solo-maintained rulesets = PR + required CI, 0 approving reviews; `ai-pet-usage` gained its required check; the StarLedger template builder repaired at the source and the template resynchronised.
- **Step 5 — README top folds · licensing state · provenance · bilingual filenames · forks** (next), per `docs/PUBLIC_REPO_STANDARD.md` §3 / §9 and issue #1.
- Then step 5 top folds / licensing state / provenance → step 6 extensions.
- Re-run xcheck round 2 after the quota resets.
- MVP content pass (Phase 2): real RAG + Sales-to-Ops case content, journey milestones, About, LinkedIn + resume, web fonts.
- Deploy to Cloudflare (`wrangler login` → `wrangler deploy`) and wire `ccso.shsl.world` — deploy readiness per `docs/DECISIONS.md`: `robots.txt` + sitemap, `noindex` on maintenance/placeholder pages, AI-crawler policy.
