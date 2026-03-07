# imajello — Design Specification

> Interactive portfolio for Anjoelo Calderon — aspiring Fullstack, AI/ML & Gamedev engineer.

---

## Changelog

### v0.1 — Initial Concept
- Minimalist parchment theme mimicking a D&D stat sheet
- Color palette established; fonts TBD
- Key features outlined: resume mode panels, project cards, easter eggs

### v0.2 — DnD Stat Sheet (parchment)
- Fonts: MedievalSharp (headers) + EB Garamond (body)
- Portrait layout: centered header + 2-column body
- 6 ability scores styled as D&D stat blocks
- Expandable project cards
- Easter eggs: name click → d20 roll, GPA click → NATURAL 20, 🎲 next to D&D hobby

### v0.3 — Landscape Restructure
- Layout switched to landscape grid: 300px sidebar + 1fr main
- Grid areas: `"sidebar main" / "footer footer"`
- Header moved into sidebar; body reorganized: Projects first (left), Leadership + Personality (right)

### v0.4 — Retro Arcade Reskin
- Fonts swapped: Press Start 2P (headers) + VT323 (body)
- Pixel grid background via repeating `linear-gradient`
- Hard box shadows (4px/8px offset), 2px borders, dashed dividers
- Bullets changed from `✦` to `►`, ornament divider to `■■■`

### v0.5 — Framer Motion Animations
- Sheet entrance fade + slide
- Panel stagger on load (`staggerChildren: 0.07`)
- Mode switch: `AnimatePresence mode="wait"` with slide variants
- Project card expand/collapse: height animation + icon rotation

### v0.6 — Settings Panel + Konami Easter Egg
- Settings modal: dark mode toggle, scanlines toggle
- Konami code (↑↑↓↓←→←→BA): triggers achievement overlay + glitch effect
- `[OPTIONS]` floating button, bottom-right → later moved top-left

### v0.7 — SFX + Music + Nav Buttons
- Web Audio API sound engine (`sounds.js`): procedural 8-bit SFX + C pentatonic music loop
- Volume sliders for SFX and music added to Settings
- Nav button group (top-left, fixed): `[START]` · `[CREDITS]` · `[OPTIONS]`
- Credits panel (placeholder)

### v0.8 — Contact Form
- `[START]` opens a popup contact form instead of raw mailto link
- Formspree backend (`mojkqyjp`) for email delivery
- Anti-bot: hidden honeypot field, `_gotcha`, 3-second timing gate
- Success / error state replaces form on submit

### v0.9 — Layout & Polish
- Full-viewport no-scroll layout: `html/body/root { height: 100%; overflow: hidden }`
- Sidebar: `overflow-y: hidden`, tightened padding/gaps/font sizes
- Thin rose scrollbar on main content area
- Education and Experience split into separate panels; Education → bottom-right
- LinkedIn + GitHub replaced with inline SVG logo icons
- Max-width increased to 1600px
- Developer type and college/GPA split to two lines
- Konami hint moved to footer (faint `↑↑↓↓←→←→BA`); unlocks to `★ IDDQD`
- Favicon: custom pixel-art SVG (IJ monogram, charcoal + rose)
- Metadata: title → `imajello`, description → `Anjoelo Calderon — Portfolio`

---

## Current Theme

**Retro arcade + D&D stat sheet hybrid**

| Token     | Value     |
|-----------|-----------|
| cream     | `#f3f1e8` |
| sand      | `#e5d8ca` |
| blush     | `#f2c6c2` |
| rose      | `#dc9e95` |
| charcoal  | `#1e1e1d` |
| midnight  | `#000000` |

Fonts: **Press Start 2P** (headers/UI) · **VT323** (body/content)

---

## Architecture

```
src/
  App.js                    — layout, state, easter eggs, nav
  App.css                   — all styles
  index.css                 — font import + html/body reset
  utils/
    sounds.js               — Web Audio API SFX + music engine
  data/
    portfolioData.js        — all content (stats, projects, skills)
  components/
    StatBlock.js            — 6 ability scores
    ProjectCard.js          — expandable project panels
    SettingsPanel.js        — options modal (dark mode, scanlines, volume)
    ContactPanel.js         — contact form modal (Formspree)
    CreditsPanel.js         — credits placeholder modal
```

---

## Resume Modes

| Mode      | Focus                              |
|-----------|------------------------------------|
| AI/ML     | ML tools, LLM, OCR, data pipelines |
| Fullstack | Web, React, APIs, databases        |
| Gamedev   | Game engines, C++, interactive UI  |

Each mode swaps: stat scores, skills list, flavor text, filtered projects.

---

## Easter Eggs

| Trigger              | Effect                                              |
|----------------------|-----------------------------------------------------|
| Click name           | Rolls d20, shows popup                              |
| Click GPA            | "NATURAL 20 ✦" flash + sfx                         |
| Click 🎲 (D&D hobby) | Rolls d20 alert                                     |
| Konami ↑↑↓↓←→←→BA   | Glitch + achievement overlay + dark mode, `★ IDDQD` |

---

## Key Information

- **Name:** Anjoelo Calderon
- **Education:** AS Transfer, De Anza College, GPA 3.75 (Expected Mar 2026)
- **Location:** Fremont, CA
- **Tech:** Python, JS, React, HTML/CSS, SQL, Tesseract, PaddleOCR, LlamaIndex, Mistral, Phi-2, Git
- **Hobbies:** Martial Arts, D&D, Musical Instruments, Game Development
- **Projects:** deanzaexpo.org (Fullstack + Gamedev)
- **Contact:** anjoelo.ca@gmail.com
