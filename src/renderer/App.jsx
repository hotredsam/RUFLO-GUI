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
import StatusBar from './components/StatusBar';

export default function App() {
  const [settings, setSettings] = useState(null);
  const [mode, setMode] = useState('complex');
  const [activeSection, setActiveSection] = useState('general');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [settingsPath, setSettingsPath] = useState('');

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
      const keys = path.split('.');
      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  }, []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
      default:
        return <SettingsPanel {...props} section="general" />;
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          mode={mode}
          onModeChange={setMode}
        />
        <main className="flex-1 overflow-auto">
          {renderPanel()}
        </main>
      </div>
      <StatusBar
        settingsPath={settingsPath}
        saveStatus={saveStatus}
        mode={mode}
        lastSaved={lastSaved}
      />
    </div>
  );
}
