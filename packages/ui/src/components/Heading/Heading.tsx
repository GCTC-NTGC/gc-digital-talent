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
    hasIcon: {
      true: "flex items-center gap-x-2.5",
    },
    size: {
      h1: {
        base: "text-5xl/[1.1] font-bold lg:text-6xl/[1.1]",
        icon: "size-12 stroke-[1.5]",
      },
      h2: {
        base: "mt-12 mb-3 text-4xl/[1.1] font-bold lg:text-5xl/[1.1]",
        icon: "size-10 stroke-[1.6]",
      },
      h3: {
        base: "mt-9 mb-1.5 text-3xl/[1.1] lg:text-4xl/[1.1]",
        icon: "size-8 stroke-[1.6]",
      },
      h4: {
        base: "mt-9 mb-1.5 text-2xl/[1.1] lg:text-3xl/[1.1]",
        icon: "size-7 stroke-[1.6]",
      },
      h5: {
        base: "mt-6 mb-1.5 text-xl/[1.1] lg:text-2xl/[1.1]",
        icon: "size-6 stroke-[1.6]",
      },
      h6: {
        base: "mt-6 mb-1.5 text-lg/[1.1] font-bold lg:text-xl/[1.1]",
        icon: "size-5 stroke-[1.6]",
      },
    },
    color: {
      primary: {
        icon: "text-primary iap:dark:text-primary-200",
      },
      secondary: {
        icon: "text-secondary iap:dark:text-secondary-100",
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
      black: {
        icon: "text-black",
      },
    },
    // Center align text
    center: {
      true: {
        base: "justify-center text-center",
      },
    },
  },
});

type HeadingVariants = VariantProps<typeof heading>;

export interface HeadingProps
  extends Omit<HeadingVariants, "hasIcon">,
    Omit<HTMLAttributes<HTMLHeadingElement>, "color" | "icon"> {
  level?: HeadingVariants["size"];
  icon?: IconType;
}

const Heading = forwardRef<HeadingRef, HeadingProps>(
  (
    { level = "h2", size, icon, color, center, children, className, ...rest },
    forwardedRef,
  ) => {
    const El = level;
    const Icon = icon;
    const { base, icon: iconStyles } = heading({
      size: size ?? level,
      hasIcon: !!icon,
      color,
      center,
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
