# Security Policy

**Showcase** takes the security and privacy of user career data and codebases seriously.

---

## 1. Supported Versions

Security updates are applied to the following active release branches:

| Version | Supported          |
| :---    | :---               |
| `1.0.x` | :white_check_mark: |
| `< 1.0` | :x:                |

---

## 2. Core Security Invariants

1. **Zero-Deletion Safety**: The Showcase automation engine is designed to never delete or overwrite user source files without creating timestamped backups (`.bak.<timestamp>`).
2. **Local-First Privacy**: Master career profiles (`.agents/career/profile.md`) and tailored job application files (`.agents/career/applications/`) are strictly local and are never transmitted to external cloud servers.
3. **Zero Untyped Dependencies**: Core automation scripts rely entirely on standard Node.js APIs (`node:fs`, `node:path`, `node:test`) to minimize supply chain attack surfaces.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or unexpected file modification bug:

1. **Do NOT open a public GitHub issue**.
2. Submit a private vulnerability report via **GitHub Security Advisories**:
   - Go to [Security -> Report a vulnerability](https://github.com/jedmamosto/showcase/security/advisories/new).
   - Alternatively, email: `jedmamosto@gmail.com` with the subject `[SECURITY] Showcase Vulnerability Report`.
3. Provide:
   - Steps to reproduce the vulnerability.
   - Operating system and Node.js version.
   - Sample repository structure (if relevant).

### Response SLA
- **Initial Response**: Within 48 hours.
- **Triage & Patch**: Within 5 business days for critical issues.
