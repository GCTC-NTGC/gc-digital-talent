import React from "react";

import { Color } from "@gc-digital-talent/ui";

type DescriptionColor = Extract<Color, "error" | "warning" | "success">;

export type DescriptionProps = React.DetailedHTMLProps<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  color?: DescriptionColor;
};

const colorMap = new Map<DescriptionColor, Record<string, string>>([
  [
    "error",
    {
      "data-h2-background-color": "base(error.lightest)",
      "data-h2-border-color": "base(error.darker)",
      "data-h2-color": "base(error.darker)",
    },
  ],
  [
    "warning",
    {
      "data-h2-background-color": "base(warning.lightest)",
      "data-h2-border-color": "base(warning.darker)",
      "data-h2-color": "base(warning.darker)",
    },
  ],
  [
    "success",
    {
      "data-h2-background-color": "base(success.lightest)",
      "data-h2-border-color": "base(success.darker)",
      "data-h2-color": "base(success.darker)",
    },
  ],
]);

const getColor = (color?: DescriptionColor) => {
  const defaultColor = {
    "data-h2-background-color": "base(background.dark)",
    "data-h2-border-color": "base(background.darkest)",
    "data-h2-color": "base(background.darkest)",
  };

  return color ? colorMap.get(color) : defaultColor;
};

const Description = ({ color, ...rest }: DescriptionProps) => {
  const colorStyle = getColor(color);

  return (
    <div
      data-h2-border-style="base(solid)"
      data-h2-border-width="base(1px)"
      data-h2-font-size="base(caption)"
      data-h2-padding="base(x.5)"
      data-h2-radius="base(rounded)"
      {...colorStyle}
      {...rest}
    />
  );
};

export default Description;
