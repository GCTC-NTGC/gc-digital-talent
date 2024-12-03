import { HTMLAttributes, forwardRef } from "react";

import { IconType, Color } from "../../types";
import { headingStyles, iconStyles } from "./styles";
import { HeadingLevel, HeadingRef } from "./types";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingLevel;
  color?: Color;
  Icon?: IconType;
}

const Heading = forwardRef<HeadingRef, HeadingProps>(
  ({ level = "h2", size, Icon, color, children, ...rest }, forwardedRef) => {
    const El = level;

    return (
      <El
        ref={forwardedRef}
        {...headingStyles[size ?? level]}
        {...(Icon && {
          "data-h2-display": "base(flex)",
          "data-h2-align-items": "base(center)",
          "data-h2-gap": "base(0 x.5)",
        })}
        {...rest}
      >
        {Icon && (
          <Icon
            data-h2-display="p-tablet(inline-block)"
            data-h2-vertical-align="base(middle)"
            data-h2-height="base(auto)"
            data-h2-flex-shrink="base(0)"
            {...(color ? iconStyles[color] : {})}
          />
        )}
        {children}
      </El>
    );
  },
);

export default Heading;
