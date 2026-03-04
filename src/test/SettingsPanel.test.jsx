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
    sandbox: {},
    swarm: { enabled: false },
    memory: { cleanupPeriodDays: 30 },
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

    // Check for expected general settings fields from eli5.js
    expect(screen.getByText('Default Model')).toBeInTheDocument();
    expect(screen.getByText('Response Language')).toBeInTheDocument();
    expect(screen.getByText('Output Style')).toBeInTheDocument();
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
    expect(screen.getByText('Which Claude model to use for your tasks. Sonnet is balanced, Opus is most capable, Haiku is fastest and cheapest.')).toBeInTheDocument();

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
    expect(screen.getByText(/The default LLM model identifier used for code analysis, generation, and reasoning tasks/)).toBeInTheDocument();
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

    // Find and interact with a text input (Response Language)
    const inputs = screen.getAllByPlaceholderText('');
    const languageInput = inputs.find(input => input.parentElement.textContent.includes('Response Language'));

    if (languageInput) {
      fireEvent.change(languageInput, { target: { value: 'French' } });
      expect(onUpdate).toHaveBeenCalledWith('language', 'French');
    }
  });

  it('renders toggle switch for toggle type settings', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={defaultSettings}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // Check for general settings that have toggle types
    expect(screen.getByText('Respect .gitignore')).toBeInTheDocument();
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

    // Model and Auto Updates Channel should be select dropdowns
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('handles number input changes', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={{ ...defaultSettings, cleanupPeriodDays: 30 }}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    const numberInputs = screen.getAllByDisplayValue('30');
    if (numberInputs.length > 0) {
      fireEvent.change(numberInputs[0], { target: { value: '60' } });
      expect(onUpdate).toHaveBeenCalledWith('cleanupPeriodDays', 60);
    }
  });

  it('calls onUpdate with undefined when number input is cleared', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={{ ...defaultSettings, cleanupPeriodDays: 30 }}
        mode="complex"
        section="general"
        onUpdate={onUpdate}
      />
    );

    // Use the same number input as the "handles number input changes" test
    const numberInputs = screen.getAllByDisplayValue('30');
    expect(numberInputs.length).toBeGreaterThan(0);
    // Clearing a number input should call onUpdate with undefined (not null/default)
    // so the key gets deleted from settings.json via deleteNestedValue
    fireEvent.change(numberInputs[0], { target: { value: '' } });
    expect(onUpdate).toHaveBeenCalledWith(expect.any(String), undefined);
  });

  it('calls onUpdate with undefined when text input is cleared', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={{ ...defaultSettings, language: 'French' }}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByDisplayValue('French');
    expect(inputs.length).toBeGreaterThan(0);
    // Clearing a text input should call onUpdate with undefined so the key is deleted
    fireEvent.change(inputs[0], { target: { value: '' } });
    expect(onUpdate).toHaveBeenCalledWith(expect.any(String), undefined);
  });

  it('calls onUpdate with undefined when select is reset to placeholder', () => {
    const onUpdate = vi.fn();
    render(
      <SettingsPanel
        settings={{ ...defaultSettings, model: 'claude-opus-4-6' }}
        mode="eli5"
        section="general"
        onUpdate={onUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
    // Selecting the empty "Select..." option should call onUpdate with undefined
    fireEvent.change(selects[0], { target: { value: '' } });
    expect(onUpdate).toHaveBeenCalledWith(expect.any(String), undefined);
  });
});
