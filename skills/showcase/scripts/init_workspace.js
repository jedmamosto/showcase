/**
 * init_workspace.js — Non-destructive Workspace Scaffolder & Backup Engine
 * 
 * Safely initializes .agents/career/ and showcase.config.json for Path A
 * (existing portfolio) or Path B (greenfield starter) with timestamped backups.
 * 
 * Usage:
 *   CLI: node init_workspace.js [targetDir] [--mode existing-portfolio|greenfield-starter] [--theme warm-editorial]
 *   Module: import { initWorkspace } from './init_workspace.js';
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectWorkspace, normalizePath } from './detect_workspace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an ISO-based filesystem-safe timestamp.
 * Format: YYYYMMDD_HHMMSS
 * @returns {string}
 */
export function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

/**
 * Creates a timestamped backup of a file if it already exists.
 * @param {string} filePath 
 * @returns {string|null} Backup path if created, null if file did not exist.
 */
export function safeBackupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.bak.${getTimestamp()}`;
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }
  return null;
}

/**
 * Safely writes file contents after creating a timestamped backup if it exists.
 * @param {string} filePath 
 * @param {string} content 
 * @returns {{ written: boolean, backupPath: string|null }}
 */
export function safeWriteFileWithBackup(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const backupPath = safeBackupFile(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
  return { written: true, backupPath };
}

/**
 * Recursively copies directory contents non-destructively.
 * @param {string} src 
 * @param {string} dest 
 */
export function copyDirNonDestructive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirNonDestructive(srcPath, destPath);
    } else if (entry.isFile()) {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

/**
 * Initializes workspace with career intelligence hub and configuration.
 * @param {object} options 
 * @returns {object} Initialization results.
 */
export function initWorkspace(options = {}) {
  const targetDir = path.resolve(options.targetDir || process.cwd());

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  } catch (err) {
    const errorObj = new Error(`Permission denied creating directory: ${targetDir}`);
    errorObj.nng = {
      what: 'We could not create your portfolio folder.',
      why: 'This directory path is protected or lacks write permissions.',
      recovery: 'Choose another folder or run with appropriate filesystem permissions.'
    };
    throw errorObj;
  }

  // Detect environment
  const detected = detectWorkspace(targetDir);
  const mode = options.mode || detected.mode;
  const framework = options.framework || detected.framework;
  const theme = options.theme || 'warm-editorial';

  const careerDir = path.join(targetDir, '.agents', 'career');
  const projectsDir = path.join(careerDir, 'projects');
  const applicationsDir = path.join(careerDir, 'applications');

  // Create required directory hierarchy
  try {
    fs.mkdirSync(projectsDir, { recursive: true });
    fs.mkdirSync(applicationsDir, { recursive: true });
  } catch (err) {
    const errorObj = new Error(`Permission denied creating career directories in: ${careerDir}`);
    errorObj.nng = {
      what: 'We could not save your career center files.',
      why: 'The .agents directory is locked or lacks write permissions.',
      recovery: 'Check folder permissions and retry.'
    };
    throw errorObj;
  }

  const createdFiles = [];
  const backups = [];

  // 1. Write or initialize showcase.config.json
  const configPath = path.join(targetDir, 'showcase.config.json');
  const configData = {
    schemaVersion: '1.0.0',
    mode: mode,
    framework: framework,
    portfolioDir: '.',
    careerDir: '.agents/career',
    theme: theme,
    exportTargets: {
      pdf: true,
      atsText: true,
      pitchNote: true,
      ...(options.exportTargets || {})
    },
    contact: {
      email: options.contact?.email || 'alex.rivera@example.com',
      ...(options.contact?.fullName ? { fullName: options.contact.fullName } : {}),
      ...(options.contact?.headline ? { headline: options.contact.headline } : {}),
      ...(options.contact?.location ? { location: options.contact.location } : {}),
      ...(options.contact?.linkedin ? { linkedin: options.contact.linkedin } : {}),
      ...(options.contact?.bookingUrl ? { bookingUrl: options.contact.bookingUrl } : {}),
      ...(options.contact?.github ? { github: options.contact.github } : {}),
      ...(options.contact?.website ? { website: options.contact.website } : {})
    },
    adapter: {
      format: detected.adapter?.format || (mode === 'greenfield-starter' ? 'json' : 'typescript'),
      ...(detected.adapter?.projectDataFile ? { projectDataFile: normalizePath(detected.adapter.projectDataFile) } : {})
    }
  };

  const configWriteRes = safeWriteFileWithBackup(configPath, JSON.stringify(configData, null, 2));
  createdFiles.push(normalizePath(configPath));
  if (configWriteRes.backupPath) backups.push(normalizePath(configWriteRes.backupPath));

  // 2. Initialize profile.md from template
  const profilePath = path.join(careerDir, 'profile.md');
  let profileContent = '';

  const templatePath = path.resolve(__dirname, '..', 'templates', 'profile_template.md');
  if (fs.existsSync(templatePath)) {
    profileContent = fs.readFileSync(templatePath, 'utf8');
  } else {
    // Built-in fallback
    profileContent = `---
