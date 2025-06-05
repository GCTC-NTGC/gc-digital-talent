import { tv } from "tailwind-variants";

import { FieldState } from "./types";

const fieldStateStyles: Record<FieldState, Record<string, string>> = {
  unset: {
    "data-h2-background-color": "base(foreground)",
    "data-h2-border-color": "base(gray) base:focus-visible(focus)",
  },
  invalid: {
    "data-h2-background-color": "base(error.lightest)",
    "data-h2-border-color": "base(error.darker) base:focus-visible(focus)",
  },
  dirty: {
    "data-h2-background-color": "base(foreground)",
    "data-h2-border-color": "base(secondary.darker) base:focus-visible(focus)",
  },
};

export const checkboxRadioStyles = tv({
  slots: {
    input:
      "m-0 grid h-6 w-6 shrink-0 transform appearance-none place-content-center border border-gray-700 bg-white leading-6 text-current before:h-3 before:w-3 before:scale-0 before:bg-secondary checked:before:scale-100 focus-visible:bg-focus focus-visible:before:bg-black dark:border-gray-100 dark:bg-gray-700 dark:before:bg-secondary-200",
  },
  variants: {
    shouldReduceMotion: {
      false: { input: "transition-transform duration-200 ease-in-out" },
    },
  },
});

export const inputStyles = tv({
  base: "rounded-md border-1 border-gray bg-white p-3 text-black outline-offset-2 placeholder:text-gray-600 placeholder:opacity-70 focus-visible:border-focus focus-visible:outline-2 focus-visible:outline-focus dark:bg-gray-600 dark:text-white",
  variants: {
    state: {
      // NOTE: compat, remove when all inputs completed
      unset: "",
      invalid:
        "border-error-500 bg-error-100 dark:border-error-300 dark:bg-error-700",
      dirty: "border-secondary-500 dark:border-secondary-300",
    },
  },
});

export const selectStyles = tv({
  extend: inputStyles,
  base: "bg-[url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(86, 86, 90, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>)] dark:bg-[url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(191, 191, 191, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>)] appearance-none bg-size-[1rem] bg-position-[var(--spacing*4.5)_calc(100%-.75rem)] bg-no-repeat p-3 pr-9",
});

export default fieldStateStyles;
