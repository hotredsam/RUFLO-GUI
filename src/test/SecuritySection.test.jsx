import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SecuritySection from '../renderer/components/SecuritySection';
import { setupMocks } from './mocks';

const defaultSettings = {
  model: 'claude-opus-4-6',
  permissions: { allow: [], deny: [] },
  env: {},
  hooks: {},
  sandbox: {},
  swarm: { enabled: false },
  memory: { cleanupPeriodDays: 30 },
  addons: { installed: [] },
};

describe('SecuritySection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Sandbox & Security heading', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Sandbox & Security');
  });

  it('renders without crashing', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('sandbox.enabled')).toBeInTheDocument();
  });

  it('displays eli5 description in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Control how the AI interacts with your files and network/)).toBeInTheDocument();
  });

  it('displays complex description in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Configure sandbox isolation/)).toBeInTheDocument();
  });

  it('renders sandbox enabled toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('sandbox.enabled')).toBeInTheDocument();
  });

  it('toggles sandbox.enabled when clicking toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggle = document.querySelector('.toggle-switch');
    fireEvent.click(toggle);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.enabled', true);
  });

  it('shows active toggle when sandbox.enabled is true', () => {
    const settingsEnabled = {
      ...defaultSettings,
      sandbox: { enabled: true },
    };
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');
    expect(toggles[0]).toHaveClass('active');
  });

  it('renders Auto-Allow Bash toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('sandbox.autoAllowBashIfSandboxed')).toBeInTheDocument();
  });

  it('toggles sandbox.autoAllowBashIfSandboxed when clicking toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = document.querySelectorAll('.toggle-switch');
    fireEvent.click(toggles[1]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.autoAllowBashIfSandboxed', true);
  });

  it('displays Filesystem Access section', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Filesystem Access')).toBeInTheDocument();
  });

  it('displays Allowed Paths subsection', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Allowed Paths')).toBeInTheDocument();
  });

  it('displays Blocked Paths subsection', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Blocked Paths')).toBeInTheDocument();
  });

  it('adds allowed filesystem path', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('/path/to/allow');
    fireEvent.change(inputs[0], { target: { value: '/home/user/project' } });

    const buttons = screen.getAllByText('Add');
    fireEvent.click(buttons[0]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.filesystem.allowedPaths', ['/home/user/project']);
  });

  it('removes allowed filesystem path', () => {
    const settingsWithPath = {
      ...defaultSettings,
      sandbox: {
        filesystem: { allowedPaths: ['/home/user/project'], blockedPaths: [] },
        network: { allowedHosts: [], blockedHosts: [] },
      },
    };
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={settingsWithPath}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.filesystem.allowedPaths', []);
  });

  it('adds blocked filesystem path', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('/path/to/block');
    fireEvent.change(inputs[0], { target: { value: '/etc/passwd' } });

    const buttons = screen.getAllByText('Add');
    fireEvent.click(buttons[1]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.filesystem.blockedPaths', ['/etc/passwd']);
  });

  it('displays Network Access section', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Network Access')).toBeInTheDocument();
  });

  it('displays Allowed Hosts subsection', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Allowed Hosts')).toBeInTheDocument();
  });

  it('displays Blocked Hosts subsection', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Blocked Hosts')).toBeInTheDocument();
  });

  it('adds allowed host', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('example.com');
    fireEvent.change(inputs[0], { target: { value: 'api.github.com' } });

    const buttons = screen.getAllByText('Add');
    fireEvent.click(buttons[2]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.network.allowedHosts', ['api.github.com']);
  });

  it('removes allowed host', () => {
    const settingsWithHost = {
      ...defaultSettings,
      sandbox: {
        filesystem: { allowedPaths: [], blockedPaths: [] },
        network: { allowedHosts: ['api.github.com'], blockedHosts: [] },
      },
    };
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={settingsWithHost}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.network.allowedHosts', []);
  });

  it('adds blocked host', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const inputs = screen.getAllByPlaceholderText('malicious.com');
    fireEvent.change(inputs[0], { target: { value: 'spam.example.com' } });

    const buttons = screen.getAllByText('Add');
    fireEvent.click(buttons[3]);

    expect(onUpdate).toHaveBeenCalledWith('sandbox.network.blockedHosts', ['spam.example.com']);
  });

  it('displays existing allowed paths', () => {
    const settingsWithPaths = {
      ...defaultSettings,
      sandbox: {
        filesystem: { allowedPaths: ['/home/user/project'], blockedPaths: [] },
        network: { allowedHosts: [], blockedHosts: [] },
      },
    };
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={settingsWithPaths}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('/home/user/project')).toBeInTheDocument();
  });

  it('displays existing blocked hosts', () => {
    const settingsWithHosts = {
      ...defaultSettings,
      sandbox: {
        filesystem: { allowedPaths: [], blockedPaths: [] },
        network: { allowedHosts: [], blockedHosts: ['spam.example.com'] },
      },
    };
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={settingsWithHosts}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('spam.example.com')).toBeInTheDocument();
  });

  it('shows eli5 description for sandbox in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Sandboxing isolates the AI/)).toBeInTheDocument();
  });

  it('shows eli5 description for allowed paths in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={defaultSettings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Isolate AI operations for safety/)).toBeInTheDocument();
  });
});

