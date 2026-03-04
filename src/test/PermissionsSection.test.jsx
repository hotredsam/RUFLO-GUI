import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PermissionsSection from '../renderer/components/PermissionsSection';
import { setupMocks } from './mocks';

const defaultSettings = {
  model: 'claude-opus-4-6',
  permissions: { allow: [], ask: [], deny: [] },
  env: {},
  hooks: {},
  sandbox: {},
  swarm: { enabled: false },
  memory: { cleanupPeriodDays: 30 },
  addons: { installed: [] },
};

describe('PermissionsSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Permissions heading', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Permissions')).toBeInTheDocument();
  });

  it('displays eli5 description', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Control which tools the AI can use and how it should ask for permission.')).toBeInTheDocument();
  });

  it('displays complex description', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Manage tool-level allow\/ask\/deny rules/)).toBeInTheDocument();
  });

  it('shows Allow, Ask, Deny columns', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Allow')).toBeInTheDocument();
    expect(screen.getByText('Ask')).toBeInTheDocument();
    expect(screen.getByText('Deny')).toBeInTheDocument();
  });

  it('renders default mode select dropdown', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('displays current default mode selection', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: [], deny: [], defaultMode: 'acceptEdits' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    expect(selects[0].value).toBe('acceptEdits');
  });

  it('updates default mode on selection change', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'plan' } });

    expect(onUpdate).toHaveBeenCalledWith('permissions.defaultMode', 'plan');
  });

  it('displays allowed tools list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: ['Read', 'Write'], ask: [], deny: [] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const readElements = screen.getAllByText('Read');
    const writeElements = screen.getAllByText('Write');
    expect(readElements.length).toBeGreaterThan(0);
    expect(writeElements.length).toBeGreaterThan(0);
  });

  it('displays asked tools list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: ['Bash', 'Edit'], deny: [] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const bashElements = screen.getAllByText('Bash');
    const editElements = screen.getAllByText('Edit');
    expect(bashElements.length).toBeGreaterThan(0);
    expect(editElements.length).toBeGreaterThan(0);
  });

  it('displays denied tools list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: [], deny: ['Rm', 'ForcePush'] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Rm')).toBeInTheDocument();
    expect(screen.getByText('ForcePush')).toBeInTheDocument();
  });

  it('removes tool from allow list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: ['Read'], ask: [], deny: [] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allow', []);
  });

  it('removes tool from ask list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: ['Bash'], deny: [] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.ask', []);
  });

  it('removes tool from deny list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: [], deny: ['Rm'] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.deny', []);
  });

  it('adds tool to allow list via input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool or pattern');
    fireEvent.change(inputs[0], { target: { value: 'NewTool' } });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allow', ['NewTool']);
  });

  it('adds tool to ask list via input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool or pattern');
    fireEvent.change(inputs[1], { target: { value: 'AskTool' } });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[1]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.ask', ['AskTool']);
  });

  it('adds tool to deny list via input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool or pattern');
    fireEvent.change(inputs[2], { target: { value: 'DenyTool' } });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[2]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.deny', ['DenyTool']);
  });

  it('adds tool via Enter key in allow input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool or pattern');
    fireEvent.change(inputs[0], { target: { value: 'EnterTool' } });
    fireEvent.keyDown(inputs[0], { key: 'Enter' });

    expect(onUpdate).toHaveBeenCalledWith('permissions.allow', ['EnterTool']);
  });

  it('does not add empty tool names', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool or pattern');
    fireEvent.change(inputs[0], { target: { value: '   ' } });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('shows common tools as quick add buttons', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const commonTools = ['Edit', 'Write', 'Read', 'Bash', 'Grep', 'Glob', 'WebFetch', 'WebSearch'];
    commonTools.forEach((tool) => {
      const elements = screen.getAllByText(tool);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('quick adds tool to allow list', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const quickAddButtons = container.querySelectorAll('.bg-slate-700\\/30');
    const editButton = Array.from(quickAddButtons).find(btn => btn.textContent === 'Edit');
    fireEvent.click(editButton);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allow', ['Edit']);
  });

  it('trims whitespace when adding tools', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool or pattern');
    fireEvent.change(inputs[0], { target: { value: '  TrimmedTool  ' } });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allow', ['TrimmedTool']);
  });

  it('displays Additional Directories section', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Additional Directories')).toBeInTheDocument();
  });

  it('displays additional directories list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: [], deny: [], additionalDirectories: ['/home/user/project'] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('/home/user/project')).toBeInTheDocument();
  });

  it('adds additional directory', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const pathInput = screen.getByPlaceholderText('/path/to/directory');
    fireEvent.change(pathInput, { target: { value: '/home/user/docs' } });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[addButtons.length - 1]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.additionalDirectories', ['/home/user/docs']);
  });

  it('removes additional directory', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: [], deny: [], additionalDirectories: ['/home/user/project'] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.additionalDirectories', []);
  });

  it('displays Disable Bypass Mode toggle', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Disable bypassPermissions Mode')).toBeInTheDocument();
  });

  it('toggles disable bypass mode', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggle = document.querySelector('.toggle-switch');
    fireEvent.click(toggle);

    expect(onUpdate).toHaveBeenCalledWith('permissions.disableBypassPermissionsMode', true);
  });

  it('shows active toggle when disable bypass mode is true', () => {
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: [], ask: [], deny: [], disableBypassPermissionsMode: true },
        }}
        mode="complex"
        onUpdate={vi.fn()}
      />
    );

    const toggle = document.querySelector('.toggle-switch.active');
    expect(toggle).toBeInTheDocument();
  });

  it('does not show quick add buttons for already-added tools in allow', () => {
    const { container } = render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allow: ['Edit'], ask: [], deny: [] },
        }}
        mode="complex"
        onUpdate={vi.fn()}
      />
    );

    const quickAddButtons = container.querySelectorAll('.bg-slate-700\\/30');
    const editButtons = Array.from(quickAddButtons).filter(btn => btn.textContent === 'Edit');

    // Edit should only appear in Ask and Deny columns, not Allow
    expect(editButtons.length).toBeLessThan(3);
  });

  it('handles all permission lists simultaneously', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: {
            allow: ['Read', 'Write'],
            ask: ['Bash'],
            deny: ['Rm'],
            defaultMode: 'plan',
            additionalDirectories: ['/tmp'],
            disableBypassPermissionsMode: false,
          },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getAllByText('Read').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Write').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bash').length).toBeGreaterThan(0);
    expect(screen.getByText('Rm')).toBeInTheDocument();
    expect(screen.getByText('/tmp')).toBeInTheDocument();
  });
});
