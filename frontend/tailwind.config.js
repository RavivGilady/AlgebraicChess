module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          light: "#F9DBBA",
          dark: "#543A14",
          hover: "#6b4b1b",
        },
        background: "#FFF0DC",
        accent: "#F0BB78",
        inputText: "#543A14",
        dark: "#  ",
      },
      fontSize: {
        "move-input": "72pt",
        "move-list": "14pt",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "fade-out": "fadeOut 0.2s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
