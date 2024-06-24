import { Color } from "../../types";
import type { HeadingLevel } from "./types";

export const headingStyles: Record<HeadingLevel, Record<string, string>> = {
  h1: {
    "data-h2-font-size": "base(h1)",
    "data-h2-font-weight": "base(700)",
    "data-h2-stroke-width": "base:children[svg path](1.5)",
    "data-h2-height": "base:children[svg](x2)",
    "data-h2-width": "base:children[svg](x2)",
  },
  h2: {
    "data-h2-font-size": "base(h2)",
    "data-h2-font-weight": "base(700)",
    "data-h2-margin": "base(x2, 0, x.5, 0)",
    "data-h2-stroke-width": "base:children[svg path](1.6)",
    "data-h2-height": "base:children[svg](x1.65)",
    "data-h2-width": "base:children[svg](x1.65)",
  },
  h3: {
    "data-h2-font-size": "base(h3)",
    "data-h2-font-weight": "base(400)",
    "data-h2-margin": "base(x1.5, 0, x.25, 0)",
    "data-h2-stroke-width": "base:children[svg path](1.6)",
    "data-h2-height": "base:children[svg](x1.35)",
    "data-h2-width": "base:children[svg](x1.35)",
  },
  h4: {
    "data-h2-font-size": "base(h4)",
    "data-h2-font-weight": "base(400)",
    "data-h2-margin": "base(x1.5, 0, x.25, 0)",
    "data-h2-stroke-width": "base:children[svg path](1.6)",
    "data-h2-height": "base:children[svg](x1.15)",
    "data-h2-width": "base:children[svg](x1.15)",
  },
  h5: {
    "data-h2-font-size": "base(h5)",
    "data-h2-font-weight": "base(400)",
    "data-h2-margin": "base(x1, 0, x.25, 0)",
    "data-h2-stroke-width": "base:children[svg path](1.6)",
    "data-h2-height": "base:children[svg](x.95)",
    "data-h2-width": "base:children[svg](x.95)",
  },
  h6: {
    "data-h2-font-size": "base(h6)",
    "data-h2-font-weight": "base(700)",
    "data-h2-margin": "base(x1, 0, x.25, 0)",
    "data-h2-stroke-width": "base:children[svg path](1.6)",
    "data-h2-height": "base:children[svg](x.8)",
    "data-h2-width": "base:children[svg](x.8)",
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
