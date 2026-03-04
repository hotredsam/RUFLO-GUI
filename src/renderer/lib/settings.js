// Settings read/write logic via Electron IPC

export async function readSettings() {
  try {
    return await window.electronAPI.readSettings();
  } catch (err) {
    console.error('Failed to read settings:', err);
    return {};
  }
}

export async function writeSettings(settings) {
  try {
    await window.electronAPI.writeSettings(settings);
    return true;
  } catch (err) {
    console.error('Failed to write settings:', err);
    return false;
  }
}

