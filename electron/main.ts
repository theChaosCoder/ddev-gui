import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

let mainWindow: BrowserWindow | null = null

const terminalOutput = new Map<string, { timestamp: Date; message: string }[]>()

const executeCommand = async (command: string, projectName?: string): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const output: { timestamp: Date; message: string }[] = []
    const key = projectName || 'global'

    if (!terminalOutput.has(key)) {
      terminalOutput.set(key, [])
    }

    const child = spawn(command, [], { shell: true })

    child.stdout?.on('data', (data) => {
      const lines = data.toString().split('\n').filter((line: string) => line.trim())
      lines.forEach((line: string) => {
        const entry = { timestamp: new Date(), message: line }
        output.push(entry)
        terminalOutput.get(key)?.push(entry)
      })
    })

    child.stderr?.on('data', (data) => {
      const lines = data.toString().split('\n').filter((line: string) => line.trim())
      lines.forEach((line: string) => {
        const entry = { timestamp: new Date(), message: line }
        output.push(entry)
        terminalOutput.get(key)?.push(entry)
      })
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true })
      } else {
        const errorMsg = output.length > 0 ? output[output.length - 1].message : 'Command failed'
        resolve({ success: false, error: errorMsg })
      }
    })

    child.on('error', (error) => {
      resolve({ success: false, error: error.message })
    })
  })
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    backgroundColor: '#0f172a'
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for DDEV commands

// Get list of all DDEV projects
ipcMain.handle('ddev:list', async () => {
  try {
    const { stdout } = await execAsync('ddev list --json-output')
    const data = JSON.parse(stdout)
    return { success: true, data: data.raw || [] }
  } catch (error) {
    console.error('Error listing DDEV projects:', error)
    return { success: false, error: (error as Error).message }
  }
})

// Get detailed info for a specific project
ipcMain.handle('ddev:describe', async (_event, projectName: string) => {
  try {
    const { stdout } = await execAsync(`ddev describe ${projectName} --json-output`)
    const data = JSON.parse(stdout)
    return { success: true, data: data.raw || data }
  } catch (error) {
    console.error(`Error describing project ${projectName}:`, error)
    return { success: false, error: (error as Error).message }
  }
})

// Start a project
ipcMain.handle('ddev:start', async (_event, projectName: string) => {
  return executeCommand(`ddev start ${projectName}`, projectName)
})

// Stop a project
ipcMain.handle('ddev:stop', async (_event, projectName: string) => {
  return executeCommand(`ddev stop ${projectName}`, projectName)
})

// Restart a project
ipcMain.handle('ddev:restart', async (_event, projectName: string) => {
  return executeCommand(`ddev restart ${projectName}`, projectName)
})

// Poweroff (stop all projects)
ipcMain.handle('ddev:poweroff', async () => {
  return executeCommand('ddev poweroff', 'global')
})

// Get terminal output for a project
ipcMain.handle('terminal:getOutput', async (_event, projectName: string) => {
  const key = projectName || 'global'
  const output = terminalOutput.get(key) || []
  return { success: true, data: output }
})

// Clear terminal output for a project
ipcMain.handle('terminal:clearOutput', async (_event, projectName: string) => {
  const key = projectName || 'global'
  terminalOutput.set(key, [])
  return { success: true }
})

// Open external URL
ipcMain.handle('shell:openExternal', async (_event, url: string) => {
  try {
    await shell.openExternal(url)
    return { success: true }
  } catch (error) {
    console.error('Error opening external URL:', error)
    return { success: false, error: (error as Error).message }
  }
})