describe('SecuritySection - Advanced Security: CVE Scanning', () => {
  beforeEach(() => {
    setupMocks();
  });

  const advancedSecurityProps = {
    settings: {
      security: {
        sandbox: true,
        autoAllowBash: false,
        cveScanning: false,
        cveScanFrequency: 'daily',
        cveSeverityThreshold: 'high',
        auditLogging: false,
        auditLogPath: '~/.claude/audit.log',
        auditLogLevel: 'info',
        piiDetection: false,
        threatModeling: false,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  it('renders CVE scanning toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.cveScanning')).toBeInTheDocument();
  });

  it('shows CVE scanning label in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('CVE Scanning')).toBeInTheDocument();
  });

  it('shows CVE scanning label in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.cveScanning')).toBeInTheDocument();
  });

  it('calls onUpdate when CVE scanning toggle is clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    const cveToggle = toggles[2];
    fireEvent.click(cveToggle);

    expect(onUpdate).toHaveBeenCalledWith('security.cveScanning', true);
  });

  it('hides CVE sub-options when cveScanning is disabled', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.queryByLabelText(/Scan Frequency/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Severity Threshold/)).not.toBeInTheDocument();
  });

  it('shows CVE sub-options when cveScanning is enabled', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, cveScanning: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Scan Frequency')).toBeInTheDocument();
    expect(screen.getByText('Severity Threshold')).toBeInTheDocument();
  });

  it('renders scan frequency dropdown with correct options', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, cveScanning: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = container.querySelectorAll('select');
    const frequencySelect = Array.from(selects).find(select => select.value === 'daily');
    expect(frequencySelect).toBeDefined();

    const options = frequencySelect.querySelectorAll('option');
    expect(options[0].value).toBe('on-commit');
    expect(options[1].value).toBe('daily');
    expect(options[2].value).toBe('weekly');
  });

  it('calls onUpdate when scan frequency changes', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, cveScanning: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = container.querySelectorAll('select');
    const frequencySelect = Array.from(selects).find(select => select.value === 'daily');
    fireEvent.change(frequencySelect, { target: { value: 'weekly' } });

    expect(onUpdate).toHaveBeenCalledWith('security.cveScanFrequency', 'weekly');
  });

  it('renders severity threshold dropdown with correct options', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, cveScanning: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = container.querySelectorAll('select');
    const severitySelect = Array.from(selects).reverse().find(select => select.value === 'high');
    expect(severitySelect).toBeDefined();

    const options = severitySelect.querySelectorAll('option');
    expect(options[0].value).toBe('critical');
    expect(options[1].value).toBe('high');
    expect(options[2].value).toBe('medium');
    expect(options[3].value).toBe('low');
  });

  it('calls onUpdate when severity threshold changes', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, cveScanning: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const selects = container.querySelectorAll('select');
    const severitySelect = Array.from(selects).reverse().find(select => select.value === 'high');
    fireEvent.change(severitySelect, { target: { value: 'critical' } });

    expect(onUpdate).toHaveBeenCalledWith('security.cveSeverityThreshold', 'critical');
  });

  it('shows CVE scanning eli5 description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Automatically check your code for known security vulnerabilities/)).toBeInTheDocument();
  });

  it('shows CVE scanning complex description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Enable CVE scanning against the NVD database/)).toBeInTheDocument();
  });
});

