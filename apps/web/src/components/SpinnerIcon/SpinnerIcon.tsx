import { m, useReducedMotion } from "motion/react";
import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";
import { tv } from "tailwind-variants";

import { IconProps } from "@gc-digital-talent/ui";

const icon = tv({
  base: "mr-0",
});

const SpinnerIcon = ({ className, ...rest }: IconProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.span
      className="mr-1.5 inline-flex"
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
    >
      <ArrowPathIcon className={icon({ class: className })} {...rest} />
    </m.span>
  );
};

export default SpinnerIcon;
