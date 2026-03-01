import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CapabilitiesSection from '../renderer/components/CapabilitiesSection';
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

describe('CapabilitiesSection', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders Capabilities heading', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Capabilities')).toBeInTheDocument();
  });

  it('displays eli5 subtitle in eli5 mode', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    expect(
      screen.getByText('Everything your AI assistant can do for you.')
    ).toBeInTheDocument();
  });

  it('displays complex subtitle in complex mode', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(
      screen.getByText(/Full capability matrix for RUFLO and Claude Code agent framework/)
    ).toBeInTheDocument();
  });

  it('displays capability cards with icons', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('🧠')).toBeInTheDocument();
    expect(screen.getByText('💻')).toBeInTheDocument();
    expect(screen.getByText('✏️')).toBeInTheDocument();
  });

  it('displays capability names', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Multi-Model Support')).toBeInTheDocument();
    expect(screen.getByText('Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Code Editing & Refactoring')).toBeInTheDocument();
  });

  it('displays category badges on cards', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const coreCategories = screen.getAllByText('Core');
    expect(coreCategories.length).toBeGreaterThan(0);
  });

  it('displays feature badges for capabilities', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Model switching')).toBeInTheDocument();
    expect(screen.getByText('Multi-language support')).toBeInTheDocument();
  });

  it('shows category filter buttons', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const allButton = screen.getAllByText(/^All$/).find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(allButton).toBeInTheDocument();

    const coreButton = screen.getAllByText('Core').find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(coreButton).toBeInTheDocument();

    const intelligenceButton = screen.getAllByText('Intelligence').find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(intelligenceButton).toBeInTheDocument();

    const orchestrationButton = screen.getAllByText('Orchestration').find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(orchestrationButton).toBeInTheDocument();

    const securityButton = screen.getAllByText('Security').find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(securityButton).toBeInTheDocument();

    const integrationButton = screen.getAllByText('Integration').find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(integrationButton).toBeInTheDocument();

    const performanceButton = screen.getAllByText('Performance').find(
      (el) => el.className.includes('px-4 py-2')
    );
    expect(performanceButton).toBeInTheDocument();
  });

  it('filters capabilities by category when category button is clicked', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const coreButton = screen.getAllByText('Core').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(coreButton);

    expect(screen.getByText('Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Automated Code Review')).toBeInTheDocument();

    expect(screen.queryByText('Agent Swarm Orchestration')).not.toBeInTheDocument();
  });

  it('shows All category button displays all capabilities', () => {
    const { rerender } = render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const allButton = screen.getAllByText(/^All/).find(
      (el) => el.className.includes('px-4 py-2')
    );

    expect(screen.getByText('Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Agent Swarm Orchestration')).toBeInTheDocument();
  });

  it('highlights selected category button', () => {
    const { container } = render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const coreButton = screen.getAllByText('Core').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(coreButton);

    expect(coreButton.className).toContain('bg-accent');
  });

  it('allows searching capabilities by name', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'code' } });

    expect(screen.getByText('Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Code Editing & Refactoring')).toBeInTheDocument();
    expect(screen.getByText('Automated Code Review')).toBeInTheDocument();

    expect(screen.queryByText('Multi-Model Support')).not.toBeInTheDocument();
  });

  it('allows searching capabilities by eli5 description', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'models' } });

    expect(screen.getByText('Multi-Model Support')).toBeInTheDocument();
  });

  it('allows searching capabilities by complex description', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'transformer' } });

    expect(screen.getByText('Code Generation')).toBeInTheDocument();
  });

  it('displays eli5 descriptions in eli5 mode', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="eli5"
      />
    );

    expect(
      screen.getByText('Work with multiple AI models to find the best one for your task.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ask the AI to write code for you in any programming language.')
    ).toBeInTheDocument();
  });

  it('displays complex descriptions in complex mode', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(
      screen.getByText(/Support for multiple LLM backends/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Multi-language code generation using transformer-based LLMs/)
    ).toBeInTheDocument();
  });

  it('shows no results message when search returns nothing', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(
      screen.getByText('No capabilities found matching your search.')
    ).toBeInTheDocument();
  });

  it('no results message shown when category filter results in empty', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const coreButton = screen.getAllByText('Core').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(coreButton);

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'swarm' } });

    expect(
      screen.getByText('No capabilities found matching your search.')
    ).toBeInTheDocument();
  });

  it('combines category filter and search filters correctly', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const securityButton = screen.getAllByText('Security').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(securityButton);

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'permission' } });

    expect(screen.getByText('Permission Management')).toBeInTheDocument();
    expect(screen.queryByText('Multi-Model Support')).not.toBeInTheDocument();
    expect(screen.queryByText('Security Scanning')).not.toBeInTheDocument();
  });

  it('displays correct feature counts for categories', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const buttons = screen.getAllByRole('button');
    const coreButton = buttons.find((btn) => btn.textContent.includes('Core'));

    expect(coreButton.textContent).toMatch(/\d+/);
  });

  it('case-insensitive search works', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'CODE' } });

    expect(screen.getByText('Code Generation')).toBeInTheDocument();
    expect(screen.getByText('Code Editing & Refactoring')).toBeInTheDocument();
  });

  it('search persists when changing categories', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'code' } });

    const coreButton = screen.getAllByText('Core').find(
      (el) => el.className.includes('px-4 py-2')
    );
    fireEvent.click(coreButton);

    expect(searchInput.value).toBe('code');
  });

  it('default category is All', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const allButton = screen.getAllByText(/^All/).find(
      (el) => el.className.includes('px-4 py-2')
    );

    expect(allButton.className).toContain('bg-accent');
  });

  it('displays feature badges for capabilities with features', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Model switching')).toBeInTheDocument();
    expect(screen.getByText('Ensemble inference')).toBeInTheDocument();
    expect(screen.getByText('Performance metrics')).toBeInTheDocument();
  });

  it('does not break when capability has no features', () => {
    render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Code Generation')).toBeInTheDocument();
  });

  it('shows search icon in search box', () => {
    const { container } = render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchIcon = container.querySelector('.glass-card .text-slate-500');
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon.textContent).toBe('🔍');
  });

  it('clears search and shows all capabilities when search is cleared', () => {
    const { rerender } = render(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search capabilities...');
    fireEvent.change(searchInput, { target: { value: 'code' } });

    expect(screen.queryByText('Multi-Model Support')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });

    rerender(
      <CapabilitiesSection
        settings={defaultSettings}
        mode="complex"
      />
    );

    expect(screen.getByText('Multi-Model Support')).toBeInTheDocument();
  });
});
