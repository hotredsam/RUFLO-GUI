<p align="center">
  <img src="https://img.shields.io/badge/Electron-33-47848F?style=for-the-badge&logo=electron&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

# RUFLO GUI

A sleek desktop application for managing **Claude Code Flow (ruflo)** and **Claude Code** settings through an intuitive visual interface. No more hand-editing JSON files.

---

## Features

### Dual-Mode Interface

| Complex Mode | ELI5 Mode |
|---|---|
| Full JSON-level control | Simplified toggles & sliders |
| Technical descriptions | Plain-English explanations |
| Raw config paths shown | Friendly labels only |
| For power users | For everyone |

Toggle between modes instantly with a single click.

### 7 Settings Panels

| Panel | What It Controls |
|---|---|
| **General Settings** | Default model, API key, temperature, max tokens, notifications |
| **Environment Variables** | `ANTHROPIC_API_KEY`, memory limits, Bedrock/Vertex routing, prompt caching, auto-compaction |
| **Hooks** | PreToolUse, PostToolUse, Notification, Stop, SubagentStop shell commands |
| **Swarm & Agents** | Enable swarm, topology (star/mesh/hierarchical), max agents, team name, coordination mode |
| **Memory & Learning** | Storage backend (SQLite/JSON/memory), HNSW vector search, retention period, auto-consolidation |
| **Security** | Security scanning, CVE checking, threat modeling, audit logging |
| **Permissions** | Allowed/denied tool lists with glob pattern support |

### Add-ons Marketplace

Browse and install 14 ruflo add-ons with one click:

| Add-on | Category |
|---|---|
| RuVector Intelligence | Intelligence |
| Memory Consolidation | Intelligence |
| AgentDB Persistence | Database |
| HNSW Vector Search | Search |
| Claude / GPT / Gemini / Ollama Providers | LLM Providers |
| Agent Booster WASM | Performance |
| Token Optimizer | Performance |
| Security Suite AIDefence | Security |
| GitHub Integration | Integration |
| Background Workers (12 types) | Workers |
| Reinforcement Learning (PPO, A2C, DQN, DDPG) | Learning |

Each add-on shows features, description, and an install button that runs `npx ruflo@latest install <addon>`.

### Quality of Life

- **Auto-save** with 500ms debounce -- changes write back to `settings.json` automatically
- **External change detection** -- if another process edits the file, the GUI reloads instantly
- **Dark glassmorphism theme** -- frosted glass panels on a deep slate gradient
- **Live status bar** -- shows file path, save status, last saved time, and current mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron 33 |
| UI Framework | React 18 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| IPC | contextBridge + ipcMain/ipcRenderer |
| File I/O | Node.js `fs` (reads/writes `~/.claude/settings.json`) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/hotredsam/RUFLO-GUI.git
cd RUFLO-GUI
npm install
npm run dev
```

This launches:
1. **Vite dev server** on `http://localhost:5173`
2. **Electron window** that loads the Vite server

### Build for Production

```bash
npm run build
```

Output goes to `dist/`.

---

## Project Structure

```
RUFLO-GUI/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main/
│   │   ├── main.js            # Electron main process
│   │   └── preload.js         # Secure IPC bridge
│   └── renderer/
│       ├── main.jsx           # React entry point
│       ├── App.jsx            # Root component with state management
│       ├── index.css          # Tailwind + glassmorphism styles
│       ├── components/
│       │   ├── Sidebar.jsx          # Navigation + mode toggle
│       │   ├── ModeToggle.jsx       # Complex/ELI5 switch
│       │   ├── SettingsPanel.jsx     # Generic settings editor
│       │   ├── EnvVarsSection.jsx    # Environment variables
│       │   ├── HooksSection.jsx      # Hook configuration
│       │   ├── SwarmSection.jsx      # Swarm & agents
│       │   ├── MemorySection.jsx     # Memory backend config
│       │   ├── SecuritySection.jsx   # Security settings
│       │   ├── PermissionsSection.jsx# Allow/deny lists
│       │   ├── AddonsMarketplace.jsx # Add-on browser
│       │   ├── AddonCard.jsx         # Individual add-on card
│       │   └── StatusBar.jsx         # Bottom status bar
│       └── lib/
│           ├── settings.js    # Nested object utilities
│           ├── addons.js      # 14 add-on definitions
│           └── eli5.js        # Settings metadata (labels, descriptions, types)
```

---

## Settings File

RUFLO GUI reads and writes:

```
%USERPROFILE%\.claude\settings.json     # Windows
~/.claude/settings.json                  # macOS / Linux
```

If the file doesn't exist, it starts with an empty config `{}`. All changes are auto-saved.

---

## License

MIT
