export const GUIDES = [
  // Getting Started Category
  {
    id: 'getting-started-ruflo',
    title: 'Getting Started with RUFLO',
    category: 'Getting Started',
    icon: '🚀',
    eli5: 'How to install and start using RUFLO with Claude Code.',
    complex: 'Initial setup and first-run walkthrough for RUFLO agent framework with Claude Code integration.',
    steps: [
      { title: 'Install RUFLO', eli5: 'Download and install RUFLO in your project.', complex: 'Run `npx ruflo@latest init` in your project directory. This initializes ruflo with agent persistence, vector search, and swarm capabilities.' },
      { title: 'Set Up Your Workspace', eli5: 'Create the folders and files RUFLO needs.', complex: 'RUFLO creates .claude/config, .claude/memory, and .claude/agents directories. Initialize your CLAUDE.md with project conventions.' },
      { title: 'Test a Simple Task', eli5: 'Ask Claude Code to do something small first.', complex: 'Start with simple requests to verify agent tools are working, then progress to more complex multi-step tasks using plan mode.' },
      { title: 'Review the CLAUDE.md', eli5: 'Check the project instructions file.', complex: 'Review and customize CLAUDE.md with your project-specific conventions, architectural decisions, and coding standards.' },
    ],
  },
  {
    id: 'configuring-first-agent',
    title: 'Configuring Your First Agent',
    category: 'Getting Started',
    icon: '🤖',
    eli5: 'How to set up and configure an AI agent for your project.',
    complex: 'Agent configuration, tool permissions, and capability customization.',
    steps: [
      { title: 'Choose an Agent Type', eli5: 'Pick what kind of work the agent will do.', complex: 'Select from general-purpose, code-review, security-review, plan, bash, or explore agents. Each has different tool access patterns.' },
      { title: 'Set Tool Permissions', eli5: 'Decide which tools the agent can use.', complex: 'Configure in settings.json with permissions.allow and permissions.deny. Specify tools like "bash", "git-*", "npm", etc.' },
      { title: 'Configure Model & Cost', eli5: 'Choose the AI model and set spending limits.', complex: 'Set model (Opus/Sonnet/Haiku), maxTokens, temperature, and topP. Configure cost tracking if using cloud providers.' },
      { title: 'Test the Configuration', eli5: 'Run a test task to verify everything works.', complex: 'Execute a simple task to verify tool access, API connectivity, and configuration correctness.' },
    ],
  },
  // Configuration Category
  {
    id: 'setting-up-hooks',
    title: 'Setting Up Hooks',
    category: 'Configuration',
    icon: '🪝',
    eli5: 'How to run your own scripts when agents take actions.',
    complex: 'Hook system configuration for validation, monitoring, and custom workflows.',
    steps: [
      { title: 'Understand Hook Types', eli5: 'Learn the different hooks available.', complex: 'PreToolUse (before tool execution), PostToolUse (after execution), Notification (alerts), Stop (cleanup). Hooks can block operations.' },
      { title: 'Create a Hook Script', eli5: 'Write a script that runs when actions happen.', complex: 'Create bash or Node.js scripts in .claude/hooks/. Hooks receive JSON input and can return blocking status codes.' },
      { title: 'Configure Hooks in Settings', eli5: 'Tell RUFLO about your hook scripts.', complex: 'Add hook configuration to settings.json with path, events to trigger on, and timeout settings.' },
      { title: 'Test Hook Execution', eli5: 'Make sure your hooks work correctly.', complex: 'Trigger tool execution and verify hooks run, receive correct data, and return expected responses.' },
    ],
  },
  {
    id: 'managing-permissions',
    title: 'Managing Permissions',
    category: 'Configuration',
    icon: '🔐',
    eli5: 'How to control what agents are allowed to do.',
    complex: 'Fine-grained permission system with tool-level access control.',
    steps: [
      { title: 'Understand Permission Levels', eli5: 'Learn the different permission types.', complex: 'Permissions control tool access at multiple levels: allow specific tools, deny dangerous operations (rm, force-push), require confirmation.' },
      { title: 'Set Default Permissions', eli5: 'Configure what agents can do by default.', complex: 'In settings.json, set permissions.allow for safe tools (read, list, test) and permissions.deny for risky ones (delete, destructive git, system).' },
      { title: 'Create Role-Based Rules', eli5: 'Different agents get different permissions.', complex: 'Define permission sets per agent type or role. Security reviewers need different access than code reviewers.' },
      { title: 'Monitor Permission Usage', eli5: 'Check what agents are actually using.', complex: 'Review audit logs to verify agents only use approved tools and follow permission boundaries.' },
    ],
  },
  {
    id: 'installing-addons',
    title: 'Installing Add-ons',
    category: 'Configuration',
    icon: '⚙️',
    eli5: 'How to add extra features and capabilities.',
    complex: 'Add-on ecosystem for extending RUFLO with specialized functionality.',
    steps: [
      { title: 'Browse Available Add-ons', eli5: 'See what add-ons are available.', complex: 'Check ruflo registry for add-ons: Token Optimizer, Prompt Caching, Security Scanner, Memory Backend, Model Router, etc.' },
      { title: 'Install an Add-on', eli5: 'Install a new add-on for your project.', complex: 'Run `npx ruflo addon install <addon-name>` or add to addons array in settings.json. Some require additional configuration.' },
      { title: 'Configure Add-on Settings', eli5: 'Customize the add-on behavior.', complex: 'Each add-on has configuration in settings.json. Example: Token Optimizer needs model.maxTokens and costLimits configured.' },
      { title: 'Verify Add-on Works', eli5: 'Test that the add-on is functioning.', complex: 'Run diagnostic commands or test tasks that exercise the add-on functionality. Check logs for initialization messages.' },
    ],
  },
  // Advanced Category
  {
    id: 'using-swarm-mode',
    title: 'Using Swarm Mode',
    category: 'Advanced',
    icon: '🐝',
    eli5: 'How to use multiple agents working together on big projects.',
    complex: 'Multi-agent orchestration with task distribution, synchronization, and team coordination.',
    steps: [
      { title: 'Create a Team', eli5: 'Set up multiple agents as a team.', complex: 'Use TaskCreate with team_name parameter. Configure team topology (star/mesh/hierarchical) and max agent count in settings.' },
      { title: 'Break Down Tasks', eli5: 'Split big projects into smaller tasks.', complex: 'Create task dependency graph with TaskCreate, set blockedBy/blocks relationships. Assign ownership for load balancing.' },
      { title: 'Spawn Agent Workers', eli5: 'Start agents to work on the tasks.', complex: 'Use subagent_type parameter with specialized types: Explore (research), Plan (design), code-reviewer (quality), security-reviewer, etc.' },
      { title: 'Monitor Team Progress', eli5: 'Watch the agents work and coordinate.', complex: 'Use TaskList to track status, TaskUpdate to reassign work, and SendMessage for inter-agent communication.' },
    ],
  },
  {
    id: 'memory-backend-setup',
    title: 'Memory Backend Setup',
    category: 'Advanced',
    icon: '💾',
    eli5: 'How to set up persistent memory so agents remember things.',
    complex: 'Configuring memory backends: file-based, vector DB, and semantic search.',
    steps: [
      { title: 'Choose Memory Backend', eli5: 'Pick where to store memories.', complex: 'Options: file (MEMORY.md in .claude/projects), PostgreSQL, Pinecone, Weaviate, or Qdrant for vector storage.' },
      { title: 'Configure Backend Connection', eli5: 'Connect to your chosen storage.', complex: 'In settings.json memory section: set backend type, connection string, database credentials, and embedding model.' },
      { title: 'Enable Vector Search', eli5: 'Set up semantic memory search.', complex: 'Enable vectorSearch with HNSW algorithm. Configure embedding model (e.g., text-embedding-3-small) and vector dimensions.' },
      { title: 'Test Memory Persistence', eli5: 'Verify memories are being saved.', complex: 'Create test data, verify it persists across sessions, test vector search returns semantically relevant results.' },
    ],
  },
  {
    id: 'security-configuration',
    title: 'Security Configuration',
    category: 'Advanced',
    icon: '🛡️',
    eli5: 'How to set up security features and keep your project safe.',
    complex: 'Comprehensive security setup including scanning, audit logging, and threat detection.',
    steps: [
      { title: 'Enable Audit Logging', eli5: 'Record everything agents do.', complex: 'Configure auditLog in settings: enable logging, set retention period, specify log output (file, syslog, cloud).' },
      { title: 'Set Up Scanning', eli5: 'Automatically check for security issues.', complex: 'Enable security.scanning with CVE detection, threat modeling, and code analysis. Set scan triggers and report formats.' },
      { title: 'Configure Sandboxing', eli5: 'Isolate agent execution for safety.', complex: 'Set execution.sandbox to "docker", "vm", or "process". Configure resource limits: memory, CPU, file access.' },
      { title: 'Review Security Events', eli5: 'Monitor security alerts and incidents.', complex: 'Check audit logs regularly for anomalies. Set up notifications for critical events. Review threat reports from scanning.' },
    ],
  },
  // Troubleshooting Category
  {
    id: 'environment-variables',
    title: 'Environment Variables',
    category: 'Troubleshooting',
    icon: '📋',
    eli5: 'How to set up and manage configuration through environment variables.',
    complex: 'Environment variable management for API keys, endpoints, and runtime configuration.',
    steps: [
      { title: 'Identify Required Variables', eli5: 'Know which environment variables you need.', complex: 'Essential: ANTHROPIC_API_KEY, optional: AWS keys (for Bedrock), Google keys (for Vertex), custom MCP server vars.' },
      { title: 'Create .env File', eli5: 'Store your configuration in a .env file.', complex: 'Create .env in project root with KEY=value pairs. Load with dotenv in Node, or use `source .env` in bash. Add to .gitignore.' },
      { title: 'Override in Settings.json', eli5: 'Use environment variables in your config.', complex: 'Reference env vars in settings.json: `$ANTHROPIC_API_KEY` or `process.env.CUSTOM_VAR`. Support interpolation and defaults.' },
      { title: 'Verify Configuration', eli5: 'Test that variables are loaded correctly.', complex: 'Run `echo $ANTHROPIC_API_KEY` to verify. Check Claude Code can access them. Test API connectivity with sample request.' },
    ],
  },
  {
    id: 'using-skills-commands',
    title: 'Using Skills & Commands',
    category: 'Troubleshooting',
    icon: '⚡',
    eli5: 'How to use slash commands for specific specialized tasks.',
    complex: 'Skill-based workflows and command invocation for specialized agent behaviors.',
    steps: [
      { title: 'Learn Available Skills', eli5: 'See what commands you can use.', complex: 'Available skills: /commit (git workflows), /pr (pull requests), /tdd (test-driven dev), /plan (upfront design), /verify (testing), /review (code review), /orchestrate (multi-agent).' },
      { title: 'Invoke a Skill', eli5: 'Use a command to trigger a skill.', complex: 'Type / followed by skill name. Some skills accept arguments: `/commit -m "message"`, `/pr --title "PR Title"`. Skills guide execution flow.' },
      { title: 'Understand Skill Workflows', eli5: 'Know what each skill does.', complex: '/commit runs linting, testing, and creates structured commits. /plan explores codebase and designs solutions before implementation.' },
      { title: 'Create Custom Skills', eli5: 'Build your own specialized commands.', complex: 'Define in CLAUDE.md under skills section. Each skill has prompt template, tool access rules, and output format expectations.' },
    ],
  },
  {
    id: 'switching-modes',
    title: 'Switching Modes',
    category: 'Troubleshooting',
    icon: '🔄',
    eli5: 'How to change between different agent modes and behaviors.',
    complex: 'Mode switching for different task types: interactive, batch, plan, autonomous.',
    steps: [
      { title: 'Understand Mode Types', eli5: 'Learn the different modes available.', complex: 'Interactive (user approval for each step), Batch (run all steps then ask), Plan (design phase, approve before code), Autonomous (full auto, trust-based).' },
      { title: 'Switch to Plan Mode', eli5: 'Enter planning mode for big tasks.', complex: 'Type `/plan` or set planMode: true in task. Agent explores codebase, proposes design, waits for approval before implementation.' },
      { title: 'Use Batch Mode', eli5: 'Run multiple steps then review.', complex: 'In settings, set execution.mode: "batch". Agent executes all planned steps, then presents summary for approval before committing.' },
      { title: 'Configure Mode Defaults', eli5: 'Set your preferred default mode.', complex: 'In settings.json, set execution.defaultMode. Different task types can have different defaults. Override per task as needed.' },
    ],
  },
  {
    id: 'troubleshooting-common-issues',
    title: 'Troubleshooting Common Issues',
    category: 'Troubleshooting',
    icon: '🔧',
    eli5: 'How to fix problems when things go wrong.',
    complex: 'Debugging techniques and solutions for common RUFLO and Claude Code issues.',
    steps: [
      { title: 'Check API Connectivity', eli5: 'Make sure your API key works.', complex: 'Test: `curl https://api.anthropic.com/v1/messages -H "x-api-key: $ANTHROPIC_API_KEY"`. Check API quota and rate limits.' },
      { title: 'Review Logs', eli5: 'Look at what happened in the logs.', complex: 'Check .claude/logs/ for agent execution logs. Set DEBUG=ruflo:* for verbose output. Search for error messages and stack traces.' },
      { title: 'Validate Configuration', eli5: 'Make sure settings are correct.', complex: 'Validate settings.json syntax (JSON format). Check file paths exist. Verify permissions on sensitive files. Test individual settings.' },
      { title: 'Reset and Reinitialize', eli5: 'Start fresh if something is broken.', complex: 'Backup .claude/ directory. Run `npx ruflo@latest init --reset`. Restore custom settings and scripts from backup.' },
    ],
  },
];

export function getGuideById(id) {
  return GUIDES.find(g => g.id === id);
}

export function getGuidesByCategory(category) {
  return GUIDES.filter(g => g.category === category);
}

export const GUIDE_CATEGORIES = ['Getting Started', 'Configuration', 'Advanced', 'Troubleshooting'];

export const GUIDE_SECTIONS = GUIDES.map(g => ({ id: g.id, title: g.title, icon: g.icon, category: g.category }));
