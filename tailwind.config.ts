import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFCFA',
          100: '#FAF7F2',
          200: '#F4EDE3',
          300: '#EDE1D0',
        },
        charcoal: {
          900: '#0F0F0F',
          800: '#1C1C1C',
          700: '#2D2D2D',
          600: '#3D3D3D',
          500: '#6B6B6B',
          400: '#9A9A9A',
          300: '#C2C2C2',
        },
        gold: {
          DEFAULT: '#C4956A',
          light:   '#D4AA87',
          dark:    '#A67952',
          pale:    '#F0E4D4',
        },
        sage: {
          DEFAULT: '#7B9E87',
          light:   '#97B5A1',
          dark:    '#5E7E6B',
          pale:    '#E4EDE7',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['10rem',  { lineHeight: '1' }],
        '9xl':  ['8rem',   { lineHeight: '1' }],
        '8xl':  ['6rem',   { lineHeight: '1.05' }],
        '7xl':  ['4.5rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-up':     'fadeUp 0.8s ease forwards',
        'fade-in':     'fadeIn 1s ease forwards',
        'slide-right': 'slideRight 0.8s ease forwards',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'grain':       'grain 0.5s steps(1) infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.7', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':      { transform: 'translate(-2%, -3%)' },
          '20%':      { transform: 'translate(3%, 1%)' },
          '30%':      { transform: 'translate(-1%, 4%)' },
          '40%':      { transform: 'translate(2%, -2%)' },
          '50%':      { transform: 'translate(-3%, 3%)' },
          '60%':      { transform: 'translate(1%, -1%)' },
          '70%':      { transform: 'translate(-2%, 2%)' },
          '80%':      { transform: 'translate(3%, -3%)' },
          '90%':      { transform: 'translate(-1%, 1%)' },
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise':             "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      boxShadow: {
        'soft':    '0 4px 30px rgba(0,0,0,0.06)',
        'medium':  '0 8px 50px rgba(0,0,0,0.1)',
        'strong':  '0 20px 80px rgba(0,0,0,0.15)',
        'card':    '0 2px 20px rgba(0,0,0,0.07), 0 8px 40px rgba(0,0,0,0.05)',
        'gold':    '0 8px 40px rgba(196,149,106,0.25)',
        'inset-t': 'inset 0 4px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
