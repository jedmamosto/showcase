# User Guide: Private Career Center & Resumes

**Audience**: All Users | **Standard**: CEFR A2 Plain English | **Line Budget**: ≤ 150 lines  
**Documentation Hub**: [Documentation Index](file:///c:/Users/ASUS/Documents/VSCode/jedmamosto-portfolio/showcase/docs/index.md)

---

## 1. How the Private Career Center Works

Your career center lives in a private folder on your computer:

```text
your-project/.agents/career/
├── profile.md             # Your master work history and skills
├── projects/              # Structured project stories and case studies
└── applications/          # Resumes and pitch notes generated for each job
```

> **100% Privacy**: These files stay on your computer. Private notes in `.agents/career/` are never published to your public website unless you explicitly add them.

---

## 2. Tailoring a Resume for a Job

When you find a job you want to apply for, run:

```text
/showcase resume [paste job link or job text]
```

### What Showcase Generates:
1. **1-Page Vector PDF Resume**: Clean, professional single-page PDF with perfect margins.
2. **ATS Plain-Text Copy**: Formatted plain-text version optimized for automated hiring scanners (Ashby, Greenhouse, Lever, Workday).
3. **80-Word Founder Note**: A short, friendly introduction message highlighting your best relevant wins.

Files are saved into a dedicated folder: `.agents/career/applications/<company-name>/`.

---

## 3. Writing an Introduction Email or Pitch

To contact a founder, hiring manager, or client directly, run:

```text
/showcase pitch [Contact Name]
```

The AI reads your top achievements and drafts an **80-word introduction email**:
- **Line 1**: Friendly greeting and why you are reaching out.
- **Line 2**: One concrete achievement with metrics that matches their company.
- **Line 3**: A simple, low-pressure question to start a conversation.

---

## 4. Updating Your Master Profile

To add new accomplishments or update your contact information:
- Run `/showcase profile` to update your notes with a guided assistant, or
- Open `.agents/career/profile.md` and edit your history directly.
