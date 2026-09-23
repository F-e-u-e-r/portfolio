# Public Repository Standard

**Version 1 — 2026-09-24.** Applies to public repositories under [github.com/F-e-u-e-r](https://github.com/F-e-u-e-r). Owner: Eric So (published on GitHub under the alias *Feuer*).

Purpose: one consistent public-facing standard for **description, README top fold, GitHub Topics, release naming and status** across original public repositories — *without* forcing identical internal documentation. The portfolio carries the business/context narrative; GitHub carries the implementation evidence.

Decisions behind this standard (D1–D10) and the review that produced it: [`reviews/2026-09-24-public-repo-metadata-review.md`](reviews/2026-09-24-public-repo-metadata-review.md). Implementation checklist: [portfolio issue #1](https://github.com/F-e-u-e-r/portfolio/issues/1).

---

## 1. Scope and tiers

| Tier | Repositories | What applies |
| --- | --- | --- |
| **A — Original** | `portfolio`, `starledger`, `starledger-template`, `ai-pet-usage`, `skills` (project name: Opus Pack; repository renamed from `opus-pack` on 2026-09-24), `tailscale-ai-egress`, `religion-council`, `ai-arena` | §2–§7 in full; §8 back-link after the portfolio launches |
| **B — Derivative / hardened build** (hygiene only) | `tradingview-mcp` | §2 (description names the upstream), §3 (provenance in the first paragraph), §4, §6, §9. Releases optional. No §8 back-link. Not normalised as an original build. |
| **C — Fork / reference** | `tradingview-mcp-review` (archived), `tradingview-mcp-atila-ref`, `jianying-headless` | Provenance only: archived, or description reads `Reference fork of <upstream> — not maintained`. Nothing else is normalised. |
| **Distribution glue** | `homebrew-tap` | Minimal README, explicit licensing state (§9), topics. No product sections. Releases follow the app. |

`tradingview-mcp` stays Tier B even though its hardening is original work: upstream provenance is its primary identity, and it must be clear from the name, description and README at first sight (decision D6).

## 2. Description

- One sentence: **what it is + what differentiates it** (+ the context it operates in). It is a **repo-card label, not a mini README**.
- Target **≤ 120 characters**; hard ceiling 160 (a Tier B description may use the ceiling to name its upstream).
- No technology lists — the stack belongs in the README.
- Uses the project's *current* name (e.g. "Worldview Council", not "debate council").

| Repo | Target description |
| --- | --- |
| portfolio | Business Transformation & Applied AI portfolio — case studies, capability journey, build evidence and practical writing. |
| starledger | Self-owned GitHub-stars dashboard and fail-closed export pipeline — static, no backend, no key custody. |
| starledger-template | Deploy your own GitHub-stars dashboard on infrastructure you own — no backend, no key custody. |
| ai-pet-usage | 🐾 macOS menu-bar desktop pet that reacts to your AI usage — quota, token burn, cost and work rhythm. Local-first. |
| homebrew-tap | *(keep)* Homebrew tap for AI Pet Usage (macOS menu-bar AI-usage pet) |
| skills (Opus Pack) | Claude Code plugin marketplace for agent discipline, reusable skills, executable gates and evaluation. |
| tailscale-ai-egress | Tailscale App Connector + exit-node toolkit — route only selected AI domains through a VPS egress IP, with failover. |
| tradingview-mcp *(B)* | Review-only MCP bridge for TradingView Desktop — 7 tools over a loopback CDP boundary. Hardened derivative of tradesdontlie/tradingview-mcp. |
| religion-council | Worldview Council — source-grounded multi-agent deliberation with citation verification and fail-closed controls. |
| ai-arena | Side-by-side AI outputs for the same prompt — across model, effort and client, with time/token/cost metrics. |

## 3. README top fold

Standardise the **top fold only**; below it the README varies by project.

```text
# Project Name
**One-line value proposition.**
[status badge] [release badge] [license badge] · Live demo → (if one exists) · English · 繁體中文 (if a translation exists)

What it does — two or three business-readable sentences.

## Highlights          (3–5 bullets)
## Quick start          (or Install / Usage)
---- below this line: whatever the project needs ----
```

Rules:
- The H1 is the repository's own name. A template repository is named as one (`# StarLedger Template`).
- No changelog, phase log or version-by-version narrative above Quick start — that goes to `CHANGELOG.md`.
- Tier B: the first paragraph states the upstream and what was changed.
- The bilingual file, where one exists, is `README.zh-Hant.md`.
- After the portfolio launches, Tier A repos add one line under the badges: `Case study → https://ccso.shsl.world/…` (§8).

## 4. GitHub Topics

A cross-repository **capability taxonomy**, not marketing keywords.

- **4–8 topics** per repository, lowercase and hyphenated, each supportable by the README, the implementation or release evidence.
- Pick from three categories, and every Tier A repo carries at least one topic from the first two — never only implementation tags:
  - **Capability** — `applied-ai`, `evaluation`, `ai-agents`, `automation`, `workflow-automation`, `rag`, `source-grounding`, `citation-verification`, `usage-tracking`, `local-first`, `self-hosted`, `security`, `failover`, `egress`
  - **Artifact / domain** — `portfolio`, `case-studies`, `business-transformation`, `desktop-pet`, `desktop-app`, `github-stars`, `dashboard`, `github-template`, `mcp`, `tradingview`, `app-connector`, `exit-node`, `philosophy`, `llm-comparison`, `agent-skills`, `claude-code-plugin`, `developer-tools`, `homebrew-tap`, `homebrew-cask`
  - **Platform / implementation** — `macos`, `swiftui`, `github-pages`, `static-site`, `typescript`, `react`, `tailscale`, `networking`, `shell`, `nodejs`, `chrome-devtools-protocol`, `astro`, `cloudflare-workers`, `claude-code`, `codex`
- No synonym pairs (`ai-agents`/`multi-agent-systems`, `ai-comparison`/`llm-comparison`, `token-usage`/`usage-tracking`/`cost-tracking`, `anthropic`/`claude`/`claude-code`).
- `applied-ai` is an umbrella only on Tier A repos that are Applied-AI evidence: `ai-arena`, `skills` (Opus Pack), `religion-council`. It is not a personal-brand tag.
- `governance`, `evaluation`, `security`, `privacy` and similar are added only where the repository demonstrates them (§7). Current calls: no `governance` on `skills` (Opus Pack); no `evaluation` on `ai-arena` (a comparison gallery, not a scored benchmark) — use `llm-comparison`; `security` on `tradingview-mcp` is supported by its README "Security boundary" section and CI-enforced tool allowlist.

| Repo | Now | Target (4–8) |
| --- | --- | --- |
| portfolio | 0 | `portfolio` `case-studies` `business-transformation` `astro` `static-site` `cloudflare-workers` |
| starledger | 6 | `github-stars` `dashboard` `self-hosted` `automation` `github-pages` `typescript` `react` |
| starledger-template | 0 | `github-template` `github-stars` `dashboard` `self-hosted` `github-pages` `typescript` |
| ai-pet-usage | 16 | `desktop-pet` `desktop-app` `usage-tracking` `local-first` `macos` `swiftui` `claude-code` `codex` |
| homebrew-tap | 0 | `homebrew-tap` `homebrew-cask` `macos` |
| skills (Opus Pack) | 8 | `applied-ai` `agent-skills` `ai-agents` `evaluation` `claude-code-plugin` `claude-code` `developer-tools` |
| tailscale-ai-egress | 0 | `egress` `failover` `app-connector` `exit-node` `tailscale` `networking` `shell` |
| tradingview-mcp *(B)* | 0 | `mcp` `security` `tradingview` `chrome-devtools-protocol` `nodejs` |
| religion-council | 13 | `applied-ai` `ai-agents` `source-grounding` `citation-verification` `rag` `philosophy` `mcp` `claude-code` |
| ai-arena | 12 | `applied-ai` `llm-comparison` `github-pages` `static-site` |

## 5. Releases

- New releases use `vMAJOR.MINOR.PATCH`; pre-releases use `vMAJOR.MINOR.PATCH-alpha.N` / `-beta.N` / `-rc.N` — for iterations *toward a specific version*.
- **Lifecycle is not a tag prefix.** "Alpha software" is expressed by the status badge (§6) and GitHub's pre-release flag, not by `alpha-` in the tag.
- Every new canonical tag created after adoption of this standard gets a GitHub Release; historical tags are not backfilled unless explicitly listed in the per-repo table below. The README version badge matches the latest release.
- Version numbers are not comparable between repositories; the next number reflects each project's own maturity and change scope. A metadata-only change never justifies a major bump.
- Historical tags and releases are not deleted or rewritten. Historical release titles keep the name the project had at the time; the *next* release carries the current name (decision D4 — `religion-council`'s eight "Religion Council" releases stay as they are).
- **Governed exception:** new releases follow the convention above *unless an existing distribution or runtime contract depends on another format; documented exceptions are preserved until explicitly migrated.*

```text
Exception:  ai-pet-usage
Current:    alpha-vX.Y.Z
Reason:     runtime + distribution contract, not cosmetic —
            .github/workflows/release-app.yml   tag trigger `alpha-v*`, VERSION strip, asset name
            Sources/UsageCore/UpdateModel.swift  parseVersion accepts `alpha-v`/`v` + digits only (a `-alpha.N` suffix → nil → release silently skipped)
            homebrew-tap/Casks/ai-pet-usage.rb   download URL hard-codes `alpha-v#{version}` twice
            homebrew-tap/.github/workflows/bump-cask.yml  `startswith("alpha-v")` filter; no match → exit 0, cask silently frozen
            SECURITY.md, docs/RELEASE_CHECKLIST.md, homebrew-tap/README.md  document the old scheme
Migration:  planned with the beta / notarisation release work — one coordinated change across the app
            (workflow trigger + VERSION derivation + asset name + parseVersion with pre-release precedence + tests + docs)
            and the tap (cask URL/version + bump filter + strip + README), plus a decision on whether
            CFBundleShortVersionString carries the pre-release suffix.
```

- `skills` (Opus Pack): the version of record is `.claude-plugin/plugin.json` (`0.1.16`), cross-checked against `marketplace.json` and the README badge by `.github/checks.py`; git tags were decoupled from it by design (last tag `alpha-0.1.2`). Canonical release: **`v0.1.16` with the pre-release flag** (decision D3 — no `-alpha.1`, which would mint a second version). From then on every `plugin.json` bump gets a matching `vX.Y.Z` tag and Release; the README badge becomes `v0.1.16`, with `checks.py` updated in the same PR.

| Repo | Tags today | Next canonical release |
| --- | --- | --- |
| portfolio | none | `v1.0.0` at launch |
| starledger | `v1.3.0-alpha.1` … (conforming) | Release for `v1.3.0-alpha.1`; correct the erroneous `v1.2.0-alpha.1` title (it says "template") |
| starledger-template | `v1.2.0-alpha.1`, `v1.1.0-alpha.5` | Release for `v1.2.0-alpha.1` |
| ai-pet-usage | `alpha-v0.2.0` … | exception — stays `alpha-v*` until the governed migration |
| homebrew-tap | none | none — follows the app |
| skills (Opus Pack) | `alpha-0.1.2` (decoupled) | `v0.1.16` (pre-release) |
| tailscale-ai-egress | `v1.4.0` … (conforming) | none needed |
| tradingview-mcp *(B)* | none | optional `v0.1.0` after the README identity fix |
| religion-council | `v0.13.1` … (conforming; stray `v0.1` stays) | next `v0.14.0`, titled "Worldview Council …" |
| ai-arena | none | `v0.1.0` after LICENSE + CONTRIBUTING |

## 6. Status

Five lifecycle states, shown as a badge in the top fold and mirrored from the portfolio's content entry so the two never drift:

| Status | Meaning |
| --- | --- |
| **LIVE** | publicly usable / deployed |
| **ACTIVE** | functional and under active development |
| **PROTOTYPE** | exploratory build; interface or behaviour may materially change |
| **BUILDING** | not yet at a usable public baseline |
| **ARCHIVED** | no active development |

Badge: `![status](https://img.shields.io/badge/status-ACTIVE-7aa2ff)` (LIVE `2ee6a6` · ACTIVE `7aa2ff` · PROTOTYPE `f0a742` · BUILDING `9aa3ac` · ARCHIVED `6b6f73`).

| Repo | Status |
| --- | --- |
| portfolio | BUILDING → LIVE at launch |
| starledger · starledger-template · ai-pet-usage · skills (Opus Pack) · religion-council | ACTIVE |
| tailscale-ai-egress · ai-arena | LIVE |
| tradingview-mcp *(B)* | PROTOTYPE |
| homebrew-tap | none |

The portfolio's content schema (frozen scope §38) still carries `IN_DEVELOPMENT`; for repository badges it maps to BUILDING until §38 is revisited.

## 7. Integrity

**Do not create capability claims during metadata cleanup.** Standardisation makes existing evidence easier to understand; it never introduces governance, production-readiness, enterprise-architecture, agent, evaluation, security or privacy claims the repository does not demonstrate. This applies to descriptions, README wording, Topics and release notes — and equally to what the **portfolio** says about a repository: every build-stream milestone shown as "capability evolution" carries at least one evidence pointer (date / release / PR / commit / README anchor), and its chronology is checked against git history before publication.

## 8. Portfolio back-links (after launch)

Tier A repositories add one line under the badges — `Case study → https://ccso.shsl.world/case-studies/<slug>/` (or the Lab entry). Not on Tier B/C, where it could blur provenance.

## 9. Licensing state

Every public repository has an explicit, deliberate licensing state — which is not necessarily an open-source license:

- Repositories intended for reuse carry a GitHub-detectable SPDX `LICENSE` (pristine license text; additional or trademark notices live in `NOTICE.md`).
- Tier B preserves and clearly exposes the upstream's licensing and provenance.
- Repositories intentionally not licensed for reuse may remain under default copyright, with that state made clear where appropriate (README or description).
- `portfolio` code/content licensing is decided separately, in the licensing implementation step.
- A repository that invites contributions (`ai-arena`) states its contribution policy in `CONTRIBUTING.md`: the contributor has the right to submit the content (prompts, model outputs, screenshots, evaluation artifacts) and grants the repository the right to display and redistribute it. A code license does not cover that by itself (decision D8).

## 10. Changes to this standard

- **2026-09-24 — v1.** Established from the consolidated portfolio review (§11–§18) and decisions D1–D10; supersedes the "ai-pet-usage README as gold standard" approach of the original issue #1.
- **2026-09-24 — repository rename.** `opus-pack` was renamed to `skills` by the owner; the project name remains Opus Pack. Current references here use `skills`; the review record keeps the name that was current at audit time.
