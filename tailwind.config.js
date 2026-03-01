/** @type {import('tailwindcss').Config} */
export default {
  content: ['index.html', 'src/renderer/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
        },
        dark: {
          glass: 'rgba(15, 23, 42, 0.6)',
          blue: {
            900: '#0f1729',
            800: '#1a2847',
          },
          purple: {
            900: '#2d1b4e',
            800: '#3d2463',
          },
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover-rgb) / <alpha-value>)',
          light: 'rgb(var(--accent-light-rgb) / <alpha-value>)',
          med: 'rgb(var(--accent-med-rgb) / <alpha-value>)',
          'med-dark': 'rgb(var(--accent-med-dark-rgb) / <alpha-value>)',
        },
      },
      backdropBlur: {
        glass: 'blur(10px)',
      },
    },
  },
  plugins: [],
};
