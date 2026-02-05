/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tet-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'tet-yellow': {
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      fontFamily: {
        'tet': ['serif'],
        'traditional': ['serif', 'Georgia', 'Times New Roman'],
        'body': ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

