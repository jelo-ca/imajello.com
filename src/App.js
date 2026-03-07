import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import StatBlock from './components/StatBlock';
import ProjectCard from './components/ProjectCard';
import SettingsPanel from './components/SettingsPanel';
import CreditsPanel from './components/CreditsPanel';
import ContactPanel from './components/ContactPanel';
import { sfx, setSfxVolume, setMusicVolume } from './utils/sounds';
import { personalInfo, resumeModes, projects, experience, leadership } from './data/portfolioData';

const MODES = ['AI/ML', 'Fullstack', 'Gamedev'];
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
};

const bodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
  exit:   { opacity: 0, transition: { duration: 0.1 } },
};

const sidebarModeVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.18, ease: 'easeOut', staggerChildren: 0.07 } },
  exit:   { opacity: 0, x: 10, transition: { duration: 0.1 } },
};

export default function App() {
  const [mode, setMode]                     = useState('AI/ML');
  const [diceResult, setDiceResult]         = useState(null);
  const [diceRolling, setDiceRolling]       = useState(false);
  const [gpaFlash, setGpaFlash]             = useState(false);
  const [darkMode, setDarkMode]             = useState(false);
  const [scanlines, setScanlines]           = useState(false);
  const [settingsOpen, setSettingsOpen]     = useState(false);
  const [creditsOpen, setCreditsOpen]       = useState(false);
  const [contactOpen, setContactOpen]       = useState(false);
  const [konamiOverlay, setKonamiOverlay]   = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const [glitching, setGlitching]           = useState(false);
  const [sfxVol, setSfxVol]                 = useState(0.7);
  const [musicVol, setMusicVol]             = useState(0);
  const konamiRef                           = useRef([]);

  useEffect(() => { setSfxVolume(sfxVol); }, [sfxVol]);
  useEffect(() => { setMusicVolume(musicVol); }, [musicVol]);

  const currentMode    = resumeModes[mode];
  const modeProjects   = projects.filter(p => p.modes.includes(mode));
  const modeExperience = experience.filter(e => e.modes.includes(mode));

  function handleNameClick() {
    if (diceRolling) return;
    setDiceRolling(true);
    sfx.diceRoll();
    const result = rollD20();
    setTimeout(() => {
      setDiceResult(result);
      setDiceRolling(false);
      if (result === 20) sfx.nat20();
    }, 400);
    setTimeout(() => setDiceResult(null), 2500);
  }

  function handleGpaClick() {
    sfx.nat20();
    setGpaFlash(true);
    setTimeout(() => setGpaFlash(false), 1600);
  }

  useEffect(() => {
    function handleKey(e) {
      const next = [...konamiRef.current, e.key].slice(-KONAMI.length);
      konamiRef.current = next;
      if (next.join(',') === KONAMI.join(',')) {
        sfx.konami();
        setKonamiOverlay(true);
        setKonamiUnlocked(true);
        setGlitching(true);
        setTimeout(() => setGlitching(false), 450);
        setTimeout(() => setKonamiOverlay(false), 4000);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function handleDndRoll() {
    sfx.diceRoll();
    const r = rollD20();
    setTimeout(() => {
      if (r === 20) sfx.nat20();
      alert(
        r === 20 ? `🎲 NATURAL 20! The dungeon trembles.` :
        r === 1  ? `🎲 Nat 1. You trip over your dice bag.` :
                   `🎲 You rolled a ${r}.`
      );
    }, 350);
  }

  const appClass = [
    'app-bg',
    darkMode   ? 'konami'    : '',
    scanlines  ? 'scanlines' : '',
    glitching  ? 'glitching' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={appClass}>
      <motion.div
        className="sheet"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >

        {/* ── SIDEBAR ── */}
        <aside className="sheet-sidebar">
          <header className="sheet-header">
            <div className="name-wrap">
              <h1
                className="character-name"
                onClick={handleNameClick}
                title="Click to roll for initiative!"
              >
                Anjoelo Calderon
              </h1>
              <AnimatePresence>
                {diceResult !== null && (
                  <motion.div
                    className={`dice-popup ${diceResult === 20 ? 'nat20' : diceResult === 1 ? 'nat1' : ''}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {diceResult === 20 ? '✦ NATURAL 20!' : diceResult === 1 ? '✦ Nat 1...' : `✦ ${diceResult}`}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="class-line">
              <span>{currentMode.title}</span>
              <span className="sep">•</span>
              <span>De Anza College</span>
              <span className="sep">•</span>
              <span
                className={`gpa-label ${gpaFlash ? 'gpa-flash' : ''}`}
                onClick={handleGpaClick}
                title="Click me!"
              >
                {gpaFlash ? 'NATURAL 20 ✦' : 'GPA: 3.75'}
              </span>
            </p>

            <p className="flavor-italic">{currentMode.flavor}</p>

            <div className="contact-links">
              <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
              <span className="sep">•</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <span className="sep">•</span>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>

            <div className="mode-toggle">
              {MODES.map(m => (
                <button
                  key={m}
                  className={`mode-btn ${mode === m ? 'active' : ''}`}
                  onClick={() => { sfx.modeSwitch(); setMode(m); }}
                >
                  {m}
                </button>
              ))}
            </div>
          </header>

          <div className="ornament-divider">
            <span>■</span><span>■</span><span>■</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={sidebarModeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
            >
              <motion.div variants={panelVariants}>
                <StatBlock stats={currentMode.stats} />
              </motion.div>

              <motion.div className="panel" variants={panelVariants}>
                <h2 className="panel-title">Proficiencies & Languages</h2>
                <ul className="bullet-list">
                  {currentMode.skills.map(skill => (
                    <li key={skill}><span className="blt">►</span>{skill}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </aside>

        {/* ── MAIN ── */}
        <main className="sheet-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="sheet-body"
              variants={bodyVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >

              {/* LEFT COLUMN */}
              <div className="col">

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Equipment & Projects</h2>
                  {modeProjects.length === 0 ? (
                    <p className="flavor-italic muted-italic">
                      No quests logged for this class... yet.<br />Projects incoming.
                    </p>
                  ) : (
                    modeProjects.map(p => <ProjectCard key={p.name} project={p} />)
                  )}
                </motion.div>

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Background</h2>
                  <p className="flavor-italic">{currentMode.background}</p>

                  <div className="entry-block">
                    <span className="entry-label">Education</span>
                    <div className="entry-header">
                      <strong>{personalInfo.education.degree}</strong>
                    </div>
                    <div className="entry-sub">{personalInfo.education.school} · Cupertino, CA</div>
                    <div className="entry-meta">{personalInfo.education.expected} · GPA {personalInfo.education.gpa}</div>
                    <div className="entry-meta muted-italic">
                      {personalInfo.education.coursework.join(', ')}
                    </div>
                  </div>

                  {modeExperience.length > 0 && (
                    <div className="entry-block">
                      <span className="entry-label">Experience</span>
                      {modeExperience.map(exp => (
                        <div key={`${exp.org}-${exp.role}`} className="entry-item">
                          <div className="entry-header">
                            <strong>{exp.role}</strong>
                            <span className="entry-dates">{exp.dates}</span>
                          </div>
                          <div className="entry-sub">{exp.org} · {exp.location}</div>
                          <ul className="bullet-list small">
                            {exp.bullets.map((b, i) => (
                              <li key={i}><span className="blt">►</span>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="col">

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Leadership & Activities</h2>
                  {leadership.map(item => (
                    <div key={item.org} className="entry-item">
                      <div className="entry-header">
                        <strong>{item.role}</strong>
                        <span className="entry-dates">{item.dates}</span>
                      </div>
                      <div className="entry-sub">{item.org} · {item.location}</div>
                      <ul className="bullet-list small">
                        {item.bullets.map((b, i) => (
                          <li key={i}><span className="blt">►</span>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Personality Traits</h2>
                  <ul className="bullet-list">
                    {personalInfo.hobbies.map(h => (
                      <li key={h}>
                        <span className="blt">►</span>
                        {h}
                        {h === 'Dungeons & Dragons' && (
                          <button className="dice-btn" onClick={handleDndRoll} title="Roll a d20">🎲</button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="lang-line">
                    {personalInfo.languages.join(' · ')}
                  </div>
                </motion.div>


              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="sheet-footer">
          <span>© {new Date().getFullYear()} Anjoelo Calderon</span>
          <AnimatePresence mode="wait">
            {konamiUnlocked ? (
              <motion.span
                key="found"
                className="footer-secret found"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                ★ IDDQD
              </motion.span>
            ) : (
              <motion.span key="hidden" className="footer-secret hidden">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </motion.span>
            )}
          </AnimatePresence>
        </footer>
      </motion.div>

      {/* ── NAV FAB ── */}
      <div className="nav-fab">
        <button
          className="nav-btn"
          onMouseEnter={() => sfx.navHover()}
          onClick={() => { sfx.open(); setContactOpen(true); }}
        >
          [START]
        </button>
        <button
          className="nav-btn secondary"
          onMouseEnter={() => sfx.navHover()}
          onClick={() => { sfx.open(); setCreditsOpen(true); }}
        >
          [CREDITS]
        </button>
        <button
          className="nav-btn secondary"
          onMouseEnter={() => sfx.navHover()}
          onClick={() => { sfx.open(); setSettingsOpen(true); }}
        >
          [OPTIONS]
        </button>
      </div>

      {/* ── SETTINGS PANEL ── */}
      <AnimatePresence>
        {settingsOpen && (
          <SettingsPanel
            onClose={() => { sfx.close(); setSettingsOpen(false); }}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            scanlines={scanlines}
            setScanlines={setScanlines}
            sfxVol={sfxVol}
            setSfxVol={setSfxVol}
            musicVol={musicVol}
            setMusicVol={setMusicVol}
          />
        )}
      </AnimatePresence>

      {/* ── CONTACT PANEL ── */}
      <AnimatePresence>
        {contactOpen && (
          <ContactPanel onClose={() => { sfx.close(); setContactOpen(false); }} />
        )}
      </AnimatePresence>

      {/* ── CREDITS PANEL ── */}
      <AnimatePresence>
        {creditsOpen && (
          <CreditsPanel onClose={() => { sfx.close(); setCreditsOpen(false); }} />
        )}
      </AnimatePresence>

      {/* ── KONAMI ACHIEVEMENT OVERLAY ── */}
      <AnimatePresence>
        {konamiOverlay && (
          <motion.div
            className="konami-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setKonamiOverlay(false)}
          >
            <motion.div
              className="konami-achievement"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <p className="konami-ach-eyebrow">★ ACHIEVEMENT UNLOCKED ★</p>
              <p className="konami-ach-title">CHEAT CODE</p>
              <p className="konami-ach-title">ACTIVATED</p>
              <p className="konami-ach-sub">+99 TO ALL STATS</p>
              <p className="konami-ach-sub">INFINITE LIVES GRANTED</p>
              <p className="konami-ach-footer">[ CLICK TO CONTINUE ]</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
