import React, { useState } from 'react';

const COMMON_TOOLS = ['Edit', 'Write', 'Read', 'Bash', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];

export default function PermissionsSection({ settings, mode, onUpdate }) {
  const [newAllowed, setNewAllowed] = useState('');
  const [newDenied, setNewDenied] = useState('');

  const permissions = settings.permissions || {};
  const allowedTools = permissions.allowed || [];
  const deniedTools = permissions.denied || [];

  const handleAddAllowed = () => {
    if (newAllowed.trim()) {
      onUpdate('permissions.allowed', [...allowedTools, newAllowed.trim()]);
      setNewAllowed('');
    }
  };

  const handleAddDenied = () => {
    if (newDenied.trim()) {
      onUpdate('permissions.denied', [...deniedTools, newDenied.trim()]);
      setNewDenied('');
    }
  };

  const handleRemoveAllowed = (tool) => {
    onUpdate('permissions.allowed', allowedTools.filter((t) => t !== tool));
  };

  const handleRemoveDenied = (tool) => {
    onUpdate('permissions.denied', deniedTools.filter((t) => t !== tool));
  };

  const handleQuickAdd = (tool, isAllowed) => {
    if (isAllowed) {
      if (!allowedTools.includes(tool)) {
        onUpdate('permissions.allowed', [...allowedTools, tool]);
      }
    } else {
      if (!deniedTools.includes(tool)) {
        onUpdate('permissions.denied', [...deniedTools, tool]);
      }
    }
  };

  return (
    <div className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-8">Permissions</h2>

      {mode === 'eli5' && (
        <div className="glass-card p-4 mb-6 border-blue-500/20">
          <p className="text-sm text-slate-300">
            Define which tools are allowed or denied. Allowed tools can be used, denied tools cannot.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">✓ Allowed Tools</h3>

          <div className="glass-card p-4 mb-4">
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {allowedTools.map((tool) => (
                <div key={tool} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                  <span className="text-sm text-slate-300">{tool}</span>
                  <button
                    onClick={() => handleRemoveAllowed(tool)}
                    className="text-red-400 hover:text-red-300 text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAllowed}
                  onChange={(e) => setNewAllowed(e.target.value)}
                  placeholder="Tool name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAllowed()}
                />
                <button onClick={handleAddAllowed} className="btn-primary">
                  Add
                </button>
              </div>

              <div className="text-xs text-slate-500 mb-2 font-medium">Quick Add:</div>
              <div className="flex flex-wrap gap-2">
                {COMMON_TOOLS.filter((t) => !allowedTools.includes(t)).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleQuickAdd(tool, true)}
                    className="px-2 py-1 bg-slate-700/30 text-slate-300 rounded text-xs hover:bg-slate-700/50"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-4">✗ Denied Tools</h3>

          <div className="glass-card p-4 mb-4">
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {deniedTools.map((tool) => (
                <div key={tool} className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
                  <span className="text-sm text-slate-300">{tool}</span>
                  <button
                    onClick={() => handleRemoveDenied(tool)}
                    className="text-red-400 hover:text-red-300 text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newDenied}
                  onChange={(e) => setNewDenied(e.target.value)}
                  placeholder="Tool name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDenied()}
                />
                <button onClick={handleAddDenied} className="btn-primary">
                  Add
                </button>
              </div>

              <div className="text-xs text-slate-500 mb-2 font-medium">Quick Add:</div>
              <div className="flex flex-wrap gap-2">
                {COMMON_TOOLS.filter((t) => !deniedTools.includes(t)).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleQuickAdd(tool, false)}
                    className="px-2 py-1 bg-slate-700/30 text-slate-300 rounded text-xs hover:bg-slate-700/50"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
