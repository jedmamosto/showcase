# Job Legitimacy & Ghost Job Audit Protocol

Use this protocol to detect ghost jobs, dead postings, and high-risk listings before scoring or pitching.

---

## 1. Dead Job & Liveness Screen (Fail-Closed)
- **Check Status**: Verify the page returns HTTP 200 and displays an active apply button.
- **Closed Markers**: If text contains "No longer accepting applications", "Job closed", or "Expired", discard the lead immediately.

---

## 2. Ghost Job & Legitimacy Scoring (0–5 Signal Score)

| Criterion | High Signal (1 Pt) | Red Flag (0 Pt / Penalty) |
| :--- | :--- | :--- |
| **Posting Freshness** | Posted < 30 days ago with active recruitment. | Reposted > 90 days or evergreen listing with no hiring manager activity. |
| **JD Specificity** | Concrete tech stack, sprint goals, deliverables, and team topology. | Generic buzzwords ("rockstar", "fast-paced") with zero architectural detail. |
| **Org Stability** | Active company, healthy hiring pulse, clear funding or revenue. | Recent mass layoffs, sudden executive turnover, or frozen hiring freeze rumors. |
| **Role Authenticity** | Clear FTE or fixed-term contract with standard labor protections. | "Contractor disguised as employee" (full-time hours, no PTO, no equity, high liability). |
| **Direct Contact** | Clear hiring manager, founder, or ATS application endpoint. | Anonymous recruiter agency or third-party data-harvesting form. |

---

## 3. Legitimacy Tiers
- **4–5 Points (Verified Opportunity)**: High confidence. Proceed to scoring and pitch generation.
- **3 Points (Review Needed)**: Moderate risk. Flag warning note in the Lead Card.
- **< 3 Points (Probable Ghost Job / Scam)**: Filter out. Do not present or add to backlog.
