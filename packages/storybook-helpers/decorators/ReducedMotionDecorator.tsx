import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import isChromatic from "chromatic/isChromatic";
import type { Decorator } from "@storybook/react-vite";

const ReducedMotionDecorator: Decorator = (Story) => (
  <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion={isChromatic() ? "always" : "user"}>
      <Story />
    </MotionConfig>
  </LazyMotion>
);

export default ReducedMotionDecorator;
