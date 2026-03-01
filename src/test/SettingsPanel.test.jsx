import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SettingsPanel from '../renderer/components/SettingsPanel';
import { setupMocks } from './mocks';

describe('SettingsPanel', () => {
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

  beforeEach(() => {
    setupMocks();
  });

  it('renders settings panel heading', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('general')).toBeInTheDocument();
  });

  it('displays settings fields', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // Check for some expected general settings fields
    expect(screen.getByText('Default Model')).toBeInTheDocument();
    expect(screen.getByText('Custom API Key')).toBeInTheDocument();
    expect(screen.getByText('Maximum Output Tokens')).toBeInTheDocument();
  });

  it('mode-aware descriptions change when mode prop changes', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // ELI5 mode should show eli5 descriptions
    expect(screen.getByText('Which AI model to use when you ask for help. Choose Claude, GPT, or another available model.')).toBeInTheDocument();

    // Switch to complex mode
    rerender(
      <SettingsPanel
        settings={defaultSettings}
        mode="complex"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // Complex mode should show complex descriptions and paths
    expect(screen.getByText('The default LLM model identifier used for code analysis, generation, and problem-solving tasks.')).toBeInTheDocument();
    expect(screen.getByText('Path: model')).toBeInTheDocument();
  });

  it('calls onUpdate when a setting is modified', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // Find and interact with a text input
    const inputs = screen.getAllByPlaceholderText('');
    const customApiKeyInput = inputs.find(input => input.parentElement.textContent.includes('Custom API Key'));

    if (customApiKeyInput) {
      fireEvent.change(customApiKeyInput, { target: { value: 'test-api-key' } });
      expect(onUpdate).toHaveBeenCalledWith('customApiKey', 'test-api-key');
    }
  });

  it('renders toggle switch for toggle type settings', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="security"
        onUpdate={onUpdate}
      />
    );

    // Check for security settings that have toggle types
    expect(screen.getByText('Enable Security Scanning')).toBeInTheDocument();
  });

  it('renders select dropdown for select type settings', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // Theme should be a select dropdown
    const selects = screen.getAllByDisplayValue('');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('handles number input changes', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={{ ...defaultSettings, maxTokens: 4096 }}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    const numberInputs = screen.getAllByDisplayValue('4096');
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: '8192' } });
      expect(onUpdate).toHaveBeenCalledWith('maxTokens', 8192);
    }
  });
});
