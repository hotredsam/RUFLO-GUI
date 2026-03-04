import React from 'react';

export default function StatusBar({ settings, settingsPath, saveStatus, mode, lastSaved }) {
  const statusIcon = {
    saved: '🟢',
    saving: '🟡',
    unsaved: '🟡',
    error: '🔴',
  };

  const isSwarmEnabled = settings?.swarm?.enabled || settings?.env?.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === '1';
  const swarmTopology = settings?.swarm?.topology || 'hierarchical';
  const primaryProvider = settings?.modelTiers?.primary?.provider || 'anthropic';
  const memoryBackend = settings?.memory?.backend || 'json';
  const contextAutopilotEnabled = settings?.contextAutopilot?.enabled || false;

  const formatTime = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return 'just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    const diffDays = Math.floor(diffSecs / 86400);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="glass status-bar border-t border-slate-700/50 px-6 py-3 flex items-center justify-between text-xs">
      <div className="text-slate-500 font-mono truncate">
        {settingsPath || 'Loading...'}
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <span className={`${saveStatus === 'saving' ? 'animate-pulse' : ''}`}>{statusIcon[saveStatus]}</span>
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
        {isSwarmEnabled && (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-300 flex items-center gap-1">
            <span>🐝</span>
            <span>Swarm: {swarmTopology}</span>
          </span>
        )}
        <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-500/20 text-purple-300">
          {primaryProvider.charAt(0).toUpperCase() + primaryProvider.slice(1)}
        </span>
        <span className="px-2 py-1 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300">
          {memoryBackend.toUpperCase()}
        </span>
        {contextAutopilotEnabled && (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 flex items-center gap-1">
            <span>🧭</span>
            <span>Autopilot</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded text-xs font-semibold transition ${
          mode === 'eli5'
            ? 'bg-blue-500/20 text-blue-300'
            : 'bg-accent/20 text-accent-med'
        }`}>
          {mode === 'eli5' ? 'ELI5 Mode' : 'Complex Mode'}
        </span>
      </div>
    </div>
  );
}
