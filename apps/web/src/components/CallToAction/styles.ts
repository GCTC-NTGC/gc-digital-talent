import { Color } from "./types";

export const stylesMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](primary) base:hover:children[div:first-child](primary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid primary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:admin(white) base:children[>div:first-child]:admin:hover(black)",
  },
  secondary: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](secondary) base:hover:children[div:first-child](secondary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid secondary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:admin(white) base:children[>div:first-child]:admin:hover(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  tertiary: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](tertiary) base:hover:children[div:first-child](tertiary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid tertiary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  quaternary: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](quaternary) base:hover:children[div:first-child](quaternary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid quaternary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
  quinary: {
    "data-h2-background-color":
      "base:children[>div:not(:first-child)](foreground) base:focus-visible:children[>div:not(:first-child)](focus) base:children[div:first-child](quinary) base:hover:children[div:first-child](quinary.lightest)",
    "data-h2-border":
      "base:children[div:first-child](3px solid quinary) base:children[div:not(:first-child)](3px solid foreground) base:focus-visible:children[div:not(:first-child)](3px solid focus)",
    "data-h2-color":
      "base(black) base:children[>div:first-child]:iap(white) base:children[>div:first-child]:iap:hover(black)",
  },
};

export const commonStyles = {
  "data-h2-cursor": "base(pointer)",
  "data-h2-outline": "base(none)",
  "data-h2-display": "base(inline-flex)",
  "data-h2-align-items": "base(center)",
  "data-h2-padding": "base(0)",
  "data-h2-overflow": "base(hidden)",
  "data-h2-radius": "base(rounded)",
  "data-h2-shadow": "base(medium) base:hover(larger)",
  "data-h2-transition": "base(all ease .2s) base:children[*](all ease .2s)",
};
