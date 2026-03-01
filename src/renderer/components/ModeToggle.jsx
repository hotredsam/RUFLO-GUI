import React from 'react';

export default function ModeToggle({ mode, onModeChange }) {
  const isEli5 = mode === 'eli5';
  return (
    <div className="glass-card p-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Mode</p>
      <div className="mode-toggle-pill w-full">
        <button
          onClick={() => onModeChange('complex')}
          className={`mode-toggle-btn flex-1 ${!isEli5 ? 'active' : ''}`}
        >
          Complex
        </button>
        <button
          onClick={() => onModeChange('eli5')}
          className={`mode-toggle-btn flex-1 ${isEli5 ? 'active' : ''}`}
        >
          ELI5
        </button>
      </div>
    </div>
  );
}
