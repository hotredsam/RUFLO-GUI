import React, { useState } from 'react';

const KNOWN_ENV_VARS = [
  { key: 'ANTHROPIC_API_KEY', label: 'API Key', type: 'text', eli5: 'Your Anthropic API key', complex: 'ANTHROPIC_API_KEY for direct API access' },
  { key: 'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', label: 'Disable Telemetry', type: 'toggle', eli5: 'Stop sending usage data', complex: 'Disable non-essential network traffic' },
  { key: 'CLAUDE_CODE_USE_BEDROCK', label: 'Use AWS Bedrock', type: 'toggle', eli5: 'Connect through Amazon cloud', complex: 'Route API calls through AWS Bedrock' },
  { key: 'CLAUDE_CODE_USE_VERTEX', label: 'Use Google Vertex', type: 'toggle', eli5: 'Connect through Google cloud', complex: 'Route API calls through Google Vertex AI' },
  { key: 'CLAUDE_CODE_SKIP_CHROME_DOWNLOAD', label: 'Skip Chrome Download', type: 'toggle', eli5: 'Don\'t download Chrome for screenshots', complex: 'Skip Chromium download for browser automation' },
  { key: 'DISABLE_PROMPT_CACHING', label: 'Disable Prompt Caching', type: 'toggle', eli5: 'Don\'t cache AI prompts', complex: 'Disable prompt caching for API requests' },
  { key: 'DISABLE_AUTO_COMPACT', label: 'Disable Auto-Compact', type: 'toggle', eli5: 'Don\'t auto-shrink conversation history', complex: 'Disable automatic context window compaction' },
  { key: 'CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', label: 'Auto-Compact Threshold', type: 'text', eli5: 'When to shrink history (e.g., 50 = at 50%)', complex: 'Context usage % threshold that triggers compaction' },
  { key: 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', label: 'Enable Agent Teams', type: 'toggle', eli5: 'Allow AI to spawn helper agents', complex: 'Enable experimental multi-agent team coordination' },
];

export default function EnvVarsSection({ settings, mode, onUpdate }) {
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const envVars = settings.env || {};

  const handleToggleEnvVar = (key, currentValue) => {
    if (!!currentValue) {
      // Disable: remove the key
      onUpdate(`env.${key}`, undefined);
    } else {
      // Enable: set to "1"
      onUpdate(`env.${key}`, '1');
    }
  };

  const handleAddEnvVar = () => {
    if (newVarName.trim()) {
      onUpdate(`env.${newVarName}`, newVarValue);
      setNewVarName('');
      setNewVarValue('');
    }
  };

  const handleDeleteEnvVar = (name) => {
    onUpdate(`env.${name}`, undefined);
  };

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Environment Variables</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Set API keys and configuration values that your AI tools need.'
            : 'Manage environment variables injected into agent and tool execution contexts.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {KNOWN_ENV_VARS.map((setting) => {
          const value = envVars[setting.key] ?? '';
          const isEnabled = !!value;
          return (
            <div key={setting.key} className="glass-card p-6">
              <div className="mb-4">
                <label className="block mb-2">
                  <div className="text-slate-200 font-medium">{setting.label}</div>
                  {mode === 'eli5' && setting.eli5 && (
                    <div className="text-xs text-slate-400 mt-1">{setting.eli5}</div>
                  )}
                  {mode === 'complex' && setting.complex && (
                    <div className="text-xs text-slate-500 mt-1">{setting.complex}</div>
                  )}
                  {mode === 'complex' && (
                    <div className="text-xs text-slate-600 mt-1 font-mono">{setting.key}</div>
                  )}
                </label>
              </div>
              {setting.type === 'toggle' ? (
                <div
                  className={`toggle-switch ${isEnabled ? 'active' : ''}`}
                  onClick={() => handleToggleEnvVar(setting.key, value)}
                />
              ) : (
                <input
                  type={setting.type === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => onUpdate(`env.${setting.key}`, e.target.value)}
                  placeholder={setting.placeholder || ''}
                />
              )}
            </div>
          );
        })}

        <div className="glass-card p-6 border-accent/20">
          <h3 className="text-slate-200 font-medium mb-4">Custom Environment Variables</h3>
          <div className="space-y-3 mb-4">
            {Object.entries(envVars)
              .filter(([name]) => !KNOWN_ENV_VARS.some((s) => s.key === name))
              .map(([name, value]) => (
                <div key={name} className="flex gap-2 items-center bg-slate-800/30 p-3 rounded">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 font-mono">{name}</div>
                    <div className="text-sm text-slate-300">{String(value)}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteEnvVar(name)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              placeholder="Variable name (e.g., OPENAI_API_KEY)"
              className="mb-2"
            />
            <textarea
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              placeholder="Variable value"
              rows="3"
              className="mb-3"
            />
            <button
              onClick={handleAddEnvVar}
              className="btn-primary w-full"
            >
              Add Custom Variable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
