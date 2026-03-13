import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "../utils/sounds";

const SPARKLE_DIRS = [
  { tx: "-14px", ty: "-12px" },
  { tx: "0px", ty: "-16px" },
  { tx: "14px", ty: "-12px" },
  { tx: "16px", ty: "0px" },
  { tx: "14px", ty: "12px" },
  { tx: "0px", ty: "16px" },
  { tx: "-14px", ty: "12px" },
  { tx: "-16px", ty: "0px" },
];

function Sparkles({ active, onDone }) {
  if (!active) return null;
  return SPARKLE_DIRS.map((dir, i) => (
    <span
      key={i}
      className="quest-sparkle"
      style={{
        "--tx": dir.tx,
        "--ty": dir.ty,
        animationDelay: `${i * 20}ms`,
        background: i % 2 === 0 ? "var(--rose)" : "var(--charcoal)",
      }}
      onAnimationEnd={i === SPARKLE_DIRS.length - 1 ? onDone : undefined}
    />
  ));
}

const MAIN_QUESTS = [
  { key: "modeSwitched", label: "Switch resume style" },
  { key: "darkModeOn", label: "Enable dark mode" },
  { key: "projectsOpened", label: "Open 3 projects", progress: true, max: 3 },
  { key: "creditsRead", label: "Read the credits" },
  { key: "contactStarted", label: "Begin your journey" },
];

const SECRETS_TOTAL = 3;

function isDone(q, quest) {
  if (q.progress) return (quest[q.key]?.length ?? 0) >= q.max;
  return !!quest[q.key];
}

export default function QuestLog({ quest, onToggle }) {
  const doneCnt = MAIN_QUESTS.filter((q) => isDone(q, quest)).length;
  const allDone = doneCnt === MAIN_QUESTS.length;
  const secrets = quest.secretsFound?.length ?? 0;
  const allSecrets = secrets === SECRETS_TOTAL;

  const [justDone, setJustDone] = useState({});
  const prevDone = useRef(null);

  // Initialize so already-done quests don't animate on mount
  if (prevDone.current === null) {
    const init = {};
    MAIN_QUESTS.forEach((q) => {
      init[q.key] = isDone(q, quest);
    });
    init._secrets = (quest.secretsFound?.length ?? 0) >= SECRETS_TOTAL;
    prevDone.current = init;
  }

  useEffect(() => {
    const newly = {};
    MAIN_QUESTS.forEach((q) => {
      const now = isDone(q, quest);
      if (!prevDone.current[q.key] && now) newly[q.key] = true;
      prevDone.current[q.key] = now;
    });
    const secretsNow = (quest.secretsFound?.length ?? 0) >= SECRETS_TOTAL;
    if (!prevDone.current._secrets && secretsNow) newly._secrets = true;
    prevDone.current._secrets = secretsNow;
    if (Object.keys(newly).length > 0) setJustDone((p) => ({ ...p, ...newly }));
  }, [quest]);

  function clear(key) {
    setJustDone((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  }

  return (
    <div className="quest-widget">
      <button
        className={`quest-toggle${allDone ? " complete" : ""}`}
        onMouseEnter={() => sfx.navHover()}
        onClick={onToggle}
      >
        {allDone ? "✦ COMPLETE" : `■ QUESTS [${doneCnt}/${MAIN_QUESTS.length}]`}
      </button>
      <AnimatePresence>
        {quest.logOpen && (
          <motion.div
            className="quest-panel"
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="quest-title">
              {allDone ? "✦ QUEST COMPLETE ✦" : "══ QUEST LOG ══"}
            </div>
            <div className="quest-divider" />
            <ul className="quest-list">
              {MAIN_QUESTS.map((q) => {
                const done = isDone(q, quest);
                const val = q.progress ? quest[q.key]?.length ?? 0 : null;
                return (
                  <li
                    key={q.key}
                    className={`quest-item${done ? " done" : ""}${
                      justDone[q.key] ? " just-done" : ""
                    }`}
                    onAnimationEnd={
                      justDone[q.key]
                        ? (e) => {
                            if (e.animationName === "quest-shake") clear(q.key);
                          }
                        : undefined
                    }
                  >
                    <Sparkles
                      active={!!justDone[q.key]}
                      onDone={() => clear(q.key)}
                    />
                    <span className="quest-check">{done ? "✦" : "○"}</span>
                    <span className="quest-label">
                      {q.label}
                      {q.progress && !done && (
                        <span className="quest-frac">
                          {" "}
                          {val}/{q.max}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="quest-divider" />
            <div
              className={`quest-item quest-secrets${allSecrets ? " done" : ""}${
                justDone._secrets ? " just-done" : ""
              }`}
              onAnimationEnd={
                justDone._secrets
                  ? (e) => {
                      if (e.animationName === "quest-shake") clear("_secrets");
                    }
                  : undefined
              }
            >
              <Sparkles
                active={!!justDone._secrets}
                onDone={() => clear("_secrets")}
              />
              <span className="quest-check">{allSecrets ? "✦" : "○"}</span>
              <span className="quest-label">
                Find the secrets
                <span className="quest-frac">
                  {" "}
                  {secrets}/{SECRETS_TOTAL}
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
