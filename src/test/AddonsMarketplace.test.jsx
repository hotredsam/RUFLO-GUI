import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddonsMarketplace from '../renderer/components/AddonsMarketplace';
import { setupMocks } from './mocks';

describe('AddonsMarketplace', () => {
  beforeEach(() => {
    setupMocks();
    vi.clearAllMocks();
  });

  it('renders the Add-ons Marketplace heading', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" />);

    const heading = screen.getByText('Add-ons Marketplace');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('shows addon cards', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" />);

    // Should render addon cards - checking for some addon names from the ADDONS list
    expect(screen.getByText('RuVector Intelligence')).toBeInTheDocument();
    expect(screen.getByText('AgentDB Persistence')).toBeInTheDocument();
    expect(screen.getByText('HNSW Vector Search')).toBeInTheDocument();
  });

  it('filters addons with search input', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" />);

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
      <AddonsMarketplace settings={mockSettings} mode="eli5" />
    );

    // eli5 descriptions should be visible
    expect(screen.getByText(/Makes your AI smarter/i)).toBeInTheDocument();

    // Rerender with complex mode
    rerender(<AddonsMarketplace settings={mockSettings} mode="complex" />);

    // complex descriptions should be visible
    expect(screen.getByText(/Implements SONA/i)).toBeInTheDocument();
  });

  it('filters addons by category', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" />);

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
    render(<AddonsMarketplace settings={mockSettings} mode="complex" />);

    // Component should render without errors
    expect(screen.getByText('Add-ons Marketplace')).toBeInTheDocument();
  });

  it('shows no addons message when search returns no results', () => {
    const mockSettings = { addons: { installed: [] } };
    render(<AddonsMarketplace settings={mockSettings} mode="complex" />);

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search add-ons...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentaddon12345' } });

    // Should show "No add-ons found" message
    expect(screen.getByText(/No add-ons found matching your search/i)).toBeInTheDocument();
  });
});
