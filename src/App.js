import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import StatBlock from "./components/StatBlock";
import ProjectCard from "./components/ProjectCard";
import SettingsPanel from "./components/SettingsPanel";
import CreditsPanel from "./components/CreditsPanel";
import ContactPanel from "./components/ContactPanel";
import QuestLog from "./components/QuestLog";
import { sfx, setSfxVolume, setMusicVolume } from "./utils/sounds";
import {
  personalInfo,
  resumeModes,
  projects,
  experience,
  leadership,
} from "./data/portfolioData";

const MODES = ["AI/ML", "Fullstack", "Gamedev"];
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const bodyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const sidebarModeVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: "easeOut", staggerChildren: 0.07 },
  },
  exit: { opacity: 0, x: 10, transition: { duration: 0.1 } },
};

export default function App() {
  const [mode, setMode] = useState("AI/ML");
  const [diceResult, setDiceResult] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [gpaFlash, setGpaFlash] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scanlines, setScanlines] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [konamiOverlay, setKonamiOverlay] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [sfxVol, setSfxVol] = useState(0.7);
  const [musicVol, setMusicVol] = useState(0);
  const [quest, setQuest] = useState({
    logOpen: false,
    modeSwitched: false,
    darkModeOn: false,
    projectsOpened: [],
    creditsRead: false,
    contactStarted: false,
    secretsFound: [],
  });
  const konamiRef = useRef([]);

  useEffect(() => {
    setSfxVolume(sfxVol);
  }, [sfxVol]);
  useEffect(() => {
    setMusicVolume(musicVol);
  }, [musicVol]);
  useEffect(() => {
    if (darkMode) setQuest((q) => ({ ...q, darkModeOn: true }));
  }, [darkMode]);

  function findSecret(key) {
    setQuest((q) => ({
      ...q,
      secretsFound: q.secretsFound.includes(key)
        ? q.secretsFound
        : [...q.secretsFound, key],
    }));
  }

  function trackProject(name) {
    setQuest((q) => ({
      ...q,
      projectsOpened: q.projectsOpened.includes(name)
        ? q.projectsOpened
        : [...q.projectsOpened, name],
    }));
  }

  const currentMode = resumeModes[mode];
  const modeProjects = projects.filter((p) => p.modes.includes(mode));
  const modeExperience = experience.filter((e) => e.modes.includes(mode));

  function handleNameClick() {
    if (diceRolling) return;
    findSecret("name");
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
    findSecret("gpa");
    sfx.nat20();
    setGpaFlash(true);
    setTimeout(() => setGpaFlash(false), 1600);
  }

  function handleUiHover() {
    sfx.navHover();
  }

  useEffect(() => {
    function handleKey(e) {
      const next = [...konamiRef.current, e.key].slice(-KONAMI.length);
      konamiRef.current = next;
      if (next.join(",") === KONAMI.join(",")) {
        findSecret("konami");
        sfx.konami();
        setKonamiOverlay(true);
        setKonamiUnlocked(true);
        setGlitching(true);
        setTimeout(() => setGlitching(false), 450);
        setTimeout(() => setKonamiOverlay(false), 4000);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleDndRoll() {
    findSecret("dice");
    sfx.diceRoll();
    const r = rollD20();
    setTimeout(() => {
      if (r === 20) sfx.nat20();
      alert(
        r === 20
          ? `🎲 NATURAL 20! The dungeon trembles.`
          : r === 1
          ? `🎲 Nat 1. You trip over your dice bag.`
          : `🎲 You rolled a ${r}.`,
      );
    }, 350);
  }

  const appClass = [
    "app-bg",
    darkMode ? "konami" : "",
    scanlines ? "scanlines" : "",
    glitching ? "glitching" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appClass}>
      <motion.div
        className="sheet"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* ── SIDEBAR ── */}
        <aside className="sheet-sidebar">
          <header className="sheet-header">
            <div className="name-wrap">
              <h1
                className="character-name"
                onClick={handleNameClick}
                onMouseEnter={handleUiHover}
                title="Click to roll for initiative!"
              >
                Anjoelo Calderon
              </h1>
              <AnimatePresence>
                {diceResult !== null && (
                  <motion.div
                    className={`dice-popup ${
                      diceResult === 20
                        ? "nat20"
                        : diceResult === 1
                        ? "nat1"
                        : ""
                    }`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {diceResult === 20
                      ? "✦ NATURAL 20!"
                      : diceResult === 1
                      ? "✦ Nat 1..."
                      : `✦ ${diceResult}`}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="class-line">{currentMode.title}</p>
            <p className="class-line sub">
              <span>De Anza College</span>
              <span className="sep">•</span>
              <span
                className={`gpa-label ${gpaFlash ? "gpa-flash" : ""}`}
                onClick={handleGpaClick}
                onMouseEnter={handleUiHover}
                title="Click me!"
              >
                {gpaFlash ? "NATURAL 20 ✦" : "GPA: 3.75"}
              </span>
            </p>

            <p className="flavor-italic">{currentMode.flavor}</p>

            <div className="contact-links">
              <a
                href={`mailto:${personalInfo.email}`}
                onMouseEnter={handleUiHover}
              >
                {personalInfo.email}
              </a>
              <div
                className="social-icons"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  onMouseEnter={handleUiHover}
                  title="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  onMouseEnter={handleUiHover}
                  title="GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="18"
                    height="18"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a
                  href={personalInfo.itch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  onMouseEnter={handleUiHover}
                  title="itch.io"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 245.371 220.736"
                    fill="currentColor"
                    width="18"
                    height="18"
                  >
                    <path d="M31.99 1.365C21.287 7.556.2 31.811 0 38.298v10.044c0 12.88 12.158 24.996 24.096 24.996 13.764 0 24.996-11.232 24.996-24.996 0 13.764 11.232 24.996 24.996 24.996S99.084 61.91 99.084 48.146c0 13.764 11.232 24.996 24.996 24.996s24.996-11.232 24.996-24.996c0 13.764 11.232 24.996 24.996 24.996s24.996-11.232 24.996-24.996c0 13.764 11.232 24.996 24.996 24.996 11.938 0 24.096-11.116 24.096-24.996V38.298c-.2-6.487-21.287-30.742-31.99-36.933C210.502.518 55.816.385 31.99 1.365zm80.026 61.498c-3.285 8.103-7.962 12.853-11.305 14.67-3.343 1.818-5.996 1.838-8.012 1.17-2.017-.67-4.143-2.17-4.923-3.986-.78-1.818-.174-4.005 1.538-6.116 1.71-2.11 4.416-4.143 7.52-5.87 3.104-1.728 6.606-3.149 9.897-4.043 3.29-.894 6.361-1.26 8.344-.776l-3.059 4.951zm51.424 0c-3.285 8.103-7.962 12.853-11.305 14.67-3.343 1.818-5.996 1.838-8.012 1.17-2.017-.67-4.143-2.17-4.923-3.986-.78-1.818-.174-4.005 1.538-6.116 1.71-2.11 4.416-4.143 7.52-5.87 3.104-1.728 6.606-3.149 9.897-4.043 3.29-.894 6.361-1.26 8.344-.776l-3.059 4.951zM.006 85.644v92.824c0 23.213 47.43 42.268 106.058 42.268h33.244c58.627 0 106.058-19.055 106.058-42.268V85.644H.006zm108.03 19.666h29.28c6.46 0 11.696 5.236 11.696 11.697v29.277a11.696 11.696 0 01-11.696 11.697h-29.28a11.697 11.697 0 01-11.697-11.697v-29.277c0-6.461 5.237-11.697 11.697-11.697z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mode-toggle">
              {MODES.map((m) => (
                <button
                  key={m}
                  className={`mode-btn ${mode === m ? "active" : ""}`}
                  onMouseEnter={handleUiHover}
                  onClick={() => {
                    sfx.modeSwitch();
                    if (m !== mode)
                      setQuest((q) => ({ ...q, modeSwitched: true }));
                    setMode(m);
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </header>

          <div className="ornament-divider">
            <span>■</span>
            <span>■</span>
            <span>■</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={sidebarModeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <motion.div variants={panelVariants}>
                <StatBlock stats={currentMode.stats} />
              </motion.div>

              <motion.div className="panel" variants={panelVariants}>
                <h2 className="panel-title">Proficiencies & Languages</h2>
                <ul className="bullet-list">
                  {currentMode.skills.map((skill) => (
                    <li key={skill}>
                      <span className="blt">►</span>
                      {skill}
                    </li>
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
                      No quests logged for this class... yet.
                      <br />
                      Projects incoming.
                    </p>
                  ) : (
                    modeProjects.map((p) => (
                      <ProjectCard
                        key={p.name}
                        project={p}
                        onExpand={trackProject}
                      />
                    ))
                  )}
                </motion.div>

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Summary</h2>
                  <p className="flavor-italic">{currentMode.background}</p>
                </motion.div>

                {modeExperience.length > 0 && (
                  <motion.div className="panel" variants={panelVariants}>
                    <h2 className="panel-title">Experience</h2>
                    {modeExperience.map((exp) => (
                      <div
                        key={`${exp.org}-${exp.role}`}
                        className="entry-item"
                      >
                        <div className="entry-header">
                          <strong>{exp.role}</strong>
                          <span className="entry-dates">{exp.dates}</span>
                        </div>
                        <div className="entry-sub">
                          {exp.org} · {exp.location}
                        </div>
                        <ul className="bullet-list small">
                          {exp.bullets.map((b, i) => (
                            <li key={i}>
                              <span className="blt">►</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="col">
                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Leadership & Activities</h2>
                  {leadership.map((item) => (
                    <div key={item.org} className="entry-item">
                      <div className="entry-header">
                        <strong>{item.role}</strong>
                        <span className="entry-dates">{item.dates}</span>
                      </div>
                      <div className="entry-sub">
                        {item.org} · {item.location}
                      </div>
                      <ul className="bullet-list small">
                        {item.bullets.map((b, i) => (
                          <li key={i}>
                            <span className="blt">►</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Personality Traits</h2>
                  <ul className="bullet-list">
                    {personalInfo.hobbies.map((h) => (
                      <li key={h}>
                        <span className="blt">►</span>
                        {h}
                        {h === "Dungeons & Dragons" && (
                          <button
                            className="dice-btn"
                            onMouseEnter={handleUiHover}
                            onClick={handleDndRoll}
                            title="Roll a d20"
                          >
                            🎲
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="lang-line">
                    {personalInfo.languages.join(" · ")}
                  </div>
                </motion.div>

                <motion.div className="panel" variants={panelVariants}>
                  <h2 className="panel-title">Education</h2>
                  <div className="entry-item">
                    <div className="entry-header">
                      <strong>{personalInfo.education.degree}</strong>
                    </div>
                    <div className="entry-sub">
                      {personalInfo.education.school} · Cupertino, CA
                    </div>
                    <div className="entry-meta">
                      {personalInfo.education.expected} · GPA{" "}
                      {personalInfo.education.gpa}
                    </div>
                    <div className="entry-meta muted-italic">
                      {personalInfo.education.coursework.join(", ")}
                    </div>
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
          onMouseEnter={handleUiHover}
          onClick={() => {
            sfx.open();
            setContactOpen(true);
            setQuest((q) => ({ ...q, contactStarted: true }));
          }}
        >
          [START]
        </button>
        <button
          className="nav-btn secondary"
          onMouseEnter={handleUiHover}
          onClick={() => {
            sfx.open();
            setCreditsOpen(true);
            setQuest((q) => ({ ...q, creditsRead: true }));
          }}
        >
          [CREDITS]
        </button>
        <button
          className="nav-btn secondary"
          onMouseEnter={handleUiHover}
          onClick={() => {
            sfx.open();
            setSettingsOpen(true);
          }}
        >
          [OPTIONS]
        </button>
      </div>

      {/* ── SETTINGS PANEL ── */}
      <AnimatePresence>
        {settingsOpen && (
          <SettingsPanel
            onClose={() => {
              sfx.close();
              setSettingsOpen(false);
            }}
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
          <ContactPanel
            onClose={() => {
              sfx.close();
              setContactOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── CREDITS PANEL ── */}
      <AnimatePresence>
        {creditsOpen && (
          <CreditsPanel
            onClose={() => {
              sfx.close();
              setCreditsOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── QUEST LOG ── */}
      <QuestLog
        quest={quest}
        onToggle={() => setQuest((q) => ({ ...q, logOpen: !q.logOpen }))}
      />

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
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
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
