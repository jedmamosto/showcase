# Copy & Narrative Rubric: Anti-Slop & Quality Standards

When authoring or drafting a `CaseStudy` for your portfolio, adhere strictly to the following technical copywriting and anti-slop guidelines:

---

## 1. Zero-Hedging & Proof-First Claims

- **Banned Adjectives**: Never use *"seamless"*, *"cutting-edge"*, *"revolutionary"*, *"blazing fast"*, *"robust"*, *"effortless"*, or *"groundbreaking"*.
- **Anchor with Concrete Mechanisms**: State the exact physical mechanism, algorithm, or number.
  - ❌ *Bad*: *"A revolutionary loan system providing ultra-fast calculation."*
  - ✅ *Good*: *"Institutional loan engine replacing manual spreadsheets with CPA-validated amortization algorithms."*
- **ASD-STE100 Plain Language**: Keep sentences under 20 words. Use active voice. State technical facts plainly.

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
