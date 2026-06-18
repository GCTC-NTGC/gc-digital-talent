import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import type { IconType } from "../../types";
import type { HeadingRef, SubHeadingLevel } from "./types";
import headingBase from "./variants";

const subHeading = tv({
  extend: headingBase,
  variants: {
    hasIcon: {
      true: { base: "flex items-center gap-x-2.5" },
    },
    size: {
      lg: { base: "text-3xl", icon: "size-8 stroke-[1.6]" },
      md: { base: "text-2xl", icon: "size-7 stroke-[1.6]" },
      sm: { base: "text-xl",  icon: "size-6 stroke-[1.6]" },
      xs: { base: "text-lg",  icon: "size-5 stroke-[1.6]" },
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

type SubHeadingVariants = VariantProps<typeof subHeading>;

export interface SubHeadingProps
  extends Omit<SubHeadingVariants, "hasIcon">,
    Omit<HTMLAttributes<HTMLHeadingElement>, "color"> {
  level?: SubHeadingLevel;
  icon?: IconType;
}

const SubHeading = forwardRef<HeadingRef, SubHeadingProps>(
  ({ size, level = "h3", icon, color, center, children, className, ...rest }, ref) => {
    const El = level;
    const Icon = icon;

    const { base, icon: iconStyles } = subHeading({
      size,
      hasIcon: !!icon,
      color,
      center,
    });

    return (
      <El ref={ref} className={base({ class: className })} {...rest}>
        {Icon && <Icon className={iconStyles()} />}
        {children}
      </El>
    );
  },
);

export default SubHeading;
