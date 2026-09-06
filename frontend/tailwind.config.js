/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF9933',
          dark: '#E68019',
          light: '#FFF5EB',
          border: '#FFE0B2'
        },
        'india-green': {
          DEFAULT: '#138808',
          dark: '#0E6606',
          light: '#EAF8EA',
          border: '#C8E6C9'
        },
        'navy-blue': {
          DEFAULT: '#003366',
          dark: '#002244',
          light: '#E6EEF5',
          border: '#B3CCE6'
        },
        'sky-blue': {
          DEFAULT: '#EBF5FF',
          dark: '#B9DCFF',
          light: '#F4F9FF'
        },
        'surface-gray': {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        },
        bis: {
          blue: '#003366',
          navy: '#002244',
          gold: '#FF9933',
          accent: '#E68019',
          bg: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
