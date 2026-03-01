import React from 'react';

const BACKENDS = ['sqlite', 'json', 'memory'];

export default function MemorySection({ settings, mode, onUpdate }) {
  const memory = settings.memory || {};

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Memory & Learning</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Control how your AI remembers things between sessions.'
            : 'Configure persistence backend, vector search, retention policies, and auto-consolidation.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Memory Storage Type' : 'Backend'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                SQLite: Most reliable, JSON: Simple file-based, Memory: Fast but temporary
              </div>
            )}
          </label>
          <select
            value={memory.backend || 'sqlite'}
            onChange={(e) => onUpdate('memory.backend', e.target.value)}
          >
            {BACKENDS.map((backend) => (
              <option key={backend} value={backend}>
                {backend.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Smart Memory Search' : 'HNSW Vector Search'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Use advanced AI to find related memories instead of simple keyword search
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${memory.vectorSearch ? 'active' : ''}`}
            onClick={() => onUpdate('memory.vectorSearch', !memory.vectorSearch)}
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Keep Memories For' : 'Retention Days'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How long to keep old memories (in days)
              </div>
            )}
          </label>
          <input
            type="number"
            value={memory.retentionDays || 30}
            onChange={(e) =>
              onUpdate('memory.retentionDays', e.target.value ? parseInt(e.target.value) : 30)
            }
            min="1"
            max="365"
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Maximum Memories' : 'Max Entries'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Maximum number of memories to store
              </div>
            )}
          </label>
          <input
            type="number"
            value={memory.maxEntries || 10000}
            onChange={(e) =>
              onUpdate('memory.maxEntries', e.target.value ? parseInt(e.target.value) : 10000)
            }
            min="100"
            max="100000"
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Auto-Organize Memories' : 'Auto-Consolidate'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Automatically clean up and organize old memories
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${memory.autoConsolidate ? 'active' : ''}`}
            onClick={() => onUpdate('memory.autoConsolidate', !memory.autoConsolidate)}
          />
        </div>
      </div>
    </div>
  );
}
