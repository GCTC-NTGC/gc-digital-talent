import { FieldState } from "./types";

const fieldStateStyles: Record<FieldState, Record<string, string>> = {
  unset: {
    "data-h2-border":
      "base(2px solid dt-gray) base:focus-visible(2px solid tm-blue)",
    "data-h2-background-color": "base(dt-white)",
    "data-h2-outline": "base(none)",
  },
  invalid: {
    "data-h2-border": "base(2px solid tm-red.dark)",
    "data-h2-background-color": "base(tm-red.lightest)",
  },
  dirty: {
    "data-h2-border": "base(2px solid tm-blue.dark)",
  },
};

export default fieldStateStyles;
