---
name: resume-builder
description: >-
  Autonomous proof-anchored resume compiler and ATS optimization engine.
  Extracts job posting requirements, selects matching case studies from .agents/career/profile.md and .agents/career/projects/,
  and compiles single-page vector PDFs, plain-text ATS copy buffers, and 80-word founder DMs into .agents/career/applications/.
  Make sure to use this skill whenever the user asks to tailor a resume, build a resume,
  compile an ATS resume, generate a CV, optimize for Ashby/Greenhouse/Lever/Workday,
  draft a founder pitch note, or run /resume-builder.
---

# Resume Builder: Proof-Anchored Resume Compiler

This skill compiles tailored single-page resumes, ATS copy buffers, and founder pitches from your career hub.

---

## 1. Operating Invariants & Guiding Questions

- **Why This Skill Exists**: Prevents generic, unformatted, or unparsed resumes from causing ATS and hiring rejection.
- **ASD-STE100 Language Rule**: Keep all sentences strictly under 20 words. Write in active voice.
- **Positive-Negative Rule Pairing**: Always pair constraints (`DO NOT [forbidden action] ... ALWAYS [required action]`).
- **Guiding Self-Questions (Pareto 80/20)**:
  - _Pre-Flight_: *"Did I extract the job requirements and inspect `.agents/career/profile.md` before writing?"*
  - _In-Flight_: *"Did I verify all metrics against `.agents/career/projects/` without inventing numbers?"*
  - _Verification_: *"Does the resume fit strictly on 1 page (<600 words) with selectable text?"*

---

## 2. Ingestion & Ground-Truth Context

DO NOT invent unverified metrics, synthetic percentages, or unlisted tools.
ALWAYS ground all claims against your Single Source of Truth (SSOT):

- **Master Career Profile**: Read `.agents/career/profile.md` for contact info, skills, and target roles.
- **Project Case Studies**: Read all markdown files in `.agents/career/projects/`.
- **ATS Parsing Specifications**: Read [references/ats_rules.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/resume-builder/references/ats_rules.md).
- **Bullet Taxonomy & Verbs**: Read [references/bullet_taxonomy.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/resume-builder/references/bullet_taxonomy.md).
- **Resume HTML Template**: Read [templates/resume_template.html](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/resume-builder/templates/resume_template.html).

---

## 3. 3-Phase Tailoring Protocol

### Phase 1: Ingest & Extract Job Requirements
1. Ingest target Job Description (JD) text or public ATS link.
2. Identify core technical stack and domain requirements.
3. Identify target ATS vendor (Ashby, Greenhouse, Lever, Workday) and apply rules in [references/ats_rules.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/resume-builder/references/ats_rules.md).

### Phase 2: Select & Re-Rank Case Studies
DO NOT include generic job duties or unranked projects.
ALWAYS select top 2–4 high-impact case studies matching target domain from `.agents/career/projects/`:
- Select projects with relevant tech stacks and proven results.
- Transform bullets into Google XYZ format (`Accomplished [X], measured by [Y], by doing [Z]`).
- Verify every metric against [references/bullet_taxonomy.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/resume-builder/references/bullet_taxonomy.md).

### Phase 3: Multi-Modal Output Compilation
DO NOT deliver multi-page documents or unselectable rasterized PDFs.
DO NOT save application materials to unstructured root directories.
ALWAYS save application materials in `.agents/career/applications/<company-slug>-<role-slug>/`.
ALWAYS generate all three structured output modalities:

1. **1-Page Vector PDF & HTML**:
   - Render tailored HTML using [templates/resume_template.html](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/resume-builder/templates/resume_template.html).
   - Save HTML to `.agents/career/applications/<slug>/resume_<company>.html`.
   - Compile vector PDF using Chromium or print styling.
   - Save PDF to `.agents/career/applications/<slug>/<FullName>_<Role>_<Company>.pdf`.
   - Apply single-column layout and `@page { size: letter portrait; margin: 0.4in 0.45in; }`.
   - Assert word count stays strictly between 450 and 600 words.
2. **ATS Plain-Text Copy Buffer**:
   - Save plain text to `.agents/career/applications/<slug>/resume_<company>_ats.txt`.
   - Output clean plain text without HTML tags or markdown tables.
3. **80-Word Async Founder DM & Application Pitch**:
   - Save pitch note to `.agents/career/applications/<slug>/application_pitch.md`.
   - Compose concise outreach pitch highlighting 1 relevant metric and portfolio link.

---

## 4. Verification & Quality Gates

Run these verification steps before finalizing outputs:

- [ ] All output assets are organized under `.agents/career/applications/<company-slug>-<role-slug>/`.
- [ ] Word count is strictly between 450 and 600 words (1-page budget).
- [ ] Layout is 100% single-column without floating sidebars or structural tables.
- [ ] 100% of metrics match verified numbers in `.agents/career/profile.md` and `.agents/career/projects/`.
- [ ] PDF text layer is selectable and copy-pasteable Unicode text.
- [ ] Proactively prompt user to log opportunity in `.agents/career/job_leads.md`.
