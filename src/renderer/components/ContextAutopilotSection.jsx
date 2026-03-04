import React from 'react';

export default function ContextAutopilotSection({ settings, mode, onUpdate }) {
  const contextAutopilot = settings.contextAutopilot || {};

  const strategies = [
    {
      id: 'aggressive',
      name: 'Aggressive',
      icon: '⚡',
      eli5: 'Heavy compression, maximum space savings',
      complex: 'Maximum summarization for space optimization'
    },
    {
      id: 'balanced',
      name: 'Balanced',
      icon: '⚖️',
      eli5: 'Moderate compression, keeps important details',
      complex: 'Balanced between space savings and context preservation'
    },
    {
      id: 'conservative',
      name: 'Conservative',
      icon: '🛡️',
      eli5: 'Minimal compression, keeps most detail',
      complex: 'Minimal information loss at the cost of less space savings'
    }
  ];

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Context Autopilot</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Automatically manages conversation length so Claude doesn\'t forget things.'
            : 'Configure context window management including auto-compaction thresholds and strategies.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {/* Enable Toggle */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`toggle-switch ${contextAutopilot.enabled ? 'active' : ''}`}
              onClick={() => onUpdate('contextAutopilot.enabled', !contextAutopilot.enabled)}
            />
            <div>
              <div className="text-slate-200 font-medium">
                {mode === 'eli5' ? 'Auto-Manage Context' : 'Enable Context Autopilot'}
              </div>
              {mode === 'eli5' && (
                <div className="text-xs text-slate-400 mt-1">
                  Automatically manage conversation context
                </div>
              )}
              {mode === 'complex' && (
                <div className="text-xs text-slate-500 mt-1">
                  Enable automatic context window management and compaction
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Compact Threshold */}
        <div className="glass-card p-6">
          <label className="block mb-4">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Compact Threshold' : 'Compact Threshold (%)'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How full the conversation can get before automatic cleanup.
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Context utilization percentage threshold (50-95) that triggers automatic compaction.
              </div>
            )}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={contextAutopilot.compactThreshold !== undefined ? contextAutopilot.compactThreshold : 80}
              onChange={(e) => onUpdate('contextAutopilot.compactThreshold', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-slate-200 font-medium w-12 text-right">
              {contextAutopilot.compactThreshold !== undefined ? contextAutopilot.compactThreshold : 80}%
            </span>
          </div>
        </div>

        {/* Strategy Selector */}
        <div>
          <label className="block mb-3">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Compression Strategy' : 'Compaction Strategy'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Choose how aggressive to be when cleaning up conversation history
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Select the compaction strategy for context management
              </div>
            )}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => onUpdate('contextAutopilot.strategy', strategy.id)}
                className={`glass-card p-4 text-center transition-all ${
                  contextAutopilot.strategy === strategy.id
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-slate-700/30'
                }`}
              >
                <div className="text-3xl mb-2">{strategy.icon}</div>
                <div className="text-sm font-medium text-slate-200 mb-1">{strategy.name}</div>
                <div className="text-xs text-slate-400">
                  {mode === 'eli5' ? strategy.eli5 : strategy.complex}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-3">About Context Autopilot</h3>
          {mode === 'eli5' ? (
            <div className="text-sm text-slate-300 space-y-2">
              <p>Context Autopilot helps Claude maintain conversation quality by automatically managing how much history is kept:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Monitors how full the conversation context is getting</li>
                <li>When it reaches the threshold, automatically compresses old messages</li>
                <li>Preserves important details while saving space</li>
                <li>You can choose how aggressive the compression should be</li>
                <li>Helps prevent Claude from losing important context mid-conversation</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Context Autopilot implements dynamic context window management with configurable compaction strategies and thresholds.
              </p>
              <div className="bg-slate-800/50 p-3 rounded text-sm space-y-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Compaction Strategies:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Aggressive - Prioritizes space, uses heavy summarization</li>
                    <li>Balanced - Trade-off between space and detail preservation</li>
                    <li>Conservative - Minimizes information loss, accepts larger contexts</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Threshold Behavior:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Triggered when context utilization exceeds threshold percentage</li>
                    <li>Automatic compaction occurs without user intervention</li>
                    <li>Maintains critical conversation markers and recent exchanges</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Configure alongside Memory settings for comprehensive session management.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
