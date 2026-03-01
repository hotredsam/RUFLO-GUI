import React, { useState } from 'react';
import { PLUGIN_PACKS } from '../lib/plugins';

export default function PluginsSection({ settings, mode }) {
  const [installingPack, setInstallingPack] = useState(null);
  const [installedPacks, setInstalledPacks] = useState(settings.plugins?.installed || []);

  const handleInstall = async (pack) => {
    setInstallingPack(pack.id);
    try {
      await window.electronAPI.installAddon(pack.installCommand);
      setInstalledPacks((prev) => [...prev, pack.id]);
    } catch (error) {
      console.error('Failed to install pack:', error);
    } finally {
      setInstallingPack(null);
    }
  };

  const recommended = PLUGIN_PACKS.filter(p => p.recommended);
  const others = PLUGIN_PACKS.filter(p => !p.recommended);

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Plugin Packs</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Install bundles of features with one click. Each pack gives you a set of tools that work great together.'
            : 'Pre-configured addon bundles for common workflows. Each pack installs multiple addons with compatible configurations.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      {recommended.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-accent-med uppercase tracking-wider mb-4">Recommended</h3>
          {recommended.map((pack) => {
            const isInstalled = installedPacks.includes(pack.id);
            const isInstalling = installingPack === pack.id;
            return (
              <div key={pack.id} className="glass-card p-6 border-accent/30">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-4xl flex-shrink-0">
                    {pack.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg text-slate-100 font-bold">{pack.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent text-white">Recommended</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">
                      {mode === 'eli5' ? pack.eli5 : pack.complex}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span>{pack.includedAddons.length} addons included</span>
                      <span>~{pack.estimatedTime}</span>
                    </div>
                    <button
                      onClick={() => handleInstall(pack)}
                      disabled={isInstalling || isInstalled}
                      className={`py-2 px-6 rounded-lg font-medium transition ${
                        isInstalled
                          ? 'bg-green-500/20 text-green-300 cursor-default'
                          : isInstalling
                          ? 'bg-accent/50 text-white cursor-wait'
                          : 'btn-primary hover:bg-accent-hover'
                      }`}
                    >
                      {isInstalled ? 'Installed' : isInstalling ? 'Installing...' : 'Install Pack'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {others.map((pack) => {
          const isInstalled = installedPacks.includes(pack.id);
          const isInstalling = installingPack === pack.id;
          return (
            <div key={pack.id} className="glass-card p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl flex-shrink-0">
                  {pack.icon}
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold">{pack.name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {pack.includedAddons.length} addons &middot; ~{pack.estimatedTime}
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4 flex-1">
                {mode === 'eli5' ? pack.eli5 : pack.complex}
              </p>
              <div className="mb-3 flex flex-wrap gap-1">
                {pack.includedAddons.slice(0, 4).map((addon, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-400 border border-slate-600/30">
                    {addon.replace(/-/g, ' ')}
                  </span>
                ))}
                {pack.includedAddons.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-accent-med-dark">+{pack.includedAddons.length - 4} more</span>
                )}
              </div>
              <button
                onClick={() => handleInstall(pack)}
                disabled={isInstalling || isInstalled}
                className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                  isInstalled
                    ? 'bg-green-500/20 text-green-300 cursor-default'
                    : isInstalling
                    ? 'bg-accent/50 text-white cursor-wait'
                    : 'btn-primary hover:bg-accent-hover'
                }`}
              >
                {isInstalled ? 'Installed' : isInstalling ? 'Installing...' : 'Install Pack'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
