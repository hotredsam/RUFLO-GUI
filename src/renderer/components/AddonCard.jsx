import React, { useState } from 'react';

export default function AddonCard({ addon, mode, isInstalled, onInstalled }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleInstall = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await window.electronAPI.installAddon(addon.installCommand);
      onInstalled();
    } catch (error) {
      console.error('Failed to install addon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const description = mode === 'eli5' ? addon.eli5 : addon.complex;

  return (
    <div
      className="addon-card glass-card p-6 flex flex-col h-full cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center text-3xl flex-shrink-0">
            {addon.icon || '🧩'}
          </div>
          <div className="flex-1">
            <h3 className="text-slate-100 font-semibold">{addon.name}</h3>
            <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300 transition hover:bg-purple-500/30">
              {addon.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {description || addon.description}
      </p>

      {showDetails && addon.detailedSummary && (
        <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
          <p className="text-xs font-semibold text-purple-300 mb-2">Detailed Summary</p>
          <p className="text-slate-400 text-xs leading-relaxed">{addon.detailedSummary}</p>
        </div>
      )}

      {addon.features && addon.features.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-300 mb-2">Features:</p>
          <ul className="text-xs text-slate-400 space-y-1">
            {addon.features.slice(0, showDetails ? addon.features.length : 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-purple-400">&#8226;</span>
                {feature}
              </li>
            ))}
            {!showDetails && addon.features.length > 3 && (
              <li className="text-purple-400 text-xs">+{addon.features.length - 3} more</li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={handleInstall}
          disabled={isLoading || isInstalled}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            isInstalled
              ? 'bg-green-500/20 text-green-300 cursor-default'
              : isLoading
              ? 'bg-purple-500/50 text-white cursor-wait'
              : 'btn-primary hover:bg-purple-600'
          }`}
        >
          {isInstalled ? 'Installed' : isLoading ? 'Installing...' : 'Install'}
        </button>
      </div>
    </div>
  );
}
