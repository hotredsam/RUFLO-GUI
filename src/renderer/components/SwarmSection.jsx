import React from 'react';

const TOPOLOGIES = ['star', 'mesh', 'hierarchical'];
const COORDINATION_MODES = ['sequential', 'parallel', 'adaptive'];

export default function SwarmSection({ settings, mode, onUpdate }) {
  const swarm = settings.swarm || {};

  const topologyEmoji = {
    star: '⭐',
    mesh: '🕸️',
    hierarchical: '🏔️',
  };

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Swarm & Agents</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Set up teams of AI agents to work together on big tasks.'
            : 'Configure multi-agent swarm topology, coordination modes, and team orchestration.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">
              {mode === 'eli5' ? 'Enable Team Mode' : 'Enable Swarm'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-4">
                Allow multiple AI agents to work together on tasks
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${swarm.enabled ? 'active' : ''}`}
            onClick={() => onUpdate('swarm.enabled', !swarm.enabled)}
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Team Structure' : 'Topology'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How agents communicate with each other
              </div>
            )}
          </label>
          <select
            value={swarm.topology || 'star'}
            onChange={(e) => onUpdate('swarm.topology', e.target.value)}
            className="mb-4"
          >
            {TOPOLOGIES.map((topo) => (
              <option key={topo} value={topo}>
                {topologyEmoji[topo]} {topo.charAt(0).toUpperCase() + topo.slice(1)}
              </option>
            ))}
          </select>
          {mode === 'complex' && (
            <div className="text-xs text-slate-600 font-mono">
              Current: {swarm.topology || 'star'} {topologyEmoji[swarm.topology || 'star']}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <label className="block mb-4">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Maximum Team Size' : 'Max Agents'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Maximum number of agents that can work together (1-20)
              </div>
            )}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="20"
              value={swarm.maxAgents || 5}
              onChange={(e) => onUpdate('swarm.maxAgents', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-slate-300 font-mono text-sm">{swarm.maxAgents || 5}</span>
          </div>
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">Team Name</div>
          </label>
          <input
            type="text"
            value={swarm.teamName || ''}
            onChange={(e) => onUpdate('swarm.teamName', e.target.value)}
            placeholder="e.g., Engineering Team"
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'How Agents Work Together' : 'Coordination Mode'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Sequential: Take turns, Parallel: Work at same time, Adaptive: Automatically choose best approach
              </div>
            )}
          </label>
          <select
            value={swarm.coordinationMode || 'sequential'}
            onChange={(e) => onUpdate('swarm.coordinationMode', e.target.value)}
          >
            {COORDINATION_MODES.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
