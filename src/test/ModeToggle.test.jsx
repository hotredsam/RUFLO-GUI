import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupMocks } from './mocks';
import ModeToggle from '../renderer/components/ModeToggle';

describe('ModeToggle', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Complex and ELI5 buttons', () => {
    const handleModeChange = () => {};
    render(<ModeToggle mode="complex" onModeChange={handleModeChange} />);

    expect(screen.getByRole('button', { name: /complex/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eli5/i })).toBeInTheDocument();
  });

  it('Complex button has active class when mode=complex', () => {
    const handleModeChange = () => {};
    render(<ModeToggle mode="complex" onModeChange={handleModeChange} />);

    const complexBtn = screen.getByRole('button', { name: /complex/i });
    expect(complexBtn).toHaveClass('active');
  });

  it('ELI5 button has active class when mode=eli5', () => {
    const handleModeChange = () => {};
    render(<ModeToggle mode="eli5" onModeChange={handleModeChange} />);

    const eli5Btn = screen.getByRole('button', { name: /eli5/i });
    expect(eli5Btn).toHaveClass('active');
  });

  it('calls onModeChange with eli5 when ELI5 clicked', () => {
    const handleModeChange = vi.fn();
    render(<ModeToggle mode="complex" onModeChange={handleModeChange} />);

    const eli5Btn = screen.getByRole('button', { name: /eli5/i });
    fireEvent.click(eli5Btn);

    expect(handleModeChange).toHaveBeenCalledWith('eli5');
  });

  it('calls onModeChange with complex when Complex clicked', () => {
    const handleModeChange = vi.fn();
    render(<ModeToggle mode="eli5" onModeChange={handleModeChange} />);

    const complexBtn = screen.getByRole('button', { name: /complex/i });
    fireEvent.click(complexBtn);

    expect(handleModeChange).toHaveBeenCalledWith('complex');
  });
});
