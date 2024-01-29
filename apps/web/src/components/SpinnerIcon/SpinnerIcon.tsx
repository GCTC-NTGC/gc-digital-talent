import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";

import { IconProps } from "@gc-digital-talent/ui";

const SpinnerIcon = (props: IconProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      data-h2-display="base(inline-flex)"
      data-h2-margin-right="base(x.25)"
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
      <ArrowPathIcon {...props} data-h2-margin-right="base(0)" />
    </motion.span>
  );
};

export default SpinnerIcon;
