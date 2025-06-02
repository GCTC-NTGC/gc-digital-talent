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

export default fieldStateStyles;
