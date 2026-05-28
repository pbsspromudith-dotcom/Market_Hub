/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**",
    "!./dist/**",
    "!./api/**",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2558a7",
        "primary-hover": "#1d4a8f",
        "primary-light": "#3b82f6",
        "primary-soft": "#60a5fa",
        "primary-neutral": "#94a3b8",
        "secondary": "#cc2d2d",
        "secondary-hover": "#a82222",
        "accent": "#cc2d2d",
        "background-light": "#f8fafc",
        "background-dark": "#1a1a1a",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
