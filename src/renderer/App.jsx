import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import EnvVarsSection from './components/EnvVarsSection';
import HooksSection from './components/HooksSection';
import SwarmSection from './components/SwarmSection';
import MemorySection from './components/MemorySection';
import SecuritySection from './components/SecuritySection';
import PermissionsSection from './components/PermissionsSection';
import AddonsMarketplace from './components/AddonsMarketplace';
import SkillsSection from './components/SkillsSection';
import CapabilitiesSection from './components/CapabilitiesSection';
import UserGuideSection from './components/UserGuideSection';
import ModelTiersSection from './components/ModelTiersSection';
import PluginsSection from './components/PluginsSection';
import MCPSection from './components/MCPSection';
import ContextAutopilotSection from './components/ContextAutopilotSection';
import VerificationSection from './components/VerificationSection';
import CLAUDEMDSection from './components/CLAUDEMDSection';
import DiagnosticsSection from './components/DiagnosticsSection';
import StatusBar from './components/StatusBar';
import { applyTheme, DEFAULT_THEME } from './lib/themes';
import { getSettingSideEffects } from './lib/settings-mapper';

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function deleteNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) return;
    current = current[keys[i]];
  }
  delete current[keys[keys.length - 1]];
}

export default function App() {
  const [settings, setSettings] = useState(null);
  const [mode, setMode] = useState('complex');
  const [activeSection, setActiveSection] = useState('general');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [settingsPath, setSettingsPath] = useState('');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ruflo-theme') || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const saveTimeoutRef = useRef(null);
  const hasInitialLoadRef = useRef(false);
  const isExternalUpdateRef = useRef(false);

  const loadSettings = async () => {
    try {
      const result = await window.electronAPI.readSettings();
      isExternalUpdateRef.current = true;
      setSettings(result);
      setLastSaved(new Date());
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSaveStatus('error');
    }
  };

  // Load settings on mount
  useEffect(() => {
    const init = async () => {
      await loadSettings();
      const path = await window.electronAPI.getSettingsPath();
      setSettingsPath(path);
      hasInitialLoadRef.current = true;
    };

    init();

    // Listen for external changes — reload from file
    const unsubscribe = window.electronAPI.onSettingsChanged(() => {
      loadSettings();
    });

    return unsubscribe;
  }, []);

  // Apply and persist theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('ruflo-theme', theme);
    } catch { /* ignore */ }
  }, [theme]);

  // Auto-save with debounce
  useEffect(() => {
    if (!settings || !hasInitialLoadRef.current) return;

    // Skip save if this was an external update
    if (isExternalUpdateRef.current) {
      isExternalUpdateRef.current = false;
      return;
    }

    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await window.electronAPI.writeSettings(settings);
        setLastSaved(new Date());
        setSaveStatus('saved');
      } catch (error) {
        console.error('Failed to save settings:', error);
        setSaveStatus('error');
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings]);

  const updateSetting = useCallback((path, value) => {
    setSettings((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      // Set the primary value
      setNestedValue(updated, path, value);

      // Apply real Claude Code side effects
      const sideEffects = getSettingSideEffects(path, value, updated);
      sideEffects.forEach(({ path: p, value: v }) => {
        if (v === undefined) {
          deleteNestedValue(updated, p);
        } else {
          setNestedValue(updated, p, v);
        }
      });

      return updated;
    });
  }, []);

  if (!settings) {
    return (
      <div
        className="flex items-center justify-center w-full h-screen"
        style={{ background: `linear-gradient(to bottom right, #0f172a, var(--bg-via), #0f172a)` }}
      >
        <div className="text-slate-300">Loading settings...</div>
      </div>
    );
  }

  const renderPanel = () => {
    const props = { settings, mode, onUpdate: updateSetting };

    switch (activeSection) {
      case 'general':
        return <SettingsPanel {...props} section="general" />;
      case 'env':
        return <EnvVarsSection {...props} />;
      case 'hooks':
        return <HooksSection {...props} />;
      case 'swarm':
        return <SwarmSection {...props} />;
      case 'memory':
        return <MemorySection {...props} />;
      case 'security':
        return <SecuritySection {...props} />;
      case 'permissions':
        return <PermissionsSection {...props} />;
      case 'skills':
        return <SkillsSection {...props} />;
      case 'addons':
        return <AddonsMarketplace {...props} />;
      case 'capabilities':
        return <CapabilitiesSection {...props} />;
      case 'guide':
        return <UserGuideSection {...props} />;
      case 'models':
        return <ModelTiersSection {...props} />;
      case 'plugins':
        return <PluginsSection {...props} />;
      case 'mcp':
        return <MCPSection {...props} />;
      case 'context':
        return <ContextAutopilotSection {...props} />;
      case 'verification':
        return <VerificationSection {...props} />;
      case 'templates':
        return <CLAUDEMDSection {...props} />;
      case 'diagnostics':
        return <DiagnosticsSection {...props} />;
      default:
        return <SettingsPanel {...props} section="general" />;
    }
  };

  return (
    <div
      className="flex flex-col w-full h-screen"
      style={{ background: `linear-gradient(to bottom right, #0f172a, var(--bg-via), #0f172a)` }}
    >
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          mode={mode}
          onModeChange={setMode}
          theme={theme}
          onThemeChange={setTheme}
        />
        <main className="flex-1 overflow-auto">
          {renderPanel()}
        </main>
      </div>
      <StatusBar
        settings={settings}
        settingsPath={settingsPath}
        saveStatus={saveStatus}
        mode={mode}
        lastSaved={lastSaved}
      />
    </div>
  );
}
