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
          dark: '#FFFFFF',
          surface: '#f8fafc',
          card: '#ffffff',
          cardHover: '#f1f5f9',
          input: '#ffffff',
          muted: '#64748b',
          primary: '#274B9B',
          primaryHover: '#1e3a78',
          border: '#e2e8f0',
          white: '#ffffff',
          text: '#121212',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
