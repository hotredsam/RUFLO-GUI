import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import EnvVarsSection from '../renderer/components/EnvVarsSection';
import { setupMocks } from './mocks';

describe('EnvVarsSection', () => {
  const defaultSettings = {
    model: 'claude-opus-4-6',
    permissions: { allow: [], deny: [] },
    env: {},
    hooks: {},
    security: {},
    swarm: { enabled: false },
    memory: { backend: 'sqlite' },
    addons: { installed: [] },
    environment: {},
  };

  beforeEach(() => {
    setupMocks();
  });

  it('renders Environment Variables heading', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Environment Variables')).toBeInTheDocument();
  });

  it('shows env var inputs', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    // Check for some expected environment variable labels
    expect(screen.getByText('Anthropic API Key')).toBeInTheDocument();
    expect(screen.getByText('Max Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('Disable Non-Essential Network Traffic')).toBeInTheDocument();
  });

  it('calls onUpdate when env var changed', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          environment: {
            ANTHROPIC_API_KEY: 'old-key',
          },
        }}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    // Find the Anthropic API Key input and change it
    const inputs = screen.getAllByDisplayValue('old-key');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'new-key' } });
      expect(onUpdate).toHaveBeenCalledWith('environment.ANTHROPIC_API_KEY', 'new-key');
    }
  });

  it('mode-aware text displays correctly in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    // ELI5 mode should show friendly descriptions
    expect(screen.getByText('Your API key from Anthropic to use Claude models. Get it from your Anthropic console.')).toBeInTheDocument();
    expect(screen.getByText('How much memory Claude Code can use. Set a limit to prevent your system from slowing down.')).toBeInTheDocument();
  });

  it('mode-aware text displays correctly in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    // Complex mode should show technical descriptions and var names
    expect(screen.getByText('Environment variable storing the authentication token for Anthropic Claude API access.')).toBeInTheDocument();
    expect(screen.getByText('ANTHROPIC_API_KEY')).toBeInTheDocument();
    expect(screen.getByText('CLAUDE_CODE_MAX_MEMORY')).toBeInTheDocument();
  });

  it('displays custom environment variables section', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          environment: {
            MY_CUSTOM_VAR: 'custom-value',
          },
        }}
        mode="eli5"
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
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Variable name (e.g., OPENAI_API_KEY)');
    const valueTextarea = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByText('Add Custom Variable');

    fireEvent.change(nameInput, { target: { value: 'NEW_VAR' } });
    fireEvent.change(valueTextarea, { target: { value: 'new-value' } });
    fireEvent.click(addButton);

    expect(onUpdate).toHaveBeenCalledWith('environment.NEW_VAR', 'new-value');
  });

  it('clears inputs after adding custom variable', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Variable name (e.g., OPENAI_API_KEY)');
    const valueTextarea = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByText('Add Custom Variable');

    fireEvent.change(nameInput, { target: { value: 'NEW_VAR' } });
    fireEvent.change(valueTextarea, { target: { value: 'new-value' } });
    fireEvent.click(addButton);

    // After adding, inputs should be cleared
    expect(nameInput.value).toBe('');
    expect(valueTextarea.value).toBe('');
  });

  it('does not add custom variable with empty name', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Variable name (e.g., OPENAI_API_KEY)');
    const valueTextarea = screen.getByPlaceholderText('Variable value');
    const addButton = screen.getByText('Add Custom Variable');

    // Try to add with empty name (should be trimmed)
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.change(valueTextarea, { target: { value: 'some-value' } });
    fireEvent.click(addButton);

    // onUpdate should not be called for empty name
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('allows deleting custom environment variables', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          environment: {
            MY_CUSTOM_VAR: 'custom-value',
          },
        }}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onUpdate).toHaveBeenCalledWith('environment', {});
  });

  it('handles number type environment variables', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          environment: {
            CLAUDE_CODE_MAX_MEMORY: '2048',
          },
        }}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    const numberInputs = screen.getAllByDisplayValue('2048');
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: '4096' } });
      expect(onUpdate).toHaveBeenCalledWith('environment.CLAUDE_CODE_MAX_MEMORY', 4096);
    }
  });

  it('handles toggle type environment variables', () => {
    const onUpdate = vi.fn();
    render(
      <EnvVarsSection
        settings={{
          ...defaultSettings,
          environment: {
            CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: false,
          },
        }}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    // Should render toggle switches for toggle-type env vars
    expect(screen.getByText('Disable Non-Essential Network Traffic')).toBeInTheDocument();
  });
});
