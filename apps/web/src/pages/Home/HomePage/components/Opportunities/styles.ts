import type { Color } from "@gc-digital-talent/ui";

export type HomeButtonColor = Extract<
  Color,
  "yellow" | "red" | "blue" | "black" | "purple"
>;

export const colorMap: Record<HomeButtonColor, Record<string, string>> = {
  yellow: {
    "data-h2-border-left": "base(x.25 solid quaternary)",
  },
  red: {
    "data-h2-border-left": "base(x.25 solid tertiary)",
  },
  blue: {
    "data-h2-border-left": "base(x.25 solid secondary)",
  },
  black: {
    "data-h2-border-left": "base(x.25 solid black)",
  },
  purple: {
    "data-h2-border-left": "base(x.25 solid primary)",
  },
};
