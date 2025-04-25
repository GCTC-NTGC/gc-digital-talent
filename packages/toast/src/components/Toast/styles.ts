import { TypeOptions } from "react-toastify/unstyled";

const closeButtonStyles: Record<TypeOptions, Record<string, string>> = {
  default: {
    "data-h2-background-color":
      "base(transparent) base:hover(black.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base(inherit) base:dark(black.darkest) base:hover(black.darker) base:focus-visible(black) p-tablet:dark(inherit)",
  },
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(success.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base(inherit) base:dark(success.darkest) base:hover(success.darker) base:focus-visible(black) p-tablet:dark(inherit)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(warning.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base(inherit) base:dark(warning.darkest) base:hover(warning.darker) base:focus-visible(black) p-tablet:dark(inherit)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(secondary.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base(inherit) base:dark(secondary.darkest) base:hover(secondary.darker) base:focus-visible(black) p-tablet:dark(inherit)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(tertiary.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:dark(tertiary.darkest) base:hover(tertiary.darker) base:focus-visible(black) p-tablet:dark(inherit)",
  },
};

export default closeButtonStyles;
