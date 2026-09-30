/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#131921",
          light: "#232f3e",
        },
        accent: {
          orange: "#ff9900",
          cart: "#ffd814",
          cartBorder: "#fcd200",
          buy: "#ffa41c",
          buyBorder: "#fb8c00",
        },
        deal: "#cc0c39",
        savings: "#007600",
        star: "#ffa41c",
        pagebg: "#e3e6e6",
        link: "#007185",
      },
      fontSize: {
        xxs: "11px",
      },
      boxShadow: {
        card: "0 2px 5px 0 rgba(213,217,217,.5)",
      },
    },
  },
  plugins: [],
}
