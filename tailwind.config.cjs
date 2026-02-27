/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Nunito Sans"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 16px 32px rgba(229, 9, 20, 0.24)'
      }
    }
  },
  plugins: []
};
