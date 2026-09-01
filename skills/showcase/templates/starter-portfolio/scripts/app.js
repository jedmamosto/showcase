/**
 * Showcase Greenfield Starter Portfolio Engine
 * Zero-dependency, accessible vanilla JavaScript.
 * Runs instantly via file:/// double-click or HTTP/HTTPS static hosting.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Embedded Fallback Data (Ensures instant rendering without CORS blocks)
  // --------------------------------------------------------------------------
  const EMBEDDED_PROJECTS = [
    {
      slug: 'cloud-analytics-dashboard',
      title: 'Cloud Analytics Dashboard',
      tagline: 'Redesigned the core monitoring flow for 12,000 active engineers, cutting setup time by 40%.',
      category: 'UX Design',
      role: 'Lead Product Designer',
      organization: 'CloudScale Systems',
      timeframe: '2025',
      status: 'Production',
      statusBadge: 'Live in Production',
      isFeatured: true,
      featuredRank: 1,
      liveUrl: 'https://example.com/cloud-analytics',
      githubUrl: 'https://github.com/example/cloud-analytics',
      stack: ['Product Design', 'B2B SaaS', 'Design Systems'],
      metrics: [
        { label: 'Setup Time', value: '-40%', detail: 'Reduced from 15m to 9m' },
        { label: 'Active Users', value: '12,000+', detail: 'Weekly engineers' }
      ],
      description: 'A unified telemetry and observability workspace that allows infrastructure engineers to identify and resolve latency bottlenecks in minutes. Built after interviewing 24 senior DevOps leads.'
    },
    {
      slug: 'paypulse-checkout-experience',
      title: 'PayPulse Checkout Experience',
      tagline: 'Simplified payment steps and boosted mobile checkout completion by 28%.',
      category: 'FinTech',
      role: 'Senior UX/UI Designer',
      organization: 'PayPulse Inc.',
      timeframe: '2024',
      status: 'Production',
      statusBadge: 'Live in Production',
      isFeatured: true,
      featuredRank: 2,
      liveUrl: 'https://example.com/paypulse',
      githubUrl: 'https://github.com/example/paypulse',
      stack: ['Mobile App', 'FinTech', 'Checkout Flow'],
      metrics: [
        { label: 'Conversion Rate', value: '+28%', detail: 'Mobile checkout increase' },
        { label: 'Drop-off Rate', value: '-35%', detail: 'Fewer payment errors' }
      ],
      description: 'Streamlined one-tap payment experience designed for global ecommerce customers with native biometric authentication and smart form validation.'
    },
    {
      slug: 'zenith-developer-platform',
      title: 'Zenith Developer Platform',
      tagline: 'Built a modular documentation system and API sandbox for 50,000 third-party developers.',
      category: 'AI Product',
      role: 'Design Systems Engineer',
      organization: 'Zenith AI',
      timeframe: '2024',
      status: 'Production',
      statusBadge: 'Live in Production',
      isFeatured: true,
      featuredRank: 3,
      liveUrl: 'https://example.com/zenith',
      githubUrl: 'https://github.com/example/zenith',
      stack: ['Developer Tools', 'AI Product', 'Design Systems'],
      metrics: [
        { label: 'API Adoption', value: '+65%', detail: 'Quarter-over-quarter growth' },
        { label: 'Support Tickets', value: '-50%', detail: 'Fewer integration issues' }
      ],
      description: 'Interactive API playground and component library allowing developers to test AI endpoints in real time directly from the browser with zero install.'
    }
  ];

  // --------------------------------------------------------------------------
  // 2. State & DOM Cache
  // --------------------------------------------------------------------------
  let currentProjects = [...EMBEDDED_PROJECTS];
  const THEME_STORAGE_KEY = 'showcase_portfolio_theme';
  const VALID_THEMES = ['warm-editorial', 'clean-minimal', 'bold-creative', 'dark-studio'];

  const dom = {
    html: document.documentElement,
    themeSelect: document.getElementById('theme-select'),
    projectsGrid: document.getElementById('projects-grid'),
    mobileNavBtn: document.getElementById('mobile-nav-btn'),
    siteNav: document.getElementById('site-nav'),
    modalBackdrop: document.getElementById('case-study-modal'),
    modalContent: document.getElementById('modal-content'),
    modalCloseBtn: document.getElementById('modal-close-btn')
  };

  // --------------------------------------------------------------------------
  // 3. Theme Engine
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let activeTheme = 'warm-editorial';
    if (savedTheme && VALID_THEMES.includes(savedTheme)) {
      activeTheme = savedTheme;
    } else if (prefersDark) {
      activeTheme = 'dark-studio';
    }

    applyTheme(activeTheme);

    if (dom.themeSelect) {
      dom.themeSelect.value = activeTheme;
      dom.themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
      });
    }
  }

  function applyTheme(themeName) {
    if (!VALID_THEMES.includes(themeName)) return;
    dom.html.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (err) {
      // Ignore localStorage exceptions in private browsing
    }
  }

  // --------------------------------------------------------------------------
  // 4. Project Card Renderer
  // --------------------------------------------------------------------------
  function createProjectCardElement(project, index) {
    const card = document.createElement('article');
    card.className = 'project-card card-interactive';
    card.setAttribute('data-slug', project.slug || '');

    // Generate stack badges
    const stackBadges = (project.stack || [])
      .map(tag => `<span class="badge">${escapeHtml(tag)}</span>`)
      .join('');

    // Generate metric blocks
    let metricsHtml = '';
    if (Array.isArray(project.metrics) && project.metrics.length > 0) {
      metricsHtml = `
        <div class="project-metrics-grid" role="group" aria-label="Project metrics">
          ${project.metrics.slice(0, 2).map(m => `
            <div class="metric-item">
              <span class="metric-value">${escapeHtml(m.value)}</span>
              <span class="metric-label">${escapeHtml(m.label)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Category SVG Artwork Icon
    const artIcon = getCategorySvgIcon(project.category);

    card.innerHTML = `
      <div class="project-media-wrap">
        <div class="project-media-art">
          ${artIcon}
          <span>${escapeHtml(project.category || 'Featured Work')}</span>
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta-row">
          <div class="project-stack-tags">
            ${stackBadges}
          </div>
          <span class="project-year">${escapeHtml(project.timeframe || '')}</span>
        </div>
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <p class="project-tagline">${escapeHtml(project.tagline)}</p>
        ${metricsHtml}
        <div class="project-actions">
          <button type="button" class="btn btn-secondary btn-sm open-study-btn" data-index="${index}" aria-label="Read full case study for ${escapeHtml(project.title)}">
            Read Case Study <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          ${project.liveUrl ? `
            <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm" aria-label="Visit live website for ${escapeHtml(project.title)} (opens in new tab)">
              Live Link <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          ` : ''}
        </div>
      </div>
    `;

    return card;
  }

  function renderProjects(projects) {
    if (!dom.projectsGrid) return;
    dom.projectsGrid.innerHTML = '';

    if (!projects || projects.length === 0) {
      dom.projectsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
          <h3 style="margin-bottom: 0.5rem; font-family: var(--font-heading);">No Projects Added Yet</h3>
          <p style="color: var(--ink-muted); font-size: var(--text-sm);">Run <code>/showcase publish</code> to add your first case study.</p>
        </div>
      `;
      return;
    }

    projects.forEach((proj, idx) => {
      const cardEl = createProjectCardElement(proj, idx);
      dom.projectsGrid.appendChild(cardEl);
    });

    // Attach case study click listeners
    const studyButtons = dom.projectsGrid.querySelectorAll('.open-study-btn');
    studyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (!isNaN(index) && currentProjects[index]) {
          openCaseStudyModal(currentProjects[index]);
        }
      });
    });
  }

  async function loadProjectsData() {
    // Attempt dynamic fetch if served over HTTP/HTTPS
    if (window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('data/projects.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            currentProjects = data;
          }
        }
      } catch (err) {
        // Fallback gracefully to embedded dataset
      }
    }
    renderProjects(currentProjects);
  }

  // --------------------------------------------------------------------------
  // 5. Case Study Modal Dialog
  // --------------------------------------------------------------------------
  function openCaseStudyModal(project) {
    if (!dom.modalBackdrop || !dom.modalContent) return;

    const metricsHtml = (project.metrics || []).map(m => `
      <div style="padding: 0.75rem; background: var(--surface-raised); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div style="font-family: var(--font-mono); font-size: var(--text-xl); font-weight: 700; color: var(--accent);">${escapeHtml(m.value)}</div>
        <div style="font-size: var(--text-xs); color: var(--ink-muted);">${escapeHtml(m.label)}</div>
        ${m.detail ? `<div style="font-size: var(--text-xs); color: var(--ink-muted); margin-top: 2px;">${escapeHtml(m.detail)}</div>` : ''}
      </div>
    `).join('');

    const stackBadges = (project.stack || [])
      .map(tag => `<span class="badge">${escapeHtml(tag)}</span>`)
      .join('');

    dom.modalContent.innerHTML = `
      <div style="margin-bottom: var(--space-md);">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          ${stackBadges}
        </div>
        <h2 style="font-family: var(--font-heading); font-size: var(--text-2xl); font-weight: 700; color: var(--ink); line-height: 1.2;">
          ${escapeHtml(project.title)}
        </h2>
        <div style="font-size: var(--text-sm); color: var(--ink-muted); margin-top: 0.25rem;">
          ${escapeHtml(project.role || '')} · ${escapeHtml(project.organization || '')} · ${escapeHtml(project.timeframe || '')}
        </div>
      </div>

      <p style="font-size: var(--text-base); color: var(--ink); line-height: 1.6; margin-bottom: var(--space-lg);">
        ${escapeHtml(project.description || project.tagline)}
      </p>

      ${metricsHtml ? `
        <div style="margin-bottom: var(--space-lg);">
          <div style="font-size: var(--text-xs); font-family: var(--font-mono); text-transform: uppercase; color: var(--ink-muted); margin-bottom: 0.5rem; font-weight: 600;">Key Outcomes</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
            ${metricsHtml}
          </div>
        </div>
      ` : ''}

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; padding-top: var(--space-md); border-top: 1px solid var(--border-subtle);">
        ${project.liveUrl ? `
          <a href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Visit Live Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
        ` : ''}
        ${project.githubUrl ? `
          <a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            View Source Code <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          </a>
        ` : ''}
      </div>
    `;

    dom.modalBackdrop.classList.add('active');
    dom.modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyModal() {
    if (!dom.modalBackdrop) return;
    dom.modalBackdrop.classList.remove('active');
    dom.modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --------------------------------------------------------------------------
  // 6. Navigation & Helpers
  // --------------------------------------------------------------------------
  function initNavigation() {
    if (dom.mobileNavBtn && dom.siteNav) {
      dom.mobileNavBtn.addEventListener('click', () => {
        const isOpen = dom.siteNav.classList.toggle('mobile-open');
        dom.mobileNavBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close mobile nav when link is clicked
      dom.siteNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          dom.siteNav.classList.remove('mobile-open');
          dom.mobileNavBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closeCaseStudyModal);
    }

    if (dom.modalBackdrop) {
      dom.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.modalBackdrop) {
          closeCaseStudyModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.modalBackdrop && dom.modalBackdrop.classList.contains('active')) {
        closeCaseStudyModal();
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getCategorySvgIcon(category) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('design') || cat.includes('ux') || cat.includes('ui')) {
      return `<svg class="project-media-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;
    }
    if (cat.includes('fintech') || cat.includes('pay')) {
      return `<svg class="project-media-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`;
    }
    if (cat.includes('ai') || cat.includes('dev') || cat.includes('tool')) {
      return `<svg class="project-media-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
    }
    return `<svg class="project-media-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
  }

  // --------------------------------------------------------------------------
  // 7. Initialization
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    loadProjectsData();
  });
})();
