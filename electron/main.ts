import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import ElectronStore from 'electron-store'

const store = new ElectronStore()

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC Handlers for Game Persistence
ipcMain.handle('save-game', async (_event, gameState: unknown) => {
  try {
    store.set('gameState', gameState)
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
})

ipcMain.handle('load-game', async () => {
  try {
    const gameState = store.get('gameState')
    return { success: true, data: gameState }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
})

ipcMain.handle('has-saved-game', async () => {
  return store.has('gameState')
})

ipcMain.handle('clear-game', async () => {
  try {
    store.delete('gameState')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
})
