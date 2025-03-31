/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4169E1', // Royal Blue
          light: '#6495ED',
          dark: '#27408B',
        },
        secondary: {
          DEFAULT: '#F4A460', // Sandy Brown
          light: '#FFA07A',
          dark: '#CD853F',
        },
        background: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F5F5',
        },
        text: {
          DEFAULT: '#333333',
          light: '#666666',
          dark: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 