import { describe, it, expect } from 'vitest';
import {
  PROVIDERS,
  MODEL_TIERS,
  getModelsForProvider,
  getProviderEnvKey,
  getProviderList,
} from '../renderer/lib/modelProviders';

describe('PROVIDERS', () => {
  it('has exactly 5 providers', () => {
    expect(Object.keys(PROVIDERS).length).toBe(5);
  });

  it('has all required providers: anthropic, openai, google, cohere, ollama', () => {
    expect(PROVIDERS).toHaveProperty('anthropic');
    expect(PROVIDERS).toHaveProperty('openai');
    expect(PROVIDERS).toHaveProperty('google');
    expect(PROVIDERS).toHaveProperty('cohere');
    expect(PROVIDERS).toHaveProperty('ollama');
  });

  describe('each provider structure', () => {
    const providerIds = ['anthropic', 'openai', 'google', 'cohere', 'ollama'];

    providerIds.forEach((providerId) => {
      it(`${providerId} has name, envKeyName, defaultModel, and models array`, () => {
        const provider = PROVIDERS[providerId];
        expect(provider).toHaveProperty('name');
        expect(provider).toHaveProperty('envKeyName');
        expect(provider).toHaveProperty('defaultModel');
        expect(provider).toHaveProperty('models');
        expect(typeof provider.name).toBe('string');
        expect(typeof provider.envKeyName).toBe('string');
        expect(typeof provider.defaultModel).toBe('string');
        expect(Array.isArray(provider.models)).toBe(true);
      });

      it(`${providerId} models have id, name, tier, eli5, complex fields`, () => {
        const provider = PROVIDERS[providerId];
        provider.models.forEach((model) => {
          expect(model).toHaveProperty('id');
          expect(model).toHaveProperty('name');
          expect(model).toHaveProperty('tier');
          expect(model).toHaveProperty('eli5');
          expect(model).toHaveProperty('complex');
          expect(typeof model.id).toBe('string');
          expect(typeof model.name).toBe('string');
          expect(typeof model.tier).toBe('string');
          expect(typeof model.eli5).toBe('string');
          expect(typeof model.complex).toBe('string');
        });
      });
    });
  });

  it('anthropic provider has 3 models', () => {
    expect(PROVIDERS.anthropic.models.length).toBe(3);
  });

  it('openai provider has 3 models', () => {
    expect(PROVIDERS.openai.models.length).toBe(3);
  });

  it('google provider has 3 models', () => {
    expect(PROVIDERS.google.models.length).toBe(3);
  });

  it('cohere provider has 2 models', () => {
    expect(PROVIDERS.cohere.models.length).toBe(2);
  });

  it('ollama provider has 3 models', () => {
    expect(PROVIDERS.ollama.models.length).toBe(3);
  });

  it('anthropic provider has correct env key', () => {
    expect(PROVIDERS.anthropic.envKeyName).toBe('ANTHROPIC_API_KEY');
  });

  it('openai provider has correct env key', () => {
    expect(PROVIDERS.openai.envKeyName).toBe('OPENAI_API_KEY');
  });

  it('google provider has correct env key', () => {
    expect(PROVIDERS.google.envKeyName).toBe('GOOGLE_AI_API_KEY');
  });

  it('cohere provider has correct env key', () => {
    expect(PROVIDERS.cohere.envKeyName).toBe('COHERE_API_KEY');
  });

  it('ollama provider has correct env key', () => {
    expect(PROVIDERS.ollama.envKeyName).toBe('OLLAMA_HOST');
  });
});

