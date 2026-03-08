import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/sounds';

const STATUS_STYLE = {
  'Shipped':     { background: 'var(--charcoal)', color: 'var(--cream)' },
  'In Progress': { background: 'var(--rose)',     color: 'var(--midnight)' },
  'Ongoing':     { background: 'var(--sand)',     color: 'var(--charcoal)' },
};

export default function ProjectCard({ project, onExpand }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = STATUS_STYLE[project.status] || {};

  function handleToggle() {
    const opening = !expanded;
    setExpanded(opening);
    if (opening) { sfx.open();  onExpand?.(project.name); }
    else           sfx.close();
  }

  return (
    <div className={`project-card ${expanded ? 'expanded' : ''}`}>
      <div
        className="project-header"
        onClick={handleToggle}
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
          <motion.span
            className="expand-icon"
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            ▶
          </motion.span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="project-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
