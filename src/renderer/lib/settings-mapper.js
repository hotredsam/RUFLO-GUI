// Maps decorative GUI settings to real Claude Code settings (env, mcpServers, permissions)
// These are REAL MCP server configs that Claude Code actually reads.
// Format: stdio servers need { command, args }, HTTP servers need { type, url, headers }.

// Import MCP server configurations from shared module
import { MCP_CONFIGS } from '../../shared/mcpConfigs.js';

/**
 * Given a decorative setting path and value, returns an array of real
 * Claude Code side-effect changes to apply.
 *
 * Each entry: { path: string, value: any }
 *   - value === undefined means "delete this key"
 */
export function getSettingSideEffects(path, value, _currentSettings) {
  const effects = [];

  if (path === 'swarm.enabled') {
    if (value) {
      effects.push({ path: 'env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', value: '1' });
    } else {
      effects.push({ path: 'env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS', value: undefined });
    }
  }

  if (path === 'memory.autoConsolidate') {
    if (value) {
      effects.push({ path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '50' });
    } else {
      effects.push({ path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: undefined });
    }
  }

  if (path === 'memory.backend') {
    if (value === 'sqlite') {
      effects.push({ path: 'mcpServers.sqlite', value: MCP_CONFIGS.sqlite });
    } else if (value === 'memory') {
      effects.push({ path: 'mcpServers.memory', value: MCP_CONFIGS.memory });
    } else if (value === 'hybrid') {
      effects.push({ path: 'mcpServers.sqlite', value: MCP_CONFIGS.sqlite });
      effects.push({ path: 'mcpServers.memory', value: MCP_CONFIGS.memory });
    } else if (value === 'json') {
      effects.push({ path: 'mcpServers.sqlite', value: undefined });
      effects.push({ path: 'mcpServers.memory', value: undefined });
    }
  }

  if (path === 'memory.hnswEnabled') {
    if (value) {
      effects.push({ path: 'mcpServers.memory', value: MCP_CONFIGS.memory });
    }
    // hnswEnabled = false produces no side effects
  }

  if (path === 'swarm.topology') {
    if (value && value !== 'hierarchical') {
      effects.push({ path: 'env.CLAUDE_FLOW_SWARM_TOPOLOGY', value });
    } else {
      effects.push({ path: 'env.CLAUDE_FLOW_SWARM_TOPOLOGY', value: undefined });
    }
  }

  if (path === 'swarm.maxAgents') {
    if (value !== 20) {
      effects.push({ path: 'env.CLAUDE_FLOW_MAX_AGENTS', value: String(value) });
    } else {
      effects.push({ path: 'env.CLAUDE_FLOW_MAX_AGENTS', value: undefined });
    }
  }

  if (path === 'memory.path') {
    if (value) {
      effects.push({ path: 'env.CLAUDE_FLOW_MEMORY_PATH', value });
    } else {
      effects.push({ path: 'env.CLAUDE_FLOW_MEMORY_PATH', value: undefined });
    }
  }

  if (path === 'contextAutopilot.enabled') {
    if (value) {
      effects.push({ path: 'env.DISABLE_AUTO_COMPACT', value: undefined });
    } else {
      effects.push({ path: 'env.DISABLE_AUTO_COMPACT', value: '1' });
    }
  }

  if (path === 'contextAutopilot.compactThreshold') {
    effects.push({ path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: String(value) });
  }

  if (path === 'security.auditLogging') {
    if (value) {
      if (!_currentSettings?.security?.auditLogPath) {
        effects.push({ path: 'env.CLAUDE_AUDIT_LOG_PATH', value: '~/.claude/audit.log' });
      }
    } else {
      effects.push({ path: 'env.CLAUDE_AUDIT_LOG_PATH', value: undefined });
    }
  }

  if (path === 'security.auditLogPath') {
    if (_currentSettings?.security?.auditLogging) {
      effects.push({
        path: 'env.CLAUDE_AUDIT_LOG_PATH',
        value: value || '~/.claude/audit.log',
      });
    }
  }

  if (path === 'modelTiers.primary.provider') {
    if (value === 'ollama' && !_currentSettings?.env?.OLLAMA_HOST) {
      effects.push({ path: 'env.OLLAMA_HOST', value: 'http://localhost:11434' });
    }
  }

  return effects;
}

// Addon-ID → real Claude Code settings
// Each addon maps to actual settings.json keys that Claude Code reads
const ADDON_SETTINGS_MAP = {
  'agentdb-persistence': [{ path: 'mcpServers.sqlite', value: MCP_CONFIGS.sqlite }],
  'github-integration': [{ path: 'mcpServers.github', value: MCP_CONFIGS.github }],
  'token-optimizer': [{ path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE', value: '50' }],
  'memory-consolidation': [{ path: 'mcpServers.memory', value: MCP_CONFIGS.memory }],
  'hnsw-vector-search': [{ path: 'mcpServers.memory', value: MCP_CONFIGS.memory }],
  'ruvector-intelligence': [{ path: 'env.MAX_THINKING_TOKENS', value: '10000' }],
  // security-suite-aidefence: no real Claude Code setting — omitted
};

// Export MCP_CONFIGS for tests
export { MCP_CONFIGS };

/**
 * Returns an array of real Claude Code setting changes for a given addon ID.
 * Returns [] for addons with no real-settings equivalent.
 */
export function getAddonRealSettings(addonId) {
  return ADDON_SETTINGS_MAP[addonId] || [];
}
