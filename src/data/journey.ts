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
    capability: 'Agent Governance',
    status: 'ACTIVE',
    milestones: [
      { title: 'Initial Framework' },
      { title: 'Structured Controls' },
      { title: 'Executable Gates' },
      { title: 'AUTH Boundary' },
      { title: 'Human Approval' },
      { title: 'Agent Governance' },
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
