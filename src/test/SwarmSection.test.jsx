import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SwarmSection from '../renderer/components/SwarmSection';
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

describe('SwarmSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Swarm & Agents heading', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Swarm & Agents');
  });

  it('shows swarm controls', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Enable Swarm')).toBeInTheDocument();
    expect(screen.getByText('Topology')).toBeInTheDocument();
    expect(screen.getByText('Max Agents')).toBeInTheDocument();
    expect(screen.getByText('Team Name')).toBeInTheDocument();
    expect(screen.getByText('Coordination Mode')).toBeInTheDocument();
  });

  it('displays mode-aware label for swarm enable toggle', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Enable Team Mode')).toBeInTheDocument();
    expect(screen.getByText('Allow multiple AI agents to work together on tasks')).toBeInTheDocument();
  });

  it('displays complex mode label for swarm enable toggle', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Enable Swarm')).toBeInTheDocument();
  });

  it('displays mode-aware descriptions for topology in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Team Structure')).toBeInTheDocument();
    expect(screen.getByText('How agents communicate with each other')).toBeInTheDocument();
  });

  it('displays complex mode label for topology', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Topology')).toBeInTheDocument();
  });

  it('displays mode-aware descriptions for max agents in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Maximum Team Size')).toBeInTheDocument();
    expect(screen.getByText('Maximum number of agents that can work together (1-20)')).toBeInTheDocument();
  });

  it('displays mode-aware descriptions for coordination mode in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('How Agents Work Together')).toBeInTheDocument();
    expect(screen.getByText('Sequential: Take turns, Parallel: Work at same time, Adaptive: Automatically choose best approach')).toBeInTheDocument();
  });

  it('displays complex mode label for coordination mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Coordination Mode')).toBeInTheDocument();
  });

  it('toggles swarm enabled state', () => {
    const mockOnUpdate = vi.fn();
    const swarmSettings = {
      ...defaultSettings,
      swarm: { enabled: false },
    };

    const { container } = render(
      <SwarmSection
        settings={swarmSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggleSwitch = container.querySelector('.toggle-switch');
    fireEvent.click(toggleSwitch);

    expect(mockOnUpdate).toHaveBeenCalledWith('swarm.enabled', true);
  });

  it('renders topology options', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const topologySelect = screen.getAllByRole('combobox')[0];
    fireEvent.click(topologySelect);

    expect(screen.getByText(/Star/)).toBeInTheDocument();
    expect(screen.getByText(/Mesh/)).toBeInTheDocument();
    expect(screen.getByText(/Hierarchical/)).toBeInTheDocument();
  });

  it('updates topology on selection change', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const topologySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(topologySelect, { target: { value: 'mesh' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('swarm.topology', 'mesh');
  });

  it('displays topology in complex mode', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithSwarm = {
      ...defaultSettings,
      swarm: { enabled: true, topology: 'mesh' },
    };

    render(
      <SwarmSection
        settings={settingsWithSwarm}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/Current: mesh/)).toBeInTheDocument();
  });

  it('updates max agents on range slider change', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const maxAgentsSlider = screen.getByRole('slider');
    fireEvent.change(maxAgentsSlider, { target: { value: '10' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('swarm.maxAgents', 10);
  });

  it('displays current max agents value', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithSwarm = {
      ...defaultSettings,
      swarm: { enabled: true, maxAgents: 8 },
    };

    render(
      <SwarmSection
        settings={settingsWithSwarm}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
  });

  it('displays default max agents value when not specified', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const maxAgentsSlider = screen.getByRole('slider');
    expect(maxAgentsSlider.value).toBe('5');
  });

  it('updates team name on input change', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const teamNameInput = screen.getByPlaceholderText('e.g., Engineering Team');
    fireEvent.change(teamNameInput, { target: { value: 'My Team' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('swarm.teamName', 'My Team');
  });

  it('displays existing team name', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithSwarm = {
      ...defaultSettings,
      swarm: { enabled: true, teamName: 'Engineering Team' },
    };

    render(
      <SwarmSection
        settings={settingsWithSwarm}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByDisplayValue('Engineering Team')).toBeInTheDocument();
  });

  it('updates coordination mode on selection change', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const coordinationModeSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(coordinationModeSelect, { target: { value: 'parallel' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('swarm.coordinationMode', 'parallel');
  });

  it('renders coordination mode options', () => {
    const mockOnUpdate = vi.fn();
    render(
      <SwarmSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const coordinationModeSelect = screen.getAllByRole('combobox')[1];
    fireEvent.click(coordinationModeSelect);

    expect(screen.getByText('Sequential')).toBeInTheDocument();
    expect(screen.getByText('Parallel')).toBeInTheDocument();
    expect(screen.getByText('Adaptive')).toBeInTheDocument();
  });
});