schemaVersion: "1.0.0"
contact:
  fullName: "${options.contact?.fullName || 'Alex Rivera'}"
  headline: "${options.contact?.headline || 'Senior Product Designer & Systems Strategist'}"
  location: "${options.contact?.location || 'San Francisco, CA (Remote)'}"
  email: "${options.contact?.email || 'alex.rivera@example.com'}"
  website: "${options.contact?.website || 'https://example.com'}"
  linkedin: "${options.contact?.linkedin || 'https://linkedin.com/in/example'}"
  github: "${options.contact?.github || 'https://github.com/example'}"
targetRoles:
  - "Senior Product Designer"
coreCompetencies:
  domain:
    - "Product Strategy"
    - "User Experience"
  technical:
    - "Semantic HTML5"
    - "Modern CSS / Tokens"
  tools:
    - "Figma"
    - "VS Code"
featuredProjectSlugs: []
keyMetrics:
  - label: "Conversion Lift"
    value: "+18.4%"
    context: "Mobile checkout flow redesign"
lastUpdated: "${new Date().toISOString()}"
---

# Master Career Profile & Story Hub
`;
  }

  // If custom user contact details were passed, interpolate or update frontmatter
  if (options.contact && (options.contact.fullName || options.contact.email || options.contact.headline)) {
    if (options.contact.fullName) {
      profileContent = profileContent.replace(/fullName:\s*"[^"]*"/, `fullName: "${options.contact.fullName}"`);
    }
    if (options.contact.headline) {
      profileContent = profileContent.replace(/headline:\s*"[^"]*"/, `headline: "${options.contact.headline}"`);
    }
    if (options.contact.email) {
      profileContent = profileContent.replace(/email:\s*"[^"]*"/, `email: "${options.contact.email}"`);
    }
    if (options.contact.location) {
      profileContent = profileContent.replace(/location:\s*"[^"]*"/, `location: "${options.contact.location}"`);
    }
  }

  const profileWriteRes = safeWriteFileWithBackup(profilePath, profileContent);
  createdFiles.push(normalizePath(profilePath));
  if (profileWriteRes.backupPath) backups.push(normalizePath(profileWriteRes.backupPath));

  // 3. Greenfield Starter Copy (Path B)
  if (mode === 'greenfield-starter') {
    const starterTemplateDir = options.starterTemplateDir || path.resolve(__dirname, '..', 'templates', 'starter-portfolio');
    if (fs.existsSync(starterTemplateDir)) {
      copyDirNonDestructive(starterTemplateDir, targetDir);
    }
  }

  // 4. Copy Showcase Career Skills into .agents/skills/ non-destructively
  const skillsSourceDir = options.skillsSourceDir || path.resolve(__dirname, '..', '..');
  const targetSkillsDir = path.join(targetDir, '.agents', 'skills');
  const skillNames = ['showcase', 'resume-builder', 'job-hunter', 'project-publisher'];

  for (const skillName of skillNames) {
    const srcSkillPath = path.join(skillsSourceDir, skillName);
    const destSkillPath = path.join(targetSkillsDir, skillName);
    if (fs.existsSync(srcSkillPath)) {
      copyDirNonDestructive(srcSkillPath, destSkillPath);
    }
  }

  return {
    success: true,
    mode,
    framework,
    theme,
    targetDir: normalizePath(targetDir),
    careerDir: normalizePath(careerDir),
    createdFiles,
    backups,
    message: mode === 'existing-portfolio'
      ? 'Successfully connected career center to existing personal website with zero file deletions.'
      : 'Successfully initialized greenfield starter portfolio and private career center.'
  };
}

// CLI Entry Point
const isDirectCall = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectCall) {
  try {
    const args = process.argv.slice(2);
    let targetDir = process.cwd();
    let mode = undefined;
    let theme = 'warm-editorial';

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--dir' && args[i + 1]) {
        targetDir = args[++i];
      } else if (args[i] === '--mode' && args[i + 1]) {
        mode = args[++i];
      } else if (args[i] === '--theme' && args[i + 1]) {
        theme = args[++i];
      } else if (!args[i].startsWith('--')) {
        targetDir = args[i];
      }
    }

    const result = initWorkspace({ targetDir, mode, theme });
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    const nng = error.nng || {
      what: 'Failed to initialize Showcase workspace.',
      why: error.message,
      recovery: 'Verify folder write permissions and retry.'
    };
    console.error(JSON.stringify({
      error: 'WorkspaceInitError',
      ...nng
    }, null, 2));
    process.exit(1);
  }
}
