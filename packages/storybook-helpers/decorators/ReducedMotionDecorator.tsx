import type { Decorator } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

const ReducedMotionDecorator: Decorator = (Story) => (
  <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion={isChromatic() ? "always" : "user"}>
      <Story />
    </MotionConfig>
  </LazyMotion>
);

export default ReducedMotionDecorator;
