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
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          50: '#f4f5f7',
          100: '#e5e7eb',
          200: '#9ca3af',
          300: '#6b7280',
          400: '#4b5563',
          700: '#1e2229',
          800: '#16191f',
          900: '#0e1014',
          950: '#08090c',
        },
        accent: {
          DEFAULT: '#00d4aa',
          hover: '#00f5c4',
          muted: 'rgba(0, 212, 170, 0.12)',
          glow: 'rgba(0, 212, 170, 0.35)',
        },
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgba(0, 212, 170, 0.25)',
        'glow-accent-sm': '0 0 12px rgba(0, 212, 170, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      borderRadius: {
        'card': '1rem',
        'card-lg': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
