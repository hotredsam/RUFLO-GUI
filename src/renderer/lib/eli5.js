// ELI5 Settings Metadata - User-friendly descriptions for all Claude Code settings

const SETTINGS_META = {
  'model': {
    label: 'Default Model',
    eli5: 'Which AI model to use when you ask for help. Choose Claude, GPT, or another available model.',
    complex: 'The default LLM model identifier used for code analysis, generation, and problem-solving tasks.',
    type: 'select',
    options: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5', 'gpt-4', 'gpt-4-turbo', 'gemini-pro'],
    section: 'general',
    defaultValue: 'claude-opus-4-6'
  },
  'customApiKey': {
    label: 'Custom API Key',
    eli5: 'Your secret key to use the AI service. Keep this private and never share it.',
    complex: 'Authentication token for accessing third-party LLM APIs. Should be stored securely and never committed to version control.',
    type: 'text',
    section: 'general',
    defaultValue: ''
  },
  'maxTokens': {
    label: 'Maximum Output Tokens',
    eli5: 'The longest response the AI can give. Higher numbers mean longer responses but cost more.',
    complex: 'Maximum number of tokens the model can generate in a single response. Affects API costs and response length.',
    type: 'number',
    section: 'general',
    defaultValue: 4096
  },
  'temperature': {
    label: 'Temperature (Creativity)',
    eli5: 'How creative the AI should be. Lower (0) = focused and predictable, Higher (1) = creative and varied.',
    complex: 'Sampling temperature controlling output randomness. Range 0.0-2.0. Lower values make output more deterministic, higher values increase diversity.',
    type: 'number',
    section: 'general',
    defaultValue: 0.7
  },
  'preferredNotifChannel': {
    label: 'Notification Channel',
    eli5: 'How you want to be notified about important updates: desktop notification, console log, or both.',
    complex: 'Primary notification delivery mechanism for task completion and status updates (desktop, console, or combined).',
    type: 'select',
    options: ['desktop', 'console', 'both'],
    section: 'general',
    defaultValue: 'desktop'
  },

  'permissions.allow': {
    label: 'Allowed Tools',
    eli5: 'List of tools and operations Claude Code is allowed to use. For example: "bash", "file-write", "git-*".',
    complex: 'Whitelist of allowed tool patterns using glob syntax. Supports wildcards. If empty, denies all unless explicitly allowed elsewhere.',
    type: 'list',
    section: 'permissions',
    defaultValue: ['bash', 'file-read', 'file-write', 'git-*', 'npm-*']
  },
  'permissions.deny': {
    label: 'Denied Tools',
    eli5: 'List of tools Claude Code should never use. For example: "bash:rm", "git:push" to block dangerous commands.',
    complex: 'Blacklist of denied tool patterns using glob syntax. Takes precedence over whitelist. Prevents execution of specified operations.',
    type: 'list',
    section: 'permissions',
    defaultValue: ['bash:rm', 'bash:rmdir', 'git:push:force', 'git:reset:hard']
  },

  'env.ANTHROPIC_API_KEY': {
    label: 'Anthropic API Key',
    eli5: 'Your API key from Anthropic to use Claude models. Get it from your Anthropic console.',
    complex: 'Environment variable storing the authentication token for Anthropic Claude API access.',
    type: 'text',
    section: 'environment',
    defaultValue: ''
  },
  'env.CLAUDE_CODE_MAX_MEMORY': {
    label: 'Max Memory Usage',
    eli5: 'How much memory Claude Code can use. Set a limit to prevent your system from slowing down.',
    complex: 'Environment variable limiting maximum memory consumption in MB. Prevents resource exhaustion on memory-constrained systems.',
    type: 'number',
    section: 'environment',
    defaultValue: 2048
  },
  'env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC': {
    label: 'Disable Non-Essential Network Traffic',
    eli5: 'Turn off optional network requests to save bandwidth and improve privacy.',
    complex: 'Disables telemetry, analytics, and non-critical network communications while preserving core functionality.',
    type: 'toggle',
    section: 'environment',
    defaultValue: false
  },
  'env.CLAUDE_CODE_USE_BEDROCK': {
    label: 'Use AWS Bedrock',
    eli5: 'Route requests through Amazon Bedrock instead of calling APIs directly.',
    complex: 'Routes LLM requests through AWS Bedrock service instead of direct API endpoints. Requires AWS credentials.',
    type: 'toggle',
    section: 'environment',
    defaultValue: false
  },
  'env.CLAUDE_CODE_USE_VERTEX': {
    label: 'Use Google Vertex AI',
    eli5: 'Route requests through Google Vertex AI instead of calling APIs directly.',
    complex: 'Routes LLM requests through Google Vertex AI platform instead of direct API endpoints. Requires Google Cloud credentials.',
    type: 'toggle',
    section: 'environment',
    defaultValue: false
  },
  'env.CLAUDE_CODE_SKIP_CHROME_DOWNLOAD': {
    label: 'Skip Chrome Download',
    eli5: 'Skip downloading Chromium browser for web tasks. Use your system browser instead.',
    complex: 'Skips Chromium binary download during setup. Useful when using system Chrome or headless environments.',
    type: 'toggle',
    section: 'environment',
    defaultValue: false
  },
  'env.DISABLE_PROMPT_CACHING': {
    label: 'Disable Prompt Caching',
    eli5: 'Turn off caching of prompts to save money on API calls. Useful for testing but slower.',
    complex: 'Disables prompt caching feature that reduces API costs. Useful for debugging or when consistent fresh evaluations are needed.',
    type: 'toggle',
    section: 'environment',
    defaultValue: false
  },
  'env.DISABLE_AUTO_COMPACT': {
    label: 'Disable Auto Context Compaction',
    eli5: 'Turn off automatic message compression. Disable this if you want to keep all conversation history.',
    complex: 'Disables automatic context compaction when conversation approaches token limits. Useful for maintaining full history.',
    type: 'toggle',
    section: 'environment',
    defaultValue: false
  },

  'hooks.PreToolUse': {
    label: 'Pre-Tool Execution Hook',
    eli5: 'A shell command that runs before Claude Code uses a tool. Use for validation or logging.',
    complex: 'Custom shell command executed before any tool invocation. Can be used for pre-flight checks, logging, or security validation.',
    type: 'text',
    section: 'hooks',
    defaultValue: ''
  },
  'hooks.PostToolUse': {
    label: 'Post-Tool Execution Hook',
    eli5: 'A shell command that runs after Claude Code finishes using a tool. Use for cleanup or logging.',
    complex: 'Custom shell command executed after tool completion. Useful for cleanup, result validation, or post-processing.',
    type: 'text',
    section: 'hooks',
    defaultValue: ''
  },
  'hooks.Notification': {
    label: 'Notification Hook',
    eli5: 'A shell command that runs when Claude Code sends a notification. Use for integrations with your notification system.',
    complex: 'Custom shell command executed when notifications are triggered. Useful for forwarding to external notification systems.',
    type: 'text',
    section: 'hooks',
    defaultValue: ''
  },
  'hooks.Stop': {
    label: 'Agent Stop Hook',
    eli5: 'A shell command that runs when Claude Code stops working. Use for cleanup or final logging.',
    complex: 'Custom shell command executed when the agent stops. Useful for final cleanup, logging session end, or triggering workflows.',
    type: 'text',
    section: 'hooks',
    defaultValue: ''
  },
  'hooks.SubagentStop': {
    label: 'Subagent Stop Hook',
    eli5: 'A shell command that runs when a subagent (helper agent) stops. Use for tracking subagent lifecycle.',
    complex: 'Custom shell command executed when subagents terminate. Useful for multi-agent workflow monitoring and cleanup.',
    type: 'text',
    section: 'hooks',
    defaultValue: ''
  },

  'security.enableScanning': {
    label: 'Enable Security Scanning',
    eli5: 'Automatically check code for security issues before running it.',
    complex: 'Enables automated security scanning of code changes and tool inputs for vulnerabilities.',
    type: 'toggle',
    section: 'security',
    defaultValue: true
  },
  'security.cveChecking': {
    label: 'Check for Known Vulnerabilities',
    eli5: 'Look up packages to see if they have known security problems.',
    complex: 'Performs CVE (Common Vulnerabilities and Exposures) checking against known vulnerability databases.',
    type: 'toggle',
    section: 'security',
    defaultValue: true
  },
  'security.threatModeling': {
    label: 'Threat Modeling',
    eli5: 'Analyze potential security risks in code and architecture.',
    complex: 'Performs threat modeling analysis to identify potential attack vectors and security weaknesses.',
    type: 'toggle',
    section: 'security',
    defaultValue: false
  },
  'security.auditLog': {
    label: 'Enable Audit Logging',
    eli5: 'Keep a record of all actions for security and accountability.',
    complex: 'Maintains detailed audit logs of all tool executions, API calls, and security events for compliance and forensics.',
    type: 'toggle',
    section: 'security',
    defaultValue: true
  },

  'swarm.enabled': {
    label: 'Enable Agent Swarm',
    eli5: 'Allow Claude Code to create helper agents to work on tasks in parallel.',
    complex: 'Enables multi-agent swarm mode where multiple agent instances can coordinate on complex tasks.',
    type: 'toggle',
    section: 'swarm',
    defaultValue: false
  },
  'swarm.topology': {
    label: 'Swarm Network Topology',
    eli5: 'How agents communicate: Star (one leader), Mesh (all connected), or Hierarchical (layered).',
    complex: 'Network topology for agent communication and coordination. Star = centralized, Mesh = peer-to-peer, Hierarchical = layered.',
    type: 'select',
    options: ['star', 'mesh', 'hierarchical'],
    section: 'swarm',
    defaultValue: 'star'
  },
  'swarm.maxAgents': {
    label: 'Maximum Swarm Size',
    eli5: 'The maximum number of helper agents that can work together.',
    complex: 'Limits the maximum number of concurrent agents in the swarm to prevent resource exhaustion.',
    type: 'number',
    section: 'swarm',
    defaultValue: 5
  },
  'swarm.teamName': {
    label: 'Team Name',
    eli5: 'A name to identify your team of agents.',
    complex: 'Identifier for the agent team used in logging, metrics, and team coordination.',
    type: 'text',
    section: 'swarm',
    defaultValue: 'default-team'
  },
  'swarm.coordinationMode': {
    label: 'Agent Coordination Mode',
    eli5: 'How agents share work: Automatic (system decides), Manual (you direct them), or Hybrid.',
    complex: 'Mode controlling how agents divide and coordinate work: automatic task distribution, manual assignment, or hybrid approach.',
    type: 'select',
    options: ['automatic', 'manual', 'hybrid'],
    section: 'swarm',
    defaultValue: 'automatic'
  },

  'memory.backend': {
    label: 'Memory Storage Backend',
    eli5: 'Where to store memory: SQLite (persistent), JSON (simple), or Memory (temporary).',
    complex: 'Storage backend for agent memory. SQLite provides persistence, JSON is portable, Memory is fastest but ephemeral.',
    type: 'select',
    options: ['sqlite', 'json', 'memory'],
    section: 'memory',
    defaultValue: 'sqlite'
  },
  'memory.hnswEnabled': {
    label: 'Enable HNSW Vector Search',
    eli5: 'Use fast vector similarity search to find related memories quickly.',
    complex: 'Enables HNSW (Hierarchical Navigable Small World) algorithm for efficient semantic memory retrieval.',
    type: 'toggle',
    section: 'memory',
    defaultValue: true
  },
  'memory.retentionDays': {
    label: 'Memory Retention Period',
    eli5: 'How long to keep memories before automatically deleting them (in days).',
    complex: 'Number of days to retain memory entries before automatic pruning. Set to 0 for indefinite retention.',
    type: 'number',
    section: 'memory',
    defaultValue: 90
  },
  'memory.maxEntries': {
    label: 'Maximum Memory Entries',
    eli5: 'The maximum number of memories to store. Oldest ones are deleted when limit is reached.',
    complex: 'Maximum number of memory entries to retain. When exceeded, oldest entries are pruned based on access patterns.',
    type: 'number',
    section: 'memory',
    defaultValue: 10000
  },
  'memory.autoConsolidate': {
    label: 'Auto Memory Consolidation',
    eli5: 'Automatically merge related memories to keep memory organized and efficient.',
    complex: 'Enables automatic consolidation of memory entries to form higher-level abstractions and maintain efficiency.',
    type: 'toggle',
    section: 'memory',
    defaultValue: true
  }
};

export { SETTINGS_META };

export function getSettingMeta(path) {
  return SETTINGS_META[path] || null;
}

export function getSettingsBySection(section) {
  return Object.entries(SETTINGS_META)
    .filter(([_, meta]) => meta.section === section)
    .map(([path, meta]) => ({ path, ...meta }));
}

export function getSections() {
  const sections = new Set();
  Object.values(SETTINGS_META).forEach(meta => {
    sections.add(meta.section);
  });
  return Array.from(sections).sort();
}
