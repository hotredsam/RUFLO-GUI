import React from 'react';

export default function StatusBar({ settingsPath, saveStatus, mode, lastSaved }) {
  const statusIcon = {
    saved: '🟢',
    saving: '🟡',
    unsaved: '🟡',
    error: '🔴',
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return 'just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return 'yesterday';
  };

  return (
    <div className="glass border-t border-slate-700/50 px-6 py-3 flex items-center justify-between text-xs">
      <div className="text-slate-500 font-mono">
        {settingsPath || 'Loading...'}
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <span>{statusIcon[saveStatus]}</span>
        <span>
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'unsaved' && 'Unsaved changes'}
          {saveStatus === 'error' && 'Save failed'}
        </span>
        {lastSaved && (
          <span className="text-slate-600">
            Last saved: {formatTime(lastSaved)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded text-xs font-semibold ${
          mode === 'eli5'
            ? 'bg-blue-500/20 text-blue-300'
            : 'bg-purple-500/20 text-purple-300'
        }`}>
          {mode === 'eli5' ? 'ELI5 Mode' : 'Complex Mode'}
        </span>
      </div>
    </div>
  );
}
