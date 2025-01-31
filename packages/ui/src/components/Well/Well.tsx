import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { Color } from "../../types";

const colorMap = new Map<Color, Record<string, string>>([
  [
    "primary",
    {
      "data-h2-background-color": "base(primary.lightest)",
      "data-h2-border": "base(1px solid primary.darker)",
      "data-h2-color": "base(primary.darkest)",
    },
  ],
  [
    "success",
    {
      "data-h2-background-color": "base(success.lightest)",
      "data-h2-border": "base(1px solid success.darker)",
      "data-h2-color": "base(success.darkest)",
    },
  ],
  [
    "warning",
    {
      "data-h2-background-color": "base(warning.lightest)",
      "data-h2-border": "base(1px solid warning.darker)",
      "data-h2-color": "base(warning.darkest)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": "base(error.lightest)",
      "data-h2-border": "base(1px solid error.darker)",
      "data-h2-color": "base(error.darkest)",
    },
  ],
  [
    "black",
    {
      "data-h2-background-color": "base(black.lightest)",
      "data-h2-border": "base(1px solid black.darker)",
      "data-h2-color": "base(black.darkest)",
    },
  ],
  [
    "secondary",
    {
      "data-h2-background-color": "base(secondary.lightest)",
      "data-h2-border": "base(1px solid secondary.darker)",
      "data-h2-color": "base(secondary.darkest)",
    },
  ],
]);

export interface WellProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
  color?: Color;
  fontSize?: "caption" | "body";
}

const Well = ({ children, color, fontSize = "body", ...rest }: WellProps) => {
  const colorStyles = color
    ? colorMap.get(color)
    : {
        "data-h2-background-color": "base(background.light)",
        "data-h2-border": "base(1px solid background.darker)",
        "data-h2-color": "base(background.darkest)",
      };

  let size = {
    "data-h2-font-size": "base(body)",
    "data-h2-padding": "base(x1)",
  };
  if (fontSize === "caption") {
    size = {
      "data-h2-font-size": "base(caption)",
      "data-h2-padding": "base(x.5)",
    };
  }
  return (
    <div data-h2-radius="base(s)" {...colorStyles} {...size} {...rest}>
      {children}
    </div>
  );
};

export default Well;
