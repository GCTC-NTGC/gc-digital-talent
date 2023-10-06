import { ButtonLinkMode, Color } from "../../types";

interface ButtonBorderInterface {
  mode: ButtonLinkMode;
  color: Color;
  disabled?: boolean;
}

type ButtonBorderColor = (
  args: ButtonBorderInterface,
) => Record<string, string>;

const getBorderColor: ButtonBorderColor = ({ mode, color, disabled }) => {
  if (mode === "solid") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-border-color": `
            base(gray.lighter)
            base:focus-visible:all(focus)`,
        };
      }
      return {
        "data-h2-border-color": `
          base(gray.darker)
          base:focus-visible:all(focus)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-border-color": `
          base:all(primary.light)
          base:focus-visible:all(focus)

          base:iap:all(primary)
          base:iap:focus-visible:all(focus)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-border-color": `
          base:all(secondary)
          base:focus-visible:all(focus)

          base:iap(secondary)
          base:iap:focus-visible:all(focus)
          base:iap:dark(secondary.light)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-border-color": `
          base:all(tertiary)
          base:focus-visible:all(focus)

          base:iap(tertiary)
          base:iap:focus-visible:all(focus)
          base:iap:dark(tertiary.light)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-border-color": `
          base:all(quaternary)
          base:focus-visible:all(focus)

          base:iap(quaternary)
          base:iap:focus-visible:all(focus)
          base:iap:dark(quaternary.light)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-border-color": `
          base:all(quinary)
          base:focus-visible:all(focus)

          base:iap(quinary)
          base:iap:focus-visible:all(focus)
          base:iap:dark(quinary.light)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-border-color": `
          base:all(success.light)
          base:focus-visible:all(focus)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-border-color": `
          base:all(warning)
          base:focus-visible:all(focus)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-border-color": `
          base:all(error.light)
          base:focus-visible:all(focus)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-border-color": `
          base(gray.darkest)
          base:focus-visible:all(focus)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-border-color": `
          base(gray.lightest)
          base:focus-visible:all(focus)`,
      };
    }
  }
  if (mode === "placeholder") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-border-color": `
            base(gray.lighter)
            base:all:focus-visible(black)`,
        };
      }
      return {
        "data-h2-border-color": `
          base(gray.darker)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-border-color": `
          base(primary.darker)
          base:hover(primary.darkest)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-border-color": `
          base(secondary.darker)
          base:hover(secondary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(secondary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-border-color": `
          base(tertiary.darker)
          base:dark(tertiary.lightest)
          base:hover(tertiary.darkest)
          base:dark:hover(black)
          base:all:focus-visible(black)

          base:iap:dark(tertiary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-border-color": `
          base(quaternary.darker)
          base:hover(quaternary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(quaternary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-border-color": `
          base(quinary.darker)
          base:hover(quinary.darkest)
          base:all:focus-visible(black)

          base:iap:dark(quinary.lightest)
          base:iap:dark:hover(black)
          base:iap:dark:focus-visible(white)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-border-color": `
          base(success.darker)
          base:hover(success.darkest)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-border-color": `
          base(warning.darker)
          base:hover(warning.darkest)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-border-color": `
          base(error.darker)
          base:hover(error.darkest)
          base:all:focus-visible(black)
          base:dark(error.lightest)
          base:dark:hover(black)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-border-color": `
          base(gray.darkest)
          base:hover(black)
          base:all:focus-visible(black)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-border-color": `
          base(gray.lightest)
          base:hover(white)
          base:all:focus-visible(black)`,
      };
    }
  }
  if (mode === "inline" || mode === "text") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-border-color": "base(transparent)",
        };
      }
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "primary") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "success") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "warning") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "error") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "black") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
    if (color === "white") {
      return {
        "data-h2-border-color": "base(transparent)",
      };
    }
  }
  if (mode === "cta") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-border-color": `
            base:children[>span:first-child](gray.lighter)
            base:all:focus-visible:children[>span:first-child](focus)

            base:children[>span:last-child](foreground)`,
        };
      }
      return {
        "data-h2-border-color": `
          base:children[>span:first-child](gray.darker)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](primary.light)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:iap:all:children[>span:first-child](primary)
          base:iap:dark:focus-visible:children[>span:first-child](focus)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](secondary)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:iap:all:children[>span:first-child](secondary)
          base:iap:dark:children[>span:first-child](secondary.light)
          base:iap:dark:focus-visible:children[>span:first-child](focus)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](tertiary)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:iap:all:children[>span:first-child](tertiary)
          base:iap:dark:children[>span:first-child](tertiary.light)
          base:iap:dark:focus-visible:children[>span:first-child](focus)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](quaternary)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:iap:all:children[>span:first-child](quaternary)
          base:iap:dark:children[>span:first-child](quaternary.light)
          base:iap:dark:focus-visible:children[>span:first-child](focus)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](quinary)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:iap:all:children[>span:first-child](quinary)
          base:iap:dark:children[>span:first-child](quinary.light)
          base:iap:dark:focus-visible:children[>span:first-child](focus)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](success.light)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](warning)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-border-color": `
          base:all:children[>span:first-child](error.light)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-border-color": `
          base:children[>span:first-child](gray.darkest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-border-color": `
          base:children[>span:first-child](gray.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)`,
      };
    }
  }
  return {
    "data-h2-border-color": "base(transparent)",
  };
};

export default getBorderColor;
