import { HTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { IconType } from "../../types";
import { HeadingRef } from "./types";

const heading = tv({
  slots: {
    base: "",
    icon: "inline-block h-auto shrink-0 align-middle",
  },
  variants: {
    icon: {
      true: "flex items-center gap-x-2.5",
    },
    size: {
      h1: {
        base: "text-5xl font-bold lg:text-6xl",
        icon: "size-12 stroke-[1.5]",
      },
      h2: {
        base: "mt-12 mb-3 text-4xl font-bold lg:text-5xl",
        icon: "size-10 stroke-[1.6]",
      },
      h3: {
        base: "mt-9 mb-1.5 text-3xl lg:text-4xl",
        icon: "size-8 stroke-[1.6]",
      },
      h4: {
        base: "mt-9 mb-1.5 text-2xl lg:text-3xl",
        icon: "size-7 stroke-[1.6]",
      },
      h5: {
        base: "mt-6 mb-1.5 text-xl lg:text-2xl",
        icon: "size-6 stroke-[1.6]",
      },
      h6: {
        base: "mt-6 mb-1.5 font-bold lg:text-xl",
        icon: "size-5 stroke-[1.6]",
      },
    },
    color: {
      primary: {
        icon: "text-primary",
      },
      secondary: {
        icon: "text-secondary iap:dark:text-secondary-300",
      },
      success: {
        icon: "text-success",
      },
      warning: {
        icon: "text-warning",
      },
      error: {
        icon: "text-error",
      },
    },
  },
});

type HeadingVariants = VariantProps<typeof heading>;

export interface HeadingProps
  extends HeadingVariants,
    Omit<HTMLAttributes<HTMLHeadingElement>, "color"> {
  level?: HeadingVariants["size"];
  icon?: IconType;
}

const Heading = forwardRef<HeadingRef, HeadingProps>(
  (
    { level = "h2", size, icon, color, children, className, ...rest },
    forwardedRef,
  ) => {
    const El = level;
    const Icon = icon;
    const { base, icon: iconStyles } = heading({
      size: size ?? level,
      icon: !!icon,
      color,
    });

    return (
      <El ref={forwardedRef} className={base({ class: className })} {...rest}>
        {Icon && <Icon className={iconStyles()} />}
        {children}
      </El>
    );
  },
);

export default Heading;
