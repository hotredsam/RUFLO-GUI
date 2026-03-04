// ELI5 Settings Metadata - User-friendly descriptions for Claude Code settings
// Only includes settings that actually exist in ~/.claude/settings.json

const SETTINGS_META = [
  // ===== GENERAL SECTION =====
  {
    path: 'model',
    section: 'general',
    label: 'Default Model',
    type: 'select',
    options: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001'],
    default: 'claude-sonnet-4-6',
    eli5: 'Which Claude model to use for your tasks. Sonnet is balanced, Opus is most capable, Haiku is fastest and cheapest.',
    complex: 'The default LLM model identifier used for code analysis, generation, and reasoning tasks. Opus has the highest capability but costs more, Sonnet is balanced, Haiku is optimized for speed and cost.'
  },
  {
    path: 'language',
    section: 'general',
    label: 'Response Language',
    type: 'text',
    default: 'English',
    eli5: 'What language Claude should use when responding to you.',
    complex: 'Language preference for Claude responses. Can be any ISO 639-1 language code or natural language name (e.g., "en", "fr", "Japanese").'
  },
  {
    path: 'outputStyle',
    section: 'general',
    label: 'Output Style',
    type: 'text',
    default: '',
    eli5: 'How you prefer Claude to format its responses (e.g., concise, detailed, with examples).',
    complex: 'Preferred output formatting and verbosity level. Examples: "concise", "detailed", "with-examples", "academic", "casual".'
  },
  {
    path: 'cleanupPeriodDays',
    section: 'general',
    label: 'Cleanup Period (Days)',
    type: 'number',
    default: 30,
    eli5: 'How many days before old temporary files and data are automatically deleted.',
    complex: 'Number of days before old cached data, temporary files, and session artifacts are cleaned up automatically. Set to 0 to disable.'
  },
  {
    path: 'autoUpdatesChannel',
    section: 'general',
    label: 'Auto Updates Channel',
    type: 'select',
    options: ['stable', 'beta'],
    default: 'stable',
    eli5: 'Whether to get stable releases (tested) or beta releases (new features but less tested).',
    complex: 'Update channel for Claude Code: stable (production-ready releases) or beta (pre-release with new features).'
  },
  {
    path: 'respectGitignore',
    section: 'general',
    label: 'Respect .gitignore',
    type: 'toggle',
    default: true,
    eli5: 'Whether Claude should skip files listed in .gitignore (like node_modules or build artifacts).',
    complex: 'When enabled, Claude respects .gitignore rules and excludes matched files/directories from context, analysis, and operations.'
  },
  {
    path: 'showTurnDuration',
    section: 'general',
    label: 'Show Turn Duration',
    type: 'toggle',
    default: false,
    eli5: 'Show how long each Claude response took to generate.',
    complex: 'When enabled, displays the time taken for each agent turn/response, useful for performance monitoring and optimization.'
  },
  {
    path: 'statusLine',
    section: 'general',
    label: 'Custom Status Line',
    type: 'text',
    default: '',
    eli5: 'Custom text to show in the status line while Claude is working.',
    complex: 'Custom status line format string. Can include variables for current task, model name, token usage, etc.'
  },
  {
    path: 'plansDirectory',
    section: 'general',
    label: 'Plans Directory',
    type: 'text',
    default: '~/.claude/plans',
    eli5: 'Where to save task plans and agent strategies.',
    complex: 'Directory path where Claude saves generated plans, agent strategies, and conversation plans. Supports ~ for home directory.'
  },
  {
    path: 'enableAllProjectMcpServers',
    section: 'general',
    label: 'Enable All Project MCP Servers',
    type: 'toggle',
    default: false,
    eli5: 'Automatically enable all MCP servers defined in your project.',
    complex: 'When enabled, automatically connects to and enables all MCP (Model Context Protocol) servers found in project configuration files.'
  },

  // ===== ENVIRONMENT SECTION =====
  {
    path: 'env.ANTHROPIC_API_KEY',
    section: 'environment',
    label: 'Anthropic API Key',
    type: 'text',
    default: '',
    eli5: 'Your API key from Anthropic for accessing Claude models. Get it from https://console.anthropic.com',
    complex: 'Environment variable storing the authentication token for Anthropic Claude API access. Required for all API requests.'
  },
  {
    path: 'env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC',
    section: 'environment',
    label: 'Disable Non-Essential Network Traffic',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to disable optional network requests like telemetry and analytics.',
    complex: 'Set to "1" to disable telemetry, analytics, and non-critical network communications while preserving core functionality. Accepts "0" or "1".'
  },
  {
    path: 'env.CLAUDE_CODE_USE_BEDROCK',
    section: 'environment',
    label: 'Use AWS Bedrock',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to route requests through Amazon Bedrock instead of calling Anthropic directly.',
    complex: 'Set to "1" to route LLM requests through AWS Bedrock service instead of direct Anthropic API endpoints. Requires AWS credentials and Bedrock access.'
  },
  {
    path: 'env.CLAUDE_CODE_USE_VERTEX',
    section: 'environment',
    label: 'Use Google Vertex AI',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to route requests through Google Vertex AI instead of calling Anthropic directly.',
    complex: 'Set to "1" to route LLM requests through Google Vertex AI platform instead of direct Anthropic API endpoints. Requires Google Cloud credentials and Vertex API access.'
  },
  {
    path: 'env.CLAUDE_CODE_SKIP_CHROME_DOWNLOAD',
    section: 'environment',
    label: 'Skip Chrome Download',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to skip downloading Chromium browser and use your system browser instead.',
    complex: 'Set to "1" to skip automatic Chromium binary download during setup. Useful for headless environments or when using system-installed Chrome.'
  },
  {
    path: 'env.DISABLE_PROMPT_CACHING',
    section: 'environment',
    label: 'Disable Prompt Caching',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to turn off prompt caching, which saves money on API calls but makes responses slower.',
    complex: 'Set to "1" to disable prompt caching feature that reduces API costs. Useful for debugging or when consistent fresh evaluations are needed.'
  },
  {
    path: 'env.DISABLE_AUTO_COMPACT',
    section: 'environment',
    label: 'Disable Auto Context Compaction',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to turn off automatic message compression and keep full conversation history.',
    complex: 'Set to "1" to disable automatic context compaction when conversation approaches token limits. Preserves full conversation history at the cost of higher token usage.'
  },
  {
    path: 'env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE',
    section: 'environment',
    label: 'Auto-Compact Percentage Override',
    type: 'text',
    default: '',
    eli5: 'Set the context usage percentage (e.g., "50") when automatic compaction kicks in. Leave blank to use default.',
    complex: 'Override the context utilization percentage threshold for triggering automatic compaction. Example: "50" compacts when 50% of context is used.'
  },
  {
    path: 'env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS',
    section: 'environment',
    label: 'Enable Experimental Agent Teams',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to enable the experimental agent teams/swarm feature for parallel task execution.',
    complex: 'Set to "1" to enable experimental multi-agent swarm mode where multiple Claude instances coordinate on complex tasks. Subject to change.'
  },

  // ===== PERMISSIONS SECTION =====
  {
    path: 'permissions.defaultMode',
    section: 'permissions',
    label: 'Default Permission Mode',
    type: 'select',
    options: ['default', 'acceptEdits', 'plan', 'dontAsk', 'bypassPermissions'],
    default: 'default',
    eli5: 'Default behavior for new permissions: ask (default), auto-accept edits, require plan approval, never ask again, or bypass all checks.',
    complex: 'Default permission mode: "default" (always ask), "acceptEdits" (auto-approve file changes), "plan" (require plan approval), "dontAsk" (auto-approve), "bypassPermissions" (no checks).'
  },
  {
    path: 'permissions.disableBypassPermissionsMode',
    section: 'permissions',
    label: 'Disable Bypass Permissions Mode',
    type: 'toggle',
    default: false,
    eli5: 'When enabled, prevents the "bypass all checks" permission mode from being used.',
    complex: 'When enabled, disables the "bypassPermissions" mode option, enforcing permission checks at all times for security compliance.'
  },

  // ===== PLUGINS SECTION =====
  {
    path: 'enabledPlugins',
    section: 'plugins',
    label: 'Enabled Plugins',
    type: 'list',
    default: [],
    eli5: 'List of plugin package names that are currently enabled.',
    complex: 'Array of plugin package identifiers that are enabled. Format: "scope/package-name" for scoped packages, "package-name" for unscoped.'
  },
  {
    path: 'extraKnownMarketplaces',
    section: 'plugins',
    label: 'Extra Known Marketplaces',
    type: 'list',
    default: [],
    eli5: 'Additional plugin marketplace URLs beyond the default ones.',
    complex: 'Array of additional plugin marketplace URLs. Each should be a valid HTTPS URL to a compatible plugin registry.'
  },
  {
    path: 'strictKnownMarketplaces',
    section: 'plugins',
    label: 'Strict Known Marketplaces',
    type: 'toggle',
    default: false,
    eli5: 'When enabled, only allow plugins from known/approved marketplaces.',
    complex: 'When enabled, restricts plugin installation to only known and explicitly approved marketplace sources for security.'
  },
  {
    path: 'blockedMarketplaces',
    section: 'plugins',
    label: 'Blocked Marketplaces',
    type: 'list',
    default: [],
    eli5: 'List of marketplace URLs that are blocked from being used.',
    complex: 'Array of marketplace URLs to block. Prevents installation of plugins from these sources.'
  },

  // ===== SWARM SECTION =====
  {
    path: 'swarm.topology',
    section: 'swarm',
    label: 'Swarm Topology',
    type: 'select',
    options: ['hierarchical', 'mesh', 'ring', 'star', 'hybrid', 'adaptive'],
    default: 'hierarchical',
    eli5: 'How your AI agents are organized - like a tree, web, circle, or star pattern.',
    complex: 'Agent team topology defining communication patterns and coordination structure.'
  },
  {
    path: 'swarm.maxAgents',
    section: 'swarm',
    label: 'Max Agents',
    type: 'number',
    default: 20,
    eli5: 'Maximum number of AI helpers that can work at the same time.',
    complex: 'Maximum concurrent agent instances in a swarm session. Higher values increase parallelism but consume more resources.'
  },
  {
    path: 'swarm.teamName',
    section: 'swarm',
    label: 'Team Name',
    type: 'text',
    default: '',
    eli5: 'A name for your team of AI agents.',
    complex: 'Identifier for the agent team. Used in coordination, logging, and inter-agent communication.'
  },
  {
    path: 'swarm.coordinationStrategy',
    section: 'swarm',
    label: 'Coordination Strategy',
    type: 'select',
    options: ['centralized', 'distributed', 'consensus'],
    default: 'centralized',
    eli5: 'How agents decide who does what - one boss, everyone decides, or they vote.',
    complex: 'Task distribution strategy: centralized (single coordinator), distributed (peer-to-peer), or consensus (quorum-based decisions).'
  },
  {
    path: 'swarm.autoScale',
    section: 'swarm',
    label: 'Auto Scale',
    type: 'toggle',
    default: false,
    eli5: 'Automatically add or remove AI helpers based on how busy they are.',
    complex: 'Enable automatic agent scaling based on task queue depth and resource utilization metrics.'
  },
  {
    path: 'swarm.faultTolerance',
    section: 'swarm',
    label: 'Fault Tolerance',
    type: 'toggle',
    default: false,
    eli5: 'Keep working even if some AI helpers crash or disconnect.',
    complex: 'Enable fault-tolerant execution with automatic agent restart and task reassignment on failures.'
  },
  {
    path: 'swarm.messageProtocol',
    section: 'swarm',
    label: 'Message Protocol',
    type: 'select',
    options: ['direct', 'broadcast', 'gossip'],
    default: 'direct',
    eli5: 'How agents talk to each other - one-on-one, announce to everyone, or spread the word gradually.',
    complex: 'Inter-agent messaging protocol: direct (point-to-point), broadcast (all-to-all), or gossip (probabilistic dissemination).'
  },

  // ===== MEMORY SECTION =====
  {
    path: 'memory.backend',
    section: 'memory',
    label: 'Memory Backend',
    type: 'select',
    options: ['sqlite', 'json', 'hybrid', 'memory'],
    default: 'json',
    eli5: 'Where to store AI memory - a database, files, both, or just in RAM.',
    complex: 'Memory persistence backend: sqlite (structured DB), json (file-based), hybrid (both), or memory (in-process, non-persistent).'
  },
  {
    path: 'memory.hnswEnabled',
    section: 'memory',
    label: 'HNSW Enabled',
    type: 'toggle',
    default: false,
    eli5: 'Enable smart search that finds similar things quickly, like a librarian who knows exactly where every book is.',
    complex: 'Enable HNSW (Hierarchical Navigable Small World) vector index for approximate nearest-neighbor search over memory embeddings.'
  },
  {
    path: 'memory.hnswDimensions',
    section: 'memory',
    label: 'HNSW Dimensions',
    type: 'number',
    default: 384,
    eli5: 'How detailed the AI\'s memory search is - higher means more precise but slower.',
    complex: 'Dimensionality of HNSW vector embeddings. Common values: 384 (MiniLM), 768 (BERT-base), 1536 (OpenAI ada-002).'
  },
  {
    path: 'memory.hnswM',
    section: 'memory',
    label: 'HNSW M Parameter',
    type: 'number',
    default: 16,
    eli5: 'How many connections each memory point has - more means better search but uses more space.',
    complex: 'HNSW M parameter controlling the number of bi-directional links per node. Higher M improves recall at the cost of memory.'
  },
  {
    path: 'memory.hnswEfConstruction',
    section: 'memory',
    label: 'HNSW EF Construction',
    type: 'number',
    default: 200,
    eli5: 'How carefully the memory index is built - higher means better quality but takes longer to set up.',
    complex: 'HNSW efConstruction parameter controlling index build quality. Higher values produce better indices but increase construction time.'
  },
  {
    path: 'memory.retentionDays',
    section: 'memory',
    label: 'Retention Days',
    type: 'number',
    default: 90,
    eli5: 'How many days to keep memories before they expire.',
    complex: 'Number of days to retain memory entries before automatic expiration and cleanup.'
  },
  {
    path: 'memory.consolidationInterval',
    section: 'memory',
    label: 'Consolidation Interval (Hours)',
    type: 'number',
    default: 24,
    eli5: 'How often (in hours) to organize and clean up memories.',
    complex: 'Hours between automatic memory consolidation runs that merge, deduplicate, and optimize stored entries.'
  },
  {
    path: 'memory.maxSizeMB',
    section: 'memory',
    label: 'Max Size (MB)',
    type: 'number',
    default: 500,
    eli5: 'Maximum storage space for memories in megabytes.',
    complex: 'Maximum memory store size in MB. When exceeded, oldest entries are evicted based on LRU policy.'
  },
  {
    path: 'memory.path',
    section: 'memory',
    label: 'Memory Path',
    type: 'text',
    default: '~/.claude/memory',
    eli5: 'Where on your computer to store the AI\'s memories.',
    complex: 'Filesystem path for memory storage directory. Supports ~ for home directory expansion.'
  },
  {
    path: 'memory.autoConsolidate',
    section: 'memory',
    label: 'Auto Consolidate',
    type: 'toggle',
    default: false,
    eli5: 'Automatically organize and compress memories to save space.',
    complex: 'Enable automatic memory consolidation that periodically merges and optimizes stored memory entries.'
  },

  // ===== MODELS SECTION =====
  {
    path: 'modelTiers.primary.provider',
    section: 'models',
    label: 'Primary Model Provider',
    type: 'select',
    options: ['anthropic', 'openai', 'google', 'cohere', 'ollama'],
    default: 'anthropic',
    eli5: 'Which AI company to use for your main/primary model.',
    complex: 'Primary model tier provider. Determines the API endpoint and available models for primary inference.'
  },
  {
    path: 'modelTiers.primary.model',
    section: 'models',
    label: 'Primary Model',
    type: 'text',
    default: 'claude-sonnet-4-6',
    eli5: 'Which specific AI model to use as your main model.',
    complex: 'Primary model identifier. Must be a valid model ID for the selected provider.'
  },
  {
    path: 'modelTiers.secondary.provider',
    section: 'models',
    label: 'Secondary Model Provider',
    type: 'select',
    options: ['anthropic', 'openai', 'google', 'cohere', 'ollama'],
    default: 'anthropic',
    eli5: 'Which AI company to use as a backup model.',
    complex: 'Secondary model tier provider for fallback or cost-optimized routing.'
  },
  {
    path: 'modelTiers.secondary.model',
    section: 'models',
    label: 'Secondary Model',
    type: 'text',
    default: 'claude-haiku-4-5-20251001',
    eli5: 'Which specific AI model to use as your backup.',
    complex: 'Secondary model identifier for fallback routing.'
  },
  {
    path: 'modelTiers.fallback.provider',
    section: 'models',
    label: 'Fallback Model Provider',
    type: 'select',
    options: ['anthropic', 'openai', 'google', 'cohere', 'ollama'],
    default: 'anthropic',
    eli5: 'Last-resort AI company if the main and backup aren\'t available.',
    complex: 'Fallback model tier provider used when primary and secondary are unavailable or rate-limited.'
  },
  {
    path: 'modelTiers.fallback.model',
    section: 'models',
    label: 'Fallback Model',
    type: 'text',
    default: 'claude-haiku-4-5-20251001',
    eli5: 'Last-resort AI model.',
    complex: 'Fallback model identifier.'
  },
  {
    path: 'modelTiers.routing.strategy',
    section: 'models',
    label: 'Routing Strategy',
    type: 'select',
    options: ['cost', 'performance', 'balanced'],
    default: 'balanced',
    eli5: 'How to choose between models - save money, go fast, or a mix of both.',
    complex: 'Model routing strategy: cost (minimize spend), performance (minimize latency), or balanced (optimize cost-performance ratio).'
  },
  {
    path: 'modelTiers.routing.maxCostPerRequest',
    section: 'models',
    label: 'Max Cost Per Request',
    type: 'number',
    default: 0,
    eli5: 'Maximum amount to spend on a single AI request (0 = no limit).',
    complex: 'Maximum cost in USD per request. Requests exceeding this threshold are routed to cheaper models. 0 disables the limit.'
  },

  // ===== SECURITY SECTION (ADDITIONAL) =====
  {
    path: 'security.cveScanning',
    section: 'security',
    label: 'CVE Scanning',
    type: 'toggle',
    default: false,
    eli5: 'Automatically check your code for known security vulnerabilities.',
    complex: 'Enable automated CVE (Common Vulnerabilities and Exposures) scanning against the NVD database for dependencies and generated code.'
  },
  {
    path: 'security.auditLogging',
    section: 'security',
    label: 'Audit Logging',
    type: 'toggle',
    default: false,
    eli5: 'Keep a log of everything the AI does for security review.',
    complex: 'Enable comprehensive audit logging of all agent actions, tool invocations, and file modifications.'
  },
  {
    path: 'security.auditLogPath',
    section: 'security',
    label: 'Audit Log Path',
    type: 'text',
    default: '~/.claude/audit.log',
    eli5: 'Where to save the security audit log file.',
    complex: 'Filesystem path for audit log output. Supports ~ for home directory. Log format: JSON Lines (JSONL).'
  },
  {
    path: 'security.piiDetection',
    section: 'security',
    label: 'PII Detection',
    type: 'toggle',
    default: false,
    eli5: 'Detect and warn about personal information (names, emails, etc.) in your code.',
    complex: 'Enable PII (Personally Identifiable Information) detection that scans agent outputs for sensitive data patterns (SSN, email, phone, etc.).'
  },
  {
    path: 'security.threatModeling',
    section: 'security',
    label: 'Threat Modeling',
    type: 'toggle',
    default: false,
    eli5: 'Have the AI analyze potential security threats in your project.',
    complex: 'Enable automated threat modeling analysis that identifies STRIDE-category threats in architecture and generated code.'
  },

  // ===== CONTEXT SECTION =====
  {
    path: 'contextAutopilot.enabled',
    section: 'context',
    label: 'Context Autopilot Enabled',
    type: 'toggle',
    default: false,
    eli5: 'Automatically manage conversation length so Claude doesn\'t forget things.',
    complex: 'Enable context autopilot that automatically manages context window utilization including auto-compaction.'
  },
  {
    path: 'contextAutopilot.compactThreshold',
    section: 'context',
    label: 'Compact Threshold (%)',
    type: 'number',
    default: 80,
    eli5: 'How full the conversation can get (percentage) before automatic cleanup.',
    complex: 'Context utilization percentage threshold (50-95) that triggers automatic compaction. Lower values compact more aggressively.'
  },
  {
    path: 'contextAutopilot.strategy',
    section: 'context',
    label: 'Compaction Strategy',
    type: 'select',
    options: ['aggressive', 'balanced', 'conservative'],
    default: 'balanced',
    eli5: 'How aggressively to compress old conversation - aggressive saves space, conservative keeps more detail.',
    complex: 'Compaction strategy: aggressive (heavy summarization, max space), balanced (moderate), conservative (minimal loss, less space savings).'
  },

  // ===== VERIFICATION SECTION =====
  {
    path: 'verification.enabled',
    section: 'verification',
    label: 'Verification Enabled',
    type: 'toggle',
    default: false,
    eli5: 'Makes Claude double-check its work before giving you answers.',
    complex: 'Enable the verification system that validates agent outputs against truth scoring criteria.'
  },
  {
    path: 'verification.truthThreshold',
    section: 'verification',
    label: 'Truth Threshold',
    type: 'number',
    default: 0.7,
    eli5: 'How confident the AI needs to be before accepting its own answer (0-1, higher = stricter).',
    complex: 'Minimum truth score (0.0-1.0) required for verification pass. Outputs below this threshold trigger re-evaluation.'
  },
  {
    path: 'verification.environment',
    section: 'verification',
    label: 'Verification Environment',
    type: 'select',
    options: ['development', 'staging', 'production'],
    default: 'development',
    eli5: 'Which environment you\'re working in - production is strictest.',
    complex: 'Verification environment that determines threshold adjustments: development (relaxed), staging (moderate), production (strict).'
  },

  // ===== TEMPLATES SECTION =====
  {
    path: 'claudemd.templatePath',
    section: 'templates',
    label: 'CLAUDE.md Template Path',
    type: 'text',
    default: '',
    eli5: 'Path to a custom CLAUDE.md template file for your project.',
    complex: 'Filesystem path to a custom CLAUDE.md template. When set, this template is used as the base for project-level agent instructions.'
  },
  {
    path: 'claudemd.autoGenerate',
    section: 'templates',
    label: 'Auto Generate CLAUDE.md',
    type: 'toggle',
    default: false,
    eli5: 'Automatically create a CLAUDE.md file for new projects.',
    complex: 'Enable automatic CLAUDE.md generation when initializing Claude Code in a new project directory.'
  },

  // ===== DIAGNOSTICS SECTION =====
  {
    path: 'diagnostics.verboseLogging',
    section: 'diagnostics',
    label: 'Verbose Logging',
    type: 'toggle',
    default: false,
    eli5: 'Show detailed logs for debugging when things go wrong.',
    complex: 'Enable verbose logging output for troubleshooting. Increases log verbosity across all subsystems.'
  },
  {
    path: 'diagnostics.healthCheckInterval',
    section: 'diagnostics',
    label: 'Health Check Interval (Seconds)',
    type: 'number',
    default: 60,
    eli5: 'How often (in seconds) to check if everything is working.',
    complex: 'Interval in seconds between automated health check probes for configured providers and MCP servers.'
  },

  // ===== ENVIRONMENT SECTION (ADDITIONAL) =====
  {
    path: 'env.CLAUDE_FLOW_HOOKS_ENABLED',
    section: 'environment',
    label: 'Claude Flow Hooks Enabled',
    type: 'text',
    default: '0',
    eli5: 'Set to "1" to enable workflow hooks for automating tasks.',
    complex: 'Set to "1" to enable claude-flow hooks system for pre/post task automation.'
  },
  {
    path: 'env.CLAUDE_FLOW_MEMORY_BACKEND',
    section: 'environment',
    label: 'Claude Flow Memory Backend',
    type: 'text',
    default: '',
    eli5: 'Override which memory storage system to use.',
    complex: 'Override memory backend selection. Values: "sqlite", "json", "memory". Empty uses default.'
  },
  {
    path: 'env.CLAUDE_FLOW_MEMORY_PATH',
    section: 'environment',
    label: 'Claude Flow Memory Path',
    type: 'text',
    default: '',
    eli5: 'Override where memories are stored on disk.',
    complex: 'Override memory storage path. Empty uses default (~/.claude/memory).'
  },
  {
    path: 'env.PROMPT_CACHING_ENABLED',
    section: 'environment',
    label: 'Prompt Caching Enabled',
    type: 'text',
    default: '1',
    eli5: 'Set to "1" to enable prompt caching for faster, cheaper responses.',
    complex: 'Set to "1" to enable prompt caching. Caches repeated prompt prefixes to reduce latency and cost.'
  },
  {
    path: 'env.CLAUDE_CODE_MAX_TURNS',
    section: 'environment',
    label: 'Max Turns Per Session',
    type: 'text',
    default: '',
    eli5: 'Maximum number of back-and-forth exchanges per session.',
    complex: 'Maximum agentic turns per session. Empty uses default. Higher values allow longer autonomous operation.'
  },
  {
    path: 'env.CLAUDE_FLOW_SWARM_TOPOLOGY',
    section: 'environment',
    label: 'Swarm Topology Override',
    type: 'text',
    default: '',
    eli5: 'Override the agent team organization pattern.',
    complex: 'Override swarm topology. Values: "hierarchical", "mesh", "ring", "star", "hybrid", "adaptive".'
  },
  {
    path: 'env.CLAUDE_FLOW_MAX_AGENTS',
    section: 'environment',
    label: 'Max Agents Override',
    type: 'text',
    default: '',
    eli5: 'Override the maximum number of AI agents.',
    complex: 'Override maximum concurrent agents. Empty uses default (20).'
  },
  {
    path: 'env.OLLAMA_HOST',
    section: 'environment',
    label: 'Ollama Host URL',
    type: 'text',
    default: '',
    eli5: 'URL for your local Ollama AI server (if using local models).',
    complex: 'Ollama server URL for local model inference. Example: "http://localhost:11434".'
  },
  {
    path: 'env.OPENAI_API_KEY',
    section: 'environment',
    label: 'OpenAI API Key',
    type: 'text',
    default: '',
    eli5: 'Your OpenAI API key for using GPT models.',
    complex: 'OpenAI API authentication key. Required when using OpenAI models as primary/secondary/fallback.'
  },
  {
    path: 'env.GOOGLE_AI_API_KEY',
    section: 'environment',
    label: 'Google AI API Key',
    type: 'text',
    default: '',
    eli5: 'Your Google AI API key for using Gemini models.',
    complex: 'Google AI (Gemini) API key. Required when using Google models as primary/secondary/fallback.'
  },
  {
    path: 'env.MAX_THINKING_TOKENS',
    section: 'environment',
    label: 'Max Thinking Tokens',
    type: 'text',
    default: '',
    eli5: 'How many tokens the AI can use for "thinking" before responding.',
    complex: 'Maximum tokens allocated for extended thinking/reasoning. Higher values allow deeper analysis at increased cost.'
  }
];

export { SETTINGS_META };

export function getSettingMeta(path) {
  return SETTINGS_META.find(setting => setting.path === path) || null;
}

export function getSettingsBySection(section) {
  return SETTINGS_META.filter(setting => setting.section === section);
}

export function getSections() {
  const sections = new Set();
  SETTINGS_META.forEach(setting => {
    sections.add(setting.section);
  });
  return Array.from(sections).sort();
}
