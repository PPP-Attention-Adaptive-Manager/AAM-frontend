# Copilot Agent Instructions — AAM

You are a coding assistant for an Electron + React (Vite) desktop application.
Follow these instructions precisely for every task in this project.

---

## Project Overview

This is a desktop app built with:
- **Electron** — main process, native OS access (`electron/main.js`)
- **React + Vite** — renderer/UI process (`src/`)
- **No routing library** — navigation is handled by a central config and React state

The UI has three layers:
1. **NavBar** — top bar with 4 sections: Stats, Actions, Settings, Help
2. **Sidebar** — changes based on the active nav section; shows subtopics
3. **MainContent** — renders the page for the active (nav, subtopic) pair

---

## Architecture Rules

### The config is the only router

All navigation is driven by `src/config/navConfig.js`. This is the single source of truth.
Every nav item and subtopic is defined here. **Do not use React Router or any routing library.**

To add a new page:
1. Import the component in `navConfig.js`
2. Add a `component` field to the relevant subtopic entry
3. `MainContent.jsx` will render it automatically — no other wiring needed

```js
// navConfig.js example
{ id: "overview", label: "Overview", component: StatsOverview }
```

### File layout for pages

Place all page components under `src/pages/`, grouped by nav section:

```
src/
└── pages/
    ├── stats/
    │   ├── StatsOverview.jsx
    │   ├── StatsPerformance.jsx
    │   └── StatsHistory.jsx
    ├── actions/
    ├── settings/
    └── help/
```

One file per subtopic. No exceptions.

### IPC (Electron ↔ React communication)

- The **renderer** (`src/`) has no Node.js access. It cannot use `fs`, `path`, `child_process`, etc.
- All system-level work happens in `electron/main.js`
- Communication goes through IPC:
  - `ipcMain.handle('channel-name', handler)` in `main.js`
  - `window.electronAPI.channelName()` in the renderer (exposed via `contextBridge` in a preload script)
- If a new IPC channel is needed, update both `electron/main.js` and `electron/preload.js`

### Styling rules

- All global styles and design tokens live in `src/App.css`
- Use the CSS variables defined there — never hardcode colors or fonts
- Component-specific styles go in a `.css` file next to the component
- Do not introduce Tailwind, CSS Modules, or styled-components unless explicitly asked

Key tokens:
```css
--bg-base, --bg-surface, --bg-raised, --bg-hover
--border, --border-active
--text-primary, --text-secondary, --text-muted
--accent, --accent-dim, --accent-glow
--font-mono: 'IBM Plex Mono'
--font-sans: 'IBM Plex Sans'
```

---

## Component Conventions

- **Functional components only** — no class components
- **Props over context** for simple data passing; use React Context only for truly global state
- **No default exports from pages** — use named exports and import explicitly in `navConfig.js`
- Keep components focused: if a component exceeds ~150 lines, split it

---

## What NOT to touch

Unless explicitly instructed, do not modify:
- `src/App.jsx` — shell and state management
- `src/components/NavBar.jsx` — top navigation
- `src/components/Sidebar.jsx` — sidebar
- `src/App.css` layout rules (the structural CSS, not the tokens)
- `electron/main.js` — unless adding IPC handlers
- `vite.config.js`, `package.json`, `index.html`

---

## Task Protocol

When given a task:
1. Identify which nav section and subtopic it belongs to
2. Create the page component under `src/pages/<section>/`
3. Update `navConfig.js` to wire it in (add `component` field)
4. If the task requires system/OS access, add an IPC handler in `main.js` and expose it via preload
5. Use existing CSS tokens — do not add new global styles unless necessary
6. Do not modify files outside the scope of the task

---

## Development Commands

```bash
npm run dev          # Start Vite dev server (renderer only)
npm run electron     # Launch Electron pointing at Vite dev server
npm run build        # Build renderer to dist/
npm run dist         # Package the app with electron-builder
```