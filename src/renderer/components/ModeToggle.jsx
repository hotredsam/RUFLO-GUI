import React from 'react';

export default function ModeToggle({ mode, onModeChange }) {
  const isEli5 = mode === 'eli5';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase">Mode</span>
        <div className="flex-1"></div>
        <div className="mode-toggle-pill">
          <button
            onClick={() => onModeChange('complex')}
            className={`mode-toggle-btn ${!isEli5 ? 'active' : ''}`}
          >
            <span className="whitespace-nowrap">Complex</span>
          </button>
          <button
            onClick={() => onModeChange('eli5')}
            className={`mode-toggle-btn ${isEli5 ? 'active' : ''}`}
          >
            <span className="whitespace-nowrap">ELI5</span>
          </button>
        </div>
      </div>
    </div>
  );
}
