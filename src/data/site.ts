// Site-wide identity, navigation, and shared metadata (§1, §3, §30, §32, §38).

export const identity = {
  name: 'Eric So',
  role: 'Business Transformation & Applied AI',
  positioning:
    'Turning operational problems into practical AI, automation and workflow solutions — from process design and prototyping to deployment, governance and adoption.',
  thesis:
    'I can understand a business problem, redesign the workflow, decide where technology is appropriate, prototype the solution, evaluate whether it works, operationalise it with appropriate controls, and support adoption.',
  githubAliasNote: 'Public builds on GitHub are published under my alias, Feuer.',
  domain: 'ccso.shsl.world',
} as const;

// Four core capabilities (§4). Order is load-bearing on the homepage strip.
export const capabilities = [
  {
    key: 'transformation',
    label: 'Transformation & Process Design',
    blurb: 'Read the operational problem, redesign the workflow, and decide where technology is actually appropriate.',
  },
  {
    key: 'applied-ai',
    label: 'Applied AI & Automation',
    blurb: 'Prototype grounded AI, retrieval, agents and automation — then evaluate whether they genuinely work.',
  },
  {
    key: 'delivery',
    label: 'Solution Delivery',
    blurb: 'Take a solution from prototype to something deployed, observable and maintainable.',
  },
  {
    key: 'governance',
    label: 'Governance & Adoption',
    blurb: 'Guardrails, privacy, source policy and the human side of getting people to rely on it.',
  },
] as const;

export type CapabilityKey = (typeof capabilities)[number]['key'];

// Information architecture (§3). `soon` marks Writing as "to be launched" (§28).
export const nav = [
  { label: 'Case Studies', href: '/case-studies/' },
  { label: 'Journey', href: '/journey/' },
  { label: 'Lab', href: '/lab/' },
  { label: 'Internal Builds', href: '/internal-builds/' },
  { label: 'Writing', href: '/writing/', soon: true },
  { label: 'Topics', href: '/topics/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

// Working principles (§30) — operating philosophy, each backed by case evidence.
export const principles = [
  'Evaluate before adopting.',
  'Fine-tuning is a decision, not an objective.',
  'Guardrails are part of the architecture, not an afterthought.',
  'Automation should remove friction, not simply move it elsewhere.',
  'A solution is not complete until people can use it reliably.',
] as const;

// Contact + primary links (§32, §33). TODO: real LinkedIn + hosted resume URL.
export const contact = {
  email: 'ccso@shsl.world',
  github: 'https://github.com/F-e-u-e-r',
  linkedin: '', // TODO: LinkedIn profile URL
  resume: '', // TODO: hosted resume (View Resume — secondary CTA, §33)
} as const;

// Status display metadata (§38): label + the CSS custom property that colours it.
export const STATUS_META: Record<string, { label: string; varName: string }> = {
  LIVE: { label: 'Live', varName: '--status-live' },
  ACTIVE: { label: 'Active', varName: '--status-active' },
  PROTOTYPE: { label: 'Prototype', varName: '--status-prototype' },
  BUILDING: { label: 'Building', varName: '--status-building' },
  IN_DEVELOPMENT: { label: 'In development', varName: '--status-in-development' },
  ARCHIVED: { label: 'Archived', varName: '--status-archived' },
};
