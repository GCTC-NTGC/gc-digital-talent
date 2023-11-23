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

export default fieldStateStyles;
