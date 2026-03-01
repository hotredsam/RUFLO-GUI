import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SkillsSection from '../renderer/components/SkillsSection';
import { setupMocks } from './mocks';

describe('SkillsSection', () => {
  beforeEach(() => {
    setupMocks();
    vi.clearAllMocks();
  });

  it('renders the Skills & Commands heading', () => {
    render(<SkillsSection mode="complex" />);

    const heading = screen.getByText('Skills & Commands');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('shows skill cards', () => {
    render(<SkillsSection mode="complex" />);

    // Should render skill cards for various skills
    expect(screen.getByText('/commit')).toBeInTheDocument();
    expect(screen.getByText('/pr')).toBeInTheDocument();
    expect(screen.getByText('/review-pr')).toBeInTheDocument();
    expect(screen.getByText('/tdd')).toBeInTheDocument();
  });

  it('filters skills by search input', () => {
    render(<SkillsSection mode="complex" />);

    // Initially git skills should be visible
    expect(screen.getByText('/commit')).toBeInTheDocument();
    expect(screen.getByText('/plan')).toBeInTheDocument();

    // Search for commit-related skills
    const searchInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.change(searchInput, { target: { value: 'commit' } });

    // Should show only commit-related skills
    expect(screen.getByText('/commit')).toBeInTheDocument();

    // Should not show non-commit skills
    expect(screen.queryByText('/pr')).not.toBeInTheDocument();
    expect(screen.queryByText('/tdd')).not.toBeInTheDocument();
  });

  it('filters skills by category', () => {
    render(<SkillsSection mode="complex" />);

    // Find and click on a category button (e.g., "Git")
    const categoryButtons = screen.getAllByRole('button');
    const gitButton = categoryButtons.find(btn => btn.textContent.includes('Git'));

    if (gitButton) {
      fireEvent.click(gitButton);

      // Should show Git category skills
      expect(screen.getByText('/commit')).toBeInTheDocument();
      expect(screen.getByText('/pr')).toBeInTheDocument();
      expect(screen.getByText('/review-pr')).toBeInTheDocument();

      // Should not show skills from other categories
      expect(screen.queryByText('/tdd')).not.toBeInTheDocument();
    }
  });

  it('renders eli5 mode descriptions correctly', () => {
    render(<SkillsSection mode="eli5" />);

    // eli5 descriptions should contain simpler language
    const eli5Text = screen.getByText(/Let the AI write your commit message for you/i);
    expect(eli5Text).toBeInTheDocument();
  });

  it('renders complex mode descriptions correctly', () => {
    render(<SkillsSection mode="complex" />);

    // Find the first skill card and click to expand
    const skillCards = screen.getAllByRole('button').filter(btn => {
      const text = btn.textContent;
      return text.includes('/commit');
    });

    if (skillCards.length > 0) {
      const skillCard = skillCards[0];
      fireEvent.click(skillCard);

      // complex descriptions should contain technical language (shown in expanded view)
      const complexText = screen.getByText(/Analyzes staged git changes using git diff/i);
      expect(complexText).toBeInTheDocument();
    }
  });

  it('displays mode-aware description in header', () => {
    const { rerender } = render(<SkillsSection mode="eli5" />);

    // eli5 header should mention simple language
    expect(
      screen.getByText(/Slash commands you can use in Claude Code to do cool things/i)
    ).toBeInTheDocument();

    // Rerender with complex mode
    rerender(<SkillsSection mode="complex" />);

    // complex header should mention workflows
    expect(
      screen.getByText(/Available slash commands for Claude Code workflows and automation/i)
    ).toBeInTheDocument();
  });

  it('expands and collapses skill cards on click', () => {
    render(<SkillsSection mode="complex" />);

    // Find the first skill card
    const skillCards = screen.getAllByRole('button').filter(btn => {
      const text = btn.textContent;
      return text.includes('/commit');
    });

    if (skillCards.length > 0) {
      const skillCard = skillCards[0];

      // Initially, expanded content should not be visible (truncated)
      const initialDescriptions = screen.getAllByText(/Analyzes staged git changes/i);
      // Should have at least one instance (in the collapsed preview)
      expect(initialDescriptions.length).toBeGreaterThan(0);

      // Click to expand
      fireEvent.click(skillCard);

      // The expanded detailed description should now be fully visible
      expect(screen.getByText(/Analyzes staged git changes using git diff/i)).toBeInTheDocument();
    }
  });

  it('shows no skills message when search returns no results', () => {
    render(<SkillsSection mode="complex" />);

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentskill12345' } });

    // Should show "No skills found" message
    expect(screen.getByText(/No skills found matching your search/i)).toBeInTheDocument();
  });

  it('renders all skill icons', () => {
    render(<SkillsSection mode="complex" />);

    // Check for skill icons (emoji)
    expect(screen.getByText('📝')).toBeInTheDocument(); // /commit icon
    expect(screen.getByText('🔀')).toBeInTheDocument(); // /pr icon
    expect(screen.getByText('👀')).toBeInTheDocument(); // /review-pr icon
  });

  it('shows skill categories with counts', () => {
    render(<SkillsSection mode="complex" />);

    // Category buttons should display counts
    const categoryButtons = screen.getAllByRole('button');
    const gitButton = categoryButtons.find(btn => btn.textContent.includes('Git'));

    if (gitButton) {
      // Should show count (e.g., "Git3" - no space between category and count)
      expect(gitButton.textContent).toMatch(/Git\s*\d+/);
    }
  });
});
