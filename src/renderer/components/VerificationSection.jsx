import React from 'react';

export default function VerificationSection({ settings, mode, onUpdate }) {
  const verification = settings.verification || {};

  const environments = [
    {
      id: 'development',
      name: 'Development',
      icon: '🔧',
      eli5: 'Relaxed checking for dev work',
      complex: 'Relaxed thresholds for development iteration speed'
    },
    {
      id: 'staging',
      name: 'Staging',
      icon: '🧪',
      eli5: 'Moderate checking for testing',
      complex: 'Moderate thresholds balancing quality and speed'
    },
    {
      id: 'production',
      name: 'Production',
      icon: '🛡️',
      eli5: 'Strict checking for production',
      complex: 'Strictest thresholds for production-grade output quality'
    }
  ];

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Verification</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Makes Claude double-check its work before giving you answers.'
            : 'Configure the verification system with truth scoring thresholds for validating agent outputs.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {/* Enable Toggle */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`toggle-switch ${verification.enabled ? 'active' : ''}`}
              onClick={() => onUpdate('verification.enabled', !verification.enabled)}
            />
            <div>
              <div className="text-slate-200 font-medium">
                {mode === 'eli5' ? 'Double-Check Answers' : 'Enable Verification System'}
              </div>
              {mode === 'eli5' && (
                <div className="text-xs text-slate-400 mt-1">
                  Have Claude review its own answers for accuracy
                </div>
              )}
              {mode === 'complex' && (
                <div className="text-xs text-slate-500 mt-1">
                  Enable automatic verification and truth scoring of agent outputs
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Truth Threshold */}
        <div className="glass-card p-6">
          <label className="block mb-4">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Confidence Threshold' : 'Truth Threshold'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                How confident the AI needs to be before accepting its own answer.
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Minimum truth score (0.0-1.0) for verification pass. Outputs below threshold trigger re-evaluation.
              </div>
            )}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={verification.truthThreshold !== undefined ? verification.truthThreshold : 0.7}
              onChange={(e) => onUpdate('verification.truthThreshold', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-slate-200 font-medium w-12 text-right">
              {(verification.truthThreshold !== undefined ? verification.truthThreshold : 0.7).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Environment Selector */}
        <div>
          <label className="block mb-3">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Strictness Level' : 'Environment'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Choose how strict verification should be for your use case
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Select environment profile to adjust verification thresholds
              </div>
            )}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {environments.map((env) => (
              <button
                key={env.id}
                onClick={() => onUpdate('verification.environment', env.id)}
                className={`glass-card p-4 text-center transition-all ${
                  verification.environment === env.id
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-slate-700/30'
                }`}
              >
                <div className="text-3xl mb-2">{env.icon}</div>
                <div className="text-sm font-medium text-slate-200 mb-1">{env.name}</div>
                <div className="text-xs text-slate-400">
                  {mode === 'eli5' ? env.eli5 : env.complex}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-3">About Verification</h3>
          {mode === 'eli5' ? (
            <div className="text-sm text-slate-300 space-y-2">
              <p>Verification makes Claude review its own work before giving you answers:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Claude generates an answer, then checks if it makes sense</li>
                <li>If confidence is too low, it tries again or asks for clarification</li>
                <li>You can be more or less strict depending on your needs</li>
                <li>Development allows quick iteration, production demands high confidence</li>
                <li>Helps catch mistakes and reduces hallucinations</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                The verification system implements truth scoring and multi-pass validation for agent outputs with environment-specific thresholds.
              </p>
              <div className="bg-slate-800/50 p-3 rounded text-sm space-y-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Verification Process:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Initial response generation with confidence scoring</li>
                    <li>Truth score evaluation against threshold</li>
                    <li>Re-evaluation or refinement if below threshold</li>
                    <li>Final output delivery with validation metadata</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Environment Profiles:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Development - Lower thresholds (~0.5) for speed</li>
                    <li>Staging - Medium thresholds (~0.7) for balanced verification</li>
                    <li>Production - Higher thresholds (~0.9) for quality assurance</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Works in conjunction with Security and Diagnostics sections for comprehensive output validation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
