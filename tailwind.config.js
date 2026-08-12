/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#121212',
          surface: '#16161c',
          card: '#1a1a20',
          cardHover: '#262730',
          input: '#18181c',
          muted: '#BCBCBC',
          primary: '#274B9B',
          primaryHover: '#345ec0',
          border: '#2e2e36',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
