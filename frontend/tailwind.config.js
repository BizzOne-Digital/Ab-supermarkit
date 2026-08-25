/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: '#090F12',
        gold: {
          DEFAULT: '#C99A35',
          dark: '#A77A25',
        },
        creme: '#F5EEDF',
        ivory: '#FFFDF8',
        charcoal: '#292929',
      },
      fontFamily: {
        heading: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        body: ['"Manrope"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(9,15,18,0.08)',
      },
    },
  },
  plugins: [],
};
