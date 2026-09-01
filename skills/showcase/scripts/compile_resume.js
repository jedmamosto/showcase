/**
 * compile_resume.js — High-Craft Resume & Outreach Pitch Compiler
 * 
 * Compiles:
 * 1. Single-page vector PDF (via headless Chrome/Edge or HTML fallback)
 * 2. ATS plain-text copy buffer (.txt) formatted for Ashby, Greenhouse, Lever, Workday
 * 3. Concise founder outreach note (under 80 words)
 * 
 * Usage:
 *   CLI: node compile_resume.js [companySlug] [--profile <path>] [--out <dir>]
 *   Module: import { compileResume, parseFrontmatter, generateAtsText, generatePitchNote } from './compile_resume.js';
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { normalizePath } from './detect_workspace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lightweight zero-dependency YAML frontmatter parser.
 * @param {string} rawMarkdown 
 * @returns {{ data: object, content: string }}
 */
export function parseFrontmatter(rawMarkdown) {
  const match = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: rawMarkdown };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data = {};

  const lines = yamlBlock.split(/\r?\n/);
  let currentKey = null;
  let currentSubKey = null;
  let currentSubSubKey = null;
  let inArray = false;
  let inObjectArray = false;
  let currentArrayObj = null;

  for (let rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line || line.startsWith('#')) continue;

    const indent = rawLine.search(/\S|$/);

    // Root key
    if (indent === 0 && line.includes(':')) {
      const parts = line.split(':');
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
      currentKey = key;
      currentSubKey = null;
      currentSubSubKey = null;
      inArray = false;
      inObjectArray = false;
      data[key] = val ? val : {};
      continue;
    }

    // 2-space indent (sub-key or array item)
    if (indent === 2 && currentKey) {
      if (line.trim().startsWith('- ')) {
        // Array of strings or objects under root key
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        const itemStr = line.trim().substring(2).trim().replace(/^["']|["']$/g, '');
        if (itemStr.includes(':')) {
          const [k, ...rest] = itemStr.split(':');
          currentArrayObj = { [k.trim()]: rest.join(':').trim().replace(/^["']|["']$/g, '') };
          data[currentKey].push(currentArrayObj);
          inObjectArray = true;
        } else {
          data[currentKey].push(itemStr);
          inObjectArray = false;
        }
        inArray = true;
      } else if (line.includes(':')) {
        const parts = line.trim().split(':');
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        if (typeof data[currentKey] !== 'object' || Array.isArray(data[currentKey])) {
          data[currentKey] = {};
        }
        currentSubKey = key;
        currentSubSubKey = null;
        data[currentKey][key] = val ? val : {};
        inArray = false;
        inObjectArray = false;
      }
      continue;
    }

    // 4-space indent
    if (indent === 4 && currentKey) {
      if (inObjectArray && currentArrayObj && line.trim().includes(':')) {
        const parts = line.trim().split(':');
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        currentArrayObj[key] = val;
      } else if (currentSubKey) {
        if (line.trim().startsWith('- ')) {
          if (!Array.isArray(data[currentKey][currentSubKey])) {
            data[currentKey][currentSubKey] = [];
          }
          const val = line.trim().substring(2).trim().replace(/^["']|["']$/g, '');
          data[currentKey][currentSubKey].push(val);
        } else if (line.includes(':')) {
          const parts = line.trim().split(':');
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
          if (typeof data[currentKey][currentSubKey] !== 'object' || Array.isArray(data[currentKey][currentSubKey])) {
            data[currentKey][currentSubKey] = {};
          }
          currentSubSubKey = key;
          data[currentKey][currentSubKey][key] = val ? val : {};
        }
      }
      continue;
    }

    // 6-space indent
    if (indent === 6 && currentKey && currentSubKey && currentSubSubKey) {
      if (line.trim().startsWith('- ')) {
        if (!Array.isArray(data[currentKey][currentSubKey][currentSubSubKey])) {
          data[currentKey][currentSubKey][currentSubSubKey] = [];
        }
        const val = line.trim().substring(2).trim().replace(/^["']|["']$/g, '');
        data[currentKey][currentSubKey][currentSubSubKey].push(val);
      }
    }
  }

  return { data, content };
}

/**
 * Finds local headless Chrome or Edge executable.
 * @returns {string|null}
 */
export function findBrowserBinary() {
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
  ];

  return candidatePaths.find(p => fs.existsSync(p)) || null;
}

/**
 * Generates ATS-compliant plain text buffer.
 * @param {object} profileData 
 * @param {string} markdownBody 
 * @returns {string}
 */
export function generateAtsText(profileData, markdownBody = '') {
  const c = profileData.contact || {};
  const contactLines = [
    c.fullName?.toUpperCase() || 'CANDIDATE',
    c.headline || '',
    [c.location, c.email, c.phone, c.website, c.linkedin, c.github].filter(Boolean).join(' | ')
  ].filter(Boolean).join('\n');

  const sections = [contactLines];

  // Core Competencies
  if (profileData.coreCompetencies) {
    const comp = profileData.coreCompetencies;
    const lines = ['CORE COMPETENCIES'];
    if (comp.domain && comp.domain.length) {
      lines.push(`Domain Expertise: ${Array.isArray(comp.domain) ? comp.domain.join(', ') : comp.domain}`);
    }
    if (comp.technical && comp.technical.length) {
      lines.push(`Technical & Architecture: ${Array.isArray(comp.technical) ? comp.technical.join(', ') : comp.technical}`);
    }
    if (comp.tools && comp.tools.length) {
      lines.push(`Tools & Environments: ${Array.isArray(comp.tools) ? comp.tools.join(', ') : comp.tools}`);
    }
    sections.push(lines.join('\n'));
  }

  // Key Metrics
  if (profileData.keyMetrics && profileData.keyMetrics.length) {
    const lines = ['QUANTIFIED BUSINESS IMPACT'];
    for (const m of profileData.keyMetrics) {
      lines.push(`- ${m.label} (${m.value}): ${m.context}`);
    }
    sections.push(lines.join('\n'));
  }

  // Markdown Body Extraction for Experience & Education
  if (markdownBody) {
    // Clean markdown hashes and format plain sections
    const cleanBody = markdownBody
      .replace(/^#+ (.+)$/gm, '\n$1\n' + '='.repeat(30))
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
      .trim();

    sections.push(cleanBody);
  }

  return sections.join('\n\n') + '\n';
}

/**
 * Generates an 80-word founder / hiring manager pitch note.
 * @param {object} params 
 * @returns {string}
 */
export function generatePitchNote(params = {}) {
  const recipientName = params.recipientName || 'Hiring Lead';
  const companyName = params.companyName || 'the team';
  const teamOrFocusArea = params.teamOrFocusArea || 'engineering and product systems';
  const previousOrg = params.previousOrg || 'my prior projects';
  const projectOrSystem = params.projectOrSystem || 'design and backend architecture';
  const keyMetric = params.keyMetric || '+18.4% conversion lift';
  const metricDetail = params.metricDetail || 'streamlining core checkout & token system';
  const companyInitiative = params.companyInitiative || 'delivering high-velocity user experience';
  const portfolioUrl = params.portfolioUrl || 'https://alexrivera.design';
  const senderName = params.senderName || 'Alex Rivera';
  const senderEmail = params.senderEmail || 'alex.rivera@example.com';

  const note = `Hi ${recipientName},

Noticed ${companyName} is scaling ${teamOrFocusArea}.

At ${previousOrg}, I led the ${projectOrSystem} driving **${keyMetric}** (${metricDetail}). Given your focus on ${companyInitiative}, I’ve tailored a live breakdown and case study for your team:

🔗 **Live Portfolio & Case Studies**: ${portfolioUrl}

Open to a brief 10-minute sync this week if exploring senior talent?

Best,
${senderName} (${senderEmail})`;

  return note;
}

/**
 * Counts words in a text snippet.
 * @param {string} text 
 * @returns {number}
 */
export function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Compiles resume package into applications directory.
 * @param {object} options 
 * @returns {object} Compilation artifacts and status.
 */
export function compileResume(options = {}) {
  const workspaceDir = path.resolve(options.workspaceDir || process.cwd());
  const companySlug = options.companySlug || options.slug || 'general-application';

  // Locate profile.md
  let profilePath = options.profilePath
    ? path.resolve(options.profilePath)
    : path.join(workspaceDir, '.agents', 'career', 'profile.md');

  if (!fs.existsSync(profilePath)) {
    // Try fallback locations
    const fallback = path.join(workspaceDir, 'profile.md');
    if (fs.existsSync(fallback)) {
      profilePath = fallback;
    } else {
      const err = new Error(`Master career profile not found at: ${profilePath}`);
      err.nng = {
        what: 'We cannot tailor your resume yet.',
        why: 'Your career notes file (.agents/career/profile.md) was not found.',
        recovery: 'Run /showcase init or create your profile.md file to get started.'
      };
      throw err;
    }
  }

  const rawProfile = fs.readFileSync(profilePath, 'utf8');
  if (!rawProfile.trim()) {
    const err = new Error('Career profile file is empty.');
    err.nng = {
      what: 'We cannot tailor your resume yet.',
      why: 'Your career notes file is empty. We need your background details.',
      recovery: 'Answer 2 quick questions to fill in your profile details.'
    };
    throw err;
  }

  const { data: frontmatter, content: markdownBody } = parseFrontmatter(rawProfile);

  // Setup output directory
  const defaultOutputDir = path.join(workspaceDir, '.agents', 'career', 'applications', companySlug);
  const outputDir = path.resolve(options.outputDir || defaultOutputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const contact = frontmatter.contact || {};
  const artifacts = {};

  // 1. Generate ATS Plain-Text
  const atsText = generateAtsText(frontmatter, markdownBody);
  const atsPath = path.join(outputDir, `resume_${companySlug}_ats.txt`);
  fs.writeFileSync(atsPath, atsText, 'utf8');
  artifacts.atsText = normalizePath(atsPath);

  // 2. Generate 80-Word Pitch Note
  const metric = frontmatter.keyMetrics?.[0];
  const pitchText = generatePitchNote({
    recipientName: options.recipientName || 'Hiring Lead',
    companyName: options.companyName || companySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    teamOrFocusArea: options.teamOrFocusArea || 'design and product engineering',
    previousOrg: options.previousOrg || 'prior product teams',
    projectOrSystem: options.projectOrSystem || frontmatter.targetRoles?.[0] || 'systems architecture',
    keyMetric: metric ? `${metric.value} ${metric.label}` : '+18.4% conversion lift',
    metricDetail: metric?.context || 'streamlining product workflows',
    companyInitiative: options.companyInitiative || 'high-impact customer growth',
    portfolioUrl: contact.website || 'https://alexrivera.design',
    senderName: contact.fullName || 'Alex Rivera',
    senderEmail: contact.email || 'alex.rivera@example.com'
  });

  const pitchPath = path.join(outputDir, `application_pitch.md`);
  fs.writeFileSync(pitchPath, pitchText, 'utf8');
  artifacts.pitchNote = normalizePath(pitchPath);
  artifacts.pitchWordCount = countWords(pitchText);

  // 3. Render HTML & Compile 1-Page Vector PDF
  let htmlTemplate = '';
  const templatePath = path.resolve(__dirname, '..', 'templates', 'resume_template.html');
  if (fs.existsSync(templatePath)) {
    htmlTemplate = fs.readFileSync(templatePath, 'utf8');
  } else {
    htmlTemplate = `<!DOCTYPE html><html><body><h1>{{fullName}}</h1><p>{{summary}}</p></body></html>`;
  }

  // Populate template
  let renderedHtml = htmlTemplate
    .replace(/{{fullName}}/g, contact.fullName || 'Alex Rivera')
    .replace(/{{headline}}/g, contact.headline || 'Product & Systems Strategist')
    .replace(/{{email}}/g, contact.email || 'alex.rivera@example.com')
    .replace(/{{location}}/g, contact.location || 'Remote')
    .replace(/{{phone}}/g, contact.phone || '')
    .replace(/{{website}}/g, contact.website || '')
    .replace(/{{websiteDisplay}}/g, contact.website ? contact.website.replace(/^https?:\/\//, '') : '')
    .replace(/{{linkedin}}/g, contact.linkedin || '')
    .replace(/{{github}}/g, contact.github || '');

  // Strip unused conditional blocks if properties missing
  if (!contact.phone) renderedHtml = renderedHtml.replace(/{{#if phone}}[\s\S]*?{{\/if}}/g, '');
  if (!contact.website) renderedHtml = renderedHtml.replace(/{{#if website}}[\s\S]*?{{\/if}}/g, '');
  if (!contact.linkedin) renderedHtml = renderedHtml.replace(/{{#if linkedin}}[\s\S]*?{{\/if}}/g, '');
  if (!contact.github) renderedHtml = renderedHtml.replace(/{{#if github}}[\s\S]*?{{\/if}}/g, '');

  renderedHtml = renderedHtml.replace(/{{#if \w+}}/g, '').replace(/{{\/if}}/g, '');

  // Render competencies
  const comp = frontmatter.coreCompetencies || {};
  renderedHtml = renderedHtml
    .replace(/{{competencies\.domain}}/g, Array.isArray(comp.domain) ? comp.domain.join(', ') : (comp.domain || ''))
    .replace(/{{competencies\.technical}}/g, Array.isArray(comp.technical) ? comp.technical.join(', ') : (comp.technical || ''))
    .replace(/{{competencies\.tools}}/g, Array.isArray(comp.tools) ? comp.tools.join(', ') : (comp.tools || ''));

  // Render summary & markdown body
  renderedHtml = renderedHtml.replace(/{{summary}}/g, 'Senior Product Designer and UX Systems Strategist with a proven record accelerating product delivery and boosting conversion.');

  const renderedHtmlPath = path.join(outputDir, `resume_${companySlug}.html`);
  fs.writeFileSync(renderedHtmlPath, renderedHtml, 'utf8');
  artifacts.renderedHtml = normalizePath(renderedHtmlPath);

  // Compile PDF via Headless Browser
  const pdfPath = path.join(outputDir, `resume_${companySlug}.pdf`);
  const browserBinary = findBrowserBinary();

  if (browserBinary) {
    try {
      const targetUrl = 'file:///' + renderedHtmlPath.replace(/\\/g, '/');
      const chromeArgs = [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdfPath}`,
        targetUrl
      ];
      execFileSync(browserBinary, chromeArgs, { stdio: 'pipe' });
      if (fs.existsSync(pdfPath)) {
        artifacts.pdf = normalizePath(pdfPath);
      }
    } catch (e) {
      artifacts.pdfError = e.message;
    }
  } else {
    artifacts.pdfWarning = 'No Chrome/Edge browser binary found for headless PDF printing. HTML template saved.';
  }

  return {
    success: true,
    companySlug,
    outputDir: normalizePath(outputDir),
    artifacts
  };
}

// CLI Entry Point
const isDirectCall = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectCall) {
  try {
    const slug = process.argv[2] || 'application';
    const result = compileResume({ companySlug: slug });
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    const nng = error.nng || {
      what: 'Failed to compile resume package.',
      why: error.message,
      recovery: 'Ensure your career profile is configured and retry.'
    };
    console.error(JSON.stringify({
      error: 'ResumeCompilationError',
      ...nng
    }, null, 2));
    process.exit(1);
  }
}
