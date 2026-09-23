# Public-repo metadata review — 2026-09-24

Review of the `F-e-u-e-r` public repositories, [issue #1](https://github.com/F-e-u-e-r/portfolio/issues/1) (the 2026-09-23 metadata audit) and the owner's consolidated portfolio review (§1–§20), producing [`docs/PUBLIC_REPO_STANDARD.md`](../PUBLIC_REPO_STANDARD.md) and the re-based issue #1 checklist. Timestamps UTC+8.

> **Post-review note (2026-09-24): `F-e-u-e-r/opus-pack` was renamed to `F-e-u-e-r/skills` after this audit. Historical references below retain the repository name that was current when the review was performed. The project name remains Opus Pack.**

> **Post-review note (2026-09-24): `tradingview-mcp` was subsequently made private and removed from the portfolio and public-repository standard. Historical findings below reflect the repository state at the time of the audit.**

## Method

- **Orchestrator:** Claude Fable 5.1 (Claude Code). Own audit written to file *before* any gate output was read.
- **Three independent read-only gates**, each Claude Sonnet 5 in a fresh context with a different lens and no access to the orchestrator's findings:
  - **Gate A — metadata conformance audit:** 10 original repos × 6 dimensions (§11 description, §12 top fold, §13 topics, §14 releases, §15 status, license) against the consolidated review, plus every issue #1 proposal checked against the same sections. ~158k tokens, 20 tool calls.
  - **Gate B — integrity critic (adversarial):** portfolio claims vs repository evidence (§17), stale statements in README/ROADMAP, contradictions between the status comment and GitHub. ~170k tokens, 62 tool calls.
  - **Gate C — release-tooling dependency trace:** all 10 repos shallow-cloned; workflows, release scripts, in-app updater, Homebrew cask and docs grepped for tag-format dependencies (§14). ~220k tokens, 54 tool calls.
- **Verification:** every material gate finding was reproduced first-hand by the orchestrator from GitHub via `gh api` (raw files, not the gates' clones) or from the local tree. Gate reports are cited only where reproduced.
- **Integrity check after the gates:** local `main` unchanged (`096a4e9`, clean tree); GitHub snapshots of descriptions/topics/licenses, releases and issue #1 byte-identical to the pre-gate baseline (SHA-256). Deviations recorded: Gate A's summary overstated the in-app-updater evidence (its report cited only a README sentence; the code evidence came from Gate C); Gate A scored `opus-pack`'s top fold from a 45-line window that cut off just before `## Install` (README line 59) — downgraded; Gate B wrote five README cache files into the scratchpad root outside its allowed path (harmless; nothing touched the repo). Input isolation of the gates from ambient session memory was instructed, not provable — no independence claim rests on it.

## Findings (merged; all reproduced)

| # | Finding | Evidence | Fix (decision) |
| --- | --- | --- | --- |
| F1 | **Issue #1's standard drifted from the consolidated review §11–§17.** Executing it as written would violate §11 (its 7 proposed descriptions are 226–283 chars vs current 60–189), §13 (topic additions take opus-pack to 13 and ai-arena to 16; `ai-evaluation`+`evaluation` synonym pair), §17 (`ai-governance` on opus-pack — 0 occurrences of "governance" in its 874-line README; `evaluation` on ai-arena — a comparison gallery), §14 (a blanket pre-release unification would break ai-pet-usage tooling; "tag `alpha-0.1.16`" uses the old scheme), §12 (full-README skeleton mandate). Its gold-standard repo `ai-pet-usage` itself has 16 topics and 10 highlight bullets. It also omits `portfolio`. | Gate A + orchestrator | Re-base: standard doc + rewritten issue (D1, D10) |
| F2 | **`portfolio` is PUBLIC** (created 2026-09-23 09:51Z) with empty description, 0 topics, no LICENSE, while `README.md:75` says "Private repository, pre-launch". `.claude/`, `dist/` are ignored and untracked. | `gh repo view`; Gate B I3-1 | Stay public; fix wording, add metadata (D2) |
| F3 | **`ROADMAP.md` stale:** lines 18, 42, 86 show PR #2 open / "Merge PR #2" although PR #2 merged 15:48:50Z (23:48 UTC+8) with PR #4; the PR #4 merge is not logged. | `gh pr list`; Gate B I3-2 | Step 2 |
| F4 | **`src/data/journey.ts:34-46` Opus Pack milestones are the consolidated review §4's illustrative example, verbatim and in order** ("Initial Framework → … → AUTH Boundary → Human Approval → Agent Governance"), rendered in full on `/journey/` under the caption "hand-curated capability evolution". Not one phrase appears in opus-pack's README/ROADMAP/ARCHITECTURE (only "executable gates" once, in the tagline). Nuance: an authorization concept *does* exist in opus-pack (ROADMAP:57 "owner STOP / authorization gates", README:744 "AUTH-quote artifact"), so this is not a fabricated capability — it is a sequence that is not the project's real evolution. `evidenceUrl` is unset on all 22 milestones in the file. Survived the GPT-5.6 and Grok 4.6 ×2 reviews. | Gate B I1-1; orchestrator grep | P0 before public promotion; chronology below (D9) |
| F5 | **ai-pet-usage tag scheme is a runtime/distribution contract (HARD):** `.github/workflows/release-app.yml:12` `tags: ["alpha-v*"]`, `:29` `VERSION="${GITHUB_REF_NAME#alpha-v}"`, asset `AI-Pet-Usage-<tag>-arm64.zip`; `Sources/UsageCore/UpdateModel.swift` `parseVersion` strips `alpha-v`/`v` then requires `^[0-9]+(\.[0-9]+)*$` — a `-alpha.N` suffix returns `nil` and the release is silently skipped (test file asserts `0.2.0-dev.5` → nil); `homebrew-tap/Casks/ai-pet-usage.rb:5` hard-codes `alpha-v#{version}` twice; `homebrew-tap/.github/workflows/bump-cask.yml:23-25` filters `startswith("alpha-v")` and exits 0 when nothing matches; `SECURITY.md:14`, `docs/RELEASE_CHECKLIST.md:35`, `homebrew-tap/README.md:26` document the scheme. No lexical-sort confusion between old and new tags; the failure mode is a silent miss. | Gate C; orchestrator `gh api` reads | Governed exception until beta (D5) |
| F6 | **opus-pack versioning is decoupled by design:** `.claude-plugin/plugin.json` and `marketplace.json` say `0.1.16`, README badge `alpha-0.1.16`, cross-checked by `.github/checks.py` (bare `X.Y.Z` grammar for plugin.json, `alpha-` prefix for the badge); git tags stop at `alpha-0.1.2` (all three tags dated 2026-07-07); 0 Releases. The issue #1 "fix the badge" P0 is therefore the wrong fix. | Gate C §4; orchestrator | Canonical `v0.1.16` pre-release; checks.py updated (D3) |
| F7 | **Release state:** 4 naming variants in use (`alpha-vX.Y.Z`, `alpha-X.Y.Z`, `vX.Y.Z-alpha.N/-rc.N`, `vX.Y.Z`). starledger's newest tag `v1.3.0-alpha.1` has no Release and its only Release (`v1.2.0-alpha.1`) is titled "StarLedger template alpha"; starledger-template has 2 tags, 0 Releases; religion-council's 8 Releases are titled "Religion Council …" (README already says "Formerly Religion Council"); tradingview-mcp, ai-arena, portfolio have no tags. | Gate A/C; orchestrator | §5 table (D4) |
| F8 | **Descriptions / topics / status:** descriptions 0–189 chars (portfolio empty; religion-council's never says "Worldview Council"); topics 16 / 13 / 12 on ai-pet-usage / religion-council / ai-arena with synonym clusters, 0 on five repos; starledger's six are a stack list; **0/10 repos** use a shared lifecycle vocabulary. | Gate A; orchestrator | §2, §4, §6 (D7) |
| F9 | **Top fold:** tradingview-mcp README H1 is `# tradingview-mcp-review`, clone URL and `.mcp.json` path point at the archived fork, intro says "9 MCP tools" vs a 7-tool table — its first five README lines are byte-identical to the archived 9-tool fork's README (copied, self-reference never updated); religion-council's fold is a v0.5.0→v0.9.0 version narrative with no quick start visible; starledger has no value line/badges and leads with a phase table; starledger-template's H1 equals the parent's; ai-arena's 163-line README has no live-gallery link and no status anywhere. | Gate A; orchestrator diff/grep | Step 2 (identity) / Step 5 |
| F10 | **Licensing / forks / bilingual:** ai-arena has no LICENSE but invites fork & PR; homebrew-tap none; tradingview-mcp's `LICENSE` is MIT text plus appended `ADDITIONAL NOTICE` / `TRADEMARK NOTICE` (GitHub reports `other`). Forks: `tradingview-mcp-review` archived (parent `tradesdontlie/tradingview-mcp`); `tradingview-mcp-atila-ref` not archived, description is upstream marketing copy (parent `atilaahmettaner/tradingview-mcp`); `jianying-headless` is a public fork described "Private source preview" (parent `mcncarl/jianying-headless`). Bilingual files: `zh-Hant` / `zh-HK` / `zh-TW`. | Gate A; orchestrator | §9, tiers (D8) |
| F11 | **Portfolio gaps vs the consolidated review:** `ai-pet-usage` absent from Lab (§2 says the non-featured product stays in Lab); §18 source-governance record — `hk-employment-rag.md:22` evidence "Source policy" has no `url` and is filtered out by `[...slug].astro:17`, while the milestone "policy-reviewed sourcing" (`:15`) renders unbacked; the RAG repo `hk-employment-rag-benchmark` is private; no "Launch Writing Hub & Topic-Linked Knowledge Pages" issue exists (§9). `governance` is attached to opus-pack, worldview-council and tailscale entries whose READMEs never use the word (religion-council: "fail-closed" ×19; tailscale: "security" ×5) — defensible under `site.ts:32-35`'s definition if the case text states the mapping. | Gate B I5-1/2/3, I1-2 | Steps 2 and 6 |

Confirmed consistent (no finding): all 8 `github:`/`demo:` URLs in `src/content` resolve 200 to the intended targets; StarLedger, AI Arena and TradingView MCP technical claims match their repos (provenance workflow, `P6-security-review-packet.md`, secret-scan step, 7-tool CI allowlist); the status comment's PR/issue facts match GitHub; the deferred list matches `ROADMAP.md`.

## Opus Pack chronology (for the journey re-curation — D9)

From the full `opus-pack` history (690 commits, 2026-07-07 → 2026-09-18; tags `alpha-0.1.0/1/2` all 2026-07-07):

| Date | Commit | Event |
| --- | --- | --- |
| 2026-07-07 | `58c65db` | First commit: `skills/` (discipline skills) **and** the first executable gates `hooks/gate-before-commit.sh`, `hooks/verify-before-stop.py`; README section "Enforcement: setting up hooks" |
| 2026-07-11 / 07-12 | `eb492ed`, `cca298e` | `## Evals` section; "null result" published; `hooks/gate-credential-destruction.py` added (07-11) |
| 2026-07-16 | `a523e98` | `.claude-plugin/marketplace.json` — becomes a plugin marketplace |
| 2026-07-19 | `433e93f` | `design-pack/` — second plugin |
| 2026-07-25 | `1b31796` | `hooks/skill-vetting-advisory.py` — fourth hook |
| 2026-09-18 | `6c04619` | "Evaluation results" section; ROADMAP "Now — Instrument Hardening v1" (current) |

The proposed "Discipline Skills → Design Pack → Executable Gates & Hooks → Evaluation / Null Results → Instrument Hardening v1" is *not* chronological: the gates shipped on day one with the skills, and the evals predate the marketplace and design-pack. A chronologically honest 5-milestone row: **Discipline skills + first gates (07-07) → Evals with null results (07-11) → Plugin marketplace (07-16) → design-pack (07-19) → Instrument Hardening v1 (09-18, current ○)**, each with `evidenceUrl` pointing at the commit or README anchor above.

## Decisions (owner, 2026-09-24)

| # | Decision |
| --- | --- |
| D1 | Rewrite issue #1 against `docs/PUBLIC_REPO_STANDARD.md`; `ai-pet-usage` is no longer a full-README gold standard. |
| D2 | `portfolio` stays public (it is the public evidence layer and the metadata-governance hub); fix the README wording, add description/topics, decide license. |
| D3 | opus-pack canonical release `v0.1.16` with the pre-release flag — not `v0.1.16-alpha.1` (a second semantic version). README badge → `v0.1.16`, `checks.py` updated in the same PR. |
| D4 | Historical "Religion Council" release titles stay; the next release uses "Worldview Council"; the README continuity note suffices. |
| D5 | ai-pet-usage keeps `alpha-v*` as a governed exception until the beta / updater migration. |
| D6 | tradingview-mcp remains a derivative (Tier B, hygiene standard); not reclassified as original. |
| D7 | Topics per §4 with three categories; no `governance` on opus-pack; no `evaluation` on ai-arena (prefer `llm-comparison`); `security` on tradingview-mcp; `applied-ai` only on original Applied-AI evidence repos. |
| D8 | ai-arena: MIT for code + a CONTRIBUTING contribution/content policy; first release `v0.1.0`. |
| D9 | Replace the Opus Pack journey row with an evidence-backed sequence after a chronology check (above); current work marked as current state; every milestone carries an evidence pointer. |
| D10 | The standard lives at `docs/PUBLIC_REPO_STANDARD.md` in the portfolio repo. |

Modifications the owner made to the draft standard, adopted: descriptions are repo-card labels (≤ ~120 chars, stack out); topics split into capability / artifact / platform categories; five statuses (IN DEVELOPMENT dropped for repos); the ai-pet-usage exception written as a governed exception with reason and migration plan; code license ≠ contribution-content policy. At step-1 review: the GitHub-Release rule made prospective (historical tags are not backfilled unless listed in the per-repo table), and §9 changed from a LICENSE mandate into an explicit licensing-state requirement (reuse → SPDX license; Tier B exposes upstream licensing; intentionally unlicensed repos may stay under default copyright, stated; portfolio licensing decided in the licensing step).

## Execution order (agreed)

1. Canonical standard + issue #1 rewrite *(this record)*.
2. Integrity / factual errors: portfolio README wording, tradingview-mcp identity & 9→7, journey milestones, ROADMAP.
3. Release semantics: opus-pack canonical release; ai-pet-usage exception recorded; StarLedger releases.
4. Metadata batch: descriptions, topics, status badges.
5. README top folds, LICENSE / CONTRIBUTING, provenance, bilingual filenames.
6. RAG source-policy record, Writing backlog issue, portfolio back-links after launch.

Truth first, consistency second: bulk `gh repo edit` metadata work does not precede the P0 corrections.

## Appendix A — issue #1 body as of 2026-09-23 (superseded)

Preserved verbatim below because the issue body is replaced by the step-1 checklist.

Audit of all **9 non-fork public repos** against the [`ai-pet-usage`](https://github.com/F-e-u-e-r/ai-pet-usage) README as the house **gold standard**. Grouped by priority; checkboxes to track.

**Gold-standard skeleton:** centered badge header → ASCII hero → honest status line → `## ✨ Highlights` (bold lead-ins) → Install/Usage (runnable + honest caveats) → `<details>` for depth → `## 🗂️ Repository layout` table → `## 🛡️ Security/Privacy` ✅/🚫 → `## 📚 Documentation` table → `## ⚖️ License`. Typed `> [!IMPORTANT]` alerts; bilingual `README.zh-Hant.md`; scrupulous honesty about status.

---

### 0 · Cross-cutting (do once, cheapest wins)

- [ ] **Tags without Releases** → promote latest tag to a GitHub Release + notes: `opus-pack`, `starledger-template`, `starledger` (newest tags uncut).
- [ ] **Unify pre-release scheme** to semver `vX.Y.Z-alpha.N` (today: `alpha-vX.Y.Z` / `vX.Y.Z-alpha.N` / `alpha-X.Y.Z`; `religion-council` has a stray `v0.1`).
- [ ] **Add topics** to the 4 repos at zero: `homebrew-tap`, `tailscale-ai-egress`, `tradingview-mcp`, `starledger-template` (`tailscale-ai-egress` lost the topics its old private version had).
- [ ] **License gaps**: `ai-arena` (NONE, but invites fork & PR — highest), `homebrew-tap` (NONE), `tradingview-mcp` (`NOASSERTION`).
- [ ] **Standardise bilingual filename** to `README.zh-Hant.md` (today: `zh-Hant` / `zh-HK` / `zh-TW`; 5 repos have none).

---

### P0 · Correctness / honesty bugs

#### tradingview-mcp  *(verified)*
- [ ] README title is `# tradingview-mcp-review` and every `git clone` / `cd` / `.mcp.json` path points to the **wrong repo** `tradingview-mcp-review` → replace all self-references with `tradingview-mcp`.
- [ ] Opening says "9 MCP tools" but desc + `## The 7 tools` table + CI allowlist all say 7 → fix to **7**.
- [ ] License shows `NOASSERTION` (LICENSE is MIT / upstream `tradesdontlie`) → restore SPDX detection.
- [ ] Topics = 0; no releases → add topics (`mcp` `model-context-protocol` `tradingview` `chrome-devtools-protocol` `cdp` `security` `nodejs`) and cut **v0.1.0**.
- [ ] README: badge header + ASCII (client → server.js → loopback CDP `127.0.0.1:9222` → TradingView) + `## 🛡️ Security boundary` ✅/🚫 (this is the selling point) + layout/docs tables.
- Description → `Review-only MCP bridge for TradingView Desktop: 7 read/navigate tools over a hard-pinned 127.0.0.1 CDP boundary — a source-level–hardened fork of tradesdontlie/tradingview-mcp with every high-privilege primitive deleted and the tool surface locked by a CI allowlist.`

#### opus-pack  *(verified)*
- [ ] Version mismatch: README badge + `> [!NOTE]` say `alpha-0.1.16`, latest tag is `alpha-0.1.2`, 0 releases → tag `alpha-0.1.16` + release (notes cite eval), or fix the badge.
- [ ] Description undersells: it's a Claude Code **plugin marketplace** (2 plugins / 13 skills / 4 hooks + CI), not just "operating skills".
- [ ] README: emoji section headers + `## ✨ Highlights` + `## 🗂️ Repository layout` table + `## 📚 Documentation` table; move long hook/eval detail into `<details>`. (Honesty / null-results — keep.)
- [ ] Topics: add `ai-governance` `guardrails` `claude-code-plugin` `hooks` `evaluation`.
- Description → `A Claude Code plugin marketplace: agent-discipline + design skills for daily-driver Claude models — few dense rules and executable gates (hooks + CI) over long prose, measured against its own evals with null results published.`

#### religion-council
- [ ] Rename all **8 GitHub Release titles** `Religion Council vX` → `Worldview Council vX` (undercuts the rebrand on the most visible surface). README body is already rebranded — keep.
- [ ] Remove topic `religious-studies` (keep `philosophy`/`debate` as domain signal).
- [ ] Move the ~15-paragraph per-version changelog off the top of the README into `CHANGELOG.md`; put a one-line honest status at the top.
- [ ] README: centered header + emoji sections + linked `## 🗂️ Repository layout` table + `## 📚 Documentation` table.
- Description → `Worldview Council — a source-grounded multi-agent deliberation framework (Claude Code · Codex · MCP): structured claims, citation verification and fail-closed boundaries keep every quotation traceable to its text. Worldviews are the test domain; grounding & governance are the point.`

---

### P1 · Governance / legal

#### ai-arena
- [ ] **Add a LICENSE** (+ CONTRIBUTING note on how submitted AI output is licensed) — it invites "fork & PR to add your own" but has none.
- [ ] README: badge header incl. a **live** badge; prominently link the live gallery (`f-e-u-e-r.github.io/ai-arena/`) + a hero/screenshot; `## ✨ Highlights` surfacing the evaluation-governance strengths (schema-validated submissions, fail-fast on unknown fields, CI secret-scan, sourced+dated pricing); link `ROADMAP.md`.
- [ ] Topics: add `ai-evaluation` `model-comparison` `evaluation` `cost-analysis`.
- Description → `Side-by-side comparison of AI outputs for the same prompt — across model, thinking effort and client — with time / token / cost metrics. Provider-neutral, schema-validated static GitHub Pages site (live demo); fork & PR to add your own run.`

---

### P2 · Portfolio-featured polish

#### starledger  *(flagship productisation)*
- [ ] Description outdated (only P0/P1) → add notifier/AI/template/Discovery + the no-key-custody / provenance / AI-not-in-CI hook; mark alpha.
- [ ] README reads like an internal phase log → add gold header + honest status line (P0–P5 implemented, P6–P7 specced, link the template repo) + `## ✨ Highlights` (no-key-custody, exit-code contract, provenance) + linked layout table + `## 🛡️ Trust & governance` ✅/🚫 (cite `docs/P6-security-review-packet.md`) + `## 📚 Documentation` table + **`## ⚖️ License`** (Apache-2.0).
- [ ] Cut a Release for the newest tag; fix the existing release whose title says "template".
- Description → `Self-owned GitHub-stars dashboard + deterministic export pipeline. Static GitHub Pages site; a fail-closed, exit-coded exporter with provenance gates; optional Telegram notifier and opt-in AI enrichment that never runs in CI. No backend, no key custody — only your read-only token.`

#### tailscale-ai-egress  *(release model — imitate its cadence)*
- [ ] Already ~70% gold (badges, bilingual, honest status, `<details>`, mermaid). Add: centered header + bold value prop, emoji section headers, linked `## 🗂️ Repository layout` table, `## 🛡️ Security` ✅/🚫, docs list → table, typed `> [!WARNING]`, `## ⚖️ License`.
- [ ] Topics: add `tailscale` `app-connector` `exit-node` `egress` `vpn` `networking` `vps` `failover` `high-availability` `bash`.
- [ ] Bilingual `zh-HK` → standardise to `zh-Hant` (or keep by choice).
- Description → `Tailscale App Connector + exit-node toolkit that routes only selected AI domains through a VPS egress IP — with primary/fallback failover, connector HA monitoring, and auditable opt-in policy automation. POSIX shell, no telemetry, fail-closed.`

---

### P3 · Lower priority

#### starledger-template  *(is a template repo)*
- [ ] Topics = 0 (a "Use this template" repo with zero topics) → add `template` `github-template` `github-stars` `dashboard` `github-pages` `typescript` `react` `vite` `pnpm` `self-hosted`.
- [ ] H1 identical to the parent repo → differentiate (e.g. `⭐ StarLedger — deploy your own`); add honest status line; cut a `v1.2.0-alpha.1` Release.
- Description → `Deploy your own GitHub-stars dashboard on infrastructure you own — no backend, no key custody. Use this template, add a read-only PAT, enable Pages. Optional Telegram notifier and opt-in AI enrichment; a setup doctor tells you exactly what's missing.`

#### homebrew-tap  *(infra glue — keep minimal)*
- [ ] Add a `LICENSE` (or a one-line license note) — currently NONE.
- [ ] Topics: `homebrew` `homebrew-tap` `homebrew-cask` `macos` `cask`.
- [ ] Optional: 1–2 shields.io badges + `English · 繁體中文`. Do **not** add product-README sections. Releases follow the app repo.

---

### Forks (not deep-reviewed)
- [ ] `tradingview-mcp-review`, `tradingview-mcp-atila-ref`: upstream/donor reference forks — archive or mark "reference only" (the former is the exact name the P0 identity bug points at).
- [ ] `jianying-headless`: fork, "Private source preview" — decide whether it should be public at all.

---

### Suggested order
**P0** (honesty bugs) → **P1** (ai-arena LICENSE) → cross-cutting topics + version scheme → **P2/P3** README house-standard rollout (featured repos first: religion-council, starledger, tailscale-ai-egress, ai-arena).

*Generated from a review that benchmarked each repo against the `ai-pet-usage` README.*

