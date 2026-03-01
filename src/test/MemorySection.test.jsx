import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MemorySection from '../renderer/components/MemorySection';
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

describe('MemorySection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Memory & Learning heading', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Memory & Learning');
  });

  it('shows memory backend selector', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('displays mode-aware label for backend in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Memory Storage Type')).toBeInTheDocument();
    expect(screen.getByText('SQLite: Most reliable, JSON: Simple file-based, Memory: Fast but temporary')).toBeInTheDocument();
  });

  it('displays all memory backend options', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const backendSelect = screen.getAllByRole('combobox')[0];
    fireEvent.click(backendSelect);

    expect(screen.getByText('SQLITE')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('MEMORY')).toBeInTheDocument();
  });

  it('updates backend on selection change', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const backendSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(backendSelect, { target: { value: 'json' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('memory.backend', 'json');
  });

  it('displays current backend selection', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: { backend: 'json' },
    };

    render(
      <MemorySection
        settings={settingsWithMemory}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const backendSelect = screen.getAllByRole('combobox')[0];
    expect(backendSelect.value).toBe('json');
  });

  it('displays vector search toggle', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('HNSW Vector Search')).toBeInTheDocument();
  });

  it('displays mode-aware label for vector search in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Smart Memory Search')).toBeInTheDocument();
    expect(screen.getByText('Use advanced AI to find related memories instead of simple keyword search')).toBeInTheDocument();
  });

  it('toggles vector search', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: { backend: 'sqlite', vectorSearch: false },
    };

    const { container } = render(
      <MemorySection
        settings={settingsWithMemory}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggleSwitches = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggleSwitches[0]);

    expect(mockOnUpdate).toHaveBeenCalledWith('memory.vectorSearch', true);
  });

  it('displays retention days input', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Retention Days')).toBeInTheDocument();
  });

  it('displays mode-aware label for retention days in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Keep Memories For')).toBeInTheDocument();
    expect(screen.getByText('How long to keep old memories (in days)')).toBeInTheDocument();
  });

  it('updates retention days on input change', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: { backend: 'sqlite', retentionDays: 30 },
    };

    render(
      <MemorySection
        settings={settingsWithMemory}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const retentionDaysInputs = screen.getAllByDisplayValue('30');
    fireEvent.change(retentionDaysInputs[0], { target: { value: '60' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('memory.retentionDays', 60);
  });

  it('displays default retention days when not specified', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const retentionDaysInputs = screen.getAllByDisplayValue('30');
    expect(retentionDaysInputs.length).toBeGreaterThan(0);
  });

  it('displays max entries input', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Max Entries')).toBeInTheDocument();
  });

  it('displays mode-aware label for max entries in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Maximum Memories')).toBeInTheDocument();
    expect(screen.getByText('Maximum number of memories to store')).toBeInTheDocument();
  });

  it('updates max entries on input change', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: { backend: 'sqlite', maxEntries: 10000 },
    };

    render(
      <MemorySection
        settings={settingsWithMemory}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const maxEntriesInputs = screen.getAllByDisplayValue('10000');
    fireEvent.change(maxEntriesInputs[0], { target: { value: '20000' } });

    expect(mockOnUpdate).toHaveBeenCalledWith('memory.maxEntries', 20000);
  });

  it('displays default max entries when not specified', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const maxEntriesInputs = screen.getAllByDisplayValue('10000');
    expect(maxEntriesInputs.length).toBeGreaterThan(0);
  });

  it('displays auto consolidate toggle', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Auto-Consolidate')).toBeInTheDocument();
  });

  it('displays mode-aware label for auto consolidate in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    render(
      <MemorySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Auto-Organize Memories')).toBeInTheDocument();
    expect(screen.getByText('Automatically clean up and organize old memories')).toBeInTheDocument();
  });

  it('toggles auto consolidate', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: { backend: 'sqlite', autoConsolidate: false },
    };

    const { container } = render(
      <MemorySection
        settings={settingsWithMemory}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggleSwitches = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggleSwitches[toggleSwitches.length - 1]);

    expect(mockOnUpdate).toHaveBeenCalledWith('memory.autoConsolidate', true);
  });

  it('handles all controls together in complex mode', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: {
        backend: 'sqlite',
        vectorSearch: true,
        retentionDays: 45,
        maxEntries: 15000,
        autoConsolidate: true,
      },
    };

    render(
      <MemorySection
        settings={settingsWithMemory}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getAllByRole('combobox')[0].value).toBe('sqlite');
    expect(screen.getByDisplayValue('45')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15000')).toBeInTheDocument();
  });

  it('handles all controls together in eli5 mode', () => {
    const mockOnUpdate = vi.fn();
    const settingsWithMemory = {
      ...defaultSettings,
      memory: {
        backend: 'json',
        vectorSearch: false,
        retentionDays: 90,
        maxEntries: 5000,
        autoConsolidate: false,
      },
    };

    render(
      <MemorySection
        settings={settingsWithMemory}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Memory Storage Type')).toBeInTheDocument();
    expect(screen.getByText('Smart Memory Search')).toBeInTheDocument();
    expect(screen.getByText('Keep Memories For')).toBeInTheDocument();
    expect(screen.getByText('Maximum Memories')).toBeInTheDocument();
    expect(screen.getByText('Auto-Organize Memories')).toBeInTheDocument();
  });
});
