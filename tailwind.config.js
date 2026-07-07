/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: '#F3E9D6',
        'sand-dark': '#E6D6B0',
        paper: '#FBF7EC',
        'ocean-deep': '#0B4B63',
        'ocean-mid': '#136C86',
        'ocean-light': '#4FA8C9',
        turtle: '#3F8F5F',
        'turtle-dark': '#2C6B45',
        clay: '#B5652E',
        gold: '#D9A441',
        coral: '#D9695A',
        ink: '#1E2A24',
        'ink-soft': '#4B5750',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        figtree: ['Figtree', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 6px 18px rgba(11, 75, 99, 0.10)',
      }
    },
  },
  plugins: [],
}
