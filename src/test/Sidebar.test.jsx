import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupMocks } from './mocks';
import Sidebar from '../renderer/components/Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders all section labels', () => {
    const handleSectionChange = () => {};
    const handleModeChange = () => {};

    render(
      <Sidebar
        activeSection="general"
        onSectionChange={handleSectionChange}
        mode="complex"
        onModeChange={handleModeChange}
      />
    );

    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByText('Environment Variables')).toBeInTheDocument();
    expect(screen.getByText('Hooks')).toBeInTheDocument();
    expect(screen.getByText('Swarm & Agents')).toBeInTheDocument();
    expect(screen.getByText('Memory & Learning')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Permissions')).toBeInTheDocument();
    expect(screen.getByText('Skills & Commands')).toBeInTheDocument();
    expect(screen.getByText('Add-ons Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Capabilities')).toBeInTheDocument();
    expect(screen.getByText('User Guide')).toBeInTheDocument();
    expect(screen.getByText('Model Tiers')).toBeInTheDocument();
    expect(screen.getByText('Plugin Packs')).toBeInTheDocument();
    expect(screen.getByText('MCP Servers')).toBeInTheDocument();
  });

  it('renders RUFLO GUI title', () => {
    const handleSectionChange = () => {};
    const handleModeChange = () => {};

    render(
      <Sidebar
        activeSection="general"
        onSectionChange={handleSectionChange}
        mode="complex"
        onModeChange={handleModeChange}
      />
    );

    expect(screen.getByText('RUFLO GUI')).toBeInTheDocument();
  });

  it('active section has text-purple-200 class', () => {
    const handleSectionChange = () => {};
    const handleModeChange = () => {};

    render(
      <Sidebar
        activeSection="general"
        onSectionChange={handleSectionChange}
        mode="complex"
        onModeChange={handleModeChange}
      />
    );

    const generalBtn = screen.getByRole('button', { name: /general settings/i });
    expect(generalBtn).toHaveClass('text-accent-light');
  });

  it('calls onSectionChange when section clicked', () => {
    const handleSectionChange = vi.fn();
    const handleModeChange = () => {};

    render(
      <Sidebar
        activeSection="general"
        onSectionChange={handleSectionChange}
        mode="complex"
        onModeChange={handleModeChange}
      />
    );

    const envBtn = screen.getByRole('button', { name: /environment variables/i });
    fireEvent.click(envBtn);

    expect(handleSectionChange).toHaveBeenCalledWith('env');
  });

  it('contains ModeToggle component', () => {
    const handleSectionChange = () => {};
    const handleModeChange = () => {};

    render(
      <Sidebar
        activeSection="general"
        onSectionChange={handleSectionChange}
        mode="complex"
        onModeChange={handleModeChange}
      />
    );

    expect(screen.getByRole('button', { name: /complex/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eli5/i })).toBeInTheDocument();
  });
});
