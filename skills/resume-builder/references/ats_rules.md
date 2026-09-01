# ATS Parsing Rules & Layout Guidelines

This reference defines platform-specific parsing mechanics, failure modes, and layout constraints for modern Applicant Tracking Systems (Ashby, Greenhouse, Lever, Workday, Indeed).

---

## 1. ATS Platform Parsing Engine Matrices

| ATS Platform | Ingestion Engine | Critical Parsing Trap | Mandatory Formatting Rule |
| :--- | :--- | :--- | :--- |
| **Ashby** | DOM / PDF text-layer extraction with fuzzy entity mapping. | Multi-column layouts and float boxes cause interleaved text lines. | Use strict single-column flow with standard section headers. |
| **Greenhouse** | Sequential text parser. Heavily penalizes HTML tables. | Tables interleave cell contents into garbled chronological streams. | Use semantic heading hierarchy (`h1`, `h2`, `h3`, `ul`, `li`) without tables. |
| **Lever** | Stream parser with automatic URL and social link extraction. | Hidden link layers or missing text URLs cause blank link records. | Include explicit plain text or semantic markdown URLs. |
| **Workday** | Legacy OCR / Text hybrid parser with rigid field mapping. | Headers and footers are ignored; icons create OCR noise artifacts. | Place contact data in main body top; remove icons and graphic elements. |
| **Indeed** | Form field auto-fill + single PDF upload + custom employer questions. | Textarea char limits truncate long cover letters; styled text loses formatting. | Use concise plain-text bullets (<250 words) for cover notes; upload 1-page vector PDF. |

---

## 2. Universal Layout & Typography Invariants

### 2.1 Page Budget & Density
- **Strict 1-Page Rule**: Target word count is 450–600 words. Never exceed 1 page.
- **Section Order**:
  1. Header: Full Name, Role Subtitle, Location, Remote Overlap, Email, Portfolio, GitHub, LinkedIn.
  2. Professional Summary: 2–3 sentences defining core strengths and tech stack.
  3. Technical Skills: Categorized skill taxonomy (Domain, Technical & Architecture, Tools & Environments).
  4. Professional Experience: Chronological reverse listing with Google XYZ impact bullets.
  5. Featured Projects & Proof: Selected proof-anchored projects matching the target job description.
  6. Education & Credentials: Degree, university, certifications, and verified achievements.

### 2.2 Typography & CSS Print Specifications
- **Body Font Size**: 9.5pt to 10.5pt with line-height 1.35.
- **Heading Font Size**: 12pt to 14pt (Bold, uppercase or title case).
- **Margins**: Exactly 10mm–12mm (approx. 0.4in–0.5in) on all sides.
- **CSS Page Rules**:
  ```css
  @page {
    size: letter portrait;
    margin: 0.4in 0.45in;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-break-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
  ```

---

## 3. The Anti-Pattern Checklist (Forbidden Elements)

| Forbidden Element | Why It Fails ATS Parsers | Compliant Alternative |
| :--- | :--- | :--- |
| **Multi-Column Sidebars** | Parsers read left-to-right across columns, mixing job titles with skills. | Single-column linear layout. |
| **Data Tables for Layout** | Screen readers and parsers read column headers as body text. | Flexbox/CSS flow with semantic list tags (`<ul>`, `<li>`). |
| **Text Inside Images / Canvas** | OCR fails or misinterprets fonts, leaving candidate record blank. | 100% Unicode selectable true-type text layer. |
| **Header / Footer Contact Info** | Workday and Taleo strip running page headers/footers completely. | Place contact information inside the top body flow. |
| **Progress Bars / Star Ratings** | Parsers cannot interpret visual skill rating bars (e.g. 5/5 stars). | Categorized text skill lists. |
| **Non-Standard Date Formats** | Parsers fail on ambiguous dates like `03/04/22` (March 4 vs April 3). | Use standard `Mon YYYY – Mon YYYY` (e.g. `May 2025 – Aug 2026`). |

---

## 4. Multi-Modal Output Formats

### Output 1: 1-Page Vector PDF
- Generated from semantic HTML/CSS template.
- Verified 1-page boundary with zero page-2 overflow.
- Selectable Unicode text layer confirming full copy-paste fidelity.

### Output 2: ATS Plain-Text Buffer
- Pure text buffer without markdown tables, HTML tags, or decorative ASCII lines.
- Optimized for direct copy-pasting into ATS web form textarea fields.

### Output 3: 80-Word Founder DM / Pitch Note
- High-signal async outreach message tailored to the hiring founder or engineering lead.
- Highlights 1 relevant case study with verified metric and direct portfolio link.
