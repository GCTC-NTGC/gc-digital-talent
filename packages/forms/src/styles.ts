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

export const inputStyles = tv({
  base: "rounded-md border-1 p-3 text-black outline-offset-2 outline-none placeholder:text-gray-600 placeholder:opacity-70 focus-visible:outline-2 focus-visible:outline-focus dark:text-white",
});

export const selectStyles = tv({
  extend: inputStyles,
  base: "bg-[url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(86, 86, 90, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>)] dark:bg-[url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(191, 191, 191, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>)] appearance-none bg-size-[1rem] bg-position-[var(--spacing*4.5)_calc(100%-.75rem)] bg-no-repeat p-3 pr-9",
});

export default fieldStateStyles;
