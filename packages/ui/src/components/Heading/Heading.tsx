import React from "react";

import { headingStyles, iconStyles } from "./styles";
import { IconType, Color } from "../../types";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingRef = HTMLHeadingElement;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingLevel;
  color?: Color;
  Icon?: IconType;
}

const Heading = React.forwardRef<HeadingRef, HeadingProps>(
  ({ level = "h2", size, Icon, color, children, ...rest }, forwardedRef) => {
    const El = level;

    return (
      <El
        ref={forwardedRef}
        {...headingStyles[size || level]}
        {...(Icon && {
          "data-h2-display": "base(flex)",
          "data-h2-align-items": "base(center)",
          "data-h2-gap": "base(0 x.25)",
        })}
        {...rest}
      >
        {Icon && (
          <Icon
            data-h2-display="p-tablet(inline-block)"
            data-h2-vertical-align="base(middle)"
            data-h2-height="base(auto)"
            data-h2-width="base(1em)"
            {...(color ? iconStyles[color] : {})}
          />
        )}
        {children}
      </El>
    );
  },
);

export default Heading;
