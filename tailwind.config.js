// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a1a1a",
          light: "#2d2d2d",
          dark: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#4a4a4a",
          light: "#6b6b6b",
          dark: "#2d2d2d",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};