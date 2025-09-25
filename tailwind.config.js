/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Add classes that might be dynamically generated
    'xs:py-2',
    'xs:flex-row',
    'md:grid-cols-2',
    'xl:grid-cols-3',
    'from-blue-500',
    'to-green-500',
    'bg-gradient-to-r',
    'animate-pulse',
    'animate-bounce',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}