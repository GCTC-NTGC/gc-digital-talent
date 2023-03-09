import { StepState } from "./types";

export const iconColorMap = new Map<StepState, Record<string, string>>([
  [
    "active",
    {
      "data-h2-background-color":
        "base(primary.light) base:admin(primary) base:iap(secondary)",
      "data-h2-color": "base(black) base:admin(white) base:iap(white)",
    },
  ],

  [
    "completed",
    {
      "data-h2-background-color": "base(success.light)",
      "data-h2-color": "base(black)",
    },
  ],
  [
    "disabled",
    {
      "data-h2-background-color": "base(gray.light)",
      "data-h2-color": "base(black)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": "base(error.light)",
      "data-h2-color": "base(black)",
    },
  ],
]);

export const linkStyleMap = new Map<StepState, Record<string, string>>([
  [
    "active",
    {
      "data-h2-font-weight": "base(700)",
      "data-h2-text-decoration": "base(none)",
    },
  ],

  [
    "completed",
    {
      "data-h2-text-decoration": "base(underline)",
    },
  ],
  [
    "disabled",
    {
      "data-h2-text-decoration": "base(none)",
      "data-h2-pointer-events": "base(none)",
    },
  ],
  [
    "error",
    {
      "data-h2-text-decoration": "base(underline)",
    },
  ],
]);
