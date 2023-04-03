import React from "react";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"
  | "success"
  | "warning"
  | "error"
  | "cta"
  | "white"
  | "black"
  | "ia-primary"
  | "ia-secondary"
  | "yellow"
  | "red"
  | "blue"
  | "purple";

export type ButtonMode = "solid" | "outline" | "inline" | "tableHeader";

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  /** The style type of the element. */
  color?: Color;
  /** The style mode of the element. */
  mode?: ButtonMode;
  /** Determines whether the element should be block level and 100% width. */
  block?: boolean;
  type?: "button" | "submit" | "reset";
  classNames?: string;
}

export const h2ButtonColors = {
  primary: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin(white) base:admin:hover(black) base:admin:focus-visible(black) base:admin:dark(white) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(primary.light) base:hover(primary.lightest) base:focus-visible(focus) base:dark(primary.light) base:dark:focus-visible(focus) base:admin(primary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(primary.light) base:focus-visible(focus) base:dark(primary.light) base:dark:focus-visible(focus) base:admin(primary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(primary.lightest) base:hover(primary.lighter) base:focus-visible(focus) base:dark(primary.darker) base:dark:hover(primary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark:hover(primary.light) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(primary.light) base:focus-visible(focus) base:dark(primary.light) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(primary.lighter) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(primary.dark) base:hover(primary) base:focus-visible(black) base:dark(primary.lighter) base:dark:hover(primary.light) base:dark:focus-visible(black) base:admin(primary) base:admin:hover(primary.light) base:admin:focus-visible(black) base:admin:dark(primary.lighter) base:admin:dark:hover(primary.light) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  secondary: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin(white) base:admin:hover(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(secondary) base:hover(secondary.lightest) base:focus-visible(focus) base:dark(secondary) base:dark:focus-visible(focus) base:admin(secondary) base:admin:focus-visible(focus) base:admin:dark(secondary.lighter) base:admin:dark:hover(secondary.darkest) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(secondary.light) base:iap:dark:hover(secondary.darkest) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(secondary) base:focus-visible(focus) base:dark(secondary) base:dark:focus-visible(focus) base:admin(secondary) base:admin:focus-visible(focus) base:admin:dark(secondary.lighter) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(secondary.light) base:iap:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(secondary.lightest) base:hover(secondary.lighter) base:focus-visible(focus) base:dark(secondary.darker) base:dark:hover(secondary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(secondary) base:admin:dark:hover(secondary.lighter) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(secondary) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(secondary.light) base:focus-visible(focus) base:dark(secondary.light) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(secondary.lightest) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(secondary.darker) base:hover(secondary) base:focus-visible(black) base:dark(secondary.lighter) base:dark:hover(secondary.light) base:dark:focus-visible(black) base:admin(secondary.light) base:admin:hover(secondary.lighter) base:admin:focus-visible(black) base:admin:dark(secondary.lightest) base:admin:dark:hover(secondary.lighter) base:admin:dark:focus-visible(black) base:iap:hover(secondary.light) base:iap:focus-visible(black) base:iap:dark:hover(secondary.light) base:iap:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {
      "data-h2-border": "base(none)",
      "data-h2-background-color": "base(transparent)",
      "data-h2-padding": "base(0)",
      "data-h2-color": "base(white)",
      "data-h2-font-weight": "base(700)",
      "data-h2-text-align": "base(left)",
    },
  },
  tertiary: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(tertiary) base:hover(tertiary.lightest) base:focus-visible(focus) base:dark(tertiary) base:dark:focus-visible(focus) base:admin(tertiary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(tertiary.light) base:iap:dark:hover(tertiary.darkest) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(tertiary) base:focus-visible(focus) base:dark(tertiary) base:dark:focus-visible(focus) base:admin(tertiary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(tertiary.light) base:iap:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(tertiary.lightest) base:hover(tertiary.lighter) base:focus-visible(focus) base:dark(tertiary.darker) base:dark:hover(tertiary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(tertiary.darkest) base:admin:dark:hover(tertiary.darker) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(tertiary) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(tertiary.light) base:focus-visible(focus) base:dark(tertiary.light) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(tertiary) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(tertiary.dark) base:hover(tertiary) base:focus-visible(black) base:dark(tertiary.lighter) base:dark:hover(tertiary.light) base:dark:focus-visible(black) base:admin(tertiary.dark) base:admin:hover(tertiary) base:admin:focus-visible(black) base:admin:dark(tertiary.light) base:admin:dark:hover(tertiary) base:admin:dark:focus-visible(black) base:iap:hover(tertiary.light) base:iap:focus-visible(black) base:iap:dark:hover(tertiary.light) base:iap:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  quaternary: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(quaternary) base:hover(quaternary.lightest) base:focus-visible(focus) base:dark(quaternary) base:dark:focus-visible(focus) base:admin(quaternary) base:admin(quaternary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quaternary.light) base:iap:dark:hover(quaternary.darkest) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(quaternary) base:focus-visible(focus) base:dark(quaternary) base:dark:focus-visible(focus) base:admin(quaternary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quaternary.light) base:iap:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(quaternary.lightest) base:hover(quaternary.lighter) base:focus-visible(focus) base:dark(quaternary.darker) base:dark:hover(quaternary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(quaternary.darkest) base:admin:dark:hover(quaternary.darker) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(quaternary) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(quaternary.light) base:focus-visible(focus) base:dark(quaternary.light) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(quaternary) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(quaternary.darker) base:hover(quaternary) base:focus-visible(black) base:dark(quaternary.lighter) base:dark:hover(quaternary.light) base:dark:focus-visible(black) base:admin(quaternary.dark) base:admin:hover(quaternary) base:admin:focus-visible(black) base:admin:dark(quaternary.light) base:admin:dark:hover(quaternary) base:admin:dark:focus-visible(black) base:iap:hover(quaternary.light) base:iap:focus-visible(black) base:iap:dark:hover(quaternary.light) base:iap:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  quinary: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap(white) base:iap:hover(black) base:iap:focus-visible(black) base:iap:dark(white) base:iap:dark:hover(white) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(quinary) base:hover(quinary.lightest) base:focus-visible(focus) base:dark(quinary) base:dark:focus-visible(focus) base:admin(quinary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quinary.light) base:iap:dark:hover(quinary.darkest) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(quinary) base:focus-visible(focus) base:dark(quinary) base:dark:focus-visible(focus) base:admin(quinary) base:admin:focus-visible(focus) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark(quinary.light) base:iap:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black) base:admin:focus-visible(black) base:admin:dark:focus-visible(black) base:iap:focus-visible(black) base:iap:dark:focus-visible(black)",
      "data-h2-background":
        "base(quinary.lightest) base:hover(quinary.lighter) base:focus-visible(focus) base:dark(quinary.darker) base:dark:hover(quinary.dark) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(quinary.darkest) base:admin:dark:hover(quinary.darker) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:hover(quinary) base:iap:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(quinary.light) base:focus-visible(focus) base:dark(quinary.light) base:dark:focus-visible(focus) base:admin:focus-visible(focus) base:admin:dark(quinary) base:admin:dark:focus-visible(focus) base:iap:focus-visible(focus) base:iap:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(quinary.dark) base:hover(quinary) base:focus-visible(black) base:dark(quinary.lighter) base:dark:hover(quinary.light) base:dark:focus-visible(black) base:admin(quinary.dark) base:admin:hover(quinary) base:admin:focus-visible(black) base:admin:dark(quinary.light) base:admin:dark:hover(quinary) base:admin:dark:focus-visible(black) base:iap:hover(quinary.light) base:iap:focus-visible(black) base:iap:dark:hover(quinary.light) base:iap:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  success: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(success.light) base:hover(success.lightest) base:focus-visible(focus) base:dark(success.light) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(success.light) base:focus-visible(focus) base:dark(success.light) base:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(success.lightest) base:hover(success.lighter) base:focus-visible(focus) base:dark(success.darker) base:dark:hover(success.dark) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(success.light) base:focus-visible(focus) base:dark(success.light) base:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(success.dark) base:hover(success.light) base:focus-visible(black) base:dark(success.lighter) base:dark:hover(success.light) base:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  warning: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(warning) base:hover(warning.lightest) base:focus-visible(focus) base:dark(warning) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(warning) base:focus-visible(focus) base:dark(warning) base:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(warning.lightest) base:hover(warning.lighter) base:focus-visible(focus) base:dark(warning.darker) base:dark:hover(warning.dark) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(warning.light) base:focus-visible(focus) base:dark(warning.light) base:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(warning.dark) base:hover(warning) base:focus-visible(black) base:dark(warning.lighter) base:dark:hover(warning.light) base:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  error: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(black) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(error.light) base:hover(error.lightest) base:focus-visible(focus) base:dark(error.light) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(error.light) base:focus-visible(focus) base:dark(error.light) base:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(error.lightest) base:hover(error.lighter) base:focus-visible(focus) base:dark(error.darker) base:dark:hover(error.dark) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(error.light) base:focus-visible(focus) base:dark(error.light) base:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(error.dark) base:hover(error) base:focus-visible(black) base:dark(error.lighter) base:dark:hover(error.light) base:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  black: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(white) base:hover(black) base:focus-visible(black) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(black) base:hover(black.lightest) base:focus-visible(focus) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(black) base:focus-visible(focus) base:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:focus-visible(black) base:dark(white) base:dark:hover(white) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(black.lightest) base:hover(black.lighter) base:focus-visible(focus) base:dark(white.darkest) base:dark:hover(white.darker) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(black) base:focus-visible(focus) base:dark(white) base:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:hover(black.light) base:focus-visible(black) base:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
  white: {
    solid: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(black) base:hover(white) base:focus-visible(black) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(white) base:hover(black.light) base:focus-visible(focus) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(white) base:focus-visible(focus) base:dark:focus-visible(focus)",
    },
    outline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(white) base:focus-visible(black) base:dark(black) base:dark:focus-visible(black)",
      "data-h2-background":
        "base(white.darkest) base:hover(white.darker) base:focus-visible(focus) base:dark(black.lightest) base:dark:hover(black.lighter) base:dark:focus-visible(focus)",
      "data-h2-border-color":
        "base(white) base:focus-visible(focus) base:dark(black) base:dark:focus-visible(focus)",
    },
    inline: {
      "data-h2-font-weight": "base(700)",
      "data-h2-transition": "base(.1s ease-in-out)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
      "data-h2-color":
        "base(white) base:hover(white.dark) base:focus-visible(black) base:dark:focus-visible(black)",
      "data-h2-background-color": "base(transparent) base:focus-visible(focus)",
      "data-h2-border-color": "base(transparent)",
    },
    tableHeader: {},
  },
};

export const colorMap: Record<
  Color,
  Record<ButtonMode, Record<string, string>>
> = {
  primary: h2ButtonColors.primary,
  secondary: h2ButtonColors.secondary,
  tertiary: h2ButtonColors.tertiary,
  quaternary: h2ButtonColors.quaternary,
  quinary: h2ButtonColors.quinary,
  success: h2ButtonColors.success,
  warning: h2ButtonColors.warning,
  error: h2ButtonColors.error,
  black: h2ButtonColors.black,
  white: h2ButtonColors.white,
  "ia-primary": h2ButtonColors.primary,
  "ia-secondary": h2ButtonColors.secondary,
  purple: h2ButtonColors.primary,
  blue: h2ButtonColors.secondary,
  red: h2ButtonColors.tertiary,
  yellow: h2ButtonColors.quaternary,
  cta: h2ButtonColors.tertiary,
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      color = "primary",
      mode = "solid",
      disabled,
      block = false,
      classNames,
      ...rest
    },
    ref,
  ) => {
    let underline = {};
    if (mode === "inline") {
      underline = { "data-h2-text-decoration": "base(underline)" };
    }
    let padding = { "data-h2-padding": "base(x.5, x1)" };
    if (mode === "inline") {
      padding = { "data-h2-padding": "base(0)" };
    } else if (mode === "tableHeader") {
      padding = { "data-h2-padding": "base(x.5, 0)" };
    }
    return (
      <button
        ref={ref}
        className={classNames ? `button ${classNames}` : "button"}
        // eslint-disable-next-line react/button-has-type
        type={type || "button"}
        disabled={disabled}
        data-h2-radius="base(s)"
        data-h2-font-size="base(copy)"
        data-h2-font-weight="base(700)"
        data-h2-transition="base:hover(background .2s ease 0s)"
        data-h2-cursor="base(pointer)"
        {...(block
          ? { "data-h2-display": "base(block)" }
          : { "data-h2-display": "base(inline-block)" })}
        {...colorMap[color][mode]}
        {...padding}
        {...underline}
        style={{
          outlineOffset: 4,
          opacity: disabled ? "0.7" : undefined,
          width: block ? "100%" : "auto",
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default Button;
