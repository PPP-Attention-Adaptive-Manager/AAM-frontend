# AAM

A desktop application built with Electron and React (Vite).

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd AAM-frontend

# 2. Install dependencies
npm install
```

---

## Running in Development

Two processes need to run together: the Vite dev server (renderer) and Electron (main process).

**Option A — two terminals:**

```bash
# Terminal 1: start the Vite dev server
npm run dev

# Terminal 2: once Vite is ready, launch Electron
npm run electron
```

**Option B — single command** (if configured with `concurrently`):

```bash
npm run start
```

The app will open in an Electron window. Hot module reload (HMR) is active — changes to `src/` reflect instantly without restarting Electron. Changes to `electron/main.js` require restarting the Electron process.

---

## Project Structure

```
AAM/
├── electron/
│   ├── main.js          # Electron main process — window creation, IPC handlers
│   └── preload.js       # Exposes safe APIs to the renderer via contextBridge
├── src/
│   ├── config/
│   │   └── navConfig.js # Single source of truth for navigation and routing
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── Sidebar.jsx
│   │   └── MainContent.jsx
│   ├── pages/           # One folder per nav section, one file per subtopic
│   │   ├── stats/
│   │   ├── actions/
│   │   ├── settings/
│   │   └── help/
│   ├── App.jsx          # Shell: layout + navigation state
│   ├── App.css          # Global styles and design tokens
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── index.html
├── vite.config.js
└── package.json
```

---

## Navigation Architecture

Navigation has three layers: **NavBar → Sidebar → MainContent**.

The active `(nav, subtopic)` pair determines what renders in the main area.
All routing is managed by `src/config/navConfig.js` — there is no routing library.

### Adding a new page

**1. Create the component**

```jsx
// src/pages/stats/StatsOverview.jsx
function StatsOverview() {
  return <div>Stats Overview content</div>;
}

export default StatsOverview;
```

**2. Register it in navConfig.js**

```js
import StatsOverview from "../pages/stats/StatsOverview";

export const NAV_CONFIG = [
  {
    id: "stats",
    label: "Stats",
    icon: "◈",
    subtopics: [
      { id: "overview", label: "Overview", component: StatsOverview }, // ← add component
      ...
    ],
  },
  ...
];
```

That's it. `MainContent.jsx` picks it up automatically.

### Adding a new nav section

Add a new entry to the `NAV_CONFIG` array with a unique `id`, a `label`, an `icon`, and at least one subtopic. The NavBar and Sidebar update automatically.

---

## Electron ↔ React Communication (IPC)

The renderer (`src/`) runs in a sandboxed browser context with no Node.js access.
To call native APIs (file system, OS info, etc.), use IPC.

**1. Add a handler in `electron/main.js`:**

```js
const { ipcMain } = require('electron');

ipcMain.handle('read-file', async (event, filePath) => {
  const fs = require('fs');
  return fs.readFileSync(filePath, 'utf8');
});
```

**2. Expose it via `electron/preload.js`:**

```js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (path) => ipcRenderer.invoke('read-file', path),
});
```

**3. Call it from any React component:**

```js
const content = await window.electronAPI.readFile('/path/to/file');
```

---

## Styling

Global design tokens are defined as CSS variables in `src/App.css`.
Always use these variables — never hardcode colors, fonts, or spacing.

| Token | Use |
|---|---|
| `--bg-base` | Page background |
| `--bg-surface` | NavBar, Sidebar |
| `--bg-raised` | Cards, active states |
| `--accent` | Highlights, active indicators |
| `--text-primary` | Main content text |
| `--text-secondary` | Subtitles, labels |
| `--text-muted` | Disabled, decorative |
| `--font-sans` | UI text (`IBM Plex Sans`) |
| `--font-mono` | Labels, codes, tags (`IBM Plex Mono`) |

Component-specific styles go in a `.css` file next to the component file.

---

## Building for Production

```bash
# Build the renderer
npm run build

# Package the Electron app
npm run dist
```

Output is written to `dist/`. The packaged installer for your platform will appear there.

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server for the renderer |
| `npm run electron` | Launch Electron (point at running Vite server) |
| `npm run start` | Start both together (requires `concurrently`) |
| `npm run build` | Build renderer to `dist/` |
| `npm run dist` | Package the full Electron app |
| `npm run lint` | Run ESLint |