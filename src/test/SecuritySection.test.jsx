import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SecuritySection from '../renderer/components/SecuritySection';
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

describe('SecuritySection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Security Configuration heading', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Security Configuration')).toBeInTheDocument();
  });

  it('shows security level options', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const select = screen.getByDisplayValue('Medium');
    expect(select).toBeInTheDocument();

    // Check all security levels are present
    const options = select.querySelectorAll('option');
    const optionValues = Array.from(options).map((opt) => opt.value);
    expect(optionValues).toContain('low');
    expect(optionValues).toContain('medium');
    expect(optionValues).toContain('high');
    expect(optionValues).toContain('paranoid');
  });

  it('displays eli5 mode description for security level', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('How strict to be about security')).toBeInTheDocument();
    expect(screen.getByText('Basic safety checks')).toBeInTheDocument();
  });

  it('displays complex mode description for security level', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Standard security checks')).toBeInTheDocument();
  });

  it('shows correct eli5 descriptions when security level changes', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    const select = screen.getByDisplayValue('Medium');

    // Change to high
    fireEvent.change(select, { target: { value: 'high' } });
    rerender(
      <SecuritySection
        settings={{
          ...defaultSettings,
          security: { level: 'high' },
        }}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Strong protection')).toBeInTheDocument();
  });

  it('calls onUpdate when security level changes', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const select = screen.getByDisplayValue('Medium');
    fireEvent.change(select, { target: { value: 'high' } });

    expect(onUpdate).toHaveBeenCalledWith('security.level', 'high');
  });

  it('shows toggle options for scanning features', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Enable Scanning')).toBeInTheDocument();
    expect(screen.getByText('CVE Checking')).toBeInTheDocument();
    expect(screen.getByText('Threat Modeling')).toBeInTheDocument();
    expect(screen.getByText('Audit Logging')).toBeInTheDocument();
  });

  it('shows eli5 labels for toggle options in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Scan Code')).toBeInTheDocument();
    expect(screen.getByText('Check for Known Vulnerabilities')).toBeInTheDocument();
    expect(screen.getByText('Think About Threats')).toBeInTheDocument();
    expect(screen.getByText('Keep Security Logs')).toBeInTheDocument();
  });

  it('shows eli5 descriptions for toggle options in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Check code for potential problems')).toBeInTheDocument();
    expect(screen.getByText('Look for known security issues in dependencies')).toBeInTheDocument();
    expect(screen.getByText('Analyze potential security threats')).toBeInTheDocument();
    expect(screen.getByText('Record security-related activities')).toBeInTheDocument();
  });

  it('toggles enableScanning when clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[0]);

    expect(onUpdate).toHaveBeenCalledWith('security.enableScanning', true);
  });

  it('toggles cveCheck when clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[1]);

    expect(onUpdate).toHaveBeenCalledWith('security.cveCheck', true);
  });

  it('toggles threatModeling when clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[2]);

    expect(onUpdate).toHaveBeenCalledWith('security.threatModeling', true);
  });

  it('toggles auditLogging when clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[3]);

    expect(onUpdate).toHaveBeenCalledWith('security.auditLogging', true);
  });

  it('reflects enabled toggle states in UI', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={{
          ...defaultSettings,
          security: {
            enableScanning: true,
            cveCheck: true,
            threatModeling: false,
            auditLogging: true,
          },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    expect(toggles[0]).toHaveClass('active');
    expect(toggles[1]).toHaveClass('active');
    expect(toggles[2]).not.toHaveClass('active');
    expect(toggles[3]).toHaveClass('active');
  });

  it('handles mode-aware descriptions correctly in eli5 mode', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <SecuritySection
        settings={{
          ...defaultSettings,
          security: { level: 'paranoid' },
        }}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Check everything multiple times')).toBeInTheDocument();

    rerender(
      <SecuritySection
        settings={{
          ...defaultSettings,
          security: { level: 'paranoid' },
        }}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Maximum security - slow but most secure')).toBeInTheDocument();
  });

  it('defaults to medium security level when not specified', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const select = screen.getByDisplayValue('Medium');
    expect(select).toBeInTheDocument();
  });
});
