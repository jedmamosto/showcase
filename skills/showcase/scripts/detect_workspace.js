/**
 * detect_workspace.js — Non-destructive Workspace & Framework Inspector
 * 
 * Inspects a target directory to determine whether it contains an existing
 * personal portfolio (Path A) or is an empty/greenfield workspace (Path B).
 * 
 * Usage:
 *   CLI: node detect_workspace.js [targetDir]
 *   Module: import { detectWorkspace } from './detect_workspace.js';
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Normalizes all path separators to standard forward slashes.
 * @param {string} p 
 * @returns {string}
 */
export function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Detects workspace environment and framework characteristics non-destructively.
 * @param {string} [targetDir] Directory to inspect (defaults to process.cwd()).
 * @returns {object} Structured detection metadata.
 */
export function detectWorkspace(targetDir = process.cwd()) {
  const resolvedPath = path.resolve(targetDir);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Target directory does not exist: ${resolvedPath}`);
  }

  const stat = fs.statSync(resolvedPath);
  if (!stat.isDirectory()) {
    throw new Error(`Target path is not a directory: ${resolvedPath}`);
  }

  const entries = fs.readdirSync(resolvedPath);
  const indicators = [];

  // Read package.json if available
  let pkg = null;
  const pkgPath = path.join(resolvedPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const raw = fs.readFileSync(pkgPath, 'utf8');
      pkg = JSON.parse(raw);
      indicators.push('package.json');
    } catch (e) {
      indicators.push('package.json (unparsable)');
    }
  }

  const allDeps = {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {})
  };

  // Check framework indicators
  const hasNextConfig = ['next.config.js', 'next.config.mjs', 'next.config.ts'].some(f => entries.includes(f));
  const hasNextDep = Boolean(allDeps['next']);

  const hasAstroConfig = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js'].some(f => entries.includes(f));
  const hasAstroDep = Boolean(allDeps['astro']);

  const hasViteConfig = ['vite.config.js', 'vite.config.ts', 'vite.config.mjs', 'vite.config.cjs'].some(f => entries.includes(f));
  const hasViteDep = Boolean(allDeps['vite']);

  const hasRemixConfig = ['remix.config.js'].some(f => entries.includes(f));
  const hasRemixDep = Object.keys(allDeps).some(d => d.startsWith('@remix-run/'));

  const hasNuxtConfig = ['nuxt.config.js', 'nuxt.config.ts', 'nuxt.config.mjs'].some(f => entries.includes(f));
  const hasNuxtDep = Boolean(allDeps['nuxt']);

  const hasSvelteConfig = ['svelte.config.js'].some(f => entries.includes(f));
  const hasSvelteDep = Boolean(allDeps['@sveltejs/kit']);

  const hasIndexHtml = entries.includes('index.html');
  const hasCareerDir = fs.existsSync(path.join(resolvedPath, '.agents', 'career'));
  const hasConfig = fs.existsSync(path.join(resolvedPath, 'showcase.config.json'));

  // Framework classification
  let framework = 'custom';
  let mode = 'existing-portfolio';
  let adapterFormat = 'json';
  let projectDataFile = undefined;

  // Determine if greenfield (empty or minimal repo metadata only)
  const ignoredFiles = new Set(['.git', '.gitignore', '.agentignore', 'README.md', 'docs', '.DS_Store', 'Thumbs.db']);
  const nonIgnoredEntries = entries.filter(e => !ignoredFiles.has(e));

  if (nonIgnoredEntries.length === 0) {
    mode = 'greenfield-starter';
    framework = 'html-static';
    adapterFormat = 'json';
    projectDataFile = 'data/projects.json';
  } else if (hasNextConfig || hasNextDep) {
    framework = 'nextjs';
    indicators.push(hasNextConfig ? 'next.config.*' : 'dependency:next');
    adapterFormat = 'typescript';

    // Locate potential project data files
    const candidates = [
      'src/data/projects.ts',
      'data/projects.ts',
      'src/data/projects.json',
      'data/projects.json',
      'src/lib/projects.ts'
    ];
    for (const cand of candidates) {
      if (fs.existsSync(path.join(resolvedPath, cand))) {
        projectDataFile = normalizePath(cand);
        break;
      }
    }
    if (!projectDataFile) {
      projectDataFile = 'src/data/projects.ts';
    }
  } else if (hasAstroConfig || hasAstroDep) {
    framework = 'astro';
    indicators.push(hasAstroConfig ? 'astro.config.*' : 'dependency:astro');
    adapterFormat = 'markdown-collections';
    projectDataFile = 'src/content/projects';
  } else if (hasRemixConfig || hasRemixDep) {
    framework = 'remix';
    indicators.push('remix');
    adapterFormat = 'typescript';
    projectDataFile = 'app/data/projects.ts';
  } else if (hasNuxtConfig || hasNuxtDep) {
    framework = 'nuxt';
    indicators.push('nuxt');
    adapterFormat = 'json';
    projectDataFile = 'content/projects.json';
  } else if (hasSvelteConfig || hasSvelteDep) {
    framework = 'sveltekit';
    indicators.push('sveltekit');
    adapterFormat = 'typescript';
    projectDataFile = 'src/lib/data/projects.ts';
  } else if (hasViteConfig || hasViteDep) {
    framework = 'vite';
    indicators.push(hasViteConfig ? 'vite.config.*' : 'dependency:vite');
    adapterFormat = 'json';
    projectDataFile = 'src/data/projects.json';
  } else if (hasIndexHtml) {
    framework = 'html-static';
    indicators.push('index.html');
    adapterFormat = 'html';
    projectDataFile = 'index.html';
  } else {
    framework = 'custom';
    indicators.push('custom/unclassified');
    adapterFormat = 'json';
    projectDataFile = 'data/projects.json';
  }

  const result = {
    schemaVersion: '1.0.0',
    mode,
    framework,
    portfolioDir: '.',
    careerDir: '.agents/career',
    hasExistingCareerDir: hasCareerDir,
    hasConfig: hasConfig,
    adapter: {
      format: adapterFormat,
      ...(projectDataFile ? { projectDataFile: normalizePath(projectDataFile) } : {})
    },
    indicators
  };

  // Extract candidate profile metadata from package.json if available
  if (pkg) {
    result.detectedMetadata = {};
    if (pkg.author) {
      if (typeof pkg.author === 'string') {
        result.detectedMetadata.fullName = pkg.author.replace(/<.*?>|\(.*?\)/g, '').trim();
      } else if (typeof pkg.author === 'object' && pkg.author.name) {
        result.detectedMetadata.fullName = pkg.author.name;
        if (pkg.author.email) result.detectedMetadata.email = pkg.author.email;
        if (pkg.author.url) result.detectedMetadata.website = pkg.author.url;
      }
    }
    if (pkg.name) result.detectedMetadata.projectName = pkg.name;
    if (pkg.description) result.detectedMetadata.headline = pkg.description;
  }

  return result;
}

// CLI Entry Point
const isDirectCall = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectCall) {
  try {
    const targetDir = process.argv[2] || process.cwd();
    const result = detectWorkspace(targetDir);
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({
      error: 'WorkspaceDetectionError',
      what: 'Failed to inspect workspace directory.',
      why: error.message,
      recovery: 'Check folder permissions and verify that the target directory exists.'
    }, null, 2));
    process.exit(1);
  }
}
