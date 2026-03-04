import React, { useState } from 'react';

export default function MemorySection({ settings, mode, onUpdate }) {
  const memory = settings.memory || {};
  const [hnswExpanded, setHnswExpanded] = useState(false);

  const storageBackends = [
    {
      id: 'sqlite',
      name: 'SQLite',
      icon: '🗄️',
      eli5: 'Structured database storage',
      complex: 'SQLite-backed persistent storage with indexed queries'
    },
    {
      id: 'json',
      name: 'JSON',
      icon: '📄',
      eli5: 'Simple file storage',
      complex: 'JSON file-based storage, human-readable, easy to backup'
    },
    {
      id: 'hybrid',
      name: 'Hybrid',
      icon: '🔄',
      eli5: 'Best of both worlds',
      complex: 'Dual SQLite + JSON storage with cross-backend sync'
    },
    {
      id: 'memory',
      name: 'Memory',
      icon: '⚡',
      eli5: 'Fast in-memory only',
      complex: 'In-process memory store, fastest but non-persistent'
    }
  ];

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Memory &amp; Cleanup</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Control how Claude Code stores and manages conversation history.'
            : 'Configure session data storage, retention, and indexing parameters.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {/* Storage Backend Selector */}
        <div>
          <label className="block mb-3">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Where to Store Memory' : 'Storage Backend'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Choose how Claude Code stores conversation history
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Select the primary storage backend for memory persistence and retrieval
              </div>
            )}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {storageBackends.map((backend) => (
              <button
                key={backend.id}
                onClick={() => onUpdate('memory.backend', backend.id)}
                className={`glass-card p-4 text-center transition-all ${
                  memory.backend === backend.id
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-slate-700/30'
                }`}
              >
                <div className="text-3xl mb-2">{backend.icon}</div>
                <div className="text-sm font-medium text-slate-200 mb-1">{backend.name}</div>
                <div className="text-xs text-slate-400">
                  {mode === 'eli5' ? backend.eli5 : backend.complex}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Memory Path */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Memory Storage Location' : 'Memory Path'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Folder where Claude Code stores all memory files
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                File system path for memory storage (default: ~/.claude/memory)
              </div>
            )}
          </label>
          <input
            type="text"
            value={memory.path !== undefined ? memory.path : '~/.claude/memory'}
            onChange={(e) => onUpdate('memory.path', e.target.value || undefined)}
            placeholder="~/.claude/memory"
          />
        </div>

        {/* Max Size */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Maximum Memory Size' : 'Max Size'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Largest total size of stored memories before cleanup begins
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Maximum storage size before automatic pruning (default: 500 MB)
              </div>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={memory.maxSizeMB !== undefined ? memory.maxSizeMB : 500}
              onChange={(e) =>
                onUpdate('memory.maxSizeMB', e.target.value ? parseInt(e.target.value) : undefined)
              }
              min="10"
              max="10000"
            />
            <span className="text-slate-400">MB</span>
          </div>
        </div>

        {/* Retention Period */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Keep Memory For' : 'Retention Period'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How many days to keep old memories before automatic deletion
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Days to retain session data before expiration (default: 90)
              </div>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={memory.retentionDays !== undefined ? memory.retentionDays : 90}
              onChange={(e) =>
                onUpdate('memory.retentionDays', e.target.value ? parseInt(e.target.value) : undefined)
              }
              min="1"
              max="365"
            />
            <span className="text-slate-400">days</span>
          </div>
        </div>

        {/* Cleanup Period */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Cleanup Check Interval' : 'Cleanup Period (Days)'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How often Claude Code checks and removes old memories
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Days before old session data is automatically cleaned up (default: 30)
              </div>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={memory.cleanupPeriodDays !== undefined ? memory.cleanupPeriodDays : 30}
              onChange={(e) =>
                onUpdate('memory.cleanupPeriodDays', e.target.value ? parseInt(e.target.value) : undefined)
              }
              min="1"
              max="365"
            />
            <span className="text-slate-400">days</span>
          </div>
        </div>

        {/* Auto-Consolidate Toggle */}
        <div className="glass-card p-6">
          <label className="block mb-3">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Auto-Compress Memories' : 'Auto-Consolidate'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Automatically combine and compress old memories to save space
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Enable automatic consolidation of memory entries (reduces fragmentation)
              </div>
            )}
          </label>
          <button
            onClick={() => onUpdate('memory.autoConsolidate', !memory.autoConsolidate)}
            className={`toggle-switch ${memory.autoConsolidate ? 'active' : ''}`}
          />
        </div>

        {/* Consolidation Interval */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Compression Schedule' : 'Consolidation Interval'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How often to automatically compress memories
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Frequency of automatic memory consolidation (default: 24 hours)
              </div>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={memory.consolidationInterval !== undefined ? memory.consolidationInterval : 24}
              onChange={(e) =>
                onUpdate(
                  'memory.consolidationInterval',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              min="1"
              max="168"
            />
            <span className="text-slate-400">hours</span>
          </div>
        </div>

        {/* HNSW Indexing Section */}
        <div className="glass-card p-6">
          <button
            onClick={() => setHnswExpanded(!hnswExpanded)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Smart Memory Search' : 'HNSW Indexing'}
            </div>
            <div className="text-slate-400 text-lg">{hnswExpanded ? '−' : '+'}</div>
          </button>
          {mode === 'eli5' && (
            <div className="text-xs text-slate-400 mt-1 mb-4">
              Enable fast similarity search to quickly find related past conversations
            </div>
          )}
          {mode === 'complex' && (
            <div className="text-xs text-slate-500 mt-1 mb-4">
              Hierarchical Navigable Small World indexing for semantic memory retrieval
            </div>
          )}

          {hnswExpanded && (
            <div className="space-y-4 mt-4 border-t border-slate-700 pt-4">
              {/* HNSW Enable Toggle */}
              <div>
                <label className="block mb-3">
                  <div className="text-slate-200 font-medium">
                    {mode === 'eli5' ? 'Enable Smart Search' : 'Enable HNSW'}
                  </div>
                  {mode === 'eli5' && (
                    <div className="text-xs text-slate-400 mt-1">
                      Turn on similarity-based memory search
                    </div>
                  )}
                  {mode === 'complex' && (
                    <div className="text-xs text-slate-500 mt-1">
                      Enable HNSW vector indexing for semantic search
                    </div>
                  )}
                </label>
                <button
                  onClick={() => onUpdate('memory.hnswEnabled', !memory.hnswEnabled)}
                  className={`toggle-switch ${memory.hnswEnabled ? 'active' : ''}`}
                />
              </div>

              {memory.hnswEnabled && (
                <>
                  {/* Dimensions */}
                  <div>
                    <label className="block mb-2">
                      <div className="text-slate-200 font-medium">
                        {mode === 'eli5' ? 'Search Detail Level' : 'Vector Dimensions'}
                      </div>
                      {mode === 'eli5' && (
                        <div className="text-xs text-slate-400 mt-1">
                          Higher = more detailed matching, but slower (default: 384)
                        </div>
                      )}
                      {mode === 'complex' && (
                        <div className="text-xs text-slate-500 mt-1">
                          Embedding vector dimensionality (default: 384)
                        </div>
                      )}
                    </label>
                    <input
                      type="number"
                      value={memory.hnswDimensions !== undefined ? memory.hnswDimensions : 384}
                      onChange={(e) =>
                        onUpdate(
                          'memory.hnswDimensions',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      min="64"
                      max="2048"
                    />
                  </div>

                  {/* M Parameter */}
                  <div>
                    <label className="block mb-2">
                      <div className="text-slate-200 font-medium">
                        {mode === 'eli5' ? 'Connection Density' : 'M Parameter'}
                      </div>
                      {mode === 'eli5' && (
                        <div className="text-xs text-slate-400 mt-1">
                          Number of connections per memory node (default: 16)
                        </div>
                      )}
                      {mode === 'complex' && (
                        <div className="text-xs text-slate-500 mt-1">
                          Maximum connections per node in graph (default: 16)
                        </div>
                      )}
                    </label>
                    <input
                      type="number"
                      value={memory.hnswM !== undefined ? memory.hnswM : 16}
                      onChange={(e) =>
                        onUpdate('memory.hnswM', e.target.value ? parseInt(e.target.value) : undefined)
                      }
                      min="4"
                      max="64"
                    />
                  </div>

                  {/* EF Construction */}
                  <div>
                    <label className="block mb-2">
                      <div className="text-slate-200 font-medium">
                        {mode === 'eli5' ? 'Build Quality' : 'EF Construction'}
                      </div>
                      {mode === 'eli5' && (
                        <div className="text-xs text-slate-400 mt-1">
                          Quality of initial index building (higher = better but slower)
                        </div>
                      )}
                      {mode === 'complex' && (
                        <div className="text-xs text-slate-500 mt-1">
                          Construction parameter for graph building (default: 200)
                        </div>
                      )}
                    </label>
                    <input
                      type="number"
                      value={
                        memory.hnswEfConstruction !== undefined ? memory.hnswEfConstruction : 200
                      }
                      onChange={(e) =>
                        onUpdate(
                          'memory.hnswEfConstruction',
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      min="50"
                      max="500"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* About Memory Management */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-3">About Memory Management</h3>
          {mode === 'eli5' ? (
            <div className="text-sm text-slate-300 space-y-2">
              <p>Claude Code automatically manages conversation history and memory:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Saves conversation context to memory files for later reference</li>
                <li>Automatically cleans up old sessions after the specified number of days</li>
                <li>Compresses large conversations to keep them manageable</li>
                <li>Retains important information while discarding obsolete details</li>
                <li>Uses smart search to quickly find related past conversations</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Claude Code maintains session memory with configurable storage backends and implements automatic compaction and indexing strategies.
              </p>
              <div className="bg-slate-800/50 p-3 rounded text-sm space-y-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Storage Backends:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>SQLite - Indexed queries with transaction safety</li>
                    <li>JSON - Human-readable format with easy backup</li>
                    <li>Hybrid - Dual storage with automatic synchronization</li>
                    <li>Memory - In-process store for development/testing</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">HNSW Parameters:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Dimensions - Embedding vector size (64-2048)</li>
                    <li>M - Graph connectivity degree (4-64)</li>
                    <li>EF Construction - Index build quality (50-500)</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Configure additional environment variables via the Environment Variables section.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
