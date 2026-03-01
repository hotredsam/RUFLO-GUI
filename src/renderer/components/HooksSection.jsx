import React, { useState } from 'react';

const HOOK_TYPES = [
  { id: 'PreToolUse', label: 'Pre-Tool Hook', description: 'Runs before a tool is used' },
  { id: 'PostToolUse', label: 'Post-Tool Hook', description: 'Runs after a tool completes' },
  { id: 'Notification', label: 'Notification Hook', description: 'Sends notifications on events' },
  { id: 'Stop', label: 'Stop Hook', description: 'Runs when a process stops' },
  { id: 'SubagentStop', label: 'Subagent Stop Hook', description: 'Runs when a subagent stops' },
];

export default function HooksSection({ settings, mode, onUpdate }) {
  const [newHookType, setNewHookType] = useState('PreToolUse');
  const [newHookCommand, setNewHookCommand] = useState('');

  const hooks = settings.hooks || {};

  const handleAddHook = () => {
    if (newHookCommand.trim()) {
      onUpdate(`hooks.${newHookType}`, {
        enabled: true,
        command: newHookCommand,
        matcher: '',
        timeout: null,
      });
      setNewHookCommand('');
    }
  };

  const handleHookUpdate = (hookType, field, value) => {
    const hook = hooks[hookType] || {};
    onUpdate(`hooks.${hookType}`, {
      ...hook,
      [field]: value,
    });
  };

  const handleDeleteHook = (hookType) => {
    const newHooks = { ...hooks };
    delete newHooks[hookType];
    onUpdate('hooks', newHooks);
  };

  return (
    <div className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-8">Hooks Configuration</h2>

      <div className="space-y-6">
        {HOOK_TYPES.map((hookType) => {
          const hook = hooks[hookType.id];
          if (!hook) return null;

          return (
            <div key={hookType.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-slate-200 font-medium">{hookType.label}</h3>
                  {mode === 'eli5' && (
                    <p className="text-xs text-slate-400 mt-1">{hookType.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteHook(hookType.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Enabled</label>
                  <div
                    className={`toggle-switch ${hook.enabled ? 'active' : ''}`}
                    onClick={() => handleHookUpdate(hookType.id, 'enabled', !hook.enabled)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Command</label>
                  <input
                    type="text"
                    value={hook.command || ''}
                    onChange={(e) => handleHookUpdate(hookType.id, 'command', e.target.value)}
                    placeholder="e.g., /usr/bin/notify-send"
                    className="font-mono text-sm"
                  />
                </div>

                {hookType.id !== 'Notification' && hookType.id !== 'Stop' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">
                      Tool Matcher Pattern
                    </label>
                    <input
                      type="text"
                      value={hook.matcher || ''}
                      onChange={(e) => handleHookUpdate(hookType.id, 'matcher', e.target.value)}
                      placeholder="e.g., bash, write, edit (optional)"
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={hook.timeout || ''}
                    onChange={(e) =>
                      handleHookUpdate(hookType.id, 'timeout', e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="Optional timeout"
                    min="1"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="glass-card p-6 border-accent/20">
          <h3 className="text-slate-200 font-medium mb-4">Add New Hook</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Hook Type</label>
              <select
                value={newHookType}
                onChange={(e) => setNewHookType(e.target.value)}
                className="w-full"
              >
                {HOOK_TYPES.filter((h) => !hooks[h.id]).map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Command</label>
              <input
                type="text"
                value={newHookCommand}
                onChange={(e) => setNewHookCommand(e.target.value)}
                placeholder="Command to execute"
              />
            </div>
            <button onClick={handleAddHook} className="btn-primary w-full">
              Add Hook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
