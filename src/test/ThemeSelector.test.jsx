import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMocks } from './mocks';
import ThemeSelector from '../renderer/components/ThemeSelector';
import { THEMES } from '../renderer/lib/themes';

describe('ThemeSelector', () => {
  beforeEach(() => {
    setupMocks();
  });

  const defaultProps = {
    currentTheme: 'amethyst',
    onThemeChange: vi.fn(),
  };

  it('renders theme label', () => {
    render(<ThemeSelector {...defaultProps} />);
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('renders a button for each theme', () => {
    render(<ThemeSelector {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(THEMES.length);
  });

  it('each button has the theme name as title', () => {
    render(<ThemeSelector {...defaultProps} />);
    THEMES.forEach((theme) => {
      expect(screen.getByTitle(theme.name)).toBeInTheDocument();
    });
  });

  it('each button shows the theme icon', () => {
    render(<ThemeSelector {...defaultProps} />);
    THEMES.forEach((theme) => {
      expect(screen.getByTitle(theme.name).textContent).toBe(theme.icon);
    });
  });

  it('each button has the theme accent color as background', () => {
    render(<ThemeSelector {...defaultProps} />);
    THEMES.forEach((theme) => {
      const button = screen.getByTitle(theme.name);
      expect(button.style.backgroundColor).toBeTruthy();
    });
  });

  it('active theme button has ring-2 class', () => {
    render(<ThemeSelector {...defaultProps} />);
    const activeButton = screen.getByTitle('Amethyst');
    expect(activeButton.className).toContain('ring-2');
  });

  it('inactive theme buttons have opacity-70 class', () => {
    render(<ThemeSelector {...defaultProps} />);
    const inactiveButton = screen.getByTitle('Forest');
    expect(inactiveButton.className).toContain('opacity-70');
  });

  it('calls onThemeChange when a theme button is clicked', () => {
    const onThemeChange = vi.fn();
    render(<ThemeSelector {...defaultProps} onThemeChange={onThemeChange} />);
    fireEvent.click(screen.getByTitle('Forest'));
    expect(onThemeChange).toHaveBeenCalledWith('forest');
  });

  it('calls onThemeChange with correct theme id for each theme', () => {
    const onThemeChange = vi.fn();
    render(<ThemeSelector {...defaultProps} onThemeChange={onThemeChange} />);
    THEMES.forEach((theme) => {
      fireEvent.click(screen.getByTitle(theme.name));
      expect(onThemeChange).toHaveBeenCalledWith(theme.id);
    });
  });

  it('highlights the currently selected theme', () => {
    render(<ThemeSelector currentTheme="sakura" onThemeChange={vi.fn()} />);
    const sakuraButton = screen.getByTitle('Sakura');
    expect(sakuraButton.className).toContain('scale-110');
    const amethystButton = screen.getByTitle('Amethyst');
    expect(amethystButton.className).not.toContain('scale-110');
  });
});
