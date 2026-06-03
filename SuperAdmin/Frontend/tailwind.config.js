/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0B0F19",
          surface: "#151B2C",
          border: "#2C3A5A",
          muted: "#9CA3AF",
        },
        accent: {
          cyan: "#00F0FF",
          purple: "#9D00FF",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      }
    },
  },
  plugins: [],
}
