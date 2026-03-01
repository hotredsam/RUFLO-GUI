import React from 'react';
import ModeToggle from './ModeToggle';

const SECTIONS = [
  { id: 'general', icon: '⚙️', label: 'General Settings' },
  { id: 'env', icon: '🔑', label: 'Environment Variables' },
  { id: 'hooks', icon: '🪝', label: 'Hooks' },
  { id: 'swarm', icon: '🐝', label: 'Swarm & Agents' },
  { id: 'memory', icon: '🧠', label: 'Memory & Learning' },
  { id: 'security', icon: '🛡️', label: 'Security' },
  { id: 'permissions', icon: '🔐', label: 'Permissions' },
  { id: 'skills', icon: '⚡', label: 'Skills & Commands' },
  { id: 'addons', icon: '🧩', label: 'Add-ons Marketplace' },
];

export default function Sidebar({ activeSection, onSectionChange, mode, onModeChange }) {
  return (
    <aside className="w-60 glass flex flex-col border-r border-slate-700/50">
      <div className="p-6 bg-gradient-to-b from-purple-500/10 to-transparent border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-pulse">⚡</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">RUFLO GUI</h1>
        </div>
      </div>

      <div className="p-6 pb-4">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 group ${
              activeSection === section.id
                ? 'bg-slate-700/40 border-l-4 border-purple-500 text-purple-200'
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
