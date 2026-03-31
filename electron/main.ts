import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app, BrowserWindow, shell } from 'electron'

const APP_NAME = 'Brink'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const createMainWindow = async () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    backgroundColor: '#120d0a',
    height: 900,
    minHeight: 640,
    minWidth: 1024,
    show: false,
    title: APP_NAME,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    width: 1420,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  const devServerUrl = process.env.VITE_DEV_SERVER_URL

  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl)
    return
  }

  await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
}

app.setName(APP_NAME)

app.whenReady().then(() => {
  void createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('message', (message) => {
  if (message !== 'electron-vite&type=hot-reload') {
    return
  }

  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.reload()
  }
})
