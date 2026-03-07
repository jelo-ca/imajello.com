# imajello

Interactive portfolio for **Anjoelo Calderon** — styled as a retro arcade / D&D stat sheet.

Live at: https://imajello.com/

---

## Stack

- **React 19** (Create React App)
- **Framer Motion** — page/panel animations
- **Web Audio API** — procedural 8-bit SFX + music loop
- **Formspree** — contact form email delivery
- Plain **CSS** (no Tailwind)
- Fonts: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) · [VT323](https://fonts.google.com/specimen/VT323)

---

## Features

- **Resume modes** — AI/ML · Fullstack · Gamedev, each with different stats, skills, and projects
- **Expandable project cards** with animated expand/collapse
- **Settings panel** — dark mode, scanlines, SFX + music volume sliders
- **Contact form** — Formspree-backed with honeypot + timing anti-bot protection
- **Credits panel** — placeholder, to be filled
- **Easter eggs** — see below

### Easter Eggs

| Trigger | Effect |
|---|---|
| Click name | Rolls a d20 |
| Click GPA | NATURAL 20 flash |
| Click 🎲 next to D&D | Rolls a d20 alert |
| Konami code `↑↑↓↓←→←→BA` | Glitch + achievement overlay + `★ IDDQD` |

---

## Project Structure

```
src/
  App.js                  — layout, state, easter eggs, nav
  App.css                 — all styles
  index.css               — font import + html/body reset
  utils/
    sounds.js             — Web Audio API SFX + music engine
  data/
    portfolioData.js      — all content (stats, projects, skills)
  components/
    StatBlock.js          — 6 D&D-style ability scores
    ProjectCard.js        — expandable project panels
    SettingsPanel.js      — options modal
    ContactPanel.js       — contact form modal
    CreditsPanel.js       — credits modal
public/
  favicon.svg             — pixel-art IJ monogram icon
  manifest.json
```

---

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build → /build
```

---

## Configuration

| File | What to update |
|---|---|
| `src/data/portfolioData.js` | All content — projects, skills, experience, stats |
| `src/components/ContactPanel.js` | Formspree endpoint (`FORMSPREE` const) |
| `src/components/CreditsPanel.js` | Credits content |
| `public/favicon.svg` | Icon |
