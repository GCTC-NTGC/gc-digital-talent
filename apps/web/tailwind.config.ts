import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{tsx,ts}",
    "./public/**/*.html",
    "../../packages/**/src/**/*.{tsx,ts}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    boxShadow: {
      inner: "inset 0 0.125rem 0.5rem 0 rgba(0, 0, 0, var(--shadow-opacity))",
      sm: "0 0.1rem 0.2rem 0 rgba(0, 0, 0, var(--shadow-opacity))",
      md: "0 0.25rem 0.5rem -0.05rem rgba(0, 0, 0, var(--shadow-opacity))",
      lg: "0 0.4rem 0.7rem -0.1rem rgba(0, 0, 0, var(--shadow-opacity))",
      xl: "0 0.55rem 1rem -0.2rem rgba(0, 0, 0, var(--shadow-opacity))",
      "2xl": "0 0.7rem 1.5rem -0.3rem rgba(0, 0, 0, var(--shadow-opacity))",
    },
    fontFamily: {
      sans: ["Open Sans", "sans-serif"],
    },
    screens: {
      sm: "48em",
      md: "67.5em",
      lg: "80em",
      xl: "100em",
    },
    extend: {
      borderRadius: {
        DEFAULT: "0.3125rem",
      },
      colors: {
        primary: `rgb(var(--color-primary) / <alpha-value>)`,
        background: `rgb(var(--color-background) / <alpha-value>)`,
      },
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
