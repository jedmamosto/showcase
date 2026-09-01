# Schema Contract: `CaseStudy` Specification

This reference defines the data contract required for portfolio case studies and `.agents/career/projects/<slug>.md`.

---

## 1. Type Definitions

```typescript
export type ProjectCategory =
  | 'Enterprise FinTech'
  | 'Conversion Funnels'
  | 'Open Source & Developer Tools'
  | 'B2B Group-Buying SaaS'
  | 'AI Systems & Upskilling'
  | 'AI Product Engineering'
  | 'General';

export type ProjectStatus =
  | 'Production'
  | 'Production Upcoming'
  | 'Live Production'
  | 'Active Development'
  | 'Advisory / Seed Phase'
  | 'Live Beta';

export interface ProjectMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface ArchitectureHighlight {
  title: string;
  description: string;
}

export interface ProjectVideos {
  productDemoUrl?: string;
  productDemoTitle?: string;
  aiWorkflowUrl?: string;
  aiWorkflowTitle?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  role: string;
  organization: string;
  timeframe: string;
  status: ProjectStatus;
  statusBadge: string;
  isFeatured: boolean;
  featuredRank?: number;
  liveUrl?: string;
  githubUrl?: string;
  stack: string[];
  metrics: ProjectMetric[];
  videos?: ProjectVideos;
  summary: string;
  challenge: string;
  solution: string;
  architectureHighlights: ArchitectureHighlight[];
  aiWorkflowNarrative?: string;
}
```

---

## 2. Field Validation Rules

| Field | Type / Constraint | Validation Rule |
| :--- | :--- | :--- |
| `slug` | `string` (kebab-case) | Must match `^[a-z0-9-]+$`. Used in routes and filenames. |
| `title` | `string` | Human-readable product or project name. |
| `tagline` | `string` | 1-sentence value proposition summary. |
| `category` | `string` | Project domain classification. |
| `role` | `string` | Candidate role (e.g. `"Lead Full-Stack Engineer"`). |
| `organization` | `string` | Client, company, or open-source org. |
| `timeframe` | `string` | Timeframe (e.g. `"2025 — Present"`). |
| `status` | `string` | Current project status. |
| `statusBadge` | `string` | Short badge for card / header display. |
| `isFeatured` | `boolean` | `true` for spotlight projects; `false` for archive. |
| `featuredRank` | `number` (optional) | Sorting order integer for featured projects. |
| `liveUrl` | `string` (optional) | Valid external HTTP/HTTPS URL. |
| `githubUrl` | `string` (optional) | Valid GitHub repository URL. |
| `stack` | `string[]` | Array of concrete technologies. |
| `metrics` | `ProjectMetric[]` | Exactly 2–4 verified physical metrics (`label`, `value`, `detail`). |
| `videos` | `ProjectVideos` (optional) | Video URLs for demonstrations. |
| `summary` | `string` | 1–2 sentence overview paragraph. |
| `challenge` | `string` | 1 paragraph detailing problem/friction (30–60 words). |
| `solution` | `string` | 1 paragraph describing technical architecture (30–60 words). |
| `architectureHighlights` | `ArchitectureHighlight[]` | Exactly 2–3 items, each with `title` and `description`. |
| `aiWorkflowNarrative` | `string` (optional) | 1–2 sentences explaining development acceleration. |
