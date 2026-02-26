import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lavender-soft': '#F3E8FF',
        ivory: '#FCFBF7',
        'deep-purple': '#4A3B63',
        'soft-gray': '#6B7280',
        'accent-purple': '#8E7AB5',
      },
      fontFamily: {
        'serif-zh': ['Noto Serif SC', 'serif'],
        'sans-zh': ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
export default config;