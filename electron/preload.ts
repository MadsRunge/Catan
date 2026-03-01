import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('gamePersistence', {
  saveGame: (gameState: unknown) => ipcRenderer.invoke('save-game', gameState),
  loadGame: () => ipcRenderer.invoke('load-game'),
  hasSavedGame: () => ipcRenderer.invoke('has-saved-game'),
  clearGame: () => ipcRenderer.invoke('clear-game'),
})
