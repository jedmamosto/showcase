# Job Matching & Scoring Rubric

## 1. The 0–100% Scoring Scale
- **90–100% (High Priority)**: Full-Time Remote Product Engineer (40 hrs/wk), high-ticket Contract MVP builds, or async-first engineering roles. Tech stack directly matches candidate's core competencies. Experience requirements align with candidate profile.
- **70–89% (Moderate)**: Solid product engineering roles with minor stack deviations, fractional terms, or requiring slight shift tailoring.
- **<70% (Filtered Out)**: Violates hard disqualifiers or fails legitimacy audit.

## 2. Hard Disqualifiers (Automatic Penalty <70%)
- **Mandatory Synchronous Midnight / Graveyard Shifts**: Roles demanding rigid 8-hour live desk shifts during unnatural hours. Roles must offer async flexibility or reasonable overlap.
- **Experience Bound**: Roles strictly requiring significantly more experience than candidate's profile level.
- **Location Constraints**: Mandatory physical on-site requirements outside candidate's region without relocation/sponsorship.
- **Tech Anti-Patterns**: Roles focused purely on legacy maintenance, algorithmic trivia, or unrelated low-level languages.
- **Legitimacy Failure**: Listings scoring < 3 on [legitimacy_audit.md](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/skills/job-hunter/references/legitimacy_audit.md) or dead/closed status.

## 3. Compensation Confidence Tiering
- **Tier 1 (High Confidence)**: Transparent guaranteed base salary or hourly rate published in job post.
- **Tier 2 (Medium Confidence)**: Industry-standard compensation range dependent on leveling/experience.
- **Tier 3 (Low Confidence / Flagged)**: Unstated compensation, "competitive salary" placeholder, or equity-only with zero guaranteed pay.

## 4. Live Link Integrity & Direct Endpoint Standard
- Extract **Direct Deep Permalinks Only** (Ashby, Greenhouse, Lever, WorkAtAStartup, Indeed direct `viewjob?jk=...` URLs).
- Do not link to generic `/careers` hubs, company homepages, or bare aggregator domains.
- Every URL must contain the specific job UUID, posting ID, or application slug endpoint.
- Verify the active status via `read_url_content` before finalizing the score.
