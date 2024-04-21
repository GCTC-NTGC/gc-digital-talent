import React from "react";
import { m, useReducedMotion } from "framer-motion";
import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";

import { IconProps } from "@gc-digital-talent/ui";

const SpinnerIcon = (props: IconProps) => {
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
      <ArrowPathIcon {...props} className="mr-0" />
    </m.span>
  );
};

export default SpinnerIcon;
