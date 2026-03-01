import React, { useState, useMemo } from 'react';
import AddonCard from './AddonCard';
import { ADDONS } from '../lib/addons';

// Derive categories dynamically from addon data
const CATEGORIES = ['All', ...Array.from(new Set(ADDONS.map((a) => a.category))).sort()];

export default function AddonsMarketplace({ settings, mode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [installedAddons, setInstalledAddons] = useState(settings.addons?.installed || []);

  const filteredAddons = useMemo(() => {
    return ADDONS.filter((addon) => {
      const matchesSearch =
        addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addon.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || addon.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddonInstalled = (addonId) => {
    if (!installedAddons.includes(addonId)) {
      setInstalledAddons([...installedAddons, addonId]);
    }
  };

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-3">Add-ons Marketplace</h2>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
      </div>

      <div className="mb-8 glass-card p-4 flex items-center gap-3">
        <span className="text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search add-ons..."
          className="w-full"
        />
      </div>

      <div className="mb-8 flex gap-2 flex-wrap">
        {CATEGORIES.map((category) => {
          const count = ADDONS.filter(a => category === 'All' || a.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition relative ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-slate-700/30 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {category}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category
                  ? 'bg-white/20'
                  : 'bg-slate-600/40'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredAddons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddons.map((addon) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              mode={mode}
              isInstalled={installedAddons.includes(addon.id)}
              onInstalled={() => handleAddonInstalled(addon.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-400">No add-ons found matching your search.</p>
        </div>
      )}
    </div>
  );
}
