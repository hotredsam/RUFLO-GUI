import React, { useState } from 'react';

const HOOK_TYPES = [
  { id: 'PreToolUse', label: 'Pre-Tool Use', description: 'Runs before a tool is used', hasMatcher: true },
  { id: 'PostToolUse', label: 'Post-Tool Use', description: 'Runs after a tool completes', hasMatcher: true },
  { id: 'PostToolUseFailure', label: 'Post-Tool Use Failure', description: 'Runs after a tool fails', hasMatcher: true },
  { id: 'PermissionRequest', label: 'Permission Request', description: 'Runs when permission is requested', hasMatcher: true },
  { id: 'UserPromptSubmit', label: 'User Prompt Submit', description: 'Runs when user submits a prompt', hasMatcher: false },
  { id: 'Notification', label: 'Notification', description: 'Runs when a notification is sent', hasMatcher: false },
  { id: 'SessionStart', label: 'Session Start', description: 'Runs when a new session begins', hasMatcher: false },
  { id: 'SessionEnd', label: 'Session End', description: 'Runs when a session ends', hasMatcher: false },
  { id: 'Stop', label: 'Stop', description: 'Runs when the agent stops', hasMatcher: false },
  { id: 'SubagentStart', label: 'Subagent Start', description: 'Runs when a subagent starts', hasMatcher: false },
  { id: 'SubagentStop', label: 'Subagent Stop', description: 'Runs when a subagent stops', hasMatcher: false },
  { id: 'TeammateIdle', label: 'Teammate Idle', description: 'Runs when a teammate goes idle', hasMatcher: false },
  { id: 'TaskCompleted', label: 'Task Completed', description: 'Runs when a task is completed', hasMatcher: false },
  { id: 'ConfigChange', label: 'Config Change', description: 'Runs when configuration changes', hasMatcher: false },
  { id: 'WorktreeCreate', label: 'Worktree Create', description: 'Runs when a git worktree is created', hasMatcher: false },
  { id: 'WorktreeRemove', label: 'Worktree Remove', description: 'Runs when a git worktree is removed', hasMatcher: false },
  { id: 'PreCompact', label: 'Pre-Compact', description: 'Runs before context compaction', hasMatcher: true },
];

const HOOK_ACTION_TYPES = [
  { id: 'command', label: 'Command', description: 'Run a shell command' },
  { id: 'http', label: 'HTTP Request', description: 'Send an HTTP request' },
  { id: 'prompt', label: 'Prompt', description: 'Inject text into context' },
  { id: 'agent', label: 'Agent', description: 'Run a subagent' },
];

