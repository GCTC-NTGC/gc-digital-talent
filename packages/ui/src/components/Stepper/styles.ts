import { StepState } from "./types";

export const iconColorMap = new Map<StepState, Record<string, string>>([
  [
    "active",
    {
      "data-h2-background-color": "base(primary)",
      "data-h2-color": "base(black)",
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
      "data-h2-background-color": "base(black.lightest)",
      "data-h2-color": "base(black)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": "base(error)",
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
