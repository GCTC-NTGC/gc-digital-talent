import type { HeadingLevel, Color } from "./Heading";

export const headingStyles: Record<HeadingLevel, Record<string, string>> = {
  h1: {
    "data-h2-font-size": "base(h1)",
    "data-h2-font-weight": "base(700)",
  },
  h2: {
    "data-h2-font-size": "base(h2)",
    "data-h2-font-weight": "base(700)",
    "data-h2-margin": "base(x2, 0, x.5, 0)",
  },
  h3: {
    "data-h2-font-size": "base(h3)",
    "data-h2-font-weight": "base(400)",
    "data-h2-margin": "base(x1.5, 0, x.25, 0)",
  },
  h4: {
    "data-h2-font-size": "base(h4)",
    "data-h2-font-weight": "base(400)",
    "data-h2-margin": "base(x1.5, 0, x.25, 0)",
  },
  h5: {
    "data-h2-font-size": "base(h5)",
    "data-h2-font-weight": "base(400)",
    "data-h2-margin": "base(x1, 0, x.25, 0)",
  },
  h6: {
    "data-h2-font-size": "base(h6)",
    "data-h2-font-weight": "base(700)",
    "data-h2-margin": "base(x1, 0, x.25, 0)",
  },
};

export const iconStyles: Record<Color, Record<string, string>> = {
  yellow: {
    "data-h2-color": "base:children[svg](tm-yellow)",
  },
  blue: {
    "data-h2-color": "base:children[svg](tm-blue)",
  },
  red: {
    "data-h2-color": "base:children[svg](tm-red)",
  },
  purple: {
    "data-h2-color": "base:children[svg](tm-purple)",
  },
};
