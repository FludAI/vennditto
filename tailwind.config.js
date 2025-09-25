/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // covers everything under src
    "./src/**/*",                 // catch-all for non-standard imports
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
