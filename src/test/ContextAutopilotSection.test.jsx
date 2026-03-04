import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContextAutopilotSection from '../renderer/components/ContextAutopilotSection';
import { setupMocks } from './mocks';

setupMocks();

const defaultProps = {
  settings: {
    contextAutopilot: {
      enabled: false,
      compactThreshold: 80,
      strategy: 'balanced',
    },
  },
  mode: 'complex',
  onUpdate: vi.fn(),
};

describe('ContextAutopilotSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading "Context Autopilot"', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    expect(screen.getByText('Context Autopilot')).toBeInTheDocument();
  });

  it('shows eli5 description in eli5 mode', () => {
    const props = {
      ...defaultProps,
      mode: 'eli5',
    };
    render(<ContextAutopilotSection {...props} />);
    expect(
      screen.getByText("Automatically manages conversation length so Claude doesn't forget things.")
    ).toBeInTheDocument();
  });

  it('shows complex description in complex mode', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    expect(
      screen.getByText('Configure context window management including auto-compaction thresholds and strategies.')
    ).toBeInTheDocument();
  });

  it('enable toggle renders', () => {
    const { container } = render(<ContextAutopilotSection {...defaultProps} />);
    const toggles = container.querySelectorAll('.toggle-switch');
    expect(toggles.length > 0).toBe(true);
  });

  it('clicking enable toggle calls onUpdate with correct value', () => {
    const onUpdate = vi.fn();
    const { container } = render(<ContextAutopilotSection {...defaultProps} onUpdate={onUpdate} />);
    const toggles = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[0]);
    expect(onUpdate).toHaveBeenCalledWith('contextAutopilot.enabled', true);
  });

  it('compact threshold slider renders with default value', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('80');
  });

  it('compact threshold shows percentage label', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('changing threshold calls onUpdate with parsed integer', () => {
    const onUpdate = vi.fn();
    render(<ContextAutopilotSection {...defaultProps} onUpdate={onUpdate} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });
    expect(onUpdate).toHaveBeenCalledWith('contextAutopilot.compactThreshold', 75);
  });

  it('renders 3 strategy cards', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    const strategyButtons = screen.getAllByRole('button').filter(btn =>
      btn.className.includes('glass-card') &&
      btn.textContent.includes('⚡')
    );
    expect(strategyButtons.length >= 1).toBe(true);

    expect(screen.getByText('Aggressive')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    expect(screen.getByText('Conservative')).toBeInTheDocument();
  });

  it('selected strategy has visual indicator with ring-2', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    const strategyCards = screen.getAllByRole('button').filter(btn =>
      btn.textContent.includes('Balanced')
    );
    const balancedCard = strategyCards[0];
    expect(balancedCard.className.includes('ring-2')).toBe(true);
  });

  it('clicking strategy card calls onUpdate with strategy id', () => {
    const onUpdate = vi.fn();
    render(<ContextAutopilotSection {...defaultProps} onUpdate={onUpdate} />);
    const aggressiveButtons = screen.getAllByRole('button').filter(btn =>
      btn.textContent.includes('Aggressive')
    );
    fireEvent.click(aggressiveButtons[0]);
    expect(onUpdate).toHaveBeenCalledWith('contextAutopilot.strategy', 'aggressive');
  });

  it('strategy cards show correct icons', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    expect(screen.getByText('⚡')).toBeInTheDocument(); // Aggressive
    expect(screen.getByText('⚖️')).toBeInTheDocument(); // Balanced
    expect(screen.getByText('🛡️')).toBeInTheDocument(); // Conservative
  });

  it('eli5 mode shows simplified strategy descriptions', () => {
    const props = {
      ...defaultProps,
      mode: 'eli5',
    };
    render(<ContextAutopilotSection {...props} />);
    expect(screen.getByText('Heavy compression, maximum space savings')).toBeInTheDocument();
    expect(screen.getByText('Moderate compression, keeps important details')).toBeInTheDocument();
    expect(screen.getByText('Minimal compression, keeps most detail')).toBeInTheDocument();
  });

  it('complex mode shows technical strategy descriptions', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    expect(screen.getByText('Maximum summarization for space optimization')).toBeInTheDocument();
    expect(screen.getByText('Balanced between space savings and context preservation')).toBeInTheDocument();
    expect(screen.getByText('Minimal information loss at the cost of less space savings')).toBeInTheDocument();
  });

  it('about section renders in eli5 mode', () => {
    const props = {
      ...defaultProps,
      mode: 'eli5',
    };
    render(<ContextAutopilotSection {...props} />);
    expect(screen.getByText('About Context Autopilot')).toBeInTheDocument();
    expect(
      screen.getByText('Context Autopilot helps Claude maintain conversation quality by automatically managing how much history is kept:')
    ).toBeInTheDocument();
  });

  it('about section renders in complex mode', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    expect(screen.getByText('About Context Autopilot')).toBeInTheDocument();
    expect(
      screen.getByText('Context Autopilot implements dynamic context window management with configurable compaction strategies and thresholds.')
    ).toBeInTheDocument();
  });

  it('handles missing contextAutopilot settings gracefully', () => {
    const props = {
      ...defaultProps,
      settings: {},
    };
    render(<ContextAutopilotSection {...props} />);
    expect(screen.getByText('Context Autopilot')).toBeInTheDocument();
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('80'); // Should use default value
  });

  it('slider respects min max and step values', () => {
    render(<ContextAutopilotSection {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '50');
    expect(slider).toHaveAttribute('max', '95');
    expect(slider).toHaveAttribute('step', '5');
  });

  it('threshold label updates when value changes', () => {
    const props = {
      ...defaultProps,
      settings: {
        contextAutopilot: {
          enabled: false,
          compactThreshold: 85,
          strategy: 'balanced',
        },
      },
    };
    render(<ContextAutopilotSection {...props} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
