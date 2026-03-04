// Real Claude model options for the model setting
export const CLAUDE_MODELS = [
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    tier: 'smart',
    eli5: 'Smart AI model that is great for regular coding work - fast enough and smart enough for most things.',
    complex: 'Balanced capability-to-cost ratio model suitable for code generation, refactoring, and moderate complexity tasks. Good balance of quality and throughput.',
  },
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    tier: 'genius',
    eli5: 'The smartest AI model for really hard thinking tasks like planning big projects and making important decisions.',
    complex: 'Highest-capability model optimized for multi-step reasoning, architectural design, and complex problem decomposition. Highest cost per token but best quality for critical tasks.',
  },
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    tier: 'fast',
    eli5: 'Fast and cheap AI model for simple stuff like writing boilerplate code and formatting.',
    complex: 'High-throughput, low-latency model optimized for simple code generation, boilerplate creation, and formatting tasks. Minimal cost per operation.',
  },
];

// Settings key is just 'model' - a single string value
export const MODEL_SETTINGS_KEY = 'model';

/**
 * Get a Claude model by its ID
 * @param {string} modelId - The model ID (e.g., 'claude-opus-4-6')
 * @returns {object|undefined} The model object or undefined if not found
 */
export function getModelById(modelId) {
  return CLAUDE_MODELS.find(m => m.id === modelId);
}

/**
 * Get all models of a specific tier
 * @param {string} tier - The tier name ('genius', 'smart', 'fast')
 * @returns {array} Array of model objects for that tier
 */
export function getModelsByTier(tier) {
  return CLAUDE_MODELS.filter(m => m.tier === tier);
}
