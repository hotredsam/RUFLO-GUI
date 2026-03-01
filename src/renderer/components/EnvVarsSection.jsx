import React, { useState } from 'react';
import { getSettingsBySection } from '../lib/eli5';

export default function EnvVarsSection({ settings, mode, onUpdate }) {
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const envSettings = getSettingsBySection('environment');
  const envVars = settings.environment || {};

  const getEnvVarName = (path) => path.replace('env.', '');

  const handleAddEnvVar = () => {
    if (newVarName.trim()) {
      onUpdate(`environment.${newVarName}`, newVarValue);
      setNewVarName('');
      setNewVarValue('');
    }
  };

  const handleDeleteEnvVar = (name) => {
    const newEnv = { ...envVars };
    delete newEnv[name];
    onUpdate('environment', newEnv);
  };

  return (
    <div className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-8">Environment Variables</h2>

      <div className="space-y-6">
        {envSettings.map((setting) => {
          const envVarName = getEnvVarName(setting.path);
          const value = envVars[envVarName] ?? '';
          return (
            <div key={setting.path} className="glass-card p-6">
              <div className="mb-4">
                <label className="block mb-2">
                  <div className="text-slate-200 font-medium">{setting.label}</div>
                  {mode === 'eli5' && setting.eli5 && (
                    <div className="text-xs text-slate-400 mt-1">{setting.eli5}</div>
                  )}
                  {mode === 'complex' && setting.complex && (
                    <div className="text-xs text-slate-500 mt-1">{setting.complex}</div>
                  )}
                  {mode === 'complex' && (
                    <div className="text-xs text-slate-600 mt-1 font-mono">{envVarName}</div>
                  )}
                </label>
              </div>
              {setting.type === 'toggle' ? (
                <div
                  className={`toggle-switch ${value ? 'active' : ''}`}
                  onClick={() => onUpdate(`environment.${envVarName}`, !value)}
                />
              ) : (
                <input
                  type={setting.type === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) =>
                    onUpdate(
                      `environment.${envVarName}`,
                      setting.type === 'number' ? (e.target.value ? parseInt(e.target.value) : '') : e.target.value
                    )
                  }
                  placeholder={setting.placeholder || ''}
                />
              )}
            </div>
          );
        })}

        <div className="glass-card p-6 border-accent/20">
          <h3 className="text-slate-200 font-medium mb-4">Custom Environment Variables</h3>
          <div className="space-y-3 mb-4">
            {Object.entries(envVars)
              .filter(([name]) => !envSettings.some((s) => getEnvVarName(s.path) === name))
              .map(([name, value]) => (
                <div key={name} className="flex gap-2 items-center bg-slate-800/30 p-3 rounded">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 font-mono">{name}</div>
                    <div className="text-sm text-slate-300">{String(value)}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteEnvVar(name)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              placeholder="Variable name (e.g., OPENAI_API_KEY)"
              className="mb-2"
            />
            <textarea
              value={newVarValue}
              onChange={(e) => setNewVarValue(e.target.value)}
              placeholder="Variable value"
              rows="3"
              className="mb-3"
            />
            <button
              onClick={handleAddEnvVar}
              className="btn-primary w-full"
            >
              Add Custom Variable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
