/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D52D6", // Blue primary
          light: "#EBF5FF",
          dark: "#0B3D9B",
        },
        space: {
          bg: "#F9FAFB",      // White/light-gray background
          border: "#E5E7EB",  // Light border
          muted: "#6B7280",   // Gray text
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