export default function HooksSection({ settings, mode, onUpdate }) {
  const [newHookType, setNewHookType] = useState('PreToolUse');
  const [newHookActionType, setNewHookActionType] = useState('command');
  const [newHookMatcher, setNewHookMatcher] = useState('');

  // Command fields
  const [newHookCommand, setNewHookCommand] = useState('');
  const [newHookTimeout, setNewHookTimeout] = useState('');

  // HTTP fields
  const [newHookUrl, setNewHookUrl] = useState('');
  const [newHookMethod, setNewHookMethod] = useState('POST');
  const [newHookHeaders, setNewHookHeaders] = useState('');
  const [newHookHttpTimeout, setNewHookHttpTimeout] = useState('');

  // Prompt fields
  const [newHookPrompt, setNewHookPrompt] = useState('');

  // Agent fields
  const [newHookAgent, setNewHookAgent] = useState('');

  const hooks = settings.hooks || {};

  const resetFormFields = () => {
    setNewHookCommand('');
    setNewHookMatcher('');
    setNewHookTimeout('');
    setNewHookUrl('');
    setNewHookMethod('POST');
    setNewHookHeaders('');
    setNewHookHttpTimeout('');
    setNewHookPrompt('');
    setNewHookAgent('');
  };

  const buildHookObject = () => {
    const hookObj = { type: newHookActionType };

    switch (newHookActionType) {
      case 'command':
        if (!newHookCommand.trim()) return null;
        hookObj.command = newHookCommand.trim();
        if (newHookTimeout) hookObj.timeout = parseInt(newHookTimeout);
        break;
      case 'http':
        if (!newHookUrl.trim()) return null;
        hookObj.url = newHookUrl.trim();
        if (newHookMethod) hookObj.method = newHookMethod;
        if (newHookHeaders.trim()) {
          try {
            hookObj.headers = JSON.parse(newHookHeaders);
          } catch {
            alert('Invalid JSON in headers');
            return null;
          }
        }
        if (newHookHttpTimeout) hookObj.timeout = parseInt(newHookHttpTimeout);
        break;
      case 'prompt':
        if (!newHookPrompt.trim()) return null;
        hookObj.prompt = newHookPrompt.trim();
        break;
      case 'agent':
        if (!newHookAgent.trim()) return null;
        hookObj.agent = newHookAgent.trim();
        break;
      default:
        return null;
    }

    return hookObj;
  };

  const handleAddHook = () => {
    const hookObj = buildHookObject();
    if (!hookObj) return;

    const hookType = HOOK_TYPES.find(h => h.id === newHookType);
    const existingEntries = hooks[newHookType] || [];

    const newEntry = {
      hooks: [hookObj],
    };
    if (hookType.hasMatcher && newHookMatcher.trim()) {
      newEntry.matcher = newHookMatcher.trim();
    }

    onUpdate(`hooks.${newHookType}`, [...existingEntries, newEntry]);
    resetFormFields();
    setNewHookActionType('command');
  };

  const handleDeleteEntry = (hookTypeId, entryIndex) => {
    const entries = hooks[hookTypeId] || [];
    const updated = entries.filter((_, i) => i !== entryIndex);
    if (updated.length === 0) {
      const newHooks = { ...hooks };
      delete newHooks[hookTypeId];
      onUpdate('hooks', newHooks);
    } else {
      onUpdate(`hooks.${hookTypeId}`, updated);
    }
  };

  const handleUpdateEntry = (hookTypeId, entryIndex, field, value) => {
    const entries = [...(hooks[hookTypeId] || [])];
    const entry = { ...entries[entryIndex] };
    const hook = entry.hooks[0];

    if (field === 'matcher') {
      entry.matcher = value;
    } else if (field === 'type') {
      // Changing the hook type
      entry.hooks = [{ type: value }];
    } else if (field === 'command') {
      entry.hooks = [{ ...hook, command: value }];
    } else if (field === 'timeout') {
      const hookCopy = { ...hook };
      if (value) {
        hookCopy.timeout = parseInt(value);
      } else {
        delete hookCopy.timeout;
      }
      entry.hooks = [hookCopy];
    } else if (field === 'url') {
      entry.hooks = [{ ...hook, url: value }];
    } else if (field === 'method') {
      entry.hooks = [{ ...hook, method: value }];
    } else if (field === 'headers') {
      const hookCopy = { ...hook };
      if (value.trim()) {
        try {
          hookCopy.headers = JSON.parse(value);
        } catch {
          alert('Invalid JSON in headers');
          return;
        }
      } else {
        delete hookCopy.headers;
      }
      entry.hooks = [hookCopy];
    } else if (field === 'httpTimeout') {
      const hookCopy = { ...hook };
      if (value) {
        hookCopy.timeout = parseInt(value);
      } else {
        delete hookCopy.timeout;
      }
      entry.hooks = [hookCopy];
    } else if (field === 'prompt') {
      entry.hooks = [{ ...hook, prompt: value }];
    } else if (field === 'agent') {
      entry.hooks = [{ ...hook, agent: value }];
    }

    entries[entryIndex] = entry;
    onUpdate(`hooks.${hookTypeId}`, entries);
  };

  const getHookActionDisplay = (hookType) => {
    const actionType = HOOK_ACTION_TYPES.find(a => a.id === hookType.type);
    return actionType ? actionType.label : hookType.type;
  };

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Hooks</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Run custom scripts, HTTP requests, or inject text automatically before or after AI actions.'
            : 'Configure lifecycle hooks for tool invocations, session events, and process lifecycle with multiple action types.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {HOOK_TYPES.map((hookType) => {
          const entries = hooks[hookType.id];
          if (!entries || !Array.isArray(entries) || entries.length === 0) return null;

          return (
            <div key={hookType.id} className="glass-card p-6">
              <div className="mb-4">
                <h3 className="text-slate-200 font-medium">{hookType.label}</h3>
                {mode === 'eli5' && (
                  <p className="text-xs text-slate-400 mt-1">{hookType.description}</p>
                )}
                {mode === 'complex' && (
                  <p className="text-xs text-slate-600 mt-1 font-mono">{hookType.id}</p>
                )}
              </div>

              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <div key={idx} className="bg-slate-800/30 p-4 rounded space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {hookType.hasMatcher && (
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Matcher</label>
                            <input
                              type="text"
                              value={entry.matcher || ''}
                              onChange={(e) => handleUpdateEntry(hookType.id, idx, 'matcher', e.target.value)}
                              placeholder="e.g., Bash, Write|Edit"
                              className="font-mono text-sm"
                            />
                          </div>
                        )}
                        {entry.hooks && entry.hooks.map((hook, hIdx) => (
                          <div key={hIdx} className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1">Action Type</label>
                              <select
                                value={hook.type || 'command'}
                                onChange={(e) => handleUpdateEntry(hookType.id, idx, 'type', e.target.value)}
                                className="w-full"
                              >
                                {HOOK_ACTION_TYPES.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {hook.type === 'command' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-slate-400 mb-1">Command</label>
                                  <input
                                    type="text"
                                    value={hook.command || ''}
                                    onChange={(e) => handleUpdateEntry(hookType.id, idx, 'command', e.target.value)}
                                    className="font-mono text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-400 mb-1">Timeout (ms)</label>
                                  <input
                                    type="number"
                                    value={hook.timeout || ''}
                                    onChange={(e) => handleUpdateEntry(hookType.id, idx, 'timeout', e.target.value)}
                                    placeholder="Optional"
                                    min="1000"
                                    className="w-32"
                                  />
                                </div>
                              </>
                            )}

                            {hook.type === 'http' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-slate-400 mb-1">URL</label>
                                  <input
                                    type="text"
                                    value={hook.url || ''}
                                    onChange={(e) => handleUpdateEntry(hookType.id, idx, 'url', e.target.value)}
                                    placeholder="https://example.com/webhook"
                                    className="font-mono text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-400 mb-1">Method</label>
                                  <select
                                    value={hook.method || 'POST'}
                                    onChange={(e) => handleUpdateEntry(hookType.id, idx, 'method', e.target.value)}
                                    className="w-32"
                                  >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-400 mb-1">Headers (JSON, optional)</label>
                                  <textarea
                                    value={hook.headers ? JSON.stringify(hook.headers, null, 2) : ''}
                                    onChange={(e) => handleUpdateEntry(hookType.id, idx, 'headers', e.target.value)}
                                    placeholder='{"Authorization": "Bearer token"}'
                                    className="font-mono text-sm"
                                    rows="3"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-400 mb-1">Timeout (ms)</label>
                                  <input
                                    type="number"
                                    value={hook.timeout || ''}
                                    onChange={(e) => handleUpdateEntry(hookType.id, idx, 'httpTimeout', e.target.value)}
                                    placeholder="Optional"
                                    min="1000"
                                    className="w-32"
                                  />
                                </div>
                              </>
                            )}

                            {hook.type === 'prompt' && (
                              <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Prompt Text</label>
                                <textarea
                                  value={hook.prompt || ''}
                                  onChange={(e) => handleUpdateEntry(hookType.id, idx, 'prompt', e.target.value)}
                                  placeholder="Text to inject into context"
                                  className="font-mono text-sm"
                                  rows="3"
                                />
                              </div>
                            )}

                            {hook.type === 'agent' && (
                              <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Agent Name</label>
                                <input
                                  type="text"
                                  value={hook.agent || ''}
                                  onChange={(e) => handleUpdateEntry(hookType.id, idx, 'agent', e.target.value)}
                                  placeholder="e.g., my-agent"
                                  className="font-mono text-sm"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(hookType.id, idx)}
                        className="ml-3 px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 text-sm flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="glass-card p-6 border-accent/20">
          <h3 className="text-slate-200 font-medium mb-4">Add New Hook</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Hook Event Type</label>
                <select
                  value={newHookType}
                  onChange={(e) => setNewHookType(e.target.value)}
                  className="w-full"
                >
                  {HOOK_TYPES.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Hook Action Type</label>
                <select
                  value={newHookActionType}
                  onChange={(e) => setNewHookActionType(e.target.value)}
                  className="w-full"
                >
                  {HOOK_ACTION_TYPES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {HOOK_TYPES.find(h => h.id === newHookType)?.hasMatcher && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Matcher Pattern</label>
                <input
                  type="text"
                  value={newHookMatcher}
                  onChange={(e) => setNewHookMatcher(e.target.value)}
                  placeholder="e.g., Bash, Write|Edit (optional)"
                  className="font-mono text-sm"
                />
              </div>
            )}

            {newHookActionType === 'command' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Command</label>
                  <input
                    type="text"
                    value={newHookCommand}
                    onChange={(e) => setNewHookCommand(e.target.value)}
                    placeholder="Command to execute"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Timeout (ms)</label>
                  <input
                    type="number"
                    value={newHookTimeout}
                    onChange={(e) => setNewHookTimeout(e.target.value)}
                    placeholder="Optional (e.g., 5000)"
                    min="1000"
                  />
                </div>
              </>
            )}

            {newHookActionType === 'http' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">URL</label>
                  <input
                    type="text"
                    value={newHookUrl}
                    onChange={(e) => setNewHookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Method</label>
                    <select
                      value={newHookMethod}
                      onChange={(e) => setNewHookMethod(e.target.value)}
                      className="w-full"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Timeout (ms)</label>
                    <input
                      type="number"
                      value={newHookHttpTimeout}
                      onChange={(e) => setNewHookHttpTimeout(e.target.value)}
                      placeholder="Optional"
                      min="1000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Headers (JSON, optional)</label>
                  <textarea
                    value={newHookHeaders}
                    onChange={(e) => setNewHookHeaders(e.target.value)}
                    placeholder='{"Authorization": "Bearer token"}'
                    className="font-mono text-sm"
                    rows="3"
                  />
                </div>
              </>
            )}

            {newHookActionType === 'prompt' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Prompt Text</label>
                <textarea
                  value={newHookPrompt}
                  onChange={(e) => setNewHookPrompt(e.target.value)}
                  placeholder="Text to inject into context"
                  className="font-mono text-sm"
                  rows="4"
                />
              </div>
            )}

            {newHookActionType === 'agent' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={newHookAgent}
                  onChange={(e) => setNewHookAgent(e.target.value)}
                  placeholder="e.g., my-agent"
                  className="font-mono text-sm"
                />
              </div>
            )}

            <button onClick={handleAddHook} className="btn-primary w-full">
              Add Hook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
