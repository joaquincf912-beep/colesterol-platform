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
        cholesterol: {
          yellow: '#FFC700',
          'yellow-dim': '#FFC70033',
          black: '#000000',
          gray: '#1C1C1E',
          'gray-light': '#2C2C2E',
          'gray-mid': '#3A3A3C',
          white: '#FFFFFF',
          green: '#32D74B',
          red: '#FF453A',
          orange: '#FF9F0A',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        'apple': '22px',
        'apple-sm': '16px',
        'apple-xs': '12px',
        'apple-lg': '28px',
        'apple-xl': '36px',
      },
      boxShadow: {
        'apple': '0 2px 22px rgba(0, 0, 0, 0.3)',
        'apple-lg': '0 8px 40px rgba(0, 0, 0, 0.5)',
        'apple-glow': '0 0 60px rgba(255, 199, 0, 0.15)',
        'apple-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'apple-card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-lg': '40px',
      },
      animation: {
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-yellow': 'pulseYellow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-red': 'pulseRed 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseYellow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pulseRed: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
