process.env.NODE_ENV = 'development'
const { app, BrowserWindow } = require('electron')
const path = require('path')

// This function creates the main window of your app
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,           // Window width in pixels
    height: 800,           // Window height in pixels
    webPreferences: {
      nodeIntegration: false,  // Security setting (keep false)
      contextIsolation: true,  // Security setting (keep true)
      webSecurity: false,
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