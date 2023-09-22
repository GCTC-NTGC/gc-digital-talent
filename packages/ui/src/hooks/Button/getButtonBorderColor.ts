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
            base:children[>div:first-child](gray.lighter)
            base:all:focus-visible:children[>div:first-child](focus)

            base:children[>div:last-child](foreground)`,
        };
      }
      return {
        "data-h2-border-color": `
          base:children[>div:first-child](gray.darker)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](primary.light)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)

          base:iap:all:children[>div:first-child](primary)
          base:iap:dark:focus-visible:children[>div:first-child](focus)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](secondary)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)

          base:iap:all:children[>div:first-child](secondary)
          base:iap:dark:children[>div:first-child](secondary.light)
          base:iap:dark:focus-visible:children[>div:first-child](focus)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](tertiary)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)

          base:iap:all:children[>div:first-child](tertiary)
          base:iap:dark:children[>div:first-child](tertiary.light)
          base:iap:dark:focus-visible:children[>div:first-child](focus)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](quaternary)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)

          base:iap:all:children[>div:first-child](quaternary)
          base:iap:dark:children[>div:first-child](quaternary.light)
          base:iap:dark:focus-visible:children[>div:first-child](focus)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](quinary)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)

          base:iap:all:children[>div:first-child](quinary)
          base:iap:dark:children[>div:first-child](quinary.light)
          base:iap:dark:focus-visible:children[>div:first-child](focus)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](success.light)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](warning)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-border-color": `
          base:all:children[>div:first-child](error.light)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-border-color": `
          base:children[>div:first-child](gray.darkest)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-border-color": `
          base:children[>div:first-child](gray.lightest)
          base:all:focus-visible:children[>div:first-child](focus)

          base:children[>div:last-child](foreground)`,
      };
    }
  }
  return {
    "data-h2-border-color": "base(transparent)",
  };
};

export default getBorderColor;
