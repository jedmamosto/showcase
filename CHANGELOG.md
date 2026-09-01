# Changelog

All notable changes to the **Showcase** personal portfolio and career command center toolkit are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-01

### Added
- **Dual-Engine Architecture**: Integrated public showcase portfolio engine with private career center (`.agents/career/`).
- **Workspace Inspector (`detect_workspace.js`)**: Non-destructive project inspector detecting Next.js, Astro, Vite, and static HTML workspaces.
- **Workspace Initializer (`init_workspace.js`)**: Non-destructive setup supporting Path A (existing site connection) and Path B (greenfield starter) with automated `.bak.<timestamp>` safety backups.
- **Resume & Pitch Compiler (`compile_resume.js`)**: Single-page vector PDF compiler, plain-text ATS copy buffer generator, and 80-word founder pitch note generator.
- **Case Study Sync Engine (`publish_case_study.js`)**: Structured case study publisher converting raw notes into validated markdown and syncing to JSON data adapters.
- **Greenfield Starter Portfolio (`starter-portfolio/`)**: Zero-dependency semantic HTML5/CSS starter portfolio with responsive layout, dynamic project rendering, and theme toggling.
- **4 Visual Style Presets**: Built *Warm Editorial*, *Clean Minimal*, *Bold Creative*, and *Dark Studio* presets using semantic OKLCH CSS tokens with WCAG AA/AAA contrast compliance.
- **Antigravity Skill Definition (`SKILL.md`)**: Full interactive command router (`/showcase`, `/showcase init`, `/showcase resume`, `/showcase pitch`, `/showcase publish`, `/showcase hunt`, `/showcase polish`, `/showcase profile`, `/showcase preview`) with CEFR A2 user dialogues and NN/g 3-part error recovery patterns.
- **Data Schemas & Reference Rules**: JSON schemas for `config-schema.json`, `profile-schema.json`, `project-schema.json`, and comprehensive ATS compliance guide (`ats-rules.md`).
- **Automated Verification Suite**: 15 deterministic unit and integration tests (`core.test.js`) verifying framework detection, zero-deletion safety, career injection, resume compilation, and publishing.
- **Public Documentation Hub**: Clean 2-tier documentation organized into User Guides (`docs/guides/` in CEFR A2 English) and Developer Reference (`docs/reference/` in ASD-STE100) with a master router ([`docs/index.md`](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/index.md)).
- **Dual-Language Standard & Rendering Integrity**: Verified CEFR A2 English across user-facing guides and ASD-STE100 across developer specs; patched Mermaid diagram parsing strings for universal cross-platform rendering.

[1.0.0]: file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/
