import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          50: '#f8faf9',
          100: '#eef2f1',
          200: '#dce4e2',
          800: '#1a2320',
          900: '#0f1513',
        },
        accent: { DEFAULT: '#22c55e', dark: '#16a34a' },
      },
    },
  },
  plugins: [],
};

export default config;
