# Technical Reference: Data Contracts & Schemas

**Standard**: ASD-STE100 & Strict TypeScript | **Line Budget**: ≤ 150 lines  
**Documentation Hub**: [Documentation Index](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/index.md)

---

## 1. Toolkit Configuration Contract (`showcase.config.json`)

Validated by [config-schema.json](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/config-schema.json):

```typescript
export interface ShowcaseConfig {
  schemaVersion: '1.0.0';
  mode: 'existing-portfolio' | 'greenfield-starter';
  framework: 'nextjs' | 'astro' | 'vite' | 'html-static' | 'remix' | 'nuxt' | 'sveltekit' | 'custom';
  portfolioDir: string;
  careerDir: string; // default: ".agents/career"
  theme: 'warm-editorial' | 'clean-minimal' | 'bold-creative' | 'dark-studio';
  exportTargets: { pdf: boolean; atsText: boolean; pitchNote: boolean };
  contact: { email: string; fullName?: string; headline?: string; location?: string; linkedin?: string; github?: string; website?: string };
  adapter?: { projectDataFile?: string; format: 'typescript' | 'json' | 'markdown-collections' | 'html' };
}
```

---

## 2. Master Career Profile Contract (`.agents/career/profile.md`)

Validated by [profile-schema.json](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/profile-schema.json):

```typescript
export interface MasterCareerProfileFrontmatter {
  schemaVersion: '1.0.0';
  contact: {
    fullName: string;
    headline: string;
    location: string;
    email: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  targetRoles: string[];
  coreCompetencies: {
    domain: string[];
    technical: string[];
    tools: string[];
  };
  featuredProjectSlugs: string[];
  keyMetrics: Array<{ label: string; value: string; context: string }>;
  lastUpdated: string; // ISO 8601
}
```

---

## 3. Case Study Contract (`.agents/career/projects/<slug>.md`)

Validated by [project-schema.json](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/project-schema.json):

```typescript
export interface CaseStudyFrontmatter {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  role: string;
  organization: string;
  timeframe: string;
  status: 'Production' | 'Live' | 'Active Development' | 'Concept' | 'Case Study';
  statusBadge: string;
  isFeatured: boolean;
  featuredRank?: number;
  liveUrl?: string;
  githubUrl?: string;
  stack: string[];
  metrics: Array<{ label: string; value: string; detail?: string }>;
}
```
