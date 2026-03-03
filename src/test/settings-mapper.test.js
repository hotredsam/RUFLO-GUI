import { describe, it, expect } from 'vitest';
import { getSettingSideEffects, getAddonRealSettings, MCP_CONFIGS } from '../renderer/lib/settings-mapper';

describe('MCP_CONFIGS', () => {
  it('sqlite config has command and args for @modelcontextprotocol/server-sqlite', () => {
    expect(MCP_CONFIGS.sqlite).toEqual({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite'],
    });
  });

  it('memory config has command and args for @modelcontextprotocol/server-memory', () => {
    expect(MCP_CONFIGS.memory).toEqual({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory'],
    });
  });

  it('github config has HTTP type with url and headers', () => {
    expect(MCP_CONFIGS.github).toEqual({
      type: 'http',
      url: 'https://api.githubcopilot.com/mcp/',
      headers: {
        Authorization: 'Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}',
      },
    });
  });
});

describe('getSettingSideEffects', () => {
  const baseSettings = {
    env: {},
    mcpServers: {},
    swarm: { enabled: false },
    memory: { backend: 'json', autoConsolidate: false, hnswEnabled: false },
  };

  // --- swarm.enabled ---
  it('swarm.enabled = true sets CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS env var', () => {
    const effects = getSettingSideEffects('swarm.enabled', true, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', value: '1' },
    ]);
  });

  it('swarm.enabled = false deletes CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS env var', () => {
    const effects = getSettingSideEffects('swarm.enabled', false, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', value: undefined },
    ]);
  });

  // --- memory.autoConsolidate ---
  it('memory.autoConsolidate = true sets CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', () => {
    const effects = getSettingSideEffects('memory.autoConsolidate', true, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '50' },
    ]);
  });

  it('memory.autoConsolidate = false deletes CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', () => {
    const effects = getSettingSideEffects('memory.autoConsolidate', false, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: undefined },
    ]);
  });

  // --- memory.backend ---
  it('memory.backend = sqlite installs full sqlite MCP server config', () => {
    const effects = getSettingSideEffects('memory.backend', 'sqlite', baseSettings);
    expect(effects).toEqual([
      { path: 'mcpServers.sqlite', value: MCP_CONFIGS.sqlite },
    ]);
    // Verify it's a real stdio config, not just { enabled: true }
    expect(effects[0].value).toHaveProperty('command', 'npx');
    expect(effects[0].value).toHaveProperty('args');
    expect(effects[0].value.args).toContain('@modelcontextprotocol/server-sqlite');
  });

  it('memory.backend = memory installs full memory MCP server config', () => {
    const effects = getSettingSideEffects('memory.backend', 'memory', baseSettings);
    expect(effects).toEqual([
      { path: 'mcpServers.memory', value: MCP_CONFIGS.memory },
    ]);
    expect(effects[0].value).toHaveProperty('command', 'npx');
    expect(effects[0].value.args).toContain('@modelcontextprotocol/server-memory');
  });

  it('memory.backend = json deletes sqlite and memory MCP servers', () => {
    const effects = getSettingSideEffects('memory.backend', 'json', baseSettings);
    expect(effects).toEqual([
      { path: 'mcpServers.sqlite', value: undefined },
      { path: 'mcpServers.memory', value: undefined },
    ]);
  });

  // --- swarm.topology ---
  it('swarm.topology = mesh sets CLAUDE_FLOW_SWARM_TOPOLOGY', () => {
    const effects = getSettingSideEffects('swarm.topology', 'mesh', baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_FLOW_SWARM_TOPOLOGY', value: 'mesh' },
    ]);
  });

  it('swarm.topology = hierarchical deletes CLAUDE_FLOW_SWARM_TOPOLOGY', () => {
    const effects = getSettingSideEffects('swarm.topology', 'hierarchical', baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_FLOW_SWARM_TOPOLOGY', value: undefined },
    ]);
  });

  // --- swarm.maxAgents ---
  it('swarm.maxAgents = 50 sets CLAUDE_FLOW_MAX_AGENTS', () => {
    const effects = getSettingSideEffects('swarm.maxAgents', 50, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_FLOW_MAX_AGENTS', value: '50' },
    ]);
  });

  it('swarm.maxAgents = 20 deletes CLAUDE_FLOW_MAX_AGENTS (default)', () => {
    const effects = getSettingSideEffects('swarm.maxAgents', 20, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_FLOW_MAX_AGENTS', value: undefined },
    ]);
  });

  // --- memory.path ---
  it('memory.path = /custom/path sets CLAUDE_FLOW_MEMORY_PATH', () => {
    const effects = getSettingSideEffects('memory.path', '/custom/path', baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_FLOW_MEMORY_PATH', value: '/custom/path' },
    ]);
  });

  it('memory.path = empty deletes CLAUDE_FLOW_MEMORY_PATH', () => {
    const effects = getSettingSideEffects('memory.path', '', baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_FLOW_MEMORY_PATH', value: undefined },
    ]);
  });

  // --- contextAutopilot.enabled ---
  it('contextAutopilot.enabled = true deletes DISABLE_AUTO_COMPACT', () => {
    const effects = getSettingSideEffects('contextAutopilot.enabled', true, baseSettings);
    expect(effects).toEqual([
      { path: 'env.DISABLE_AUTO_COMPACT', value: undefined },
    ]);
  });

  // --- contextAutopilot.compactThreshold ---
  it('contextAutopilot.compactThreshold = 75 sets CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', () => {
    const effects = getSettingSideEffects('contextAutopilot.compactThreshold', 75, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '75' },
    ]);
  });

  // --- security.auditLogging ---
  it('security.auditLogging = true sets default CLAUDE_AUDIT_LOG_PATH when no path exists', () => {
    const effects = getSettingSideEffects('security.auditLogging', true, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_AUDIT_LOG_PATH', value: '~/.claude/audit.log' },
    ]);
  });

  it('security.auditLogging = true does not set path if auditLogPath already exists', () => {
    const settingsWithPath = {
      ...baseSettings,
      security: { auditLogging: true, auditLogPath: '/custom/audit.log' },
    };
    const effects = getSettingSideEffects('security.auditLogging', true, settingsWithPath);
    expect(effects).toEqual([]);
  });

  it('security.auditLogging = false deletes CLAUDE_AUDIT_LOG_PATH', () => {
    const effects = getSettingSideEffects('security.auditLogging', false, baseSettings);
    expect(effects).toEqual([
      { path: 'env.CLAUDE_AUDIT_LOG_PATH', value: undefined },
    ]);
  });

  // --- modelTiers.primary.provider ---
  it('modelTiers.primary.provider = ollama sets default OLLAMA_HOST when not configured', () => {
    const effects = getSettingSideEffects('modelTiers.primary.provider', 'ollama', baseSettings);
    expect(effects).toEqual([
      { path: 'env.OLLAMA_HOST', value: 'http://localhost:11434' },
    ]);
  });

  it('modelTiers.primary.provider = ollama does not set host if OLLAMA_HOST already exists', () => {
    const settingsWithHost = {
      ...baseSettings,
      env: { OLLAMA_HOST: 'http://custom:11434' },
    };
    const effects = getSettingSideEffects('modelTiers.primary.provider', 'ollama', settingsWithHost);
    expect(effects).toEqual([]);
  });

  it('modelTiers.primary.provider = anthropic produces no side effects', () => {
    const effects = getSettingSideEffects('modelTiers.primary.provider', 'anthropic', baseSettings);
    expect(effects).toEqual([]);
  });

  // --- memory.hnswEnabled ---
  it('memory.hnswEnabled = true installs full memory MCP server config', () => {
    const effects = getSettingSideEffects('memory.hnswEnabled', true, baseSettings);
    expect(effects).toEqual([
      { path: 'mcpServers.memory', value: MCP_CONFIGS.memory },
    ]);
    expect(effects[0].value).toHaveProperty('command', 'npx');
  });

  it('memory.hnswEnabled = false produces no side effects', () => {
    const effects = getSettingSideEffects('memory.hnswEnabled', false, baseSettings);
    expect(effects).toEqual([]);
  });

  // --- unrelated paths ---
  it('unrelated setting path produces no side effects', () => {
    expect(getSettingSideEffects('model', 'claude-opus-4-6', baseSettings)).toEqual([]);
    expect(getSettingSideEffects('permissions.allow', ['Bash'], baseSettings)).toEqual([]);
    expect(getSettingSideEffects('env.FOO', 'bar', baseSettings)).toEqual([]);
  });

  // --- MCP configs are never just { enabled: true } ---
  it('no side effect ever produces a bare { enabled: true } config', () => {
    const testCases = [
      ['memory.backend', 'sqlite'],
      ['memory.backend', 'memory'],
      ['memory.hnswEnabled', true],
    ];
    testCases.forEach(([path, value]) => {
      const effects = getSettingSideEffects(path, value, baseSettings);
      effects.forEach((effect) => {
        if (effect.path.startsWith('mcpServers.')) {
          expect(effect.value).not.toEqual({ enabled: true });
          expect(effect.value).toHaveProperty('command');
        }
      });
    });
  });
});

