/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marcona: {
          blue: '#004A87',
          light: '#E6F0F9',
          gold: '#EAB308',
          dark: '#1E293B',
          gray: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}