/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#07090e',
          900: '#0c1017',
          850: '#111722',
          800: '#172033',
          700: '#1f2b45',
          600: '#2c3b5d',
        },
        neon: {
          cyan: '#00f2fe',
          emerald: '#10b981',
          lime: '#a3e635',
          purple: '#b026ff',
          pink: '#f43f5e',
          amber: '#f59e0b',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.45)',
        'neon-purple': '0 0 20px -3px rgba(176, 38, 255, 0.45)',
        'neon-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.45)',
        'neon-amber': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
