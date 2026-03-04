const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { MCP_CONFIGS } = require('../shared/mcpConfigs');

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
  const startWatcher = () => {
    if (fileWatcher) fileWatcher.close();
    if (fs.existsSync(SETTINGS_PATH)) {
      fileWatcher = fs.watch(SETTINGS_PATH, () => {
        mainWindow?.webContents.send('settings:changed');
      });
    }
  };

  startWatcher();

  // Also watch the directory so we detect file creation
  const settingsDir = path.dirname(SETTINGS_PATH);
  if (fs.existsSync(settingsDir)) {
    fs.watch(settingsDir, (eventType, filename) => {
      if (filename === 'settings.json' && !fileWatcher) {
        startWatcher();
      }
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


// Maps addon IDs to real Claude Code settings (env, mcpServers)
function applyAddonSettings(settings, addonId) {
  const mappings = {
    'agentdb-persistence': [['mcpServers.sqlite', MCP_CONFIGS.sqlite]],
    'github-integration': [['mcpServers.github', MCP_CONFIGS.github]],
    'token-optimizer': [['env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', '50']],
    'memory-consolidation': [['mcpServers.memory', MCP_CONFIGS.memory]],
    'hnsw-vector-search': [['mcpServers.memory', MCP_CONFIGS.memory]],
    'ruvector-intelligence': [['env.MAX_THINKING_TOKENS', '10000']],
  };
  const effects = mappings[addonId] || [];
  effects.forEach(([settingPath, value]) => {
    const keys = settingPath.split('.');
    let current = settings;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  });
}

ipcMain.handle('addon:install', async (event, command) => {
  try {
    // Extract addon ID from install command (e.g., 'npx ruflo@latest install ruvector-intelligence' -> 'ruvector-intelligence')
    const parts = command.split(' ');
    const addonId = parts[parts.length - 1];

    // Try to execute the install command, but don't fail if the CLI isn't available
    try {
      execSync(command, { stdio: 'pipe', timeout: 60000 });
    } catch (cmdError) {
      // CLI not available - that's OK, we still record the selection in settings
      console.log(`Install command not available (${addonId}), updating settings only.`);
    }

    // Read current settings
    let settings = {};
    if (fs.existsSync(SETTINGS_PATH)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    }

    // Add addon to installed list
    if (!settings.addons) settings.addons = {};
    if (!Array.isArray(settings.addons.installed)) settings.addons.installed = [];
    if (!settings.addons.installed.includes(addonId)) {
      settings.addons.installed.push(addonId);
    }

    // Apply real Claude Code settings for this addon
    applyAddonSettings(settings, addonId);

    // Write back
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