describe('getAddonRealSettings', () => {
  it('agentdb-persistence installs full sqlite MCP server', () => {
    const settings = getAddonRealSettings('agentdb-persistence');
    expect(settings).toEqual([
      { path: 'mcpServers.sqlite', value: MCP_CONFIGS.sqlite },
    ]);
    expect(settings[0].value.command).toBe('npx');
    expect(settings[0].value.args).toContain('@modelcontextprotocol/server-sqlite');
  });

  it('github-integration installs full github MCP server (HTTP type)', () => {
    const settings = getAddonRealSettings('github-integration');
    expect(settings).toEqual([
      { path: 'mcpServers.github', value: MCP_CONFIGS.github },
    ]);
    expect(settings[0].value.type).toBe('http');
    expect(settings[0].value.url).toBe('https://api.githubcopilot.com/mcp/');
    expect(settings[0].value.headers).toHaveProperty('Authorization');
  });

  it('token-optimizer sets CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', () => {
    expect(getAddonRealSettings('token-optimizer')).toEqual([
      { path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '50' },
    ]);
  });

  it('memory-consolidation installs full memory MCP server', () => {
    const settings = getAddonRealSettings('memory-consolidation');
    expect(settings).toEqual([
      { path: 'mcpServers.memory', value: MCP_CONFIGS.memory },
    ]);
    expect(settings[0].value.command).toBe('npx');
    expect(settings[0].value.args).toContain('@modelcontextprotocol/server-memory');
  });

  it('hnsw-vector-search installs full memory MCP server', () => {
    const settings = getAddonRealSettings('hnsw-vector-search');
    expect(settings).toEqual([
      { path: 'mcpServers.memory', value: MCP_CONFIGS.memory },
    ]);
  });

  it('ruvector-intelligence sets MAX_THINKING_TOKENS', () => {
    expect(getAddonRealSettings('ruvector-intelligence')).toEqual([
      { path: 'env.MAX_THINKING_TOKENS', value: '10000' },
    ]);
  });

  // security-suite-aidefence no longer maps to a fake env var
  it('security-suite-aidefence returns empty array (no real Claude Code equivalent)', () => {
    expect(getAddonRealSettings('security-suite-aidefence')).toEqual([]);
  });

  // Addons with no real-settings equivalent
  it('claude-provider returns empty array', () => {
    expect(getAddonRealSettings('claude-provider')).toEqual([]);
  });

  it('gpt-provider returns empty array', () => {
    expect(getAddonRealSettings('gpt-provider')).toEqual([]);
  });

  it('gemini-provider returns empty array', () => {
    expect(getAddonRealSettings('gemini-provider')).toEqual([]);
  });

  it('ollama-provider returns empty array', () => {
    expect(getAddonRealSettings('ollama-provider')).toEqual([]);
  });

  it('agent-booster-wasm returns empty array', () => {
    expect(getAddonRealSettings('agent-booster-wasm')).toEqual([]);
  });

  it('reinforcement-learning returns empty array', () => {
    expect(getAddonRealSettings('reinforcement-learning')).toEqual([]);
  });

  it('background-workers returns empty array', () => {
    expect(getAddonRealSettings('background-workers')).toEqual([]);
  });

  it('unknown addon returns empty array', () => {
    expect(getAddonRealSettings('nonexistent-addon')).toEqual([]);
  });

  // Ensure NO addon ever maps to { enabled: true }
  it('no addon ever maps to a bare { enabled: true } MCP config', () => {
    const addonIds = [
      'agentdb-persistence', 'github-integration', 'token-optimizer',
      'memory-consolidation', 'hnsw-vector-search', 'ruvector-intelligence',
    ];
    addonIds.forEach((id) => {
      const settings = getAddonRealSettings(id);
      settings.forEach((s) => {
        if (s.path.startsWith('mcpServers.')) {
          expect(s.value).not.toEqual({ enabled: true });
          // Must have either command (stdio) or type (http)
          const hasCommand = 'command' in s.value;
          const hasType = 'type' in s.value;
          expect(hasCommand || hasType).toBe(true);
        }
      });
    });
  });
});
