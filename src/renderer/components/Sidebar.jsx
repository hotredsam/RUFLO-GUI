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
  { id: 'addons', icon: '🧩', label: 'Add-ons Marketplace' },
];

export default function Sidebar({ activeSection, onSectionChange, mode, onModeChange }) {
  return (
    <aside className="w-60 glass flex flex-col border-r border-slate-700/50 p-6">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl">⚡</span>
        <h1 className="text-xl font-bold text-slate-100">RUFLO GUI</h1>
      </div>

      <div className="mb-8">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
              activeSection === section.id
                ? 'bg-slate-700/30 border-l-4 border-purple-500 text-purple-200'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/10'
            }`}
          >
            <span className="text-lg">{section.icon}</span>
            <span className="text-sm font-medium">{section.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
