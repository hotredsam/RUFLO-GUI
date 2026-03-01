import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserGuideSection from '../renderer/components/UserGuideSection';
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

describe('UserGuideSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders User Guide heading', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('User Guide')).toBeInTheDocument();
  });

  it('displays eli5 subtitle in eli5 mode', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    expect(
      screen.getByText('Step-by-step instructions to help you get the most out of RUFLO.')
    ).toBeInTheDocument();
  });

  it('displays complex subtitle in complex mode', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(
      screen.getByText(/Comprehensive guides for RUFLO configuration, agent setup, and advanced workflows/)
    ).toBeInTheDocument();
  });

  it('displays guide entries', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Getting Started with RUFLO')).toBeInTheDocument();
    expect(screen.getByText('Configuring Your First Agent')).toBeInTheDocument();
    expect(screen.getByText('Setting Up Hooks')).toBeInTheDocument();
  });

  it('displays guide category badges', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getAllByText('Getting Started').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Configuration').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Advanced').length).toBeGreaterThan(0);
  });

  it('displays guide icons', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🪝')).toBeInTheDocument();
  });

  it('shows category filter buttons', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText(/^All/)).toBeInTheDocument();
    expect(screen.getAllByText('Getting Started').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Configuration').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Advanced').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Troubleshooting').length).toBeGreaterThan(0);
  });

  it('filters guides by category when category button is clicked', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const gettingStartedButton = screen.getAllByText('Getting Started').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(gettingStartedButton);

    expect(screen.getByText('Getting Started with RUFLO')).toBeInTheDocument();
    expect(screen.getByText('Configuring Your First Agent')).toBeInTheDocument();

    expect(screen.queryByText('Using Swarm Mode')).not.toBeInTheDocument();
  });

  it('All category button displays all guides', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const allButton = screen.getAllByText(/^All/).find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(allButton);

    expect(screen.getByText('Getting Started with RUFLO')).toBeInTheDocument();
    expect(screen.getByText('Using Swarm Mode')).toBeInTheDocument();
  });

  it('highlights selected category button', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const advancedButton = screen.getAllByText('Advanced').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(advancedButton);

    expect(advancedButton.className).toContain('bg-accent');
  });

  it('expands guide to show steps when clicked', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    expect(screen.getByText('Install RUFLO')).toBeInTheDocument();
    expect(screen.getByText('Set Up Your Workspace')).toBeInTheDocument();
  });

  it('collapses guide when clicked again', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    const clickableArea = guideCard.querySelector('[class*="p-5"]');

    fireEvent.click(clickableArea);
    expect(screen.getByText('Install RUFLO')).toBeInTheDocument();

    fireEvent.click(clickableArea);
    expect(screen.queryByText('Install RUFLO')).not.toBeInTheDocument();
  });

  it('displays steps with correct numbering', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    fireEvent.click(guideTitle.closest('.glass-card'));

    const numberedSteps = screen.getAllByText(/^[1-4]$/);
    expect(numberedSteps.length).toBeGreaterThan(0);
  });

  it('displays step titles in expanded guide', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    expect(screen.getByText('Install RUFLO')).toBeInTheDocument();
    expect(screen.getByText('Set Up Your Workspace')).toBeInTheDocument();
    expect(screen.getByText('Test a Simple Task')).toBeInTheDocument();
    expect(screen.getByText('Review the CLAUDE.md')).toBeInTheDocument();
  });

  it('displays eli5 step descriptions in eli5 mode', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    expect(
      screen.getByText('Download and install RUFLO in your project.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Create the folders and files RUFLO needs.')
    ).toBeInTheDocument();
  });

  it('displays complex step descriptions in complex mode', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    expect(
      screen.getByText(/Run `npx ruflo@latest init`/)
    ).toBeInTheDocument();
  });

  it('changes descriptions when mode changes', () => {
    const { rerender } = render(
      <UserGuideSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    expect(
      screen.getByText('Download and install RUFLO in your project.')
    ).toBeInTheDocument();

    rerender(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(
      screen.getByText(/Run `npx ruflo@latest init`/)
    ).toBeInTheDocument();
  });

  it('clicking another guide collapses the previous one', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const firstGuide = screen.getByText('Getting Started with RUFLO');
    const secondGuide = screen.getByText('Configuring Your First Agent');

    const firstCard = firstGuide.closest('.glass-card');
    const secondCard = secondGuide.closest('.glass-card');

    fireEvent.click(firstCard.querySelector('[class*="p-5"]'));
    expect(screen.getByText('Install RUFLO')).toBeInTheDocument();

    fireEvent.click(secondCard.querySelector('[class*="p-5"]'));

    expect(screen.queryByText('Install RUFLO')).not.toBeInTheDocument();
    expect(screen.getByText('Choose an Agent Type')).toBeInTheDocument();
  });

  it('clicking an expanded guide collapses it', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const firstGuide = screen.getByText('Getting Started with RUFLO');
    const guideCard = firstGuide.closest('.glass-card');
    const clickableArea = guideCard.querySelector('[class*="p-5"]');

    fireEvent.click(clickableArea);
    expect(screen.getByText('Install RUFLO')).toBeInTheDocument();

    fireEvent.click(clickableArea);
    expect(screen.queryByText('Install RUFLO')).not.toBeInTheDocument();
  });

  it('displays correct category counts in filter buttons', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const buttons = screen.getAllByRole('button');
    const allButton = buttons.find((btn) => btn.textContent.trim().startsWith('All'));

    expect(allButton).toBeDefined();
    expect(allButton.textContent).toMatch(/All\s*\d+/);
  });

  it('guide subtitle shows eli5 description in eli5 mode', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    expect(
      screen.getByText('How to install and start using RUFLO with Claude Code.')
    ).toBeInTheDocument();
  });

  it('guide subtitle shows complex description in complex mode', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(
      screen.getByText('Initial setup and first-run walkthrough for RUFLO agent framework with Claude Code integration.')
    ).toBeInTheDocument();
  });

  it('default category is All', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const allButton = screen.getAllByText(/^All/).find(
      (el) => el.className.includes('px-4 py-2')
    );

    expect(allButton.className).toContain('bg-accent');
  });

  it('expands guide with down arrow indicator', () => {
    const { container } = render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    const clickableArea = guideCard.querySelector('[class*="p-5"]');
    const arrows = guideCard.querySelectorAll('span');

    const arrow = Array.from(arrows).find((span) => span.textContent === '▼');
    expect(arrow).toBeInTheDocument();
    expect(arrow.className).not.toContain('rotate-180');

    fireEvent.click(clickableArea);

    expect(arrow.className).toContain('rotate-180');
  });

  it('shows all guides on initial load', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Getting Started with RUFLO')).toBeInTheDocument();
    expect(screen.getByText('Managing Permissions')).toBeInTheDocument();
    expect(screen.getByText('Using Swarm Mode')).toBeInTheDocument();
    expect(screen.getByText('Troubleshooting Common Issues')).toBeInTheDocument();
  });

  it('filter persists when expanding guides', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const advancedButton = screen.getAllByText('Advanced').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(advancedButton);

    const swarmGuide = screen.getByText('Using Swarm Mode');
    const swarmCard = swarmGuide.closest('.glass-card');
    fireEvent.click(swarmCard.querySelector('[class*="p-5"]'));

    expect(screen.getByText('Create a Team')).toBeInTheDocument();
    expect(screen.queryByText('Install RUFLO')).not.toBeInTheDocument();
  });

  it('shows guide entry description before expansion', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    expect(
      screen.getByText('How to install and start using RUFLO with Claude Code.')
    ).toBeInTheDocument();
  });

  it('steps are correctly numbered starting from 1', () => {
    const { container } = render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    // Get the expanded step content area within the card
    const expandedContent = guideCard.querySelector('[class*="border-t"]');
    const stepElements = expandedContent.querySelectorAll('[class*="rounded-full"][class*="w-7"]');
    const stepNumbers = Array.from(stepElements).map((el) => parseInt(el.textContent));

    expect(stepNumbers[0]).toBe(1);
    expect(stepNumbers[1]).toBe(2);
    expect(stepNumbers[2]).toBe(3);
    expect(stepNumbers[3]).toBe(4);
  });

  it('shows purple gradient divider under heading', () => {
    const { container } = render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const divider = container.querySelector('.h-0\\.5.bg-gradient-to-r');
    expect(divider).toBeInTheDocument();
  });

  it('handles switching categories correctly after expansion', () => {
    render(
      <UserGuideSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const gettingStartedButton = screen.getAllByText('Getting Started').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(gettingStartedButton);

    const guideTitle = screen.getByText('Getting Started with RUFLO');
    const guideCard = guideTitle.closest('.glass-card');
    fireEvent.click(guideCard.querySelector('[class*="p-5"]'));

    expect(screen.getByText('Install RUFLO')).toBeInTheDocument();

    const advancedButton = screen.getAllByText('Advanced').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(advancedButton);

    expect(screen.queryByText('Install RUFLO')).not.toBeInTheDocument();
    expect(screen.getByText('Using Swarm Mode')).toBeInTheDocument();
  });
});
