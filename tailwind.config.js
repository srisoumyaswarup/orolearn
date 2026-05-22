/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oro: {
          navy: '#001F3F',      // Exact deep navy blue from logo
          gold: '#D4AF37',      // Exact premium gold from logo
          light: '#F8FAFC',     // Clean off-white background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // A clean, modern sans-serif font
      }
    },
  },
  plugins: [],
}