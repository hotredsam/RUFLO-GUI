import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import StatusBar from '../renderer/components/StatusBar';
import { setupMocks } from './mocks';

describe('StatusBar', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders settings path', () => {
    const testPath = 'C:\\Users\\test\\.claude\\settings.json';
    render(<StatusBar settingsPath={testPath} saveStatus="saved" mode="eli5" />);

    expect(screen.getByText(testPath)).toBeInTheDocument();
  });

  it('shows "Saved" when saveStatus is "saved"', () => {
    render(<StatusBar settingsPath="/test/path" saveStatus="saved" mode="eli5" />);

    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('shows save status indicator for saving state', () => {
    render(<StatusBar settingsPath="/test/path" saveStatus="saving" mode="eli5" />);

    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('shows save status indicator for unsaved state', () => {
    render(<StatusBar settingsPath="/test/path" saveStatus="unsaved" mode="eli5" />);

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('shows save status indicator for error state', () => {
    render(<StatusBar settingsPath="/test/path" saveStatus="error" mode="eli5" />);

    expect(screen.getByText('Save failed')).toBeInTheDocument();
  });

  it('displays mode indicator for eli5 mode', () => {
    render(<StatusBar settingsPath="/test/path" saveStatus="saved" mode="eli5" />);

    expect(screen.getByText('ELI5 Mode')).toBeInTheDocument();
  });

  it('displays mode indicator for complex mode', () => {
    render(<StatusBar settingsPath="/test/path" saveStatus="saved" mode="complex" />);

    expect(screen.getByText('Complex Mode')).toBeInTheDocument();
  });

  it('shows last saved time when provided', () => {
    const lastSaved = new Date(Date.now() - 30000); // 30 seconds ago
    render(
      <StatusBar
        settingsPath="/test/path"
        saveStatus="saved"
        mode="eli5"
        lastSaved={lastSaved}
      />
    );

    expect(screen.getByText(/Last saved:/)).toBeInTheDocument();
  });

  it('formats last saved time as "just now" for very recent saves', () => {
    const lastSaved = new Date(Date.now() - 5000); // 5 seconds ago
    render(
      <StatusBar
        settingsPath="/test/path"
        saveStatus="saved"
        mode="eli5"
        lastSaved={lastSaved}
      />
    );

    expect(screen.getByText('Last saved: just now')).toBeInTheDocument();
  });

  it('formats last saved time in minutes', () => {
    const lastSaved = new Date(Date.now() - 300000); // 5 minutes ago
    render(
      <StatusBar
        settingsPath="/test/path"
        saveStatus="saved"
        mode="eli5"
        lastSaved={lastSaved}
      />
    );

    expect(screen.getByText('Last saved: 5m ago')).toBeInTheDocument();
  });

  it('formats last saved time in hours', () => {
    const lastSaved = new Date(Date.now() - 7200000); // 2 hours ago
    render(
      <StatusBar
        settingsPath="/test/path"
        saveStatus="saved"
        mode="eli5"
        lastSaved={lastSaved}
      />
    );

    expect(screen.getByText('Last saved: 2h ago')).toBeInTheDocument();
  });

  it('does not show last saved time when not provided', () => {
    render(
      <StatusBar
        settingsPath="/test/path"
        saveStatus="saved"
        mode="eli5"
      />
    );

    expect(screen.queryByText(/Last saved:/)).not.toBeInTheDocument();
  });

  it('displays loading state when settingsPath is not provided', () => {
    render(<StatusBar saveStatus="saved" mode="eli5" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies animate-pulse class when saveStatus is saving', () => {
    const { container } = render(
      <StatusBar settingsPath="/test/path" saveStatus="saving" mode="eli5" />
    );

    const statusIcon = container.querySelector('.animate-pulse');
    expect(statusIcon).toBeInTheDocument();
  });

  it('does not apply animate-pulse class when saveStatus is not saving', () => {
    const { container } = render(
      <StatusBar settingsPath="/test/path" saveStatus="saved" mode="eli5" />
    );

    const statusIcon = container.querySelector('.animate-pulse');
    expect(statusIcon).not.toBeInTheDocument();
  });
});
