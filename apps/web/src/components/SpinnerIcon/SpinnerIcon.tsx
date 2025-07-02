import { ComponentPropsWithoutRef } from "react";
import { m, useReducedMotion } from "motion/react";
import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";
import { tv } from "tailwind-variants";

const icon = tv({
  base: "mr-0 inline-flex",
});

const Icon = m.create(ArrowPathIcon);

const SpinnerIcon = ({
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof Icon>) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Icon
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
      {...rest}
    />
  );
};

export default SpinnerIcon;
