/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
      },
    },
    colors: {
      blue: "#3342B1",
      white: "#fff",
      black: "#353535",
      grey: "#DDDDDD",
      "grey-50": "#B8B8B8",
      "grey-70": "#818181",
      danger: "#DC3545",
      orange: "#ee6c4d",
      yellow: "#b5a528",
      green: "#50a92d",
    },
  },
  plugins: [],
};
