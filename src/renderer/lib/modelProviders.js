// Model provider configurations for multi-provider model tier routing

export const PROVIDERS = {
  anthropic: {
    name: 'Anthropic',
    envKeyName: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-sonnet-4-6',
    models: [
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', tier: 'genius', eli5: 'The smartest AI model for really hard thinking tasks.', complex: 'Highest-capability model optimized for multi-step reasoning and complex problem decomposition.' },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', tier: 'smart', eli5: 'Smart AI model great for regular coding work.', complex: 'Balanced capability-to-cost ratio model suitable for code generation and moderate complexity tasks.' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', tier: 'fast', eli5: 'Fast and cheap AI model for simple tasks.', complex: 'High-throughput, low-latency model optimized for simple code generation and formatting.' },
    ],
  },
  openai: {
    name: 'OpenAI',
    envKeyName: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', tier: 'genius', eli5: 'OpenAI\'s most capable multimodal model.', complex: 'GPT-4o multimodal model with vision, audio, and text capabilities. High reasoning quality.' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', tier: 'smart', eli5: 'Fast version of GPT-4 with large context.', complex: 'GPT-4 Turbo with 128k context window and improved instruction following.' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', tier: 'fast', eli5: 'Quick and affordable OpenAI model.', complex: 'Cost-effective model suitable for simpler tasks with fast response times.' },
    ],
  },
  google: {
    name: 'Google',
    envKeyName: 'GOOGLE_AI_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    models: [
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', tier: 'genius', eli5: 'Google\'s most powerful AI model.', complex: 'Gemini 2.0 Pro with advanced reasoning, long context, and multimodal capabilities.' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tier: 'smart', eli5: 'Google\'s balanced AI model with huge context window.', complex: 'Gemini 1.5 Pro with 1M token context window and strong reasoning.' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tier: 'fast', eli5: 'Google\'s fastest AI model.', complex: 'Gemini 2.0 Flash optimized for speed and cost-efficiency.' },
    ],
  },
  cohere: {
    name: 'Cohere',
    envKeyName: 'COHERE_API_KEY',
    defaultModel: 'command-r-plus',
    models: [
      { id: 'command-r-plus', name: 'Command R+', tier: 'genius', eli5: 'Cohere\'s most capable model for complex tasks.', complex: 'Command R+ with advanced RAG capabilities and multilingual support.' },
      { id: 'command-r', name: 'Command R', tier: 'smart', eli5: 'Cohere\'s balanced model.', complex: 'Command R optimized for RAG and tool use with good performance-to-cost ratio.' },
    ],
  },
  ollama: {
    name: 'Ollama (Local)',
    envKeyName: 'OLLAMA_HOST',
    defaultModel: 'llama3',
    models: [
      { id: 'llama3', name: 'Llama 3', tier: 'smart', eli5: 'Run AI locally on your computer - free but needs good hardware.', complex: 'Meta Llama 3 running locally via Ollama. No API costs, requires local GPU.' },
      { id: 'codellama', name: 'Code Llama', tier: 'smart', eli5: 'Local AI specialized for coding tasks.', complex: 'Meta Code Llama fine-tuned for code generation, running locally via Ollama.' },
      { id: 'mistral', name: 'Mistral', tier: 'fast', eli5: 'Fast local AI model.', complex: 'Mistral 7B running locally via Ollama. Efficient inference on consumer hardware.' },
    ],
  },
};

export const MODEL_TIERS = {
  primary: {
    label: 'Primary',
    eli5: 'The main AI model used for most tasks.',
    complex: 'Primary inference tier. Used for all standard code generation, analysis, and reasoning tasks.',
  },
  secondary: {
    label: 'Secondary',
    eli5: 'Backup model used when the main one is busy or for simpler tasks.',
    complex: 'Secondary tier for fallback routing, cost optimization, or delegated subtasks.',
  },
  fallback: {
    label: 'Fallback',
    eli5: 'Last resort model if the others aren\'t available.',
    complex: 'Fallback tier activated when primary and secondary models are unavailable or rate-limited.',
  },
};

export function getModelsForProvider(providerId) {
  const provider = PROVIDERS[providerId];
  return provider ? provider.models : [];
}

export function getProviderEnvKey(providerId) {
  const provider = PROVIDERS[providerId];
  return provider ? provider.envKeyName : null;
}

export function getProviderList() {
  return Object.entries(PROVIDERS).map(([id, p]) => ({ id, name: p.name }));
}
