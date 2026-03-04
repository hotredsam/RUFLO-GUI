import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ModelTiersSection from '../renderer/components/ModelTiersSection';
import { CLAUDE_MODELS, MODEL_SETTINGS_KEY } from '../renderer/lib/modelTiers';
import { getProviderList } from '../renderer/lib/modelProviders';

describe('ModelTiersSection', () => {
  const defaultProps = {
    settings: {
      model: 'claude-sonnet-4-6',
      modelTiers: {
        primary: { provider: 'anthropic', model: 'claude-opus-4-6' },
        secondary: { provider: 'openai', model: 'gpt-4o' },
        fallback: { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' },
        routing: { strategy: 'balanced', maxCostPerRequest: 0.5 },
      },
      env: { ANTHROPIC_API_KEY: 'sk-test' },
      permissions: { allow: [], deny: [] },
      hooks: {},
      sandbox: {},
      swarm: { enabled: false },
      memory: { cleanupPeriodDays: 30 },
      addons: { installed: [] },
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onUpdate.mockClear();
  });

  // Test 1: Renders heading "Model Selection & Routing"
  it('renders heading "Model Selection & Routing"', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getByText('Model Selection & Routing')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Model Selection & Routing/ })).toBeInTheDocument();
  });

  // Test 2: Shows eli5 description in eli5 mode
  it('shows eli5 description in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<ModelTiersSection {...props} />);
    expect(screen.getByText(/Choose your default Claude AI model/)).toBeInTheDocument();
  });

  // Test 3: Shows complex description in complex mode
  it('shows complex description in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<ModelTiersSection {...props} />);
    expect(screen.getByText(/Configure your primary model selection/)).toBeInTheDocument();
  });

  // Test 4: Renders model cards with names
  it('renders model cards with Claude Opus 4 name', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getAllByText('Claude Opus 4.6').length).toBeGreaterThan(0);
  });

  it('renders model cards with Claude Sonnet 4 name', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getAllByText('Claude Sonnet 4.6').length).toBeGreaterThan(0);
  });

  it('renders model cards with Claude Haiku 4.5 name', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getAllByText('Claude Haiku 4.5').length).toBeGreaterThan(0);
  });

  // Test 5: Shows model IDs in complex mode only
  it('shows model IDs in complex mode via code tags', () => {
    render(<ModelTiersSection {...defaultProps} mode="complex" />);
    expect(screen.getByText('claude-opus-4-6')).toBeInTheDocument();
    expect(screen.getByText('claude-sonnet-4-6')).toBeInTheDocument();
    expect(screen.getByText('claude-haiku-4-5-20251001')).toBeInTheDocument();
  });

  // Test 6: Does NOT show model IDs in eli5 mode
  it('does not show model IDs in eli5 mode', () => {
    render(<ModelTiersSection {...defaultProps} mode="eli5" />);
    expect(screen.queryByText('claude-opus-4-6')).not.toBeInTheDocument();
    expect(screen.queryByText('claude-sonnet-4-6')).not.toBeInTheDocument();
    expect(screen.queryByText('claude-haiku-4-5-20251001')).not.toBeInTheDocument();
  });

  // Test 7: Clicking a model card calls onUpdate with correct model ID
  it('calls onUpdate with MODEL_SETTINGS_KEY when clicking a model card', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    const { container } = render(<ModelTiersSection {...props} />);

    // Find the model card button (not the dropdown option)
    const modelButtons = container.querySelectorAll('button');
    const opusCard = Array.from(modelButtons).find(btn => btn.textContent.includes('Claude Opus 4.6') && btn.textContent.includes('Most Capable'));
    fireEvent.click(opusCard);

    expect(onUpdate).toHaveBeenCalledWith(MODEL_SETTINGS_KEY, 'claude-opus-4-6');
  });

  // Test 8: Renders routing strategy cards
  it('renders routing strategy "Save Money" card', () => {
    render(<ModelTiersSection {...defaultProps} />);
    const saveMoney = screen.getAllByText('Save Money');
    expect(saveMoney.length).toBeGreaterThan(0);
  });

  it('renders routing strategy "Best Results" card', () => {
    render(<ModelTiersSection {...defaultProps} />);
    const bestResults = screen.getAllByText('Best Results');
    expect(bestResults.length).toBeGreaterThan(0);
  });

  it('renders routing strategy "Balanced" card', () => {
    render(<ModelTiersSection {...defaultProps} />);
    // The "Balanced" text appears in the routing strategy cards
    const balancedCards = screen.getAllByText('Balanced');
    // Filter for the routing strategy card
    const strategyCard = balancedCards.find(el => el.closest('.glass-card')?.textContent.includes('⚖️'));
    expect(strategyCard).toBeDefined();
  });

  // Test 9: Clicking routing strategy card calls onUpdate
  it('calls onUpdate with strategy when clicking routing strategy card', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<ModelTiersSection {...props} />);

    const costCard = screen.getByText('Save Money').closest('button');
    fireEvent.click(costCard);

    expect(onUpdate).toHaveBeenCalledWith('modelTiers.routing.strategy', 'cost');
  });

  // Test 10: Shows tier configuration sections (Primary, Secondary, Fallback)
  it('renders Primary Tier section', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getByText(/Primary Tier/)).toBeInTheDocument();
  });

  it('renders Secondary Tier section', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getByText(/Secondary Tier/)).toBeInTheDocument();
  });

  it('renders Fallback Tier section', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getByText(/Fallback Tier/)).toBeInTheDocument();
  });

  // Test 11: Provider dropdown functionality
  it('displays provider dropdown and updates on change', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    const { container } = render(<ModelTiersSection {...props} />);

    // Primary tier is expanded by default, find the provider select
    const selects = container.querySelectorAll('select');
    const providerSelect = selects[0]; // First select is provider

    expect(providerSelect).toBeInTheDocument();
    fireEvent.change(providerSelect, { target: { value: 'openai' } });

    expect(onUpdate).toHaveBeenCalledWith('modelTiers.primary.provider', 'openai');
  });

  // Test 12: Model dropdown functionality
  it('displays model dropdown in expanded tier', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<ModelTiersSection {...props} />);

    // The primary tier should be expanded by default
    expect(screen.getByDisplayValue('Claude Opus 4.6')).toBeInTheDocument();
  });

  it('calls onUpdate when model selection changes in dropdown', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<ModelTiersSection {...props} />);

    // Find model dropdown (should be expanded for primary)
    const modelSelects = screen.getAllByDisplayValue('Claude Opus 4.6');
    const modelSelect = modelSelects[0];
    fireEvent.change(modelSelect, { target: { value: 'claude-sonnet-4-6' } });

    expect(onUpdate).toHaveBeenCalledWith('modelTiers.primary.model', 'claude-sonnet-4-6');
  });

  // Test 13: Max cost per request input
  it('displays max cost per request input with dollar prefix', () => {
    render(<ModelTiersSection {...defaultProps} />);
    expect(screen.getByText('Maximum Cost Per Request')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('calls onUpdate when max cost per request value changes', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<ModelTiersSection {...props} />);

    const costInput = screen.getByDisplayValue('0.5');
    fireEvent.change(costInput, { target: { value: '1.50' } });

    expect(onUpdate).toHaveBeenCalledWith('modelTiers.routing.maxCostPerRequest', 1.5);
  });

  it('calls onUpdate with undefined when max cost per request is cleared', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<ModelTiersSection {...props} />);

    const costInput = screen.getByDisplayValue('0.5');
    fireEvent.change(costInput, { target: { value: '' } });

    expect(onUpdate).toHaveBeenCalledWith('modelTiers.routing.maxCostPerRequest', undefined);
  });

  // Test 14: Provider API key status shows connected for configured providers
  it('shows green status for configured providers', () => {
    const props = {
      ...defaultProps,
      settings: {
        ...defaultProps.settings,
        env: { ANTHROPIC_API_KEY: 'sk-test' },
      },
    };
    render(<ModelTiersSection {...props} />);

    const configuredText = screen.getAllByText('Configured');
    expect(configuredText.length).toBeGreaterThan(0);
  });

  // Test 15: Provider API key status shows not configured for missing keys
  it('shows gray status for unconfigured providers', () => {
    const props = {
      ...defaultProps,
      settings: {
        ...defaultProps.settings,
        env: {},
      },
    };
    render(<ModelTiersSection {...props} />);

    const notConfiguredText = screen.getAllByText('Not configured');
    expect(notConfiguredText.length).toBeGreaterThan(0);
  });

  // Test 16: Info box renders with routing guidance text
  it('renders info box with eli5 routing guidance', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<ModelTiersSection {...props} />);

    expect(screen.getByText(/Your default model is used for most tasks/)).toBeInTheDocument();
  });

  it('renders info box with complex routing guidance', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<ModelTiersSection {...props} />);

    expect(screen.getByText(/Multi-tier routing enables intelligent provider selection/)).toBeInTheDocument();
  });

  // Test 17: eli5/complex mode switches descriptions throughout
  it('switches tier descriptions based on mode', () => {
    const { rerender } = render(<ModelTiersSection {...defaultProps} mode="eli5" />);
    expect(screen.getByText(/The main AI model used for most tasks/)).toBeInTheDocument();

    rerender(<ModelTiersSection {...defaultProps} mode="complex" />);
    expect(screen.getByText(/Primary inference tier/)).toBeInTheDocument();
  });

  // Test 18: Selected model card has visual indicator (ring-2 ring-accent)
  it('applies ring styling to selected model card', () => {
    const { container } = render(<ModelTiersSection {...defaultProps} />);

    // The selected model (Sonnet) should have ring-2 ring-accent
    const selectedCards = container.querySelectorAll('.ring-2.ring-accent');
    expect(selectedCards.length).toBeGreaterThan(0);
  });

  // Test 19: Selected routing strategy has visual indicator
  it('applies ring styling to selected routing strategy', () => {
    const { container } = render(<ModelTiersSection {...defaultProps} />);

    // Balanced should be selected and have ring-2 ring-accent
    const selectedStrategies = container.querySelectorAll('.ring-2.ring-accent');
    expect(selectedStrategies.length).toBeGreaterThan(0);
  });

  // Test 20: Handles missing/empty settings gracefully
  it('handles missing modelTiers gracefully', () => {
    const props = {
      ...defaultProps,
      settings: {
        model: 'claude-sonnet-4-6',
        env: {},
      },
    };
    render(<ModelTiersSection {...props} />);

    // Should render without crashing and show default values
    expect(screen.getByText('Model Selection & Routing')).toBeInTheDocument();
    expect(screen.getAllByText('Claude Sonnet 4.6').length).toBeGreaterThan(0);
  });

  it('handles missing env object gracefully', () => {
    const props = {
      ...defaultProps,
      settings: {
        model: 'claude-sonnet-4-6',
        modelTiers: defaultProps.settings.modelTiers,
      },
    };
    render(<ModelTiersSection {...props} />);

    // Should render without crashing
    expect(screen.getByText('Model Selection & Routing')).toBeInTheDocument();
  });

  // Additional test: Verify model tier emojis are displayed
  it('displays tier emojis for model cards', () => {
    render(<ModelTiersSection {...defaultProps} />);
    const allBrains = screen.getAllByText('🧠');
    const allLightning = screen.getAllByText('⚡');
    const allRockets = screen.getAllByText('🚀');
    // Haiku appears as 🚀, Sonnet as ⚡, Opus as 🧠
    expect(allBrains.length).toBeGreaterThan(0); // Most Capable (Opus)
    expect(allLightning.length).toBeGreaterThan(0); // Balanced (Sonnet)
    expect(allRockets.length).toBeGreaterThan(0); // Fastest (Haiku) and Best Results strategy
  });

  // Additional test: Verify routing strategy emojis
  it('displays emojis for routing strategies', () => {
    render(<ModelTiersSection {...defaultProps} />);
    const allMoney = screen.getAllByText('💰');
    const allRockets = screen.getAllByText('🚀');
    const allBalance = screen.getAllByText('⚖️');
    expect(allMoney.length).toBeGreaterThan(0); // Save Money
    expect(allRockets.length).toBeGreaterThan(0); // Best Results (rocket) - also appears in Haiku
    expect(allBalance.length).toBeGreaterThan(0); // Balanced
  });

  // Additional test: Expandable tier sections
  it('toggles tier section expansion on click', () => {
    const { container } = render(<ModelTiersSection {...defaultProps} />);

    // Primary is expanded by default, find the header
    const tierHeaders = container.querySelectorAll('.cursor-pointer');
    const primaryHeader = tierHeaders[0];

    // Should be expanded initially - check for select elements
    const initialSelects = container.querySelectorAll('select');
    expect(initialSelects.length).toBeGreaterThan(0);

    // Click to collapse
    fireEvent.click(primaryHeader);

    // After collapsing, verify the tier content is not visible
    const afterCollapseSelects = container.querySelectorAll('select');
    // The selects should be hidden/removed from DOM after collapse
    expect(afterCollapseSelects.length).toBeLessThan(initialSelects.length);
  });

  // Additional test: Provider status grid layout
  it('displays provider status for all available providers', () => {
    render(<ModelTiersSection {...defaultProps} />);

    const providers = getProviderList();
    providers.forEach((provider) => {
      // Provider names appear both in tier dropdowns and in status grid
      const matches = screen.getAllByText(provider.name);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // Additional test: Model descriptions change based on mode
  it('displays eli5 descriptions for models in eli5 mode', () => {
    render(<ModelTiersSection {...defaultProps} mode="eli5" />);

    // Check for model descriptions
    expect(screen.getByText(/Smart AI model that is great for regular coding work/)).toBeInTheDocument();
  });

  it('displays complex descriptions for models in complex mode', () => {
    render(<ModelTiersSection {...defaultProps} mode="complex" />);

    // Check for complex descriptions
    expect(screen.getByText(/Balanced capability-to-cost ratio model/)).toBeInTheDocument();
  });

  // Additional test: MODEL_SETTINGS_KEY is used for default model updates
  it('uses MODEL_SETTINGS_KEY constant for model updates', () => {
    expect(MODEL_SETTINGS_KEY).toBe('model');
  });

  // Additional test: Different model selection
  it('updates selected model when different model is clicked', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    const { container } = render(<ModelTiersSection {...props} />);

    // Find the Haiku model card button (the card with "Fastest" label)
    const modelButtons = container.querySelectorAll('button');
    const haikuCard = Array.from(modelButtons).find(btn => btn.textContent.includes('Claude Haiku 4.5') && btn.textContent.includes('Fastest'));
    fireEvent.click(haikuCard);

    expect(onUpdate).toHaveBeenCalledWith('model', 'claude-haiku-4-5-20251001');
  });
});
