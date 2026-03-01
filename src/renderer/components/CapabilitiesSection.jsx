import React, { useState, useMemo } from 'react';
import { CAPABILITIES, CAPABILITY_CATEGORIES } from '../lib/capabilities';

export default function CapabilitiesSection({ settings, mode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...CAPABILITY_CATEGORIES];

  const filteredCapabilities = useMemo(() => {
    return CAPABILITIES.filter((cap) => {
      const matchesSearch =
        cap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mode === 'eli5' ? cap.eli5 : cap.complex).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || cap.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, mode]);

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Capabilities</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Everything your AI assistant can do for you.'
            : 'Full capability matrix for RUFLO and Claude Code agent framework.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="mb-6 glass-card p-4 flex items-center gap-3">
        <span className="text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search capabilities..."
          className="w-full"
        />
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const count = CAPABILITIES.filter(c => cat === 'All' || c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-accent text-white'
                  : 'bg-slate-700/30 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {cat}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === cat ? 'bg-white/20' : 'bg-slate-600/40'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredCapabilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapabilities.map((cap) => (
            <div key={cap.id} className="glass-card p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl flex-shrink-0">
                  {cap.icon}
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold text-sm">{cap.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent-med">
                    {cap.category}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1">
                {mode === 'eli5' ? cap.eli5 : cap.complex}
              </p>
              {cap.features && cap.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {cap.features.map((feat, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-300 border border-slate-600/30">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-400">No capabilities found matching your search.</p>
        </div>
      )}
    </div>
  );
}
