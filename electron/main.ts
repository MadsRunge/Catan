import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import ElectronStore from 'electron-store'

const _dirname = dirname(fileURLToPath(import.meta.url))

const store = new ElectronStore()

process.env.DIST = join(_dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(_dirname, '../public')

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: join(process.env.PUBLIC || '', 'vite.svg'),
    webPreferences: {
      preload: join(_dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(process.env.DIST || '', 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

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
