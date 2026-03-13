import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "../utils/sounds";

const FORMSPREE = "https://formspree.io/f/mojkqyjp";
const MIN_MS = 3000; // reject submissions faster than this (bot timing check)

export default function ContactPanel({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // must stay empty
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const openedAt = useRef(Date.now());

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot — bots fill hidden fields, humans don't
    if (honeypot.trim()) return;

    // Timing — real users take more than MIN_MS to fill a form
    if (Date.now() - openedAt.current < MIN_MS) return;

    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _gotcha: honeypot, // Formspree server-side honeypot
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        sfx.nat20();
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setSubmitting(false);
    }
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
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-title">══ CONTACT ══</div>
        <div className="settings-divider" />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="contact-success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="contact-success-title">★ MESSAGE SENT ★</p>
              <p className="contact-success-sub">I'll get back to you soon.</p>
              <div className="settings-divider" />
              <button
                className="settings-close contact-submit"
                onMouseEnter={() => sfx.navHover()}
                onClick={onClose}
              >
                ▶ CLOSE
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="contact-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Honeypot — hidden from real users */}
              <div className="contact-honeypot" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">► NAME</label>
                <input
                  className="contact-input"
                  type="text"
                  placeholder="your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  disabled={submitting}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">► EMAIL</label>
                <input
                  className="contact-input"
                  type="email"
                  placeholder="your@email.com (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">► MESSAGE</label>
                <textarea
                  className="contact-input contact-textarea"
                  placeholder="say something..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  disabled={submitting}
                />
              </div>

              {error && <p className="contact-error">{error}</p>}

              <div className="settings-divider" />

              <div className="contact-actions">
                <button
                  type="button"
                  className="settings-close"
                  onMouseEnter={() => sfx.navHover()}
                  onClick={onClose}
                  disabled={submitting}
                >
                  ▶ BACK
                </button>
                <button
                  type="submit"
                  className="settings-close contact-submit"
                  onMouseEnter={() => sfx.navHover()}
                  disabled={submitting}
                >
                  {submitting ? "..." : "▶ SEND IT"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
