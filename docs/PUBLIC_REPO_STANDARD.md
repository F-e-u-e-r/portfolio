# Public Repository Standard

**Version 1 — 2026-09-24.** Applies to public repositories under [github.com/F-e-u-e-r](https://github.com/F-e-u-e-r). Owner: Eric So (published on GitHub under the alias *Feuer*).

Purpose: one consistent public-facing standard for **description, README top fold, GitHub Topics, release naming and status** across original public repositories — *without* forcing identical internal documentation. The portfolio carries the business/context narrative; GitHub carries the implementation evidence.

Decisions behind this standard (D1–D10) and the review that produced it: [`reviews/2026-09-24-public-repo-metadata-review.md`](reviews/2026-09-24-public-repo-metadata-review.md). Implementation checklist: [portfolio issue #1](https://github.com/F-e-u-e-r/portfolio/issues/1).

---

## 1. Scope and tiers

| Tier | Repositories | What applies |
| --- | --- | --- |
| **A — Original** | `portfolio`, `starledger`, `starledger-template`, `ai-pet-usage`, `skills` (project name: Opus Pack; repository renamed from `opus-pack` on 2026-09-24), `tailscale-ai-egress`, `religion-council`, `ai-arena` | §2–§7 in full; §8 back-link after the portfolio launches |
| **B — Fork / reference** | `tradingview-mcp-review` (archived), `tradingview-mcp-atila-ref`, `jianying-headless` | Provenance only: archived, or description reads `Reference fork of <upstream> — not maintained`. Nothing else is normalised. |
| **Distribution glue** | `homebrew-tap` | Minimal README, explicit licensing state (§9), topics. No product sections. Releases follow the app. |

Derivative or hardened builds of upstream projects are not normalised as original evidence. The one such repository at the time of writing, `tradingview-mcp`, was made private and removed from scope on 2026-09-24 (decision D6; see the post-review note in the review record) — the portfolio is a curated evidence layer, not an inventory of every project built.

## 2. Description

- One sentence: **what it is + what differentiates it** (+ the context it operates in). It is a **repo-card label, not a mini README**.
- Target **≤ 120 characters**; hard ceiling 160.
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
- The bilingual file, where one exists, is `README.zh-Hant.md`. The filename encodes the script; the link text may name the variety actually used (繁體中文（香港） on `tailscale-ai-egress`) — D16.
- After the portfolio launches, Tier A repos add one line under the badges: `Case study → https://ccso.shsl.world/…` (§8).

## 4. GitHub Topics

A cross-repository **capability taxonomy**, not marketing keywords.

- **Tier A: 4–8 topics** per repository. **Distribution glue: the minimum useful set** — 2–4 is acceptable (`homebrew-tap` stays at `homebrew-tap`, `homebrew-cask`, `macos`; a fourth topic is not invented to meet a quota). Lowercase and hyphenated, each supportable by the README, the implementation or release evidence.
- Pick from three categories, and every Tier A repo carries at least one topic from the first two — never only implementation tags:
  - **Capability** — `applied-ai`, `evaluation`, `ai-agents`, `automation`, `workflow-automation`, `rag`, `source-grounding`, `citation-verification`, `usage-tracking`, `local-first`, `self-hosted`, `failover`, `egress`
  - **Artifact / domain** — `portfolio`, `case-studies`, `business-transformation`, `desktop-pet`, `desktop-app`, `github-stars`, `dashboard`, `github-template`, `mcp`, `app-connector`, `exit-node`, `philosophy`, `llm-comparison`, `agent-skills`, `claude-code-plugin`, `developer-tools`, `homebrew-tap`, `homebrew-cask`
  - **Platform / implementation** — `macos`, `swiftui`, `github-pages`, `static-site`, `typescript`, `react`, `tailscale`, `networking`, `shell`, `astro`, `cloudflare-workers`, `claude-code`, `codex`
- No synonym pairs (`ai-agents`/`multi-agent-systems`, `ai-comparison`/`llm-comparison`, `token-usage`/`usage-tracking`/`cost-tracking`, `anthropic`/`claude`/`claude-code`).
- `applied-ai` is an umbrella only on Tier A repos that are Applied-AI evidence: `ai-arena`, `skills` (Opus Pack), `religion-council`. It is not a personal-brand tag.
- `governance`, `evaluation`, `security`, `privacy` and similar are added only where the repository demonstrates them (§7). Current calls: no `governance` on `skills` (Opus Pack); no `evaluation` on `ai-arena` (a comparison gallery, not a scored benchmark) — use `llm-comparison`.

| Repo | Now | Target |
| --- | --- | --- |
| portfolio | 0 | `portfolio` `case-studies` `business-transformation` `astro` `static-site` `cloudflare-workers` |
| starledger | 6 | `github-stars` `dashboard` `self-hosted` `automation` `github-pages` `typescript` `react` |
| starledger-template | 0 | `github-template` `github-stars` `dashboard` `self-hosted` `github-pages` `typescript` |
| ai-pet-usage | 16 | `desktop-pet` `desktop-app` `usage-tracking` `local-first` `macos` `swiftui` `claude-code` `codex` |
| homebrew-tap | 0 | `homebrew-tap` `homebrew-cask` `macos` |
| skills (Opus Pack) | 8 | `applied-ai` `agent-skills` `ai-agents` `evaluation` `claude-code-plugin` `claude-code` `developer-tools` |
| tailscale-ai-egress | 0 | `egress` `failover` `app-connector` `exit-node` `tailscale` `networking` `shell` |
| religion-council | 13 | `applied-ai` `ai-agents` `source-grounding` `citation-verification` `rag` `philosophy` `mcp` `claude-code` |
| ai-arena | 12 | `applied-ai` `llm-comparison` `github-pages` `static-site` |

## 5. Releases

- New releases use `vMAJOR.MINOR.PATCH`; pre-releases use `vMAJOR.MINOR.PATCH-alpha.N` / `-beta.N` / `-rc.N` — for iterations *toward a specific version*.
- **Lifecycle is not a tag prefix.** "Alpha software" is expressed by the status badge (§6) and GitHub's pre-release flag, not by `alpha-` in the tag.
- Every new canonical tag created after adoption of this standard gets a GitHub Release; historical tags are not backfilled unless explicitly listed in the per-repo table below. The README version badge matches the latest release and is a **static, exact-version badge linked to that Release** — not a dynamic latest-release badge: shields' default renders "no releases" while a repository's only releases are pre-releases, and version representation is part of the release contract (D13). A "badge matches the latest Release" check is later release-process automation.
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

- `skills` (Opus Pack): the version of record is `.claude-plugin/plugin.json`, cross-checked against `marketplace.json` and the README badge by `.github/checks.py`; legacy git tags (`alpha-0.1.x`) were decoupled from it and stop at `alpha-0.1.2`. Convention: every `plugin.json` bump gets a matching `vX.Y.Z` tag and GitHub Release, pre-release while the pack is alpha; the README badge reads `vX.Y.Z` and `checks.py` validates that form. The first canonical tag under this convention is `v0.1.16` (decision D3 — not `v0.1.16-alpha.1`, which would mint a second version).

Per-repository conventions (policy only — *release state*, i.e. what has been cut and what is owed, is tracked in [issue #1](https://github.com/F-e-u-e-r/portfolio/issues/1) and `ROADMAP.md`, not here):

| Repo | Tag scheme | Convention |
| --- | --- | --- |
| portfolio | none yet | first tag `v1.0.0` at launch |
| starledger | `vX.Y.Z-alpha.N` / `-rc.N` (conforming) | every new tag gets a Release, pre-release while alpha; historical titles are clarified, never rewritten |
| starledger-template | `vX.Y.Z-alpha.N` (conforming) | same; follows the parent's version line |
| ai-pet-usage | `alpha-vX.Y.Z` | governed exception (above) until the coordinated migration |
| homebrew-tap | none | no tags — follows the app |
| skills (Opus Pack) | `vX.Y.Z` from `v0.1.16` (legacy `alpha-0.1.x` before) | one tag + Release per `plugin.json` bump; pre-release while alpha |
| tailscale-ai-egress | `vX.Y.Z` (conforming) | as is |
| religion-council | `vX.Y.Z` (conforming; the stray `v0.1` stays) | no release solely for metadata; the next genuine release is titled "Worldview Council …" |
| ai-arena | none yet | first tag `v0.1.0` after LICENSE + CONTRIBUTING (§9), published as a normal release — `0.x` already states early maturity (D11) |

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
| homebrew-tap | none |

The portfolio's content schema (frozen scope §38) still carries `IN_DEVELOPMENT`; for repository badges it maps to BUILDING until §38 is revisited.

## 7. Integrity

**Do not create capability claims during metadata cleanup.** Standardisation makes existing evidence easier to understand; it never introduces governance, production-readiness, enterprise-architecture, agent, evaluation, security or privacy claims the repository does not demonstrate. This applies to descriptions, README wording, Topics and release notes — and equally to what the **portfolio** says about a repository: every build-stream milestone shown as "capability evolution" carries at least one evidence pointer (date / release / PR / commit / README anchor), and its chronology is checked against git history before publication.

## 8. Portfolio back-links (after launch)

Tier A repositories add one line under the badges — `Case study → https://ccso.shsl.world/case-studies/<slug>/` (or the Lab entry). Not on Tier B (forks), where it could blur provenance.

## 9. Licensing state

Every public repository has an explicit, deliberate licensing state — which is not necessarily an open-source license:

- Repositories intended for reuse carry a GitHub-detectable SPDX `LICENSE` (pristine license text; additional or trademark notices live in `NOTICE.md`).
- Repositories intentionally not licensed for reuse may remain under default copyright, with that state made clear where appropriate (README or description).
- `portfolio` code/content licensing is decided separately, in the licensing implementation step.
- A repository that invites contributions (`ai-arena`) states its contribution policy in `CONTRIBUTING.md`: the contributor has the right to submit the content (prompts, model outputs, screenshots, evaluation artifacts) and grants the repository the right to display and redistribute it. A code license does not cover that by itself (decision D8).

Per-repository licensing state (decided 2026-09-24 — D8, D11, D14, D15; implementation state in issue #1):

| Repo | Licensing state |
| --- | --- |
| portfolio | Code MIT (pristine `LICENSE`); original written content, case studies, articles, images, graphics, logos and brand assets © Eric So, All Rights Reserved unless otherwise stated — scope in `NOTICE.md`, summarised in the README; `package.json` `"license": "MIT"` describes the package |
| starledger · starledger-template | Apache-2.0 (as is) |
| ai-pet-usage | AGPL-3.0-only (as is) |
| homebrew-tap | BSD-2-Clause for the tap; the README states that the tap licence ≠ the app licence (AI Pet Usage: AGPL-3.0) |
| skills (Opus Pack) · tailscale-ai-egress | MIT (as is) |
| religion-council | Code MIT + curated content CC BY 4.0 (`LICENSE-CONTENT`) (as is) |
| ai-arena | Code MIT + contribution/content policy in `CONTRIBUTING.md`: rights to submit; non-exclusive, worldwide, royalty-free licence to host, reproduce, format, display and redistribute as part of AI Arena and its repository; third-party and model-provider terms continue to apply; no confidential information or personal data; removal considered for the maintained site and current branch only |
| Tier B forks | Upstream licensing; not normalised |

## 10. Changes to this standard

- **2026-09-24 — v1.** Established from the consolidated portfolio review (§11–§18) and decisions D1–D10; supersedes the "ai-pet-usage README as gold standard" approach of the original issue #1.
- **2026-09-24 — repository rename.** `opus-pack` was renamed to `skills` by the owner; the project name remains Opus Pack. Current references here use `skills`; the review record keeps the name that was current at audit time.
- **2026-09-24 — scope change.** `tradingview-mcp` was made private and removed from the portfolio and this standard; the derivative tier was removed as empty, and forks are now Tier B.
- **2026-09-24 — Step 5 decisions (D11–D17).** §3 bilingual label note; §5 static exact-version badges and ai-arena's `v0.1.0` as a normal release; §9 per-repository licensing state table. Record: the review record's "Post-review implementation decisions" addendum.
