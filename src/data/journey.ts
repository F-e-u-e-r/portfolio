// Journey data (§9, §10, §13). Curated — not a GitHub creation-date timeline.

// Professional Journey — vertical spine (§9): automation/transformation foundation.
export const spine = [
  { year: '2017', items: ['Python / Selenium', 'Workflow Automation'] },
  { year: '2019', items: ['Power Automate + Python'] },
  { year: '2021', items: ['SAP ERP Implementation', 'Enterprise Systems & Adoption'] },
  { year: '2023', items: ['Internal Tools / n8n', 'Workflow Redesign'] },
  { year: '2025', items: ['Applied AI — first grounded builds'] },
  { year: '2026', items: ['Applied AI Build Stream'] },
] as const;

// Applied AI Build Stream — per-row curated milestone evolution (§10).
// Homepage shows ~5–6 projects, each 3–5 high-value milestones (§13).
export type BuildRow = {
  name: string;
  capability: string;
  status: string; // one of the §38 status keys
  milestones: { title: string; detail?: string; why?: string; evidenceUrl?: string }[];
};

export const buildStream: BuildRow[] = [
  {
    name: 'AI Arena',
    capability: 'Evaluation',
    status: 'ACTIVE',
    milestones: [
      { title: 'Side-by-side harness' },
      { title: 'Schema-validated submissions' },
      { title: 'Sourced + dated pricing' },
      { title: 'CI secret-scan + deploy' },
    ],
  },
  {
    name: 'Opus Pack',
    capability: 'Agent discipline · Executable gates',
    status: 'ACTIVE',
    // Chronology verified against the repo's git history (docs/reviews/2026-09-24-public-repo-metadata-review.md).
    milestones: [
      {
        title: 'Discipline skills + first gates',
        detail: '2026-07-07 — skills/ plus the first executable hooks (gate-before-commit, verify-before-stop) in the initial commit.',
        evidenceUrl: 'https://github.com/F-e-u-e-r/skills/commit/58c65db4f5ce68567c117b6aa5c2d70aab38ef54',
      },
      {
        title: 'Evals with null results',
        detail: '2026-07-11 — "Evals: testing the pack itself" added to the README; the null result was published the next day.',
        why: 'The pack is measured against its own doctrine, and a negative result is reported rather than hidden.',
        evidenceUrl: 'https://github.com/F-e-u-e-r/skills/commit/eb492ed2ff8471b8f10c764119876e8a0f1c534f',
      },
      {
        title: 'Plugin marketplace',
        detail: '2026-07-16 — .claude-plugin/marketplace.json and a CI consistency gate: the pack becomes an installable Claude Code plugin.',
        evidenceUrl: 'https://github.com/F-e-u-e-r/skills/commit/a523e984bd49ba312a84d720d697e434ee5fef0b',
      },
      {
        title: 'Design Pack',
        detail: '2026-07-19 — design-pack: a second, independently installable plugin with three design-craft skills.',
        evidenceUrl: 'https://github.com/F-e-u-e-r/skills/commit/433e93f365cb3eeffc48475c046d69ddf18b3388',
      },
      {
        title: 'Instrument Hardening v1 (current)',
        detail: '2026-09-18 — evaluation results published; ROADMAP "Now — Instrument Hardening v1" is the current workstream.',
        evidenceUrl: 'https://github.com/F-e-u-e-r/skills/commit/6c0461909920972ff8ab27dd9982115e3097b829',
      },
    ],
  },
  {
    name: 'Worldview Council',
    capability: 'Agentic AI · Grounding',
    status: 'ACTIVE',
    milestones: [
      { title: 'Multi-agent orchestration' },
      { title: 'Viewpoint separation' },
      { title: 'Citation verification' },
      { title: 'Fail-closed boundary' },
      { title: 'Moderation / synthesis' },
    ],
  },
  {
    name: 'Employment RAG',
    capability: 'Grounded AI',
    status: 'PROTOTYPE',
    milestones: [
      { title: 'Source structure' },
      { title: 'Retrieval design' },
      { title: 'A/B/C evaluation' },
      { title: 'Abstention gate' },
    ],
  },
  {
    name: 'Cantonese Model',
    capability: 'Model Adaptation',
    status: 'IN_DEVELOPMENT',
    milestones: [
      { title: 'Baseline design' },
      { title: 'Evaluation methodology' },
      { title: 'Fine-tuning decision' },
    ],
  },
];