describe('SecuritySection - Advanced Security: Audit Logging', () => {
  beforeEach(() => {
    setupMocks();
  });

  const advancedSecurityProps = {
    settings: {
      security: {
        sandbox: true,
        autoAllowBash: false,
        cveScanning: false,
        cveScanFrequency: 'daily',
        cveSeverityThreshold: 'high',
        auditLogging: false,
        auditLogPath: '~/.claude/audit.log',
        auditLogLevel: 'info',
        piiDetection: false,
        threatModeling: false,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  it('renders audit logging toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.auditLogging')).toBeInTheDocument();
  });

  it('shows audit logging label in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Audit Logging')).toBeInTheDocument();
  });

  it('shows audit logging label in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.auditLogging')).toBeInTheDocument();
  });

  it('calls onUpdate when audit logging toggle is clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    const auditToggle = toggles[3];
    fireEvent.click(auditToggle);

    expect(onUpdate).toHaveBeenCalledWith('security.auditLogging', true);
  });

  it('hides audit sub-options when auditLogging is disabled', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.queryByText('Log Path')).not.toBeInTheDocument();
    expect(screen.queryByText('Log Level')).not.toBeInTheDocument();
  });

  it('shows audit sub-options when auditLogging is enabled', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Log Path')).toBeInTheDocument();
    expect(screen.getByText('Log Level')).toBeInTheDocument();
  });

  it('renders log path input with default value', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const logPathInputs = screen.getAllByDisplayValue('~/.claude/audit.log');
    expect(logPathInputs.length).toBeGreaterThan(0);
  });

  it('calls onUpdate when log path changes', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const logPathInputs = screen.getAllByDisplayValue('~/.claude/audit.log');
    fireEvent.change(logPathInputs[0], { target: { value: '~/.claude/custom-audit.log' } });

    expect(onUpdate).toHaveBeenCalledWith('security.auditLogPath', '~/.claude/custom-audit.log');
  });

  it('renders log level dropdown with correct options', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const logLevelSelects = container.querySelectorAll('select');
    const logLevelSelect = Array.from(logLevelSelects).find(select => select.value === 'info');
    expect(logLevelSelect).toBeDefined();

    const options = logLevelSelect.querySelectorAll('option');
    expect(options[0].value).toBe('error');
    expect(options[1].value).toBe('warn');
    expect(options[2].value).toBe('info');
    expect(options[3].value).toBe('debug');
  });

  it('calls onUpdate when log level changes', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const logLevelSelects = container.querySelectorAll('select');
    const logLevelSelect = Array.from(logLevelSelects).find(select => select.value === 'info');
    fireEvent.change(logLevelSelect, { target: { value: 'debug' } });

    expect(onUpdate).toHaveBeenCalledWith('security.auditLogLevel', 'debug');
  });

  it('shows audit logging eli5 description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Keep a log of everything the AI does for security review/)).toBeInTheDocument();
  });

  it('shows audit logging complex description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Enable comprehensive audit logging of all agent actions/)).toBeInTheDocument();
  });

  it('shows eli5 label for log path input', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Log File Location')).toBeInTheDocument();
  });

  it('shows eli5 label for log level dropdown', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, auditLogging: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Detail Level')).toBeInTheDocument();
  });
});

describe('SecuritySection - Advanced Security: PII Detection', () => {
  beforeEach(() => {
    setupMocks();
  });

  const advancedSecurityProps = {
    settings: {
      security: {
        sandbox: true,
        autoAllowBash: false,
        cveScanning: false,
        cveScanFrequency: 'daily',
        cveSeverityThreshold: 'high',
        auditLogging: false,
        auditLogPath: '~/.claude/audit.log',
        auditLogLevel: 'info',
        piiDetection: false,
        threatModeling: false,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  it('renders PII detection toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.piiDetection')).toBeInTheDocument();
  });

  it('shows PII detection label in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('PII Detection')).toBeInTheDocument();
  });

  it('shows PII detection label in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.piiDetection')).toBeInTheDocument();
  });

  it('calls onUpdate when PII detection toggle is clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    const piiToggle = toggles[4];
    fireEvent.click(piiToggle);

    expect(onUpdate).toHaveBeenCalledWith('security.piiDetection', true);
  });

  it('hides PII patterns when piiDetection is disabled', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.queryByText(/Social Security Numbers/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email Addresses/)).not.toBeInTheDocument();
  });

  it('shows PII patterns when piiDetection is enabled', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, piiDetection: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Social Security Numbers/)).toBeInTheDocument();
    expect(screen.getByText(/Email Addresses/)).toBeInTheDocument();
  });

  it('displays SSN pattern', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, piiDetection: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Social Security Numbers \(###-##-####\)/)).toBeInTheDocument();
  });

  it('displays email pattern', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, piiDetection: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Email Addresses \(user@domain\.com\)/)).toBeInTheDocument();
  });

  it('displays phone pattern', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, piiDetection: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Phone Numbers \(###-###-####\)/)).toBeInTheDocument();
  });

  it('displays credit card pattern', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, piiDetection: true },
    };
    render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Credit Card Numbers \(####-####-####-####\)/)).toBeInTheDocument();
  });

  it('shows PII detection eli5 description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Detect and warn about personal information in your code/)).toBeInTheDocument();
  });

  it('shows PII detection complex description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Enable PII detection scanning for sensitive data patterns/)).toBeInTheDocument();
  });
});

