# Showcase Specifications Index

**Workspace**: `showcase` | **Standard**: ASD-STE100 & CEFR A2 | **Line Budget**: ≤ 100 lines

This index catalogs all architectural blueprints, design system specifications, decision records, automation scripts, schemas, and verification plans for the standalone **Showcase** personal portfolio toolkit.

---

## 1. Core Specifications & Blueprints

| Specification | Epistemic Purpose | Status | Target URI |
| :--- | :--- | :--- | :--- |
| **[UX Strategy Blueprint](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/specs/showcase-ux-blueprint.md)** | Non-developer mental models, switching forces, command architecture, and 5-state onboarding flows. | APPROVED | [`showcase-ux-blueprint.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/specs/showcase-ux-blueprint.md) |
| **[Visual Style Presets](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/specs/showcase-visual-presets.md)** | 4 starter visual themes, semantic OKLCH token engine, WCAG AA/AAA verification, and ASCII wireframes. | APPROVED | [`showcase-visual-presets.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/specs/showcase-visual-presets.md) |
| **[System Architecture](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/specs/showcase-system-architecture.md)** | Dual-engine C4 topology, TypeScript data contracts, non-destructive detector, and starter portfolio. | APPROVED | [`showcase-system-architecture.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/specs/showcase-system-architecture.md) |

---

## 2. Architecture Decision Records (ADR)

| ADR ID | Title | Status | Target URI |
| :--- | :--- | :--- | :--- |
| **[ADR-0001](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/adr/0001-showcase-toolkit-architecture.md)** | Showcase Toolkit Architecture: Dual-Engine Portfolio & Private Career Center | ACCEPTED | [`0001-showcase-toolkit-architecture.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/adr/0001-showcase-toolkit-architecture.md) |

---

## 3. Quality & Behavioral Verification

| Document | Epistemic Purpose | Status | Target URI |
| :--- | :--- | :--- | :--- |
| **[Behavioral Verification Plan](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/testing/showcase-bvp.md)** | 20-point Acceptance Criteria Matrix (AC-001 to AC-020), test pyramid distribution, and Fail-to-Pass runbook. | APPROVED | [`showcase-bvp.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/testing/showcase-bvp.md) |

---

## 4. Subsystem Modules, Scripts & Schemas

| Module Category | Components / Files | Description & Schema Standard | Target URI |
| :--- | :--- | :--- | :--- |
| **Skill Definition** | [`SKILL.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/SKILL.md) | Level 1/2 Antigravity skill router, command dispatcher, and error recovery. | [`skills/showcase/SKILL.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/SKILL.md) |
| **Automation Scripts** | [`detect_workspace.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/detect_workspace.js)<br>[`init_workspace.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/init_workspace.js)<br>[`compile_resume.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/compile_resume.js)<br>[`publish_case_study.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/publish_case_study.js) | Non-destructive project detector, career hub injector, resume compiler, and case study sync. | [`skills/showcase/scripts/`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/scripts/) |
| **Data Schemas & Rules** | [`config-schema.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/config-schema.json)<br>[`profile-schema.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/profile-schema.json)<br>[`project-schema.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/project-schema.json)<br>[`ats-rules.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/ats-rules.md) | JSON schemas for configuration, career profile, project case studies, and ATS compliance guidelines. | [`skills/showcase/references/`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/references/) |
| **Document Templates** | [`profile_template.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/profile_template.md)<br>[`resume_template.html`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/resume_template.html)<br>[`pitch_template.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/pitch_template.md) | YAML frontmatter career profile, single-column vector PDF template, and 80-word pitch note template. | [`skills/showcase/templates/`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/) |
| **Starter Portfolio** | [`index.html`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/index.html)<br>[`theme.css`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/styles/theme.css)<br>[`layout.css`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/styles/layout.css)<br>[`app.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/scripts/app.js)<br>[`projects.json`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/data/projects.json) | Standalone, zero-build semantic HTML5 starter portfolio with 4 WCAG AA/AAA OKLCH visual presets. | [`templates/starter-portfolio/`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/templates/starter-portfolio/index.html) |
| **Test Suite** | [`core.test.js`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/tests/core.test.js) | 15 deterministic unit and integration tests covering AC-001 through AC-015. | [`skills/showcase/tests/`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/showcase/tests/core.test.js) |

---

## 5. Downstream Subsystems & Directory Map

```text
showcase/
├── README.md                                          # Human-friendly intro, command reference & quickstart
├── CHANGELOG.md                                       # SemVer 2.0.0 & Keep a Changelog 1.1.0 release history
├── package.json                                       # Package manifest and test scripts
├── docs/
│   ├── adr/
│   │   └── 0001-showcase-toolkit-architecture.md      # Dual-engine architecture ADR
│   ├── plans/
│   │   └── showcase_implementation_plan.md            # Multi-agent master implementation plan
│   ├── specs/
│   │   ├── index.md                                   # This specification index (≤ 100 lines)
│   │   ├── showcase-ux-blueprint.md                   # UX strategy, personas, and FSM copy
│   │   ├── showcase-visual-presets.md                 # 4 visual themes and responsive wireframes
│   │   └── showcase-system-architecture.md            # C4 topology and TypeScript data contracts
│   └── testing/
│       └── showcase-bvp.md                            # Acceptance criteria and verification plan
└── skills/
    └── showcase/
        ├── SKILL.md                                   # Antigravity skill router and commands
        ├── package.json                               # Skill dependency manifest
        ├── references/                                # JSON schemas and ATS rules
        ├── scripts/                                   # Automation and compilation scripts
        ├── templates/                                 # Starter templates and greenfield portfolio
        └── tests/                                     # Vitest & Node test suites
```
