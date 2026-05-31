/* global process, require, __dirname */

process.env.NODE_ENV = 'development'
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs/promises')
const path = require('path')

const PROFILE_FILE = 'profile.json'

function getProfilePath() {
  return path.join(app.getPath('userData'), PROFILE_FILE)
}

function createDefaultProfile() {
  return {
    firstTime: true,
    name: '',
    onboarding: {},
    appearance: {
      theme: 'amber',
      density: 'comfortable',
      accent: 'amber',
    },
    settings: {
      launchAtStartup: false,
      mode: 'passive',
    },
  }
}

function normalizeProfile(profile) {
  const fallback = createDefaultProfile()

  return {
    ...fallback,
    ...(profile && typeof profile === 'object' ? profile : {}),
    onboarding: {
      ...fallback.onboarding,
      ...(profile && typeof profile === 'object' && profile.onboarding && typeof profile.onboarding === 'object'
        ? profile.onboarding
        : {}),
    },
    appearance: {
      ...fallback.appearance,
      ...(profile && typeof profile === 'object' && profile.appearance && typeof profile.appearance === 'object'
        ? profile.appearance
        : {}),
    },
    settings: {
      ...fallback.settings,
      ...(profile && typeof profile === 'object' && profile.settings && typeof profile.settings === 'object'
        ? profile.settings
        : {}),
    },
  }
}

async function readProfile() {
  try {
    const raw = await fs.readFile(getProfilePath(), 'utf8')
    return normalizeProfile(JSON.parse(raw))
  } catch {
    return createDefaultProfile()
  }
}

async function writeProfile(profile) {
  const normalized = normalizeProfile(profile)
  await fs.mkdir(app.getPath('userData'), { recursive: true })
  await fs.writeFile(getProfilePath(), JSON.stringify(normalized, null, 2), 'utf8')
  return normalized
}

ipcMain.handle('profile:get', async () => readProfile())
ipcMain.handle('profile:save', async (_event, profile) => writeProfile(profile))

// This function creates the main window of your app
// This function creates the main window of your app
function createWindow() {
  const win = new BrowserWindow({
    width: 960,            // Reduced width
    height: 720,           // Reduced height
    resizable: false,      // Prevents the user from resizing the window
    fullscreenable: false, // Prevents maximizing to full-screen
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,  // Security setting (keep false)
      contextIsolation: true,  // Security setting (keep true)
      //webSecurity: false,
    },
    // Windows-specific: this makes it look like a normal Windows app
    titleBarStyle: 'default',
  })

  // In development: load from the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    console.log('Attempting to load: http://localhost:5173')
    // Open DevTools (F12 inspector) - useful for debugging
    win.webContents.openDevTools()
  } else {
    // In production: load the built HTML file
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// This tells Electron: "When the app is ready, create the window"
app.whenReady().then(createWindow)

// This tells Electron: "When the last window closes, quit the app"
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})