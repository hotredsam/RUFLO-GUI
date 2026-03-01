import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MCPSection from '../renderer/components/MCPSection';
import { MCP_SERVERS, MCP_CATEGORIES } from '../renderer/lib/mcpServers';

describe('MCPSection', () => {
  const defaultSettings = {
    model: 'claude-opus-4-6',
    permissions: { allow: [], deny: [] },
    env: {},
    hooks: {},
    security: {},
    swarm: { enabled: false },
    memory: { backend: 'sqlite' },
    addons: { installed: [] },
    mcpServers: {
      filesystem: { enabled: true },
    },
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('renders MCP Servers heading', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('MCP Servers')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /MCP Servers/i })).toBeInTheDocument();
  });

  it('displays mode-aware description for eli5 mode', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(
      screen.getByText(/Connect external tools and services to your AI agent/i)
    ).toBeInTheDocument();
  });

  it('displays mode-aware description for complex mode', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(
      screen.getByText(/Configure Model Context Protocol servers for extending agent capabilities/i)
    ).toBeInTheDocument();
  });

  it('shows all MCP server cards', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    MCP_SERVERS.forEach((server) => {
      expect(screen.getByText(server.name)).toBeInTheDocument();
    });
  });

  it('displays server icons', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('📁')).toBeInTheDocument(); // Filesystem
    expect(screen.getByText('🐙')).toBeInTheDocument(); // GitHub
    expect(screen.getByText('🐘')).toBeInTheDocument(); // PostgreSQL
  });

  it('renders search input field', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search MCP servers/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('filters servers by search query', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search MCP servers/i);

    // Search for GitHub
    fireEvent.change(searchInput, { target: { value: 'github' } });

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      // Filesystem should still be visible but others might be filtered
    });
  });

  it('filters servers case-insensitively', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search MCP servers/i);

    fireEvent.change(searchInput, { target: { value: 'POSTGRES' } });

    await waitFor(() => {
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });
  });

  it('renders category filter buttons', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('APIs')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
  });

  it('filters by selected category', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const databaseButton = screen.getByRole('button', { name: /Database/i });
    fireEvent.click(databaseButton);

    await waitFor(() => {
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('SQLite')).toBeInTheDocument();
    });
  });

  it('resets to All categories when All button clicked', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const databaseButton = screen.getByRole('button', { name: /Database/i });
    fireEvent.click(databaseButton);

    await waitFor(() => {
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });

    const allButton = screen.getByRole('button', { name: /^All$/i });
    fireEvent.click(allButton);

    await waitFor(() => {
      expect(screen.getByText('Filesystem')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });
  });

  it('toggle enables disabled server', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');

    // Find a disabled server toggle
    fireEvent.click(toggles[1]);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.stringContaining('mcpServers.'),
      expect.any(Boolean)
    );
  });

  it('toggle disables enabled server', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');

    // Click the filesystem toggle (which is enabled in default settings)
    fireEvent.click(toggles[0]);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      'mcpServers.filesystem.enabled',
      false
    );
  });

  it('expands server config panel when clicked', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      expect(screen.getByDisplayValue('npx')).toBeInTheDocument();
    });
  });

  it('collapses expanded config panel when clicked again', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;

    // Open panel
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      expect(screen.getByDisplayValue('npx')).toBeInTheDocument();
    });

    // Close panel
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      expect(screen.queryByDisplayValue('npx')).not.toBeInTheDocument();
    });
  });

  it('shows server command in expanded config', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      const commandInput = screen.getByDisplayValue('npx');
      expect(commandInput.value).toBe('npx');
    });
  });

  it('allows editing server command', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      const commandInput = screen.getByDisplayValue('npx');
      fireEvent.change(commandInput, { target: { value: 'node' } });
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(
      'mcpServers.filesystem.command',
      'node'
    );
  });

  it('shows server arguments in expanded config', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      const argsInput = screen.getByDisplayValue(/path\/to\/allowed\/dir/);
      expect(argsInput).toBeInTheDocument();
    });
  });

  it('displays environment variables for servers that need them', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const githubCard = screen.getByText('GitHub').parentElement.parentElement;
    fireEvent.click(githubCard);

    await waitFor(() => {
      expect(screen.getByText(/GITHUB_PERSONAL_ACCESS_TOKEN/i)).toBeInTheDocument();
    });
  });

  it('hides environment variables section for servers without env vars', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      // Filesystem has no env vars
      expect(screen.queryByText(/Environment Variables/i)).not.toBeInTheDocument();
    });
  });

  it('displays category information in expanded panel', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const filesystemCard = screen.getByText('Filesystem').parentElement.parentElement;
    fireEvent.click(filesystemCard);

    await waitFor(() => {
      expect(screen.getByDisplayValue('npx')).toBeInTheDocument();
      expect(screen.getByText(/Category:/i)).toBeInTheDocument();
    });
  });

  it('displays mode-aware server descriptions', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={mockOnUpdate}
      />
    );

    expect(
      screen.getByText(/Lets the AI read and write files on your computer safely/i)
    ).toBeInTheDocument();
  });

  it('shows complex server descriptions in complex mode', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    expect(
      screen.getByText(/Provides sandboxed filesystem access with configurable root directories/i)
    ).toBeInTheDocument();
  });

  it('allows search and category filters to work together', async () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search MCP servers/i);
    fireEvent.change(searchInput, { target: { value: 'github' } });

    const apisButton = screen.getByRole('button', { name: /APIs/i });
    fireEvent.click(apisButton);

    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      // Should only show GitHub, not other API servers
    });
  });

  it('shows all categories in filter buttons', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    MCP_CATEGORIES.forEach((category) => {
      expect(screen.getByRole('button', { name: new RegExp(category, 'i') })).toBeInTheDocument();
    });
  });

  it('displays highlighted active category button', () => {
    const { container } = render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const allButton = screen.getByRole('button', { name: /^All$/i });
    expect(allButton).toHaveClass('bg-accent');
  });

  it('maintains toggle state independently for each server', () => {
    render(
      <MCPSection
        settings={defaultSettings}
        mode="complex"
        onUpdate={mockOnUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');

    fireEvent.click(toggles[0]);
    expect(mockOnUpdate).toHaveBeenCalledWith(
      'mcpServers.filesystem.enabled',
      expect.any(Boolean)
    );

    mockOnUpdate.mockClear();

    fireEvent.click(toggles[1]);
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.stringMatching(/^mcpServers\.(?!filesystem)/),
      expect.any(Boolean)
    );
  });
});
