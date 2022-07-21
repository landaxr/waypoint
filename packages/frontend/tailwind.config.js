module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
      monospace: ["Overpass Mono", "monospace"],
    },

    extend: {
      colors: {
        white: "#f1f0f0",
        red: "#f13223",
        "red-light": "#fa6559",
      },
    },
  },
  plugins: [],
};
