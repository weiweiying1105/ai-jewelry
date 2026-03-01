import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'lavender-soft': '#F3E8FF',
        ivory: '#FCFBF7',
        'deep-purple': '#4A3B63',
        'soft-gray': '#6B7280',
        'accent-purple': '#8E7AB5',
        // Birthday page palette
        'deep-blue': '#1F2A44',
        'accent-blue': '#4F46E5',
        'soft-blue': '#EAF0FF',
        'muted-gray': '#64748B',
        'gold-soft': '#FADFB3',
        // Direction selector primary (purple)
        primary: '#8E7AB5',
        "lavender-light": "#F3E8FF",
        "lavender-deep": "#D8B4FE",
        "stone-green": "#2D4F4F",
        "text-primary": "#2D3436",
        "mystic-purple": "#6D28D9",
        "accent-gold": "#C5A059"
      },
      fontFamily: {
        'serif-zh': ['Noto Serif SC', 'serif'],
        'sans-zh': ['Noto Sans SC', 'sans-serif'],

        "serif": ["Noto Serif SC", "serif"],
        "sans": ["Plus Jakarta Sans", "sans-serif"]
      },
    },
  },
};

export default config;
