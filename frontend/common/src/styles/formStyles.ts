import { FieldState } from "../helpers/formUtils";

// Note: Expect this file to grow and include more than one export
// eslint-disable-next-line import/prefer-default-export
export const fieldStateStyles: Record<FieldState, Record<string, string>> = {
  unset: {
    "data-h2-border": "base(all, 2px, solid, dt-gray)",
    "data-h2-background-color": "base(dt-white)",
  },
  invalid: {
    "data-h2-border": "base(all, 2px, solid, dark.dt-error)",
    "data-h2-background-color": "base(light.dt-error.1)",
  },
  dirty: {
    "data-h2-border": "base(all, 2px, solid, dark.tm-blue)",
    "data-h2-background-color": "base(light.tm-blue)",
  },
};
