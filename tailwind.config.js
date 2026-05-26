/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
      Helvetica: ["Helvetica", "sans-serif"],
    },
    extend: {
      colors: {
        orange: "#E16F3D",
        gray: "#525252",
        black: "#171717",
      },
    },
  },
  plugins: [],
};
