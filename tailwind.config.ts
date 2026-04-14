import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:        '#00588c',
        'primary-light':'#e8f1f8',
        accent:         '#b5730f',
        'accent-light': '#fef6e8',
        'text-dark':    '#272729',
        'text-body':    '#28282b',
        'border-card':  '#d9d9d9',
        'border-sec':   '#979797',
        'bg-warm':      '#fafaf8',
        'bg-cool':      '#f4f8fc',
      },
      fontFamily: {
        // These reference the CSS variables set by next/font in layout.tsx
        display: ['var(--font-spectral)', 'Georgia', 'serif'],
        heading: ['var(--font-athiti)', 'sans-serif'],
        body: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        athiti: '1.284',
        poppins: '1.606',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.3)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.2)' },
          '70%':      { transform: 'scale(1)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.35s cubic-bezier(0.16,1,0.3,1)',
        'accordion-up':   'accordion-up   0.25s cubic-bezier(0.16,1,0.3,1)',
        'heartbeat':      'heartbeat 1.8s ease-in-out infinite',
        'fade-up':        'fade-up 0.3s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}

export default config
