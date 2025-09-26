/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.tsx",
    "./src/**/*.ts",
    "./src/**/*.jsx",
    "./src/**/*.js",
    "./src/*.tsx",  // Explicitly include root src files
    "./src/*.ts",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}