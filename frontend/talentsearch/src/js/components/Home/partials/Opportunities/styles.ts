import type { Color } from "@common/components/Button";

export type HomeButtonColor = Extract<
  Color,
  "yellow" | "red" | "blue" | "black"
>;

export const colorMap: Record<HomeButtonColor, Record<string, string>> = {
  yellow: {
    "data-h2-border": "base(left, x.25, solid, tm-yellow)",
  },
  red: {
    "data-h2-border": "base(left, x.25, solid, tm-red)",
  },
  blue: {
    "data-h2-border": "base(left, x.25, solid, tm-blue)",
  },
  black: {
    "data-h2-border": "base(left, x.25, solid, black)",
  },
};
