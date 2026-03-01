import React from 'react';
import { getSettingsBySection } from '../lib/eli5';

export default function SettingsPanel({ settings, mode, section, onUpdate }) {
  const sectionSettings = getSettingsBySection(section);

  const getNestedValue = (obj, path) => {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      current = current?.[key];
    }
    return current;
  };

  const renderInput = (setting) => {
    const value = getNestedValue(settings, setting.path);

    switch (setting.type) {
      case 'toggle':
        return (
          <div
            className={`toggle-switch ${value ? 'active' : ''}`}
            onClick={() => onUpdate(setting.path, !value)}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onUpdate(setting.path, e.target.value)}
            placeholder={setting.placeholder || ''}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onUpdate(setting.path, e.target.value ? parseFloat(e.target.value) : null)}
            min={setting.min}
            max={setting.max}
          />
        );

      case 'select':
        return (
          <select value={value || ''} onChange={(e) => onUpdate(setting.path, e.target.value)}>
            <option value="">Select...</option>
            {setting.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'list':
        return (
          <div className="space-y-2">
            {(value || []).map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newList = [...(value || [])];
                    newList[idx] = e.target.value;
                    onUpdate(setting.path, newList);
                  }}
                  className="flex-1"
                />
                <button
                  onClick={() => {
                    const newList = (value || []).filter((_, i) => i !== idx);
                    onUpdate(setting.path, newList);
                  }}
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => onUpdate(setting.path, [...(value || []), ''])}
              className="btn-secondary w-full"
            >
              Add Item
            </button>
          </div>
        );

      case 'json':
        return (
          <textarea
            value={JSON.stringify(value || {}, null, 2)}
            onChange={(e) => {
              try {
                onUpdate(setting.path, JSON.parse(e.target.value));
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            rows="6"
            className="font-mono text-sm"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-8 capitalize">
        {section.replace(/([A-Z])/g, ' $1').trim()}
      </h2>

      <div className="space-y-6">
        {sectionSettings.map((setting) => (
          <div key={setting.path} className="glass-card p-6">
            <div className="mb-4">
              <label className="block mb-2">
                <div className="text-slate-200 font-medium">
                  {setting.label}
                </div>
                {mode === 'eli5' && setting.eli5 && (
                  <div className="text-xs text-slate-400 mt-1">{setting.eli5}</div>
                )}
                {mode === 'complex' && setting.complex && (
                  <div className="text-xs text-slate-500 mt-1">{setting.complex}</div>
                )}
                {mode === 'complex' && (
                  <div className="text-xs text-slate-600 mt-1 font-mono">Path: {setting.path}</div>
                )}
              </label>
            </div>
            {renderInput(setting)}
          </div>
        ))}
      </div>
    </div>
  );
}
