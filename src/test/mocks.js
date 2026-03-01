import { vi } from 'vitest';

export const mockElectronAPI = {
  readSettings: vi.fn().mockResolvedValue({
    model: 'claude-opus-4-6',
    permissions: { allow: [], deny: [] },
    env: {},
    hooks: {},
    security: {},
    swarm: { enabled: false },
    memory: { backend: 'sqlite' },
    addons: { installed: [] },
  }),
  writeSettings: vi.fn().mockResolvedValue(true),
  getSettingsPath: vi.fn().mockResolvedValue('C:\\Users\\test\\.claude\\settings.json'),
  installAddon: vi.fn().mockResolvedValue(true),
  onSettingsChanged: vi.fn().mockReturnValue(() => {}),
};

export function setupMocks() {
  window.electronAPI = mockElectronAPI;
}
