import { FieldState } from "./types";

const fieldStateStyles: Record<FieldState, Record<string, string>> = {
  unset: {
    "data-h2-border":
      "base(2px solid gray) base:focus-visible(2px solid secondary)",
    "data-h2-background-color": "base(white)",
    "data-h2-outline": "base(none)",
  },
  invalid: {
    "data-h2-border": "base(2px solid tertiary.dark)",
    "data-h2-background-color": "base(tertiary.lightest)",
  },
  dirty: {
    "data-h2-border": "base(2px solid secondary.dark)",
  },
};

export default fieldStateStyles;
