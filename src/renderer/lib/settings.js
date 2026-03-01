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

export function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const result = JSON.parse(JSON.stringify(obj));
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

export function deleteNestedValue(obj, path) {
  const keys = path.split('.');
  const result = JSON.parse(JSON.stringify(obj));
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) return result;
    current = current[keys[i]];
  }
  delete current[keys[keys.length - 1]];
  return result;
}
