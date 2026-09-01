/**
 * publish_case_study.js — Framework-Agnostic Project Sync Adapter
 * 
 * Validates project case study markdown against project-schema.json and syncs
 * data to the target website format (JSON, TypeScript, Markdown Collections, HTML)
 * while strictly enforcing the zero-deletion invariant and creating timestamped backups.
 * 
 * Usage:
 *   CLI: node publish_case_study.js <projectSlugOrMarkdownPath> [--workspace <dir>]
 *   Module: import { publishCaseStudy, validateProjectData } from './publish_case_study.js';
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFrontmatter } from './compile_resume.js';
import { safeBackupFile, safeWriteFileWithBackup } from './init_workspace.js';
import { normalizePath } from './detect_workspace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validates project data against project-schema.json requirements.
 * @param {object} data 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateProjectData(data) {
  const errors = [];

  if (!data.slug || typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.push('Field "slug" must be a lowercase URL-friendly kebab-case string (e.g. "my-project").');
  }
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Field "title" is required and must be a non-empty string.');
  }
  if (!data.tagline || typeof data.tagline !== 'string') {
    errors.push('Field "tagline" is required and must be a non-empty string.');
  }
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Field "category" is required.');
  }
  if (!data.role || typeof data.role !== 'string') {
    errors.push('Field "role" is required.');
  }
  if (!data.organization || typeof data.organization !== 'string') {
    errors.push('Field "organization" is required.');
  }
  if (!data.timeframe || typeof data.timeframe !== 'string') {
    errors.push('Field "timeframe" is required.');
  }
  if (data.status && !['Production', 'Live', 'Active Development', 'Concept', 'Case Study'].includes(data.status)) {
    errors.push('Field "status" must be one of: "Production", "Live", "Active Development", "Concept", "Case Study".');
  }
  if (typeof data.isFeatured !== 'boolean') {
    errors.push('Field "isFeatured" must be a boolean (true or false).');
  }
  if (!Array.isArray(data.stack) || data.stack.length === 0) {
    errors.push('Field "stack" must be a non-empty array of technology strings.');
  }
  if (!Array.isArray(data.metrics) || data.metrics.length === 0) {
    errors.push('Field "metrics" must be a non-empty array of objects with label and value.');
  } else {
    for (let i = 0; i < data.metrics.length; i++) {
      const m = data.metrics[i];
      if (!m.label || !m.value) {
        errors.push(`Metric at index ${i} must have both "label" and "value" properties.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Publishes and synchronizes a case study into target portfolio format.
 * @param {object} options 
 * @returns {object} Publishing results and created/updated paths.
 */
