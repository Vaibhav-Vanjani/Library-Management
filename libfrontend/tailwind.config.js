/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        draw: {
          "0%": { strokeDasharray: "0 100" },
          "100%": { strokeDasharray: "100 0" },
        },
        slideDownFade: {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        toastSlide: {
          "0%": { opacity: 0, transform: "translate(-50%, -30px)" },
          "100%": { opacity: 1, transform: "translate(-50%, 0)" },
        },
      },
      animation: {
        toastSlide: "toastSlide 0.35s ease-out forwards",
        scaleIn: "scaleIn 0.4s ease-out forwards",
        draw: "draw 0.5s ease-out 0.3s forwards",
        slideDownFade: "slideDownFade 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
