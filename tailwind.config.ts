import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg:    '#0a0a1a',
          card:  '#0f0f2a',
          cyan:  '#00e5ff',
          pink:  '#ff2d78',
          green: '#00ff9d',
          orange:'#ff9100',
          purple:'#9d4edd',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