describe('MODEL_TIERS', () => {
  it('has exactly 3 tiers: primary, secondary, fallback', () => {
    expect(Object.keys(MODEL_TIERS).length).toBe(3);
    expect(MODEL_TIERS).toHaveProperty('primary');
    expect(MODEL_TIERS).toHaveProperty('secondary');
    expect(MODEL_TIERS).toHaveProperty('fallback');
  });

  describe('each tier structure', () => {
    const tierIds = ['primary', 'secondary', 'fallback'];

    tierIds.forEach((tierId) => {
      it(`${tierId} has label, eli5, complex fields`, () => {
        const tier = MODEL_TIERS[tierId];
        expect(tier).toHaveProperty('label');
        expect(tier).toHaveProperty('eli5');
        expect(tier).toHaveProperty('complex');
        expect(typeof tier.label).toBe('string');
        expect(typeof tier.eli5).toBe('string');
        expect(typeof tier.complex).toBe('string');
      });
    });
  });

  it('primary tier has correct label', () => {
    expect(MODEL_TIERS.primary.label).toBe('Primary');
  });

  it('secondary tier has correct label', () => {
    expect(MODEL_TIERS.secondary.label).toBe('Secondary');
  });

  it('fallback tier has correct label', () => {
    expect(MODEL_TIERS.fallback.label).toBe('Fallback');
  });
});

describe('getModelsForProvider', () => {
  it('returns models array for anthropic', () => {
    const models = getModelsForProvider('anthropic');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBe(3);
    expect(models[0]).toHaveProperty('id');
  });

  it('returns models array for openai', () => {
    const models = getModelsForProvider('openai');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBe(3);
  });

  it('returns models array for google', () => {
    const models = getModelsForProvider('google');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBe(3);
  });

  it('returns models array for cohere', () => {
    const models = getModelsForProvider('cohere');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBe(2);
  });

  it('returns models array for ollama', () => {
    const models = getModelsForProvider('ollama');
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBe(3);
  });

  it('returns empty array for unknown provider', () => {
    const models = getModelsForProvider('unknown-provider');
    expect(models).toEqual([]);
  });

  it('returns empty array for null provider', () => {
    const models = getModelsForProvider(null);
    expect(models).toEqual([]);
  });
});

describe('getProviderEnvKey', () => {
  it('returns ANTHROPIC_API_KEY for anthropic', () => {
    expect(getProviderEnvKey('anthropic')).toBe('ANTHROPIC_API_KEY');
  });

  it('returns OPENAI_API_KEY for openai', () => {
    expect(getProviderEnvKey('openai')).toBe('OPENAI_API_KEY');
  });

  it('returns GOOGLE_AI_API_KEY for google', () => {
    expect(getProviderEnvKey('google')).toBe('GOOGLE_AI_API_KEY');
  });

  it('returns COHERE_API_KEY for cohere', () => {
    expect(getProviderEnvKey('cohere')).toBe('COHERE_API_KEY');
  });

  it('returns OLLAMA_HOST for ollama', () => {
    expect(getProviderEnvKey('ollama')).toBe('OLLAMA_HOST');
  });

  it('returns null for unknown provider', () => {
    expect(getProviderEnvKey('unknown-provider')).toBeNull();
  });

  it('returns null for null provider', () => {
    expect(getProviderEnvKey(null)).toBeNull();
  });
});

describe('getProviderList', () => {
  it('returns array of all providers with id and name', () => {
    const list = getProviderList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(5);
  });

  it('each provider in list has id and name', () => {
    const list = getProviderList();
    list.forEach((provider) => {
      expect(provider).toHaveProperty('id');
      expect(provider).toHaveProperty('name');
      expect(typeof provider.id).toBe('string');
      expect(typeof provider.name).toBe('string');
    });
  });

  it('provider list contains correct ids', () => {
    const list = getProviderList();
    const ids = list.map((p) => p.id);
    expect(ids).toContain('anthropic');
    expect(ids).toContain('openai');
    expect(ids).toContain('google');
    expect(ids).toContain('cohere');
    expect(ids).toContain('ollama');
  });

  it('provider list contains correct names', () => {
    const list = getProviderList();
    const names = list.map((p) => p.name);
    expect(names).toContain('Anthropic');
    expect(names).toContain('OpenAI');
    expect(names).toContain('Google');
    expect(names).toContain('Cohere');
    expect(names).toContain('Ollama (Local)');
  });
});
