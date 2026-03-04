import React, { useState } from 'react';

export default function SecuritySection({ settings, mode, onUpdate }) {
  const [newAllowedPath, setNewAllowedPath] = useState('');
  const [newBlockedPath, setNewBlockedPath] = useState('');
  const [newAllowedHost, setNewAllowedHost] = useState('');
  const [newBlockedHost, setNewBlockedHost] = useState('');

  const sandbox = settings.sandbox || {};
  const filesystemAllowed = sandbox.filesystem?.allowedPaths || [];
  const filesystemBlocked = sandbox.filesystem?.blockedPaths || [];
  const networkAllowed = sandbox.network?.allowedHosts || [];
  const networkBlocked = sandbox.network?.blockedHosts || [];

  const security = settings.security || {};

  const sandboxEnabled = sandbox.enabled || false;
  const autoAllowBash = sandbox.autoAllowBashIfSandboxed || false;

  const handleAdd = (list, newValue, setter, path) => {
    if (newValue.trim()) {
      onUpdate(path, [...list, newValue.trim()]);
      setter('');
    }
  };

  const handleRemove = (list, item, path) => {
    onUpdate(path, list.filter((t) => t !== item));
  };

  const PathItem = ({ item, onRemove, isAllowed }) => (
    <div className={`flex items-center justify-between bg-slate-800/30 p-2 rounded border-l-2 ${isAllowed ? 'border-green-500' : 'border-red-500'}`}>
      <span className="text-sm text-slate-300 font-mono">{item}</span>
      <button
        onClick={() => onRemove(item)}
        className="text-red-400 hover:text-red-300 text-lg"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Sandbox & Security</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Control how the AI interacts with your files and network to keep your system safe.'
            : 'Configure sandbox isolation, filesystem access controls, and network restrictions.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      {mode === 'eli5' && (
        <div className="glass-card p-4 mb-6 border-blue-500/20">
          <p className="text-sm text-slate-300">
            Sandboxing isolates the AI's actions to prevent accidental or malicious damage. Set which folders and websites it can reach.
          </p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        <div className="glass-card p-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`toggle-switch ${sandboxEnabled ? 'active' : ''}`}
              onClick={() => onUpdate('sandbox.enabled', !sandboxEnabled)}
            />
            <div>
              <div className="text-slate-200 font-medium">
                {mode === 'eli5' ? 'Enable Sandbox' : 'sandbox.enabled'}
              </div>
              {mode === 'eli5' && (
                <div className="text-xs text-slate-400 mt-1">
                  Isolate AI operations for safety
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="glass-card p-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`toggle-switch ${autoAllowBash ? 'active' : ''}`}
              onClick={() => onUpdate('sandbox.autoAllowBashIfSandboxed', !autoAllowBash)}
            />
            <div>
              <div className="text-slate-200 font-medium">
                {mode === 'eli5' ? 'Auto-Allow Bash in Sandbox' : 'sandbox.autoAllowBashIfSandboxed'}
              </div>
              {mode === 'eli5' && (
                <div className="text-xs text-slate-400 mt-1">
                  Allow terminal commands when sandboxed
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Filesystem Access</h3>

          <div className="mb-6">
            <h4 className="text-green-400 font-medium mb-3">Allowed Paths</h4>
            <div className="glass-card p-4">
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {filesystemAllowed.map((path) => (
                  <PathItem
                    key={path}
                    item={path}
                    isAllowed={true}
                    onRemove={() => handleRemove(filesystemAllowed, path, 'sandbox.filesystem.allowedPaths')}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllowedPath}
                  onChange={(e) => setNewAllowedPath(e.target.value)}
                  placeholder="/path/to/allow"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(filesystemAllowed, newAllowedPath, setNewAllowedPath, 'sandbox.filesystem.allowedPaths')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(filesystemAllowed, newAllowedPath, setNewAllowedPath, 'sandbox.filesystem.allowedPaths')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-red-400 font-medium mb-3">Blocked Paths</h4>
            <div className="glass-card p-4">
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {filesystemBlocked.map((path) => (
                  <PathItem
                    key={path}
                    item={path}
                    isAllowed={false}
                    onRemove={() => handleRemove(filesystemBlocked, path, 'sandbox.filesystem.blockedPaths')}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBlockedPath}
                  onChange={(e) => setNewBlockedPath(e.target.value)}
                  placeholder="/path/to/block"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(filesystemBlocked, newBlockedPath, setNewBlockedPath, 'sandbox.filesystem.blockedPaths')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(filesystemBlocked, newBlockedPath, setNewBlockedPath, 'sandbox.filesystem.blockedPaths')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Network Access</h3>

          <div className="mb-6">
            <h4 className="text-green-400 font-medium mb-3">Allowed Hosts</h4>
            <div className="glass-card p-4">
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {networkAllowed.map((host) => (
                  <PathItem
                    key={host}
                    item={host}
                    isAllowed={true}
                    onRemove={() => handleRemove(networkAllowed, host, 'sandbox.network.allowedHosts')}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllowedHost}
                  onChange={(e) => setNewAllowedHost(e.target.value)}
                  placeholder="example.com"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(networkAllowed, newAllowedHost, setNewAllowedHost, 'sandbox.network.allowedHosts')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(networkAllowed, newAllowedHost, setNewAllowedHost, 'sandbox.network.allowedHosts')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-red-400 font-medium mb-3">Blocked Hosts</h4>
            <div className="glass-card p-4">
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {networkBlocked.map((host) => (
                  <PathItem
                    key={host}
                    item={host}
                    isAllowed={false}
                    onRemove={() => handleRemove(networkBlocked, host, 'sandbox.network.blockedHosts')}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBlockedHost}
                  onChange={(e) => setNewBlockedHost(e.target.value)}
                  placeholder="malicious.com"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(networkBlocked, newBlockedHost, setNewBlockedHost, 'sandbox.network.blockedHosts')}
                  className="flex-1"
                />
                <button
                  onClick={() => handleAdd(networkBlocked, newBlockedHost, setNewBlockedHost, 'sandbox.network.blockedHosts')}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-100 mb-4 mt-8">Advanced Security</h3>

      <div className="space-y-6 mb-8">
        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <div
                className={`toggle-switch ${security.cveScanning ? 'active' : ''}`}
                onClick={() => onUpdate('security.cveScanning', !security.cveScanning)}
              />
              <div>
                <div className="text-slate-200 font-medium">
                  {mode === 'eli5' ? 'CVE Scanning' : 'security.cveScanning'}
                </div>
                {mode === 'eli5' && (
                  <div className="text-xs text-slate-400 mt-1">
                    Automatically check your code for known security vulnerabilities.
                  </div>
                )}
                {mode === 'complex' && (
                  <div className="text-xs text-slate-500 mt-1">
                    Enable CVE scanning against the NVD database for dependencies and generated code.
                  </div>
                )}
              </div>
            </label>
          </div>

          {security.cveScanning && (
            <div className="ml-12 space-y-4 pt-4 border-t border-slate-700">
              <div>
                <label className="text-slate-200 font-medium block mb-2">
                  {mode === 'eli5' ? 'How Often' : 'Scan Frequency'}
                </label>
                <select
                  value={security.cveScanFrequency || 'weekly'}
                  onChange={(e) => onUpdate('security.cveScanFrequency', e.target.value)}
                  className="w-full"
                >
                  <option value="on-commit">On Commit</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="text-slate-200 font-medium block mb-2">
                  {mode === 'eli5' ? 'Alert Level' : 'Severity Threshold'}
                </label>
                <select
                  value={security.cveSeverityThreshold || 'high'}
                  onChange={(e) => onUpdate('security.cveSeverityThreshold', e.target.value)}
                  className="w-full"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <div
                className={`toggle-switch ${security.auditLogging ? 'active' : ''}`}
                onClick={() => onUpdate('security.auditLogging', !security.auditLogging)}
              />
              <div>
                <div className="text-slate-200 font-medium">
                  {mode === 'eli5' ? 'Audit Logging' : 'security.auditLogging'}
                </div>
                {mode === 'eli5' && (
                  <div className="text-xs text-slate-400 mt-1">
                    Keep a log of everything the AI does for security review.
                  </div>
                )}
                {mode === 'complex' && (
                  <div className="text-xs text-slate-500 mt-1">
                    Enable comprehensive audit logging of all agent actions and tool invocations.
                  </div>
                )}
              </div>
            </label>
          </div>

          {security.auditLogging && (
            <div className="ml-12 space-y-4 pt-4 border-t border-slate-700">
              <div>
                <label className="text-slate-200 font-medium block mb-2">
                  {mode === 'eli5' ? 'Log File Location' : 'Log Path'}
                </label>
                <input
                  type="text"
                  value={security.auditLogPath || '~/.claude/audit.log'}
                  onChange={(e) => onUpdate('security.auditLogPath', e.target.value || undefined)}
                  placeholder="~/.claude/audit.log"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-slate-200 font-medium block mb-2">
                  {mode === 'eli5' ? 'Detail Level' : 'Log Level'}
                </label>
                <select
                  value={security.auditLogLevel || 'info'}
                  onChange={(e) => onUpdate('security.auditLogLevel', e.target.value)}
                  className="w-full"
                >
                  <option value="error">Error</option>
                  <option value="warn">Warn</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <div
                className={`toggle-switch ${security.piiDetection ? 'active' : ''}`}
                onClick={() => onUpdate('security.piiDetection', !security.piiDetection)}
              />
              <div>
                <div className="text-slate-200 font-medium">
                  {mode === 'eli5' ? 'PII Detection' : 'security.piiDetection'}
                </div>
                {mode === 'eli5' && (
                  <div className="text-xs text-slate-400 mt-1">
                    Detect and warn about personal information in your code.
                  </div>
                )}
                {mode === 'complex' && (
                  <div className="text-xs text-slate-500 mt-1">
                    Enable PII detection scanning for sensitive data patterns (SSN, email, phone, credit card, etc.).
                  </div>
                )}
              </div>
            </label>
          </div>

          {security.piiDetection && (
            <div className="ml-12 pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Social Security Numbers (###-##-####)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Email Addresses (user@domain.com)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Phone Numbers (###-###-####)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Credit Card Numbers (####-####-####-####)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <div
                className={`toggle-switch ${security.threatModeling ? 'active' : ''}`}
                onClick={() => onUpdate('security.threatModeling', !security.threatModeling)}
              />
              <div>
                <div className="text-slate-200 font-medium">
                  {mode === 'eli5' ? 'Threat Modeling' : 'security.threatModeling'}
                </div>
                {mode === 'eli5' && (
                  <div className="text-xs text-slate-400 mt-1">
                    Have the AI analyze potential security threats in your project.
                  </div>
                )}
                {mode === 'complex' && (
                  <div className="text-xs text-slate-500 mt-1">
                    Enable STRIDE-based automated threat modeling for architecture and generated code.
                  </div>
                )}
              </div>
            </label>
          </div>

          {security.threatModeling && (
            <div className="ml-12 pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><span className="font-medium">S</span>poofing - Identity forgery and authentication bypass</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><span className="font-medium">T</span>ampering - Unauthorized modification of data or code</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><span className="font-medium">R</span>epudiation - Denial of responsibility for actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><span className="font-medium">I</span>nformation Disclosure - Unauthorized access to sensitive data</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><span className="font-medium">D</span>enial of Service - Resource exhaustion and availability attacks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><span className="font-medium">E</span>levation of Privilege - Unauthorized escalation of permissions</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
