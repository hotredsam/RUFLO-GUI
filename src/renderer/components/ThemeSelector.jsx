import React from 'react';
import { THEMES } from '../lib/themes';

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Theme</label>
      <div className="flex gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            title={theme.name}
            className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center text-sm ${
              currentTheme === theme.id
                ? 'ring-2 ring-white/50 scale-110'
                : 'hover:scale-105 opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: theme.accent }}
          >
            {theme.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
