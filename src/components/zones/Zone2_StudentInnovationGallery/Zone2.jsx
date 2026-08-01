import React, { useState, useEffect } from 'react';
import '../../../components-css/Zone2.css';
import CategoryPage from './CategoryPage';
import ProjectDetail from './ProjectDetail';

const CATEGORIES = [
  {
    id: 'first-year',
    number: '01',
    name: 'First-Year Projects',
    tagline: 'Where curiosity meets engineering',
    description:
      'Foundation-level innovations from first-semester students tackling real-world problems with fresh, uninhibited perspectives.',
    count: '12+',
    icon: '🌱',
    accentColor: '#6B9B6D',
    lightColor:  '#EBF3EB',
  },
  {
    id: 'mini',
    number: '02',
    name: 'Mini Projects',
    tagline: 'Domain-specific applied solutions',
    description:
      'Focused problem-solving initiatives spanning IoT, AI, web platforms, and embedded systems built by second-year teams.',
    count: '35+',
    icon: '⚡',
    accentColor: '#6289A8',
    lightColor:  '#E4EEF5',
  },
  {
    id: 'capstone',
    number: '03',
    name: 'Capstone Projects',
    tagline: 'Industry-grade end-to-end systems',
    description:
      'Comprehensive research and development prototypes built over full academic years, deployment-ready and battle-tested.',
    count: '24+',
    icon: '🏺',
    accentColor: '#B56A4A',
    lightColor:  '#F6EAE1',
  },
  {
    id: 'hackathon',
    number: '04',
    name: 'Hackathon Winners',
    tagline: 'National & international champions',
    description:
      'Award-winning teams who delivered outstanding innovations under intense time pressure at national and international events.',
    count: '15+',
    icon: '🏆',
    accentColor: '#C49830',
    lightColor:  '#F7EDD5',
  },
];

const sanitizeIcon = (icon) => {
  if (!icon) return '';
  return String(icon).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, '') || '';
};

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => localStorage.getItem('site-theme') || '');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-one', 'theme-two');
    if (theme) root.classList.add(theme);
    localStorage.setItem('site-theme', theme || '');
  }, [theme]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => setTheme('theme-one')}
        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: theme==='theme-one' ? 'var(--accent)' : 'var(--bg)', color: theme==='theme-one' ? 'var(--bg)' : 'var(--text)'}}
      >Theme A</button>
      <button
        onClick={() => setTheme('theme-two')}
        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: theme==='theme-two' ? 'var(--accent)' : 'var(--bg)', color: theme==='theme-two' ? 'var(--bg)' : 'var(--text)'}}
      >Theme B</button>
      <button
        onClick={() => setTheme('')}
        style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: theme==='' ? 'var(--accent)' : 'var(--bg)', color: theme==='' ? 'var(--bg)' : 'var(--text)'}}
      >Default</button>
    </div>
  );
}

const Zone2 = () => {
  const [view, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setView('category');
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setView('project');
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setSelectedProject(null);
    setView('home');
  };

  const handleBackToCategory = () => {
    setSelectedProject(null);
    setView('category');
  };

  return (
    <div className="z2-root">

      {/* Theme switcher — quick review toggles */}
      <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 60 }}>
        <ThemeSwitcher />
      </div>

      {/* Breadcrumb */}
      {view !== 'home' && (
        <nav className="z2-breadcrumb slide-up">
          <button className="z2-bc-btn" onClick={handleBackToHome}>Gallery</button>
          {selectedCategory && (
            <>
              <span className="z2-bc-sep">›</span>
              <button
                className="z2-bc-btn"
                onClick={view === 'project' ? handleBackToCategory : undefined}
                style={view === 'category' ? { color: 'var(--text-h)', cursor: 'default' } : {}}
              >
                {selectedCategory.name}
              </button>
            </>
          )}
          {view === 'project' && selectedProject && (
            <>
              <span className="z2-bc-sep">›</span>
              <span className="z2-bc-current">{selectedProject.name}</span>
            </>
          )}
        </nav>
      )}

      {/* ── LEVEL 1: Home ── */}
      {view === 'home' && (
        <div className="z2-home slide-up">
          <div className="z2-hero">
            <span className="z2-eyebrow">PSG College of Technology · Department of CSE</span>
            <h1 className="z2-hero-title">
              Student<br />
              <em className="z2-hero-em">Innovation</em><br />
              Gallery
            </h1>
            <p className="z2-hero-sub">
              Four tracks. Hundreds of ideas. Explore groundbreaking projects built by students
              who refused to wait to change the world.
            </p>
          </div>

          <div className="z2-categories-grid">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                className="z2-cat-card"
                style={{
                  '--accent':       cat.accentColor,
                  '--accent-light': cat.lightColor,
                  animationDelay:   `${i * 0.09}s`,
                }}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="z2-cat-card-inner">
                  <div className="z2-cat-top">
                    <span className="z2-cat-icon">{sanitizeIcon(cat.icon)}</span>
                    <span className="z2-cat-count">{cat.count} projects</span>
                  </div>
                  <div className="z2-cat-body">
                    <span className="z2-cat-number">{cat.number}</span>
                    <h2 className="z2-cat-name">{cat.name}</h2>
                    <p className="z2-cat-tagline">{cat.tagline}</p>
                    <p className="z2-cat-desc">{cat.description}</p>
                  </div>
                  <div className="z2-cat-cta">
                    <span>Explore projects</span>
                    <span className="z2-cat-arrow">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── LEVEL 2: Category ── */}
      {view === 'category' && selectedCategory && (
        <CategoryPage
          category={selectedCategory}
          onProjectClick={handleProjectClick}
        />
      )}

      {/* ── LEVEL 3: Project Detail ── */}
      {view === 'project' && selectedProject && (
        <ProjectDetail
          project={selectedProject}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default Zone2;
