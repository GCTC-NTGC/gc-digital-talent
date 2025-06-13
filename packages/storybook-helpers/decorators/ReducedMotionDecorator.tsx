import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import isChromatic from "chromatic/isChromatic";
import { StoryFn } from "@storybook/react-vite";

const ReducedMotionDecorator = (Story: StoryFn) => (
  <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion={isChromatic() ? "always" : "user"}>
      <Story />
    </MotionConfig>
  </LazyMotion>
);

export default ReducedMotionDecorator;
