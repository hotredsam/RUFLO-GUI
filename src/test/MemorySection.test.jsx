import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MemorySection from '../renderer/components/MemorySection';
import { setupMocks } from './mocks';

const defaultProps = {
  settings: {
    memory: {
      backend: 'sqlite',
      path: '~/.claude/memory',
      maxSizeMB: 500,
      retentionDays: 90,
      cleanupPeriodDays: 30,
      autoConsolidate: true,
      consolidationInterval: 24,
      hnswEnabled: false,
      hnswDimensions: 384,
      hnswM: 16,
      hnswEfConstruction: 200,
    },
  },
  mode: 'complex',
  onUpdate: vi.fn(),
};

describe('MemorySection', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('Header and Description', () => {
    it('renders heading with "Memory & Cleanup"', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.textContent).toContain('Memory');
      expect(heading.textContent).toContain('Cleanup');
    });

    it('renders eli5 description text', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/Control how Claude Code stores and manages conversation history/)).toBeInTheDocument();
    });

    it('renders complex description text', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText(/Configure session data storage, retention, and indexing parameters/)).toBeInTheDocument();
    });
  });

  describe('Storage Backend Selection', () => {
    it('renders 4 storage backend cards (sqlite, json, hybrid, memory)', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('SQLite')).toBeInTheDocument();
      expect(screen.getByText('JSON')).toBeInTheDocument();
      expect(screen.getByText('Hybrid')).toBeInTheDocument();
      expect(screen.getByText('Memory')).toBeInTheDocument();
    });

    it('selected backend has visual indicator (ring-2)', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const selectedCard = container.querySelector('.ring-2.ring-accent');
      expect(selectedCard).toBeInTheDocument();
      expect(selectedCard.textContent).toContain('SQLite');
    });

    it('clicking backend card calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const jsonButton = screen.getByText('JSON').closest('button');
      fireEvent.click(jsonButton);

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.backend', 'json');
    });
  });

  describe('Memory Path Input', () => {
    it('memory path input renders with default value', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const pathInput = screen.getByDisplayValue('~/.claude/memory');
      expect(pathInput).toBeInTheDocument();
    });

    it('changing memory path calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const pathInput = screen.getByDisplayValue('~/.claude/memory');
      fireEvent.change(pathInput, { target: { value: '~/custom/path' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.path', '~/custom/path');
    });
  });

  describe('Max Size Input', () => {
    it('max size input renders with default value', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const maxSizeInput = screen.getByDisplayValue('500');
      expect(maxSizeInput).toBeInTheDocument();
      expect(maxSizeInput.type).toBe('number');
    });

    it('changing max size calls onUpdate with number', () => {
      const mockOnUpdate = vi.fn();
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const maxSizeInput = screen.getByDisplayValue('500');
      fireEvent.change(maxSizeInput, { target: { value: '1000' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.maxSizeMB', 1000);
    });
  });

  describe('Retention Period', () => {
    it('retention period shows "Keep Memory For" in eli5 mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Keep Memory For')).toBeInTheDocument();
    });

    it('retention period shows "Retention Period" in complex mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Retention Period')).toBeInTheDocument();
    });

    it('retention period input has correct default', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const inputs = screen.getAllByDisplayValue('90');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('changing retention period calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const retentionInputs = screen.getAllByDisplayValue('90');
      fireEvent.change(retentionInputs[0], { target: { value: '180' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.retentionDays', 180);
    });
  });

  describe('Cleanup Period', () => {
    it('cleanup period input renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Cleanup Period (Days)')).toBeInTheDocument();
    });

    it('cleanup period input shows label in eli5 mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Cleanup Check Interval')).toBeInTheDocument();
    });

    it('changing cleanup period calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const cleanupInputs = screen.getAllByDisplayValue('30');
      fireEvent.change(cleanupInputs[0], { target: { value: '60' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.cleanupPeriodDays', 60);
    });
  });

  describe('Auto-Consolidate Toggle', () => {
    it('auto-consolidate toggle renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Auto-Consolidate')).toBeInTheDocument();
    });

    it('shows "Auto-Compress Memories" label in eli5 mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Auto-Compress Memories')).toBeInTheDocument();
    });

    it('clicking auto-consolidate calls onUpdate with toggled value', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const toggles = container.querySelectorAll('.toggle-switch');
      fireEvent.click(toggles[0]);

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.autoConsolidate', false);
    });
  });

  describe('Consolidation Interval', () => {
    it('consolidation interval input renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Consolidation Interval')).toBeInTheDocument();
    });

    it('consolidation interval has correct default value', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const inputs = container.querySelectorAll('input[type="number"]');
      const consolidationInput = Array.from(inputs).find(
        (input) => input.value === '24'
      );
      expect(consolidationInput).toBeInTheDocument();
    });

    it('changing consolidation interval calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const inputs = container.querySelectorAll('input[type="number"]');
      const consolidationInput = Array.from(inputs).find(
        (input) => input.value === '24'
      );
      fireEvent.change(consolidationInput, { target: { value: '48' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.consolidationInterval', 48);
    });
  });

  describe('HNSW Section', () => {
    it('HNSW section heading renders', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('HNSW Indexing')).toBeInTheDocument();
    });

    it('shows "Smart Memory Search" label in eli5 mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('Smart Memory Search')).toBeInTheDocument();
    });

    it('HNSW enable toggle renders', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const hsectionButton = container.querySelector('.glass-card button');
      expect(hsectionButton).toBeInTheDocument();
    });

    it('HNSW parameters hidden when disabled', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.queryByText('Vector Dimensions')).not.toBeInTheDocument();
      expect(screen.queryByText('M Parameter')).not.toBeInTheDocument();
      expect(screen.queryByText('EF Construction')).not.toBeInTheDocument();
    });

    it('HNSW parameters visible when enabled', () => {
      const { onUpdate } = defaultProps;
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      expect(screen.getByText('Vector Dimensions')).toBeInTheDocument();
      expect(screen.getByText('M Parameter')).toBeInTheDocument();
      expect(screen.getByText('EF Construction')).toBeInTheDocument();
    });

    it('HNSW dimensions input renders with correct default', () => {
      const { onUpdate } = defaultProps;
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      const dimensionsInput = screen.getByDisplayValue('384');
      expect(dimensionsInput).toBeInTheDocument();
    });

    it('changing HNSW dimensions calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      const dimensionsInput = screen.getByDisplayValue('384');
      fireEvent.change(dimensionsInput, { target: { value: '512' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.hnswDimensions', 512);
    });

    it('HNSW M parameter input renders with correct default', () => {
      const { onUpdate } = defaultProps;
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      const mInput = screen.getByDisplayValue('16');
      expect(mInput).toBeInTheDocument();
    });

    it('changing HNSW M parameter calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      const mInput = screen.getByDisplayValue('16');
      fireEvent.change(mInput, { target: { value: '32' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.hnswM', 32);
    });

    it('HNSW EF Construction input renders with correct default', () => {
      const { onUpdate } = defaultProps;
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      const efInput = screen.getByDisplayValue('200');
      expect(efInput).toBeInTheDocument();
    });

    it('changing HNSW EF Construction calls onUpdate', () => {
      const mockOnUpdate = vi.fn();
      const enabledSettings = {
        ...defaultProps.settings,
        memory: {
          ...defaultProps.settings.memory,
          hnswEnabled: true,
        },
      };

      const { container } = render(
        <MemorySection
          settings={enabledSettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      const efInput = screen.getByDisplayValue('200');
      fireEvent.change(efInput, { target: { value: '300' } });

      expect(mockOnUpdate).toHaveBeenCalledWith('memory.hnswEfConstruction', 300);
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('handles missing memory settings gracefully', () => {
      const mockOnUpdate = vi.fn();
      const noMemorySettings = {
        ...defaultProps.settings,
        memory: undefined,
      };

      render(
        <MemorySection
          settings={noMemorySettings}
          mode="complex"
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Memory & Cleanup')).toBeInTheDocument();
    });

    it('renders about section in eli5 mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="eli5"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('About Memory Management')).toBeInTheDocument();
      expect(screen.getByText(/Claude Code automatically manages conversation history/)).toBeInTheDocument();
    });

    it('renders about section in complex mode', () => {
      const { onUpdate } = defaultProps;
      render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      expect(screen.getByText('About Memory Management')).toBeInTheDocument();
      expect(screen.getByText(/Storage Backends:/)).toBeInTheDocument();
    });

    it('toggles HNSW section when clicking expand button', () => {
      const { onUpdate } = defaultProps;
      const { container } = render(
        <MemorySection
          settings={defaultProps.settings}
          mode="complex"
          onUpdate={onUpdate}
        />
      );

      const hnsWSectionButton = Array.from(
        container.querySelectorAll('.glass-card button')
      ).find((btn) => btn.textContent.includes('HNSW'));

      fireEvent.click(hnsWSectionButton);

      expect(screen.getByText('Enable HNSW')).toBeInTheDocument();
    });
  });
});
