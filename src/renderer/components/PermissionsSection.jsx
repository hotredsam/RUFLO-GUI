import React, { useState } from 'react';

const COMMON_TOOLS = ['Edit', 'Write', 'Read', 'Bash', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];
const DEFAULT_MODES = ['default', 'acceptEdits', 'plan', 'dontAsk', 'bypassPermissions'];

export default function PermissionsSection({ settings, mode, onUpdate }) {
  const [newAllow, setNewAllow] = useState('');
  const [newAsk, setNewAsk] = useState('');
  const [newDeny, setNewDeny] = useState('');
  const [newDirectory, setNewDirectory] = useState('');

  const permissions = settings.permissions || {};
  const allowTools = permissions.allow || [];
  const askTools = permissions.ask || [];
  const denyTools = permissions.deny || [];
  const additionalDirs = permissions.additionalDirectories || [];
  const defaultMode = permissions.defaultMode || 'default';
  const disableBypassMode = permissions.disableBypassPermissionsMode || false;

  const handleAdd = (list, newValue, setter, path) => {
    if (newValue.trim()) {
      onUpdate(path, [...list, newValue.trim()]);
      setter('');
    }
  };

  const handleRemove = (list, item, path) => {
    onUpdate(path, list.filter((t) => t !== item));
  };

  const handleQuickAdd = (tool, listType) => {
    const paths = {
      allow: 'permissions.allow',
      ask: 'permissions.ask',
      deny: 'permissions.deny',
    };
    const lists = {
      allow: allowTools,
      ask: askTools,
      deny: denyTools,
    };

    if (!lists[listType].includes(tool)) {
      onUpdate(paths[listType], [...lists[listType], tool]);
    }
  };

  const ToolItem = ({ tool, onRemove }) => (
    <div className="flex items-center justify-between bg-slate-800/30 p-2 rounded">
      <span className="text-sm text-slate-300 font-mono">{tool}</span>
      <button
        onClick={() => onRemove(tool)}
        className="text-red-400 hover:text-red-300 text-lg"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Permissions</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Control which tools the AI can use and how it should ask for permission.'
            : 'Manage tool-level allow/ask/deny rules with pattern support. Examples: Bash, Bash(npm run lint), Edit(src/**/*.ts)'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      {mode === 'eli5' && (
        <div className="glass-card p-4 mb-6 border-blue-500/20">
          <p className="text-sm text-slate-300">
            Set your default response mode and define which tools are allowed, require asking, or are blocked.
          </p>
        </div>
      )}

      <div className="glass-card p-6 mb-8">
        <label className="block mb-2">
          <div className="text-slate-200 font-medium">
            {mode === 'eli5' ? 'Default Response Mode' : 'permissions.defaultMode'}
          </div>
          {mode === 'eli5' && (
            <div className="text-xs text-slate-400 mt-1">
              How the AI handles tools by default
            </div>
          )}
        </label>
        <select
          value={defaultMode}
          onChange={(e) => onUpdate('permissions.defaultMode', e.target.value)}
          className="w-full md:w-64"
        >
          {DEFAULT_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-4">Allow</h3>

          <div className="glass-card p-4">
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {allowTools.map((tool) => (
                <ToolItem
                  key={tool}
                  tool={tool}
                  onRemove={() => handleRemove(allowTools, tool, 'permissions.allow')}
                />
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAllow}
                  onChange={(e) => setNewAllow(e.target.value)}
                  placeholder="Tool or pattern"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(allowTools, newAllow, setNewAllow, 'permissions.allow')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(allowTools, newAllow, setNewAllow, 'permissions.allow')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>

              <div className="text-xs text-slate-500 mb-2 font-medium">Quick Add:</div>
              <div className="flex flex-wrap gap-2">
                {COMMON_TOOLS.filter((t) => !allowTools.includes(t)).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleQuickAdd(tool, 'allow')}
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
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Ask</h3>

          <div className="glass-card p-4">
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {askTools.map((tool) => (
                <ToolItem
                  key={tool}
                  tool={tool}
                  onRemove={() => handleRemove(askTools, tool, 'permissions.ask')}
                />
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAsk}
                  onChange={(e) => setNewAsk(e.target.value)}
                  placeholder="Tool or pattern"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(askTools, newAsk, setNewAsk, 'permissions.ask')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(askTools, newAsk, setNewAsk, 'permissions.ask')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>

              <div className="text-xs text-slate-500 mb-2 font-medium">Quick Add:</div>
              <div className="flex flex-wrap gap-2">
                {COMMON_TOOLS.filter((t) => !askTools.includes(t)).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleQuickAdd(tool, 'ask')}
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
          <h3 className="text-lg font-semibold text-red-400 mb-4">Deny</h3>

          <div className="glass-card p-4">
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {denyTools.map((tool) => (
                <ToolItem
                  key={tool}
                  tool={tool}
                  onRemove={() => handleRemove(denyTools, tool, 'permissions.deny')}
                />
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newDeny}
                  onChange={(e) => setNewDeny(e.target.value)}
                  placeholder="Tool or pattern"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(denyTools, newDeny, setNewDeny, 'permissions.deny')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(denyTools, newDeny, setNewDeny, 'permissions.deny')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>

              <div className="text-xs text-slate-500 mb-2 font-medium">Quick Add:</div>
              <div className="flex flex-wrap gap-2">
                {COMMON_TOOLS.filter((t) => !denyTools.includes(t)).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleQuickAdd(tool, 'deny')}
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

      <div className="glass-card p-6 mb-8">
        <label className="block mb-4">
          <div className="text-slate-200 font-medium">Additional Directories</div>
          {mode === 'eli5' && (
            <div className="text-xs text-slate-400 mt-1">
              Extra directories the AI can access
            </div>
          )}
        </label>

        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
          {additionalDirs.map((dir) => (
            <ToolItem
              key={dir}
              tool={dir}
              onRemove={() => handleRemove(additionalDirs, dir, 'permissions.additionalDirectories')}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newDirectory}
            onChange={(e) => setNewDirectory(e.target.value)}
            placeholder="/path/to/directory"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd(additionalDirs, newDirectory, setNewDirectory, 'permissions.additionalDirectories')}
            className="flex-1"
          />
          <button
            onClick={() => handleAdd(additionalDirs, newDirectory, setNewDirectory, 'permissions.additionalDirectories')}
            className="btn-primary"
          >
            Add
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <label className="flex items-center gap-4 cursor-pointer">
          <div
            className={`toggle-switch ${disableBypassMode ? 'active' : ''}`}
            onClick={() => onUpdate('permissions.disableBypassPermissionsMode', !disableBypassMode)}
          />
          <div>
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Disable Bypass Mode' : 'Disable bypassPermissions Mode'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Prevent bypassing permission checks
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
