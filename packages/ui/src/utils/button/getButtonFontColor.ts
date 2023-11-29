import { ButtonLinkMode, Color } from "../../types";

interface ButtonFontInterface {
  mode: ButtonLinkMode;
  color: Color;
  disabled?: boolean;
}

type ButtonFontColor = (args: ButtonFontInterface) => Record<string, string>;

const getFontColor: ButtonFontColor = ({ mode, color, disabled }) => {
  if (mode === "solid") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-color": `
            base(gray.lighter)
            base:focus-visible:all(black)

            base:children[.counter](gray.darkest)
            base:focus-visible:children[.counter](focus)`,
        };
      }
      return {
        "data-h2-color": `
          base(gray.darker)
          base:focus-visible:all(black)

          base:children[.counter](gray.lightest)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](primary.light)
          base:hover:children[.counter](primary.lightest)
          base:focus-visible:children[.counter](focus)

          base:iap:all(white) base:iap:hover(black)
          base:iap:focus-visible:all(black)

          base:iap:all:children[.counter](primary)
          base:iap:dark:hover:children[.counter](primary.darkest)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](secondary)
          base:hover:children[.counter](secondary.lightest)
          base:focus-visible:children[.counter](focus)

          base:iap:all(white)
          base:iap:hover(black)
          base:iap:focus-visible:all(black)

          base:iap:all:children[.counter](secondary)
          base:iap:dark:hover:children[.counter](secondary.darkest)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](tertiary)
          base:hover:children[.counter](tertiary.lightest)
          base:focus-visible:children[.counter](focus)

          base:iap:all(white)
          base:iap:hover(black)
          base:iap:focus-visible:all(black)

          base:iap:all:children[.counter](tertiary)
          base:iap:dark:hover:children[.counter](tertiary.darkest)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](quaternary)
          base:hover:children[.counter](quaternary.lightest)
          base:focus-visible:children[.counter](focus)

          base:iap:all(white)
          base:iap:hover(black)
          base:iap:focus-visible:all(black)

          base:iap:all:children[.counter](quaternary)
          base:iap:dark:hover:children[.counter](quaternary.darkest)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](quinary)
          base:hover:children[.counter](quinary.lightest)
          base:focus-visible:children[.counter](focus)

          base:iap:all(white)
          base:iap:hover(black)
          base:iap:focus-visible:all(black)

          base:iap:all:children[.counter](quinary)
          base:iap:dark:hover:children[.counter](quinary.darkest)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](success.light)
          base:hover:children[.counter](success.lightest)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](warning)
          base:hover:children[.counter](warning.lightest)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-color": `
          base:all(black)
          base:dark:hover(black)
          base:focus-visible:all(black)

          base:all:children[.counter](error.light)
          base:hover:children[.counter](error.lightest)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-color": `
          base(white)
          base:hover(black)
          base:focus-visible:all(black)

          base:children[.counter](gray.darkest)
          base:hover:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-color": `
          base:all(white)
          base:all:hover(black)
          base:all:focus-visible:all(black)

          base:all:children[.counter](gray.darkest)
          base:all:hover:children[.counter](white)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-color": `
          base(black)
          base:hover(white)
          base:focus-visible:all(black)

          base:children[.counter](gray.lightest)
          base:hover:children[.counter](black)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-color": `
          base:all(black)
          base:all:hover(white)
          base:all:focus-visible(black)

          base:all:children[.counter](gray.lightest)
          base:all:hover:children[.counter](black)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
  }
  if (mode === "inline" || mode === "text" || mode === "placeholder") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-color": `
            base(gray.lighter)
            base:all:focus-visible(black)

            base:children[.counter](black)
            base:focus-visible:children[.counter](focus)`,
        };
      }
      return {
        "data-h2-color": `
          base(gray.darker)
          base:all:focus-visible(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-color": `
          base(primary.darker)
          base:hover(primary.darkest)
          base:all:focus-visible(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-color": `
          base(secondary.darker)
          base:hover(secondary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(secondary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-color": `
          base(tertiary.darker)
          base:dark(tertiary.lightest)
          base:hover(tertiary.darkest)
          base:dark:hover(black)
          base:all:focus-visible(black)

          base:iap:dark(tertiary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-color": `
          base(quaternary.darker)
          base:hover(quaternary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(quaternary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-color": `
          base(quinary.darker)
          base:hover(quinary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(quinary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-color": `
          base(success.darker)
          base:hover(success.darkest)
          base:all:focus-visible(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-color": `
          base(warning.darker)
          base:hover(warning.darkest)
          base:all:focus-visible(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-color": `
          base(error.darker)
          base:hover(error.darkest)
          base:all:focus-visible(black)
          base:dark(error.lightest)
          base:dark:hover(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-color": `
          base(gray.darkest)
          base:hover(secondary.darker)
          base:all:focus-visible(black)

          base:dark:hover:iap(secondary.lightest)
          base:all:iap:focus-visible(black)

          base:children[.counter](white)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-color": `
          base:all(gray.darkest)
          base:all:hover(secondary.darker)
          base:all:focus-visible(black)

          base:all:iap:focus-visible(black)

          base:all:children[.counter](white)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-color": `
          base(gray.lightest)
          base:hover(secondary.lighter)
          base:all:focus-visible(black)

          base:iap:hover(secondary.lightest)
          base:dark:hover:iap(secondary.darker)
          base:all:iap:focus-visible(black)

          base:children[.counter](black)
          base:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-color": `
          base:all(gray.lightest)
          base:all:hover(secondary.lighter)
          base:all:focus-visible(black)

          base:all:iap:hover(secondary.lightest)
          base:all:iap:focus-visible(black)

          base:all:children[.counter](black)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
  }
  if (mode === "cta") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-color": `
            base:children[>span:first-child](gray.lighter)
            base:all:focus-visible:children[>span:first-child](black)

            base:children[>span:last-child](gray.darker)

            base:children[.counter](white)
            base:all:focus-visible:children[.counter](black)`,
        };
      }
      return {
        "data-h2-color": `
          base:children[>span:first-child](gray.darker)
          base:all:focus-visible:children[>span:first-child](black)

          base:children[>span:last-child](gray.darker)

          base:children[.counter](white)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)

          base:iap:all:children[>span:first-child](white)
          base:iap:hover:children[>span:first-child](black)
          base:iap:all:focus-visible:children[>span:first-child](black)

          base:iap:all:children[.counter](white)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)

          base:iap:all:children[>span:first-child](white)
          base:iap:hover:children[>span:first-child](black)
          base:iap:all:focus-visible:children[>span:first-child](black)

          base:iap:all:children[.counter](white)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)

          base:iap:all:children[>span:first-child](white)
          base:iap:hover:children[>span:first-child](black)
          base:iap:all:focus-visible:children[>span:first-child](black)

          base:iap:all:children[.counter](white)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)

          base:iap:all:children[>span:first-child](white)
          base:iap:hover:children[>span:first-child](black)
          base:iap:all:focus-visible:children[>span:first-child](black)

          base:iap:all:children[.counter](white)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)

          base:iap:all:children[>span:first-child](white)
          base:iap:hover:children[>span:first-child](black)
          base:iap:all:focus-visible:children[>span:first-child](black)

          base:iap:all:children[.counter](white)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-color": `
          base:all:children[>span:first-child](black)
          base:dark:hover:children[>span:first-child](black)
          base:dark:focus-visible:children[>span:first-child](white)

          base:children[>span:last-child](black)

          base:all:children[.counter](black)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-color": `
          base(black)

          base:children[>span:first-child](white)
          base:hover:children[>span:first-child](black)
          base:all:focus-visible:children[>span:first-child](black)

          base:children[.counter](white)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-color": `
          base:all(black)

          base:all:children[>span:first-child](white)
          base:all:hover:children[>span:first-child](black)
          base:all:focus-visible:children[>span:first-child](black)

          base:all:children[.counter](white)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-color": `
          base(black)

          base:children[>span:first-child](black)
          base:hover:children[>span:first-child](white)
          base:all:focus-visible:children[>span:first-child](black)

          base:children[.counter](black)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-color": `
          base:all(black)

          base:all:children[>span:first-child](black)
          base:all:hover:children[>span:first-child](white)
          base:all:focus-visible:children[>span:first-child](black)

          base:all:children[.counter](black)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
  }
  if (mode === "icon_only") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-color": `
            base(gray.lighter)
            base:all:focus-visible(black)

            base:children[.counter](black)
            base:focus-visible:children[.counter](focus)`,
        };
      }
      return {
        "data-h2-color": `
          base(gray.darker)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-color": `
          base(primary.darker)
          base:all:hover(primary.darkest)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-color": `
          base(secondary.darker)
          base:all:hover(secondary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(secondary.lightest)
          base:iap:all:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-color": `
          base(tertiary.darker)
          base:dark(tertiary.lightest)
          base:hover(tertiary.darkest)
          base:all:hover(black)
          base:all:focus-visible(black)

          base:iap:dark(tertiary.lightest)
          base:iap:all:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-color": `
          base(quaternary.darker)
          base:hover(quaternary.lightest)
          base:dark:hover(quaternary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(quaternary.lightest)
          base:iap:hover(quaternary.lightest)
          base:iap:dark:hover(white)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-color": `
          base(quinary.darker)
          base:all:hover(quinary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(quinary.lightest)
          base:iap:all:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-color": `
          base(success.darker)
          base:all:hover(success.darkest)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-color": `
          base(warning.darker)
          base:hover(warning.lightest)
          base:dark:hover(warning.darkest)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-color": `
          base(error.darker)
          base:all:hover(error.darkest)
          base:all:focus-visible(black)
          base:dark(error.lightest)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-color": `
          base(gray.darkest)
          base:all:hover(secondary.darker)
          base:all:focus-visible(black)

          base:iap:all:hover(secondary.darker)
          base:iap:all:focus-visible(black)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-color": `
          base:all(gray.darkest)
          base:all:hover(secondary.darker)
          base:all:focus-visible(black)

          base:iap:all:hover(secondary.darker)
          base:iap:all:focus-visible(black)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-color": `
          base(gray.lightest)
          base:hover(secondary.darker)
          base:all:hover(secondary.lighter)
          base:all:focus-visible(black)

          base:iap:hover(black)
          base:iap:all:focus-visible(black)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-color": `
          base:all(gray.lightest)
          base:all:hover(secondary.lighter)
          base:all:focus-visible(black)

          base:iap:all:hover(black)
          base:iap:all:focus-visible(black)`,
      };
    }
  }
  return {
    "data-h2-color": "base(transparent)",
  };
};

export default getFontColor;
