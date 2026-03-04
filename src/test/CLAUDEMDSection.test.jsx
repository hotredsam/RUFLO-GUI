import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CLAUDEMDSection from '../renderer/components/CLAUDEMDSection';

describe('CLAUDEMDSection', () => {
  const defaultProps = {
    settings: {
      claudemd: {
        autoGenerate: false,
        templatePath: '',
        templateCategory: '',
        templateName: '',
      },
    },
    mode: 'complex',
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onUpdate.mockClear();
  });

  // Test 1: Renders heading "CLAUDE.md Templates"
  it('renders heading "CLAUDE.md Templates"', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    expect(screen.getByText('CLAUDE.md Templates')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /CLAUDE.md Templates/ })).toBeInTheDocument();
  });

  // Test 2: Shows eli5 description in eli5 mode
  it('shows eli5 description in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText(/Choose a template that tells Claude how to work on your specific type of project/)).toBeInTheDocument();
  });

  // Test 3: Shows complex description in complex mode
  it('shows complex description in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText(/Manage CLAUDE.md instruction templates for project-specific agent configuration/)).toBeInTheDocument();
  });

  // Test 4: Auto-generate toggle renders
  it('auto-generate toggle renders', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const toggleElement = screen.getByText(/Auto-Generate/);
    expect(toggleElement).toBeInTheDocument();
  });

  // Test 5: Clicking auto-generate toggle calls onUpdate
  it('clicking auto-generate toggle calls onUpdate', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    const { container } = render(<CLAUDEMDSection {...props} />);

    const toggleSwitch = container.querySelector('.toggle-switch');
    fireEvent.click(toggleSwitch);

    expect(onUpdate).toHaveBeenCalledWith('claudemd.autoGenerate', true);
  });

  // Test 6: Shows eli5 label for auto-generate in eli5 mode
  it('shows eli5 label for auto-generate in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText('Auto-Generate CLAUDE.md')).toBeInTheDocument();
  });

  // Test 7: Shows complex label for auto-generate in complex mode
  it('shows complex label for auto-generate in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText('Auto-Generate on Project Init')).toBeInTheDocument();
  });

  // Test 8: Template path input renders
  it('template path input renders', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const input = screen.getByPlaceholderText('/path/to/custom/claude.md');
    expect(input).toBeInTheDocument();
  });

  // Test 9: Template path input has correct placeholder
  it('template path input has correct placeholder', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const input = screen.getByPlaceholderText('/path/to/custom/claude.md');
    expect(input.placeholder).toBe('/path/to/custom/claude.md');
  });

  // Test 10: Changing template path calls onUpdate
  it('changing template path calls onUpdate', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<CLAUDEMDSection {...props} />);

    const input = screen.getByPlaceholderText('/path/to/custom/claude.md');
    fireEvent.change(input, { target: { value: '/home/user/claude.md' } });

    expect(onUpdate).toHaveBeenCalledWith('claudemd.templatePath', '/home/user/claude.md');
  });

  // Test 11: Renders all 5 category buttons
  it('renders all 5 category buttons', () => {
    const { container } = render(<CLAUDEMDSection {...defaultProps} />);
    const buttons = container.querySelectorAll('.px-4.py-2.rounded-lg');
    const categoryTexts = Array.from(buttons).map(btn => btn.textContent);
    expect(categoryTexts).toContain('Project Type');
    expect(categoryTexts).toContain('Methodology');
    expect(categoryTexts).toContain('Architecture');
    expect(categoryTexts).toContain('Language');
    expect(categoryTexts).toContain('Team Size');
  });

  // Test 12: Default selected category is "Project Type"
  it('default selected category is "Project Type"', () => {
    const { container } = render(<CLAUDEMDSection {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    const projectTypeButton = Array.from(buttons).find(btn => btn.textContent === 'Project Type');
    expect(projectTypeButton).toHaveClass('bg-accent');
  });

  // Test 13: Clicking category button changes displayed templates
  it('clicking category button changes displayed templates', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const methodologyButton = screen.getByText('Methodology');
    fireEvent.click(methodologyButton);

    expect(screen.getByText('Agile')).toBeInTheDocument();
    expect(screen.getByText('TDD')).toBeInTheDocument();
    expect(screen.getByText('SPARC')).toBeInTheDocument();
  });

  // Test 14: Renders template cards for selected category
  it('renders template cards for selected category', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
    expect(screen.getByText('API Service')).toBeInTheDocument();
  });

  // Test 15: Project Type shows 5 template cards
  it('project type shows 5 template cards', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const cards = screen.getAllByText(/Web App|Mobile App|API Service|CLI Tool|Library/);
    expect(cards.length).toBeGreaterThanOrEqual(5);
  });

  // Test 16: Clicking template card calls onUpdate with template info
  it('clicking template card calls onUpdate with template info', () => {
    const onUpdate = vi.fn();
    const props = { ...defaultProps, onUpdate };
    render(<CLAUDEMDSection {...props} />);

    const webAppButton = screen.getByText('Web App').closest('button');
    fireEvent.click(webAppButton);

    expect(onUpdate).toHaveBeenCalledWith('claudemd.templateCategory', 'Project Type');
    expect(onUpdate).toHaveBeenCalledWith('claudemd.templateName', 'web-app');
  });

  // Test 17: Selected template shows checkmark
  it('selected template shows checkmark', () => {
    const props = {
      ...defaultProps,
      settings: {
        claudemd: {
          autoGenerate: false,
          templatePath: '',
          templateCategory: 'Project Type',
          templateName: 'web-app',
        },
      },
    };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  // Test 18: Selected template has ring styling
  it('selected template has ring styling', () => {
    const props = {
      ...defaultProps,
      settings: {
        claudemd: {
          autoGenerate: false,
          templatePath: '',
          templateCategory: 'Project Type',
          templateName: 'web-app',
        },
      },
    };
    const { container } = render(<CLAUDEMDSection {...props} />);
    const ringElements = container.querySelectorAll('.ring-2.ring-accent');
    expect(ringElements.length).toBeGreaterThan(0);
  });

  // Test 19: Shows eli5 descriptions for templates in eli5 mode
  it('shows eli5 descriptions for templates in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText(/React\/Vue\/Angular project/)).toBeInTheDocument();
    expect(screen.getByText(/React Native\/Flutter project/)).toBeInTheDocument();
  });

  // Test 20: Shows complex descriptions for templates in complex mode
  it('shows complex descriptions for templates in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText(/Full-stack web application development with frontend frameworks/)).toBeInTheDocument();
  });

  // Test 21: About section renders in eli5 mode
  it('about section renders in eli5 mode', () => {
    const props = { ...defaultProps, mode: 'eli5' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText('About CLAUDE.md Templates')).toBeInTheDocument();
    expect(screen.getByText(/CLAUDE.md is a special file that tells Claude how to work on your project/)).toBeInTheDocument();
  });

  // Test 22: About section renders in complex mode
  it('about section renders in complex mode', () => {
    const props = { ...defaultProps, mode: 'complex' };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText('About CLAUDE.md Templates')).toBeInTheDocument();
    expect(screen.getByText(/CLAUDE.md templates provide project-specific instruction sets and context/)).toBeInTheDocument();
  });

  // Test 23: Handles missing claudemd settings gracefully
  it('handles missing claudemd settings gracefully', () => {
    const props = {
      ...defaultProps,
      settings: {},
    };
    render(<CLAUDEMDSection {...props} />);
    expect(screen.getByText('CLAUDE.md Templates')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('/path/to/custom/claude.md')).toBeInTheDocument();
  });

  // Test 24: Methodology category displays 3 templates
  it('methodology category displays correct templates', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const methodologyButton = screen.getByText('Methodology');
    fireEvent.click(methodologyButton);

    expect(screen.getByText('Agile')).toBeInTheDocument();
    expect(screen.getByText('TDD')).toBeInTheDocument();
    expect(screen.getByText('SPARC')).toBeInTheDocument();
  });

  // Test 25: Architecture category displays correct templates
  it('architecture category displays correct templates', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const architectureButton = screen.getByText('Architecture');
    fireEvent.click(architectureButton);

    expect(screen.getByText('Monolith')).toBeInTheDocument();
    expect(screen.getByText('Microservices')).toBeInTheDocument();
    expect(screen.getByText('Serverless')).toBeInTheDocument();
  });

  // Test 26: Language category displays correct templates
  it('language category displays correct templates', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const languageButton = screen.getByText('Language');
    fireEvent.click(languageButton);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.getByText('Rust')).toBeInTheDocument();
  });

  // Test 27: Team Size category displays correct templates
  it('team size category displays correct templates', () => {
    render(<CLAUDEMDSection {...defaultProps} />);
    const teamSizeButton = screen.getByText('Team Size');
    fireEvent.click(teamSizeButton);

    expect(screen.getByText('Solo')).toBeInTheDocument();
    expect(screen.getByText('Small Team')).toBeInTheDocument();
    expect(screen.getByText('Large Team')).toBeInTheDocument();
  });
});
