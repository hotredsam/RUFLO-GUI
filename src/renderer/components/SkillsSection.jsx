import React, { useState, useMemo } from 'react';
import { SKILLS } from '../lib/skills';

const CATEGORIES = ['All', ...Array.from(new Set(SKILLS.map((s) => s.category))).sort()];

export default function SkillsSection({ mode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSkill, setExpandedSkill] = useState(null);

  const filteredSkills = useMemo(() => {
    return SKILLS.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-3">Skills & Commands</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Slash commands you can use in Claude Code to do cool things.'
            : 'Available slash commands for Claude Code workflows and automation.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="mb-8 glass-card p-4 flex items-center gap-3">
        <span className="text-slate-500 text-lg">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className="w-full"
        />
      </div>

      <div className="mb-8 flex gap-2 flex-wrap">
        {CATEGORIES.map((category) => {
          const count = SKILLS.filter(
            (s) => category === 'All' || s.category === category
          ).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-slate-700/30 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {category}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category ? 'bg-white/20' : 'bg-slate-600/40'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredSkills.length > 0 ? (
        <div className="space-y-3">
          {filteredSkills.map((skill) => {
            const isExpanded = expandedSkill === skill.id;
            return (
              <div
                key={skill.id}
                className="glass-card overflow-hidden cursor-pointer"
                onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {skill.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <code className="text-accent-med font-semibold text-sm">{skill.name}</code>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700/50 text-slate-400">
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">
                      {mode === 'eli5' ? skill.eli5 : skill.description}
                    </p>
                  </div>
                  <span className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-700/30 pt-4">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {mode === 'eli5' ? skill.eli5 : skill.complex}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-400">No skills found matching your search.</p>
        </div>
      )}
    </div>
  );
}
