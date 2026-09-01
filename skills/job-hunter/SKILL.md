---
name: job-hunter
description: >-
  Generic opportunity scout and pitch generator.
  Reads target roles and background from .agents/career/profile.md and .agents/career/projects/.
  Evaluates postings against ghost job criteria, scores technical match, and formats STAR+R pitches.
  Saves verified opportunities to .agents/career/job_leads.md.
  Make sure to use this skill whenever the user mentions job hunting, finding jobs,
  applying to jobs, searching Indeed or ATS boards, evaluating job posts, drafting pitches,
  milestone proposals, cold outreach, remote engineering roles, or sourcing job leads.
---

# Job Hunter: Opportunity Scout & Pitch Generator

This skill coordinates the end-to-end workflow for finding, evaluating, and pitching for remote engineering roles and contract MVP builds.

---

## 1. Operating Invariants & Guiding Questions

- **Why This Skill Exists**: Prevents wasted effort on dead jobs, ghost listings, and poor technical fits. Enforces verified deep permalinks and STAR+R proof matching.
- **ASD-STE100 Language Invariant**: Write all instructions in active voice. Keep sentences strictly under 20 words.
- **Positive-Negative Rule Pairing**: Every constraint must pair a forbidden action with a required action (`DO NOT ... ALWAYS ...`).
- **Guiding Self-Questions**:
  - _Pre-Flight_: *"Did I check `.agents/career/job_leads.md` to avoid duplicate companies and roles?"*
  - _In-Flight_: *"Did the listing pass the Dead Job and Legitimacy Audit with score >= 3?"*
  - _Post-Flight_: *"Did I verify the deep permalink with `read_url_content` before showing the Lead Card?"*

---

## 2. Context Ingestion & Proof Loading

Load candidate context before searching:
- **Personal Profile**: Read `.agents/career/profile.md` for target roles, skills, and constraints.
- **Case Studies**: Read `.agents/career/projects/*.md` for proven accomplishments and metrics.
- **Lead Backlog**: Read `.agents/career/job_leads.md` to prevent duplicate recommendations.
- **Legitimacy Audit**: Read [references/legitimacy_audit.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/legitimacy_audit.md).
- **Scoring Rubric**: Read [references/scoring_rubric.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/scoring_rubric.md).
- **Proof Matrix**: Read [references/proof_matrix.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/proof_matrix.md).
- **Pitch Templates**: Read [references/pitch_templates.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/pitch_templates.md).

---

## 3. Discovery Channels & Portal Standard

Search approved direct ATS and verified job endpoints:
- **Direct ATS Boards**: Ashby, Greenhouse, Lever, WorkAtAStartup, YC Work at a Startup.
- **Indeed Endpoints**: Search `indeed.com` and regional job portals for direct remote and local postings.
- **Verified Company Endpoints**: Search `company.com/careers/job-slug`.

### Direct Deep Permalink & Verification Protocol
- **DO NOT** output generic career homepages, base company boards, or paywalled aggregators. **ALWAYS** extract direct deep application permalinks (e.g. `jobs.ashbyhq.com/org/UUID`, `indeed.com/viewjob?jk=XYZ`).
- **DO NOT** extrapolate fake UUIDs or synthesize URLs. **ALWAYS** resolve verified endpoints.
- **DO NOT** present unverified links. **ALWAYS** run `read_url_content` to confirm HTTP 200 and active apply button.
- **DO NOT** recommend existing backlog entries. **ALWAYS** omit duplicate companies or roles.

---

## 4. Screening, Legitimacy & Scoring Pipeline

Evaluate leads through a 3-step filter:

1. **Dead Job & Liveness Screen**:
   - Check if posting is expired or closed. Discard immediately if closed.
2. **Legitimacy & Ghost Job Audit**:
   - Audit listing against [references/legitimacy_audit.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/legitimacy_audit.md). Discard listings scoring < 3.
3. **Requirement Match & Comp Scoring**:
   - Score against [references/scoring_rubric.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/scoring_rubric.md). Enforce hard disqualifiers (rigid graveyard shifts, excessive experience bounds, onsite constraints).

---

## 5. STAR+R Pitch Generation & Application Kits

Generate proof-anchored pitches tailored to the opportunity:
- **Proof Anchor**: Map the role domain to STAR+R evidence from `.agents/career/projects/` and [references/proof_matrix.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/proof_matrix.md).
- **Template Selection**: Apply the matching template from [references/pitch_templates.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/pitch_templates.md) (Founder DM, MVP Proposal, ATS Cover Letter, Indeed Note).
- **Application Kits**: Coordinate with `resume-builder` to store all tailored materials under `.agents/career/applications/<company-slug>-<role-slug>/`.

---

## 6. Gated Backlog Synchronization

- Format verified leads using [templates/lead_card_template.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/templates/lead_card_template.md).
- Link compiled application assets to `.agents/career/applications/<company-slug>-<role-slug>/`.
- **DO NOT** append to backlog automatically. **ALWAYS** ask for user confirmation before writing to `.agents/career/job_leads.md`.
