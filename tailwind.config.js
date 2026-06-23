/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // El Dorado palette
        'ed-black':   '#0D0C0A',
        'ed-dark':    '#1A1814',
        'ed-charcoal':'#2C2924',
        'ed-mid':     '#5A5548',
        'ed-stone':   '#8C8578',
        'ed-cream':   '#F2EDE4',
        'ed-white':   '#FAF8F4',
        'ed-gold':    '#B8972A',
        'ed-brass':   '#9A7D2E',
        'ed-gold-lt': '#D4B254',
        'ed-gold-dk': '#7A6020',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      letterSpacing: {
        'widest2': '0.25em',
      },
    },
  },
  plugins: [],
}
