import { HTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";

import { IconType, Color } from "../../types";
import { headingStyles, iconStyles } from "./styles";
import { cn } from "../../utils";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingRef = HTMLHeadingElement;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingLevel;
  color?: Color;
  Icon?: IconType;
}

const heading = cva([], {
  variants: {
    size: {
      h1: ["font-bold"],
      h2: ["font-bold", "mt-12", "mb-3"],
      h3: ["mt-10 mb-1.5"],
      h4: ["mt-10", "mb-1.5"],
      h5: ["mt-6", "mb-1.5"],
      h6: ["mt-6", "mb-1.5"],
    },
  },
});

const icon = cva(
  ["align-middle", "h-auto", "shrink-0", "stroke-[1.6]", "sm:inline-block"],
  {
    variants: {
      size: {
        h1: ["w-12", "h-12", "stroke-[1.5]"],
        h2: ["w-11", "h-11"],
        h3: ["w-9", "h-9"],
        h4: ["w-8", "h-8"],
        h5: ["w-6", "h-6"],
        h6: ["w-5", "h-5"],
      },
    },
  },
);

const Heading = forwardRef<HeadingRef, HeadingProps>(
  (
    { level = "h2", size, Icon, color, children, className, ...rest },
    forwardedRef,
  ) => {
    const El = level;

    return (
      <El
        ref={forwardedRef}
        {...headingStyles[size || level]}
        className={cn(
          heading({ size }),
          {
            "flex items-center gap-x-3": !!Icon,
          },
          className,
        )}
        {...rest}
      >
        {Icon && (
          <Icon
            className={icon({ size: size || level })}
            {...(color ? iconStyles[color] : {})}
          />
        )}
        {children}
      </El>
    );
  },
);

export default Heading;
