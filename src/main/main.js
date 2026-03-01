const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(process.env.USERPROFILE || process.env.HOME, '.claude', 'settings.json');

let mainWindow;
let fileWatcher;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0f1729',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(null);

  // Watch settings file for external changes
  if (fs.existsSync(SETTINGS_PATH)) {
    fileWatcher = fs.watch(SETTINGS_PATH, () => {
      mainWindow?.webContents.send('settings:changed');
    });
  }
});

app.on('window-all-closed', () => {
  if (fileWatcher) fileWatcher.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('settings:read', async () => {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Error reading settings:', error);
    return {};
  }
});

ipcMain.handle('settings:write', async (event, data) => {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Error writing settings:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('settings:path', async () => {
  return SETTINGS_PATH;
});

ipcMain.handle('addon:install', async (event, command) => {
  try {
    const result = execSync(command, { encoding: 'utf-8', timeout: 60000 });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
