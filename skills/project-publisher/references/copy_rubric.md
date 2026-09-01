# Copy & Narrative Rubric: Anti-Slop & Quality Standards

When authoring or drafting a `CaseStudy` for your portfolio, adhere strictly to the following technical copywriting and anti-slop guidelines:

---

## 1. Plain Human Language (CEFR A2 & ASD-STE100)

- **Plain Words Over Jargon**: Avoid robotic, academic, or corporate buzzwords. Write so anyone can understand quickly.
  - ❌ *Robotic*: *"Engineered deterministic AST frontmatter parser with zero-custody telemetry synchronization."*
  - ✅ *Plain*: *"Built a smart reader that updates your website safely without breaking existing files."*
- **Sentence Length**: Keep every sentence strictly under 20 words.
- **Active Voice**: Use active verbs (e.g. "We built", "It saves", "You run").
- **Zero AI Slop**: Never use *"seamless"*, *"cutting-edge"*, *"revolutionary"*, *"blazing fast"*, *"robust"*, *"effortless"*, *"groundbreaking"*, *"empower"*, *"spearhead"*, or *"streamline"*.
- **Anchor with Real Facts**: State exact test counts, file counts, real numbers, or plain mechanisms.

---

## 2. Structured Section Rules & Word Budgets

### A. Summary (1–2 Sentences, ≤40 Words)
- Explain the application, target users, and primary problem solved.

### B. Challenge vs. Solution Split
- **`challenge`** (1 paragraph, 30–60 words): Detail the concrete friction (e.g. manual spreadsheets, tight deadlines, fraud vulnerabilities).
- **`solution`** (1 paragraph, 30–60 words): Describe the technical architecture, data pipelines, or UI systems engineered to resolve the friction.

### C. Metrics Formatting (`ProjectMetric[]`)
- Exactly 2–4 verified metrics.
- Each metric must include:
  - `value`: Concise number or headline stat (e.g. `"100%"`, `"43/43"`, `"$150K"`, `"Sub-150ms"`).
  - `label`: 2–4 word title (e.g. `"Direct Settlement"`, `"Automated Tests"`, `"Tactile Checkout"`).
  - `detail`: 1-sentence explanation anchoring the physical proof.

### D. Architecture Highlights (`ArchitectureHighlight[]`)
- Exactly 2–3 items.
- Focus on:
  1. **Data Modeling & Validation** (e.g. Prisma models, Supabase RLS, Zod schemas).
  2. **API & Integration Boundary** (e.g. webhook pipelines, payment adapters, Canvas renderers).
  3. **Performance & Ergonomics** (e.g. local state management, sub-150ms latency, design tokens).

### E. AI Workflow Narrative (1–2 Sentences, ≤40 Words)
- Credit how agentic workflows, multi-agent DAGs, or TDD cycles accelerated delivery.
