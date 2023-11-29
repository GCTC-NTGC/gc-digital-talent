import { Color } from "@gc-digital-talent/ui";

export type SwitchColor = Omit<
  Color,
  "black" | "white" | "blackFixed" | "whiteFixed"
>;

const getStyles = (
  color: SwitchColor,
  disabled?: boolean,
): Record<string, string> => {
  let colorStyle: Record<string, string> = {};

  if (disabled) {
    return {
      "data-h2-background-color":
        "base(gray.light) base:focus-visible(focus) base:selectors[[data-state='checked']](gray.dark)",
    };
  }

  if (color === "primary") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](primary.light)",
    };
  } else if (color === "secondary") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](secondary)",
    };
  } else if (color === "tertiary") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](tertiary)",
    };
  } else if (color === "quaternary") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](quaternary)",
    };
  } else if (color === "quinary") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](quinary)",
    };
  } else if (color === "success") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](success.light)",
    };
  } else if (color === "warning") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](warning)",
    };
  } else if (color === "error") {
    colorStyle = {
      "data-h2-background-color":
        "base(background.dark) base:focus-visible(focus) base:selectors[[data-state='checked']](error.light)",
    };
  }

  return colorStyle;
};

export default getStyles;
