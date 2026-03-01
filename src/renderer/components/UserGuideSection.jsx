import React, { useState } from 'react';
import { GUIDES, GUIDE_CATEGORIES } from '../lib/userGuide';

export default function UserGuideSection({ settings, mode }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedGuide, setExpandedGuide] = useState(null);

  const categories = ['All', ...GUIDE_CATEGORIES];

  const filteredGuides = selectedCategory === 'All'
    ? GUIDES
    : GUIDES.filter((g) => g.category === selectedCategory);

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">User Guide</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Step-by-step instructions to help you get the most out of RUFLO.'
            : 'Comprehensive guides for RUFLO configuration, agent setup, and advanced workflows.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const count = cat === 'All' ? GUIDES.length : GUIDES.filter(g => g.category === cat).length;
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

      <div className="space-y-4">
        {filteredGuides.map((guide) => {
          const isExpanded = expandedGuide === guide.id;
          return (
            <div key={guide.id} className="glass-card overflow-hidden">
              <div
                className="p-5 cursor-pointer flex items-center gap-4"
                onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl flex-shrink-0">
                  {guide.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-slate-100 font-semibold">{guide.title}</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent-med">
                      {guide.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    {mode === 'eli5' ? guide.eli5 : guide.complex}
                  </p>
                </div>
                <span className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-700/30">
                  <div className="space-y-3 ml-2">
                    {guide.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-accent/20 text-accent-med flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-slate-200 text-sm font-medium">{step.title}</h4>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            {mode === 'eli5' ? step.eli5 : step.complex}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
