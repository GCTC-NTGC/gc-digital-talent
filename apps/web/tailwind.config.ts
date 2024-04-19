import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{tsx,ts}"],
  theme: {
    extend: {
      colors: {
        primary: `rgb(var(--color-primary) / <alpha-value>)`,
        background: `rgb(var(--color-background) / <alpha-value>)`,
      },
    },
  },
  plugins: [],
} satisfies Config;
