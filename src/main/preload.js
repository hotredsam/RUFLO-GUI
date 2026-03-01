const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readSettings: () => ipcRenderer.invoke('settings:read'),
  writeSettings: (data) => ipcRenderer.invoke('settings:write', data),
  getSettingsPath: () => ipcRenderer.invoke('settings:path'),
  installAddon: (command) => ipcRenderer.invoke('addon:install', command),
  onSettingsChanged: (callback) => {
    ipcRenderer.on('settings:changed', callback);
    return () => ipcRenderer.removeListener('settings:changed', callback);
  },
});
