import { describe, it, expect, beforeEach } from 'vitest';
import { THEMES, DEFAULT_THEME, applyTheme } from '../renderer/lib/themes';

describe('themes', () => {
  beforeEach(() => {
    // Reset document state before each test
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.cssText = '';
  });

  it('exports 5 themes', () => {
    expect(THEMES).toHaveLength(5);
  });

  it('each theme has required fields', () => {
    THEMES.forEach((theme) => {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.icon).toBeTruthy();
      expect(theme.accent).toMatch(/^#/);
      expect(theme.accentRgb).toMatch(/^\d+ \d+ \d+$/);
    });
  });

  it('default theme is amethyst', () => {
    expect(DEFAULT_THEME).toBe('amethyst');
  });

  it('all theme ids are unique', () => {
    const ids = THEMES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('applyTheme sets CSS variables on document', () => {
    applyTheme('forest');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--accent')).toBe('#10b981');
    expect(root.getAttribute('data-theme')).toBe('forest');
  });

  it('applyTheme falls back to first theme for unknown id', () => {
    applyTheme('nonexistent');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--accent')).toBe('#8b5cf6');
    expect(root.getAttribute('data-theme')).toBe('amethyst');
  });

  it('applyTheme sets all required CSS variables', () => {
    applyTheme('ocean');
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--accent')).toBe('#06b6d4');
    expect(root.style.getPropertyValue('--accent-hover')).toBe('#0891b2');
    expect(root.style.getPropertyValue('--accent-rgb')).toBe('6 182 212');
    expect(root.style.getPropertyValue('--accent-hover-rgb')).toBe('8 145 178');
    expect(root.style.getPropertyValue('--accent-light-rgb')).toBe('165 243 252');
    expect(root.style.getPropertyValue('--accent-med-rgb')).toBe('103 232 249');
    expect(root.style.getPropertyValue('--accent-med-dark-rgb')).toBe('34 211 238');
    expect(root.style.getPropertyValue('--bg-via')).toBe('#0c4a6e');
  });

  it('applyTheme returns the applied theme object', () => {
    const result = applyTheme('sunset');
    expect(result.id).toBe('sunset');
    expect(result.name).toBe('Sunset');
    expect(result.icon).toBe('🌅');
  });
});
