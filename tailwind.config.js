/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Bổ sung dòng này để bật dark mode theo class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
