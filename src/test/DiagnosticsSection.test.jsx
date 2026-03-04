import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import DiagnosticsSection from '../renderer/components/DiagnosticsSection';

describe('DiagnosticsSection', () => {
  const defaultProps = {
    settings: {
      diagnostics: {
        verboseLogging: false,
        healthCheckInterval: 60,
      },
      env: {
        ANTHROPIC_API_KEY: 'sk-test',
      },
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onUpdate.mockClear();
  });

  // Test 1: Renders heading "Diagnostics"
  it('renders heading "Diagnostics"', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('Diagnostics')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Diagnostics/ })).toBeInTheDocument();
  });

  // Test 2: Shows eli5 description in eli5 mode
  it('shows eli5 description in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText(/Check if everything is working correctly and fix common problems/)).toBeInTheDocument();
  });

  // Test 3: Shows complex description in complex mode
  it('shows complex description in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText(/System diagnostics dashboard/)).toBeInTheDocument();
  });

  // Test 4: Renders 4 provider status cards
  it('renders 4 provider status cards', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('Anthropic')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Ollama')).toBeInTheDocument();
  });

  // Test 5: Shows green dot for connected provider (Anthropic with API key)
  it('shows green dot for connected provider (Anthropic with API key)', () => {
    const { container } = render(<DiagnosticsSection {...defaultProps} />);
    const greenDots = container.querySelectorAll('.bg-green-500');
    expect(greenDots.length).toBeGreaterThan(0);
  });

  // Test 6: Shows gray dot for unconfigured providers (OpenAI, Google, Ollama without keys)
  it('shows gray dot for unconfigured providers', () => {
    const { container } = render(<DiagnosticsSection {...defaultProps} />);
    const grayDots = container.querySelectorAll('.bg-slate-500');
    expect(grayDots.length).toBeGreaterThanOrEqual(3); // OpenAI, Google, Ollama
  });

  // Test 7: Shows "Connected" text for configured providers
  it('shows "Connected" text for configured providers', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    const connectedText = screen.getAllByText('Connected');
    expect(connectedText.length).toBeGreaterThan(0);
  });

  // Test 8: Shows "Not Configured" text for unconfigured providers
  it('shows "Not Configured" text for unconfigured providers', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    const notConfiguredText = screen.getAllByText('Not Configured');
    expect(notConfiguredText.length).toBeGreaterThanOrEqual(3);
  });

  // Test 9: Renders 4 health check items
  it('renders 4 health check items', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('API Key Validation')).toBeInTheDocument();
    expect(screen.getByText('MCP Server Connectivity')).toBeInTheDocument();
    expect(screen.getByText('Memory Backend Status')).toBeInTheDocument();
    expect(screen.getByText('Swarm Coordination Status')).toBeInTheDocument();
  });

  // Test 10: Verbose logging toggle renders
  it('verbose logging toggle renders', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    const toggleText = screen.getByText(/Verbose Logging|Detailed Logging/);
    expect(toggleText).toBeInTheDocument();
  });

  // Test 11: Shows "Detailed Logging" label in eli5 mode
  it('shows "Detailed Logging" label in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('Detailed Logging')).toBeInTheDocument();
  });

  // Test 12: Shows "Verbose Logging" label in complex mode
  it('shows "Verbose Logging" label in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('Verbose Logging')).toBeInTheDocument();
  });

  // Test 13: Clicking verbose logging toggle calls onUpdate
  it('clicking verbose logging toggle calls onUpdate', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    const { container } = render(<DiagnosticsSection {...props} />);

    const toggleSwitch = container.querySelector('.toggle-switch');
    fireEvent.click(toggleSwitch);

    expect(onUpdate).toHaveBeenCalledWith('diagnostics.verboseLogging', true);
  });

  // Test 14: Health check interval input renders with default 60
  it('health check interval input renders with default 60', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    const input = screen.getByDisplayValue('60');
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('number');
  });

  // Test 15: Changing interval calls onUpdate
  it('changing interval calls onUpdate', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<DiagnosticsSection {...props} />);

    const input = screen.getByDisplayValue('60');
    fireEvent.change(input, { target: { value: '120' } });

    expect(onUpdate).toHaveBeenCalledWith('diagnostics.healthCheckInterval', 120);
  });

  // Test 16: Version info shows "1.0.0"
  it('version info shows "1.0.0"', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  // Test 17: Version info shows mode label based on current mode
  it('version info shows "Advanced" mode label in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('version info shows "Beginner Friendly" mode label in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('Beginner Friendly')).toBeInTheDocument();
  });

  // Test 18: Handles missing diagnostics settings gracefully
  it('handles missing diagnostics settings gracefully', () => {
    const props = {
      ...defaultProps,
      settings: {
        env: { ANTHROPIC_API_KEY: 'sk-test' },
      },
    };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('Diagnostics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60')).toBeInTheDocument();
  });

  // Test 19: About section renders
  it('about section renders', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('About Diagnostics')).toBeInTheDocument();
  });

  // Test 20: Platform shows "Electron"
  it('platform shows "Electron"', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('Electron')).toBeInTheDocument();
  });

  // Test 21: Shows provider emojis
  it('shows provider emojis', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('🤖')).toBeInTheDocument(); // Anthropic
    expect(screen.getByText('🔮')).toBeInTheDocument(); // OpenAI
    expect(screen.getByText('🔍')).toBeInTheDocument(); // Google
    expect(screen.getByText('🦙')).toBeInTheDocument(); // Ollama
  });

  // Test 22: Shows health check emojis
  it('shows health check emojis', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('🔑')).toBeInTheDocument(); // API Key
    expect(screen.getByText('🔗')).toBeInTheDocument(); // MCP Server
    expect(screen.getByText('💾')).toBeInTheDocument(); // Memory
    expect(screen.getByText('🐝')).toBeInTheDocument(); // Swarm
  });

  // Test 23: Shows "seconds" label for health check interval
  it('shows "seconds" label for health check interval', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    expect(screen.getByText('seconds')).toBeInTheDocument();
  });

  // Test 24: Multiple providers connected when multiple env keys are set
  it('shows multiple providers connected when env keys are present', () => {
    const props = {
      ...defaultProps,
      settings: {
        diagnostics: {
          verboseLogging: false,
          healthCheckInterval: 60,
        },
        env: {
          ANTHROPIC_API_KEY: 'sk-test',
          OPENAI_API_KEY: 'sk-openai',
          GOOGLE_AI_API_KEY: 'key-google',
        },
      },
    };
    render(<DiagnosticsSection {...props} />);
    const connectedText = screen.getAllByText('Connected');
    expect(connectedText.length).toBe(3);
  });

  // Test 25: Health check interval has min/max attributes
  it('health check interval has min/max constraints', () => {
    render(<DiagnosticsSection {...defaultProps} />);
    const input = screen.getByDisplayValue('60');
    expect(input.min).toBe('10');
    expect(input.max).toBe('600');
  });

  // Test 26: Shows eli5 heading for provider connections in eli5 mode
  it('shows eli5 heading for provider connections in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('Provider Connections')).toBeInTheDocument();
  });

  // Test 27: Shows complex heading for system status in complex mode
  it('shows complex heading for system status in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<DiagnosticsSection {...props} />);
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });
});
