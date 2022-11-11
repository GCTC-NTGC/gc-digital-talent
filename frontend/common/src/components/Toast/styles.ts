import { TypeOptions } from "react-toastify";

export const iconStyles = {
  "data-h2-width": "base(1rem)",
};

export const closeButtonStyles: Record<TypeOptions, Record<string, string>> = {
  default: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.black) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.black)  base:focus-visible(black)",
  },
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-green) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-green)  base:focus-visible(black)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-yellow) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-yellow)  base:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-blue) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-blue)  base:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-red) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-red)  base:focus-visible(black)",
  },
};
