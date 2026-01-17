import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // DDEV Commands
  ddev: {
    list: () => ipcRenderer.invoke('ddev:list'),
    describe: (projectName: string) => ipcRenderer.invoke('ddev:describe', projectName),
    start: (projectName: string) => ipcRenderer.invoke('ddev:start', projectName),
    stop: (projectName: string) => ipcRenderer.invoke('ddev:stop', projectName),
    restart: (projectName: string) => ipcRenderer.invoke('ddev:restart', projectName),
    poweroff: () => ipcRenderer.invoke('ddev:poweroff')
  },
  // Shell utilities
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url)
  },
  // Terminal output
  terminal: {
    getOutput: (projectName: string) => ipcRenderer.invoke('terminal:getOutput', projectName),
    clearOutput: (projectName: string) => ipcRenderer.invoke('terminal:clearOutput', projectName)
  }
})
