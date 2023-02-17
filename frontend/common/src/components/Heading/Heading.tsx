import React from "react";

import { headingStyles, iconStyles } from "./styles";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type Color = "yellow" | "blue" | "red" | "purple";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingLevel;
  color?: Color;
  Icon?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
}

const Heading: React.FC<HeadingProps> = ({
  level = "h2",
  size,
  Icon,
  color,
  children,
  ...rest
}) => {
  const El = level;

  return (
    <El {...headingStyles[size || level]} {...rest}>
      {Icon && (
        <span
          data-h2-display="p-tablet(inline-block)"
          data-h2-vertical-align="base(middle)"
          data-h2-margin="base(0, 0, x.25, 0) p-tablet(0, x0.5, 0, 0)"
          data-h2-width="base:children[svg](var(--h2-font-size-h2))"
          {...(color ? iconStyles[color] : {})}
        >
          <Icon />
        </span>
      )}
      {children}
    </El>
  );
};

export default Heading;
