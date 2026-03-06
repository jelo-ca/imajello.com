import { motion } from 'framer-motion';
import { sfx } from '../utils/sounds';

export default function SettingsPanel({
  onClose,
  darkMode, setDarkMode,
  scanlines, setScanlines,
  sfxVol, setSfxVol,
  musicVol, setMusicVol,
}) {
  function handleDarkMode() {
    sfx.toggle();
    setDarkMode(d => !d);
  }

  function handleScanlines() {
    sfx.toggle();
    setScanlines(s => !s);
  }

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
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-title">══ OPTIONS ══</div>
        <div className="settings-divider" />

        <div className="settings-row" onClick={handleDarkMode}>
          <span className="settings-row-label">► DARK MODE</span>
          <span className={`settings-toggle ${darkMode ? 'on' : 'off'}`}>
            {darkMode ? '[ ON  ]' : '[ OFF ]'}
          </span>
        </div>

        <div className="settings-row" onClick={handleScanlines}>
          <span className="settings-row-label">► SCANLINES</span>
          <span className={`settings-toggle ${scanlines ? 'on' : 'off'}`}>
            {scanlines ? '[ ON  ]' : '[ OFF ]'}
          </span>
        </div>

        <div className="settings-divider" />

        <div className="settings-slider-row">
          <span className="settings-slider-label">► SFX VOL</span>
          <input
            className="settings-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVol}
            onChange={e => setSfxVol(parseFloat(e.target.value))}
          />
          <span className="settings-slider-value">{Math.round(sfxVol * 100)}</span>
        </div>

        <div className="settings-slider-row">
          <span className="settings-slider-label">► MUSIC VOL</span>
          <input
            className="settings-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVol}
            onChange={e => setMusicVol(parseFloat(e.target.value))}
          />
          <span className="settings-slider-value">{Math.round(musicVol * 100)}</span>
        </div>

        <div className="settings-divider" />

        <button className="settings-close" onClick={onClose}>
          ▶ RESUME
        </button>
      </motion.div>
    </motion.div>
  );
}
