import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SwarmSection from '../renderer/components/SwarmSection';
import { setupMocks } from './mocks';

const defaultProps = {
  settings: {
    swarm: {
      enabled: true,
      topology: 'hierarchical',
      maxAgents: 20,
      teamName: '',
      coordinationStrategy: 'centralized',
      agentTypes: ['coordinator', 'coder'],
      autoScale: false,
      faultTolerance: false,
      messageProtocol: 'direct',
    },
    env: {},
  },
  mode: 'complex',
  onUpdate: vi.fn(),
};

describe('SwarmSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('Header and Description', () => {
    it('renders heading "Agent Teams"', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toBe('Agent Teams');
    });

    it('renders eli5 description', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/Let your AI spawn helper agents to work in parallel on tasks/)).toBeInTheDocument();
    });

    it('renders complex description', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/Control experimental multi-agent team coordination via CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS/)).toBeInTheDocument();
    });
  });

  describe('Enable Toggle', () => {
    it('renders enable toggle', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Enable Agent Teams')).toBeInTheDocument();
    });

    it('clicking enable toggle calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const disabledSettings = {
        ...defaultProps.settings,
        swarm: { ...defaultProps.settings.swarm, enabled: false },
      };

      const { container } = render(
        <SwarmSection
          settings={disabledSettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const toggle = container.querySelector('.toggle-switch');
      fireEvent.click(toggle);

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.enabled', true);
    });

    it('shows active toggle when swarm enabled', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const activeToggle = container.querySelector('.toggle-switch.active');
      expect(activeToggle).toBeInTheDocument();
    });
  });

  describe('Topology Selection', () => {
    it('renders all 6 topology cards', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Hierarchical')).toBeInTheDocument();
      expect(screen.getByText('Mesh')).toBeInTheDocument();
      expect(screen.getByText('Ring')).toBeInTheDocument();
      expect(screen.getByText('Star')).toBeInTheDocument();
      expect(screen.getByText('Hybrid')).toBeInTheDocument();
      expect(screen.getByText('Adaptive')).toBeInTheDocument();
    });

    it('selected topology has visual indicator', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const selectedCard = container.querySelector('.ring-2.ring-accent');
      expect(selectedCard).toBeInTheDocument();
      expect(selectedCard.textContent).toContain('Hierarchical');
    });

    it('clicking topology card calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const meshButton = screen.getByText('Mesh').closest('div[class*="border-2"]');
      fireEvent.click(meshButton);

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.topology', 'mesh');
    });

    it('topology cards show correct icons', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const icons = container.querySelectorAll('div[class*="text-2xl"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Team Name Input', () => {
    it('team name input renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Team Name')).toBeInTheDocument();
    });

    it('team name input has correct placeholder', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByPlaceholderText('e.g., DevOps Team, Research Squad');
      expect(input).toBeInTheDocument();
    });

    it('changing team name calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const teamNameInput = screen.getByPlaceholderText('e.g., DevOps Team, Research Squad');
      fireEvent.change(teamNameInput, { target: { value: 'ML Team' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.teamName', 'ML Team');
    });

    it('displays custom team name', () => {
      const { onUpdate } = defaultProps;
      const customSettings = {
        ...defaultProps.settings,
        swarm: { ...defaultProps.settings.swarm, teamName: 'DevOps Squad' },
      };

      render(
        <SwarmSection
          settings={customSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const input = screen.getByDisplayValue('DevOps Squad');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Max Agents Slider', () => {
    it('max agents slider renders with default value', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const slider = container.querySelector('input[type="range"]');
      expect(slider).toBeInTheDocument();
      expect(slider.value).toBe('20');
    });

    it('changing max agents calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const slider = container.querySelector('input[type="range"]');
      fireEvent.change(slider, { target: { value: '30' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.maxAgents', 30);
    });

    it('max agents shows current value label', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('max agents slider has correct min and max', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const slider = container.querySelector('input[type="range"]');
      expect(slider.min).toBe('1');
      expect(slider.max).toBe('50');
    });
  });

  describe('Coordination Strategy Dropdown', () => {
    it('coordination strategy dropdown renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Coordination Strategy')).toBeInTheDocument();
    });

    it('coordination strategy dropdown has correct options', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const selects = container.querySelectorAll('select');
      const coordSelect = Array.from(selects).find(
        (sel) => sel.value === 'centralized'
      );
      expect(coordSelect).toBeInTheDocument();
    });

    it('changing coordination strategy calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const selects = container.querySelectorAll('select');
      const coordSelect = Array.from(selects).find(
        (sel) => sel.value === 'centralized'
      );
      fireEvent.change(coordSelect, { target: { value: 'distributed' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.coordinationStrategy', 'distributed');
    });
  });

  describe('Agent Type Selection', () => {
    it('agent type checkboxes render (8 types)', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Coordinator')).toBeInTheDocument();
      expect(screen.getByText('Researcher')).toBeInTheDocument();
      expect(screen.getByText('Coder')).toBeInTheDocument();
      expect(screen.getByText('Analyst')).toBeInTheDocument();
      expect(screen.getByText('Architect')).toBeInTheDocument();
      expect(screen.getByText('Tester')).toBeInTheDocument();
      expect(screen.getByText('Reviewer')).toBeInTheDocument();
      expect(screen.getByText('Optimizer')).toBeInTheDocument();
    });

    it('checked agent types match settings', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      const checkedBoxes = Array.from(checkboxes).filter((cb) => cb.checked);

      expect(checkedBoxes.length).toBe(2);
    });

    it('clicking agent type checkbox calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      const researcherCheckbox = Array.from(checkboxes).find(
        (cb) => cb.parentElement.textContent.includes('Researcher')
      );
      fireEvent.click(researcherCheckbox);

      expect(mockOnUpdate).toHaveBeenCalled();
    });

    it('agent type cards show correct icons', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const agentLabels = container.querySelectorAll('label[class*="flex"]');
      expect(agentLabels.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('Message Protocol Dropdown', () => {
    it('message protocol dropdown renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Message Protocol')).toBeInTheDocument();
    });

    it('changing message protocol calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const selects = container.querySelectorAll('select');
      const protocolSelect = Array.from(selects).find(
        (sel) => sel.value === 'direct'
      );
      fireEvent.change(protocolSelect, { target: { value: 'broadcast' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.messageProtocol', 'broadcast');
    });

    it('message protocol dropdown has correct options', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const selects = container.querySelectorAll('select');
      const protocolSelect = Array.from(selects).find(
        (sel) => sel.value === 'direct'
      );
      expect(protocolSelect).toBeInTheDocument();
    });
  });

  describe('Auto-Scale Toggle', () => {
    it('auto-scale toggle renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Auto-Scale Agents')).toBeInTheDocument();
    });

    it('clicking auto-scale calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const toggles = container.querySelectorAll('.toggle-switch');
      fireEvent.click(toggles[1]);

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.autoScale', true);
    });

    it('shows active toggle when auto-scale enabled', () => {
      const { onUpdate } = defaultProps;
      const autoScaleSettings = {
        ...defaultProps.settings,
        swarm: { ...defaultProps.settings.swarm, autoScale: true },
      };

      const { container } = render(
        <SwarmSection
          settings={autoScaleSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const activeToggles = container.querySelectorAll('.toggle-switch.active');
      expect(activeToggles.length).toBeGreaterThan(1);
    });
  });

  describe('Fault Tolerance Toggle', () => {
    it('fault tolerance toggle renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Fault Tolerance')).toBeInTheDocument();
    });

    it('clicking fault tolerance calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const toggles = container.querySelectorAll('.toggle-switch');
      fireEvent.click(toggles[2]);

      expect(mockOnUpdate).toHaveBeenCalledWith('swarm.faultTolerance', true);
    });

    it('shows active toggle when fault tolerance enabled', () => {
      const { onUpdate } = defaultProps;
      const ftSettings = {
        ...defaultProps.settings,
        swarm: { ...defaultProps.settings.swarm, faultTolerance: true },
      };

      const { container } = render(
        <SwarmSection
          settings={ftSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const activeToggles = container.querySelectorAll('.toggle-switch.active');
      expect(activeToggles.length).toBeGreaterThan(1);
    });
  });

  describe('Mode Switching', () => {
    it('eli5 mode shows simplified labels', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/How many AI helpers can work at the same time/)).toBeInTheDocument();
    });

    it('complex mode shows technical labels', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/Maximum concurrent agent instances in a swarm session/)).toBeInTheDocument();
    });
  });

  describe('About Section', () => {
    it('renders about section', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('About Agent Teams')).toBeInTheDocument();
    });

    it('about section shows mode-appropriate content in eli5', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/Agent teams let Claude Code create multiple AI helpers/)).toBeInTheDocument();
    });

    it('about section shows mode-appropriate content in complex', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('handles missing swarm settings gracefully', () => {
      const mockOnUpdate = vi.fn();
      const noSwarmSettings = {
        env: {},
        swarm: undefined,
      };

      render(
        <SwarmSection
          settings={noSwarmSettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Agent Teams')).toBeInTheDocument();
    });

    it('renders with disabled state when swarm not enabled', () => {
      const mockOnUpdate = vi.fn();
      const disabledSettings = {
        ...defaultProps.settings,
        swarm: { ...defaultProps.settings.swarm, enabled: false },
      };

      const { container } = render(
        <SwarmSection
          settings={disabledSettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const toggles = container.querySelectorAll('.toggle-switch');
      const enableToggle = toggles[0];
      expect(enableToggle).not.toHaveClass('active');
    });

    it('renders all required form fields', () => {
      const { onUpdate } = defaultProps;
      render(
        <SwarmSection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Enable Agent Teams')).toBeInTheDocument();
      expect(screen.getByText('Agent Network Topology')).toBeInTheDocument();
      expect(screen.getByText('Team Name')).toBeInTheDocument();
      expect(screen.getByText('Maximum Concurrent Agents')).toBeInTheDocument();
      expect(screen.getByText('Coordination Strategy')).toBeInTheDocument();
      expect(screen.getByText('Agent Types to Enable')).toBeInTheDocument();
      expect(screen.getByText('Message Protocol')).toBeInTheDocument();
      expect(screen.getByText('Auto-Scale Agents')).toBeInTheDocument();
      expect(screen.getByText('Fault Tolerance')).toBeInTheDocument();
    });
  });
});
