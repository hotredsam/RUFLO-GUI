import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PluginsSection from '../renderer/components/PluginsSection';
import { PLUGIN_PACKS } from '../renderer/lib/plugins';
import { setupMocks } from './mocks';

describe('PluginsSection', () => {
  const defaultSettings = {
    model: 'claude-opus-4-6',
    permissions: { allow: [], deny: [] },
    env: {},
    hooks: {},
    security: {},
    swarm: { enabled: false },
    memory: { backend: 'sqlite' },
    addons: { installed: [] },
    plugins: { installed: [] },
    mcpServers: {},
  };

  beforeEach(() => {
    setupMocks();
    window.electronAPI.installAddon.mockClear();
    window.electronAPI.installAddon.mockResolvedValue(true);
  });

  it('renders Plugin Packs heading', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    expect(screen.getByText('Plugin Packs')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Plugin Packs/i })).toBeInTheDocument();
  });

  it('displays mode-aware description for eli5 mode', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="eli5" />
    );

    expect(
      screen.getByText(/Install bundles of features with one click/i)
    ).toBeInTheDocument();
  });

  it('displays mode-aware description for complex mode', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    expect(
      screen.getByText(/Pre-configured addon bundles for common workflows/i)
    ).toBeInTheDocument();
  });

  it('shows recommended pack prominently', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const recommendedBadges = screen.getAllByText('Recommended');
    expect(recommendedBadges.length).toBeGreaterThan(0);
  });

  it('shows all plugin packs', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    PLUGIN_PACKS.forEach((pack) => {
      expect(screen.getByText(pack.name)).toBeInTheDocument();
    });
  });

  it('displays pack icons', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // Check for specific pack icons
    expect(screen.getByText('🎯')).toBeInTheDocument(); // Starter Pack
    expect(screen.getByText('👨‍💻')).toBeInTheDocument(); // Developer Pack
    expect(screen.getByText('🔐')).toBeInTheDocument(); // Security Pack
    expect(screen.getByText('🧠')).toBeInTheDocument(); // AI Power Pack
  });

  it('install button calls window.electronAPI.installAddon', async () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);
    const firstButton = installButtons[0];

    fireEvent.click(firstButton);

    await waitFor(() => {
      expect(window.electronAPI.installAddon).toHaveBeenCalled();
    });
  });

  it('install button passes correct install command', async () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);
    const starterPackButton = installButtons[0];

    fireEvent.click(starterPackButton);

    await waitFor(() => {
      expect(window.electronAPI.installAddon).toHaveBeenCalledWith(
        'npx ruflo@latest install-pack starter'
      );
    });
  });

  it('disables button during installation', async () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);
    const firstButton = installButtons[0];

    fireEvent.click(firstButton);

    await waitFor(() => {
      expect(screen.getByText(/Installing\.\.\./i)).toBeInTheDocument();
    });
  });

  it('shows Installed status after successful installation', async () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);
    const firstButton = installButtons[0];

    fireEvent.click(firstButton);

    await waitFor(() => {
      expect(screen.getByText('Installed')).toBeInTheDocument();
    });
  });

  it('handles installation failure gracefully', async () => {
    window.electronAPI.installAddon.mockRejectedValueOnce(
      new Error('Installation failed')
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);
    fireEvent.click(installButtons[0]);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to install pack:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('shows included addons count', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // Starter pack has 3 addons
    expect(screen.getByText('3 addons included')).toBeInTheDocument();

    // Find other addons counts
    const addonCounts = screen.getAllByText(/addons/i);
    expect(addonCounts.length).toBeGreaterThan(0);
  });

  it('displays addon tags for recommended pack', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // Non-recommended packs display addon tags. Developer Pack has these addons
    const addonTags = screen.getAllByText(/github integration/i);
    expect(addonTags.length).toBeGreaterThan(0);

    // Check for addon tags in the grid packs (not recommended)
    expect(screen.getAllByText(/token optimizer/i).length).toBeGreaterThan(0);
  });

  it('displays estimated installation time', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // Starter pack takes 2-3 minutes - check both recommended and grid versions
    const timeTexts = screen.getAllByText(/~2-3 minutes/i);
    expect(timeTexts.length).toBeGreaterThan(0);
  });

  it('displays mode-aware pack descriptions', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="eli5" />
    );

    expect(
      screen.getByText(/Everything you need to get started with ruflo/i)
    ).toBeInTheDocument();
  });

  it('displays complex descriptions when mode is complex', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    expect(
      screen.getByText(/Core ruflo components including AgentDB persistence/i)
    ).toBeInTheDocument();
  });

  it('renders recommended pack differently from others', () => {
    const { container } = render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // Recommended pack has border-accent/30 and glass-card class
    const recommendedCard = container.querySelector('.border-accent\\/30');
    expect(recommendedCard).toBeInTheDocument();
  });

  it('tracks installation state per pack independently', async () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);

    // Install first pack
    fireEvent.click(installButtons[0]);

    await waitFor(() => {
      const installedButtons = screen.getAllByText('Installed');
      expect(installedButtons.length).toBe(1);
    });

    // Other packs should still show Install Pack button
    const installPackButtons = screen.getAllByText(/Install Pack/i);
    expect(installPackButtons.length).toBeGreaterThan(0);
  });

  it('displays pre-configured addon information for all packs', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // AI Power Pack has multiple addons displayed as tags in the grid (note: hyphens are replaced with spaces)
    // Using getAllByText because the addon names may appear in descriptions too
    const ruvectorMatches = screen.getAllByText(/ruvector intelligence/i);
    expect(ruvectorMatches.length).toBeGreaterThan(0);

    const reinforcementMatches = screen.getAllByText(/reinforcement learning/i);
    expect(reinforcementMatches.length).toBeGreaterThan(0);
  });

  it('shows more addons indicator when pack has more than 4', () => {
    render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    // Full Stack Pack has 14 addons, should show "+10 more"
    const moreIndicators = screen.getAllByText(/\+\d+ more/i);
    expect(moreIndicators.length).toBeGreaterThan(0);
  });

  it('handles pre-installed packs from settings', () => {
    const settingsWithInstalled = {
      ...defaultSettings,
      plugins: { installed: ['starter-pack'] },
    };

    render(
      <PluginsSection settings={settingsWithInstalled} mode="complex" />
    );

    const installedButtons = screen.getAllByText('Installed');
    expect(installedButtons.length).toBeGreaterThan(0);
  });

  it('updates installation state after successful install', async () => {
    const { rerender } = render(
      <PluginsSection settings={defaultSettings} mode="complex" />
    );

    const installButtons = screen.getAllByText(/Install Pack/i);
    fireEvent.click(installButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Installed')).toBeInTheDocument();
    });
  });
});
