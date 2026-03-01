export const MODEL_TIERS = [
  {
    id: 'genius',
    name: 'Genius Tier',
    icon: '🧠',
    description: 'Most capable models for complex reasoning tasks',
    eli5: 'The smartest AI models for really hard thinking tasks like planning big projects and making important decisions.',
    complex: 'Highest-capability models optimized for multi-step reasoning, architectural design, and complex problem decomposition. Highest cost per token but best quality for critical tasks.',
    models: [
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic', costPerMToken: 15.0 },
      { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', costPerMToken: 30.0 },
      { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google', costPerMToken: 20.0 },
    ],
    useCases: ['Architecture planning', 'Complex debugging', 'Security analysis', 'Code review', 'System design'],
    costLevel: 4,
    speedLevel: 2,
    settingsKey: 'modelRouting.planningModel',
  },
  {
    id: 'smart',
    name: 'Smart Tier',
    icon: '⚡',
    description: 'Balanced models for everyday development tasks',
    eli5: 'Smart AI models that are great for regular coding work - fast enough and smart enough for most things.',
    complex: 'Balanced capability-to-cost ratio models suitable for code generation, refactoring, and moderate complexity tasks. Good balance of quality and throughput.',
    models: [
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', costPerMToken: 3.0 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', costPerMToken: 10.0 },
      { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', costPerMToken: 3.5 },
    ],
    useCases: ['Code generation', 'Bug fixing', 'Refactoring', 'Documentation', 'Testing'],
    costLevel: 3,
    speedLevel: 3,
    settingsKey: 'modelRouting.codingModel',
  },
  {
    id: 'fast',
    name: 'Fast Tier',
    icon: '🚀',
    description: 'Quick and cheap models for simple, repetitive tasks',
    eli5: 'Fast and cheap AI models for simple stuff like writing boilerplate code and formatting.',
    complex: 'High-throughput, low-latency models optimized for simple code generation, boilerplate creation, and formatting tasks. Minimal cost per operation.',
    models: [
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', costPerMToken: 0.25 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', costPerMToken: 0.5 },
      { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', costPerMToken: 0.35 },
    ],
    useCases: ['Boilerplate generation', 'Code formatting', 'Simple edits', 'Autocomplete', 'File operations'],
    costLevel: 1,
    speedLevel: 5,
    settingsKey: 'modelRouting.boilerplateModel',
  },
  {
    id: 'local',
    name: 'Local Tier',
    icon: '🏠',
    description: 'Local models for offline and privacy-sensitive work',
    eli5: 'AI models that run on your own computer - no internet needed and your data stays private.',
    complex: 'Locally-hosted open-source models via Ollama for air-gapped environments, sensitive data handling, and zero-latency inference without external API dependencies.',
    models: [
      { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta/Ollama', costPerMToken: 0 },
      { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral/Ollama', costPerMToken: 0 },
      { id: 'codellama-34b', name: 'Code Llama 34B', provider: 'Meta/Ollama', costPerMToken: 0 },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek/Ollama', costPerMToken: 0 },
    ],
    useCases: ['Offline development', 'Private/sensitive code', 'Air-gapped environments', 'Cost-free operation'],
    costLevel: 0,
    speedLevel: 3,
    settingsKey: 'modelRouting.localModel',
  },
];

export function getModelTierById(id) {
  return MODEL_TIERS.find(t => t.id === id);
}

export function getAllModels() {
  return MODEL_TIERS.flatMap(tier => tier.models.map(m => ({ ...m, tier: tier.id, tierName: tier.name })));
}