describe('SecuritySection - Advanced Security: Threat Modeling', () => {
  beforeEach(() => {
    setupMocks();
  });

  const advancedSecurityProps = {
    settings: {
      security: {
        sandbox: true,
        autoAllowBash: false,
        cveScanning: false,
        cveScanFrequency: 'daily',
        cveSeverityThreshold: 'high',
        auditLogging: false,
        auditLogPath: '~/.claude/audit.log',
        auditLogLevel: 'info',
        piiDetection: false,
        threatModeling: false,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  it('renders threat modeling toggle', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.threatModeling')).toBeInTheDocument();
  });

  it('shows threat modeling label in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Threat Modeling')).toBeInTheDocument();
  });

  it('shows threat modeling label in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.threatModeling')).toBeInTheDocument();
  });

  it('calls onUpdate when threat modeling toggle is clicked', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    const threatToggle = toggles[5];
    fireEvent.click(threatToggle);

    expect(onUpdate).toHaveBeenCalledWith('security.threatModeling', true);
  });

  it('hides STRIDE categories when threatModeling is disabled', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.queryByText(/Spoofing/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tampering/)).not.toBeInTheDocument();
  });

  it('shows STRIDE categories when threatModeling is enabled', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, threatModeling: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const text = container.textContent;
    expect(text).toContain('Spoofing');
    expect(text).toContain('Tampering');
  });

  it('displays all STRIDE categories', () => {
    const onUpdate = vi.fn();
    const settingsEnabled = {
      ...advancedSecurityProps.settings,
      security: { ...advancedSecurityProps.settings.security, threatModeling: true },
    };
    const { container } = render(
      <SecuritySection
        settings={settingsEnabled}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const text = container.textContent;
    expect(text).toContain('Spoofing - Identity forgery and authentication bypass');
    expect(text).toContain('Tampering - Unauthorized modification of data or code');
    expect(text).toContain('Repudiation - Denial of responsibility for actions');
    expect(text).toContain('Information Disclosure - Unauthorized access to sensitive data');
    expect(text).toContain('Denial of Service - Resource exhaustion and availability attacks');
    expect(text).toContain('Elevation of Privilege - Unauthorized escalation of permissions');
  });

  it('shows threat modeling eli5 description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Have the AI analyze potential security threats in your project/)).toBeInTheDocument();
  });

  it('shows threat modeling complex description', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Enable STRIDE-based automated threat modeling/)).toBeInTheDocument();
  });
});

