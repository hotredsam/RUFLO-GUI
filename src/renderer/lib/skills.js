// Skills/slash commands for Claude Code

export const SKILLS = [
  // Git Skills
  {
    id: 'commit',
    name: '/commit',
    description: 'Create a git commit with AI-generated message',
    eli5: 'Let the AI write your commit message for you based on what you changed.',
    complex: 'Analyzes staged git changes using git diff, generates conventional commit messages following repository patterns and commit history, and executes the commit with proper formatting.',
    category: 'Git',
    icon: '📝',
  },
  {
    id: 'pr',
    name: '/pr',
    description: 'Create a pull request with AI-generated description',
    eli5: 'Have the AI automatically create a pull request on GitHub with a great description.',
    complex: 'Analyzes branch diffs against base branch, generates PR titles and descriptions summarizing changes, includes test plan sections, and creates the PR using GitHub API with automated reviewer suggestions.',
    category: 'Git',
    icon: '🔀',
  },
  {
    id: 'review-pr',
    name: '/review-pr',
    description: 'Review a pull request and provide detailed feedback',
    eli5: 'Have the AI read through a pull request and give helpful comments.',
    complex: 'Fetches PR diffs and context, performs static analysis for code quality patterns, security issues, and best practices, generates line-by-line comments with specific suggestions, and posts comprehensive reviews to GitHub.',
    category: 'Git',
    icon: '👀',
  },

  // Code Quality Skills
  {
    id: 'tdd',
    name: '/tdd',
    description: 'Test-driven development workflow',
    eli5: 'Write tests first, then code that passes the tests.',
    complex: 'Guides TDD workflow: generates test cases based on requirements, scaffolds test files, implements features to pass tests, refactors while maintaining test coverage, and validates with continuous testing.',
    category: 'Code Quality',
    icon: '🧪',
  },
  {
    id: 'code-review',
    name: '/code-review',
    description: 'Comprehensive code review with feedback',
    eli5: 'Get detailed feedback on your code to make it better.',
    complex: 'Analyzes code for readability, performance, security, and maintainability, identifies anti-patterns and improvements, provides specific refactoring suggestions, and generates review comments with examples.',
    category: 'Code Quality',
    icon: '📋',
  },
  {
    id: 'refactor-clean',
    name: '/refactor-clean',
    description: 'Refactor code for clarity and maintainability',
    eli5: 'Clean up messy code to make it easier to read and understand.',
    complex: 'Applies SOLID principles and design patterns, extracts functions and classes, simplifies complex logic, improves naming and structure, maintains test coverage throughout refactoring.',
    category: 'Code Quality',
    icon: '✨',
  },

  // Analysis Skills
  {
    id: 'plan',
    name: '/plan',
    description: 'Create an implementation plan',
    eli5: 'Get a step-by-step breakdown of how to build something.',
    complex: 'Analyzes requirements, decomposes into tasks, estimates complexity, identifies dependencies, suggests architecture patterns, and creates detailed task lists with acceptance criteria.',
    category: 'Analysis',
    icon: '📐',
  },
  {
    id: 'verify',
    name: '/verify',
    description: 'Run verification loops and validate implementation',
    eli5: 'Check that your code works and solves the problem correctly.',
    complex: 'Executes automated tests, validates outputs against specifications, performs integration testing, checks performance baselines, and generates verification reports with test coverage metrics.',
    category: 'Analysis',
    icon: '✅',
  },
  {
    id: 'eval',
    name: '/eval',
    description: 'Evaluate code quality and architecture',
    eli5: 'Rate how good your code is and give suggestions to improve it.',
    complex: 'Performs static analysis, calculates complexity metrics, evaluates architecture decisions, assesses test coverage, identifies technical debt, and provides improvement prioritization.',
    category: 'Analysis',
    icon: '📊',
  },

  // Documentation Skills
  {
    id: 'update-docs',
    name: '/update-docs',
    description: 'Generate and update documentation',
    eli5: 'Have the AI write documentation for your code automatically.',
    complex: 'Extracts function signatures and behavior, generates docstrings following standards, creates API documentation, maintains README files, updates architecture diagrams, and ensures docs stay in sync with code.',
    category: 'Documentation',
    icon: '📚',
  },
  {
    id: 'update-codemaps',
    name: '/update-codemaps',
    description: 'Generate code maps and architecture diagrams',
    eli5: 'Create visual maps showing how your code is organized.',
    complex: 'Analyzes codebase structure, generates dependency graphs, creates architecture diagrams, identifies module relationships, generates code tree maps, exports in multiple formats (ASCII, SVG, Mermaid).',
    category: 'Documentation',
    icon: '🗺️',
  },

  // DevOps Skills
  {
    id: 'build-fix',
    name: '/build-fix',
    description: 'Diagnose and fix build errors',
    eli5: 'Automatically find and fix errors that prevent your code from building.',
    complex: 'Parses build logs, identifies root causes, suggests fixes, applies patches, re-runs builds to validate, and documents resolution steps with explanations.',
    category: 'DevOps',
    icon: '🔧',
  },
  {
    id: 'e2e',
    name: '/e2e',
    description: 'Generate and run end-to-end tests',
    eli5: 'Create tests that check if your whole app works from start to finish.',
    complex: 'Scaffolds E2E test files using frameworks like Cypress/Playwright, simulates user workflows, generates test cases covering happy paths and error scenarios, and provides test coverage reports.',
    category: 'DevOps',
    icon: '🎬',
  },
  {
    id: 'test-coverage',
    name: '/test-coverage',
    description: 'Analyze and improve test coverage',
    eli5: 'Find parts of your code that don\'t have tests and add tests for them.',
    complex: 'Generates coverage reports, identifies untested code paths, suggests test cases for gaps, implements missing tests, and tracks coverage trends over time.',
    category: 'DevOps',
    icon: '📈',
  },

  // Security Skills
  {
    id: 'security-scan',
    name: '/security-scan',
    description: 'Scan code for security vulnerabilities',
    eli5: 'Check your code for security problems that hackers could use.',
    complex: 'Performs SAST analysis, checks for OWASP Top 10 vulnerabilities, identifies insecure dependencies, detects secrets in code, and generates detailed security reports with remediation guidance.',
    category: 'Security',
    icon: '🔍',
  },
  {
    id: 'security-review',
    name: '/security-review',
    description: 'Conduct comprehensive security review',
    eli5: 'Have an expert review your code for security best practices.',
    complex: 'Analyzes authentication, authorization, data handling, encryption, input validation, performs threat modeling, identifies security patterns and anti-patterns, provides hardening recommendations.',
    category: 'Security',
    icon: '🛡️',
  },

  // Workflow Skills
  {
    id: 'orchestrate',
    name: '/orchestrate',
    description: 'Orchestrate multi-step tasks and workflows',
    eli5: 'Coordinate multiple actions to complete a big task automatically.',
    complex: 'Chains multiple operations, manages state between steps, handles dependencies, implements retry logic, coordinates parallel tasks, and provides workflow execution reports.',
    category: 'Workflow',
    icon: '🎼',
  },
  {
    id: 'checkpoint',
    name: '/checkpoint',
    description: 'Create and restore work checkpoints',
    eli5: 'Save your progress so you can go back to it later if needed.',
    complex: 'Creates snapshots of workspace state, tracks file changes, manages checkpoint history, enables rollback to previous states, and provides checkpoint management and comparison tools.',
    category: 'Workflow',
    icon: '💾',
  },
  {
    id: 'sessions',
    name: '/sessions',
    description: 'Manage multiple work sessions and contexts',
    eli5: 'Switch between different projects and keep track of what you were doing.',
    complex: 'Manages multiple session contexts, preserves conversation history, handles context switching, stores session metadata, enables session resumption, and provides session analytics.',
    category: 'Workflow',
    icon: '📑',
  },
];

export function getSkillsByCategory(category) {
  return SKILLS.filter(skill => skill.category === category);
}

export function getSkillById(id) {
  return SKILLS.find(skill => skill.id === id);
}
