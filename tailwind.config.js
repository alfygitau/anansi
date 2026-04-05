/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // This syntax allows bg-primary/20 to work!
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        success: "rgb(var(--color-success-rgb) / <alpha-value>)",
        error: "rgb(var(--color-error-rgb) / <alpha-value>)",
        warning: "rgb(var(--color-warning-rgb) / <alpha-value>)",

        // Legacy alias for your existing code
        bluemain: "rgb(var(--color-primary-rgb) / <alpha-value>)",
      },
      boxShadow: {
        brand: "var(--shadow-brand)",
      },
      screens: { sm: { max: "640px" } },
    },
  },
  plugins: [],
};
