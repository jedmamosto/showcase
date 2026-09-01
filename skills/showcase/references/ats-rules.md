# ATS Parsing Rules & Resume Optimization Reference

This document outlines structural, typographical, and semantic requirements for Applicant Tracking Systems (ATS), specifically targeting modern platforms: **Ashby**, **Greenhouse**, **Lever**, and **Workday**.

---

## 1. Core Architectural Parsing Principles

### 1.1 Single-Column Strict Layout
- Modern ATS parsers (especially Ashby and Greenhouse OCR) parse documents top-to-bottom, left-to-right.
- **Rule**: NEVER use multi-column layouts, sidebars, floating text frames, or nested tables.
- Multi-column structures cause line interleaving (where text from column 1 mixes with text from column 2).

### 1.2 Header & Footer Zone Isolation
- ATS parsers often ignore content in standard Word/PDF header and footer margins.
- **Rule**: Place candidate contact information (Name, Email, Location, Links) inside the main body flow at the very top.

### 1.3 Machine-Readable Standard Section Headings
Use standard, recognized uppercase section titles. ATS tokenizers map these directly to semantic database fields:
- `PROFESSIONAL SUMMARY` (or `SUMMARY`)
- `CORE COMPETENCIES` (or `SKILLS`)
- `PROFESSIONAL EXPERIENCE` (or `EXPERIENCE` / `WORK EXPERIENCE`)
- `FEATURED PROJECTS` (or `PROJECTS` / `TECHNICAL CASE STUDIES`)
- `EDUCATION & CREDENTIALS` (or `EDUCATION`)
- `CERTIFICATIONS & AWARDS` (optional)

---

## 2. Platform-Specific Parser Characteristics

| ATS Platform | Parsing Engine / Behavior | Critical Optimization |
| :--- | :--- | :--- |
| **Ashby** | Uses advanced LLM + structured AST extraction. Sensitive to role titles and quantified project impact. | Keep chronological order clear; bold company name and role title on distinct lines. |
| **Greenhouse** | Converts PDF/Docx to plain text. Strips all custom vector graphics and icons. | Use standard ASCII bullet points (`•` or `-`). Avoid SVG icons before email/phone. |
| **Lever** | Parses contact info and skills aggressively into tags. | List hard technical skills in a dedicated comma-separated or bulleted `CORE COMPETENCIES` block. |
| **Workday** | Legacy OCR parser. High failure rate with complex styling, non-standard fonts, or tables. | Maximum simplicity: strict linear flow, standard system fonts (Arial, Inter, Calibri, Georgia), standard dates. |

---

## 3. Formatting & Typography Standards

### 3.1 Date Formats
- Always use standard machine-parsable date formats:
  - `Month Year – Present` (e.g. `March 2024 – Present` or `03/2024 – Present`)
  - `YYYY – YYYY` (e.g. `2022 – 2024`)
- Avoid vague date terms like "recently", "current", or "summer 2023".

### 3.2 Bullet Point Formula (Google XYZ Formula)
Every achievement bullet must adhere to the high-impact structure:
> *"Accomplished **[X]**, as measured by **[Y]**, by doing **[Z]**."*

- **Bad**: "Responsible for improving checkout flow."
- **Good**: "Increased checkout conversion rate by 14.2% (+$180k ARR) by redesigning mobile payment step with 1-click Apple Pay and reducing friction."

### 3.3 Plain-Text (ATS Text Buffer) Formatting Rules
When compiling `.txt` fallback files:
1. Contact block centered or left-aligned at top.
2. Distinct uppercase section headers separated by double newlines.
3. Use `- ` or `* ` for list bullets.
4. No embedded HTML tags or markdown syntax in the plain-text buffer.

---

## 4. Prohibited Elements Checklist (Zero-Tolerance)
- ❌ No floating text boxes or shape containers.
- ❌ No HTML/CSS tables for layout.
- ❌ No graphical skill rating bars (e.g. "React: ★★★★☆" or "90%").
- ❌ No photos, headshots, or graphic illustrations.
- ❌ No decorative font files with non-standard unicode glyph mappings.
- ❌ No text lighter than WCAG AA contrast ratio (minimum 4.5:1 on white).
