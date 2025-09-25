/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.tsx",  // Make sure this is included
    "./src/App.tsx",   // Explicitly include your App
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'xs:py-2',
    'xs:flex-row',
    // Add any other dynamic classes if needed
  ]
}