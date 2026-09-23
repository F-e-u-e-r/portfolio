# Cross-model review — Phase 1 (foundation + homepage shell)

**Date:** 2026-09-23
**Base:** `386efbd` (Phase 1) · **Fixes:** `2dabf01` on `review/phase1-cross-model`
**Reviewers:** `gpt-5.6-sol` and `gpt-5.6-luna` (`model_reasoning_effort=max`), via `codex exec`.

> Family note (cross-model-review §5): both reviewers differ from the author family — this
> build was authored by Claude Opus 4.8 (Anthropic) — so this is a genuine cross-family gate
> on the author. But sol and luna are two variants of one provider family (OpenAI GPT-5.6),
> not two independent families. Recorded honestly rather than claimed as a dual-family pair.

Each finding was **reproduced independently before fixing**; fixes were authored here, not
pasted from the reviewers (cross-model-review §3).

## Round 1 — findings & dispositions

Neither model reported a high-severity defect. 11 unique findings (4 raised by **both** models):

| # | Sev | Finding | Raised by | Disposition |
|---|-----|---------|-----------|-------------|
| 1 | Med | `--c-fg-subtle #64726c` below WCAG AA (3.92 / 3.57 / 3.31 on bg / card / card2) | both | **Fixed** → `#828f88` (5.87 / 5.35 / 4.96) |
| 2 | Med | Desktop header nav wraps into two rows at ~901–999px | sol | **Fixed** → disclosure-menu breakpoint 900 → 1024px |
| 3 | Med | `tsconfig baseUrl` deprecated → `tsc` errors TS5101 | sol | **Fixed** → removed unused `baseUrl` + `paths` |
| 4 | Low | No `aria-current`; mobile menu links lack active state | both | **Fixed** → `aria-current` + mobile `is-active` |
| 5 | Low | Listing pages skip a heading level (h1 → h3) | sol | **Fixed** → `CaseCard` `headingLevel` prop; Lab `h2` |
| 6 | Low | Build-stream milestones not exposed to screen readers | luna | **Fixed** → `sr-only` milestone text per row |
| 7 | Low | Boot overlay still fades (420ms) on repeat visits | luna | **Fixed** → instant removal when already seen |
| 8 | Low | `summary_large_image` declared but no `og:image` | both | **Fixed** → `public/og.png` (1200×630) + og/twitter image tags |
| 9 | Low | All 9 section pages share one meta description | sol | **Fixed** → per-page descriptions |
| 10 | Low | `prefetch` config inert (no link opts in) | both | **Fixed** → `prefetchAll: true` (hover) |
| 11 | Low | Maintenance page has no `h1` | luna | **Fixed** → `DEGRADED` is now the `h1` |

**Rejected / not a site defect:** both reviewers' local `astro check` / `tsc --noEmit` failed
only because the review sandbox was read-only (could not write `.astro/`). Not a defect —
`astro build` and `astro check` pass cleanly in the normal environment (0 errors).

## Verification (author, by execution)

- `astro build` → 15 pages ✓ · `astro check` → 0 errors, 0 warnings ✓
- WCAG contrast recomputed for the new token across all three surfaces (all ≥ 4.5:1) ✓
- Header re-rendered at 960px in a browser: the disclosure menu replaces the nav — no wrap ✓
- OG card rendered and confirmed at 1200×630 ✓

## Round 2 — re-review of the fix diff

**Attempted with `gpt-5.6-luna`; quota-blocked before a verdict.** The account hit its
OpenAI/Codex usage limit mid-run (resets 2026-09-24 01:00), so no PROCEED/FIX verdict was
returned. Its transcript up to the cutoff confirmed the fixes were present in the diff and was
validating implementation details (Astro dynamic heading tag, contrast ratios, prefetch
behaviour) with nothing reported — but an incomplete run yields **no verdict**, and none is
inferred here (cross-model-review §5/§6). Retrying with `gpt-5.6-sol` would hit the same
account-level limit.

**Disposition:** round-2 cross-model confirmation is an **open gap**. The round-1 fixes stand
on the author's execution-based verification above (build, check, contrast recomputation, 960px
header render). A full round-2 re-review can be re-run after the quota resets.
