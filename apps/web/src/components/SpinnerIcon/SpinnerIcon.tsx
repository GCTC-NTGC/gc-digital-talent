import { forwardRef } from "react";
import { m, useReducedMotion } from "motion/react";
import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";
import { tv } from "tailwind-variants";

import { type IconProps } from "@gc-digital-talent/ui";

const icon = tv({
  base: "mr-0 inline-flex",
});

const Icon = m.create(ArrowPathIcon);

const SpinnerIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ className }, forwardedRef) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <Icon
        ref={forwardedRef}
        {...(!shouldReduceMotion && {
          animate: {
            rotate: [0, 360],
          },
          transition: {
            ease: "linear",
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
          },
        })}
        className={icon({ class: className })}
      />
    );
  },
);

export default SpinnerIcon;
