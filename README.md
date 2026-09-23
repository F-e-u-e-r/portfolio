<div align="center">

# ⭐ ccso.shsl.world — Portfolio

**Eric So — Business Transformation &amp; Applied AI.**

![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![status](https://img.shields.io/badge/status-BUILDING-9aa3ac)
![output](https://img.shields.io/badge/output-static-2ee6a6)
![hosting](https://img.shields.io/badge/hosting-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)

Turning operational problems into practical AI, automation and workflow solutions —
from process design and prototyping to deployment, governance and adoption.

</div>

```text
  ┌──────────────────────────────────────────────┐
  │  > INITIALISING PORTFOLIO             100%     │
  │                                                │
  │  ERIC SO · BUSINESS TRANSFORMATION & APPLIED AI│
  │  case studies · journey · lab · writing        │
  └──────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Phase 1 — foundation + homepage shell.** An Astro static site with a typed content
> schema, the full route skeleton (§3 IA), and a working homepage: Matrix boot, capability
> strip, featured cases, journey + Applied AI build stream, working principles, Lab/Writing
> teasers, and contact. Case/Lab content is **placeholder** pending the MVP content pass.
> Not yet deployed. Cross-model reviewed (GPT-5.6 sol + luna; Grok 4.6 ×2 rounds) with fixes
> applied — see [`ROADMAP.md`](ROADMAP.md). Scope is frozen at v1.0 — see [`docs/DECISIONS.md`](docs/DECISIONS.md).

## ✨ What's here

- 🎯 **Positioning-first homepage** — 10 sections in the scope's §4 order, driven by typed data.
- 🗂️ **Typed content schema** (§35) — `cases` + `lab` collections (status, capabilities, evidence, milestones) so a new project is a Markdown file, not a layout change.
- 🟩 **Matrix boot** (§5) — short first-visit system-init overlay; skips on repeat visits; static under `prefers-reduced-motion`.
- 🧭 **Journey + Applied AI Build Stream** (§9–§13) — vertical career spine plus curated per-project milestone rows.
- 🎨 **Restrained design system** (§36/§37) — dark-first tokens, one Matrix-green accent, motion hierarchy.
- 🐾 **Desktop pet** (§14) — MVP idle companion, hidden on mobile, static under reduced-motion.
- 🛟 **Maintenance + 404** — a degraded-state `/under-maintenance` page (§21).

## 🚀 Develop

```bash
npm install
npm run dev      # dev server → http://localhost:4321
npm run build    # static build → dist/
npm run preview  # serve the built dist/
npm run check    # astro check (types + content schema)
```

## 🗂️ Repository layout

| Path | What lives there |
| --- | --- |
| [`src/pages/`](src/pages) | Routes — homepage, `case-studies/` (+ `[...slug]`), journey, lab, internal-builds, writing, topics, about, contact, under-maintenance, 404. |
| [`src/content.config.ts`](src/content.config.ts) | Content Layer collections + Zod schema (§35). |
| [`src/content/`](src/content) | `cases/` and `lab/` Markdown entries (placeholder). |
| [`src/data/`](src/data) | `site.ts` (identity, nav, capabilities, principles, contact) and `journey.ts` (spine + build stream). |
| [`src/layouts/BaseLayout.astro`](src/layouts) | HTML shell, head/meta, header, footer, pet, Matrix boot. |
| [`src/components/`](src/components) | `MatrixBoot`, `SiteHeader`, `SiteFooter`, `PetCompanion`, `StatusBadge`, `CaseCard`. |
| [`src/styles/`](src/styles) | `tokens.css` (design tokens) + `global.css` (base). |
| [`wrangler.toml`](wrangler.toml) | Cloudflare Workers Static Assets config (§34). |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Decision log. |
| [`docs/PUBLIC_REPO_STANDARD.md`](docs/PUBLIC_REPO_STANDARD.md) | Metadata standard for the public repositories (tiers, description, top fold, topics, releases, status). |
| [`ROADMAP.md`](ROADMAP.md) | Progress log + output summary + cross-model (xcheck) results. |

## 🧭 Status system

Every project uses one status vocabulary (§38): `LIVE · ACTIVE · PROTOTYPE · BUILDING · IN_DEVELOPMENT · ARCHIVED`.

## ⚖️ Notes

Pre-launch; public for review. GitHub builds referenced by cases are published under the alias **Feuer**.
