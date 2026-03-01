// Addon definitions for RUFLO

const ADDONS = [
  {
    id: 'ruvector-intelligence',
    name: 'RuVector Intelligence',
    description: 'SONA neural attention, EWC++ continual learning, Flash Attention v2',
    category: 'Intelligence',
    installCommand: 'npx ruflo@latest install ruvector-intelligence',
    icon: '🧠',
    features: ['SONA neural attention', 'EWC++ continual learning', 'Flash Attention v2']
  },
  {
    id: 'agentdb-persistence',
    name: 'AgentDB Persistence',
    description: 'SQLite WAL mode, ACID transactions, agent state persistence',
    category: 'Database',
    installCommand: 'npx ruflo@latest install agentdb-persistence',
    icon: '💾',
    features: ['SQLite WAL mode', 'ACID transactions', 'Agent state persistence']
  },
  {
    id: 'hnsw-vector-search',
    name: 'HNSW Vector Search',
    description: 'High-performance similarity search, semantic memory retrieval',
    category: 'Search',
    installCommand: 'npx ruflo@latest install hnsw-vector-search',
    icon: '🔍',
    features: ['High-performance similarity search', 'Semantic memory retrieval']
  },
  {
    id: 'claude-provider',
    name: 'Claude Provider',
    description: 'Anthropic Claude API integration with streaming',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install claude-provider',
    icon: '🤖',
    features: ['Anthropic Claude API integration', 'Streaming support']
  },
  {
    id: 'gpt-provider',
    name: 'GPT Provider',
    description: 'OpenAI GPT integration with function calling',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install gpt-provider',
    icon: '⚡',
    features: ['OpenAI GPT integration', 'Function calling support']
  },
  {
    id: 'gemini-provider',
    name: 'Gemini Provider',
    description: 'Google Gemini integration with multimodal support',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install gemini-provider',
    icon: '✨',
    features: ['Google Gemini integration', 'Multimodal support']
  },
  {
    id: 'ollama-provider',
    name: 'Ollama Provider',
    description: 'Local LLM integration via Ollama',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install ollama-provider',
    icon: '🏠',
    features: ['Local LLM integration', 'Ollama support']
  },
  {
    id: 'agent-booster-wasm',
    name: 'Agent Booster WASM',
    description: 'WebAssembly acceleration for compute-intensive tasks',
    category: 'Performance',
    installCommand: 'npx ruflo@latest install agent-booster-wasm',
    icon: '⚙️',
    features: ['WebAssembly acceleration', 'Compute-intensive task optimization']
  },
  {
    id: 'token-optimizer',
    name: 'Token Optimizer',
    description: 'Intelligent token budgeting and context window optimization',
    category: 'Performance',
    installCommand: 'npx ruflo@latest install token-optimizer',
    icon: '💡',
    features: ['Intelligent token budgeting', 'Context window optimization']
  },
  {
    id: 'security-suite-aidefence',
    name: 'Security Suite AIDefence',
    description: 'CVE scanning, threat modeling, vulnerability detection',
    category: 'Security',
    installCommand: 'npx ruflo@latest install security-suite-aidefence',
    icon: '🔐',
    features: ['CVE scanning', 'Threat modeling', 'Vulnerability detection']
  },
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    description: 'PR management, issue tracking, code review automation',
    category: 'Integration',
    installCommand: 'npx ruflo@latest install github-integration',
    icon: '🐙',
    features: ['PR management', 'Issue tracking', 'Code review automation']
  },
  {
    id: 'background-workers',
    name: 'Background Workers',
    description: '12 worker types: file watcher, scheduler, queue processor, health monitor, log aggregator, cache manager, backup worker, sync worker, notification worker, metrics collector, cleanup worker, indexer',
    category: 'Workers',
    installCommand: 'npx ruflo@latest install background-workers',
    icon: '👷',
    features: ['File watcher', 'Scheduler', 'Queue processor', 'Health monitor', 'Log aggregator', 'Cache manager', 'Backup worker', 'Sync worker', 'Notification worker', 'Metrics collector', 'Cleanup worker', 'Indexer']
  },
  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    description: 'PPO, A2C, DQN, DDPG algorithms for agent optimization',
    category: 'Learning',
    installCommand: 'npx ruflo@latest install reinforcement-learning',
    icon: '🎯',
    features: ['PPO algorithm', 'A2C algorithm', 'DQN algorithm', 'DDPG algorithm']
  },
  {
    id: 'memory-consolidation',
    name: 'Memory Consolidation',
    description: 'Long-term memory formation, knowledge graph building',
    category: 'Intelligence',
    installCommand: 'npx ruflo@latest install memory-consolidation',
    icon: '🧬',
    features: ['Long-term memory formation', 'Knowledge graph building']
  }
];

export { ADDONS };

export function getAddonsByCategory(category) {
  return ADDONS.filter(addon => addon.category === category);
}

export function getAddonById(id) {
  return ADDONS.find(addon => addon.id === id);
}
