# Architecture Reference: Dual-Engine System

**Standard**: ASD-STE100 & Strict TypeScript | **Line Budget**: ≤ 150 lines  
**Documentation Hub**: [Documentation Index](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/index.md)

---

## 1. System Topology

Showcase separates public presentation from private career data using a **Dual-Engine Architecture**:

```mermaid
flowchart TD
    subgraph Engine1 ["Engine 1: Public Showcase"]
        Site["Personal Portfolio (Next.js / Astro / Static HTML)"]
        Adapter["Website Data Adapter (projects.json / content collections)"]
    end

    subgraph Engine2 ["Engine 2: Private Career Center"]
        Profile[("profile.md (Master Profile)")]
        Projects[("projects/*.md (Case Studies)")]
        Applications[("applications/<slug>/ (Tailored Kits)")]
    end

    subgraph Automation ["Automation Scripts (scripts/)"]
        Detect["detect_workspace.js"]
        Init["init_workspace.js"]
        Compile["compile_resume.js"]
        Publish["publish_case_study.js"]
    end

    Detect --> Init
    Init --> Profile
    Profile --> Compile --> Applications
    Projects --> Publish --> Adapter --> Site
```

---

## 2. Non-Destructive Invariant

The setup engine guarantees zero data loss on existing repositories:
- **No Overwrites**: Original source files are never deleted or renamed.
- **Safety Backups**: Before modifying any existing configuration or project list, the engine creates a timestamped `.bak.<YYYYMMDD_HHMMSS>` backup file.
- **Isolated Career Directory**: All career data is stored strictly in `.agents/career/`.

---

## 3. Directory Structure

```text
showcase/
├── README.md                      # Public overview and quickstart
├── CHANGELOG.md                   # Semantic Versioning release notes
├── package.json                   # Dependencies and test commands
├── docs/                          # Guides and technical reference
│   ├── index.md                   # Master documentation index
│   ├── guides/                    # User guides (CEFR A2)
│   └── reference/                 # Developer reference (ASD-STE100)
└── skills/showcase/               # Antigravity skill package
    ├── SKILL.md                   # Command router and triggers
    ├── references/                # JSON schemas and ATS compliance rules
    ├── scripts/                   # Automation scripts
    └── templates/                 # Templates and starter portfolio
```
