---
name: showcase
description: Universal personal portfolio and AI career command center toolkit for Antigravity. Manages public web portfolios (Path A existing sites or Path B zero-dependency starter portfolio) and private career operations in .agents/career/. Provides guided 2-minute 3-question onboarding, single-page vector PDF resume compiler, ATS optimization, 80-word founder pitch generator, structured case study publisher, job opportunity matcher, visual theme polishing (Warm Editorial, Clean Minimal, Bold Creative, Dark Studio), and live browser preview. Make sure to use this skill whenever the user mentions showcase, personal portfolio, career hub, resume tailoring, portfolio setup, publishing case studies, /showcase, /showcase init, /showcase resume, /showcase pitch, /showcase publish, /showcase hunt, /showcase polish, /showcase profile, /showcase preview, or asks to create, update, or inspect their personal portfolio or career assets, even if not explicitly named.
---

# Showcase: Personal Portfolio & Career Command Center

Showcase provides a dual-engine architecture for personal websites and private career intelligence. It connects existing personal sites (Path A) or creates a zero-dependency starter portfolio (Path B).

---

## 1. Epistemic Purpose & Anchor Questions

- **Why This Skill Exists**: Prevents fragmented career documents, broken portfolio builds, and repetitive resume tailoring.
- **Guiding Self-Questions (Pareto 80/20)**:
  - *Pre-Flight*: "Did I inspect the workspace non-destructively to detect Path A vs Path B?"
  - *In-Flight*: "Are all user-facing prompts in CEFR A2 English and errors in NN/g 3-part format?"
  - *Verification*: "Did I verify zero file deletions and validate configs against schemas?"

---

## 2. Operating Invariants & Non-Negotiables

- **Zero-Deletion Invariant**: DO NOT delete, move, or overwrite existing source files. ALWAYS create timestamped `.bak.<ts>` backups before file modifications.
- **Controlled Language Invariant**: DO NOT use complex technical jargon with end users. ALWAYS format user dialogues in CEFR A2 English (<20 words/sentence) and internal specs in ASD-STE100.
- **3-Level Progressive Disclosure**: DO NOT inline large schemas or monolithic code in `SKILL.md`. ALWAYS offload heavy data to Level 3 assets (`references/`, `scripts/`, `templates/`).
- **Deterministic State Handling**: DO NOT allow deadlocked or unhandled error states. ALWAYS implement all 5 FSM states with explicit NN/g 3-part recovery buttons.

---

## 3. Interactive Command Router

| Command | Category | Purpose | Actions & Outputs |
| :--- | :--- | :--- | :--- |
| `/showcase` | Menu | Display high-value actions | Opens interactive action menu if configured; launches setup if empty. |
| `/showcase init` | Setup | 2-minute guided onboarding | Runs 3-question setup. Detects Path A vs Path B. Generates `showcase.config.json` & `.agents/career/profile.md`. |
| `/showcase resume [job]` | Career | Tailor job application | Reads job posting. Compiles 1-page vector PDF, ATS plain-text copy, and tailored pitch note in `applications/<slug>/`. |
| `/showcase pitch [name]` | Career | Contact hiring lead | Generates concise, proof-anchored intro message under 80 words matching `templates/pitch_template.md`. |
| `/showcase publish [work]` | Portfolio | Publish case study | Formats raw project notes into `.agents/career/projects/<slug>.md` and updates website data adapter. |
| `/showcase hunt [role]` | Career | Discover opportunities | Matches master profile against target roles and outputs ranked opportunity list. |
| `/showcase polish [page]` | Design | Polish visual appearance | Audits WCAG AA/AAA contrast and applies semantic OKLCH theme tokens (Warm Editorial, Clean Minimal, Bold Creative, Dark Studio). |
| `/showcase profile` | Career | Update career story | Opens guided interview to add new metrics and project wins to `.agents/career/profile.md`. |
| `/showcase preview` | Portfolio | Launch site preview | Opens local portfolio in browser with zero build dependencies. |

---

## 4. Guided Setup Logic (Path A vs Path B)

```mermaid
flowchart TD
    CMD[/showcase init] --> DETECT[scripts/detect_workspace.js]
    DETECT -->|Existing Site Found| PATH_A[Path A: Connect Existing Portfolio]
    DETECT -->|Empty Directory| PATH_B[Path B: Greenfield Starter Portfolio]
    PATH_A --> Q_A[Ask Role & Top Achievements] --> WRITE_A[Inject .agents/career & profile.md]
    PATH_B --> Q_B[Ask Name, Theme & Contact] --> COPY_B[Copy starter-portfolio & Inject career hub]
```

- **Path A (Existing Site)**: Connects Next.js, Astro, Vite, or HTML sites safely. Injects `.agents/career/` without altering site code.
- **Path B (Starter Site)**: Scaffolds semantic HTML5/CSS starter with 4 visual presets and project card renderer.

---

## 5. 5-State FSM & NN/g 3-Part Error Recovery

Every command handles 5 states: `Empty` -> `Active` -> `Loading` -> `Success` -> `Error`.

All error dialogues MUST follow the **NN/g 3-Part Microcopy Standard**:
1. **What happened**: Plain statement of the issue (no stack traces).
2. **Why it happened**: Clear explanation of the cause.
3. **One-click recovery CTA**: Direct action button with `[Verb + Object]`.

### Standard Error Scenarios & Recovery Copy

- **Locked Folder**:
  - *What*: We could not save your portfolio files.
  - *Why*: This folder is locked or requires administrator permission.
  - *CTA*: `[Choose Another Folder]` or `[Grant Permission and Retry]`
- **Missing Profile**:
  - *What*: We cannot tailor your resume yet.
  - *Why*: Your career notes file is empty.
  - *CTA*: `[Answer 2 Quick Questions]`
- **Private Job Link**:
  - *What*: We could not read this job posting link.
  - *Why*: The job website requires a login or the link is private.
  - *CTA*: `[Paste Job Text Directly]`
- **Interrupted Setup**:
  - *What*: Setup paused before finishing.
  - *Why*: The connection closed during file creation.
  - *CTA*: `[Resume Setup from Step 2]`

---

## 6. Level 3 Progressive Disclosure Reference Map

- **Data Schemas**:
  - Config Schema: [`references/config-schema.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/config-schema.json)
  - Profile Schema: [`references/profile-schema.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/profile-schema.json)
  - Project Schema: [`references/project-schema.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/project-schema.json)
- **ATS Compliance Guide**: [`references/ats-rules.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/ats-rules.md) (Ashby, Greenhouse, Lever, Workday standards).
- **Core Automation Scripts**:
  - Inspector: [`scripts/detect_workspace.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/detect_workspace.js)
  - Scaffolder: [`scripts/init_workspace.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/init_workspace.js)
  - Resume Compiler: [`scripts/compile_resume.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/compile_resume.js)
  - Case Study Publisher: [`scripts/publish_case_study.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/publish_case_study.js)
- **Document Templates**:
  - Master Profile: [`templates/profile_template.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/profile_template.md)
  - Vector PDF Resume: [`templates/resume_template.html`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/resume_template.html)
  - 80-Word Founder Pitch: [`templates/pitch_template.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/pitch_template.md)
  - Greenfield Starter Site: [`templates/starter-portfolio/`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/index.html)

