# Contributing to Showcase

Thank you for contributing to **Showcase**! We welcome bug fixes, visual style presets, framework adapters, and documentation improvements.

---

## 1. Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/CODE_OF_CONDUCT.md).

---

## 2. Development Setup

Showcase uses native Node.js (`>= 18.0.0`) with zero external runtime dependencies.

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/showcase.git
cd showcase

# 2. Run the test suite
npm test
```

---

## 3. Pull Request Guidelines

1. **Branch Naming**:
   - `feat/feature-name` (New features or adapters)
   - `fix/bug-description` (Bug fixes)
   - `docs/doc-update` (Documentation changes)
2. **Commit Conventions**:
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(scope): add SvelteKit website adapter`
   - `fix(detector): handle missing package.json safely`
   - `docs(guides): clarify quickstart interview flow`
3. **Verification**:
   - All tests must pass: `npm test`.
   - All documentation links must resolve to real files (`file:///`).
   - Specification files in `docs/` must remain under **150 lines**.
4. **Submitting**:
   - Open a Pull Request against the `main` branch.
   - Fill out the [Pull Request Template](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/.github/pull_request_template.md).
   - Ensure the CI workflow passes.
