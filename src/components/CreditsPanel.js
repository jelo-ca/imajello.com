import { motion } from "framer-motion";

export default function CreditsPanel({ onClose }) {
  return (
    <motion.div
      className="settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.div
        className="settings-panel"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-title">══ CREDITS ══</div>
        <div className="settings-divider" />

        <div className="credits-body">
          <p className="credits-sub">Website</p>
          <p className="credits-placeholder">Anjoelo Calderon</p>
          <p className="credits-sub" style={{ marginTop: "1rem" }}>
            Music
          </p>
          <p className="credits-placeholder">Jayla</p>
          <p className="credits-sub" style={{ marginTop: "1rem" }}>
            Tool
          </p>
          <p className="credits-placeholder">CLAUDE</p>
        </div>

        <div className="settings-divider" />

        <button className="settings-close" onClick={onClose}>
          ▶ BACK
        </button>
      </motion.div>
    </motion.div>
  );
}
