import { useState } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../utils/sounds';

const TO = 'anjoelo.ca@gmail.com';

export default function ContactPanel({ onClose }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    sfx.nat20();
    const subject = encodeURIComponent(`Portfolio Contact from ${name.trim()}`);
    const body    = encodeURIComponent(
      `From: ${name.trim()}${email.trim() ? ` (${email.trim()})` : ''}\n\n${message.trim()}`
    );
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
    onClose();
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
        className="settings-panel contact-panel"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-title">══ CONTACT ══</div>
        <div className="settings-divider" />

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label className="contact-label">► NAME</label>
            <input
              className="contact-input"
              type="text"
              placeholder="your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">► EMAIL</label>
            <input
              className="contact-input"
              type="email"
              placeholder="your@email.com (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">► MESSAGE</label>
            <textarea
              className="contact-input contact-textarea"
              placeholder="say something..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="settings-divider" />

          <div className="contact-actions">
            <button
              type="button"
              className="settings-close"
              onClick={onClose}
            >
              ▶ BACK
            </button>
            <button
              type="submit"
              className="settings-close contact-submit"
            >
              ▶ SEND IT
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
