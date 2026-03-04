import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EnvVarsSection from '../renderer/components/EnvVarsSection';
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

describe('EnvVarsSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Environment Variables heading', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Environment Variables')).toBeInTheDocument();
  });

  it('displays eli5 mode description', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Set API keys and configuration values that your AI tools need.')).toBeInTheDocument();
  });

  it('displays complex mode description', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Manage environment variables injected into agent and tool execution contexts.')).toBeInTheDocument();
  });

  it('renders all known environment variables', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('API Key')).toBeInTheDocument();
    expect(screen.getByText('Disable Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Use AWS Bedrock')).toBeInTheDocument();
    expect(screen.getByText('Use Google Vertex')).toBeInTheDocument();
    expect(screen.getByText('Skip Chrome Download')).toBeInTheDocument();
    expect(screen.getByText('Disable Prompt Caching')).toBeInTheDocument();
    expect(screen.getByText('Disable Auto-Compact')).toBeInTheDocument();
    expect(screen.getByText('Auto-Compact Threshold')).toBeInTheDocument();
    expect(screen.getByText('Enable Agent Teams')).toBeInTheDocument();
  });

  it('displays eli5 descriptions in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Your Anthropic API key')).toBeInTheDocument();
    expect(screen.getByText('Stop sending usage data')).toBeInTheDocument();
    expect(screen.getByText('Connect through Amazon cloud')).toBeInTheDocument();
  });

  it('displays complex descriptions in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('ANTHROPIC_API_KEY for direct API access')).toBeInTheDocument();
    expect(screen.getByText('Disable non-essential network traffic')).toBeInTheDocument();
    expect(screen.getByText('Route API calls through AWS Bedrock')).toBeInTheDocument();
  });

  it('displays environment variable names in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('ANTHROPIC_API_KEY')).toBeInTheDocument();
    expect(screen.getByText('CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC')).toBeInTheDocument();
    expect(screen.getByText('CLAUDE_CODE_USE_BEDROCK')).toBeInTheDocument();
  });

  it('toggles environment variable and sets value to "1"', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[0]); // Click first toggle (Disable Telemetry)

    expect(onUpdate).toHaveBeenCalledWith('env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', '1');
  });

  it('disables toggle by setting value to undefined', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          env: { CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');
    const activeToggle = Array.from(toggles).find(t => t.classList.contains('active'));
    fireEvent.click(activeToggle);

    expect(onUpdate).toHaveBeenCalledWith('env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', undefined);
  });

  it('shows active toggle when value is set', () => {
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          env: { CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1' },
        }}
        mode="complex"
        onUpdate={vi.fn()}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');
    const activeToggle = Array.from(toggles).find(t => t.classList.contains('active'));
    expect(activeToggle).toBeDefined();
  });

  it('updates text input env variable on change', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          env: { ANTHROPIC_API_KEY: 'old-key' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const input = screen.getByDisplayValue('old-key');
    fireEvent.change(input, { target: { value: 'new-key' } });

    expect(onUpdate).toHaveBeenCalledWith('env.ANTHROPIC_API_KEY', 'new-key');
  });

  it('displays custom environment variables section', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          env: { MY_CUSTOM_VAR: 'custom-value' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Custom Environment Variables')).toBeInTheDocument();
    expect(screen.getByText('MY_CUSTOM_VAR')).toBeInTheDocument();
    expect(screen.getByText('custom-value')).toBeInTheDocument();
  });

  it('allows adding custom environment variables', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Variable name (e.g., OPENAI_API_KEY)');
    const valueTextarea = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByText('Add Custom Variable');

    fireEvent.change(nameInput, { target: { value: 'NEW_VAR' } });
    fireEvent.change(valueTextarea, { target: { value: 'new-value' } });
    fireEvent.click(addButton);

    expect(onUpdate).toHaveBeenCalledWith('env.NEW_VAR', 'new-value');
  });

  it('clears inputs after adding custom variable', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Variable name (e.g., OPENAI_API_KEY)');
    const valueTextarea = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByText('Add Custom Variable');

    fireEvent.change(nameInput, { target: { value: 'NEW_VAR' } });
    fireEvent.change(valueTextarea, { target: { value: 'new-value' } });
    fireEvent.click(addButton);

    expect(nameInput.value).toBe('');
    expect(valueTextarea.value).toBe('');
  });

  it('does not add custom variable with empty name', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Variable name (e.g., OPENAI_API_KEY)');
    const valueTextarea = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByText('Add Custom Variable');

    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.change(valueTextarea, { target: { value: 'some-value' } });
    fireEvent.click(addButton);

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('allows deleting custom environment variables', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          env: { MY_CUSTOM_VAR: 'custom-value' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onUpdate).toHaveBeenCalledWith('env.MY_CUSTOM_VAR', undefined);
  });

  it('does not show custom variables in custom section if they match known vars', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          env: { ANTHROPIC_API_KEY: 'my-key' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    // The custom section should not display ANTHROPIC_API_KEY since it's a known var
    const customSection = screen.getByText('Custom Environment Variables').closest('.glass-card');
    const customVarItems = customSection.querySelectorAll('.flex.gap-2');

    expect(customVarItems.length).toBe(0); // Should not show any custom variables
  });
});
