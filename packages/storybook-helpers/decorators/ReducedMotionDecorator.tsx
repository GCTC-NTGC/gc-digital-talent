import React from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import isChromatic from "chromatic/isChromatic";
import { StoryFn } from "@storybook/react";

const ReducedMotionDecorator = (Story: StoryFn) => (
  <LazyMotion features={domAnimation}>
    <MotionConfig reducedMotion={isChromatic() ? "always" : "user"}>
      <Story />
    </MotionConfig>
  </LazyMotion>
);

export default ReducedMotionDecorator;
