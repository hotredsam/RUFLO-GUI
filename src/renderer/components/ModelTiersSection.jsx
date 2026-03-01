import React from 'react';
import { MODEL_TIERS } from '../lib/modelTiers';

export default function ModelTiersSection({ settings, mode, onUpdate }) {
  const getSelectedModel = (tier) => {
    const keys = tier.settingsKey.split('.');
    let val = settings;
    for (const k of keys) {
      val = val?.[k];
    }
    return val || tier.models[0]?.id || '';
  };

  const renderLevelBar = (level, max, color) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-sm ${
              i < level ? color : 'bg-slate-700/50'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Model Tiers</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Choose which AI models to use for different types of tasks. Smarter models cost more but do better work.'
            : 'Configure model routing tiers for task-specific optimization. Each tier maps to a capability level with cost-performance tradeoffs.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {MODEL_TIERS.map((tier) => {
          const selected = getSelectedModel(tier);
          return (
            <div key={tier.id} className="glass-card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-3xl flex-shrink-0">
                  {tier.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-slate-100 font-bold">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {mode === 'eli5' ? tier.eli5 : tier.complex}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase w-12">Cost</span>
                  {renderLevelBar(tier.costLevel, 5, 'bg-amber-400')}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase w-12">Speed</span>
                  {renderLevelBar(tier.speedLevel, 5, 'bg-green-400')}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">
                  {mode === 'eli5' ? 'Pick a model' : 'Active Model'}
                </label>
                <select
                  value={selected}
                  onChange={(e) => onUpdate(tier.settingsKey, e.target.value)}
                  className="w-full"
                >
                  {tier.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.provider}) — ${model.costPerMToken}/1M tokens
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  {mode === 'eli5' ? 'Good for' : 'Use Cases'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tier.useCases.map((uc, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-300 border border-slate-600/30">
                      {uc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Available Models</p>
                <div className="space-y-1.5">
                  {tier.models.map((model) => (
                    <div key={model.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-800/40">
                      <span className="text-slate-200 font-medium">{model.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{model.provider}</span>
                        <span className={`font-mono ${model.costPerMToken === 0 ? 'text-green-400' : 'text-amber-300'}`}>
                          {model.costPerMToken === 0 ? 'Free' : `$${model.costPerMToken}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
