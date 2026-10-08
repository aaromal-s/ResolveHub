/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f4f8fb',
          100: '#e5eff5',
          200: '#cddce6',
          300: '#a6c2d6',
          400: '#7aa2be',
          500: '#5a84a6',
          600: '#476887',
          700: '#3a536e',
          800: '#31455b',
          900: '#2b394b',
          950: '#111a26',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7cc8fc',
          400: '#38a9f8',
          500: '#0e8ee9',
          600: '#0270c5',
          700: '#0359a0',
          800: '#074c83',
          900: '#0b406e',
          950: '#07294a',
        },
        tealbrand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
