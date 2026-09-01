/**
 * core.test.js — Deterministic Automated Unit & Integration Tests for Showcase Core
 * 
 * Verifies Acceptance Criteria AC-001 through AC-005 and AC-011 through AC-015.
 * Run with: node --test showcase/skills/showcase/tests/core.test.js
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { detectWorkspace } from '../scripts/detect_workspace.js';
import { initWorkspace, safeBackupFile, safeWriteFileWithBackup } from '../scripts/init_workspace.js';
import { compileResume, parseFrontmatter, generateAtsText, generatePitchNote, countWords } from '../scripts/compile_resume.js';
import { publishCaseStudy, validateProjectData } from '../scripts/publish_case_study.js';

function createTempDir(prefix = 'showcase-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function cleanTempDir(dirPath) {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

describe('Showcase Core Automation Suite', () => {

  // =========================================================================
  // AC-001: Framework Auto-Detection
  // =========================================================================
  describe('AC-001: Framework Auto-Detection', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('ac001-');
    });

    afterEach(() => {
      cleanTempDir(tempDir);
    });

    test('detects greenfield starter when directory is empty', () => {
      const result = detectWorkspace(tempDir);
      assert.equal(result.mode, 'greenfield-starter');
      assert.equal(result.framework, 'html-static');
      assert.equal(result.adapter.format, 'json');
    });

    test('detects Next.js repository via next.config.ts and package.json', () => {
      fs.writeFileSync(path.join(tempDir, 'next.config.ts'), 'export default {};');
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({ dependencies: { next: '^15.0.0' } }));

      const result = detectWorkspace(tempDir);
      assert.equal(result.mode, 'existing-portfolio');
      assert.equal(result.framework, 'nextjs');
      assert.equal(result.adapter.format, 'typescript');
    });

    test('detects Astro repository via astro.config.mjs', () => {
      fs.writeFileSync(path.join(tempDir, 'astro.config.mjs'), 'export default {};');
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({ dependencies: { astro: '^4.0.0' } }));

      const result = detectWorkspace(tempDir);
      assert.equal(result.mode, 'existing-portfolio');
      assert.equal(result.framework, 'astro');
      assert.equal(result.adapter.format, 'markdown-collections');
    });

    test('detects Vite repository via vite.config.js', () => {
      fs.writeFileSync(path.join(tempDir, 'vite.config.js'), 'export default {};');
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({ devDependencies: { vite: '^5.0.0' } }));

      const result = detectWorkspace(tempDir);
      assert.equal(result.mode, 'existing-portfolio');
      assert.equal(result.framework, 'vite');
      assert.equal(result.adapter.format, 'json');
    });

    test('detects static HTML site via index.html', () => {
      fs.writeFileSync(path.join(tempDir, 'index.html'), '<!DOCTYPE html><html><body><h1>Portfolio</h1></body></html>');

      const result = detectWorkspace(tempDir);
      assert.equal(result.mode, 'existing-portfolio');
      assert.equal(result.framework, 'html-static');
      assert.equal(result.adapter.format, 'html');
    });
  });

  // =========================================================================
  // AC-002: Zero-Deletion Safety & Timestamped Backups
  // =========================================================================
  describe('AC-002: Zero-Deletion Safety & Backups', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('ac002-');
    });

    afterEach(() => {
      cleanTempDir(tempDir);
    });

    test('creates timestamped .bak.<ts> file before updating an existing config', () => {
      const originalConfig = { schemaVersion: '1.0.0', customUserField: 'preserved_data' };
      const configPath = path.join(tempDir, 'showcase.config.json');
      fs.writeFileSync(configPath, JSON.stringify(originalConfig, null, 2));

      // Trigger safe backup write
      const writeRes = safeWriteFileWithBackup(configPath, JSON.stringify({ schemaVersion: '1.0.0', updated: true }, null, 2));

      assert.ok(writeRes.backupPath, 'Backup path should be generated');
      assert.ok(fs.existsSync(writeRes.backupPath), 'Backup file must exist on disk');

      // Verify original content preserved in backup
      const backupContent = JSON.parse(fs.readFileSync(writeRes.backupPath, 'utf8'));
      assert.equal(backupContent.customUserField, 'preserved_data');
    });

    test('preserves existing project files during workspace init', () => {
      fs.writeFileSync(path.join(tempDir, 'custom-component.tsx'), 'export const Component = () => null;');
      fs.writeFileSync(path.join(tempDir, 'next.config.ts'), 'export default {};');

      initWorkspace({ targetDir: tempDir });

      // Invariant: original files must still exist unchanged
      assert.ok(fs.existsSync(path.join(tempDir, 'custom-component.tsx')));
      assert.equal(fs.readFileSync(path.join(tempDir, 'custom-component.tsx'), 'utf8'), 'export const Component = () => null;');
    });
  });

  // =========================================================================
  // AC-003 & AC-004: Career Hub Injection & Context Isolation
  // =========================================================================
  describe('AC-003 & AC-004: Career Hub Injection & Context Isolation', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('ac003-');
    });

    afterEach(() => {
      cleanTempDir(tempDir);
    });

    test('scaffolds .agents/career/ and valid profile.md', () => {
      const initRes = initWorkspace({
        targetDir: tempDir,
        contact: {
          fullName: 'Test Developer',
          email: 'dev@test.org',
          headline: 'Senior Systems Engineer'
        }
      });

      assert.ok(initRes.success);
      const profilePath = path.join(tempDir, '.agents', 'career', 'profile.md');
      assert.ok(fs.existsSync(profilePath), 'profile.md must exist in .agents/career/');

      const raw = fs.readFileSync(profilePath, 'utf8');
      const { data: frontmatter } = parseFrontmatter(raw);

      assert.equal(frontmatter.schemaVersion, '1.0.0');
      assert.equal(frontmatter.contact?.fullName, 'Test Developer');
      assert.equal(frontmatter.contact?.email, 'dev@test.org');
      assert.ok(Array.isArray(frontmatter.targetRoles));
      assert.ok(frontmatter.coreCompetencies);
    });

    test('creates isolated folder hierarchy without polluting parent dir', () => {
      initWorkspace({ targetDir: tempDir });

      assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'career', 'projects')));
      assert.ok(fs.existsSync(path.join(tempDir, '.agents', 'career', 'applications')));
      assert.ok(fs.existsSync(path.join(tempDir, 'showcase.config.json')));
    });
  });

  // =========================================================================
  // AC-005: Config State Persistence
  // =========================================================================
  describe('AC-005: Config State Persistence', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('ac005-');
    });

    afterEach(() => {
      cleanTempDir(tempDir);
    });

    test('persists valid showcase.config.json with selected theme and targets', () => {
      initWorkspace({
        targetDir: tempDir,
        theme: 'dark-studio',
        contact: { email: 'user@showcase.dev' }
      });

      const configPath = path.join(tempDir, 'showcase.config.json');
      assert.ok(fs.existsSync(configPath));

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      assert.equal(config.schemaVersion, '1.0.0');
      assert.equal(config.theme, 'dark-studio');
      assert.equal(config.exportTargets?.pdf, true);
      assert.equal(config.exportTargets?.atsText, true);
      assert.equal(config.exportTargets?.pitchNote, true);
      assert.equal(config.contact?.email, 'user@showcase.dev');
    });
  });

  // =========================================================================
  // AC-011 - AC-015: Resume Compilation, Pitch Note & Case Study Publishing
  // =========================================================================
  describe('AC-011 to AC-015: Resume & Publishing Engines', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('ac011-');
      initWorkspace({ targetDir: tempDir });
    });

    afterEach(() => {
      cleanTempDir(tempDir);
    });

    test('generates ATS plain text buffer with required uppercase sections', () => {
      const res = compileResume({
        workspaceDir: tempDir,
        companySlug: 'stripe'
      });

      assert.ok(res.success);
      assert.ok(res.artifacts.atsText);
      assert.ok(fs.existsSync(res.artifacts.atsText));

      const atsContent = fs.readFileSync(res.artifacts.atsText, 'utf8');
      assert.ok(atsContent.includes('CORE COMPETENCIES'), 'Must have CORE COMPETENCIES section');
      assert.ok(atsContent.includes('QUANTIFIED BUSINESS IMPACT'), 'Must have quantified metrics');
      assert.ok(atsContent.includes('ALEX RIVERA') || atsContent.includes('CANDIDATE'));
    });

    test('generates 80-word founder pitch note adhering strictly to word budget', () => {
      const res = compileResume({
        workspaceDir: tempDir,
        companySlug: 'vercel'
      });

      assert.ok(res.artifacts.pitchNote);
      assert.ok(fs.existsSync(res.artifacts.pitchNote));

      const pitchContent = fs.readFileSync(res.artifacts.pitchNote, 'utf8');
      const words = countWords(pitchContent);
      assert.ok(words <= 80, `Pitch word count must be <= 80 words (actual: ${words})`);
      assert.ok(pitchContent.includes('Live Portfolio & Case Studies'));
    });

    test('traps missing profile error with friendly NN/g 3-part microcopy', () => {
      const emptyDir = createTempDir('empty-profile-');
      try {
        assert.throws(() => {
          compileResume({ workspaceDir: emptyDir });
        }, (err) => {
          assert.ok(err.nng, 'Must contain NN/g structured error');
          assert.ok(err.nng.what.includes('cannot tailor your resume'));
          assert.ok(err.nng.recovery);
          return true;
        });
      } finally {
        cleanTempDir(emptyDir);
      }
    });

    test('validates and syncs case study to JSON adapter', () => {
      const validProject = {
        slug: 'fintech-checkout-flow',
        title: 'FinTech 1-Click Checkout Flow',
        tagline: 'High-conversion frictionless payment gateway',
        category: 'FinTech',
        role: 'Principal Engineer',
        organization: 'Acme Pay',
        timeframe: '2024',
        status: 'Production',
        statusBadge: 'Production',
        isFeatured: true,
        stack: ['TypeScript', 'React', 'Node.js'],
        metrics: [
          { label: 'Conversion Lift', value: '+24.6%', detail: 'Mobile browser conversion rate' }
        ]
      };

      const pubRes = publishCaseStudy({
        workspaceDir: tempDir,
        projectSource: validProject
      });

      assert.ok(pubRes.success);
      assert.equal(pubRes.slug, 'fintech-checkout-flow');

      // Check career master markdown file
      const careerProjectFile = path.join(tempDir, '.agents', 'career', 'projects', 'fintech-checkout-flow.md');
      assert.ok(fs.existsSync(careerProjectFile), 'Master markdown must be created');

      // Check site data json file
      const siteDataFile = path.join(tempDir, 'data', 'projects.json');
      assert.ok(fs.existsSync(siteDataFile), 'Site data json must be synced');

      const data = JSON.parse(fs.readFileSync(siteDataFile, 'utf8'));
      assert.ok(Array.isArray(data));
      const found = data.find(p => p.slug === 'fintech-checkout-flow');
      assert.ok(found, 'Published project must be present in projects.json');
      assert.equal(found.slug, 'fintech-checkout-flow');
    });

    test('rejects invalid case study data with descriptive validation errors', () => {
      const invalidProject = {
        slug: 'INVALID SLUG WITH SPACES',
        title: '', // Missing title
        isFeatured: 'yes' // Invalid type
      };

      const validation = validateProjectData(invalidProject);
      assert.equal(validation.valid, false);
      assert.ok(validation.errors.length >= 3);
    });
  });

  // =========================================================================
  // AC-016: Showcase Career Skills Packaging & Distribution
  // =========================================================================
  describe('AC-016: Showcase Career Skills Packaging & Distribution', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = createTempDir('ac016-');
    });

    afterEach(() => {
      cleanTempDir(tempDir);
    });

    test('scaffolds all 4 career skills into .agents/skills/ during initWorkspace', () => {
      const initRes = initWorkspace({ targetDir: tempDir });
      assert.ok(initRes.success);

      const targetSkillsDir = path.join(tempDir, '.agents', 'skills');
      const expectedSkills = ['showcase', 'resume-builder', 'job-hunter', 'project-publisher'];

      for (const skill of expectedSkills) {
        const skillDir = path.join(targetSkillsDir, skill);
        assert.ok(fs.existsSync(skillDir), `Skill directory .agents/skills/${skill} must exist`);
        assert.ok(fs.existsSync(path.join(skillDir, 'SKILL.md')), `Skill ${skill} must have SKILL.md`);
      }
    });

    test('verifies structure and references of all packaged career skills', () => {
      initWorkspace({ targetDir: tempDir });
      const targetSkillsDir = path.join(tempDir, '.agents', 'skills');

      // resume-builder
      const resumeBuilderDir = path.join(targetSkillsDir, 'resume-builder');
      assert.ok(fs.existsSync(path.join(resumeBuilderDir, 'references', 'ats_rules.md')));
      assert.ok(fs.existsSync(path.join(resumeBuilderDir, 'references', 'bullet_taxonomy.md')));
      assert.ok(fs.existsSync(path.join(resumeBuilderDir, 'templates', 'resume_template.html')));

      // job-hunter
      const jobHunterDir = path.join(targetSkillsDir, 'job-hunter');
      assert.ok(fs.existsSync(path.join(jobHunterDir, 'references', 'legitimacy_audit.md')));
      assert.ok(fs.existsSync(path.join(jobHunterDir, 'references', 'scoring_rubric.md')));
      assert.ok(fs.existsSync(path.join(jobHunterDir, 'references', 'proof_matrix.md')));
      assert.ok(fs.existsSync(path.join(jobHunterDir, 'references', 'pitch_templates.md')));
      assert.ok(fs.existsSync(path.join(jobHunterDir, 'templates', 'lead_card_template.md')));

      // project-publisher
      const projectPublisherDir = path.join(targetSkillsDir, 'project-publisher');
      assert.ok(fs.existsSync(path.join(projectPublisherDir, 'references', 'schema_contract.md')));
      assert.ok(fs.existsSync(path.join(projectPublisherDir, 'references', 'copy_rubric.md')));

      // showcase
      const showcaseDir = path.join(targetSkillsDir, 'showcase');
      assert.ok(fs.existsSync(path.join(showcaseDir, 'SKILL.md')));
      assert.ok(fs.existsSync(path.join(showcaseDir, 'scripts', 'init_workspace.js')));
    });

    test('preserves existing custom skill files non-destructively', () => {
      const customSkillDir = path.join(tempDir, '.agents', 'skills', 'custom-skill');
      fs.mkdirSync(customSkillDir, { recursive: true });
      fs.writeFileSync(path.join(customSkillDir, 'SKILL.md'), '---\nname: custom-skill\n---');

      initWorkspace({ targetDir: tempDir });

      assert.ok(fs.existsSync(path.join(customSkillDir, 'SKILL.md')));
      assert.equal(fs.readFileSync(path.join(customSkillDir, 'SKILL.md'), 'utf8'), '---\nname: custom-skill\n---');
    });
  });

});
