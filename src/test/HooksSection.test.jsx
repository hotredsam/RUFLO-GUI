import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HooksSection from '../renderer/components/HooksSection';
import { setupMocks } from './mocks';

const defaultSettings = {
  model: 'claude-opus-4-6',
  permissions: { allow: [], deny: [] },
  env: {},
  hooks: {},
  security: {},
  swarm: { enabled: false },
  memory: { backend: 'sqlite' },
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
    expect(heading.textContent).toBe('Hooks Configuration');
  });

  it('shows hook configuration options when hooks exist', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
      },
    };

    render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Pre-Tool Hook')).toBeInTheDocument();
    expect(screen.getByDisplayValue('/usr/bin/notify-send')).toBeInTheDocument();
    expect(screen.getByDisplayValue('bash')).toBeInTheDocument();
  });

  it('displays mode-aware descriptions in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
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
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
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
    expect(screen.getByText('Hook Type')).toBeInTheDocument();
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

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', {
      enabled: true,
      command: '/bin/test-command',
      matcher: '',
      timeout: null,
    });
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
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
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
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
        PostToolUse: {
          enabled: false,
          command: '/bin/other',
          matcher: '',
          timeout: null,
        },
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

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks', {
      PostToolUse: {
        enabled: false,
        command: '/bin/other',
        matcher: '',
        timeout: null,
      },
    });
  });

  it('toggles hook enabled state', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
      },
    };

    const { container } = render(
      <HooksSection
        settings={settingsWithHooks}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggleSwitch = container.querySelector('.toggle-switch');
    fireEvent.click(toggleSwitch);

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', {
      enabled: false,
      command: '/usr/bin/notify-send',
      matcher: 'bash',
      timeout: 30,
    });
  });

  it('updates hook command', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
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

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', {
      enabled: true,
      command: '/bin/new-command',
      matcher: 'bash',
      timeout: 30,
    });
  });

  it('updates hook matcher pattern', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
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

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', {
      enabled: true,
      command: '/usr/bin/notify-send',
      matcher: 'bash,write',
      timeout: 30,
    });
  });

  it('updates hook timeout', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithHooks = {
      ...defaultSettings,
      hooks: {
        PreToolUse: {
          enabled: true,
          command: '/usr/bin/notify-send',
          matcher: 'bash',
          timeout: 30,
        },
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

    expect(mockOnUpdate).toHaveBeenCalledWith('hooks.PreToolUse', {
      enabled: true,
      command: '/usr/bin/notify-send',
      matcher: 'bash',
      timeout: 60,
    });
  });
});
