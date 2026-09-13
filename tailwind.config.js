/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pb-bg': '#121212',
        'pb-panel': '#1e1e1e',
        'pb-text': '#c0c0c0',
        'pb-highlight': '#ffffff',
        'pb-green': '#4caf50',
        'pb-red': '#f44336',
        'pb-blue': '#2196f3',
        'pb-yellow': '#ffeb3b',
        'pb-border': '#333333',
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
