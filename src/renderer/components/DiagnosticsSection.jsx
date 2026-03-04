import React from 'react';

export default function DiagnosticsSection({ settings, mode, onUpdate }) {
  const diagnostics = settings.diagnostics || {};
  const env = settings.env || {};

  // Check provider connectivity
  const providers = [
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: '🤖',
      connected: !!env.ANTHROPIC_API_KEY
    },
    {
      id: 'openai',
      name: 'OpenAI',
      icon: '🔮',
      connected: !!env.OPENAI_API_KEY
    },
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      connected: !!env.GOOGLE_AI_API_KEY
    },
    {
      id: 'ollama',
      name: 'Ollama',
      icon: '🦙',
      connected: !!env.OLLAMA_HOST
    }
  ];

  const mcpServers = settings.mcpServers || {};
  const hasMcpEnabled = Object.values(mcpServers).some(
    (s) => s && (s.command || s.type || s.enabled === true)
  );

  const healthChecks = [
    {
      name: 'API Key Validation',
      icon: '🔑',
      ok: providers.some((p) => p.connected),
      statusOk: mode === 'eli5' ? 'Key found' : 'Configured',
      statusFail: mode === 'eli5' ? 'No key set' : 'No keys found'
    },
    {
      name: 'MCP Server Connectivity',
      icon: '🔗',
      ok: hasMcpEnabled,
      statusOk: mode === 'eli5' ? 'Connected' : 'Servers active',
      statusFail: mode === 'eli5' ? 'None active' : 'No servers configured'
    },
    {
      name: 'Memory Backend Status',
      icon: '💾',
      ok: !!(settings.memory?.vectorSearch || settings.memory?.backend),
      statusOk: mode === 'eli5' ? 'Ready' : 'Configured',
      statusFail: mode === 'eli5' ? 'Not set up' : 'Default only'
    },
    {
      name: 'Swarm Coordination Status',
      icon: '🐝',
      ok: !!(settings.swarm?.enabled || settings.claudeFlow?.agentTeams?.enabled),
      statusOk: mode === 'eli5' ? 'Active' : 'Enabled',
      statusFail: mode === 'eli5' ? 'Inactive' : 'Disabled'
    }
  ];

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Diagnostics</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Check if everything is working correctly and fix common problems.'
            : 'System diagnostics dashboard for provider connectivity, MCP health, and troubleshooting.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {/* System Status Panel */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-4">
            {mode === 'eli5' ? 'Provider Connections' : 'System Status'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {providers.map((provider) => (
              <div key={provider.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{provider.icon}</div>
                  <div
                    className={`w-2 h-2 rounded-full ${provider.connected ? 'bg-green-500' : 'bg-slate-500'}`}
                  ></div>
                </div>
                <div className="text-sm font-medium text-slate-200 mb-1">{provider.name}</div>
                <div className="text-xs text-slate-400">
                  {provider.connected ? 'Connected' : 'Not Configured'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Checks Panel */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-4">
            {mode === 'eli5' ? 'System Checks' : 'Health Checks'}
          </h3>
          <div className="space-y-3">
            {healthChecks.map((check, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                <div className="text-lg">{check.icon}</div>
                <span className="text-sm text-slate-300">{check.name}</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${check.ok ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                  <span className={`text-xs ${check.ok ? 'text-green-400' : 'text-slate-500'}`}>
                    {check.ok ? check.statusOk : check.statusFail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verbose Logging Toggle */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`toggle-switch ${diagnostics.verboseLogging ? 'active' : ''}`}
              onClick={() => onUpdate('diagnostics.verboseLogging', !diagnostics.verboseLogging)}
            />
            <div>
              <div className="text-slate-200 font-medium">
                {mode === 'eli5' ? 'Detailed Logging' : 'Verbose Logging'}
              </div>
              {mode === 'eli5' && (
                <div className="text-xs text-slate-400 mt-1">
                  Show detailed information about what the system is doing
                </div>
              )}
              {mode === 'complex' && (
                <div className="text-xs text-slate-500 mt-1">
                  Enable verbose logging for detailed diagnostic output and troubleshooting
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Health Check Interval */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Check Frequency' : 'Health Check Interval'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How often to check if everything is working properly
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Time interval (seconds) between automatic health checks (10-600)
              </div>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={diagnostics.healthCheckInterval !== undefined ? diagnostics.healthCheckInterval : 60}
              onChange={(e) =>
                onUpdate(
                  'diagnostics.healthCheckInterval',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              min="10"
              max="600"
              className="w-24 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <span className="text-slate-400">seconds</span>
          </div>
        </div>

        {/* Version Info Panel */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-4">
            {mode === 'eli5' ? 'About This System' : 'Version Information'}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-400">
                {mode === 'eli5' ? 'GUI Version' : 'RUFLO-GUI Version'}
              </span>
              <span className="text-sm font-medium text-slate-200">1.0.0</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-400">Platform</span>
              <span className="text-sm font-medium text-slate-200">Electron</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30">
              <span className="text-sm text-slate-400">Mode</span>
              <span className="text-sm font-medium text-slate-200">
                {mode === 'eli5' ? 'Beginner Friendly' : 'Advanced'}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-3">About Diagnostics</h3>
          {mode === 'eli5' ? (
            <div className="text-sm text-slate-300 space-y-2">
              <p>Diagnostics helps you monitor and troubleshoot your Claude Code setup:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Shows which API providers are configured and ready to use</li>
                <li>Runs automatic checks to make sure all systems are working</li>
                <li>Enables detailed logging when you need to understand what's happening</li>
                <li>Displays version information for your system components</li>
                <li>Helps identify and fix problems before they cause issues</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Comprehensive diagnostics dashboard providing system health visibility, provider connectivity status, and troubleshooting utilities.
              </p>
              <div className="bg-slate-800/50 p-3 rounded text-sm space-y-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Monitored Systems:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Provider API connectivity (Anthropic, OpenAI, Google, Ollama)</li>
                    <li>MCP server endpoint availability and responsiveness</li>
                    <li>Memory backend persistence layer health</li>
                    <li>Swarm agent coordination and message passing</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Configuration:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Health check interval (10-600 seconds, default 60)</li>
                    <li>Verbose logging for debug output and trace analysis</li>
                    <li>Automatic failure detection and alerting</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Check logs in ~/.claude/diagnostics.log for detailed system events and error traces.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
