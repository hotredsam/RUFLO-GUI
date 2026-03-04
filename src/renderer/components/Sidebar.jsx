import React from 'react';
import ModeToggle from './ModeToggle';
import ThemeSelector from './ThemeSelector';

const SECTIONS = [
  { id: 'general', icon: '⚙️', label: 'General Settings' },
  { id: 'env', icon: '🔑', label: 'Environment Variables' },
  { id: 'hooks', icon: '🪝', label: 'Hooks' },
  { id: 'swarm', icon: '🐝', label: 'Agent Teams' },
  { id: 'memory', icon: '🧠', label: 'Memory & Cleanup' },
  { id: 'security', icon: '🛡️', label: 'Sandbox & Security' },
  { id: 'permissions', icon: '🔐', label: 'Permissions' },
  { id: 'skills', icon: '⚡', label: 'Skills & Commands' },
  { id: 'addons', icon: '🧩', label: 'Add-ons Marketplace' },
  { id: 'capabilities', icon: '🎯', label: 'Capabilities' },
  { id: 'guide', icon: '📖', label: 'User Guide' },
  { id: 'models', icon: '🤖', label: 'Model Tiers' },
  { id: 'plugins', icon: '📦', label: 'Plugin Packs' },
  { id: 'mcp', icon: '🔌', label: 'MCP Servers' },
  { id: 'context', icon: '🧭', label: 'Context Autopilot' },
  { id: 'verification', icon: '✅', label: 'Verification' },
  { id: 'templates', icon: '📋', label: 'CLAUDE.md Templates' },
  { id: 'diagnostics', icon: '🔧', label: 'Diagnostics' },
];

export default function Sidebar({ activeSection, onSectionChange, mode, onModeChange, theme, onThemeChange }) {
  return (
    <aside className="w-60 glass flex flex-col border-r border-slate-700/50">
      <div className="p-6 bg-gradient-to-b from-accent/10 to-transparent border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-pulse">⚡</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent-light to-accent-med-dark bg-clip-text text-transparent">RUFLO GUI</h1>
        </div>
      </div>

      <div className="p-6 pb-4">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
        <div className="mt-4">
          <ThemeSelector currentTheme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 group ${
              activeSection === section.id
                ? 'bg-slate-700/40 border-l-4 border-accent text-accent-light'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/20'
            }`}
          >
            <span className="text-lg transition-transform group-hover:scale-110">{section.icon}</span>
            <span className="text-sm font-medium">{section.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
