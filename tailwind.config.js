/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      Inter: ["Inter", "sans-serif"],
      Helvetica: ["Helvetica", "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      white: "white",
      black: "#171717",
      orange: "#E16F3D",
      gray: "#525252",
    },
    extend: {},
  },
  plugins: [],
};
