import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PermissionsSection from '../renderer/components/PermissionsSection';
import { setupMocks } from './mocks';

const defaultSettings = {
  model: 'claude-opus-4-6',
  permissions: { allowed: [], denied: [] },
  env: {},
  hooks: {},
  security: {},
  swarm: { enabled: false },
  memory: { backend: 'sqlite' },
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

  it('shows allowed and denied tool sections', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('✓ Allowed Tools')).toBeInTheDocument();
    expect(screen.getByText('✗ Denied Tools')).toBeInTheDocument();
  });

  it('displays eli5 description in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(
      screen.getByText(
        /Define which tools are allowed or denied/
      )
    ).toBeInTheDocument();
  });

  it('does not display eli5 description in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(
      screen.queryByText(/Define which tools are allowed or denied/)
    ).not.toBeInTheDocument();
  });

  it('displays allowed tools list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allowed: ['Read', 'Write'], denied: [] },
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

  it('displays denied tools list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allowed: [], denied: ['Bash', 'Edit'] },
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

  it('removes allowed tool when remove button is clicked', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allowed: ['Read', 'Write'], denied: [] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allowed', ['Write']);
  });

  it('removes denied tool when remove button is clicked', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allowed: [], denied: ['Bash', 'Edit'] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[removeButtons.length - 1]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.denied', ['Bash']);
  });

  it('adds tool to allowed list via input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool name');
    const allowedInput = inputs[0];
    const addButtons = screen.getAllByText('Add');

    fireEvent.change(allowedInput, { target: { value: 'NewTool' } });
    fireEvent.click(addButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allowed', ['NewTool']);
  });

  it('adds tool to denied list via input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool name');
    const deniedInput = inputs[1];
    const addButtons = screen.getAllByText('Add');

    fireEvent.change(deniedInput, { target: { value: 'DangerousTool' } } );
    fireEvent.click(addButtons[1]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.denied', ['DangerousTool']);
  });

  it('adds tool via Enter key in allowed input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool name');
    fireEvent.change(inputs[0], { target: { value: 'NewTool' } });
    fireEvent.keyPress(inputs[0], { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onUpdate).toHaveBeenCalledWith('permissions.allowed', ['NewTool']);
  });

  it('adds tool via Enter key in denied input', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool name');
    fireEvent.change(inputs[1], { target: { value: 'DangerousTool' } });
    fireEvent.keyPress(inputs[1], { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onUpdate).toHaveBeenCalledWith('permissions.denied', ['DangerousTool']);
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

    const inputs = screen.getAllByPlaceholderText('Tool name');
    const addButtons = screen.getAllByText('Add');

    fireEvent.change(inputs[0], { target: { value: '' } });
    fireEvent.click(addButtons[0]);

    expect(onUpdate).not.toHaveBeenCalledWith('permissions.allowed', expect.anything());
  });

  it('shows quick add buttons for common tools', () => {
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

  it('quick adds tool to allowed list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const buttons = screen.getAllByText('Edit');
    const editButton = buttons.find((btn) =>
      btn.className.includes('bg-slate-700/30')
    );
    fireEvent.click(editButton);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allowed', ['Edit']);
  });

  it('quick adds tool to denied list', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const buttons = screen.getAllByText('Bash');
    const bashButton = buttons[buttons.length - 1];
    fireEvent.click(bashButton);

    expect(onUpdate).toHaveBeenCalledWith('permissions.denied', ['Bash']);
  });

  it('does not show already-allowed tools in allowed quick add buttons', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allowed: ['Read'], denied: [] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const readButtons = screen.getAllByText('Read');
    const quickAddButtons = readButtons.filter((btn) =>
      btn.className.includes('bg-slate-700/30')
    );

    expect(quickAddButtons.length).toBe(1); // Should only appear in denied section
  });

  it('does not show already-denied tools in denied quick add buttons', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: { allowed: [], denied: ['Bash'] },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const bashButtons = screen.getAllByText('Bash');
    const quickAddButtons = bashButtons.filter((btn) =>
      btn.className.includes('bg-slate-700/30')
    );

    expect(quickAddButtons.length).toBe(1); // Should only appear in allowed section
  });

  it('clears input after adding allowed tool', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool name');
    const allowedInput = inputs[0];
    const addButtons = screen.getAllByText('Add');

    fireEvent.change(allowedInput, { target: { value: 'NewTool' } });
    fireEvent.click(addButtons[0]);

    rerender(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const updatedInputs = screen.getAllByPlaceholderText('Tool name');
    expect(updatedInputs[0].value).toBe('');
  });

  it('clears input after adding denied tool', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('Tool name');
    const deniedInput = inputs[1];
    const addButtons = screen.getAllByText('Add');

    fireEvent.change(deniedInput, { target: { value: 'Dangerous' } });
    fireEvent.click(addButtons[1]);

    rerender(
      <PermissionsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const updatedInputs = screen.getAllByPlaceholderText('Tool name');
    expect(updatedInputs[1].value).toBe('');
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

    const inputs = screen.getAllByPlaceholderText('Tool name');
    const addButtons = screen.getAllByText('Add');

    fireEvent.change(inputs[0], { target: { value: '  TrimmedTool  ' } });
    fireEvent.click(addButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('permissions.allowed', ['TrimmedTool']);
  });

  it('handles multiple allowed tools correctly', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: {
            allowed: ['Read', 'Write', 'Edit', 'Bash'],
            denied: [],
          },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const tools = ['Read', 'Write', 'Edit', 'Bash'];
    tools.forEach((tool) => {
      const elements = screen.getAllByText(tool);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('handles multiple denied tools correctly', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: {
            allowed: [],
            denied: ['Rm', 'ForcePush', 'DeleteFile'],
          },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Rm')).toBeInTheDocument();
    expect(screen.getByText('ForcePush')).toBeInTheDocument();
    expect(screen.getByText('DeleteFile')).toBeInTheDocument();
  });

  it('shows both allowed and denied tools simultaneously', () => {
    const onUpdate = vi.fn();
    render(
      <PermissionsSection
        settings={{
          ...defaultSettings,
          permissions: {
            allowed: ['Read', 'Write'],
            denied: ['Bash', 'Edit'],
          },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const tools = ['Read', 'Write', 'Bash', 'Edit'];
    tools.forEach((tool) => {
      const elements = screen.getAllByText(tool);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
