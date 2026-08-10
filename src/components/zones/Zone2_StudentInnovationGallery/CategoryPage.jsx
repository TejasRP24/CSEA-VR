import React, { useState } from 'react';
import '../../../components-css/Zone2.css';
import { PROJECTS_DATA } from './ProjectsData';

const sanitizeIcon = (icon) => {
  if (!icon) return '';
  return icon.replace(/[^\u0000-\uFFFF]/g, '') || '•';
};

const EmptyState = ({ category }) => (
  <div className="z2-empty-state">
    <div className="z2-empty-icon" style={{ background: category.lightColor, color: category.accentColor }}>
      🚧
    </div>
    <h3 className="z2-empty-title">Projects Coming Soon</h3>
    <p className="z2-empty-desc">
      No projects have been added to <strong>{category.name}</strong> yet.
      Check back soon — this space is filling up fast.
    </p>
    <div className="z2-empty-pill" style={{ borderColor: category.accentColor + '50', color: category.accentColor, background: category.lightColor }}>
      Be the first to add a project
    </div>
  </div>
);

const CategoryPage = ({ category, onBack, onProjectClick }) => {
  const projects = PROJECTS_DATA[category.id] || [];
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div className="z2-catpage slide-up">
      {/* Page header */}
      <div className="z2-catpage-header" style={{ '--accent': category.accentColor }}>
        <div className="z2-catpage-meta">
          <span className="z2-catpage-num">{category.number}</span>
          <div>
            <span className="z2-catpage-eyebrow" style={{ color: category.accentColor }}>
              {category.count} Active Projects
            </span>
            <h1 className="z2-catpage-title">{category.name}</h1>
            <p className="z2-catpage-desc">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Project list or empty state */}
      {projects.length === 0 ? (
        <EmptyState category={category} />
      ) : (
        <div className="z2-project-list">
          {projects.map((proj, i) => (
            <button
              key={i}
              className={`z2-proj-row ${hoveredIdx === i ? 'hovered' : ''}`}
              style={{ '--accent': category.accentColor, animationDelay: `${i * 0.07}s` }}
              onClick={() => onProjectClick(proj)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="z2-proj-row-left">
                <span className="z2-proj-idx">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="z2-proj-icon-sm">{sanitizeIcon(proj.icon)}</span>
                <div className="z2-proj-info">
                  <span className="z2-proj-name">{proj.name}</span>
                  <span className="z2-proj-short">{proj.shortDesc}</span>
                </div>
              </div>
              <div className="z2-proj-row-right">
                <div className="z2-proj-tags">
                  {proj.tags.map((tag, ti) => (
                    <span key={ti} className="z2-proj-tag" style={{ borderColor: `${category.accentColor}30`, color: category.accentColor }}>
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Media badge */}
                {proj.media && proj.media.length > 0 && (
                  <span className="z2-proj-media-badge" style={{ background: category.lightColor, color: category.accentColor }}>
                    📷 {proj.media.length}
                  </span>
                )}
                <span className="z2-proj-arrow" style={{ color: category.accentColor }}>→</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
