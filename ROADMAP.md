# Roadmap & Changelog

Progress log for the Eric So portfolio (`ccso.shsl.world`). Timestamps in **UTC+8 (Asia/Hong_Kong)**, newest first.

Scope is frozen at **v1.0** — rationale in [`docs/DECISIONS.md`](docs/DECISIONS.md). The v1.0 scope defines Phases 1–7; this file tracks what has actually shipped.

---

## What we've done

### 2026-09-23

- **23:45 — Grok 4.6 round-2 fixes committed** (`e4de03a`) — header-wrap regression fixed (desktop header trimmed to the 5 primary sections; Soon routes in footer + mobile menu), evidence honesty (only reachable evidence shown; a placeholder note when none), footer Soon badges, boot a11y (page inert while the overlay is up), hero alias footnote dropped.
- **~23:30 — Grok 4.6 round 2** (`xcheck --grok`) — validated round 1 and caught a regression (the longer brand re-opened the nav wrap) plus incomplete round-1 fixes.
- **23:15 — Grok 4.6 round-1 fixes committed** (`8eee0d9`) — Topics marked Soon, boot FOUC fixed (localStorage skip before paint), Lab-teaser WCAG + StatusBadge, evidence de-duplication, brand positioning, mobile build-stream dots + pet/footer clearance.
- **~22:50 — Grok 4.6 round 1** (`xcheck --grok`) — product / IA / content / design review; 7 findings (no high-severity).
- **21:15 — Roadmap published.** This file added and merged to `main`.
- **20:43 — PR #2 opened** — [Phase 1 cross-model review fixes](https://github.com/F-e-u-e-r/portfolio/pull/2) (`review/phase1-cross-model` → `main`, **open**).
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

**Cross-model review fixes** → [PR #2](https://github.com/F-e-u-e-r/portfolio/pull/2) (open)
- 20 files, +94 / −31.

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

- Merge PR #2 (review fixes) after review.
- Work Issue #1 repo-by-repo (P0 first: `tradingview-mcp`).
- Re-run xcheck round 2 after the quota resets.
- MVP content pass (Phase 2): real RAG + Sales-to-Ops case content, journey milestones, About, LinkedIn + resume, web fonts.
- Deploy to Cloudflare (`wrangler login` → `wrangler deploy`) and wire `ccso.shsl.world`.