export function publishCaseStudy(options = {}) {
  const workspaceDir = path.resolve(options.workspaceDir || process.cwd());
  let projectSource = options.projectSource || options.slug || options.file;

  if (!projectSource) {
    const err = new Error('No project slug, file path, or data provided.');
    err.nng = {
      what: 'We could not publish your case study.',
      why: 'No project file or details were provided.',
      recovery: 'Provide a project markdown file path or project slug and retry.'
    };
    throw err;
  }

  let projectData = {};
  let markdownBody = '';
  let sourceFilePath = null;

  // Resolve source file or markdown string
  if (typeof projectSource === 'string') {
    if (fs.existsSync(path.resolve(projectSource))) {
      sourceFilePath = path.resolve(projectSource);
    } else {
      const candidateInCareer = path.join(workspaceDir, '.agents', 'career', 'projects', `${projectSource}.md`);
      if (fs.existsSync(candidateInCareer)) {
        sourceFilePath = candidateInCareer;
      }
    }
  }

  if (sourceFilePath && fs.existsSync(sourceFilePath)) {
    const raw = fs.readFileSync(sourceFilePath, 'utf8');
    const parsed = parseFrontmatter(raw);
    projectData = parsed.data;
    markdownBody = parsed.content;
  } else if (typeof projectSource === 'object') {
    projectData = projectSource;
    markdownBody = options.content || '';
  } else {
    const err = new Error(`Project file not found at: ${projectSource}`);
    err.nng = {
      what: 'We could not find the project file.',
      why: `The file "${projectSource}" does not exist in your career folder.`,
      recovery: 'Check the project name and try again.'
    };
    throw err;
  }

  // Ensure default fields if not specified
  if (!projectData.status) projectData.status = 'Production';
  if (!projectData.statusBadge) projectData.statusBadge = projectData.status;
  if (projectData.isFeatured === undefined) projectData.isFeatured = true;

  // Validate data against schema
  const validation = validateProjectData(projectData);
  if (!validation.valid) {
    const err = new Error(`Case study validation failed: ${validation.errors.join('; ')}`);
    err.nng = {
      what: 'Case study details are incomplete.',
      why: validation.errors.join(', '),
      recovery: 'Fix the highlighted fields in your project file and retry.'
    };
    throw err;
  }

  const slug = projectData.slug;
  const backups = [];
  const syncedFiles = [];

  // 1. Ensure master career copy in .agents/career/projects/<slug>.md
  const careerProjectsDir = path.join(workspaceDir, '.agents', 'career', 'projects');
  if (!fs.existsSync(careerProjectsDir)) {
    fs.mkdirSync(careerProjectsDir, { recursive: true });
  }

  const careerProjectFile = path.join(careerProjectsDir, `${slug}.md`);
  const yamlHeader = [
    '---',
    `slug: "${projectData.slug}"`,
    `title: "${projectData.title}"`,
    `tagline: "${projectData.tagline}"`,
    `category: "${projectData.category}"`,
    `role: "${projectData.role}"`,
    `organization: "${projectData.organization}"`,
    `timeframe: "${projectData.timeframe}"`,
    `status: "${projectData.status}"`,
    `statusBadge: "${projectData.statusBadge}"`,
    `isFeatured: ${projectData.isFeatured}`,
    ...(projectData.featuredRank ? [`featuredRank: ${projectData.featuredRank}`] : []),
    ...(projectData.liveUrl ? [`liveUrl: "${projectData.liveUrl}"`] : []),
    ...(projectData.githubUrl ? [`githubUrl: "${projectData.githubUrl}"`] : []),
    'stack:',
    ...projectData.stack.map(s => `  - "${s}"`),
    'metrics:',
    ...projectData.metrics.map(m => `  - label: "${m.label}"\n    value: "${m.value}"${m.detail ? `\n    detail: "${m.detail}"` : ''}`),
    '---',
    '',
    markdownBody.trim() ? markdownBody.trim() : `# ${projectData.title}\n\n${projectData.tagline}`
  ].join('\n') + '\n';

  const careerWriteRes = safeWriteFileWithBackup(careerProjectFile, yamlHeader);
  syncedFiles.push(normalizePath(careerProjectFile));
  if (careerWriteRes.backupPath) backups.push(normalizePath(careerWriteRes.backupPath));

  // 2. Read showcase.config.json to determine sync adapter
  const configPath = path.join(workspaceDir, 'showcase.config.json');
  let config = {
    mode: 'greenfield-starter',
    adapter: { format: 'json', projectDataFile: 'data/projects.json' }
  };

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      // Keep default
    }
  }

  const adapterFormat = config.adapter?.format || 'json';
  const dataFilePath = config.adapter?.projectDataFile
    ? path.join(workspaceDir, config.adapter.projectDataFile)
    : path.join(workspaceDir, 'data', 'projects.json');

  // 3. Perform format-specific non-destructive sync
  if (adapterFormat === 'json') {
    let projectList = [];
    if (fs.existsSync(dataFilePath)) {
      try {
        projectList = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        if (!Array.isArray(projectList)) projectList = [];
      } catch (e) {
        projectList = [];
      }
    }

    // Replace existing or append
    const existingIdx = projectList.findIndex(p => p.slug === slug);
    if (existingIdx >= 0) {
      projectList[existingIdx] = projectData;
    } else {
      projectList.push(projectData);
    }

    const jsonWriteRes = safeWriteFileWithBackup(dataFilePath, JSON.stringify(projectList, null, 2));
    syncedFiles.push(normalizePath(dataFilePath));
    if (jsonWriteRes.backupPath) backups.push(normalizePath(jsonWriteRes.backupPath));
  } else if (adapterFormat === 'markdown-collections') {
    const destCollectionDir = path.isAbsolute(dataFilePath) ? dataFilePath : path.join(workspaceDir, dataFilePath);
    if (!fs.existsSync(destCollectionDir)) {
      fs.mkdirSync(destCollectionDir, { recursive: true });
    }
    const destFile = path.join(destCollectionDir, `${slug}.md`);
    const mdWriteRes = safeWriteFileWithBackup(destFile, yamlHeader);
    syncedFiles.push(normalizePath(destFile));
    if (mdWriteRes.backupPath) backups.push(normalizePath(mdWriteRes.backupPath));
  } else if (adapterFormat === 'typescript') {
    let existingContent = '';
    if (fs.existsSync(dataFilePath)) {
      existingContent = fs.readFileSync(dataFilePath, 'utf8');
    }

    let updatedTs = '';
    if (existingContent && existingContent.includes('export const projects') && existingContent.includes('slug:')) {
      const jsonEntry = JSON.stringify(projectData, null, 2);
      if (existingContent.includes(`"${slug}"`) || existingContent.includes(`'${slug}'`)) {
        updatedTs = existingContent;
      } else {
        updatedTs = existingContent.replace(
          /(export const projects(?::\s*\w+\[\])?\s*=\s*\[)([\s\S]*?)(\];)/,
          `$1$2  ${jsonEntry},\n$3`
        );
      }
    } else {
      updatedTs = `// Synchronized by Showcase Toolkit\nexport interface ProjectMetric {\n  label: string;\n  value: string;\n  detail?: string;\n}\n\nexport interface CaseStudy {\n  slug: string;\n  title: string;\n  tagline: string;\n  category: string;\n  role: string;\n  organization: string;\n  timeframe: string;\n  status: string;\n  statusBadge: string;\n  isFeatured: boolean;\n  featuredRank?: number;\n  liveUrl?: string;\n  githubUrl?: string;\n  stack: string[];\n  metrics: ProjectMetric[];\n}\n\nexport const projects: CaseStudy[] = [\n  ${JSON.stringify(projectData, null, 2)}\n];\n`;
    }

    const tsWriteRes = safeWriteFileWithBackup(dataFilePath, updatedTs);
    syncedFiles.push(normalizePath(dataFilePath));
    if (tsWriteRes.backupPath) backups.push(normalizePath(tsWriteRes.backupPath));
  }

  return {
    success: true,
    slug,
    adapterFormat,
    syncedFiles,
    backups,
    message: `Case study "${projectData.title}" (${slug}) successfully published and synced with zero loss.`
  };
}

// CLI Entry Point
const isDirectCall = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectCall) {
  try {
    const args = process.argv.slice(2);
    const projectArg = args.find(a => !a.startsWith('--'));
    let portfolioArg = null;
    const portfolioIdx = args.indexOf('--portfolio');
    if (portfolioIdx !== -1 && args[portfolioIdx + 1]) {
      portfolioArg = args[portfolioIdx + 1];
    }

    if (!projectArg) {
      console.error(JSON.stringify({
        error: 'MissingArgument',
        what: 'No project slug or path provided.',
        why: 'The command requires a target project name or path.',
        recovery: 'Run: node publish_case_study.js <project-slug-or-file> [--portfolio <portfolio_path>]'
      }, null, 2));
      process.exit(1);
    }

    const result = publishCaseStudy({ projectSource: projectArg, portfolioDir: portfolioArg });
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    const nng = error.nng || {
      what: 'Failed to publish case study.',
      why: error.message,
      recovery: 'Verify project frontmatter and retry.'
    };
    console.error(JSON.stringify({
      error: 'PublishCaseStudyError',
      ...nng
    }, null, 2));
    process.exit(1);
  }
}
