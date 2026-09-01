---
name: project-publisher
description: >-
  Generic case study publisher.
  Inspects codebases, extracts metrics, drafts case studies into .agents/career/projects/<slug>.md,
  and syncs with target website via publish_case_study.js.
  Make sure to use this skill whenever the user asks to "publish project to portfolio",
  "extract case study", "add project to portfolio", "convert repo to portfolio case study",
  or runs "/project-publisher", even if they do not explicitly name the skill.
---

# Project Publisher: Portfolio Case Study & Extraction Workflow

The `project-publisher` skill provides a 4-phase pipeline to inspect any software project, extract physical metrics, draft a high-fidelity case study, request human feedback via interactive review, and safely publish it to your website and career hub.

---

## 1. Operating Invariants & Guiding Questions

- **Why This Skill Exists**: Prevents unverified claims, broken schemas, and unformatted case studies by automating codebase metric extraction, human review gates, and live build verification.
- **CEFR A2 & ASD-STE100 Plain Language**: Keep all sentences under 20 words. Use simple words and active voice. Avoid robotic jargon.
- **Positive-Negative Rule Pairing**: Always pair constraints (`DO NOT [forbidden action] ... ALWAYS [required action]`).
- **Guiding Self-Questions (Pareto 80/20 Grounded)**:
  - _Pre-Flight_: *"Did I inspect repository files to gather verified test counts and tech stack metadata before drafting?"*
  - _In-Flight_: *"Did the draft pass schema validation against `references/schema_contract.md` and anti-slop rules?"*
  - _Verification_: *"Did `publish_case_study.js` and automated tests pass with 0 errors?"*

---

## 2. Ingestion & Ground-Truth Context

DO NOT invent unverified metrics, fake performance numbers, or synthetic benchmark stats.
ALWAYS ground case studies in physical evidence and configuration:

- **Target Portfolio Resolution (Global Mode)**:
  - If executed inside the personal portfolio repository: target directory is local (`./`).
  - If executed from an external project repository: resolve the personal portfolio root path from `~/.showcase/config.json` (or prompt the user once on first run: *"Where is your personal portfolio folder on this machine?"*).
- **Configuration File**: Read `showcase.config.json` in the target portfolio directory for mode, framework, and adapter settings.
- **Career Story Hub**: Read and update `<portfolioDir>/.agents/career/profile.md` and `<portfolioDir>/.agents/career/projects/`.
- **Schema Specification**: Read [references/schema_contract.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/project-publisher/references/schema_contract.md).
- **Copy & Narrative Rubric**: Read [references/copy_rubric.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/project-publisher/references/copy_rubric.md).

---

## 3. The 4-Phase Publishing Pipeline

### Phase 1: Automated Inspection & Metric Extraction
- Inspect repository structure, `package.json`, test runners, and git history.
- Extract physical metrics (e.g. test counts, bundle sizes, turnaround times, supported platforms).
- Identify core architectural mechanisms (e.g. state management, API routes, database schemas).

### Phase 2: Drafting & Validation Gate
- Draft structured case study conforming to [references/schema_contract.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/project-publisher/references/schema_contract.md).
- Enforce anti-slop rules from [references/copy_rubric.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/project-publisher/references/copy_rubric.md).
- Validate required fields (`slug`, `title`, `tagline`, `category`, `role`, `status`, `stack`, `metrics`, `summary`, `challenge`, `solution`, `architectureHighlights`).

### Phase 3: Interactive Human Review Gate
- Present draft payload to the user for review.
- Confirm project slug, featured status (`isFeatured`), and external links.
- Apply user feedback and refine copy before publishing.

### Phase 4: Safe Publishing & Verification
- Save master markdown file to `.agents/career/projects/<slug>.md`.
- Run `node showcase/skills/showcase/scripts/publish_case_study.js` to sync with target website data (Path A or Path B).
- If project is featured, update `featuredProjectSlugs` in `.agents/career/profile.md`.
- Run automated test suite to confirm zero regressions.

---

## 4. Verification Checklist

- [ ] Real metrics extracted from source code and test runners.
- [ ] Draft payload conforms to `references/schema_contract.md` with 0 validation errors.
- [ ] Draft payload presented to user and approved.
- [ ] Master markdown created in `.agents/career/projects/<slug>.md`.
- [ ] Website project data synchronized via `publish_case_study.js`.
- [ ] Profile updated in `.agents/career/profile.md`.
- [ ] Test suites execute cleanly with 100% tests green.