describe('SecuritySection - Advanced Security: Cross-cutting Concerns', () => {
  beforeEach(() => {
    setupMocks();
  });

  const advancedSecurityProps = {
    settings: {
      security: {
        sandbox: true,
        autoAllowBash: false,
        cveScanning: false,
        cveScanFrequency: 'daily',
        cveSeverityThreshold: 'high',
        auditLogging: false,
        auditLogPath: '~/.claude/audit.log',
        auditLogLevel: 'info',
        piiDetection: false,
        threatModeling: false,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  it('renders Advanced Security heading', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('Advanced Security')).toBeInTheDocument();
  });

  it('renders all 4 advanced security toggles together', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.cveScanning')).toBeInTheDocument();
    expect(screen.getByText('security.auditLogging')).toBeInTheDocument();
    expect(screen.getByText('security.piiDetection')).toBeInTheDocument();
    expect(screen.getByText('security.threatModeling')).toBeInTheDocument();
  });

  it('shows all features in eli5 mode with simple labels', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('CVE Scanning')).toBeInTheDocument();
    expect(screen.getByText('Audit Logging')).toBeInTheDocument();
    expect(screen.getByText('PII Detection')).toBeInTheDocument();
    expect(screen.getByText('Threat Modeling')).toBeInTheDocument();
  });

  it('shows all features in complex mode with technical labels', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText('security.cveScanning')).toBeInTheDocument();
    expect(screen.getByText('security.auditLogging')).toBeInTheDocument();
    expect(screen.getByText('security.piiDetection')).toBeInTheDocument();
    expect(screen.getByText('security.threatModeling')).toBeInTheDocument();
  });

  it('handles missing security settings gracefully', () => {
    const onUpdate = vi.fn();
    const settingsWithoutSecurity = {
      permissions: { allow: [], deny: [] },
      env: {},
    };
    const { container } = render(
      <SecuritySection
        settings={settingsWithoutSecurity}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Sandbox & Security')).toBeInTheDocument();
  });

  it('handles undefined security fields gracefully', () => {
    const onUpdate = vi.fn();
    const settingsPartial = {
      security: {
        cveScanning: undefined,
        auditLogging: undefined,
        piiDetection: undefined,
        threatModeling: undefined,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    };
    const { container } = render(
      <SecuritySection
        settings={settingsPartial}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('security.cveScanning')).toBeInTheDocument();
  });

  it('displays eli5 descriptions for all features when in eli5 mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="eli5"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Automatically check your code for known security vulnerabilities/)).toBeInTheDocument();
    expect(screen.getByText(/Keep a log of everything the AI does for security review/)).toBeInTheDocument();
    expect(screen.getByText(/Detect and warn about personal information in your code/)).toBeInTheDocument();
    expect(screen.getByText(/Have the AI analyze potential security threats in your project/)).toBeInTheDocument();
  });

  it('displays complex descriptions for all features when in complex mode', () => {
    const onUpdate = vi.fn();
    render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    expect(screen.getByText(/Enable CVE scanning against the NVD database/)).toBeInTheDocument();
    expect(screen.getByText(/Enable comprehensive audit logging of all agent actions/)).toBeInTheDocument();
    expect(screen.getByText(/Enable PII detection scanning for sensitive data patterns/)).toBeInTheDocument();
    expect(screen.getByText(/Enable STRIDE-based automated threat modeling/)).toBeInTheDocument();
  });

  it('all advanced features can be independently toggled', () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <SecuritySection
        settings={advancedSecurityProps.settings}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const toggles = container.querySelectorAll('.toggle-switch');
    const cveToggle = toggles[2];
    const auditToggle = toggles[3];
    const piiToggle = toggles[4];
    const threatToggle = toggles[5];

    fireEvent.click(cveToggle);
    expect(onUpdate).toHaveBeenCalledWith('security.cveScanning', true);

    fireEvent.click(auditToggle);
    expect(onUpdate).toHaveBeenCalledWith('security.auditLogging', true);

    fireEvent.click(piiToggle);
    expect(onUpdate).toHaveBeenCalledWith('security.piiDetection', true);

    fireEvent.click(threatToggle);
    expect(onUpdate).toHaveBeenCalledWith('security.threatModeling', true);

    expect(onUpdate).toHaveBeenCalledTimes(4);
  });

  it('defaults to correct values when not specified in settings', () => {
    const onUpdate = vi.fn();
    const settingsWithDefaults = {
      security: {
        cveScanning: true,
        cveScanFrequency: 'weekly',
        cveSeverityThreshold: 'high',
        auditLogging: true,
        auditLogPath: '~/.claude/audit.log',
        auditLogLevel: 'info',
        piiDetection: false,
        threatModeling: false,
      },
      permissions: { allow: [], deny: [] },
      env: {},
    };
    const { container } = render(
      <SecuritySection
        settings={settingsWithDefaults}
        mode="complex"
        onUpdate={onUpdate}
      />
    );

    const frequencySelects = container.querySelectorAll('select');
    const frequencySelectFound = Array.from(frequencySelects).find(select =>
      select.value === 'weekly'
    );
    expect(frequencySelectFound).toBeDefined();
  });
});
