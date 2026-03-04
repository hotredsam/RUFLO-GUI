import React from 'react';
import { TOPOLOGIES, AGENT_TYPES, COORDINATION_STRATEGIES, MESSAGE_PROTOCOLS } from '../lib/swarmConfig';

export default function SwarmSection({ settings, mode, onUpdate }) {
  const swarm = settings.swarm || {};
  const activeAgentTypes = swarm.agentTypes || [];

  const handleAgentTypeToggle = (agentId) => {
    const updated = activeAgentTypes.includes(agentId)
      ? activeAgentTypes.filter(id => id !== agentId)
      : [...activeAgentTypes, agentId];
    onUpdate('swarm.agentTypes', updated);
  };

  return (
    <div className="p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Agent Teams</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Let your AI spawn helper agents to work in parallel on tasks.'
            : 'Control experimental multi-agent team coordination via CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {/* Enable Agent Teams Toggle */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Enable Agent Teams</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-4">
                Allow Claude Code to spawn multiple AI agents that work together on tasks in parallel
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-4">
                Sets CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS environment variable to enable experimental multi-agent coordination
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${swarm.enabled ? 'active' : ''}`}
            onClick={() => onUpdate('swarm.enabled', !swarm.enabled)}
          />
        </div>

        {/* Topology Selector */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="text-slate-200 font-medium">Agent Network Topology</label>
            {mode === 'eli5' && (
              <p className="text-xs text-slate-400 mt-1">
                Choose how your agents talk to each other and coordinate work
              </p>
            )}
            {mode === 'complex' && (
              <p className="text-xs text-slate-500 mt-1">
                Network topology defines communication patterns and agent coordination structure
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(TOPOLOGIES).map(([topologyId, topology]) => (
              <div
                key={topologyId}
                onClick={() => onUpdate('swarm.topology', topologyId)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  swarm.topology === topologyId
                    ? 'ring-2 ring-accent bg-accent/10 border-accent'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
                }`}
              >
                <div className="text-2xl mb-2">{topology.icon}</div>
                <div className="text-slate-100 font-medium text-sm mb-2">{topology.name}</div>
                <p className="text-xs text-slate-400">
                  {mode === 'eli5' ? topology.eli5 : topology.complex}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Name Input */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Team Name</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-3">
                Give your agent team a memorable name
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-3">
                Identifier for the agent team used in coordination, logging, and inter-agent communication
              </div>
            )}
          </label>
          <input
            type="text"
            value={swarm.teamName || ''}
            onChange={(e) => onUpdate('swarm.teamName', e.target.value)}
            placeholder="e.g., DevOps Team, Research Squad"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Max Agents Slider */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Maximum Concurrent Agents</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-3">
                How many AI helpers can work at the same time (1-50)
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-3">
                Maximum concurrent agent instances in a swarm session. Higher values increase parallelism but consume more resources
              </div>
            )}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="50"
              value={swarm.maxAgents || 20}
              onChange={(e) => onUpdate('swarm.maxAgents', parseInt(e.target.value, 10))}
              className="flex-1"
            />
            <div className="text-slate-100 font-medium min-w-12 text-right">
              {swarm.maxAgents || 20}
            </div>
          </div>
        </div>

        {/* Coordination Strategy Dropdown */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Coordination Strategy</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-3">
                How agents decide who does what
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-3">
                Task distribution strategy affecting coordination overhead and fault tolerance
              </div>
            )}
          </label>
          <select
            value={swarm.coordinationStrategy || 'centralized'}
            onChange={(e) => onUpdate('swarm.coordinationStrategy', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-accent"
          >
            {Object.entries(COORDINATION_STRATEGIES).map(([strategyId, strategy]) => (
              <option key={strategyId} value={strategyId}>
                {strategy.name} - {mode === 'eli5' ? strategy.eli5 : strategy.complex}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Type Selection */}
        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="text-slate-200 font-medium">Agent Types to Enable</label>
            {mode === 'eli5' && (
              <p className="text-xs text-slate-400 mt-1">
                Choose which specialists you want in your team
              </p>
            )}
            {mode === 'complex' && (
              <p className="text-xs text-slate-500 mt-1">
                Select agent types to include in the swarm. Each type brings specialized capabilities
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {AGENT_TYPES.map((agent) => (
              <label key={agent.id} className="flex items-start p-3 bg-slate-800/30 border border-slate-600 rounded cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={activeAgentTypes.includes(agent.id)}
                  onChange={() => handleAgentTypeToggle(agent.id)}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{agent.icon}</span>
                    <div className="text-slate-100 font-medium">{agent.name}</div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {mode === 'eli5' ? agent.eli5 : agent.complex}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message Protocol Dropdown */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Message Protocol</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-3">
                How agents send messages to each other
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-3">
                Inter-agent messaging protocol affecting communication overhead and consistency guarantees
              </div>
            )}
          </label>
          <select
            value={swarm.messageProtocol || 'direct'}
            onChange={(e) => onUpdate('swarm.messageProtocol', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-accent"
          >
            {Object.entries(MESSAGE_PROTOCOLS).map(([protocolId, protocol]) => (
              <option key={protocolId} value={protocolId}>
                {protocol.name} - {mode === 'eli5' ? protocol.eli5 : protocol.complex}
              </option>
            ))}
          </select>
        </div>

        {/* Auto-Scale Toggle */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Auto-Scale Agents</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-4">
                Automatically add or remove AI helpers based on how busy they are
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-4">
                Enable automatic agent scaling based on task queue depth and resource utilization metrics
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${swarm.autoScale ? 'active' : ''}`}
            onClick={() => onUpdate('swarm.autoScale', !swarm.autoScale)}
          />
        </div>

        {/* Fault Tolerance Toggle */}
        <div className="glass-card p-6">
          <label className="block">
            <div className="text-slate-200 font-medium mb-2">Fault Tolerance</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mb-4">
                Keep working even if some AI helpers crash or disconnect
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mb-4">
                Enable fault-tolerant execution with automatic agent restart and task reassignment on failures
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${swarm.faultTolerance ? 'active' : ''}`}
            onClick={() => onUpdate('swarm.faultTolerance', !swarm.faultTolerance)}
          />
        </div>

        {/* About Agent Teams Section */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-3">About Agent Teams</h3>
          {mode === 'eli5' ? (
            <div className="text-sm text-slate-300 space-y-3">
              <p>Agent teams let Claude Code create multiple AI helpers that work together:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Agents divide complex tasks into parallel work streams</li>
                <li>Each agent specializes in different aspects of a problem</li>
                <li>They communicate and share findings with each other</li>
                <li>Results are faster and more thorough than a single agent</li>
              </ul>
              <div className="pt-2 border-t border-slate-700 mt-3">
                <p className="font-medium text-slate-300 mb-2">How to Get Started:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                  <li>Enable Agent Teams to activate the feature</li>
                  <li>Choose a network topology that matches your workflow</li>
                  <li>Select the agent types you need for your tasks</li>
                  <li>Configure coordination strategy and messaging protocol</li>
                  <li>Optionally enable auto-scaling and fault tolerance</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 font-mono mb-1">Primary Environment Variable:</div>
                <div className="text-sm font-mono text-slate-300 bg-slate-800/50 p-2 rounded">
                  CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
                </div>
              </div>
              <p className="text-sm text-slate-400">
                When enabled, Claude Code activates experimental multi-agent coordination features. This is still in development and may have limitations.
              </p>
              <div>
                <div className="text-xs text-slate-400 font-mono mb-2 mt-2">Related Environment Variables:</div>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-800/50 p-2 rounded">
                    <div className="font-mono text-slate-300">CLAUDE_FLOW_SWARM_TOPOLOGY</div>
                    <div className="text-slate-500">Override topology selection at runtime</div>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <div className="font-mono text-slate-300">CLAUDE_FLOW_MAX_AGENTS</div>
                    <div className="text-slate-500">Override maximum agent count at runtime</div>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded">
                    <div className="font-mono text-slate-300">CLAUDE_CODE_MAX_TURNS</div>
                    <div className="text-slate-500">Maximum agentic turns per session</div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-700 mt-3">
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Note:</span> Agent teams are experimental. Configuration options and behavior may change as the feature matures. Keep Claude Code updated to get the latest stability improvements and new capabilities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
