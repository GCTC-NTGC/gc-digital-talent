import React from "react";

type Color = "default" | "success" | "warning" | "error";

const colorMap = new Map<Color, Record<string, string>>([
  [
    "default",
    {
      "data-h2-background-color": "base(background.dark.3)",
      "data-h2-border": "base(1px solid background.darker)",
    },
  ],
  [
    "success",
    {
      "data-h2-background-color": "base(success.lightest)",
      "data-h2-border": "base(1px solid success.darker)",
    },
  ],
  [
    "warning",
    {
      "data-h2-background-color": "base(warning.dark.3)",
      "data-h2-border": "base(1px solid warning.darker)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": "base(error.dark.3)",
      "data-h2-border": "base(1px solid error.darker)",
    },
  ],
]);

export interface WellProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  color?: Color;
}

const Well = ({ children, color = "default", ...rest }: WellProps) => {
  const colorStyles = colorMap.get(color);
  return (
    <div
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
      {...colorStyles}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Well;
