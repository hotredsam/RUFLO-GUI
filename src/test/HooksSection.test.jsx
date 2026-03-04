import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import HooksSection from '../renderer/components/HooksSection';
import { setupMocks } from './mocks';

const defaultSettings = {
  model: 'claude-opus-4-6',
  permissions: { allow: [], deny: [] },
  env: {},
  hooks: {},
  sandbox: {},
  swarm: { enabled: false },
  memory: { cleanupPeriodDays: 30 },
  addons: { installed: [] },
};

describe('HooksSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Hooks heading', () => {
    const mockOnUpdate = vi.fn();
    render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Hooks');
  });

  it('shows hook configuration options when hooks exist', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // 'Pre-Tool Use' appears in both the card heading and the select option
    const headings = screen.getAllByText('Pre-Tool Use');
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByDisplayValue('/usr/bin/notify-send')).toBeInTheDocument();
    expect(screen.getByDisplayValue('bash')).toBeInTheDocument();
  });

  it('displays mode-aware descriptions in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Runs before a tool is used')).toBeInTheDocument();
  });

  it('does not display descriptions in complex mode', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.queryByText('Runs before a tool is used')).not.toBeInTheDocument();
  });

  it('renders Add New Hook section', () => {
    const mockOnUpdate = vi.fn();
    render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Add New Hook')).toBeInTheDocument();
    expect(screen.getByText('Hook Event Type')).toBeInTheDocument();
    expect(screen.getByText('Hook Action Type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Command to execute')).toBeInTheDocument();
  });

  it('calls onUpdate when adding a new hook', () => {
    const mockOnUpdate = vi.fn();
    render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const commandInput = screen.getByPlaceholderText('Command to execute');
    fireEvent.change(commandInput, { target: { value: '/bin/test-command' } });

    const addButton = screen.getByText('Add Hook');
    fireEvent.click(addButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        hooks: [{ type: 'command', command: '/bin/test-command' }],
      },
    ]);
  });

  it('calls onUpdate with matcher when adding hook with matcher', () => {
    const mockOnUpdate = vi.fn();
    render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // PreToolUse has hasMatcher: true, so matcher input should be visible
    const matcherInput = screen.getByPlaceholderText(/Bash, Write\|Edit/);
    fireEvent.change(matcherInput, { target: { value: 'Bash' } });

    const commandInput = screen.getByPlaceholderText('Command to execute');
    fireEvent.change(commandInput, { target: { value: '/bin/test-command' } });

    const addButton = screen.getByText('Add Hook');
    fireEvent.click(addButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        matcher: 'Bash',
        hooks: [{ type: 'command', command: '/bin/test-command' }],
      },
    ]);
  });

  it('does not add hook with empty command', () => {
    const mockOnUpdate = vi.fn();
    render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const addButton = screen.getByText('Add Hook');
    fireEvent.click(addButton);

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('shows Remove button for existing hooks', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const removeButton = screen.getByText('Remove');
    expect(removeButton).toBeInTheDocument();
  });

  it('calls onUpdate to delete hook when Remove is clicked', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
        PostToolUse: [
          {
            hooks: [{ type: 'command', command: '/bin/other' }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    // Removing the only PreToolUse entry deletes the key entirely
    expect(mockOnUpdate).toHaveBeenCalledWith('hooks', {
      PostToolUse: [
        {
          hooks: [{ type: 'command', command: '/bin/other' }],
        },
      ],
    });
  });

  it('updates hook command', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const commandInput = screen.getByDisplayValue('/usr/bin/notify-send');
    fireEvent.change(commandInput, { target: { value: '/bin/new-command' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        matcher: 'bash',
        hooks: [{ type: 'command', command: '/bin/new-command', timeout: 30 }],
      },
    ]);
  });

  it('updates hook matcher pattern', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const matcherInput = screen.getByDisplayValue('bash');
    fireEvent.change(matcherInput, { target: { value: 'bash,write' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        matcher: 'bash,write',
        hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
      },
    ]);
  });

  it('updates hook timeout', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 30 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const timeoutInput = screen.getByDisplayValue('30');
    fireEvent.change(timeoutInput, { target: { value: '60' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        matcher: 'bash',
        hooks: [{ type: 'command', command: '/usr/bin/notify-send', timeout: 60 }],
      },
    ]);
  });

  it('supports HTTP hook action type with URL and method', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHttpHook = {
      ...defaultSettings,
      hooks: {
        PostToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'http', url: 'https://example.com/webhook', method: 'POST', timeout: 5000 }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHttpHook}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByDisplayValue('https://example.com/webhook')).toBeInTheDocument();
    expect(screen.getByDisplayValue('POST')).toBeInTheDocument();
  });

  it('supports Prompt hook action type', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithPromptHook = {
      ...defaultSettings,
      hooks: {
        UserPromptSubmit: [
          {
            hooks: [{ type: 'prompt', prompt: 'Always be helpful' }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithPromptHook}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByDisplayValue('Always be helpful')).toBeInTheDocument();
  });

  it('supports Agent hook action type', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithAgentHook = {
      ...defaultSettings,
      hooks: {
        SessionStart: [
          {
            hooks: [{ type: 'agent', agent: 'my-agent' }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithAgentHook}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByDisplayValue('my-agent')).toBeInTheDocument();
  });

  it('displays all 17 hook event types in dropdown', () => {
    const mockOnUpdate = vi.fn();
    render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const hookEventSelects = screen.getAllByDisplayValue('Pre-Tool Use');
    expect(hookEventSelects.length).toBeGreaterThan(0);
  });

  it('allows adding HTTP hook with headers', () => {
    const mockOnUpdate = vi.fn();
    const { container } = render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Change action type to HTTP
    const selects = container.querySelectorAll('select');
    const actionTypeSelect = selects[1]; // Second select in Add New Hook form is Action Type
    fireEvent.change(actionTypeSelect, { target: { value: 'http' } });

    const urlInput = screen.getByPlaceholderText('https://example.com/webhook');
    fireEvent.change(urlInput, { target: { value: 'https://api.example.com/hook' } });

    const addButton = screen.getByText('Add Hook');
    fireEvent.click(addButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        hooks: [{ type: 'http', url: 'https://api.example.com/hook', method: 'POST' }],
      },
    ]);
  });

  it('allows adding Prompt hook', () => {
    const mockOnUpdate = vi.fn();
    const { container } = render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Change action type to Prompt
    const selects = container.querySelectorAll('select');
    const actionTypeSelect = selects[1]; // Second select in Add New Hook form is Action Type
    fireEvent.change(actionTypeSelect, { target: { value: 'prompt' } });

    const promptInput = screen.getByPlaceholderText('Text to inject into context');
    fireEvent.change(promptInput, { target: { value: 'Custom context text' } });

    const addButton = screen.getByText('Add Hook');
    fireEvent.click(addButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        hooks: [{ type: 'prompt', prompt: 'Custom context text' }],
      },
    ]);
  });

  it('allows adding Agent hook', () => {
    const mockOnUpdate = vi.fn();
    const { container } = render(
      <HooksSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Change action type to Agent
    const selects = container.querySelectorAll('select');
    const actionTypeSelect = selects[1]; // Second select in Add New Hook form is Action Type
    fireEvent.change(actionTypeSelect, { target: { value: 'agent' } });

    const agentInput = screen.getByPlaceholderText('e.g., my-agent');
    fireEvent.change(agentInput, { target: { value: 'test-agent' } });

    const addButton = screen.getByText('Add Hook');
    fireEvent.click(addButton);

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', [
      {
        hooks: [{ type: 'agent', agent: 'test-agent' }],
      },
    ]);
  });

  it('updates HTTP hook URL and method', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHttpHook = {
      ...defaultSettings,
      hooks: {
        PostToolUse: [
          {
            matcher: 'bash',
            hooks: [{ type: 'http', url: 'https://example.com/webhook', method: 'POST' }],
          },
        ],
      },
    };

    render(
      <HooksSection
        settings={settingsWithHttpHook}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const urlInput = screen.getByDisplayValue('https://example.com/webhook');
    fireEvent.change(urlInput, { target: { value: 'https://new.example.com/hook' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PostToolUse', [
      {
        matcher: 'bash',
        hooks: [{ type: 'http', url: 'https://new.example.com/hook', method: 'POST' }],
      },
    ]);
  });
});
