import React from 'react';

export default function ModeToggle({ mode, onModeChange }) {
  const isEli5 = mode === 'eli5';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase">Mode</span>
        <div className="flex-1"></div>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('complex')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              !isEli5
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700/30 text-slate-400 hover:text-slate-300'
            }`}
          >
            Complex
          </button>
          <button
            onClick={() => onModeChange('eli5')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              isEli5
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700/30 text-slate-400 hover:text-slate-300'
            }`}
          >
            ELI5
          </button>
        </div>
      </div>
    </div>
  );
}
