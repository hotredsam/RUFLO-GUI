import React from 'react';

const SECURITY_LEVELS = ['low', 'medium', 'high', 'paranoid'];

export default function SecuritySection({ settings, mode, onUpdate }) {
  const security = settings.security || {};

  const levelDescription = {
    low: 'Minimal security checks',
    medium: 'Standard security checks',
    high: 'Strict security enforcement',
    paranoid: 'Maximum security - slow but most secure',
  };

  const eli5Description = {
    low: 'Trust everything',
    medium: 'Basic safety checks',
    high: 'Strong protection',
    paranoid: 'Check everything multiple times',
  };

  return (
    <div className="p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-100 mb-8">Security Configuration</h2>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <label className="block mb-4">
            <div className="text-slate-200 font-medium">Security Level</div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How strict to be about security
              </div>
            )}
          </label>
          <select
            value={security.level || 'medium'}
            onChange={(e) => onUpdate('security.level', e.target.value)}
            className="mb-3"
          >
            {SECURITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          {mode === 'eli5' && (
            <div className="text-xs text-slate-400 font-medium">
              {eli5Description[security.level || 'medium']}
            </div>
          )}
          {mode === 'complex' && (
            <div className="text-xs text-slate-600">
              {levelDescription[security.level || 'medium']}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Scan Code' : 'Enable Scanning'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Check code for potential problems
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${security.enableScanning ? 'active' : ''}`}
            onClick={() => onUpdate('security.enableScanning', !security.enableScanning)}
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Check for Known Vulnerabilities' : 'CVE Checking'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Look for known security issues in dependencies
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${security.cveCheck ? 'active' : ''}`}
            onClick={() => onUpdate('security.cveCheck', !security.cveCheck)}
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Think About Threats' : 'Threat Modeling'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Analyze potential security threats
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${security.threatModeling ? 'active' : ''}`}
            onClick={() => onUpdate('security.threatModeling', !security.threatModeling)}
          />
        </div>

        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Keep Security Logs' : 'Audit Logging'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Record security-related activities
              </div>
            )}
          </label>
          <div
            className={`toggle-switch ${security.auditLogging ? 'active' : ''}`}
            onClick={() => onUpdate('security.auditLogging', !security.auditLogging)}
          />
        </div>
      </div>
    </div>
  );
}
