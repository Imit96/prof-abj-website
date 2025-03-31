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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 