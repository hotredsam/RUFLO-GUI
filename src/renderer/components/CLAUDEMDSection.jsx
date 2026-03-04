import React, { useState } from 'react';

export default function CLAUDEMDSection({ settings, mode, onUpdate }) {
  const claudemd = settings.claudemd || {};
  const [selectedCategory, setSelectedCategory] = useState('Project Type');

  const templateData = {
    'Project Type': [
      { id: 'web-app', name: 'Web App', eli5: 'React/Vue/Angular project', complex: 'Full-stack web application development with frontend frameworks' },
      { id: 'mobile-app', name: 'Mobile App', eli5: 'React Native/Flutter project', complex: 'Mobile application development using native or cross-platform frameworks' },
      { id: 'api-service', name: 'API Service', eli5: 'REST/GraphQL backend', complex: 'Backend API service development with microservices architecture' },
      { id: 'cli-tool', name: 'CLI Tool', eli5: 'Command-line application', complex: 'Command-line interface tool development' },
      { id: 'library', name: 'Library', eli5: 'Reusable code library', complex: 'Shareable library or SDK development' }
    ],
    'Methodology': [
      { id: 'agile', name: 'Agile', eli5: 'Sprints and iterations', complex: 'Agile development with iterative sprints and continuous feedback' },
      { id: 'tdd', name: 'TDD', eli5: 'Tests first, code second', complex: 'Test-Driven Development with tests written before implementation' },
      { id: 'sparc', name: 'SPARC', eli5: 'Planning-focused approach', complex: 'Systematic Planning And Requirements Clarification' }
    ],
    'Architecture': [
      { id: 'monolith', name: 'Monolith', eli5: 'Single application', complex: 'Monolithic architecture with all components in one codebase' },
      { id: 'microservices', name: 'Microservices', eli5: 'Multiple small services', complex: 'Microservices architecture with distributed, independent services' },
      { id: 'serverless', name: 'Serverless', eli5: 'Cloud functions', complex: 'Serverless computing with function-as-a-service deployment' }
    ],
    'Language': [
      { id: 'javascript', name: 'JavaScript', eli5: 'JS/TypeScript/Node.js', complex: 'JavaScript/TypeScript development environment' },
      { id: 'python', name: 'Python', eli5: 'Python 3.x', complex: 'Python programming language development' },
      { id: 'go', name: 'Go', eli5: 'Golang', complex: 'Go programming language development' },
      { id: 'rust', name: 'Rust', eli5: 'Rust programming', complex: 'Rust programming language development' }
    ],
    'Team Size': [
      { id: 'solo', name: 'Solo', eli5: 'Individual developer', complex: 'Single developer project' },
      { id: 'small-team', name: 'Small Team', eli5: '2-5 developers', complex: 'Small team of 2-5 developers' },
      { id: 'large-team', name: 'Large Team', eli5: '5+ developers', complex: 'Large team with 5 or more developers' }
    ]
  };

  const categories = Object.keys(templateData);

  return (
    <div className="p-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">CLAUDE.md Templates</h2>
        <p className="text-slate-400 text-sm">
          {mode === 'eli5'
            ? 'Choose a template that tells Claude how to work on your specific type of project.'
            : 'Manage CLAUDE.md instruction templates for project-specific agent configuration.'}
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-accent to-transparent rounded-full mt-3"></div>
      </div>

      <div className="space-y-6">
        {/* Auto-Generate Toggle */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-4 cursor-pointer">
            <div
              className={`toggle-switch ${claudemd.autoGenerate ? 'active' : ''}`}
              onClick={() => onUpdate('claudemd.autoGenerate', !claudemd.autoGenerate)}
            />
            <div>
              <div className="text-slate-200 font-medium">
                {mode === 'eli5' ? 'Auto-Generate CLAUDE.md' : 'Auto-Generate on Project Init'}
              </div>
              {mode === 'eli5' && (
                <div className="text-xs text-slate-400 mt-1">
                  Automatically create a CLAUDE.md file for new projects.
                </div>
              )}
              {mode === 'complex' && (
                <div className="text-xs text-slate-500 mt-1">
                  Enable automatic CLAUDE.md generation on project initialization.
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Custom Template Path */}
        <div className="glass-card p-6">
          <label className="block mb-2">
            <div className="text-slate-200 font-medium">
              {mode === 'eli5' ? 'Custom Template (Optional)' : 'Custom Template Path'}
            </div>
            {mode === 'eli5' && (
              <div className="text-xs text-slate-400 mt-1">
                Path to your own custom CLAUDE.md template file.
              </div>
            )}
            {mode === 'complex' && (
              <div className="text-xs text-slate-500 mt-1">
                Filesystem path to custom CLAUDE.md template. Overrides category selection.
              </div>
            )}
          </label>
          <input
            type="text"
            value={claudemd.templatePath !== undefined ? claudemd.templatePath : ''}
            onChange={(e) => onUpdate('claudemd.templatePath', e.target.value)}
            placeholder="/path/to/custom/claude.md"
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
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
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div>
          <h3 className="text-slate-200 font-medium mb-4">{selectedCategory}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {templateData[selectedCategory].map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onUpdate('claudemd.templateCategory', selectedCategory);
                  onUpdate('claudemd.templateName', template.id);
                }}
                className={`glass-card p-4 text-center transition-all relative ${
                  claudemd.templateName === template.id
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-slate-700/30'
                }`}
              >
                {claudemd.templateName === template.id && (
                  <div className="absolute top-2 right-2 text-accent text-lg">✓</div>
                )}
                <div className="text-sm font-medium text-slate-200 mb-2">{template.name}</div>
                <div className="text-xs text-slate-400">
                  {mode === 'eli5' ? template.eli5 : template.complex}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="glass-card p-6">
          <h3 className="text-slate-200 font-medium mb-3">About CLAUDE.md Templates</h3>
          {mode === 'eli5' ? (
            <div className="text-sm text-slate-300 space-y-2">
              <p>CLAUDE.md is a special file that tells Claude how to work on your project:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Contains instructions, guidelines, and project-specific context</li>
                <li>Claude reads this file at the start of each conversation</li>
                <li>Helps Claude understand your coding style and preferences</li>
                <li>Different templates work for different project types</li>
                <li>You can customize templates or create your own</li>
                <li>Auto-generation creates a template file automatically for new projects</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                CLAUDE.md templates provide project-specific instruction sets and context for agent initialization and behavior configuration.
              </p>
              <div className="bg-slate-800/50 p-3 rounded text-sm space-y-2">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Template Categories:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Project Type - Application domain and architecture style</li>
                    <li>Methodology - Development process and practices</li>
                    <li>Architecture - Deployment and structural patterns</li>
                    <li>Language - Programming language and ecosystem</li>
                    <li>Team Size - Collaboration scope and documentation level</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono">Features:</div>
                  <ul className="text-slate-400 text-xs space-y-1 mt-1">
                    <li>Automatic generation on project initialization</li>
                    <li>Custom template path override for specific files</li>
                    <li>Category-based template selection and composition</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Place or link a CLAUDE.md file in project root for Claude to discover it automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
