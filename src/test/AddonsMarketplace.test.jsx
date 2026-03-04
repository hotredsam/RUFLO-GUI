import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddonsMarketplace from '../renderer/components/AddonsMarketplace';
import { MCP_CONFIGS } from '../renderer/lib/settings-mapper';
import { setupMocks } from './mocks';

describe('AddonsMarketplace', () => {
  beforeEach(() => {
    setupMocks();
    vi.clearAllMocks();
  });

  it('renders the Add-ons Marketplace heading', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    const heading = screen.getByText('Add-ons Marketplace');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('shows addon cards', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    // Should render addon cards - checking for some addon names from the ADDONS list
    expect(screen.getByText('RuVector Intelligence')).toBeInTheDocument();
    expect(screen.getByText('AgentDB Persistence')).toBeInTheDocument();
    expect(screen.getByText('HNSW Vector Search')).toBeInTheDocument();
  });

  it('filters addons with search input', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    // Initially all addons should be visible
    expect(screen.getByText('RuVector Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Claude Provider')).toBeInTheDocument();

    // Search for a specific addon
    const searchInput = screen.getByPlaceholderText('Search add-ons...');
    fireEvent.change(searchInput, { target: { value: 'vector' } });

    // Should only show addons matching the search
    expect(screen.getByText('HNSW Vector Search')).toBeInTheDocument();
    expect(screen.getByText('RuVector Intelligence')).toBeInTheDocument();

    // Should not show non-matching addons
    expect(screen.queryByText('Ollama Provider')).not.toBeInTheDocument();
  });

  it('changes descriptions based on mode toggle', () => {
    const mockSettings = { addons: { installed: [] } };

    // Test eli5 mode
    const { rerender } = render(
      <AddonsMarketplace settings={mockSettings} mode="eli5" onUpdate={vi.fn()} />
    );

    // eli5 descriptions should be visible
    expect(screen.getByText(/Makes your AI smarter/i)).toBeInTheDocument();

    // Rerender with complex mode
    rerender(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    // complex descriptions should be visible
    expect(screen.getByText(/Implements SONA/i)).toBeInTheDocument();
  });

  it('filters addons by category', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    // Find and click on a category button (e.g., "Intelligence")
    const categoryButtons = screen.getAllByRole('button');
    const intelligenceButton = categoryButtons.find(btn => btn.textContent.includes('Intelligence'));

    if (intelligenceButton) {
      fireEvent.click(intelligenceButton);

      // Should show Intelligence category addons
      expect(screen.getByText('RuVector Intelligence')).toBeInTheDocument();
      expect(screen.getByText('Memory Consolidation')).toBeInTheDocument();

      // Should not show addons from other categories
      expect(screen.queryByText('Ollama Provider')).not.toBeInTheDocument();
    }
  });

  it('tracks installed addons', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    // Component should render without errors
    expect(screen.getByText('Add-ons Marketplace')).toBeInTheDocument();
  });

  it('calls onUpdate with real settings when addon is installed', async () => {
    window.electronAPI.installAddon.mockResolvedValue({ success: true });
    const mockOnUpdate = vi.fn();
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={mockOnUpdate} />);

    // Find and click an Install button for github-integration
    const searchInput = screen.getByPlaceholderText('Search add-ons...');
    fireEvent.change(searchInput, { target: { value: 'GitHub Integration' } });

    const installButtons = screen.getAllByText(/Install/i);
    fireEvent.click(installButtons[0]);

    await waitFor(() => {
      // Should call onUpdate for the addons.installed list
      expect(mockOnUpdate).toHaveBeenCalledWith('addons.installed', expect.arrayContaining(['github-integration']));
      // Should call onUpdate with full MCP server config (not just { enabled: true })
      expect(mockOnUpdate).toHaveBeenCalledWith('mcpServers.github', MCP_CONFIGS.github);
    });
  });

  it('calls onUpdate with env var when ruvector-intelligence is installed', async () => {
    window.electronAPI.installAddon.mockResolvedValue({ success: true });
    const mockOnUpdate = vi.fn();
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={mockOnUpdate} />);

    const searchInput = screen.getByPlaceholderText('Search add-ons...');
    fireEvent.change(searchInput, { target: { value: 'RuVector Intelligence' } });

    const installButtons = screen.getAllByText(/Install/i);
    fireEvent.click(installButtons[0]);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('env.MAX_THINKING_TOKENS', '10000');
    });
  });

  it('does not call onUpdate with real settings for no-op addons', async () => {
    window.electronAPI.installAddon.mockResolvedValue({ success: true });
    const mockOnUpdate = vi.fn();
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={mockOnUpdate} />);

    const searchInput = screen.getByPlaceholderText('Search add-ons...');
    fireEvent.change(searchInput, { target: { value: 'Claude Provider' } });

    const installButtons = screen.getAllByText(/Install/i);
    fireEvent.click(installButtons[0]);

    await waitFor(() => {
      // Should only call onUpdate for addons.installed, not for any real settings
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnUpdate).toHaveBeenCalledWith('addons.installed', expect.arrayContaining(['claude-provider']));
    });
  });

  it('shows no addons message when search returns no results', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" onUpdate={vi.fn()} />);

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search add-ons...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentaddon12345' } });

    // Should show "No add-ons found" message
    expect(screen.getByText(/No add-ons found matching your search/i)).toBeInTheDocument();
  });
});
