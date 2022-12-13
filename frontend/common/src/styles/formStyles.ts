import { FieldState } from "../helpers/formUtils";

// Note: Expect this file to grow and include more than one export
// eslint-disable-next-line import/prefer-default-export
export const fieldStateStyles: Record<FieldState, Record<string, string>> = {
  unset: {
    "data-h2-border":
      "base(all, 2px, solid, dt-gray) base:focus-visible(all, 2px, solid, tm-blue)",
    "data-h2-background-color": "base(dt-white)",
    "data-h2-outline": "base(none)",
  },
  invalid: {
    "data-h2-border": "base(all, 2px, solid, dark.tm-red)",
    "data-h2-background-color": "base(lightest.tm-red)",
  },
  dirty: {
    "data-h2-border": "base(all, 2px, solid, dark.tm-blue)",
  },
};
