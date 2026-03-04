import React, { useState } from 'react';
import { CLAUDE_MODELS, MODEL_SETTINGS_KEY } from '../lib/modelTiers';
import { PROVIDERS, MODEL_TIERS, getModelsForProvider, getProviderList } from '../lib/modelProviders';

export default function ModelTiersSection({ settings, mode, onUpdate }) {
  const currentModel = settings.model || 'claude-sonnet-4-6';
  const [expandedTier, setExpandedTier] = useState('primary');

  // State for dropdowns
  const getProviderForTier = (tier) => settings.modelTiers?.[tier]?.provider || 'anthropic';
  const getModelForTier = (tier) => settings.modelTiers?.[tier]?.model || 'claude-sonnet-4-6';
  const getRoutingStrategy = () => settings.modelTiers?.routing?.strategy || 'balanced';
  const getMaxCostPerRequest = () => settings.modelTiers?.routing?.maxCostPerRequest || 5.0;

  // Check which providers have API keys configured
  const getProviderStatus = () => {
    const status = {};
    const providers = getProviderList();

    providers.forEach(provider => {
      const envKey = PROVIDERS[provider.id].envKeyName;
      let isConfigured = false;

      if (envKey === 'ANTHROPIC_API_KEY') {
        isConfigured = !!settings.env?.ANTHROPIC_API_KEY;
      } else if (envKey === 'OPENAI_API_KEY') {
        isConfigured = !!settings.env?.OPENAI_API_KEY;
      } else if (envKey === 'GOOGLE_AI_API_KEY') {
        isConfigured = !!settings.env?.GOOGLE_AI_API_KEY;
      } else if (envKey === 'COHERE_API_KEY') {
        isConfigured = !!settings.env?.COHERE_API_KEY;
      } else if (envKey === 'OLLAMA_HOST') {
        isConfigured = !!settings.env?.OLLAMA_HOST;
      }

      status[provider.id] = isConfigured;
    });

    return status;
  };

  const providerStatus = getProviderStatus();
  const routingStrategies = [
    {
      id: 'cost',
      label: 'Save Money',
      emoji: '💰',
      eli5: 'Minimize API spend by routing to cheapest capable model',
      complex: 'Routes requests to the lowest-cost provider capable of handling the task while maintaining acceptable quality thresholds.'
    },
    {
      id: 'performance',
      label: 'Best Results',
      emoji: '🚀',
      eli5: 'Route to highest-capability model regardless of cost',
      complex: 'Always prioritizes highest-capability model for optimal output quality. Routes to primary tier when available, with secondary fallback.'
    },
    {
      id: 'balanced',
      label: 'Balanced',
      emoji: '⚖️',
      eli5: 'Optimize cost-performance ratio across tiers',
      complex: 'Intelligently balances cost and capability. Routes to secondary if primary would exceed cost limits. Maximizes capability within budget constraints.'
    }
  ];

  return (
    <div className="p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Model Selection & Routing</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Choose your default Claude AI model and set up backup models for different situations. Smarter models are better at complex tasks but cost more. Faster models are cheaper but handle simple tasks better.'
            : 'Configure your primary model selection and set up multi-tier routing for intelligent failover and cost optimization. Define primary, secondary, and fallback providers with routing strategies.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      {/* Section 1: Default Model Cards (Existing) */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Default Claude Model</h3>
        <div className="grid grid-cols-1 gap-4">
          {CLAUDE_MODELS.map((model) => {
            const isSelected = currentModel === model.id;
            const tierEmojis = {
              genius: '🧠',
              smart: '⚡',
              fast: '🚀',
            };
            const tierLabels = {
              genius: 'Most Capable',
              smart: 'Balanced',
              fast: 'Fastest',
            };

            return (
              <button
                key={model.id}
                onClick={() => onUpdate(MODEL_SETTINGS_KEY, model.id)}
                className={`glass-card p-6 text-left transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-accent bg-accent/10 border-accent/50'
                    : 'hover:border-accent/50 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {tierEmojis[model.tier] || '🤖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg text-slate-100 font-bold">
                        {model.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                        {tierLabels[model.tier]}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">
                      {mode === 'eli5' ? model.eli5 : model.complex}
                    </p>
                    {mode === 'complex' && (
                      <code className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded block w-fit">
                        {model.id}
                      </code>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Routing Strategy */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Routing Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routingStrategies.map((strategy) => {
            const isSelected = getRoutingStrategy() === strategy.id;
            return (
              <button
                key={strategy.id}
                onClick={() => onUpdate('modelTiers.routing.strategy', strategy.id)}
                className={`glass-card p-6 text-left transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-accent bg-accent/10 border-accent/50'
                    : 'hover:border-accent/50 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{strategy.emoji}</div>
                  <h4 className="text-slate-100 font-bold text-lg">{strategy.label}</h4>
                </div>
                <p className={mode === 'eli5' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
                  {mode === 'eli5' ? strategy.eli5 : strategy.complex}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Tier Configuration */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Model Tiers Configuration</h3>
        <div className="space-y-4">
          {Object.entries(MODEL_TIERS).map(([tierKey, tierConfig]) => {
            const currentProvider = getProviderForTier(tierKey);
            const currentModelId = getModelForTier(tierKey);
            const availableModels = getModelsForProvider(currentProvider);

            return (
              <div key={tierKey} className="glass-card p-6">
                {/* Tier Header */}
                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setExpandedTier(expandedTier === tierKey ? null : tierKey)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-200 font-medium text-lg">
                        {tierConfig.label} Tier
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
                        {PROVIDERS[currentProvider]?.name}
                      </span>
                    </div>
                    <p className={mode === 'eli5' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
                      {mode === 'eli5' ? tierConfig.eli5 : tierConfig.complex}
                    </p>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedTier === tierKey ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Expandable Content */}
                {expandedTier === tierKey && (
                  <div className="space-y-4 pt-4 border-t border-slate-700/50">
                    {/* Provider Dropdown */}
                    <div>
                      <label className="text-slate-200 font-medium text-sm block mb-2">
                        Provider
                      </label>
                      <select
                        value={currentProvider}
                        onChange={(e) => {
                          onUpdate(`modelTiers.${tierKey}.provider`, e.target.value);
                          // Reset model to default of new provider
                          const newProvider = e.target.value;
                          const defaultModel = PROVIDERS[newProvider]?.defaultModel || 'claude-sonnet-4-6';
                          onUpdate(`modelTiers.${tierKey}.model`, defaultModel);
                        }}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {getProviderList().map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Model Dropdown */}
                    <div>
                      <label className="text-slate-200 font-medium text-sm block mb-2">
                        Model
                      </label>
                      <select
                        value={currentModelId}
                        onChange={(e) => onUpdate(`modelTiers.${tierKey}.model`, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {availableModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                      {availableModels.length > 0 && (
                        <p className="text-xs text-slate-500 mt-2">
                          {mode === 'eli5'
                            ? availableModels.find(m => m.id === currentModelId)?.eli5
                            : availableModels.find(m => m.id === currentModelId)?.complex}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Max Cost Per Request */}
      <div className="mb-8">
        <div className="glass-card p-6">
          <label className="text-slate-200 font-medium text-sm block mb-3">
            Maximum Cost Per Request
          </label>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-slate-400">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={getMaxCostPerRequest()}
              onChange={(e) => onUpdate('modelTiers.routing.maxCostPerRequest', e.target.value !== '' ? parseFloat(e.target.value) : undefined)}
              className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <p className={mode === 'eli5' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
            {mode === 'eli5'
              ? 'Sets a spending limit per request. Cheaper models are used if the best model would cost more.'
              : 'Enforces a cost ceiling for individual API requests. When the primary model would exceed this limit, routing automatically falls back to secondary tier or cost-optimized provider.'}
          </p>
        </div>
      </div>

      {/* Section 5: Provider API Key Status */}
      <div className="mb-8">
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium text-sm block mb-4">Provider API Key Status</h3>
          <div className="grid grid-cols-2 gap-4">
            {getProviderList().map((provider) => {
              const isConfigured = providerStatus[provider.id];
              return (
                <div key={provider.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-300">{provider.name}</p>
                    <p className={`text-xs ${isConfigured ? 'text-green-400' : 'text-slate-500'}`}>
                      {isConfigured ? 'Configured' : 'Not configured'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className={`mt-4 ${mode === 'eli5' ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}`}>
            {mode === 'eli5'
              ? 'Green means the API key is set up and ready to use. Gray means you need to add the key in settings.'
              : 'Indicates which providers have authentication credentials configured. Required for enabling that provider in tier routing. Configure missing keys in the Environment Variables section.'}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-700/30">
        <p className="text-xs text-blue-300 font-medium mb-1">Info</p>
        <p className="text-xs text-blue-300/80">
          {mode === 'eli5'
            ? 'Your default model is used for most tasks. Backup models help when the main one is busy or for special situations. Routing strategies automatically choose which model to use based on cost and performance.'
            : 'Multi-tier routing enables intelligent provider selection based on request complexity, cost constraints, and availability. The routing strategy determines which tier is used for each request. Configure API keys in Environment Variables to enable additional providers.'}
        </p>
      </div>
    </div>
  );
}
