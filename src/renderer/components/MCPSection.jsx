import React, { useState, useMemo } from 'react';
import { MCP_SERVERS, MCP_CATEGORIES } from '../lib/mcpServers';

export default function MCPSection({ settings, mode, onUpdate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedServer, setExpandedServer] = useState(null);

  const categories = ['All', ...MCP_CATEGORIES];

  const enabledServers = settings.mcpServers || {};

  const filteredServers = useMemo(() => {
    return MCP_SERVERS.filter((server) => {
      const matchesSearch =
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || server.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleServer = (serverId) => {
    const config = enabledServers[serverId];
    const isCurrentlyEnabled = config && (config.command || config.type);
    if (isCurrentlyEnabled) {
      // Disable: remove the server config entirely
      onUpdate(`mcpServers.${serverId}`, undefined);
    } else {
      // Enable: write full MCP config (command + args) that Claude Code actually reads
      const server = MCP_SERVERS.find(s => s.id === serverId);
      if (server) {
        onUpdate(`mcpServers.${serverId}`, { command: server.command, args: server.args });
      }
    }
  };

  const updateServerConfig = (serverId, field, value) => {
    onUpdate(`mcpServers.${serverId}.${field}`, value);
  };

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">MCP Servers</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Connect external tools and services to your AI agent.'
            : 'Configure Model Context Protocol servers for extending agent capabilities with external tool integration.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="mb-6 glass-card p-4 flex items-center gap-3">
        <span className="text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search MCP servers..."
          className="w-full"
        />
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-accent text-white'
                : 'bg-slate-700/30 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredServers.map((server) => {
          const config = enabledServers[server.id] || {};
          const isEnabled = !!(config.command || config.type);
          const isExpanded = expandedServer === server.id;

          return (
            <div key={server.id} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => setExpandedServer(isExpanded ? null : server.id)}
                >
                  <span className="text-2xl">{server.icon}</span>
                  <div>
                    <h3 className="text-slate-100 font-semibold">{server.name}</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      {mode === 'eli5' ? server.eli5 : server.complex}
                    </p>
                  </div>
                </div>
                <div
                  className={`toggle-switch ${isEnabled ? 'active' : ''}`}
                  onClick={() => toggleServer(server.id)}
                />
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Command</label>
                    <input
                      type="text"
                      value={config.command || server.command}
                      onChange={(e) => updateServerConfig(server.id, 'command', e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Arguments</label>
                    <input
                      type="text"
                      value={(config.args || server.args || []).join(' ')}
                      onChange={(e) => updateServerConfig(server.id, 'args', e.target.value.split(' '))}
                      className="w-full text-sm"
                    />
                  </div>
                  {Object.keys(server.env).length > 0 && (
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Environment Variables</label>
                      {Object.entries(server.env).map(([key, defaultVal]) => (
                        <div key={key} className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-accent-med font-mono w-48 flex-shrink-0">{key}</span>
                          <input
                            type="text"
                            value={(config.env && config.env[key]) || defaultVal}
                            onChange={(e) => updateServerConfig(server.id, `env.${key}`, e.target.value)}
                            placeholder="Enter value..."
                            className="flex-1 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Category: <span className="text-accent-med">{server.category}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
