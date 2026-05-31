/* global require */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  profile: {
    get: () => ipcRenderer.invoke('profile:get'),
    save: (profile) => ipcRenderer.invoke('profile:save', profile),
  },
})