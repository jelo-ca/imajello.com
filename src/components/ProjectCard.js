import { useState } from 'react';

const STATUS_STYLE = {
  'Shipped':     { background: 'var(--charcoal)', color: 'var(--cream)' },
  'In Progress': { background: 'var(--rose)',     color: 'var(--midnight)' },
  'Ongoing':     { background: 'var(--sand)',     color: 'var(--charcoal)' },
};

export default function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = STATUS_STYLE[project.status] || {};

  return (
    <div className={`project-card ${expanded ? 'expanded' : ''}`}>
      <div
        className="project-header"
        onClick={() => setExpanded(e => !e)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="project-header-left">
          <span className="project-name">{project.name}</span>
          {project.dates && <span className="project-dates">{project.dates}</span>}
        </div>
        <div className="project-header-right">
          {project.status && (
            <span className="project-status" style={statusStyle}>{project.status}</span>
          )}
          <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {expanded && (
        <div className="project-details">
          <p className="project-description">{project.description}</p>
          <ul className="bullet-list small project-bullets">
            {project.bullets.map((b, i) => (
              <li key={i}><span className="blt">►</span>{b}</li>
            ))}
          </ul>
          <div className="project-tags">
            {project.tech.map(t => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Visit Site →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
