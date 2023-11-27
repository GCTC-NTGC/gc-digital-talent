import { Color } from "@gc-digital-talent/ui";

export type SwitchColor = Omit<
  Color,
  "black" | "white" | "blackFixed" | "whiteFixed"
>;

const getStyles = (color: SwitchColor): Record<string, string> => {
  let colorStyle: Record<string, string> = {};

  if (color === "primary") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](primary)",
    };
  } else if (color === "secondary") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](secondary)",
    };
  } else if (color === "tertiary") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](tertiary)",
    };
  } else if (color === "quaternary") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](quaternary)",
    };
  } else if (color === "quinary") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](quinary)",
    };
  } else if (color === "success") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](success)",
    };
  } else if (color === "warning") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](warning)",
    };
  } else if (color === "error") {
    colorStyle = {
      "data-h2-background-color":
        "base(gray) base:focus-visible(focus) base:selectors[[data-state='checked']](error)",
    };
  }

  return colorStyle;
};

export default getStyles;
