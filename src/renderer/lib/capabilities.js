export const CAPABILITIES = [
  // Core Capabilities
  {
    id: 'multi-model-support',
    name: 'Multi-Model Support',
    category: 'Core',
    icon: '🧠',
    eli5: 'Work with multiple AI models to find the best one for your task.',
    complex: 'Support for multiple LLM backends (Claude, GPT, Llama, etc.) with model selection, switching, and ensemble techniques for optimized performance.',
    features: ['Model switching', 'Ensemble inference', 'Performance metrics'],
  },
  {
    id: 'code-generation',
    name: 'Code Generation',
    category: 'Core',
    icon: '💻',
    eli5: 'Ask the AI to write code for you in any programming language.',
    complex: 'Multi-language code generation using transformer-based LLMs with context-aware completions, supporting 50+ programming languages and frameworks.',
    features: ['Multi-language support', 'Context-aware completions', 'Framework-specific patterns'],
  },
  {
    id: 'code-editing',
    name: 'Code Editing & Refactoring',
    category: 'Core',
    icon: '✏️',
    eli5: 'The AI can change and improve your existing code.',
    complex: 'Intelligent code modification using AST analysis, semantic understanding, and diff-based editing with minimal changes to achieve desired transformations.',
    features: ['Inline editing', 'Multi-file refactoring', 'Semantic renaming'],
  },
  {
    id: 'code-review',
    name: 'Automated Code Review',
    category: 'Core',
    icon: '👀',
    eli5: 'Get your code checked for bugs and improvements automatically.',
    complex: 'Static and dynamic analysis combining LLM reasoning with pattern detection for security vulnerabilities, performance issues, and code quality metrics.',
    features: ['Security scanning', 'Performance analysis', 'Best practice enforcement'],
  },
  {
    id: 'debugging',
    name: 'Intelligent Debugging',
    category: 'Core',
    icon: '🐛',
    eli5: 'The AI helps you find and fix bugs in your code.',
    complex: 'Root cause analysis using stack trace parsing, log analysis, state inspection, and hypothesis-driven debugging with automated fix suggestions.',
    features: ['Stack trace analysis', 'Root cause detection', 'Auto-fix suggestions'],
  },

  // Intelligence Capabilities
  {
    id: 'memory-vector-search',
    name: 'Memory & Vector Search',
    category: 'Intelligence',
    icon: '🔍',
    eli5: 'Find related information by meaning, not just matching words.',
    complex: 'HNSW-based vector similarity search for semantic memory retrieval with configurable embedding models, dimension tuning, and automatic indexing.',
    features: ['Semantic similarity', 'HNSW indexing', 'Embedding models', 'Auto-indexing'],
  },
  {
    id: 'reinforcement-learning',
    name: 'Reinforcement Learning',
    category: 'Intelligence',
    icon: '📚',
    eli5: 'The AI gets better over time by learning from past interactions.',
    complex: 'Instinct-based learning system extracting reusable patterns from interactions, with reinforcement learning algorithms (PPO, A2C, DQN, DDPG) for agent optimization.',
    features: ['Pattern extraction', 'Instinct learning', 'Reinforcement learning', 'Knowledge consolidation'],
  },
  {
    id: 'knowledge-graphs',
    name: 'Knowledge Graphs',
    category: 'Intelligence',
    icon: '🌐',
    eli5: 'The AI builds a map of connected knowledge about your codebase.',
    complex: 'Graph-based knowledge representation with entity extraction, relationship mapping, and graph traversal for context enrichment and dependency analysis.',
    features: ['Entity extraction', 'Relationship mapping', 'Graph traversal', 'Dependency analysis'],
  },
  {
    id: 'natural-language',
    name: 'Natural Language Interface',
    category: 'Intelligence',
    icon: '💬',
    eli5: 'Talk to the AI in plain English to get things done.',
    complex: 'Natural language understanding pipeline converting user intent into actionable tool calls, code modifications, and workflow orchestrations.',
    features: ['Intent recognition', 'Context preservation', 'Multi-turn conversations'],
  },

  // Orchestration Capabilities
  {
    id: 'agent-swarm-orchestration',
    name: 'Agent Swarm Orchestration',
    category: 'Orchestration',
    icon: '🐝',
    eli5: 'Multiple AI agents working together on different parts of a project.',
    complex: 'Hierarchical multi-agent orchestration with task decomposition, inter-agent messaging, shared task lists, and configurable topologies (star, mesh, hierarchical).',
    features: ['Team creation', 'Task delegation', 'Inter-agent messaging', 'Topology configuration'],
  },
  {
    id: 'background-workers',
    name: 'Background Workers',
    category: 'Orchestration',
    icon: '⚙️',
    eli5: 'Run AI tasks in the background without blocking your work.',
    complex: 'Async task execution with worker pools, queue management, priority scheduling, and progress monitoring with cancellation support.',
    features: ['Async execution', 'Worker pools', 'Priority scheduling', 'Progress monitoring'],
  },
  {
    id: 'environment-config',
    name: 'Environment Config',
    category: 'Orchestration',
    icon: '⚡',
    eli5: 'Configure how the AI works for your specific project needs.',
    complex: 'Environment-aware configuration with .env support, project presets, dynamic variable injection, and multi-environment management (dev, staging, prod).',
    features: ['.env support', 'Project presets', 'Variable injection', 'Multi-environment'],
  },

  // Security Capabilities
  {
    id: 'security-scanning',
    name: 'Security Scanning',
    category: 'Security',
    icon: '🔐',
    eli5: 'Automatically check your code for security vulnerabilities.',
    complex: 'Comprehensive security analysis including SAST, DAST, dependency scanning, and cryptographic weakness detection using OWASP and CWE standards.',
    features: ['SAST', 'DAST', 'Dependency scanning', 'Crypto analysis'],
  },
  {
    id: 'permission-management',
    name: 'Permission Management',
    category: 'Security',
    icon: '🔒',
    eli5: 'Control exactly what the AI is allowed to do.',
    complex: 'Granular permission system with allow/deny lists using glob patterns, tool-level controls, and multiple permission modes (default, acceptEdits, bypassPermissions).',
    features: ['Allow/deny lists', 'Glob patterns', 'Permission modes', 'Tool-level control'],
  },
  {
    id: 'hook-system',
    name: 'Hook System',
    category: 'Security',
    icon: '🪝',
    eli5: 'Run custom scripts before or after the AI does things.',
    complex: 'Event-driven hook system with PreToolUse, PostToolUse, Notification, Stop, and SubagentStop hooks for custom validation, logging, and workflow automation.',
    features: ['Pre/Post tool hooks', 'Notification hooks', 'Custom validation', 'Workflow automation'],
  },

  // Integration Capabilities
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    category: 'Integration',
    icon: '🔀',
    eli5: 'Seamlessly work with GitHub for code management and collaboration.',
    complex: 'Full git workflow support including branch management, commit creation, PR lifecycle, code review automation, and CI/CD status monitoring via GitHub CLI.',
    features: ['Branch management', 'PR creation', 'Code review', 'CI/CD integration'],
  },
  {
    id: 'addon-ecosystem',
    name: 'Add-on Ecosystem',
    category: 'Integration',
    icon: '🔌',
    eli5: 'Extend RUFLO with custom plugins and third-party integrations.',
    complex: 'Model Context Protocol (MCP) server support for extending capabilities with external tools, databases, APIs, and custom functionality through a standardized protocol.',
    features: ['Custom tool servers', 'Database access', 'API integration', 'Protocol standardization'],
  },
  {
    id: 'file-operations',
    name: 'File Operations',
    category: 'Integration',
    icon: '📁',
    eli5: 'Read, write, and search through your project files.',
    complex: 'Complete filesystem access via sandboxed tools: Read, Write, Edit, Glob (pattern matching), and Grep (content search) with permission controls.',
    features: ['Read/Write/Edit', 'Glob pattern search', 'Grep content search'],
  },
  {
    id: 'terminal-access',
    name: 'Terminal & Shell',
    category: 'Integration',
    icon: '🖥️',
    eli5: 'Run terminal commands like git, npm, and other tools.',
    complex: 'Bash shell execution with timeout controls, background process management, and environment variable injection for CI/CD integration.',
    features: ['Command execution', 'Background processes', 'Environment management'],
  },

  // Performance Capabilities
  {
    id: 'token-optimization',
    name: 'Token Optimization',
    category: 'Performance',
    icon: '💾',
    eli5: 'Use AI efficiently by reducing how many tokens you send.',
    complex: 'Intelligent token budgeting with context compression, semantic summarization, and incremental processing for cost and latency optimization.',
    features: ['Context compression', 'Semantic summarization', 'Incremental processing'],
  },
  {
    id: 'auto-save',
    name: 'Auto-Save',
    category: 'Performance',
    icon: '💾',
    eli5: 'Your work is automatically saved so you never lose progress.',
    complex: 'Intelligent caching and persistence layer with debounced writes, version control integration, and recovery mechanisms for interrupted sessions.',
    features: ['Debounced writes', 'Version control', 'Recovery', 'State persistence'],
  },
  {
    id: 'webassembly-acceleration',
    name: 'WebAssembly Acceleration',
    category: 'Performance',
    icon: '⚡',
    eli5: 'Speed up complex operations using fast native code.',
    complex: 'WASM runtime integration for computationally intensive tasks like tokenization, embeddings, and parsing with seamless JS interop.',
    features: ['WASM runtime', 'Native execution', 'JS interop', 'Benchmarking'],
  },
];

export function getCapabilitiesByCategory(category) {
  return CAPABILITIES.filter(c => c.category === category);
}

export function getCapabilityById(id) {
  return CAPABILITIES.find(c => c.id === id);
}

export const CAPABILITY_CATEGORIES = [...new Set(CAPABILITIES.map(c => c.category))];
