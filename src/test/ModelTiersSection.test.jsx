import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModelTiersSection from '../renderer/components/ModelTiersSection';
import { MODEL_TIERS } from '../renderer/lib/modelTiers';

describe('ModelTiersSection', () => {
  const defaultSettings = {
    model: 'claude-opus-4-6',
    modelRouting: {
      planningModel: 'claude-opus-4-6',
      codingModel: 'claude-sonnet-4-6',
      boilerplateModel: 'claude-haiku-4-5',
      localModel: 'llama-3.1-70b',
    },
    permissions: { allow: [], deny: [] },
    env: {},
    hooks: {},
    security: {},
    swarm: { enabled: false },
    memory: { backend: 'sqlite' },
    addons: { installed: [] },
    mcpServers: {},
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('renders Model Tiers heading', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Model Tiers')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Model Tiers/i })).toBeInTheDocument();
  });

  it('displays mode-aware description for complex mode', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(
      screen.getByText(/Configure model routing tiers for task-specific optimization/i)
    ).toBeInTheDocument();
  });

  it('displays mode-aware description for eli5 mode', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(
      screen.getByText(/Choose which AI models to use for different types of tasks/i)
    ).toBeInTheDocument();
  });

  it('shows all 4 tier cards', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    MODEL_TIERS.forEach((tier) => {
      expect(screen.getByText(tier.name)).toBeInTheDocument();
    });

    expect(screen.getByText('Genius Tier')).toBeInTheDocument();
    expect(screen.getByText('Smart Tier')).toBeInTheDocument();
    expect(screen.getByText('Fast Tier')).toBeInTheDocument();
    expect(screen.getByText('Local Tier')).toBeInTheDocument();
  });

  it('each tier has model selection dropdown', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(MODEL_TIERS.length);
  });

  it('displays model options in dropdown for each tier', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    const firstTierSelect = selects[0];

    // Genius tier models should be available
    const options = firstTierSelect.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0].textContent).toContain('Claude Opus 4.6');
  });

  it('displays cost level bars', () => {
    const { container } = render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Check for cost bars (amber colored)
    const costBars = container.querySelectorAll('.bg-amber-400');
    expect(costBars.length).toBeGreaterThan(0);
  });

  it('displays speed level bars', () => {
    const { container } = render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Check for speed bars (green colored)
    const speedBars = container.querySelectorAll('.bg-green-400');
    expect(speedBars.length).toBeGreaterThan(0);
  });

  it('renders use case badges', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Check for specific use cases from the Genius tier
    expect(screen.getByText('Architecture planning')).toBeInTheDocument();
    expect(screen.getByText('Complex debugging')).toBeInTheDocument();
    expect(screen.getByText('Security analysis')).toBeInTheDocument();
  });

  it('calls onUpdate when model selection changes', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');
    const firstTierSelect = selects[0];

    // Change the first tier's model
    fireEvent.change(firstTierSelect, { target: { value: 'gpt-4' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('modelRouting.planningModel', 'gpt-4');
  });

  it('displays model details in available models section', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Check for model names in the available models section
    expect(screen.getByText('Claude Opus 4.6')).toBeInTheDocument();
    expect(screen.getByText('GPT-4')).toBeInTheDocument();
    expect(screen.getByText('Gemini Ultra')).toBeInTheDocument();
  });

  it('displays model provider information', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getAllByText('Anthropic')[0]).toBeInTheDocument();
    expect(screen.getAllByText('OpenAI')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Google')[0]).toBeInTheDocument();
  });

  it('displays correct icon for each tier', () => {
    const { container } = render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Check icons are rendered (they appear as text content)
    expect(screen.getByText('🧠')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('🏠')).toBeInTheDocument();
  });

  it('handles missing modelRouting settings gracefully', () => {
    const settingsWithoutRouting = {
      ...defaultSettings,
      modelRouting: undefined,
    };

    render(
      <ModelTiersSection
        settings={settingsWithoutRouting}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Model Tiers')).toBeInTheDocument();
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(MODEL_TIERS.length);
  });

  it('prefers eli5 descriptions when mode is eli5', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    // Check for eli5 specific text
    expect(
      screen.getByText(/The smartest AI models for really hard thinking tasks/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Smart AI models that are great for regular coding work/i)
    ).toBeInTheDocument();
  });

  it('displays free models correctly', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    // Local tier models are free (cost: 0)
    const freeLabels = screen.getAllByText('Free');
    expect(freeLabels.length).toBeGreaterThan(0);
  });

  it('calls onUpdate with correct path for different tiers', () => {
    render(
      <ModelTiersSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const selects = screen.getAllByRole('combobox');

    // Change Smart tier model (second tier)
    fireEvent.change(selects[1], { target: { value: 'gpt-4-turbo' } });
    expect(mockOnUpdate).toHaveBeenCalledWith(
      'modelRouting.codingModel',
      'gpt-4-turbo'
    );

    mockOnUpdate.mockClear();

    // Change Local tier model (fourth tier)
    fireEvent.change(selects[3], { target: { value: 'mistral-large' } });
    expect(mockOnUpdate).toHaveBeenCalledWith(
      'modelRouting.localModel',
      'mistral-large'
    );
  });
});
