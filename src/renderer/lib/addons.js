// Addon definitions for RUFLO

const ADDONS = [
  {
    id: 'ruvector-intelligence',
    name: 'RuVector Intelligence',
    description: 'SONA neural attention, EWC++ continual learning, Flash Attention v2',
    eli5: 'Makes your AI smarter by helping it pay attention to the right things and remember what it learned before.',
    complex: 'Implements SONA (Self-Organizing Neural Attention) for dynamic attention routing, EWC++ for continual learning without catastrophic forgetting, and Flash Attention v2 for O(n) memory-efficient attention computation.',
    detailedSummary: 'RuVector Intelligence is the neural backbone of ruflo\'s cognitive capabilities. It uses three cutting-edge algorithms: SONA routes attention dynamically based on task complexity, EWC++ prevents the model from forgetting previously learned tasks when learning new ones, and Flash Attention v2 reduces memory usage from O(n^2) to O(n) during attention computation. Install this if you want smarter, faster, more efficient AI agents.',
    category: 'Intelligence',
    installCommand: 'npx ruflo@latest install ruvector-intelligence',
    icon: '🧠',
    features: ['SONA neural attention', 'EWC++ continual learning', 'Flash Attention v2']
  },
  {
    id: 'agentdb-persistence',
    name: 'AgentDB Persistence',
    description: 'SQLite WAL mode, ACID transactions, agent state persistence',
    eli5: 'Saves your agent\'s work safely to a database so it never loses what it\'s doing, even if something breaks.',
    complex: 'Provides SQLite-backed persistence using Write-Ahead Logging (WAL) mode for concurrent read/write operations, ACID transaction guarantees, and automatic state snapshots with rollback capabilities.',
    detailedSummary: 'AgentDB Persistence ensures your agent\'s state survives system failures and restarts. It uses SQLite in WAL mode for high-concurrency reads while maintaining ACID transaction properties, ensuring data integrity even under adverse conditions. The addon automatically snapshots agent state and provides rollback capabilities for recovery.',
    category: 'Database',
    installCommand: 'npx ruflo@latest install agentdb-persistence',
    icon: '💾',
    features: ['SQLite WAL mode', 'ACID transactions', 'Agent state persistence']
  },
  {
    id: 'hnsw-vector-search',
    name: 'HNSW Vector Search',
    description: 'High-performance similarity search, semantic memory retrieval',
    eli5: 'Helps your agent find similar information super fast, like a magical search that understands what things mean.',
    complex: 'Implements Hierarchical Navigable Small World (HNSW) graphs for approximate nearest-neighbor search with O(log n) complexity, enabling sub-millisecond semantic similarity lookups on million-scale vector collections.',
    detailedSummary: 'HNSW Vector Search powers semantic memory and knowledge retrieval for intelligent agents. Using Hierarchical Navigable Small World algorithms, it performs approximate nearest-neighbor searches with O(log n) complexity, enabling rapid semantic similarity queries across large vector spaces. This is essential for agents that need to retrieve relevant memories or documents contextually.',
    category: 'Search',
    installCommand: 'npx ruflo@latest install hnsw-vector-search',
    icon: '🔍',
    features: ['High-performance similarity search', 'Semantic memory retrieval']
  },
  {
    id: 'claude-provider',
    name: 'Claude Provider',
    description: 'Anthropic Claude API integration with streaming',
    eli5: 'Let your agent use Claude, a really smart AI helper made by Anthropic.',
    complex: 'Provides native integration with Anthropic\'s Claude API including token counting, streaming responses, vision capabilities, and tool use support with automatic fallback and rate-limit handling.',
    detailedSummary: 'Claude Provider integrates Anthropic\'s Claude family of models into your ruflo agents. It handles token counting, streaming for real-time responses, vision capabilities for image understanding, and tool use for extending Claude\'s capabilities. The addon manages rate limits and API errors gracefully with automatic retries.',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install claude-provider',
    icon: '🤖',
    features: ['Anthropic Claude API integration', 'Streaming support']
  },
  {
    id: 'gpt-provider',
    name: 'GPT Provider',
    description: 'OpenAI GPT integration with function calling',
    eli5: 'Let your agent use GPT, OpenAI\'s super smart AI that can understand and generate text.',
    complex: 'Integrates OpenAI\'s GPT-4 and GPT-3.5 models with function calling for structured outputs, vision capabilities, embedding generation, and intelligent retry logic with exponential backoff.',
    detailedSummary: 'GPT Provider connects your agents to OpenAI\'s powerful GPT models. It supports function calling for structured task execution, vision capabilities for image analysis, and embedding generation for semantic searches. The addon handles authentication, rate limiting, and automatic retries with exponential backoff.',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install gpt-provider',
    icon: '⚡',
    features: ['OpenAI GPT integration', 'Function calling support']
  },
  {
    id: 'gemini-provider',
    name: 'Gemini Provider',
    description: 'Google Gemini integration with multimodal support',
    eli5: 'Let your agent use Gemini, Google\'s AI that can understand text, images, and more at the same time.',
    complex: 'Provides integration with Google\'s Gemini models including native multimodal input (text, images, audio, video), safety filters, semantic understanding, and Vertex AI platform support with credential management.',
    detailedSummary: 'Gemini Provider integrates Google\'s Gemini models with native multimodal capabilities. Your agents can process text, images, audio, and video inputs simultaneously, enabling richer context understanding. The addon manages Google Cloud credentials and safety configurations automatically.',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install gemini-provider',
    icon: '✨',
    features: ['Google Gemini integration', 'Multimodal support']
  },
  {
    id: 'ollama-provider',
    name: 'Ollama Provider',
    description: 'Local LLM integration via Ollama',
    eli5: 'Run AI models locally on your computer without sending data to the internet.',
    complex: 'Enables integration with Ollama for running open-source LLMs (Llama 2, Mistral, etc.) locally with automatic model management, streaming inference, and zero-latency API calls without external dependencies.',
    detailedSummary: 'Ollama Provider gives your agents access to powerful open-source language models running entirely on your machine. It supports Llama 2, Mistral, and other models, with automatic model downloading and caching. Perfect for privacy-sensitive applications or offline operation.',
    category: 'LLM Providers',
    installCommand: 'npx ruflo@latest install ollama-provider',
    icon: '🏠',
    features: ['Local LLM integration', 'Ollama support']
  },
  {
    id: 'agent-booster-wasm',
    name: 'Agent Booster WASM',
    description: 'WebAssembly acceleration for compute-intensive tasks',
    eli5: 'Makes heavy number-crunching tasks super fast by using special compiled code.',
    complex: 'Compiles computationally intensive operations to WebAssembly bytecode achieving near-native performance (2-10x speedup) for vector operations, matrix computations, cryptographic hashing, and signal processing.',
    detailedSummary: 'Agent Booster WASM accelerates computationally heavy workloads through WebAssembly compilation. It provides 2-10x performance improvements for vector operations, matrix math, cryptography, and signal processing. Ideal for agents performing frequent numerical computations or processing large datasets.',
    category: 'Performance',
    installCommand: 'npx ruflo@latest install agent-booster-wasm',
    icon: '⚙️',
    features: ['WebAssembly acceleration', 'Compute-intensive task optimization']
  },
  {
    id: 'token-optimizer',
    name: 'Token Optimizer',
    description: 'Intelligent token budgeting and context window optimization',
    eli5: 'Makes sure your agent uses tokens wisely so you don\'t spend too much money on AI API calls.',
    complex: 'Implements dynamic token allocation using sliding window compression, semantic summarization, and priority-based pruning to maximize context relevance within budget constraints while minimizing information loss.',
    detailedSummary: 'Token Optimizer intelligently manages token usage to reduce API costs while maintaining context quality. It uses sliding window compression for long conversations, semantic summarization to preserve important information, and priority-based pruning to keep the most relevant context. Essential for agents running long interactions with expensive models.',
    category: 'Performance',
    installCommand: 'npx ruflo@latest install token-optimizer',
    icon: '💡',
    features: ['Intelligent token budgeting', 'Context window optimization']
  },
  {
    id: 'security-suite-aidefence',
    name: 'Security Suite AIDefence',
    description: 'CVE scanning, threat modeling, vulnerability detection',
    eli5: 'Keeps your agent safe by checking for security problems and bad guys trying to hack it.',
    complex: 'Provides CVE database scanning, adversarial prompt detection using ML classifiers, automated threat modeling with STRIDE analysis, and runtime security monitoring with syscall filtering and sandboxing.',
    detailedSummary: 'Security Suite AIDefence protects your agents from vulnerabilities and attacks. It scans for known CVEs, detects adversarial prompts attempting to manipulate the AI, performs automated threat modeling using STRIDE methodology, and monitors runtime behavior with syscall filtering. Essential for production agents handling sensitive data.',
    category: 'Security',
    installCommand: 'npx ruflo@latest install security-suite-aidefence',
    icon: '🔐',
    features: ['CVE scanning', 'Threat modeling', 'Vulnerability detection']
  },
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    description: 'PR management, issue tracking, code review automation',
    eli5: 'Let your agent work with GitHub to make pull requests, find bugs, and review code automatically.',
    complex: 'Integrates GitHub API for PR lifecycle management, issue creation/tracking, automated code review with diff analysis, branch management, and CI/CD workflow integration with status checks.',
    detailedSummary: 'GitHub Integration enables your agents to fully interact with GitHub repositories. They can create and manage pull requests, track and update issues, perform automated code reviews with intelligent diff analysis, and integrate with CI/CD pipelines. Ideal for autonomous development workflows and continuous improvement cycles.',
    category: 'Integration',
    installCommand: 'npx ruflo@latest install github-integration',
    icon: '🐙',
    features: ['PR management', 'Issue tracking', 'Code review automation']
  },
  {
    id: 'background-workers',
    name: 'Background Workers',
    description: '12 worker types: file watcher, scheduler, queue processor, health monitor, log aggregator, cache manager, backup worker, sync worker, notification worker, metrics collector, cleanup worker, indexer',
    eli5: 'Gives your agent 12 different helper workers that can do jobs in the background so the agent stays fast and responsive.',
    complex: 'Provides 12 specialized worker types using Worker Threads: file watchers with debouncing, cron schedulers, async queue processors with backpressure, health monitors with liveness checks, log aggregators with streaming, cache managers with TTL, backup workers, sync workers, notification dispatchers, metrics collectors, cleanup tasks, and vector indexers.',
    detailedSummary: 'Background Workers provide a suite of 12 specialized worker types that run independently to keep your agent responsive. They include file watchers for filesystem events, cron schedulers for periodic tasks, queue processors for async jobs, health monitors for system stability, log aggregators, cache managers, backup handlers, data sync workers, notification dispatchers, metrics collectors, cleanup tasks, and vector indexers. Use these to offload non-critical work from the main agent thread.',
    category: 'Workers',
    installCommand: 'npx ruflo@latest install background-workers',
    icon: '👷',
    features: ['File watcher', 'Scheduler', 'Queue processor', 'Health monitor', 'Log aggregator', 'Cache manager', 'Backup worker', 'Sync worker', 'Notification worker', 'Metrics collector', 'Cleanup worker', 'Indexer']
  },
  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    description: 'PPO, A2C, DQN, DDPG algorithms for agent optimization',
    eli5: 'Teaches your agent to get better at things by rewarding it when it does something good.',
    complex: 'Implements PPO (Proximal Policy Optimization), A2C (Actor-Critic), DQN (Deep Q-Learning), and DDPG (Deep Deterministic Policy Gradient) with experience replay, target networks, entropy regularization, and policy gradient optimization for both discrete and continuous action spaces.',
    detailedSummary: 'Reinforcement Learning enables agents to learn and improve through trial and error with reward signals. It provides four state-of-the-art algorithms: PPO for stable policy updates, A2C for faster convergence, DQN for discrete action spaces, and DDPG for continuous control. Perfect for training autonomous agents that need to optimize complex behaviors.',
    category: 'Learning',
    installCommand: 'npx ruflo@latest install reinforcement-learning',
    icon: '🎯',
    features: ['PPO algorithm', 'A2C algorithm', 'DQN algorithm', 'DDPG algorithm']
  },
  {
    id: 'memory-consolidation',
    name: 'Memory Consolidation',
    description: 'Long-term memory formation, knowledge graph building',
    eli5: 'Helps your agent remember important things for a long time and organize what it learns into a smart web of knowledge.',
    complex: 'Implements episodic memory consolidation with spaced repetition, semantic memory with knowledge graphs using entity linking and relationship extraction, and procedural memory with skill decomposition and reuse.',
    detailedSummary: 'Memory Consolidation transforms short-term interactions into long-term learning. It builds episodic memories using spaced repetition to strengthen important events, creates semantic knowledge graphs through entity linking and relationship extraction, and consolidates procedural memories as reusable skills. Essential for agents that need to build knowledge over time and generalize across tasks.',
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
