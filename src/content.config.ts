// Content collections + typed schema (§35). Astro 7 Content Layer API.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Unified status system (§38).
const STATUS = ['LIVE', 'ACTIVE', 'PROTOTYPE', 'BUILDING', 'IN_DEVELOPMENT', 'ARCHIVED'] as const;
// Four core capabilities (§1 / §4).
const CAPABILITIES = ['transformation', 'applied-ai', 'delivery', 'governance'] as const;

// Evidence policy (§8) — evidence is not assumed to be a GitHub repo.
const evidence = z.object({
  type: z.enum([
    'live-demo', 'github', 'architecture', 'evaluation', 'before-after',
    'process-map', 'screenshots', 'article', 'benchmark', 'static',
  ]),
  label: z.string(),
  url: z.string().url().optional(),
});

// Curated milestone (§10 / §12) — meaningful capability milestones, hand-curated.
const milestone = z.object({
  title: z.string(),
  status: z.enum(STATUS).optional(),
  detail: z.string().optional(),
  why: z.string().optional(),
  evidenceUrl: z.string().url().optional(),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    status: z.enum(STATUS).default('BUILDING'),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    category: z.string(),
    capabilities: z.array(z.enum(CAPABILITIES)).default([]),
    summary: z.string(),
    // TL;DR fields (§7)
    problem: z.string().optional(),
    role: z.string().optional(),
    approach: z.string().optional(),
    outcome: z.string().optional(),
    milestones: z.array(milestone).default([]),
    evidence: z.array(evidence).default([]),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    relatedTopics: z.array(z.string()).default([]),
    relatedWriting: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(STATUS).default('ACTIVE'),
    order: z.number().default(99),
    summary: z.string(),
    capabilities: z.array(z.enum(CAPABILITIES)).default([]),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { cases, lab };
