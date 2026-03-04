# RUFLO GUI

A desktop application for visually managing Claude Code and Claude Code Flow (ruflo) settings. Instead of hand-editing `~/.claude/settings.json`, users can toggle, type, and browse through a dark glassmorphism interface. Built with Electron 33, React 18, Vite 6, and Tailwind CSS 3.

## Tech Stack

| Technology        | Version | Purpose                                  |
|-------------------|---------|------------------------------------------|
| JavaScript (JSX)  | ES2022  | Primary language (no TypeScript)         |
| React             | ^18.3   | UI framework                             |
| Electron          | ^33.2   | Desktop shell (main + renderer process)  |
| Vite              | ^6.0    | Dev server and bundler                   |
| Tailwind CSS      | ^3.4    | Utility-first CSS with custom glass tokens |
| Vitest            | ^4.0    | Testing framework                        |
| @testing-library/react | ^16.3 | Component testing                    |
| concurrently      | ^9.1    | Run Vite + Electron in parallel          |

Node.js 18+ and npm 9+ required.

## Folder Structure

```
RUFLO-GUI/
  package.json
  vite.config.js           # Vite config for renderer build
  vitest.config.js         # Separate Vitest config (jsdom, globals, css)
  tailwind.config.js       # Tailwind with custom glass/accent color tokens
  postcss.config.js        # PostCSS with Tailwind + Autoprefixer
  index.html               # Vite HTML entry
  src/
    main/
      main.js              # Electron main process (BrowserWindow, IPC, file I/O)
      preload.js           # contextBridge for secure renderer IPC
    renderer/
      main.jsx             # React entry point
      App.jsx              # Root component: settings state, auto-save, section routing
      index.css            # Tailwind directives + glassmorphism custom styles
      components/
        Sidebar.jsx        # Navigation panel + mode toggle + theme selector
        ModeToggle.jsx     # Complex/ELI5 mode switch
        SettingsPanel.jsx  # Generic key-value settings editor
        EnvVarsSection.jsx # ANTHROPIC_API_KEY, memory limits, Bedrock routing
        HooksSection.jsx   # PreToolUse, PostToolUse, Notification hooks
        SwarmSection.jsx   # Swarm topology, max agents, coordination
        MemorySection.jsx  # Storage backend, vector search, retention
        SecuritySection.jsx
        PermissionsSection.jsx
        AddonsMarketplace.jsx   # Browse and install 14 ruflo add-ons
        AddonCard.jsx           # Individual add-on display card
        MCPSection.jsx          # MCP server configuration
        ModelTiersSection.jsx   # Model selection tiers
        PluginsSection.jsx
        SkillsSection.jsx
        CapabilitiesSection.jsx
        ContextAutopilotSection.jsx
        VerificationSection.jsx
        CLAUDEMDSection.jsx     # CLAUDE.md template management
        DiagnosticsSection.jsx
        UserGuideSection.jsx
        StatusBar.jsx           # File path, save status, mode indicator
        ThemeSelector.jsx
      lib/
        settings-mapper.js # Side-effect logic when a setting changes
        addons.js          # 14 add-on definitions (id, name, features, install cmd)
        eli5.js            # ELI5-mode metadata (friendly labels, descriptions, types)
        themes.js          # Theme definitions and CSS variable application
        mcpServers.js      # MCP server config helpers
        modelProviders.js  # Model provider definitions
        modelTiers.js      # Model tier configuration
        plugins.js         # Plugin definitions
        skills.js          # Skill definitions
        swarmConfig.js     # Swarm topology config
        capabilities.js    # Capability definitions
        userGuide.js       # User guide content
    shared/
      mcpConfigs.js        # MCP server config constants (shared between main/renderer)
    test/
      setup.js             # Vitest setup (jsdom, @testing-library/jest-dom)
      *.test.jsx           # Component tests (one per component)
      mocks.js             # Mock window.electronAPI for tests
  dist/                    # Production build output
```

## Build, Run, and Test

```bash
npm install                # Install dependencies
npm run dev                # Start Vite dev server + Electron window concurrently
npm run build              # Vite production build -> dist/
npm run electron           # Launch Electron (requires Vite already running or dist/ built)
npm run test               # Run Vitest once (vitest run)
npm run test:watch         # Run Vitest in watch mode
```

## Settings File Location

The app reads and writes:
- Windows: `%USERPROFILE%\.claude\settings.json`
- macOS/Linux: `~/.claude/settings.json`

If the file does not exist, the app starts with `{}`. All changes auto-save with a 500ms debounce.

## Code Style

- Plain JavaScript with JSX (no TypeScript).
- Functional React components using hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
- Tailwind utility classes for all styling; custom glassmorphism CSS in `index.css`.
- CSS custom properties (`--accent-rgb`, `--bg-via`) for theme switching.
- CommonJS in the Electron main process (`require`); ES modules in the renderer.
- Vitest with jsdom, globals enabled, CSS processing on.
- One test file per component in `src/test/`.

## Patterns

- **Electron IPC bridge**: The main process exposes `readSettings`, `writeSettings`, `getSettingsPath`, `onSettingsChanged`, and `installAddon` via `preload.js` contextBridge. The renderer never accesses Node.js directly.
- **Auto-save with debounce**: `App.jsx` watches the `settings` state. On change, it waits 500ms then writes via IPC. External file changes are detected by a `fs.watch` in `main.js` and reloaded automatically.
- **Dual mode (Complex / ELI5)**: Every settings panel receives a `mode` prop. In ELI5 mode, metadata from `eli5.js` provides friendly labels and simplified controls.
- **Deep nested settings**: `setNestedValue` and `deleteNestedValue` in `App.jsx` handle dot-path writes (e.g., `"env.ANTHROPIC_API_KEY"`).
- **Side effects via settings-mapper**: When a setting changes, `getSettingSideEffects()` returns additional path/value pairs that should also be written (e.g., enabling swarm also sets coordination mode).
- **Theme system**: `themes.js` defines theme objects with CSS variable values. `applyTheme()` sets them on `:root`. Theme choice persists in localStorage.

## Important Files -- Do Not Delete

- `src/main/main.js` -- Electron main process; all IPC handlers live here.
- `src/main/preload.js` -- The only bridge between main and renderer.
- `src/renderer/App.jsx` -- Central state management and auto-save logic.
- `src/renderer/lib/settings-mapper.js` -- Controls real Claude Code setting side effects.
- `src/shared/mcpConfigs.js` -- Shared between main and renderer; changing structure breaks both.

## Gotchas and Warnings

- Do NOT enable `nodeIntegration` in the BrowserWindow. The app relies on contextIsolation + preload.
- Do NOT deep-clone settings with `structuredClone`; the codebase uses `JSON.parse(JSON.stringify(...))` for deep copies. Switching methods could break undefined-value handling.
- Do NOT rename IPC channel strings without updating both `main.js` and `preload.js`.
- The `window.electronAPI` mock in `src/test/mocks.js` must stay in sync with `preload.js` -- if you add a new IPC method, add it to the mock too.
- Tailwind content paths in `tailwind.config.js` only scan `src/renderer/**/*.{js,jsx}`. If you add files outside this path, Tailwind will not generate classes for them.
- The `NUL` file in the project root is a Windows artifact (likely from a redirected command). It can be safely deleted.
- Add-on installation runs `npx ruflo@latest install <addon>` but gracefully handles the CLI not being available. The settings file is always updated regardless.
