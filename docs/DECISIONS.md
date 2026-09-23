# Decisions — Portfolio v1

Concise decision log (newest first). Each entry: decision · rejected alternative · why.

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
