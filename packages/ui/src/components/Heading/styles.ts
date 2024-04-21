import { Color } from "../../types";
import type { HeadingLevel } from "./Heading";

export const headingStyles: Record<HeadingLevel, Record<string, string>> = {
  h1: {
    "data-h2-font-size": "base(h1)",
  },
  h2: {
    "data-h2-font-size": "base(h2)",
  },
  h3: {
    "data-h2-font-size": "base(h3)",
  },
  h4: {
    "data-h2-font-size": "base(h4)",
  },
  h5: {
    "data-h2-font-size": "base(h5)",
  },
  h6: {
    "data-h2-font-size": "base(h6)",
  },
};

export const iconStyles: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-color": "base(primary)",
  },
  secondary: {
    "data-h2-color": "base(secondary) base:iap:dark(secondary.lighter)",
  },
  secondaryDarkFixed: {
    "data-h2-color":
      "base(secondary) base:iap(secondary) base:iap:dark(secondary.lighter)",
  },
  tertiary: {
    "data-h2-color":
      "base(tertiary) base:iap(secondary) base:iap:dark(secondary.lighter)",
  },
  quaternary: {
    "data-h2-color":
      "base(quaternary) base:iap(secondary) base:iap:dark(secondary.lighter)",
  },
  quinary: {
    "data-h2-color":
      "base(quinary) base:iap(secondary) base:iap:dark(secondary.lighter)",
  },
  error: {
    "data-h2-color": "base(error)",
  },
  warning: {
    "data-h2-color": "base(warning)",
  },
  success: {
    "data-h2-color": "base(success) base:dark(success.light)",
  },
  black: {
    "data-h2-color": "base(black)",
  },
  blackFixed: {
    "data-h2-color": "base:all(black)",
  },
  white: {
    "data-h2-color": "base(white)",
  },
  whiteFixed: {
    "data-h2-color": "base:all(white)",
  },
};
