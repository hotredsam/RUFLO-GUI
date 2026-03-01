import React, { useState } from 'react';

export default function AddonCard({ addon, isInstalled, onInstalled }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleInstall = async () => {
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

  return (
    <div className="glass-card p-6 flex flex-col h-full hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{addon.icon || '🧩'}</span>
          <div className="flex-1">
            <h3 className="text-slate-100 font-semibold">{addon.name}</h3>
            <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300">
              {addon.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-4 flex-1">{addon.description}</p>

      {addon.features && addon.features.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-300 mb-2">Features:</p>
          <ul className="text-xs text-slate-400 space-y-1">
            {addon.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-purple-400">&#8226;</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

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
  );
}
