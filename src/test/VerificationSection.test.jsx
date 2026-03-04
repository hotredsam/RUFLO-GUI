import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VerificationSection from '../renderer/components/VerificationSection';
import { setupMocks } from './mocks';

setupMocks();

const defaultProps = {
  settings: {
    verification: {
      enabled: false,
      truthThreshold: 0.7,
      environment: 'development',
    },
  },
  mode: 'complex',
  onUpdate: vi.fn(),
};

describe('VerificationSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading "Verification"', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(screen.getByText('Verification')).toBeInTheDocument();
  });

  it('shows eli5 description in eli5 mode', () => {
    const props = {
      ...defaultProps,
      mode: 'eli5',
    };
    render(<VerificationSection {...props} />);
    expect(
      screen.getByText("Makes Claude double-check its work before giving you answers.")
    ).toBeInTheDocument();
  });

  it('shows complex description in complex mode', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(
      screen.getByText('Configure the verification system with truth scoring thresholds for validating agent outputs.')
    ).toBeInTheDocument();
  });

  it('enable toggle renders', () => {
    const { container } = render(<VerificationSection {...defaultProps} />);
    const toggles = container.querySelectorAll('.toggle-switch');
    expect(toggles.length > 0).toBe(true);
  });

  it('clicking enable toggle calls onUpdate with correct value', () => {
    const onUpdate = vi.fn();
    const { container } = render(<VerificationSection {...defaultProps} onUpdate={onUpdate} />);
    const toggles = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[0]);
    expect(onUpdate).toHaveBeenCalledWith('verification.enabled', true);
  });

  it('truth threshold slider renders with default value', () => {
    render(<VerificationSection {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('0.7');
  });

  it('truth threshold shows current value label with fixed decimal places', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(screen.getByText('0.70')).toBeInTheDocument();
  });

  it('changing threshold calls onUpdate with parsed float', () => {
    const onUpdate = vi.fn();
    render(<VerificationSection {...defaultProps} onUpdate={onUpdate} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '0.85' } });
    expect(onUpdate).toHaveBeenCalledWith('verification.truthThreshold', 0.85);
  });

  it('renders 3 environment cards', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Staging')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
  });

  it('selected environment has visual indicator with ring-2', () => {
    render(<VerificationSection {...defaultProps} />);
    const devCards = screen.getAllByRole('button').filter(btn =>
      btn.textContent.includes('Development')
    );
    const devCard = devCards[0];
    expect(devCard.className.includes('ring-2')).toBe(true);
  });

  it('clicking environment card calls onUpdate with environment id', () => {
    const onUpdate = vi.fn();
    render(<VerificationSection {...defaultProps} onUpdate={onUpdate} />);
    const prodButtons = screen.getAllByRole('button').filter(btn =>
      btn.textContent.includes('Production')
    );
    fireEvent.click(prodButtons[0]);
    expect(onUpdate).toHaveBeenCalledWith('verification.environment', 'production');
  });

  it('environment cards show correct icons', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(screen.getByText('🔧')).toBeInTheDocument(); // Development
    expect(screen.getByText('🧪')).toBeInTheDocument(); // Staging
    expect(screen.getByText('🛡️')).toBeInTheDocument(); // Production
  });

  it('eli5 mode shows simplified environment descriptions', () => {
    const props = {
      ...defaultProps,
      mode: 'eli5',
    };
    render(<VerificationSection {...props} />);
    expect(screen.getByText('Relaxed checking for dev work')).toBeInTheDocument();
    expect(screen.getByText('Moderate checking for testing')).toBeInTheDocument();
    expect(screen.getByText('Strict checking for production')).toBeInTheDocument();
  });

  it('complex mode shows technical environment descriptions', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(screen.getByText('Relaxed thresholds for development iteration speed')).toBeInTheDocument();
    expect(screen.getByText('Moderate thresholds balancing quality and speed')).toBeInTheDocument();
    expect(screen.getByText('Strictest thresholds for production-grade output quality')).toBeInTheDocument();
  });

  it('about section renders in eli5 mode', () => {
    const props = {
      ...defaultProps,
      mode: 'eli5',
    };
    render(<VerificationSection {...props} />);
    expect(screen.getByText('About Verification')).toBeInTheDocument();
    expect(
      screen.getByText('Verification makes Claude review its own work before giving you answers:')
    ).toBeInTheDocument();
  });

  it('about section renders in complex mode', () => {
    render(<VerificationSection {...defaultProps} />);
    expect(screen.getByText('About Verification')).toBeInTheDocument();
    expect(
      screen.getByText('The verification system implements truth scoring and multi-pass validation for agent outputs with environment-specific thresholds.')
    ).toBeInTheDocument();
  });

  it('handles missing verification settings gracefully', () => {
    const props = {
      ...defaultProps,
      settings: {},
    };
    render(<VerificationSection {...props} />);
    expect(screen.getByText('Verification')).toBeInTheDocument();
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('0.7'); // Should use default value
  });

  it('slider respects min max and step values', () => {
    render(<VerificationSection {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '1');
    expect(slider).toHaveAttribute('step', '0.05');
  });

  it('threshold label updates when value changes', () => {
    const props = {
      ...defaultProps,
      settings: {
        verification: {
          enabled: false,
          truthThreshold: 0.85,
          environment: 'development',
        },
      },
    };
    render(<VerificationSection {...props} />);
    expect(screen.getByText('0.85')).toBeInTheDocument();
  });

  it('switches environment selection when clicking different cards', () => {
    const onUpdate = vi.fn();
    render(<VerificationSection {...defaultProps} onUpdate={onUpdate} />);

    const stagingButtons = screen.getAllByRole('button').filter(btn =>
      btn.textContent.includes('Staging')
    );
    fireEvent.click(stagingButtons[0]);
    expect(onUpdate).toHaveBeenCalledWith('verification.environment', 'staging');

    const devButtons = screen.getAllByRole('button').filter(btn =>
      btn.textContent.includes('Development')
    );
    fireEvent.click(devButtons[0]);
    expect(onUpdate).toHaveBeenCalledWith('verification.environment', 'development');
  });
});
