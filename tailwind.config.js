/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crema: '#F5F5DC',   // fondo principal
        navy: '#2C3E50',    // textos y logo
        oro: '#D4AF37',     // títulos, botones, acentos
      }
    }
  },
  plugins: [],
}