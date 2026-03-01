import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AddonCard from '../renderer/components/AddonCard';
import { setupMocks, mockElectronAPI } from './mocks';

describe('AddonCard', () => {
  const mockAddon = {
    name: 'Test Addon',
    description: 'A test addon',
    eli5: 'A simple explanation',
    complex: 'A complex explanation',
    category: 'Tools',
    icon: '🔧',
    installCommand: 'npm install test-addon',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    detailedSummary: 'This is a detailed summary',
  };

  const mockOnInstalled = vi.fn();

  beforeEach(() => {
    setupMocks();
    mockOnInstalled.mockClear();
    mockElectronAPI.installAddon.mockClear();
  });

  it('renders addon name', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('Test Addon')).toBeInTheDocument();
  });

  it('renders addon description', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('A simple explanation')).toBeInTheDocument();
  });

  it('shows install button', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    expect(installButton).toBeInTheDocument();
    expect(installButton).toHaveTextContent('Install');
  });

  it('calls onInstall when install button is clicked', async () => {
    mockElectronAPI.installAddon.mockResolvedValue({ success: true });

    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockElectronAPI.installAddon).toHaveBeenCalledWith(
        'npm install test-addon'
      );
    });
  });

  it('calls onInstalled callback when install succeeds', async () => {
    mockElectronAPI.installAddon.mockResolvedValue({ success: true });

    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockOnInstalled).toHaveBeenCalled();
    });
  });

  it('shows "Installed" state when already installed', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={true}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    expect(installButton).toHaveTextContent('Installed');
  });

  it('disables install button when already installed', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={true}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    expect(installButton).toBeDisabled();
  });

  it('displays eli5 mode description when mode is eli5', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('A simple explanation')).toBeInTheDocument();
  });

  it('displays complex mode description when mode is complex', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="complex"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('A complex explanation')).toBeInTheDocument();
  });

  it('falls back to description when mode-specific description is not available', () => {
    const addonWithoutModeDescription = {
      ...mockAddon,
      eli5: undefined,
      complex: undefined,
    };

    render(
      <AddonCard
        addon={addonWithoutModeDescription}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('A test addon')).toBeInTheDocument();
  });

  it('shows install loading state when installing', async () => {
    mockElectronAPI.installAddon.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(screen.getByText('Installing...')).toBeInTheDocument();
    });
  });

  it('disables install button during installation', async () => {
    mockElectronAPI.installAddon.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(installButton).toBeDisabled();
    });
  });

  it('handles install error gracefully', async () => {
    mockElectronAPI.installAddon.mockRejectedValue(
      new Error('Install failed')
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to install addon:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('shows detailed summary when card is clicked', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const card = screen.getByText('Test Addon').closest('.addon-card');
    fireEvent.click(card);

    expect(screen.getByText('This is a detailed summary')).toBeInTheDocument();
  });

  it('hides detailed summary when card is clicked again', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const card = screen.getByText('Test Addon').closest('.addon-card');
    fireEvent.click(card);
    expect(screen.getByText('This is a detailed summary')).toBeInTheDocument();

    fireEvent.click(card);
    expect(screen.queryByText('This is a detailed summary')).not.toBeInTheDocument();
  });

  it('displays features list', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('renders addon icon', () => {
    const { container } = render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const icon = container.querySelector('.text-3xl');
    expect(icon).toHaveTextContent('🔧');
  });

  it('renders default icon when addon icon is not provided', () => {
    const addonWithoutIcon = {
      ...mockAddon,
      icon: undefined,
    };

    const { container } = render(
      <AddonCard
        addon={addonWithoutIcon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const icon = container.querySelector('.text-3xl');
    expect(icon).toHaveTextContent('🧩');
  });

  it('displays addon category', () => {
    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('stops propagation when install button is clicked', () => {
    mockElectronAPI.installAddon.mockResolvedValue({ success: true });

    render(
      <AddonCard
        addon={mockAddon}
        mode="eli5"
        isInstalled={false}
        onInstalled={mockOnInstalled}
      />
    );

    const installButton = screen.getByRole('button');
    const event = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

    fireEvent(installButton, event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
