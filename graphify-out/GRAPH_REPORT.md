# Graph Report - .  (2026-06-07)

## Corpus Check
- 80 files · ~59,025 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 207 nodes · 302 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Addons & Plugins|Addons & Plugins]]
- [[_COMMUNITY_Context & Env Sections|Context & Env Sections]]
- [[_COMMUNITY_Component Tests|Component Tests]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Model Tiers & Providers|Model Tiers & Providers]]
- [[_COMMUNITY_Sidebar & Theming|Sidebar & Theming]]
- [[_COMMUNITY_Swarm Config|Swarm Config]]
- [[_COMMUNITY_MCP Servers|MCP Servers]]
- [[_COMMUNITY_User Guide|User Guide]]
- [[_COMMUNITY_Capabilities|Capabilities]]
- [[_COMMUNITY_Settings Panel & ELI5|Settings Panel & ELI5]]
- [[_COMMUNITY_Skills Section|Skills Section]]
- [[_COMMUNITY_Permissions Settings|Permissions Settings]]
- [[_COMMUNITY_Electron Preload Bridge|Electron Preload Bridge]]

## God Nodes (most connected - your core abstractions)
1. `setupMocks()` - 21 edges
2. `scripts` - 7 edges
3. `MCP_CONFIGS` - 6 edges
4. `getProviderList()` - 5 edges
5. `getAddonRealSettings()` - 4 edges
6. `THEMES` - 4 edges
7. `getSettingsBySection()` - 3 edges
8. `MCP_SERVERS` - 3 edges
9. `MCP_CATEGORIES` - 3 edges
10. `PROVIDERS` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ModelTiersSection()` --calls--> `getProviderList()`  [EXTRACTED]
  src/renderer/components/ModelTiersSection.jsx → src/renderer/lib/modelProviders.js
- `SettingsPanel()` --calls--> `getSettingsBySection()`  [EXTRACTED]
  src/renderer/components/SettingsPanel.jsx → src/renderer/lib/eli5.js

## Import Cycles
- None detected.

## Communities (19 total, 5 thin omitted)

### Community 0 - "Addons & Plugins"
Cohesion: 0.09
Nodes (13): CATEGORIES, ADDONS, PLUGIN_PACKS, ADDON_SETTINGS_MAP, getAddonRealSettings(), getSettingSideEffects(), { app, BrowserWindow, Menu, ipcMain }, { execSync } (+5 more)

### Community 1 - "Context & Env Sections"
Cohesion: 0.06
Nodes (5): KNOWN_ENV_VARS, HOOK_ACTION_TYPES, HOOK_TYPES, COMMON_TOOLS, DEFAULT_MODES

### Community 2 - "Component Tests"
Cohesion: 0.11
Nodes (12): defaultSettings, defaultProps, defaultSettings, defaultSettings, defaultProps, mockElectronAPI, setupMocks(), defaultSettings (+4 more)

### Community 3 - "Package Manifest"
Cohesion: 0.07
Nodes (28): dependencies, react, react-dom, description, devDependencies, autoprefixer, concurrently, electron (+20 more)

### Community 4 - "Model Tiers & Providers"
Cohesion: 0.31
Nodes (7): ModelTiersSection(), getModelsForProvider(), getProviderEnvKey(), getProviderList(), MODEL_TIERS, PROVIDERS, CLAUDE_MODELS

### Community 5 - "Sidebar & Theming"
Cohesion: 0.24
Nodes (3): SECTIONS, applyTheme(), THEMES

### Community 6 - "Swarm Config"
Cohesion: 0.38
Nodes (7): AGENT_TYPES, COORDINATION_STRATEGIES, getAgentTypeInfo(), getTopologyDescription(), getTopologyList(), MESSAGE_PROTOCOLS, TOPOLOGIES

### Community 8 - "User Guide"
Cohesion: 0.32
Nodes (3): GUIDE_CATEGORIES, GUIDE_SECTIONS, GUIDES

### Community 10 - "Settings Panel & ELI5"
Cohesion: 0.38
Nodes (3): SettingsPanel(), getSettingsBySection(), SETTINGS_META

## Knowledge Gaps
- **54 isolated node(s):** `deny`, `name`, `version`, `description`, `main` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `setupMocks()` connect `Component Tests` to `Addons & Plugins`, `Sidebar & Theming`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `deny`, `name`, `version` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Addons & Plugins` be split into smaller, more focused modules?**
  _Cohesion score 0.09274193548387097 - nodes in this community are weakly interconnected._
- **Should `Context & Env Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Component Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.1103448275862069 - nodes in this community are weakly interconnected._
- **Should `Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._