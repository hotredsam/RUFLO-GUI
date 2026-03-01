export const THEMES = [
  {
    id: 'amethyst',
    name: 'Amethyst',
    icon: '💜',
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    accentRgb: '139 92 246',
    accentHoverRgb: '124 58 237',
    accentLightRgb: '196 181 253',   // purple-200 equivalent
    accentMedRgb: '167 139 250',     // purple-300 equivalent
    accentMedDarkRgb: '139 92 246',  // purple-400 ≈ same as 500 for this
    bgVia: '#1e1b4b',
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    accent: '#10b981',
    accentHover: '#059669',
    accentRgb: '16 185 129',
    accentHoverRgb: '5 150 105',
    accentLightRgb: '167 243 208',   // emerald-200
    accentMedRgb: '110 231 183',     // emerald-300
    accentMedDarkRgb: '52 211 153',  // emerald-400
    bgVia: '#064e3b',
  },
  {
    id: 'sakura',
    name: 'Sakura',
    icon: '🌸',
    accent: '#ec4899',
    accentHover: '#db2777',
    accentRgb: '236 72 153',
    accentHoverRgb: '219 39 119',
    accentLightRgb: '251 207 232',   // pink-200
    accentMedRgb: '249 168 212',     // pink-300
    accentMedDarkRgb: '244 114 182', // pink-400
    bgVia: '#500724',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    accent: '#06b6d4',
    accentHover: '#0891b2',
    accentRgb: '6 182 212',
    accentHoverRgb: '8 145 178',
    accentLightRgb: '165 243 252',   // cyan-200
    accentMedRgb: '103 232 249',     // cyan-300
    accentMedDarkRgb: '34 211 238',  // cyan-400
    bgVia: '#0c4a6e',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentRgb: '245 158 11',
    accentHoverRgb: '217 119 6',
    accentLightRgb: '253 230 138',   // amber-200
    accentMedRgb: '252 211 77',      // amber-300
    accentMedDarkRgb: '251 191 36',  // amber-400
    bgVia: '#451a03',
  },
];

export const DEFAULT_THEME = 'amethyst';

export function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;

  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-hover', theme.accentHover);
  root.style.setProperty('--accent-rgb', theme.accentRgb);
  root.style.setProperty('--accent-hover-rgb', theme.accentHoverRgb);
  root.style.setProperty('--accent-light-rgb', theme.accentLightRgb);
  root.style.setProperty('--accent-med-rgb', theme.accentMedRgb);
  root.style.setProperty('--accent-med-dark-rgb', theme.accentMedDarkRgb);
  root.style.setProperty('--bg-via', theme.bgVia);

  root.setAttribute('data-theme', theme.id);
  return theme;
}
