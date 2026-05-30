# Windows Settings App (React + Electron)

A Windows desktop application for managing user preferences and authorizations. Built with React, Vite, and Electron. Settings are persisted locally using `electron-store`.

## Features

- ✅ Theme selector (Light/Dark)
- ✅ Toggle controls (notifications, auto-launch, data sharing)
- ✅ API key / authorization field (masked input)
- ✅ Settings persist across app restarts
- ✅ Ready to connect to a backend API

## Prerequisites

- **Node.js** 18+ (tested with v22.14.0)
- **npm** 10+
- **Windows 10 or 11** (the app is built for Windows)

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Electron builder (for packaging) – optional**
   ```bash
   npm install electron-builder --save-dev
   ```

## Development

Run the app in development mode with hot reload:

```bash
# Terminal 1: Start React dev server
npm run dev

# Terminal 2: Launch Electron window
npx electron .
```

The Electron window will open with the settings interface. Any changes you make to `src/` will auto-reload.

> **Important:** The file `electron/main.js` sets `process.env.NODE_ENV = 'development'` to load the dev server instead of the production build.

## Project Structure

```
├── electron/
│   ├── main.js          # Electron main process (creates window, handles IPC)
│   └── preload.js       # Exposes safe API to React (settings get/save)
├── src/
│   ├── App.jsx          # Settings UI (React)
│   └── main.jsx         # React entry point
├── index.html
├── package.json
├── vite.config.js       # Vite config with `base: './'` for relative paths
└── README.md
```

## Building a Windows Installer (.exe)

We haven't configured electron-builder yet. To generate a standalone `.exe`:

1. **Install electron-builder**
   ```bash
   npm install electron-builder --save-dev
   ```

2. **Add build scripts to `package.json`**
   ```json
   "scripts": {
     "build": "vite build",
     "dist": "npm run build && electron-builder"
   }
   ```

3. **Add build configuration (inside `package.json`)**
   ```json
   "build": {
     "appId": "com.yourcompany.app",
     "productName": "SettingsApp",
     "directories": { "output": "release" },
     "win": {
       "target": "nsis",
       "icon": "public/icon.ico"
     }
   }
   ```

4. **Run the build**
   ```bash
   npm run dist
   ```

The installer will be in the `release/` folder.

## Settings Storage

Settings are saved to a JSON file using `electron-store`. Default location:

```
C:\Users\<YourUser>\AppData\Roaming\SettingsApp\app-settings.json
```

Defaults:

```json
{
  "theme": "light",
  "notifications": true,
  "autoLaunch": false,
  "apiKey": "",
  "dataSharing": false
}
```

## Connecting to a Backend API

In `src/App.jsx`, the `handleSave` function currently saves locally. To also send settings to your backend:

```javascript
const handleSave = async () => {
  // Save locally
  await window.electronAPI.saveSettings(settings)

  // Send to backend
  const response = await fetch('https://your-backend/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  })

  if (response.ok) alert('Settings saved locally and synced!')
}
```

## Troubleshooting

**Electron shows the old Vite template (spinning logo)**
Make sure `electron/main.js` has `process.env.NODE_ENV = 'development'` at the very top and that the React dev server is running (`npm run dev`).

**Settings not persisting after restart**
Check that `electron-store` is installed and that the preload script is correctly referenced in `main.js`.

**White screen or file not found errors**
Run `npm run build` to generate the `dist` folder, then try `npx electron .` again. Also ensure `vite.config.js` contains `base: './'`.

## Tech Stack

- **React** – UI
- **Vite** – Build tool and dev server
- **Electron** – Desktop runtime
- **electron-store** – Persistent local storage
