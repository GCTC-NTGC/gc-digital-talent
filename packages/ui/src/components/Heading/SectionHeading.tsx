import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import type { IconType } from "../../types";
import type { HeadingRef } from "./types";
import headingBase from "./variants";

const sectionHeading = tv({
  extend: headingBase,
  slots: {
    base: "flex items-center gap-x-2.5 text-4xl mt-12 mb-3",
    icon: "size-9 stroke-[1.6]",
  },
});

type SectionHeadingVariants = VariantProps<typeof sectionHeading>;

export interface SectionHeadingProps
  extends SectionHeadingVariants,
    Omit<HTMLAttributes<HTMLHeadingElement>, "color"> {
  icon: IconType;
}

const SectionHeading = forwardRef<HeadingRef, SectionHeadingProps>(
  ({ icon, color, center, children, className, ...rest }, ref) => {
    const Icon = icon;
    const { base, icon: iconStyles } = sectionHeading({ color, center });

    return (
      <h2 ref={ref} className={base({ class: className })} {...rest}>
        <Icon className={iconStyles()} />
        {children}
      </h2>
    );
  },
);

export default SectionHeading;
