import { ButtonLinkMode, Color } from "../../types";

interface ButtonBackgroundColorInterface {
  mode: ButtonLinkMode;
  color: Color;
  disabled?: boolean;
}

type ButtonBackgroundColor = (
  args: ButtonBackgroundColorInterface,
) => Record<string, string>;

const getBackgroundColor: ButtonBackgroundColor = ({
  mode,
  color,
  disabled,
}) => {
  if (mode === "solid") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-background-color": `
            base(gray.darkest)
            base:focus-visible:all(focus)

            base:children[.counter](gray.lighter)
            base:all:focus-visible:children[.counter](black)`,
        };
      }
      return {
        "data-h2-background-color": `
          base(gray.lightest)
          base:focus-visible:all(focus)

          base:children[.counter](gray.darker)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-background-color": `
          base:all(primary.light)
          base:hover(primary.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)

          base:iap:all(primary)
          base:iap:hover(primary.lightest)
          base:iap:focus-visible:all(focus)

          base:iap:all:children[.counter](white)
          base:iap:hover:children[.counter](black)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-background-color": `
          base:all(secondary)
          base:hover(secondary.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)

          base:iap(secondary)
          base:iap:hover(secondary.lightest)
          base:iap:focus-visible:all(focus)
          base:iap:dark(secondary.light)

          base:iap:all:children[.counter](white)
          base:iap:hover:children[.counter](black)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-background-color": `
          base:all(tertiary)
          base:hover(tertiary.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)

          base:iap(tertiary)
          base:iap:hover(tertiary.lightest)
          base:iap:focus-visible:all(focus)
          base:iap:dark(tertiary.light)

          base:iap:all:children[.counter](white)
          base:iap:hover:children[.counter](black)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-background-color": `
          base:all(quaternary)
          base:hover(quaternary.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)

          base:iap(quaternary)
          base:iap:hover(quaternary.lightest)
          base:iap:focus-visible:all(focus)
          base:iap:dark(quaternary.light)

          base:iap:all:children[.counter](white)
          base:iap:hover:children[.counter](black)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-background-color": `
          base:all(quinary)
          base:hover(quinary.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)

          base:iap(quinary)
          base:iap:hover(quinary.lightest)
          base:iap:focus-visible:all(focus)
          base:iap:dark(quinary.light)

          base:iap:all:children[.counter](white)
          base:iap:hover:children[.counter](black)
          base:iap:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-background-color": `
          base:all(success.light)
          base:hover(success.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-background-color": `
          base:all(warning)
          base:hover(warning.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-background-color": `
          base:all(error.light)
          base:hover(error.lightest)
          base:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:dark:hover:children[.counter](black)
          base:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-background-color": `
          base(gray.darkest)
          base:hover(gray.lighter)
          base:focus-visible:all(focus)

          base:children[.counter](white)
          base:hover:children[.counter](black)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-background-color": `
          base:all(gray.darkest)
          base:all:hover(gray.lighter)
          base:all:focus-visible:all(focus)

          base:all:children[.counter](white)
          base:all:hover:children[.counter](black)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-background-color": `
          base(gray.lightest)
          base:hover(gray.darker)
          base:focus-visible:all(focus)

          base:children[.counter](black)
          base:hover:children[.counter](white)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-background-color": `
          base:all(gray.lightest)
          base:all:hover(gray.darker)
          base:all:focus-visible:all(focus)

          base:all:children[.counter](black)
          base:all:hover:children[.counter](white)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
  }
  if (mode === "inline" || mode === "text" || mode === "placeholder") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-background-color": `
            base(transparent)
            base:focus-visible(focus)

            base:children[.counter](gray.lighter)
            base:all:focus-visible:children[.counter](black)`,
        };
      }
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](gray.darker)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](primary.darker)
          base:hover:children[.counter](primary.darkest)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](secondary.darker)
          base:hover:children[.counter](secondary.darkest)
          base:all:focus-visible:children[.counter](black)

          base:iap:dark:children[.counter](secondary.lightest)
          base:iap:dark:hover:children[.counter](black)
          base:iap:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](tertiary.darker)
          base:dark:children[.counter](tertiary.lightest)
          base:hover:children[.counter](tertiary.darkest)
          base:dark:hover:children[.counter](black)
          base:all:focus-visible:children[.counter](black)

          base:iap:dark:children[.counter](tertiary.lightest)
          base:iap:dark:hover:children[.counter](black)
          base:iap:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](quaternary.darker)
          base:hover:children[.counter](quaternary.darkest)
          base:all:focus-visible:children[.counter](black)

          base:iap:dark:children[.counter](quaternary.lightest)
          base:iap:dark:hover:children[.counter](black)
          base:iap:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](quinary.darker)
          base:hover:children[.counter](quinary.darkest)
          base:all:focus-visible:children[.counter](black)

          base:iap:dark:children[.counter](quinary.lightest)
          base:iap:dark:hover:children[.counter](black)
          base:iap:dark:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](success.darker)
          base:hover:children[.counter](success.darkest)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](warning.darker)
          base:hover:children[.counter](warning.darkest)
          base:all:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](error.darker)
          base:hover:children[.counter](error.darkest)
          base:all:focus-visible:children[.counter](black)
          base:dark:children[.counter](error.lightest)
          base:dark:hover:children[.counter](black)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](gray.darkest)
          base:hover:children[.counter](secondary.darker)
          base:all:focus-visible:children[.counter](black)

          base:iap:hover:children[.counter](secondary.dark)
          base:dark:iap:hover:children[.counter](secondary.lightest)
          base:dark:iap:focus-visible:children[.counter](white)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-background-color": `
          base:all(transparent)
          base:all:focus-visible(focus)

          base:all:children[.counter](gray.darkest)
          base:all:hover:children[.counter](secondary.darker)
          base:all:focus-visible:children[.counter](black)

          base:all:iap:hover:children[.counter](secondary.dark)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)

          base:children[.counter](gray.lightest)
          base:hover:children[.counter](secondary.lighter)
          base:all:focus-visible:children[.counter](black)

          base:iap:hover:children[.counter](secondary.lightest)
          base:all:iap:focus-visible:children[.counter](black)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-background-color": `
          base:all(transparent)
          base:all:focus-visible(focus)

          base:all:children[.counter](gray.lightest)
          base:all:hover:children[.counter](secondary.lighter)
          base:all:focus-visible:children[.counter](black)

          base:all:iap:hover:children[.counter](secondary.lightest)
          base:all:iap:focus-visible:children[.counter](black)`,
      };
    }
  }
  if (mode === "cta") {
    if (disabled) {
      if (color === "white") {
        return {
          "data-h2-background-color": `
            base(transparent)
            base:children[>span:first-child](gray.darkest)
            base:all:focus-visible:children[>span:first-child](focus)

            base:children[>span:last-child](foreground)

            base:children[.counter](gray.darker)
            base:all:focus-visible:children[.counter](focus)`,
        };
      }
      return {
        "data-h2-background-color": `
          base(transparent)
          base:children[>span:first-child](gray.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:children[.counter](gray.darker)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-background-color": `
          base(transparent)

          base:all:children[>span:first-child](primary.light)
          base:hover:children[>span:first-child](primary.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](primary.light)
          base:all:focus-visible:children[.counter](focus)

          base:iap:all:children[>span:first-child](primary)
          base:iap:hover:children[>span:first-child](primary.lightest)
          base:iap:all:focus-visible:children[>span:first-child](focus)

          base:iap:all:children[.counter](primary)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](secondary)
          base:hover:children[>span:first-child](secondary.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](secondary)
          base:all:focus-visible:children[.counter](focus)

          base:iap:all:children[>span:first-child](secondary)
          base:iap:hover:children[>span:first-child](secondary.lightest)
          base:iap:all:focus-visible:children[>span:first-child](focus)
          base:iap:dark:children[>span:first-child](secondary.light)

          base:iap:all:children[.counter](secondary)
          base:iap:dark:children[.counter](secondary.light)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](tertiary)
          base:hover:children[>span:first-child](tertiary.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](tertiary)
          base:all:focus-visible:children[.counter](focus)

          base:iap:all:children[>span:first-child](tertiary)
          base:iap:hover:children[>span:first-child](tertiary.lightest)
          base:iap:all:focus-visible:children[>span:first-child](focus)
          base:iap:dark:children[>span:first-child](tertiary.light)

          base:iap:all:children[.counter](tertiary)
          base:iap:dark:children[.counter](tertiary.light)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](quaternary)
          base:hover:children[>span:first-child](quaternary.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](quaternary)
          base:all:focus-visible:children[.counter](focus)

          base:iap:all:children[>span:first-child](quaternary)
          base:iap:hover:children[>span:first-child](quaternary.lightest)
          base:iap:all:focus-visible:children[>span:first-child](focus)
          base:iap:dark:children[>span:first-child](quaternary.light)

          base:iap:all:children[.counter](quaternary)
          base:iap:dark:children[.counter](quaternary.light)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](quinary)
          base:hover:children[>span:first-child](quinary.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](quinary)
          base:all:focus-visible:children[.counter](focus)

          base:iap:all:children[>span:first-child](quinary)
          base:iap:hover:children[>span:first-child](quinary.lightest)
          base:iap:all:focus-visible:children[>span:first-child](focus)
          base:iap:dark:children[>span:first-child](quinary.light)

          base:iap:all:children[.counter](quinary)
          base:iap:dark:children[.counter](quinary.light)
          base:iap:dark:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](success.light)
          base:hover:children[>span:first-child](success.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](success.light)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](warning)
          base:hover:children[>span:first-child](warning.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](warning)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:all:children[>span:first-child](error.light)
          base:hover:children[>span:first-child](error.lightest)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:all:children[.counter](error.light)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:children[>span:first-child](gray.darkest)
          base:hover:children[>span:first-child](gray.lighter)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:children[.counter](gray.darkest)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-background-color": `
          base:all(transparent)
          base:all:children[>span:first-child](gray.darkest)
          base:all:hover:children[>span:first-child](gray.lighter)
          base:all:focus-visible:children[>span:first-child](focus)

          base:all:children[>span:last-child](foreground)

          base:all:children[.counter](gray.darkest)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:children[>span:first-child](gray.lightest)
          base:hover:children[>span:first-child](gray.darker)
          base:all:focus-visible:children[>span:first-child](focus)

          base:children[>span:last-child](foreground)

          base:children[.counter](gray.lightest)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-background-color": `
          base:all(transparent)
          base:all:children[>span:first-child](gray.lightest)
          base:all:hover:children[>span:first-child](gray.darker)
          base:all:focus-visible:children[>span:first-child](focus)

          base:all:children[>span:last-child](foreground)

          base:all:children[.counter](gray.lightest)
          base:all:focus-visible:children[.counter](focus)`,
      };
    }
  }
  if (mode === "icon_only") {
    if (disabled) {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)`,
      };
    }
    if (color === "primary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(primary.lightest)`,
      };
    }
    if (color === "secondary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(secondary.lightest)`,
      };
    }
    if (color === "tertiary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(tertiary.lightest)`,
      };
    }
    if (color === "quaternary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:hover(quaternary.darkest)
          base:dark:hover(quaternary.lightest)`,
      };
    }
    if (color === "quinary") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(quinary.lightest)`,
      };
    }
    if (color === "success") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(success.lightest)`,
      };
    }
    if (color === "warning") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:hover(warning.darkest)
          base:dark:hover(warning.lightest)`,
      };
    }
    if (color === "error") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(error.lightest)`,
      };
    }
    if (color === "black") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:all:hover(gray.lightest)`,
      };
    }
    if (color === "blackFixed") {
      return {
        "data-h2-background-color": `
          base:all(transparent)
          base:all:focus-visible(focus)
          base:all:hover(gray.darkest)`,
      };
    }
    if (color === "white") {
      return {
        "data-h2-background-color": `
          base(transparent)
          base:focus-visible(focus)
          base:hover(gray.lightest)
          base:dark:hover(gray.darkest)`,
      };
    }
    if (color === "whiteFixed") {
      return {
        "data-h2-background-color": `
          base:all(transparent)
          base:all:focus-visible(focus)
          base:hover(gray.lightest)
          base:dark:hover(gray.darkest)`,
      };
    }
  }
  return {
    "data-h2-background-color": "base(transparent)",
  };
};

export default getBackgroundColor;
